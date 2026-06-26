
-- Fix 1: Exclude asset_path from public-readable columns on marketplace_listings
REVOKE SELECT ON public.marketplace_listings FROM anon, authenticated;
GRANT SELECT (id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, search_vector) ON public.marketplace_listings TO anon, authenticated;

-- Fix 2: Tighten video_jobs policy to exclude anonymous (is_anonymous) sign-ins
DROP POLICY IF EXISTS users_own_video_jobs ON public.video_jobs;
CREATE POLICY users_own_video_jobs ON public.video_jobs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);
