
-- Tighten ai_sessions RLS: remove public access; admin/server flows continue via service role.
DROP POLICY IF EXISTS ai_sessions_select ON public.ai_sessions;
DROP POLICY IF EXISTS ai_sessions_insert ON public.ai_sessions;

CREATE POLICY ai_sessions_select_own
  ON public.ai_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY ai_sessions_insert_own
  ON public.ai_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
