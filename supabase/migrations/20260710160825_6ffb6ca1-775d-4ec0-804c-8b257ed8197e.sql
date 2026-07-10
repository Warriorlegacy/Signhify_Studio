DROP POLICY IF EXISTS users_own_projects ON public.user_projects;
CREATE POLICY users_own_projects ON public.user_projects
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());