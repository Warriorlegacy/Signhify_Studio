-- Restrict marketplace_listings so anon/authenticated users cannot read sensitive columns.
-- asset_path should only be served after a verified purchase (via downloadAsset server fn).
-- stripe_connect_account_id is creator-private/account-level data.

-- 1) Remove broad SELECT from public roles
REVOKE SELECT ON public.marketplace_listings FROM anon, authenticated;

-- 2) Grant SELECT only on columns safe for public/creator browsing
GRANT SELECT (id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, search_vector, is_active) ON public.marketplace_listings TO anon, authenticated;

-- 3) Keep write privileges for authenticated creators
GRANT INSERT, UPDATE, DELETE ON public.marketplace_listings TO authenticated;

-- 4) Ensure service_role retains full access
GRANT ALL ON public.marketplace_listings TO service_role;