import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function stripe(path: string, body: URLSearchParams) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY.");
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Stripe request failed.");
  return json;
}

export const createSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ priceId: String((input as any)?.priceId ?? "") }))
  .handler(async ({ data, context }) => {
    const { STRIPE_PRICE_IDS } = await import("./stripe-prices.server");
    const allowed = new Set(Object.values(STRIPE_PRICE_IDS));
    if (!allowed.has(data.priceId)) throw new Error("Unknown price.");
    const site = process.env.VITE_SITE_URL || "https://signhify.online";
    const form = new URLSearchParams();
    form.set("mode", data.priceId.includes("credit") ? "payment" : "subscription");
    form.set("success_url", `${site}/app/settings?billing=success`);
    form.set("cancel_url", `${site}/pricing`);
    form.set("line_items[0][quantity]", "1");
    form.set("line_items[0][price]", data.priceId);
    const email = (context as any)?.claims?.email;
    if (email) form.set("customer_email", email);
    const session = await stripe("/checkout/sessions", form);
    return { url: session.url as string };
  });
