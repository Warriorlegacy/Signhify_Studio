-- Signhify AI workspace → 45 LPA proof hardening.
-- 1) Stripe webhook idempotency log (Stripe retries every event until 2xx;
--    without this, credit packs / purchases double-apply on redelivery).
-- 2) ai_sessions RLS was wide open to anon (SELECT/INSERT … USING (true)).
--    Scope it to the row owner.
-- 3) AI observability columns so every run records provider + latency + status.

-- ── 1. stripe_events ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.stripe_events TO service_role;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "stripe_events_service_role_all" ON public.stripe_events;
CREATE POLICY "stripe_events_service_role_all" ON public.stripe_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 2. ai_sessions RLS: owner-only ─────────────────────────────────
DROP POLICY IF EXISTS ai_sessions_select ON public.ai_sessions;
DROP POLICY IF EXISTS ai_sessions_insert ON public.ai_sessions;
REVOKE ALL ON public.ai_sessions FROM anon;
GRANT SELECT, INSERT ON public.ai_sessions TO authenticated;
DROP POLICY IF EXISTS "users_own_ai_sessions_select" ON public.ai_sessions;
CREATE POLICY "users_own_ai_sessions_select" ON public.ai_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "users_own_ai_sessions_insert" ON public.ai_sessions;
CREATE POLICY "users_own_ai_sessions_insert" ON public.ai_sessions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- ── 3. AI run observability ────────────────────────────────────────
ALTER TABLE public.ai_sessions ADD COLUMN IF NOT EXISTS provider_used TEXT;
ALTER TABLE public.ai_sessions ADD COLUMN IF NOT EXISTS latency_ms INT;
ALTER TABLE public.ai_sessions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ok';
ALTER TABLE public.ai_sessions ADD COLUMN IF NOT EXISTS error TEXT;
CREATE INDEX IF NOT EXISTS ai_sessions_user_created_idx
  ON public.ai_sessions (user_id, created_at DESC);
