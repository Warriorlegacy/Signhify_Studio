import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "./admin";

const PAID_PLANS = new Set(["starter", "studio", "scale", "pro", "enterprise"]);

export type Entitlements = {
  plan: string;
  status: string | null;
  isPaid: boolean;
  credits: number;
  maxCredits: number;
};

/**
 * Single source of truth for "what is this signed-in user allowed to do".
 * Used by the pricing page, the templates catalogue and the creator dashboard.
 */
export const getMyEntitlements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Entitlements> => {
    const { supabase, userId, claims } = context as {
      supabase: any;
      userId: string;
      claims?: { email?: string | null };
    };

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, subscription_status")
      .eq("id", userId)
      .maybeSingle();

    const { data: credits } = await supabase
      .from("user_credits")
      .select("credits_remaining, max_credits")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = String(profile?.subscription_plan ?? "free").toLowerCase();
    const status = (profile?.subscription_status ?? null) as string | null;
    const activeStatus = !status || status === "active" || status === "trialing";
    const isPaid =
      isAdminEmail(claims?.email ?? null) || (PAID_PLANS.has(plan) && activeStatus);

    return {
      plan,
      status,
      isPaid,
      credits: Number(credits?.credits_remaining ?? 0),
      maxCredits: Number(credits?.max_credits ?? 0),
    };
  });
