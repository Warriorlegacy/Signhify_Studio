import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublicReview = {
  id: string;
  listing_slug: string;
  rating: number;
  body: string | null;
  author_name: string | null;
  created_at: string;
};

export type RatingSummary = { slug: string; average: number; count: number };

const REVIEW_COLS = "id, listing_slug, rating, body, author_name, created_at";

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) throw new Error("Missing Supabase public env vars.");
  return createClient<Database>(url, anonKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchReviewsForListing(slug: string): Promise<PublicReview[]> {
  const supabase = getPublicClient();
  const { data, error } = await (supabase.from as any)("listing_reviews")
    .select(REVIEW_COLS)
    .eq("listing_slug", slug)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("[reviews] fetch failed", error);
    return [];
  }
  return (data ?? []) as PublicReview[];
}

/** Average rating + count for every blueprint that has at least one review. */
export async function fetchRatingSummaries(): Promise<Record<string, RatingSummary>> {
  const supabase = getPublicClient();
  const { data, error } = await (supabase.from as any)("listing_reviews")
    .select("listing_slug, rating")
    .limit(5000);
  if (error) {
    console.error("[reviews] summary fetch failed", error);
    return {};
  }
  const acc: Record<string, { total: number; count: number }> = {};
  for (const row of (data ?? []) as Array<{ listing_slug: string; rating: number }>) {
    const bucket = acc[row.listing_slug] ?? { total: 0, count: 0 };
    bucket.total += row.rating;
    bucket.count += 1;
    acc[row.listing_slug] = bucket;
  }
  const out: Record<string, RatingSummary> = {};
  for (const [slug, { total, count }] of Object.entries(acc)) {
    out[slug] = { slug, average: Math.round((total / count) * 10) / 10, count };
  }
  return out;
}
