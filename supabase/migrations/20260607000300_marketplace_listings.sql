CREATE TABLE public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  price_cents int DEFAULT 0,
  preview_url text,
  asset_path text,
  creator_id uuid,
  created_at timestamptz DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) STORED
);
CREATE INDEX marketplace_listings_search_idx ON public.marketplace_listings USING gin(search_vector);
GRANT SELECT ON public.marketplace_listings TO anon, authenticated;
GRANT ALL ON public.marketplace_listings TO service_role;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "marketplace_public_select" ON public.marketplace_listings FOR SELECT TO anon, authenticated USING (true);
