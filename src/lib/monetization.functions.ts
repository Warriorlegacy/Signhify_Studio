import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import Stripe from "stripe";
import { STRIPE_PRICE_IDS } from "./stripe-prices.server";

type PlanKey = "studio" | "scale";

function normalizePlan(input: string): PlanKey {
  const p = input.toLowerCase();
  if (p === "scale") return "scale";
  // "pro" is a legacy alias for the Studio plan in the billing UI.
  if (p === "studio" || p === "pro") return "studio";
  throw new Error(`Unknown subscription plan: ${input}`);
}

function planToPriceId(plan: PlanKey): string {
  return plan === "scale" ? STRIPE_PRICE_IDS.scaleMonthly : STRIPE_PRICE_IDS.studioMonthly;
}

export const getUserCredits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // user_credits table is optional; return defaults when missing
    const { data: creditsData, error } = await (supabase as any)
      .from("user_credits")
      .select("tier, credits_remaining, max_credits, projects_count, videos_generated")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !creditsData) {
      return {
        tier: "free" as const,
        creditsRemaining: 2,
        maxCredits: 2,
        projectsCount: 0,
        videosGenerated: 0,
      };
    }

    return {
      tier: creditsData.tier as string,
      creditsRemaining: creditsData.credits_remaining as number,
      maxCredits: creditsData.max_credits as number,
      projectsCount: creditsData.projects_count as number,
      videosGenerated: creditsData.videos_generated as number,
    };
  });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const raw = input as Record<string, unknown>;
    const plan = raw?.plan;
    const priceId = raw?.priceId;
    if (plan && typeof plan === "string") return { plan: plan.trim() };
    if (priceId && typeof priceId === "string") return { priceId: priceId.trim() };
    throw new Error("Plan or priceId is required");
  })
  .handler(async ({ context, data }) => {
    const { userId, supabase } = context;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return {
        success: true as const,
        url: "https://checkout.stripe.com/c/pay/mock_session_id" as string | null,
      };
    }

    try {
      const stripe = new Stripe(stripeKey);
      const isSubscription = "plan" in data;
      const { SITE_URL: site } = await import("@/lib/site-url");

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: isSubscription ? "subscription" : "payment",
        success_url: `${site}/app/billing?success=true`,
        cancel_url: `${site}/app/billing?canceled=true`,
        client_reference_id: userId,
        metadata: {
          user_id: userId,
        },
      };

      if (isSubscription) {
        const plan = normalizePlan((data as { plan: string }).plan);
        const priceId = planToPriceId(plan);

        // Find or create a Stripe customer for this user, and persist the id on
        // their profile so subscription webhooks can look them up.
        const { data: profile } = await (supabase as any)
          .from("profiles")
          .select("stripe_customer_id")
          .eq("id", userId)
          .maybeSingle();

        let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

        if (!customerId) {
          const { data: userRes } = await supabase.auth.getUser();
          const email = userRes?.user?.email;
          const customer = await stripe.customers.create({
            email: email ?? undefined,
            metadata: { user_id: userId },
          });
          customerId = customer.id;
          await (supabase as any)
            .from("profiles")
            .update({ stripe_customer_id: customerId } as any)
            .eq("id", userId);
        }

        sessionParams.customer = customerId;
        sessionParams.line_items = [{ price: priceId, quantity: 1 }];
        (sessionParams.metadata as Record<string, string>).plan = plan;
      } else {
        const priceId = (data as { priceId: string }).priceId;
        sessionParams.line_items = [{ price: priceId, quantity: 1 }];
        const meta = sessionParams.metadata as Record<string, string>;
        meta.type = "credit_pack";
        meta.priceId = priceId;
        const CREDIT_PACK_MAP: Record<string, number> = {
          [STRIPE_PRICE_IDS.creditPack]: 10,
          ["price_test_signhify_credit_pack_50"]: 50,
          ["price_test_signhify_credit_pack_200"]: 200,
        };
        meta.credits = String(CREDIT_PACK_MAP[priceId] ?? 10);
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      return { success: true as const, url: session.url };
    } catch (err) {
      console.error("Stripe error:", err);
      throw new Error("Failed to create Stripe session.");
    }
  });
