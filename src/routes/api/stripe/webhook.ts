import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin as _supabaseAdmin } from "@/integrations/supabase/client.server";
import { STRIPE_PRICE_IDS } from "@/lib/stripe-prices.server";
import logger from "@/lib/logger";

// Cast to any: this webhook writes to extended tables/columns (marketplace_purchases,
// profiles.stripe_customer_id, subscription_plan, etc.) that aren't yet reflected
// in the generated Database types.
const supabaseAdmin: any = _supabaseAdmin;

// ─── Price-to-plan mapping ───────────────────────────────────────────────────
type PlanTier = "free" | "studio" | "scale";

function priceIdToPlan(priceId: string | undefined | null): PlanTier {
  if (!priceId) return "free";
  if (priceId === STRIPE_PRICE_IDS.studioMonthly) return "studio";
  if (priceId === STRIPE_PRICE_IDS.scaleMonthly) return "scale";
  return "free";
}

// ─── Stripe signature verification (no SDK needed) ───────────────────────────
// Manually verify Stripe-Signature header using HMAC-SHA256 so we stay
// dependency-light and edge-compatible.
async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts: Record<string, string> = {};
    for (const part of signatureHeader.split(",")) {
      const [k, v] = part.split("=");
      parts[k] = v;
    }
    const timestamp = parts["t"];
    const v1 = parts["v1"];
    if (!timestamp || !v1) return false;

    // Reject events older than 5 minutes (replay attack protection)
    const TOLERANCE_SECONDS = 300;
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
      logger.warn("[stripe/webhook] Timestamp tolerance exceeded — possible replay attack.");
      return false;
    }

    const signedPayload = `${timestamp}.${rawBody}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expected === v1;
  } catch (err) {
    logger.error(`[stripe/webhook] Signature verification error: ${err}`);
    return false;
  }
}

// ─── Event handlers ──────────────────────────────────────────────────────────

async function handleCheckoutCompleted(event: any) {
  const session = event.data.object;
  logger.info(`[stripe/webhook] checkout.session.completed: ${session.id}`);

  // Marketplace purchase: grant download access to buyer
  const listingId = session.metadata?.listing_id;
  const userId = session.client_reference_id;

  if (listingId && userId) {
    const { error } = await supabaseAdmin.from("marketplace_purchases").insert({
      listing_id: listingId,
      user_id: userId,
      stripe_session_id: session.id,
      purchased_at: new Date().toISOString(),
    });

    if (error) {
      logger.error(`[stripe/webhook] Failed to record marketplace purchase: ${error.message}`);
    } else {
      logger.info(
        `[stripe/webhook] Marketplace purchase recorded: listing=${listingId} user=${userId}`,
      );
    }

    // Marketplace payout: if this was a creator sale, record the commission
    const creatorId = session.metadata?.creator_id;
    const connectAccountId = session.metadata?.connect_account_id;
    if (creatorId && connectAccountId) {
      const grossCents = session.amount_total ?? session.amount_subtotal ?? 0;
      const commissionCents = parseInt(session.metadata?.commission_cents || "0", 10);
      const netCents = parseInt(session.metadata?.net_cents || "0", 10);

      const { error: payoutErr } = await supabaseAdmin.from("creator_payouts").insert({
        creator_id: creatorId,
        listing_id: listingId,
        stripe_session_id: session.id,
        gross_amount_cents: grossCents,
        commission_cents: commissionCents,
        net_amount_cents: netCents || grossCents - commissionCents,
        status: "pending",
      });

      if (payoutErr) {
        logger.error(`[stripe/webhook] Failed to record payout: ${payoutErr.message}`);
      } else {
        logger.info(`[stripe/webhook] Payout recorded: creator=${creatorId} net=${netCents}`);
      }
    }
  }

  // Credit pack purchase
  if (session.metadata?.type === "credit_pack" && session.client_reference_id) {
    const credits = Number(session.metadata.credits) || 10;
    const userId = session.client_reference_id;

    const { error } = await supabaseAdmin.rpc("add_credits" as any, {
      p_user_id: userId,
      p_amount: credits,
    });

    if (error) {
      logger.error(`[stripe/webhook] Failed to add credits: ${error.message}`);
    } else {
      logger.info(`[stripe/webhook] Credits added: ${credits} for user=${userId}`);
    }
  }
}

async function handleSubscriptionCreated(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.created: ${subscription.id}`);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceIdToPlan(priceId);

  // Find user by Stripe customer ID
  const { data: profile, error: lookupError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (lookupError || !profile) {
    logger.error(
      `[stripe/webhook] No profile found for customer ${customerId}: ${lookupError?.message}`,
    );
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      subscription_current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    logger.error(`[stripe/webhook] Failed to provision subscription: ${error.message}`);
  } else {
    logger.info(
      `[stripe/webhook] Subscription provisioned: user=${profile.id} plan=${plan} status=${subscription.status}`,
    );
  }
}

async function handleSubscriptionUpdated(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.updated: ${subscription.id}`);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceIdToPlan(priceId);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) {
    logger.error(`[stripe/webhook] No profile found for customer ${customerId}`);
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      subscription_current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    logger.error(`[stripe/webhook] Failed to update subscription: ${error.message}`);
  } else {
    logger.info(
      `[stripe/webhook] Subscription updated: user=${profile.id} plan=${plan} status=${subscription.status}`,
    );
  }
}

async function handleSubscriptionDeleted(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.deleted: ${subscription.id}`);

  const customerId = subscription.customer as string;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) {
    logger.error(`[stripe/webhook] No profile found for customer ${customerId}`);
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_plan: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
    })
    .eq("id", profile.id);

  if (error) {
    logger.error(`[stripe/webhook] Failed to revoke subscription: ${error.message}`);
  } else {
    logger.info(`[stripe/webhook] Subscription revoked: user=${profile.id} → free`);
  }
}

async function handleInvoicePaymentFailed(event: any) {
  const invoice = event.data.object;
  logger.warn(`[stripe/webhook] invoice.payment_failed for customer: ${invoice.customer}`);

  const customerId = invoice.customer as string;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (profile) {
    await supabaseAdmin
      .from("profiles")
      .update({ subscription_status: "past_due" })
      .eq("id", profile.id);

    logger.info(`[stripe/webhook] Marked subscription as past_due: user=${profile.id}`);
  }
}

async function handleInvoicePaid(event: any) {
  const invoice = event.data.object;
  logger.info(`[stripe/webhook] invoice.paid: ${invoice.id}`);

  const customerId = invoice.customer as string;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (profile) {
    await supabaseAdmin
      .from("profiles")
      .update({ subscription_status: "active" })
      .eq("id", profile.id);

    logger.info(`[stripe/webhook] Subscription reactivated: user=${profile.id}`);
  }
}

// ─── Route ───────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          logger.error("[stripe/webhook] Missing STRIPE_WEBHOOK_SECRET env var.");
          return new Response("Server misconfiguration", { status: 500 });
        }

        const signatureHeader = request.headers.get("stripe-signature");
        if (!signatureHeader) {
          logger.warn("[stripe/webhook] Missing stripe-signature header.");
          return new Response("Missing signature", { status: 400 });
        }

        const rawBody = await request.text();

        const valid = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret);
        if (!valid) {
          logger.warn("[stripe/webhook] Invalid signature — request rejected.");
          return new Response("Invalid signature", { status: 400 });
        }

        let event: any;
        try {
          event = JSON.parse(rawBody);
        } catch {
          logger.error("[stripe/webhook] Failed to parse event JSON.");
          return new Response("Invalid JSON", { status: 400 });
        }

        logger.info(`[stripe/webhook] Received event: ${event.type} (${event.id})`);

        // ── Dispatch ────────────────────────────────────────────────────────
        try {
          switch (event.type) {
            case "checkout.session.completed":
              await handleCheckoutCompleted(event);
              break;
            case "customer.subscription.created":
              await handleSubscriptionCreated(event);
              break;
            case "customer.subscription.updated":
              await handleSubscriptionUpdated(event);
              break;
            case "customer.subscription.deleted":
              await handleSubscriptionDeleted(event);
              break;
            case "invoice.paid":
              await handleInvoicePaid(event);
              break;
            case "invoice.payment_failed":
              await handleInvoicePaymentFailed(event);
              break;
            default:
              logger.info(`[stripe/webhook] Unhandled event type: ${event.type}`);
          }
        } catch (err) {
          logger.error(`[stripe/webhook] Handler error for ${event.type}: ${err}`);
          // Return 500 so Stripe retries delivery
          return new Response("Handler error", { status: 500 });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
