CREATE TABLE public.prompt_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_library TO authenticated;
GRANT ALL ON public.prompt_library TO service_role;
ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompt_library_select_own" ON public.prompt_library FOR SELECT TO authenticated USING (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE POLICY "prompt_library_insert_own" ON public.prompt_library FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE POLICY "prompt_library_update_own" ON public.prompt_library FOR UPDATE TO authenticated USING (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE) WITH CHECK (user_id = auth.uid());
CREATE POLICY "prompt_library_delete_own" ON public.prompt_library FOR DELETE TO authenticated USING (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE INDEX prompt_library_user_idx ON public.prompt_library (user_id, updated_at DESC);

CREATE TABLE public.prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompt_library(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version integer NOT NULL,
  body text NOT NULL,
  project_id uuid REFERENCES public.user_projects(id) ON DELETE SET NULL,
  project_title text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_versions TO authenticated;
GRANT ALL ON public.prompt_versions TO service_role;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompt_versions_select_own" ON public.prompt_versions FOR SELECT TO authenticated USING (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE POLICY "prompt_versions_insert_own" ON public.prompt_versions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE POLICY "prompt_versions_delete_own" ON public.prompt_versions FOR DELETE TO authenticated USING (user_id = auth.uid() AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE);
CREATE INDEX prompt_versions_prompt_idx ON public.prompt_versions (prompt_id, version DESC);