CREATE TABLE public.publish_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  approver_email text,
  gates jsonb NOT NULL DEFAULT '{}'::jsonb,
  smoke_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  diff_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  preview_url text,
  commit_sha text,
  notes text
);

GRANT INSERT ON public.publish_audit TO anon, authenticated;
GRANT ALL ON public.publish_audit TO service_role;

ALTER TABLE public.publish_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY publish_audit_public_insert
  ON public.publish_audit
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX publish_audit_created_at_idx ON public.publish_audit (created_at DESC);