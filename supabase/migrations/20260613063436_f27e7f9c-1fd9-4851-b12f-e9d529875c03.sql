-- Lock down creator_waitlist SELECT: explicit deny-all for anon/authenticated.
-- Service-role and edge functions retain access (bypass RLS).
DROP POLICY IF EXISTS "Deny all selects on creator_waitlist" ON public.creator_waitlist;
CREATE POLICY "Deny all selects on creator_waitlist"
  ON public.creator_waitlist
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);

-- Marketplace listings are public-readable, but asset_path is internal-only
-- (it can hold storage paths for paid/protected files). Restrict SELECT
-- to safe public columns via a column-level grant.
REVOKE SELECT ON public.marketplace_listings FROM anon, authenticated;
GRANT SELECT (
  id,
  slug,
  title,
  description,
  category,
  price_cents,
  preview_url,
  creator_id,
  created_at,
  search_vector
) ON public.marketplace_listings TO anon, authenticated;
GRANT ALL ON public.marketplace_listings TO service_role;