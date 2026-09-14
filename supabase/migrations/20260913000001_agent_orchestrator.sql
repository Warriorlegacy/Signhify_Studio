-- Signhify AI Workspace — 45 LPA proof: durable agent orchestrator schema.
-- Adds per-agent run tracking, artifact storage, streaming events, and run metrics.

-- ── 1. Extend runs ───────────────────────────────────────────────────
ALTER TABLE public.runs
  ADD COLUMN IF NOT EXISTS prompt text,
  ADD COLUMN IF NOT EXISTS current_agent text,
  ADD COLUMN IF NOT EXISTS result jsonb,
  ADD COLUMN IF NOT EXISTS trace_id text,
  ADD COLUMN IF NOT EXISTS total_tokens int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_latency_ms int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS agents_completed int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS agents_failed int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS runs_user_created_idx
  ON public.runs (user_id, created_at DESC);

-- ── 2. run_agents ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.run_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  input_hash text,
  started_at timestamptz,
  finished_at timestamptz,
  latency_ms int,
  tokens_used int NOT NULL DEFAULT 0,
  error text,
  retries int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.run_agents TO authenticated;
GRANT ALL ON public.run_agents TO service_role;
ALTER TABLE public.run_agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_own_run_agents" ON public.run_agents;
CREATE POLICY "users_own_run_agents" ON public.run_agents
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_agents.run_id AND runs.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_agents.run_id AND runs.user_id = auth.uid())
  );

CREATE UNIQUE INDEX IF NOT EXISTS run_agents_run_name_idx
  ON public.run_agents (run_id, name);

-- ── 3. run_artifacts ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.run_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  path text NOT NULL,
  content text NOT NULL,
  language text,
  size_bytes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.run_artifacts TO authenticated;
GRANT ALL ON public.run_artifacts TO service_role;
ALTER TABLE public.run_artifacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_own_run_artifacts" ON public.run_artifacts;
CREATE POLICY "users_own_run_artifacts" ON public.run_artifacts
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_artifacts.run_id AND runs.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_artifacts.run_id AND runs.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS run_artifacts_run_created_idx
  ON public.run_artifacts (run_id, created_at DESC);

-- ── 4. run_events ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.run_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
  agent_name text,
  event_type text NOT NULL DEFAULT 'log',
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.run_events TO authenticated;
GRANT ALL ON public.run_events TO service_role;
ALTER TABLE public.run_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_own_run_events" ON public.run_events;
CREATE POLICY "users_own_run_events" ON public.run_events
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_events.run_id AND runs.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_events.run_id AND runs.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS run_events_run_created_idx
  ON public.run_events (run_id, created_at ASC);

-- ── 5. run_metrics (aggregated per-run summary) ────────────────────────
CREATE TABLE IF NOT EXISTS public.run_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
  total_tokens int NOT NULL DEFAULT 0,
  total_latency_ms int NOT NULL DEFAULT 0,
  agents_completed int NOT NULL DEFAULT 0,
  agents_failed int NOT NULL DEFAULT 0,
  provider_mix jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.run_metrics TO authenticated;
GRANT ALL ON public.run_metrics TO service_role;
ALTER TABLE public.run_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_own_run_metrics" ON public.run_metrics;
CREATE POLICY "users_own_run_metrics" ON public.run_metrics
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_metrics.run_id AND runs.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.runs WHERE runs.id = run_metrics.run_id AND runs.user_id = auth.uid())
  );

CREATE UNIQUE INDEX IF NOT EXISTS run_metrics_run_idx
  ON public.run_metrics (run_id);
