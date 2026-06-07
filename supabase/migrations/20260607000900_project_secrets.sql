CREATE TABLE public.project_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.user_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.project_secrets TO authenticated;
GRANT ALL ON public.project_secrets TO service_role;
ALTER TABLE public.project_secrets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_project_secrets" ON public.project_secrets USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
