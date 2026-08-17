GRANT INSERT, UPDATE ON public.marketplace_listings TO authenticated;

CREATE POLICY "creators_insert_own_listings"
ON public.marketplace_listings
FOR INSERT TO authenticated
WITH CHECK (
  creator_id = auth.uid()
  AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
);

CREATE POLICY "creators_update_own_listings"
ON public.marketplace_listings
FOR UPDATE TO authenticated
USING (
  creator_id = auth.uid()
  AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
)
WITH CHECK (
  creator_id = auth.uid()
  AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
);

CREATE POLICY "creators_select_own_listings"
ON public.marketplace_listings
FOR SELECT TO authenticated
USING (
  creator_id = auth.uid()
  AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
);