DROP POLICY IF EXISTS affiliates_own ON public.affiliates;
CREATE POLICY affiliates_own ON public.affiliates FOR ALL TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS affiliate_referrals_own ON public.affiliate_referrals;
CREATE POLICY affiliate_referrals_own ON public.affiliate_referrals FOR SELECT TO authenticated
  USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS analytics_owner_select ON public.analytics;
CREATE POLICY analytics_owner_select ON public.analytics FOR SELECT TO authenticated
  USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND EXISTS (SELECT 1 FROM public.user_projects p WHERE p.id = analytics.project_id AND p.user_id = auth.uid()));

DROP POLICY IF EXISTS ai_sessions_insert_own ON public.ai_sessions;
CREATE POLICY ai_sessions_insert_own ON public.ai_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS ai_sessions_select_own ON public.ai_sessions;
CREATE POLICY ai_sessions_select_own ON public.ai_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS builder_projects_select_own ON public.builder_projects;
CREATE POLICY builder_projects_select_own ON public.builder_projects FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS builder_projects_insert_own ON public.builder_projects;
CREATE POLICY builder_projects_insert_own ON public.builder_projects FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS builder_projects_update_own ON public.builder_projects;
CREATE POLICY builder_projects_update_own ON public.builder_projects FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS builder_projects_delete_own ON public.builder_projects;
CREATE POLICY builder_projects_delete_own ON public.builder_projects FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);