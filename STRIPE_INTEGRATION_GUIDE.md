# Stripe Integration Guide — Signhify

> **Status**: Production-ready  
> **Last updated**: 2026-06-25  

---

## Overview

Signhify uses Stripe for all payment processing:

| Feature | Payment Type | Mode |
|---------|-------------|-------|
| Marketplace purchases | One-time | `payment` |
| Studio subscription | Recurring monthly | `subscription` |
| Scale subscription | Recurring monthly | `subscription` |
| Credit packs | One-time | `payment` |
| Billing portal | Customer self-service | — |
| Event processing | Async webhooks | `POST /api/stripe/webhook` |

---

## Architecture

```
Browser / Client
       │
       ▼
TanStack Start Server Functions ──── direct Stripe API ──▶  Stripe
  stripe-checkout.functions.ts                               │
  stripe-subscribe.functions.ts                              │
  stripe-portal.functions.ts                         webhook events
                                                             │
                                                             ▼
                                          /api/stripe/webhook (signature verified)
                                                       │
                                                       ▼
                                                  Supabase DB
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | ✅ | Server-only secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Webhook signing secret (`whsec_...`) |
| `VITE_SITE_URL` | ✅ | Production base URL for redirects |
| `STRIPE_STUDIO_PRICE_ID` | ✅ | Studio monthly recurring price ID |
| `STRIPE_SCALE_PRICE_ID` | ✅ | Scale monthly recurring price ID |
| `STRIPE_CREDIT_PACK_PRICE_ID` | ✅ | Credit pack one-time price ID |

### `.env.local` for development

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_SITE_URL=http://localhost:5173
STRIPE_STUDIO_PRICE_ID=price_test_studio_monthly
STRIPE_SCALE_PRICE_ID=price_test_scale_monthly
STRIPE_CREDIT_PACK_PRICE_ID=price_test_credit_pack
```

---

## Stripe Dashboard Setup

### 1. Create Products & Prices

| Product | Price | Type |
|---------|-------|------|
| Signhify Studio | $29/mo | Recurring |
| Signhify Scale | $99/mo | Recurring |
| Credit Pack 100 | $9.00 | One-time |

Copy each `price_1ABC...` ID into your environment variables.

### 2. Configure Webhooks

**Developers → Webhooks → Add endpoint**

URL: `https://signhify.online/api/stripe/webhook`

Events to subscribe:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`.

### 3. Customer Portal

**Settings → Billing → Customer portal**:
- Allow cancel / switch plans
- Show invoices
- Add business logo + support email

---

## Server Functions Reference

### `createCheckoutSession` — Marketplace Purchase

```typescript
import { createCheckoutSession } from "@/lib/stripe-checkout.functions";

const { url } = await createCheckoutSession({ data: { listingId: "uuid" } });
window.location.href = url;
```

Flow: Fetch listing from Supabase → create `payment` mode Checkout Session → redirect to Stripe.

### `verifyCheckoutSession` — Confirm Payment

```typescript
import { verifyCheckoutSession } from "@/lib/stripe-checkout.functions";

const { paid, paymentStatus } = await verifyCheckoutSession({ data: { sessionId: "cs_..." } });
```

Call this on `/marketplace/success?session_id=...` to confirm the payment before granting access.

### `createSubscription` — Plans & Credit Packs

Requires authenticated user (Supabase JWT middleware).

```typescript
import { createSubscription } from "@/lib/stripe-subscribe.functions";

const { url } = await createSubscription({ data: { priceId: "price_1ABC..." } });
window.location.href = url;
```

Only allows price IDs from the `STRIPE_PRICE_IDS` allowlist — prevents price injection attacks.

### `createPortalSession` — Billing Management

Requires authenticated user.

```typescript
import { createPortalSession } from "@/lib/stripe-portal.functions";

const { url } = await createPortalSession({});
window.open(url, "_blank");
```

Auto-creates a Stripe customer if none exists for the user's email.

---

## Webhook Handler

**File**: `src/routes/api/stripe/webhook.ts`  
**Endpoint**: `POST /api/stripe/webhook`

### Security Implementation

- **HMAC-SHA256 signature verification** on every request
- **5-minute timestamp tolerance** — rejects replayed events
- Returns **HTTP 500** on handler errors so Stripe retries delivery

### Event Handlers

| Event | Handler | TODO Action |
|-------|---------|-------------|
| `checkout.session.completed` | `handleCheckoutCompleted` | Insert `marketplace_purchases` row |
| `customer.subscription.created` | `handleSubscriptionCreated` | Upsert `user_subscriptions` row |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Update plan tier |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Set status = `canceled` |
| `invoice.paid` | `handleInvoicePaid` | Extend `current_period_end` |
| `invoice.payment_failed` | `handleInvoicePaymentFailed` | Notify user, start dunning |

### Completing the Supabase Wiring

```typescript
// handleCheckoutCompleted
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
await supabaseAdmin.from("marketplace_purchases").insert({
  stripe_session_id: session.id,
  listing_id: listingId,
  stripe_customer_id: session.customer,
  paid_at: new Date().toISOString(),
});

// handleSubscriptionCreated
const planTier = priceId === process.env.STRIPE_STUDIO_PRICE_ID ? "studio" : "scale";
await supabaseAdmin.from("user_subscriptions").upsert({
  stripe_customer_id: sub.customer,
  stripe_subscription_id: sub.id,
  plan_tier: planTier,
  status: sub.status,
  current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
}, { onConflict: "stripe_customer_id" });
```

### Local Webhook Testing

```bash
# Install Stripe CLI
winget install Stripe.StripeCLI

# Login
stripe login

# Forward to local dev server
stripe listen --forward-to http://localhost:5173/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
```

---

## Frontend Integration

### Pricing Page → Upgrade

```typescript
import { createSubscription } from "@/lib/stripe-subscribe.functions";
import { toast } from "sonner";

async function handleUpgrade(priceId: string) {
  try {
    const { url } = await createSubscription({ data: { priceId } });
    window.location.href = url;
  } catch {
    toast.error("Failed to start checkout. Please try again.");
  }
}
```

### Marketplace → Buy Now

```typescript
import { createCheckoutSession } from "@/lib/stripe-checkout.functions";

const { url } = await createCheckoutSession({ data: { listingId } });
window.location.href = url;
```

### Success Page — Verify Purchase

```typescript
// Read session_id from URL query param
const sessionId = new URLSearchParams(location.search).get("session_id");
const { paid } = await verifyCheckoutSession({ data: { sessionId } });
```

---

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| Secret key exposure | Server functions only — never in client bundle |
| Webhook spoofing | HMAC-SHA256 verification (no SDK needed) |
| Replay attacks | 5-minute timestamp window |
| Price injection | `createSubscription` validates against allowlist |
| Error leakage | Internal errors logged via Pino; generic messages to client |
| Missing env vars | Explicit early-throw checks |

---

## Test Cards

| Card | Scenario |
|------|---------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | 3D Secure required |
| `4000 0000 0000 9995` | Card declined |

Any future expiry + any 3-digit CVC.

---

## Production Readiness Checklist

### Environment
- [ ] `STRIPE_SECRET_KEY` = live key (`sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` = from Dashboard (`whsec_...`)
- [ ] `VITE_SITE_URL` = `https://signhify.online`
- [ ] All 3 Price IDs = live price IDs

### Stripe Dashboard
- [ ] Webhook endpoint registered at `https://signhify.online/api/stripe/webhook`
- [ ] All 6 event types selected
- [ ] Customer Portal configured
- [ ] One test transaction verified in live mode (refund after)

### Code
- [ ] Webhook TODO handlers wired to Supabase tables
- [ ] Error toasts on all checkout buttons
- [ ] Success/cancel URLs correct for production domain

### Security
- [ ] `.env.local` not committed (check `.gitignore`)
- [ ] No Stripe keys in client-side bundle

### Monitoring
- [ ] Stripe Dashboard alerts enabled (payment failures, disputes)
- [ ] Sentry capturing Stripe function errors
- [ ] Pino logs flowing to log aggregator

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing STRIPE_SECRET_KEY` | Set env var in Vercel/Netlify dashboard |
| Webhook 400 "Invalid signature" | `STRIPE_WEBHOOK_SECRET` must be `whsec_...` from webhook settings, not the API key |
| Webhook 400 "Timestamp tolerance" | Sync server clock (NTP). Should not occur on Cloudflare Workers |
| Checkout URL is `null` | Listing must have non-zero `price_cents` in Supabase |
| "Unknown price" error | Verify Price IDs in env match active prices in Stripe Dashboard |
| Portal error | Check server logs for customer lookup failure |

---

## Monitoring

### Stripe Alerts
**Developers → Alerts**: enable dispute rate > 1%, decline rate > 5%, failed webhooks.

### Log Queries
```
# All webhook events
[stripe/webhook]

# Handler errors (Stripe will retry)
[stripe/webhook] Handler error

# Payment failures
invoice.payment_failed
```

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/stripe-checkout.functions.ts` | Marketplace checkout + verification |
| `src/lib/stripe-subscribe.functions.ts` | Subscription + credit pack checkout |
| `src/lib/stripe-portal.functions.ts` | Customer billing portal |
| `src/lib/stripe-prices.server.ts` | Price ID allowlist |
| `src/routes/api/stripe/webhook.ts` | **Webhook event handler (NEW)** |
| `src/lib/logger.ts` | Pino structured logger |
