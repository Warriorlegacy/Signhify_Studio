DROP POLICY IF EXISTS "creators_delete_own_listings" ON public.marketplace_listings;
CREATE POLICY "creators_delete_own_listings"
ON public.marketplace_listings
FOR DELETE
TO authenticated
USING (
  creator_id = auth.uid()
  AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
);
GRANT DELETE ON public.marketplace_listings TO authenticated;

CREATE TABLE IF NOT EXISTS public.credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id text NOT NULL,
  credits integer NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  stripe_session_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_purchases TO authenticated;
GRANT ALL ON public.credit_purchases TO service_role;
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "credit_purchases_select_own" ON public.credit_purchases;
CREATE POLICY "credit_purchases_select_own"
ON public.credit_purchases
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
);