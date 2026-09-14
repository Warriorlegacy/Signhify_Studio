CREATE TABLE public.listing_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text,
  author_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, user_id)
);

GRANT SELECT ON public.listing_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_reviews TO authenticated;
GRANT ALL ON public.listing_reviews TO service_role;

ALTER TABLE public.listing_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON public.listing_reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_own" ON public.listing_reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

CREATE POLICY "reviews_update_own" ON public.listing_reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own_or_admin" ON public.listing_reviews
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
  );

CREATE TRIGGER listing_reviews_updated_at
  BEFORE UPDATE ON public.listing_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX listing_reviews_listing_idx ON public.listing_reviews(listing_id);