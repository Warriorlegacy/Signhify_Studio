# Fix: Stripe subscription upgrade + marketplace paid downloads

Both findings share the same root cause chain: the code writes to Supabase columns/tables that don't exist, and the checkout sessions don't carry the identifiers the webhook expects. Fixing them safely needs a schema migration plus coordinated changes to checkout, webhook, and download flows.

## 1. Database migration

Add the columns/tables the webhook already assumes:

```sql
-- profiles: Stripe + subscription fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_plan text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz;

-- marketplace_purchases: proof of paid access
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  stripe_session_id text UNIQUE,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, user_id)
);
GRANT SELECT ON public.marketplace_purchases TO authenticated;
GRANT ALL ON public.marketplace_purchases TO service_role;
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buyers read own purchases" ON public.marketplace_purchases
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
```

## 2. Subscription upgrade (Finding 1)

`src/lib/monetization.functions.ts` → `createCheckoutSession` (subscription branch):
- Look up or create a Stripe customer for the current user.
- Persist `stripe_customer_id` on `profiles` **before** creating the session.
- Map `plan` → fixed price id from `STRIPE_PRICE_IDS` (studio/scale) and pass `line_items: [{ price, quantity: 1 }]` — remove `price_data`.
- Pass `customer: customerId` and `client_reference_id: userId` to `stripe.checkout.sessions.create`.

This makes `priceIdToPlan(priceId)` resolve correctly and the webhook's `profiles.eq('stripe_customer_id', customerId)` lookup succeed.

## 3. Marketplace purchase (Finding 2)

`src/lib/stripe-checkout.functions.ts` → `createCheckoutSession`:
- Require the signed-in user (add `requireSupabaseAuth`).
- Set `metadata[listing_id] = listing.id` and `client_reference_id = userId` on the Stripe session form.

`src/lib/marketplace-download.functions.ts` → `downloadAsset`:
- Add `requireSupabaseAuth`.
- For `price_cents > 0`, check `marketplace_purchases` for a row matching `(listing_id, user_id)` before returning the signed URL. Throw only when no purchase row exists.

`src/routes/marketplace.success.tsx`: unchanged UX, but the download button will now succeed because the webhook writes the purchase row.

## 4. Verification

- `bun run build:dev` clean.
- Manual: upgrade to Studio → billing shows `Studio`, `profiles.subscription_plan = 'studio'`.
- Manual: buy a paid listing → `marketplace_purchases` row exists → success page download works.
- Free listings still download without auth checks changing behavior.
