DROP POLICY IF EXISTS "creator_payouts_own_select" ON public.creator_payouts;
CREATE POLICY "creator_payouts_own_select" ON public.creator_payouts
  FOR SELECT TO authenticated
  USING (creator_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

DROP POLICY IF EXISTS "users_own_run_errors" ON public.run_errors;
CREATE POLICY "users_own_run_errors" ON public.run_errors
  FOR ALL TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND EXISTS (SELECT 1 FROM public.user_projects up WHERE up.id = run_errors.project_id AND up.user_id = auth.uid())
  )
  WITH CHECK (
    coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND EXISTS (SELECT 1 FROM public.user_projects up WHERE up.id = run_errors.project_id AND up.user_id = auth.uid())
  );
