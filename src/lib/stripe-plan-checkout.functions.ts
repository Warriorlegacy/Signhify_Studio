import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CREDIT_PACKS, type CreditPackId } from "./credit-packs";
import logger from "./logger";

/**
 * Server-side plan catalogue. Prices live here (never trusted from the client)
 * so a visitor cannot tamper with the amount that gets charged.
 */
export const PLAN_CATALOG = {
  starter: { name: "Starter Vibe", monthly: 500, annual: 4800, credits: 5 },
  pro: { name: "Pro Builder", monthly: 5000, annual: 48000, credits: 75 },
  scale: { name: "Studio Scale", monthly: 10000, annual: 96000, credits: 125 },
  enterprise: { name: "Enterprise Fleet", monthly: 20000, annual: 192000, credits: 300 },
} as const;

export type PlanId = keyof typeof PLAN_CATALOG;

async function stripeCall(path: string, body: URLSearchParams) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    logger.error("[stripe-plan] Missing STRIPE_SECRET_KEY.");
    throw new Error("Payments are not configured yet. Please try again later.");
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json: any = await res.json();
  if (!res.ok) {
    logger.error(`[stripe-plan] ${path} failed: ${json?.error?.message ?? res.status}`);
    throw new Error(json?.error?.message ?? "Stripe request failed.");
  }
  return json;
}

async function stripeGet(path: string) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Payments are not configured yet. Please try again later.");
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { authorization: `Bearer ${key}` },
  });
  const json: any = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Stripe request failed.");
  return json;
}

/**
 * Creates a Stripe Checkout session for a plan. Recurring subscription billed
 * monthly or yearly, priced from the server-side catalogue.
 */
export const createPlanCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const planId = String(obj.planId ?? "");
    if (!(planId in PLAN_CATALOG)) throw new Error("Unknown plan.");
    return { planId: planId as PlanId, annual: Boolean(obj.annual) };
  })
  .handler(async ({ data, context }) => {
    const plan = PLAN_CATALOG[data.planId];
    const amount = data.annual ? plan.annual : plan.monthly;
    const { SITE_URL: site } = await import("@/lib/site-url");

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set(
      "success_url",
      `${site}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    );
    form.set("cancel_url", `${site}/pricing?checkout=cancelled`);
    form.set("client_reference_id", context.userId as string);
    form.set("metadata[plan_id]", data.planId);
    form.set("metadata[user_id]", context.userId as string);
    form.set("metadata[credits]", String(plan.credits));
    form.set("subscription_data[metadata][plan_id]", data.planId);
    form.set("subscription_data[metadata][user_id]", context.userId as string);
    form.set("line_items[0][quantity]", "1");
    form.set("line_items[0][price_data][currency]", "usd");
    form.set("line_items[0][price_data][unit_amount]", String(amount));
    form.set("line_items[0][price_data][product_data][name]", `Signhify ${plan.name}`);
    form.set(
      "line_items[0][price_data][recurring][interval]",
      data.annual ? "year" : "month",
    );
    const email = (context as any)?.claims?.email;
    if (email) form.set("customer_email", email);

    const session = await stripeCall("/checkout/sessions", form);
    logger.info(`[stripe-plan] checkout session for ${data.planId} user ${context.userId}`);
    return { url: session.url as string };
  });

/**
 * Confirms a returning checkout session and unlocks the plan: marks the
 * profile as subscribed and tops up the AI credits. Idempotent — a session id
 * already recorded in `stripe_events` is never applied twice.
 */
export const confirmPlanCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({
    sessionId: String((input as any)?.sessionId ?? ""),
  }))
  .handler(async ({ data, context }) => {
    if (!data.sessionId) throw new Error("Missing session id.");
    const session = await stripeGet(
      `/checkout/sessions/${encodeURIComponent(data.sessionId)}`,
    );

    const paid = session?.payment_status === "paid";
    const planId = session?.metadata?.plan_id as PlanId | undefined;
    const ownerId = session?.metadata?.user_id ?? session?.client_reference_id;

    if (!paid) return { paid: false, plan: null as string | null };
    if (ownerId && ownerId !== context.userId) {
      throw new Error("This checkout belongs to a different account.");
    }
    if (!planId || !(planId in PLAN_CATALOG)) {
      return { paid: true, plan: null as string | null };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Idempotency guard — one unlock per checkout session.
    const { error: dupeError } = await (supabaseAdmin.from as any)("stripe_events").insert({
      event_id: `checkout_session:${data.sessionId}`,
      type: "checkout.session.completed",
    });
    if (dupeError && String(dupeError.code) === "23505") {
      return { paid: true, plan: planId, alreadyApplied: true };
    }

    await (supabaseAdmin.from as any)("profiles")
      .update({
        subscription_plan: planId,
        subscription_status: "active",
        stripe_customer_id: session?.customer ?? null,
        stripe_subscription_id: session?.subscription ?? null,
      })
      .eq("id", context.userId);

    const credits = PLAN_CATALOG[planId].credits;
    const { error: creditError } = await supabaseAdmin.rpc("add_credits" as any, {
      p_user_id: context.userId,
      p_amount: credits,
    } as any);
    if (creditError) logger.error(`[stripe-plan] add_credits failed: ${creditError.message}`);

    logger.info(`[stripe-plan] unlocked ${planId} for user ${context.userId}`);
    return { paid: true, plan: planId, credits };
  });
