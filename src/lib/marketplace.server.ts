import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type DbListing = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  price_cents: number | null;
  preview_url: string | null;
  asset_path: string | null;
  creator_id: string | null;
  created_at: string | null;
};

export async function fetchListings(
  query?: string,
  category?: string,
  free?: boolean,
): Promise<DbListing[]> {
  let q: any = (supabaseAdmin.from as any)("marketplace_listings").select(
    "id, slug, title, description, category, price_cents, preview_url, creator_id, created_at", // Exclude asset_path for security
    // Note: asset_path is excluded from public SELECT to prevent leaking internal storage paths
  );
  if (query?.trim())
    q = q.textSearch("search_vector", query.trim(), { type: "plain", config: "english" });
  if (category && category !== "All") q = q.eq("category", category);
  if (typeof free === "boolean") q = free ? q.eq("price_cents", 0) : q.gt("price_cents", 0);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) {
    console.error("[marketplace] fetch failed", error);
    return [];
  }
  return data ?? [];
}
