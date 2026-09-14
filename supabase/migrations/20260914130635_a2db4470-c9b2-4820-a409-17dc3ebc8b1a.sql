-- Replace the SECURITY DEFINER admin helper with a plain JWT email check
DROP POLICY IF EXISTS "admins_manage_listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "client_messages_select_own" ON public.client_messages;
DROP POLICY IF EXISTS "client_messages_insert_own" ON public.client_messages;
DROP POLICY IF EXISTS "client_messages_update_read" ON public.client_messages;

CREATE POLICY "admins_manage_listings" ON public.marketplace_listings
  FOR ALL TO authenticated
  USING (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
  )
  WITH CHECK (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
  );

CREATE POLICY "client_messages_select_own" ON public.client_messages
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (
      client_id = auth.uid()
      OR lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
    )
  );

CREATE POLICY "client_messages_insert_own" ON public.client_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (
      (client_id = auth.uid() AND sender_role = 'client')
      OR lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
    )
  );

CREATE POLICY "client_messages_update_read" ON public.client_messages
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (
      client_id = auth.uid()
      OR lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND (
      client_id = auth.uid()
      OR lower(auth.jwt() ->> 'email') IN ('piyushrajsingh092@gmail.com','rajpiyush092@gmail.com')
    )
  );

DROP FUNCTION IF EXISTS public.is_signhify_admin(uuid);