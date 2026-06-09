
-- Ensure RLS is on
ALTER TABLE public.publish_audit ENABLE ROW LEVEL SECURITY;

-- Revoke any table-level grants from public roles; only service_role should touch this table
REVOKE ALL ON public.publish_audit FROM anon;
REVOKE ALL ON public.publish_audit FROM authenticated;
GRANT ALL ON public.publish_audit TO service_role;

-- Explicit restrictive policy documenting that anon/authenticated have no access.
-- A restrictive policy with USING (false) blocks all rows for these roles even if
-- a permissive policy is added later by mistake.
DROP POLICY IF EXISTS "Deny public access to publish_audit" ON public.publish_audit;
CREATE POLICY "Deny public access to publish_audit"
  ON public.publish_audit
  AS RESTRICTIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.publish_audit IS
  'Publish audit log. Writes/reads only via server functions using the service role. RLS denies all anon/authenticated access by design.';
