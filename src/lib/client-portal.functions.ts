import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PortalPayment = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  description: string | null;
  transaction_ref: string | null;
  status: string;
  created_at: string;
  confirmed_at: string | null;
};

export type PortalUnlock = {
  id: string;
  purchased_at: string;
  title: string;
  slug: string;
  preview_url: string | null;
};

/** Everything a buyer sees in their portal: payments, unlocks, credits. */
export const getClientPortal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [paymentsRes, purchasesRes, creditsRes, projectsRes] = await Promise.all([
      (supabase.from as any)("manual_payments")
        .select("id, amount, currency, method, description, transaction_ref, status, created_at, confirmed_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      (supabase.from as any)("marketplace_purchases")
        .select("id, purchased_at, listing:marketplace_listings(title, slug, preview_url)")
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false })
        .limit(50),
      (supabase.from as any)("user_credits")
        .select("credits_remaining, max_credits, tier")
        .eq("user_id", userId)
        .maybeSingle(),
      (supabase.from as any)("user_projects")
        .select("id, title, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    const payments = (paymentsRes.data ?? []) as PortalPayment[];
    const unlocks: PortalUnlock[] = ((purchasesRes.data ?? []) as any[]).map((p) => ({
      id: p.id,
      purchased_at: p.purchased_at,
      title: p.listing?.title ?? "Blueprint",
      slug: p.listing?.slug ?? "",
      preview_url: p.listing?.preview_url ?? null,
    }));

    return {
      payments,
      unlocks,
      credits: {
        remaining: creditsRes.data?.credits_remaining ?? 0,
        max: creditsRes.data?.max_credits ?? 0,
        tier: creditsRes.data?.tier ?? "free",
      },
      projects: (projectsRes.data ?? []) as Array<{
        id: string;
        title: string;
        created_at: string;
      }>,
    };
  });
