-- Create builder_projects table (was created outside of migration history)
CREATE TABLE IF NOT EXISTS public.builder_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_data jsonb NOT NULL DEFAULT '{}',
  version integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_builder_projects_user_id ON public.builder_projects(user_id);

-- RLS policies (owned by the user who created them)
ALTER TABLE public.builder_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS builder_projects_select_own ON public.builder_projects;
DROP POLICY IF EXISTS builder_projects_insert_own ON public.builder_projects;
DROP POLICY IF EXISTS builder_projects_update_own ON public.builder_projects;
DROP POLICY IF EXISTS builder_projects_delete_own ON public.builder_projects;

CREATE POLICY builder_projects_select_own ON public.builder_projects
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY builder_projects_insert_own ON public.builder_projects
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY builder_projects_update_own ON public.builder_projects
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY builder_projects_delete_own ON public.builder_projects
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Auto-set updated_at on update
CREATE OR REPLACE FUNCTION public.handle_builder_projects_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS builder_projects_updated_at ON public.builder_projects;
CREATE TRIGGER builder_projects_updated_at
  BEFORE UPDATE ON public.builder_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_builder_projects_updated_at();
