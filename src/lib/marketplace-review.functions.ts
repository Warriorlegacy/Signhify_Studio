import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "@/lib/admin";

const REVIEW_COLS =
  "id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, is_active, status, review_note, reviewed_at";

export type ReviewListing = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  price_cents: number | null;
  preview_url: string | null;
  creator_id: string | null;
  created_at: string | null;
  is_active: boolean | null;
  status: string | null;
  review_note: string | null;
  reviewed_at: string | null;
};

const emailOf = (context: any): string | null => (context?.claims as any)?.email ?? null;

/** Listings awaiting the studio owner's approval. */
export const listListingsForReview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    if (!isAdminEmail(emailOf(context))) throw new Error("Forbidden");
    const { data, error } = await (supabase.from as any)("marketplace_listings")
      .select(REVIEW_COLS)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { listings: (data ?? []) as ReviewListing[] };
  });

/** Approve or reject a pending listing. */
export const reviewListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const id = String(o.id ?? "");
    const decision = String(o.decision ?? "");
    if (!id) throw new Error("Listing ID required");
    if (!["approve", "reject", "pending"].includes(decision)) throw new Error("Invalid decision");
    const note = typeof o.note === "string" ? o.note.trim().slice(0, 500) : "";
    return { id, decision, note };
  })
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    if (!isAdminEmail(emailOf(context))) throw new Error("Forbidden");
    const status =
      data.decision === "approve" ? "live" : data.decision === "reject" ? "rejected" : "pending";
    const { error } = await (supabase.from as any)("marketplace_listings")
      .update({
        status,
        is_active: status === "live",
        review_note: data.note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, status };
  });
