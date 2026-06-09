CREATE TABLE public.ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  prompt text NOT NULL,
  response jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT, INSERT ON public.ai_sessions TO anon, authenticated;
GRANT ALL ON public.ai_sessions TO service_role;

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_sessions_select ON public.ai_sessions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY ai_sessions_insert ON public.ai_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX ai_sessions_created_at_idx ON public.ai_sessions (created_at DESC);
