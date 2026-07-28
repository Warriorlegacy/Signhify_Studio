import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import Stripe from "stripe";
import logger from "./logger";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    logger.error("Missing STRIPE_SECRET_KEY.");
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }
  return new Stripe(key);
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ listingId: String((input as any)?.listingId ?? "") }))
  .handler(async ({ data, context }) => {
    try {
      const { userId } = context;
      const stripe = getStripe();
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: listing } = await (supabaseAdmin.from as any)("marketplace_listings")
        .select("id,title,price_cents,stripe_connect_account_id,creator_id")
        .eq("id", data.listingId)
        .maybeSingle();
      if (!listing || !listing.price_cents || listing.price_cents <= 0)
        throw new Error("Paid listing not found.");
      const { SITE_URL: site } = await import("@/lib/site-url");

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        success_url: `${site}/marketplace/success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}`,
        cancel_url: `${site}/marketplace`,
        client_reference_id: userId,
        metadata: {
          listing_id: listing.id,
          user_id: userId,
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: listing.price_cents,
              product_data: { name: listing.title },
            },
          },
        ],
      };

      // If the listing has a creator with Stripe Connect, add automatic transfer
      if (listing.stripe_connect_account_id && listing.creator_id) {
        const fee = Math.round(listing.price_cents * 0.15); // 15% commission
        sessionParams.payment_intent_data = {
          transfer_data: {
            destination: listing.stripe_connect_account_id,
          },
        };
        sessionParams.metadata = {
          ...sessionParams.metadata,
          creator_id: listing.creator_id,
          connect_account_id: listing.stripe_connect_account_id,
          commission_cents: String(fee),
          net_cents: String(listing.price_cents - fee),
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
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
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
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
