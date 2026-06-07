import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createPortalSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY.");
  const site = process.env.VITE_SITE_URL || "https://signhify.online";
  const email = (context as any)?.claims?.email;
  const customers = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email ?? "")}&limit=1`, { headers: { authorization: `Bearer ${key}` } }).then((r) => r.json());
  let customer = customers?.data?.[0]?.id;
  if (!customer) {
    const body = new URLSearchParams(); if (email) body.set("email", email);
    const created = await fetch("https://api.stripe.com/v1/customers", { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" }, body }).then((r) => r.json());
    customer = created.id;
  }
  const body = new URLSearchParams(); body.set("customer", customer); body.set("return_url", `${site}/app/settings`);
  const session = await fetch("https://api.stripe.com/v1/billing_portal/sessions", { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" }, body }).then((r) => r.json());
  return { url: session.url as string };
});
