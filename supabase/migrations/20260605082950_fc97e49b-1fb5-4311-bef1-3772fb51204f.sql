CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  prompt text,
  source text DEFAULT 'ai-page',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_public_insert" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX waitlist_email_idx ON public.waitlist (email);