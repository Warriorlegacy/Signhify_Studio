REVOKE SELECT ON public.marketplace_listings FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.marketplace_listings FROM anon;
GRANT SELECT (id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, search_vector) ON public.marketplace_listings TO anon, authenticated;
GRANT ALL ON public.marketplace_listings TO service_role;