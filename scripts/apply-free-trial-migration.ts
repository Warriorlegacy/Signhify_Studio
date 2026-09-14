import { Client } from "pg";

const connStr =
  process.env.DIRECT_URL ||
  "postgresql://postgres.nqeuarvpkxupxeeuzuow:Piyushrajput@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function run() {
  console.log("Connecting to database...");
  const client = new Client({ connectionString: connStr });
  await client.connect();
  console.log("Connected successfully.");

  try {
    console.log("Step 1: Updating profiles columns...");
    await client.query(`
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_used boolean NOT NULL DEFAULT false;
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_trial_claimed_at timestamptz;
    `);
    console.log("Profiles columns updated.");

    console.log("Step 2: Ensuring rate_limits columns & indexes...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.rate_limits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ip text NOT NULL,
        window_start timestamptz NOT NULL,
        count int NOT NULL DEFAULT 1,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
      ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
      ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

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
    `);
    console.log("rate_limits table and policies configured.");

    console.log("Step 3: Creating atomic procedure consume_free_trial...");
    await client.query(`
      CREATE OR REPLACE FUNCTION public.consume_free_trial(p_user_id uuid, p_ip text DEFAULT NULL)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        v_already_used boolean;
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

        -- Record free trial allocation in user_credits if row exists
        UPDATE public.user_credits
        SET
          balance = GREATEST(balance, 1),
          lifetime_granted = lifetime_granted + 1,
          updated_at = now()
        WHERE user_id = p_user_id;

        -- Track IP if provided
        IF p_ip IS NOT NULL AND p_ip <> '' THEN
          INSERT INTO public.rate_limits (ip, window_start, count, updated_at)
          VALUES (p_ip, date_trunc('day', now()), 1, now())
          ON CONFLICT (ip, window_start)
          DO UPDATE SET
            count = public.rate_limits.count + 1,
            updated_at = now();
        END IF;

        RETURN jsonb_build_object(
          'success', true,
          'message', 'Free trial granted successfully.'
        );
      END;
      $$;

      GRANT EXECUTE ON FUNCTION public.consume_free_trial(uuid, text) TO authenticated, service_role;
    `);
    console.log("Procedure consume_free_trial created.");

    // Verification
    const res = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles' AND column_name IN ('free_trial_used', 'free_trial_claimed_at')
    `);
    console.log("Verified profiles columns:", res.rows.map(r => r.column_name));

    const procRes = await client.query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public' AND routine_name = 'consume_free_trial'
    `);
    console.log("Verified routine:", procRes.rows.map(r => r.routine_name));

    console.log("MIGRATION COMPLETED SUCCESSFULLY!");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
