ALTER TABLE public.listing_reviews ADD COLUMN listing_slug text;
UPDATE public.listing_reviews r
  SET listing_slug = l.slug
  FROM public.marketplace_listings l
  WHERE l.id = r.listing_id;
DELETE FROM public.listing_reviews WHERE listing_slug IS NULL;
ALTER TABLE public.listing_reviews ALTER COLUMN listing_slug SET NOT NULL;
ALTER TABLE public.listing_reviews ALTER COLUMN listing_id DROP NOT NULL;
ALTER TABLE public.listing_reviews DROP CONSTRAINT IF EXISTS listing_reviews_listing_id_user_id_key;
ALTER TABLE public.listing_reviews ADD CONSTRAINT listing_reviews_slug_user_key UNIQUE (listing_slug, user_id);
CREATE INDEX IF NOT EXISTS listing_reviews_slug_idx ON public.listing_reviews(listing_slug);