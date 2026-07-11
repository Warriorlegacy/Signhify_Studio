DROP POLICY IF EXISTS "buyers read own purchases" ON public.marketplace_purchases;

CREATE POLICY "buyers read own purchases"
ON public.marketplace_purchases
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS DISTINCT FROM true
);