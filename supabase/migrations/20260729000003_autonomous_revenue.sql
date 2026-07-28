-- Autonomous Revenue Engine tables
-- Migration: 20260729000003_autonomous_revenue.sql

-- ── Outreach Campaigns ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.outreach_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'email',
  status text NOT NULL DEFAULT 'draft',
  cadence_days int NOT NULL DEFAULT 3,
  max_steps int NOT NULL DEFAULT 3,
  active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "outreach_campaigns_service" ON public.outreach_campaigns;
CREATE POLICY "outreach_campaigns_service"
  ON public.outreach_campaigns FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.outreach_campaigns TO service_role;
GRANT SELECT ON public.outreach_campaigns TO authenticated;

-- ── Outreach Sends ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.outreach_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.outreach_campaigns(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  prospect_name text NOT NULL,
  prospect_email text NOT NULL,
  company text,
  template_key text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  provider text NOT NULL DEFAULT 'resend',
  provider_message_id text,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  next_send_at timestamptz,
  error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outreach_sends_campaign_idx ON public.outreach_sends(campaign_id);
CREATE INDEX IF NOT EXISTS outreach_sends_status_idx ON public.outreach_sends(status);
CREATE INDEX IF NOT EXISTS outreach_sends_scheduled_idx ON public.outreach_sends(scheduled_at);

ALTER TABLE public.outreach_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "outreach_sends_service" ON public.outreach_sends;
CREATE POLICY "outreach_sends_service"
  ON public.outreach_sends FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.outreach_sends TO service_role;
GRANT SELECT ON public.outreach_sends TO authenticated;

-- ── Outreach Events ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  send_id uuid NOT NULL REFERENCES public.outreach_sends(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outreach_events_send_idx ON public.outreach_events(send_id);
CREATE INDEX IF NOT EXISTS outreach_events_type_idx ON public.outreach_events(type);

ALTER TABLE public.outreach_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "outreach_events_service" ON public.outreach_events;
CREATE POLICY "outreach_events_service"
  ON public.outreach_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.outreach_events TO service_role;
GRANT SELECT ON public.outreach_events TO authenticated;

-- ── Lead Scores ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  tier text NOT NULL DEFAULT 'cold',
  signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggested_offer text,
  suggested_next_action text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS lead_scores_lead_idx ON public.lead_scores(lead_id);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lead_scores_service" ON public.lead_scores;
CREATE POLICY "lead_scores_service"
  ON public.lead_scores FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.lead_scores TO service_role;
GRANT SELECT ON public.lead_scores TO authenticated;

-- ── Auto Proposals ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.auto_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  offer_type text NOT NULL,
  price_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  timeline_days int NOT NULL,
  summary text NOT NULL,
  milestones jsonb NOT NULL DEFAULT '[]'::jsonb,
  cal_link text,
  status text NOT NULL DEFAULT 'draft',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auto_proposals_lead_idx ON public.auto_proposals(lead_id);

ALTER TABLE public.auto_proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auto_proposals_service" ON public.auto_proposals;
CREATE POLICY "auto_proposals_service"
  ON public.auto_proposals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.auto_proposals TO service_role;
GRANT SELECT ON public.auto_proposals TO authenticated;

-- ── Content Schedule ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  platform text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  scheduled_at timestamptz NOT NULL,
  published_at timestamptz,
  post_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_schedule_platform_idx ON public.content_schedule(platform);
CREATE INDEX IF NOT EXISTS content_schedule_status_idx ON public.content_schedule(status);
CREATE INDEX IF NOT EXISTS content_schedule_scheduled_idx ON public.content_schedule(scheduled_at);

ALTER TABLE public.content_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_schedule_service" ON public.content_schedule;
CREATE POLICY "content_schedule_service"
  ON public.content_schedule FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.content_schedule TO service_role;
GRANT SELECT ON public.content_schedule TO authenticated;

-- ── Directory Listings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.directory_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority int NOT NULL DEFAULT 5,
  submitted_at timestamptz,
  approved_at timestamptz,
  review_url text,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS directory_listings_platform_idx ON public.directory_listings(platform);

ALTER TABLE public.directory_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "directory_listings_service" ON public.directory_listings;
CREATE POLICY "directory_listings_service"
  ON public.directory_listings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.directory_listings TO service_role;
GRANT SELECT ON public.directory_listings TO authenticated;

-- ── Revenue Events ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revenue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  source_id uuid,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending',
  customer_email text,
  customer_name text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS revenue_events_source_idx ON public.revenue_events(source);
CREATE INDEX IF NOT EXISTS revenue_events_status_idx ON public.revenue_events(status);
CREATE INDEX IF NOT EXISTS revenue_events_created_idx ON public.revenue_events(created_at);

ALTER TABLE public.revenue_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "revenue_events_service" ON public.revenue_events;
CREATE POLICY "revenue_events_service"
  ON public.revenue_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.revenue_events TO service_role;
GRANT SELECT ON public.revenue_events TO authenticated;
