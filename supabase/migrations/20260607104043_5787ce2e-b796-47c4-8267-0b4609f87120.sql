DROP POLICY IF EXISTS "publish_audit_public_insert" ON public.publish_audit;
REVOKE INSERT, SELECT, UPDATE, DELETE ON public.publish_audit FROM anon, authenticated;
GRANT ALL ON public.publish_audit TO service_role;