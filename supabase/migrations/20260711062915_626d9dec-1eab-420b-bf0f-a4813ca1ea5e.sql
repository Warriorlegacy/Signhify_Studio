DROP POLICY IF EXISTS "users_own_profiles" ON public.profiles;

CREATE POLICY "users_own_profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  WITH CHECK (
    id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );