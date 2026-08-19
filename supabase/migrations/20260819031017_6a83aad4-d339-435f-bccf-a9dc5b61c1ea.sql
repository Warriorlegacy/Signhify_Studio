-- Lock down SECURITY DEFINER function: fixed search_path + no anon/authenticated EXECUTE
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, tier, credits_remaining, max_credits)
  VALUES (p_user_id, 'free', p_amount, GREATEST(p_amount, 2))
  ON CONFLICT (user_id) DO UPDATE
  SET
    credits_remaining = public.user_credits.credits_remaining + p_amount,
    max_credits = GREATEST(public.user_credits.max_credits, p_amount),
    updated_at = now();
END;
$function$;

REVOKE ALL ON FUNCTION public.add_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_credits(uuid, integer) TO service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- artifacts
DROP POLICY IF EXISTS users_own_artifacts ON public.artifacts;
CREATE POLICY users_own_artifacts ON public.artifacts
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- frames
DROP POLICY IF EXISTS users_own_frames ON public.frames;
CREATE POLICY users_own_frames ON public.frames
  FOR ALL TO authenticated
  USING (
    COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND project_id IN (SELECT id FROM public.user_projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND project_id IN (SELECT id FROM public.user_projects WHERE user_id = auth.uid())
  );

-- creator_payouts
DROP POLICY IF EXISTS creator_payouts_own_select ON public.creator_payouts;
CREATE POLICY creator_payouts_own_select ON public.creator_payouts
  FOR SELECT TO authenticated
  USING (creator_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- user_credits: reject anonymous sessions
DROP POLICY IF EXISTS users_own_credits ON public.user_credits;
CREATE POLICY users_own_credits ON public.user_credits
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false)
  WITH CHECK (user_id = auth.uid() AND COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- revenue_events stays backend-only
REVOKE ALL ON TABLE public.revenue_events FROM anon, authenticated;
GRANT ALL ON TABLE public.revenue_events TO service_role;