import { createFileRoute } from "@tanstack/react-router";
import logger from "@/lib/logger";

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

  // TODO: Update order status in Supabase after confirmed payment.
  // Example:
  // const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // await supabaseAdmin.from("orders").update({ status: "paid" }).eq("stripe_session_id", session.id);
  //
  // For marketplace: grant download access to buyer
  // const listingId = session.metadata?.listing_id;
  // const userId = session.client_reference_id;
  // if (listingId && userId) {
  //   await supabaseAdmin.from("marketplace_purchases").insert({ listing_id: listingId, user_id: userId });
  // }
}

async function handleSubscriptionCreated(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.created: ${subscription.id}`);

  // TODO: Provision plan in Supabase.
  // const customerId = subscription.customer;
  // const priceId = subscription.items.data[0]?.price?.id;
  // Map priceId → plan tier and update user record.
}

async function handleSubscriptionUpdated(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.updated: ${subscription.id}`);
  // TODO: Handle plan upgrades / downgrades.
}

async function handleSubscriptionDeleted(event: any) {
  const subscription = event.data.object;
  logger.info(`[stripe/webhook] customer.subscription.deleted: ${subscription.id}`);
  // TODO: Revoke plan access in Supabase.
}

async function handleInvoicePaymentFailed(event: any) {
  const invoice = event.data.object;
  logger.warn(`[stripe/webhook] invoice.payment_failed for customer: ${invoice.customer}`);
  // TODO: Notify user via email / in-app notification.
  // Consider downgrading to free tier after N failures.
}

async function handleInvoicePaid(event: any) {
  const invoice = event.data.object;
  logger.info(`[stripe/webhook] invoice.paid: ${invoice.id}`);
  // TODO: Renew subscription period access in Supabase.
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
