import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCreatorListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });
    return data ?? [];
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
    const { error } = await supabase
      .from("marketplace_listings")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getUserPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await supabase
      .from("marketplace_purchases")
      .select("*, listing:marketplace_listings(*)")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false });
    return data ?? [];
  });
