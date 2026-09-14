-- 1. Remove conflicting permissive policy on rate_limits
DROP POLICY IF EXISTS "rate_limits_public_read_write" ON public.rate_limits;

-- 2. user_presence: reject anonymous sign-ins
DROP POLICY IF EXISTS "users_own_presence" ON public.user_presence;
CREATE POLICY "users_own_presence" ON public.user_presence
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- 3. Pin search_path on SECURITY DEFINER / trigger functions
ALTER FUNCTION public.add_credits(uuid, integer) SET search_path = public;
ALTER FUNCTION public.consume_free_trial(uuid, text) SET search_path = public;
ALTER FUNCTION public.handle_builder_projects_updated_at() SET search_path = public;

-- 4. Revoke direct EXECUTE from API roles (server/service_role only)
REVOKE ALL ON FUNCTION public.consume_free_trial(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_free_trial(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.handle_builder_projects_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_builder_projects_updated_at() TO service_role;

REVOKE ALL ON FUNCTION public.add_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(uuid, integer) TO service_role;
