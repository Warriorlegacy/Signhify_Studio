CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  cover_url text,
  tags text[] DEFAULT '{}',
  live_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_public_select" ON public.projects FOR SELECT TO anon, authenticated USING (true);
