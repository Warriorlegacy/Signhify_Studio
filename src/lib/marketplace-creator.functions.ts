import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Public/creator-facing columns only. asset_path and stripe_connect_account_id are
// excluded here; they are fetched through service_role in verified purchase/download flows.
const LISTING_COLS =
  "id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, is_active";

export const getCreatorListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await (supabase.from as any)("marketplace_listings")
      .select(LISTING_COLS)
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []) as any[];
  });

export const updateListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const { id, status } = input as any;
    if (!id) throw new Error("Listing ID required");
    if (!["draft", "published", "archived"].includes(status)) throw new Error("Invalid status");
    return { id, status };
  })
  .handler(async ({ context, data }) => {
    const { userId, supabase } = context;
    // `status` column may not exist on marketplace_listings in this schema — soft update.
    const { error } = await (supabase.from as any)("marketplace_listings")
      .update({ status: data.status } as any)
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getUserPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await (supabase.from as any)("marketplace_purchases")
      .select(
        `id, listing_id, purchased_at, stripe_session_id, listing:marketplace_listings(${LISTING_COLS})`,
      )
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false });
    return (data ?? []) as any[];
  });
