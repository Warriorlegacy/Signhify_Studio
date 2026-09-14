-- 1. Listing approval workflow
ALTER TABLE public.marketplace_listings
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_note text;

CREATE OR REPLACE FUNCTION public.is_signhify_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = _uid
      AND lower(u.email) IN ('piyushrajsingh092@gmail.com', 'rajpiyush092@gmail.com')
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_signhify_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_signhify_admin(uuid) TO authenticated, service_role;

-- Existing listings stay visible
UPDATE public.marketplace_listings SET status = 'live' WHERE status = 'pending' AND created_at < now();

-- Admins can review any listing
DROP POLICY IF EXISTS "admins_manage_listings" ON public.marketplace_listings;
CREATE POLICY "admins_manage_listings" ON public.marketplace_listings
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE AND public.is_signhify_admin(auth.uid()))
  WITH CHECK ((auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE AND public.is_signhify_admin(auth.uid()));

-- 2. Client messages (buyer <-> studio owner)
CREATE TABLE IF NOT EXISTS public.client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.user_projects(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES public.marketplace_listings(id) ON DELETE SET NULL,
  sender_role text NOT NULL DEFAULT 'client',
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.client_messages TO authenticated;
GRANT ALL ON public.client_messages TO service_role;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "client_messages_select_own" ON public.client_messages;
CREATE POLICY "client_messages_select_own" ON public.client_messages
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (client_id = auth.uid() OR public.is_signhify_admin(auth.uid()))
  );

DROP POLICY IF EXISTS "client_messages_insert_own" ON public.client_messages;
CREATE POLICY "client_messages_insert_own" ON public.client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (
      (client_id = auth.uid() AND sender_role = 'client')
      OR public.is_signhify_admin(auth.uid())
    )
  );

DROP POLICY IF EXISTS "client_messages_update_read" ON public.client_messages;
CREATE POLICY "client_messages_update_read" ON public.client_messages
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (client_id = auth.uid() OR public.is_signhify_admin(auth.uid()))
  )
  WITH CHECK (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (client_id = auth.uid() OR public.is_signhify_admin(auth.uid()))
  );

CREATE INDEX IF NOT EXISTS client_messages_client_idx ON public.client_messages (client_id, created_at DESC);