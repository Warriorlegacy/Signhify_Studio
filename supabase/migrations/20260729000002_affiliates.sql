-- Affiliate / Referral Program tables

CREATE TABLE IF NOT EXISTS public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  commission_rate numeric NOT NULL DEFAULT 0.20,
  total_earned_cents int NOT NULL DEFAULT 0,
  total_paid_cents int NOT NULL DEFAULT 0,
  referrals int NOT NULL DEFAULT 0,
  paypal_email text,
  upi_id text,
  bank_details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS affiliates_code_idx ON public.affiliates(code);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliates_own" ON public.affiliates;
CREATE POLICY "affiliates_own" ON public.affiliates
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id),
  referred_user_id uuid REFERENCES auth.users(id),
  stripe_session_id text,
  commission_cents int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliate_referrals_own" ON public.affiliate_referrals;
CREATE POLICY "affiliate_referrals_own" ON public.affiliate_referrals
  FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

GRANT SELECT ON public.affiliate_referrals TO authenticated;
GRANT ALL ON public.affiliate_referrals TO service_role;