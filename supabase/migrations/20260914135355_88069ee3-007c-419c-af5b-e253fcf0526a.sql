DROP POLICY IF EXISTS "reviews_public_read" ON public.listing_reviews;
DROP POLICY IF EXISTS "reviews_update_own" ON public.listing_reviews;
DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.listing_reviews;

CREATE POLICY "reviews_public_read" ON public.listing_reviews
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "reviews_update_own" ON public.listing_reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (auth.uid() = user_id AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

CREATE POLICY "reviews_delete_own_or_admin" ON public.listing_reviews
  FOR DELETE TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND (
      auth.uid() = user_id
      OR lower(coalesce(auth.jwt() ->> 'email', '')) IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
    )
  );