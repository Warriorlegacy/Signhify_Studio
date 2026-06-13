import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import Stripe from "stripe";

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
    const plan = (input as Record<string, unknown>)?.plan;
    if (typeof plan !== "string" || !plan.trim()) throw new Error("Plan is required");
    return { plan: plan.trim() };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { plan } = data;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return {
        success: true as const,
        url: "https://checkout.stripe.com/c/pay/mock_session_id" as string | null,
      };
    }

    try {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Scroll Studio Pro",
                description: "Unlimited AI scroll generation",
              },
              unit_amount: 4900,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/scroll-studio?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/scroll-studio?canceled=true`,
        metadata: {
          user_id: userId,
          plan,
        },
      });

      return { success: true as const, url: session.url };
    } catch (err) {
      console.error("Stripe error:", err);
      throw new Error("Failed to create Stripe session.");
    }
  });
