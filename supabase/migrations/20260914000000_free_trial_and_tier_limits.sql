-- Migration: 20260914000000_free_trial_and_tier_limits.sql
-- Description: Add 1-time free trial tracking, tier limits, and IP anti-abuse tracking

-- 1. Add free trial tracking columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_used boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_claimed_at timestamptz;

-- 2. Ensure rate_limits table has necessary indexes for composite key and window lookups
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  window_start timestamptz NOT NULL,
  count int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS rate_limits_ip_window_idx ON public.rate_limits(ip, window_start);
CREATE INDEX IF NOT EXISTS rate_limits_ip_idx ON public.rate_limits(ip);

GRANT SELECT, INSERT, UPDATE ON public.rate_limits TO authenticated, anon;
GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rate_limits_public_read_write" ON public.rate_limits;
CREATE POLICY "rate_limits_public_read_write" ON public.rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Atomic procedure to consume 1 free trial for a user
CREATE OR REPLACE FUNCTION public.consume_free_trial(p_user_id uuid, p_ip text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_used boolean;
  v_result jsonb;
BEGIN
  -- Check if user has already consumed the free trial
  SELECT free_trial_used INTO v_already_used
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_already_used IS TRUE THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'FREE_TRIAL_ALREADY_USED',
      'message', 'Free trial has already been used for this account.'
    );
  END IF;

  -- Mark free trial as used on profile
  UPDATE public.profiles
  SET
    free_trial_used = true,
    free_trial_claimed_at = now()
  WHERE id = p_user_id;

  -- Decrement credits in user_credits if row exists
  UPDATE public.user_credits
  SET
    credits_remaining = GREATEST(credits_remaining - 1, 0),
    updated_at = now()
  WHERE user_id = p_user_id;

  -- If IP provided, record IP usage flag
  IF p_ip IS NOT NULL AND p_ip <> '' THEN
    INSERT INTO public.rate_limits (ip, window_start, count)
    VALUES ('trial:' || p_ip, now(), 1)
    ON CONFLICT (ip, window_start) DO UPDATE
    SET count = public.rate_limits.count + 1, updated_at = now();
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Free trial successfully consumed.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_free_trial(uuid, text) TO service_role, authenticated;
