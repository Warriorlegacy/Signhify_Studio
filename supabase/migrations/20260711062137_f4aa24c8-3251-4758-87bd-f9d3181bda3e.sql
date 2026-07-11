DROP POLICY IF EXISTS users_own_projects ON public.user_projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.user_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.user_projects;

CREATE POLICY "Users can view their own projects"
  ON public.user_projects FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

CREATE POLICY "Users can insert their own projects"
  ON public.user_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

CREATE POLICY "Users can update their own projects"
  ON public.user_projects FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  WITH CHECK (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

CREATE POLICY "Users can delete their own projects"
  ON public.user_projects FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );