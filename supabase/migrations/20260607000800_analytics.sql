CREATE TABLE public.analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_projects(id) ON DELETE CASCADE,
  path text,
  referrer text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics TO anon;
GRANT SELECT ON public.analytics TO authenticated;
GRANT ALL ON public.analytics TO service_role;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics_public_insert" ON public.analytics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "analytics_owner_select" ON public.analytics FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_projects p WHERE p.id = analytics.project_id AND p.user_id = auth.uid()));
