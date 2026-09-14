DO $$
DECLARE
  na text := 'coalesce((auth.jwt() ->> ''is_anonymous'')::boolean, false) = false';
BEGIN
  -- affiliates
  EXECUTE 'DROP POLICY IF EXISTS "affiliates_own" ON public.affiliates';
  EXECUTE format('CREATE POLICY "affiliates_own" ON public.affiliates FOR ALL TO authenticated USING (user_id = auth.uid() AND %s) WITH CHECK (user_id = auth.uid() AND %s)', na, na);

  EXECUTE 'DROP POLICY IF EXISTS "affiliate_referrals_own" ON public.affiliate_referrals';
  EXECUTE format('CREATE POLICY "affiliate_referrals_own" ON public.affiliate_referrals FOR SELECT TO authenticated USING (%s AND affiliate_id IN (SELECT a.id FROM public.affiliates a WHERE a.user_id = auth.uid()))', na);

  -- run-scoped child tables
  EXECUTE 'DROP POLICY IF EXISTS "users_own_agent_nodes" ON public.agent_nodes';
  EXECUTE format('CREATE POLICY "users_own_agent_nodes" ON public.agent_nodes FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = agent_nodes.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = agent_nodes.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_run_agents" ON public.run_agents';
  EXECUTE format('CREATE POLICY "users_own_run_agents" ON public.run_agents FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_agents.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_agents.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_run_artifacts" ON public.run_artifacts';
  EXECUTE format('CREATE POLICY "users_own_run_artifacts" ON public.run_artifacts FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_artifacts.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_artifacts.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_run_events" ON public.run_events';
  EXECUTE format('CREATE POLICY "users_own_run_events" ON public.run_events FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_events.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_events.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_run_metrics" ON public.run_metrics';
  EXECUTE format('CREATE POLICY "users_own_run_metrics" ON public.run_metrics FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_metrics.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = run_metrics.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_tool_calls" ON public.tool_calls';
  EXECUTE format('CREATE POLICY "users_own_tool_calls" ON public.tool_calls FOR ALL TO authenticated USING (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = tool_calls.run_id AND r.user_id = auth.uid())) WITH CHECK (%1$s AND EXISTS (SELECT 1 FROM public.runs r WHERE r.id = tool_calls.run_id AND r.user_id = auth.uid()))', na);

  EXECUTE 'DROP POLICY IF EXISTS "users_own_runs" ON public.runs';
  EXECUTE format('CREATE POLICY "users_own_runs" ON public.runs FOR ALL TO authenticated USING (user_id = auth.uid() AND %1$s) WITH CHECK (user_id = auth.uid() AND %1$s)', na);

  -- ai sessions
  EXECUTE 'DROP POLICY IF EXISTS "users_own_ai_sessions_insert" ON public.ai_sessions';
  EXECUTE 'DROP POLICY IF EXISTS "ai_sessions_insert_own" ON public.ai_sessions';
  EXECUTE format('CREATE POLICY "ai_sessions_insert_own" ON public.ai_sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND %s)', na);
  EXECUTE 'DROP POLICY IF EXISTS "users_own_ai_sessions_select" ON public.ai_sessions';
  EXECUTE format('CREATE POLICY "users_own_ai_sessions_select" ON public.ai_sessions FOR SELECT TO authenticated USING (user_id = auth.uid() AND %s)', na);

  -- builder projects
  EXECUTE 'DROP POLICY IF EXISTS "builder_projects_insert_own" ON public.builder_projects';
  EXECUTE format('CREATE POLICY "builder_projects_insert_own" ON public.builder_projects FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND %s)', na);
  EXECUTE 'DROP POLICY IF EXISTS "builder_projects_update_own" ON public.builder_projects';
  EXECUTE format('CREATE POLICY "builder_projects_update_own" ON public.builder_projects FOR UPDATE TO authenticated USING (user_id = auth.uid() AND %1$s) WITH CHECK (user_id = auth.uid() AND %1$s)', na);
  EXECUTE 'DROP POLICY IF EXISTS "builder_projects_delete_own" ON public.builder_projects';
  EXECUTE format('CREATE POLICY "builder_projects_delete_own" ON public.builder_projects FOR DELETE TO authenticated USING (user_id = auth.uid() AND %s)', na);
  EXECUTE 'DROP POLICY IF EXISTS "builder_projects_select_own" ON public.builder_projects';
  EXECUTE format('CREATE POLICY "builder_projects_select_own" ON public.builder_projects FOR SELECT TO authenticated USING (user_id = auth.uid() AND %s)', na);

  -- credits
  EXECUTE 'DROP POLICY IF EXISTS "users_own_credits" ON public.user_credits';
  EXECUTE format('CREATE POLICY "users_own_credits" ON public.user_credits FOR ALL TO authenticated USING (user_id = auth.uid() AND %1$s) WITH CHECK (user_id = auth.uid() AND %1$s)', na);

  -- user_projects insert
  EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own projects" ON public.user_projects';
  EXECUTE format('CREATE POLICY "Users can insert their own projects" ON public.user_projects FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND %s)', na);

  -- marketplace listing creation
  EXECUTE 'DROP POLICY IF EXISTS "creators_insert_own_listings" ON public.marketplace_listings';
  EXECUTE format('CREATE POLICY "creators_insert_own_listings" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid() AND %s)', na);
END $$;
