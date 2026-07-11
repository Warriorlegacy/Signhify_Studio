DROP POLICY IF EXISTS "users_own_runs" ON public.runs;

CREATE POLICY "users_own_runs"
  ON public.runs
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