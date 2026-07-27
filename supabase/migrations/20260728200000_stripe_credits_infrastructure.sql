-- Add Stripe-related columns to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text NOT NULL DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz;

-- User credits table for AI generation credits
CREATE TABLE IF NOT EXISTS public.user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free',
  credits_remaining int NOT NULL DEFAULT 2,
  max_credits int NOT NULL DEFAULT 2,
  projects_count int NOT NULL DEFAULT 0,
  videos_generated int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_credits_user_id_idx ON public.user_credits(user_id);

GRANT SELECT, INSERT, UPDATE ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_credits" ON public.user_credits;
CREATE POLICY "users_own_credits" ON public.user_credits FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Function to add credits to a user account
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, tier, credits_remaining, max_credits)
  VALUES (p_user_id, 'free', p_amount, GREATEST(p_amount, 2))
  ON CONFLICT (user_id) DO UPDATE
  SET
    credits_remaining = public.user_credits.credits_remaining + p_amount,
    max_credits = GREATEST(public.user_credits.max_credits, p_amount),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_credits TO service_role;
