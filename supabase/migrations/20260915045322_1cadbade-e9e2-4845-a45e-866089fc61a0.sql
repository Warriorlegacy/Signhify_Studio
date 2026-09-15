CREATE TABLE IF NOT EXISTS public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_inr numeric NOT NULL CHECK (amount_inr > 0),
  upi_id text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

GRANT SELECT, INSERT ON public.payout_requests TO authenticated;
GRANT ALL ON public.payout_requests TO service_role;

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creators_view_own_payout_requests"
ON public.payout_requests FOR SELECT TO authenticated
USING (auth.uid() = creator_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE POLICY "creators_create_own_payout_requests"
ON public.payout_requests FOR INSERT TO authenticated
WITH CHECK (auth.uid() = creator_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);

CREATE INDEX IF NOT EXISTS payout_requests_creator_idx ON public.payout_requests (creator_id, created_at DESC);