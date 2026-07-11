DROP POLICY IF EXISTS "Users manage own ai keys" ON public.user_ai_keys;

CREATE POLICY "Users manage own ai keys"
  ON public.user_ai_keys
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  WITH CHECK (
    auth.uid() = user_id
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );