DROP POLICY IF EXISTS users_own_projects ON public.user_projects;
CREATE POLICY users_own_projects ON public.user_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE)
  WITH CHECK (auth.uid() = user_id AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);