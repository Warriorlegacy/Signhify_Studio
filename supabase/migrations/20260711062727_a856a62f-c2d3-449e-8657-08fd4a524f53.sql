DROP POLICY IF EXISTS "users_own_project_secrets" ON public.project_secrets;

CREATE POLICY "users_own_project_secrets"
  ON public.project_secrets
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  WITH CHECK (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );