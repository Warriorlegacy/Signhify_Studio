
-- 1) builder_projects: add owner column + owner-scoped RLS
ALTER TABLE public.builder_projects
  ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL;

DROP POLICY IF EXISTS builder_projects_insert ON public.builder_projects;
DROP POLICY IF EXISTS builder_projects_select ON public.builder_projects;
DROP POLICY IF EXISTS builder_projects_update ON public.builder_projects;

CREATE POLICY builder_projects_select_own ON public.builder_projects
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY builder_projects_insert_own ON public.builder_projects
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY builder_projects_update_own ON public.builder_projects
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY builder_projects_delete_own ON public.builder_projects
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 2) leads: explicit RESTRICTIVE deny on SELECT for anon/authenticated
CREATE POLICY leads_deny_select ON public.leads
  AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false);

-- 3) waitlist: explicit RESTRICTIVE deny on SELECT
CREATE POLICY waitlist_deny_select ON public.waitlist
  AS RESTRICTIVE FOR SELECT TO anon, authenticated USING (false);

-- 4) rate_limits: explicit RESTRICTIVE deny for anon/authenticated
CREATE POLICY rate_limits_deny_all ON public.rate_limits
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- 5) marketplace_listings.asset_path: revoke column-level SELECT from public roles
REVOKE SELECT (asset_path) ON public.marketplace_listings FROM anon, authenticated;

-- 6) video_jobs: tighten role from public to authenticated (eliminates anon-applicable policy)
DROP POLICY IF EXISTS users_own_video_jobs ON public.video_jobs;
CREATE POLICY users_own_video_jobs ON public.video_jobs
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
