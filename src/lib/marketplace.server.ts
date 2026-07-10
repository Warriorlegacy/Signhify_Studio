import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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

// Public marketplace reads use the publishable/anon key so the marketplace
// keeps rendering even when SUPABASE_SERVICE_ROLE_KEY is missing from the
// Worker environment. A public `TO anon` SELECT policy on
// `marketplace_listings` covers this path.
function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase public env vars (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).",
    );
  }
  return createClient<Database>(url, anonKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchListings(
  query?: string,
  category?: string,
  free?: boolean,
): Promise<DbListing[]> {
  const supabase = getPublicClient();
  let q: any = (supabase.from as any)("marketplace_listings").select(
    // Exclude asset_path from public reads to avoid leaking internal storage paths.
    "id, slug, title, description, category, price_cents, preview_url, creator_id, created_at",
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
