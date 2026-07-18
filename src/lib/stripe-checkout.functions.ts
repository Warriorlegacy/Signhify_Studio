import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import logger from "./logger";

async function stripeFetch(path: string, body?: URLSearchParams, method = "POST") {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    logger.error("Missing STRIPE_SECRET_KEY.");
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }
  try {
    const res = await fetch(`https://api.stripe.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        ...(body ? { "content-type": "application/x-www-form-urlencoded" } : {}),
      },
      body,
    });
    const json = await res.json();
    if (!res.ok) {
      logger.error(`Stripe request failed: ${json?.error?.message ?? "Unknown error"}`);
      throw new Error(json?.error?.message ?? "Stripe request failed.");
    }
    return json;
  } catch (error) {
    logger.error(`Stripe fetch error: ${error}`);
    throw error;
  }
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ listingId: String((input as any)?.listingId ?? "") }))
  .handler(async ({ data, context }) => {
    try {
      const { userId } = context;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: listing } = await (supabaseAdmin.from as any)("marketplace_listings")
        .select("id,title,price_cents")
        .eq("id", data.listingId)
        .maybeSingle();
      if (!listing || !listing.price_cents || listing.price_cents <= 0)
        throw new Error("Paid listing not found.");
      const site = process.env.VITE_SITE_URL || "https://signhify.dpdns.org";
      const form = new URLSearchParams();
      form.set("mode", "payment");
      form.set(
        "success_url",
        `${site}/marketplace/success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}`,
      );
      form.set("cancel_url", `${site}/marketplace`);
      form.set("client_reference_id", userId);
      form.set("metadata[listing_id]", listing.id);
      form.set("metadata[user_id]", userId);
      form.set("line_items[0][quantity]", "1");
      form.set("line_items[0][price_data][currency]", "usd");
      form.set("line_items[0][price_data][unit_amount]", String(listing.price_cents));
      form.set("line_items[0][price_data][product_data][name]", listing.title);
      const session = await stripeFetch("/checkout/sessions", form);
      logger.info(`Created checkout session for listing ${listing.id} user ${userId}`);
      return { url: session.url as string };
    } catch (error) {
      logger.error(`Failed to create checkout session: ${error}`);
      throw error;
    }
  });

export const verifyCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ({ sessionId: String((input as any)?.sessionId ?? "") }))
  .handler(async ({ data }) => {
    try {
      if (!data.sessionId) throw new Error("Missing session_id.");
      const session = await stripeFetch(
        `/checkout/sessions/${encodeURIComponent(data.sessionId)}`,
        undefined,
        "GET",
      );
      logger.info(`Verified checkout session: ${data.sessionId}`);
      return {
        paid: session.payment_status === "paid",
        paymentStatus: session.payment_status as string,
      };
    } catch (error) {
      logger.error(`Failed to verify checkout session: ${error}`);
      throw error;
    }
  });
