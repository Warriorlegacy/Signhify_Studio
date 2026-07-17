CREATE TABLE public.run_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_projects(id) ON DELETE CASCADE,
  exception_message text NOT NULL,
  stack_trace text,
  resolved boolean NOT NULL DEFAULT false,
  resolution_details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.run_errors TO authenticated;
GRANT ALL ON public.run_errors TO service_role;

ALTER TABLE public.run_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_run_errors" ON public.run_errors
  USING (
    EXISTS (
      SELECT 1 FROM public.user_projects
      WHERE public.user_projects.id = public.run_errors.project_id
      AND public.user_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects
      WHERE public.user_projects.id = public.run_errors.project_id
      AND public.user_projects.user_id = auth.uid()
    )
  );
