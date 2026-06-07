CREATE TABLE public.creator_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
GRANT INSERT ON public.creator_waitlist TO anon, authenticated;
GRANT ALL ON public.creator_waitlist TO service_role;
ALTER TABLE public.creator_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creator_waitlist_public_insert" ON public.creator_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
