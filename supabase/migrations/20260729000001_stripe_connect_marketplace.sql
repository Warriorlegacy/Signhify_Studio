-- Stripe Connect + Creator Payouts for Marketplace

-- ── Profiles ───────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS stripe_connect_onboarding_complete boolean DEFAULT false;

-- ── Marketplace listings ───────────────────────────────────────────────
ALTER TABLE public.marketplace_listings
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- ── Creator payouts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.creator_payouts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      uuid NOT NULL REFERENCES auth.users(id),
  listing_id      uuid REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  stripe_session_id text,
  gross_amount_cents  int NOT NULL,
  commission_cents    int NOT NULL,
  net_amount_cents    int NOT NULL,
  status          text NOT NULL DEFAULT 'pending',
  paid_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;

-- Creator can see their own payouts
DROP POLICY IF EXISTS "creator_payouts_own_select" ON public.creator_payouts;
CREATE POLICY "creator_payouts_own_select"
  ON public.creator_payouts FOR SELECT
  USING (creator_id = auth.uid());

-- Service role can insert/update all
GRANT ALL ON public.creator_payouts TO service_role;
GRANT SELECT ON public.creator_payouts TO authenticated;
