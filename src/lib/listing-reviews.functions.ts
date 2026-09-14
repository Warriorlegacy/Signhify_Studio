import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PublicReview, RatingSummary } from "@/lib/reviews.server";

export type { PublicReview, RatingSummary };

/** Public: all reviews for one blueprint. */
export const listListingReviews = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const slug = String((input as any)?.slug ?? "").trim();
    if (!slug) throw new Error("Blueprint slug required");
    return { slug };
  })
  .handler(async ({ data }): Promise<{ reviews: PublicReview[] }> => {
    try {
      const { fetchReviewsForListing } = await import("@/lib/reviews.server");
      return { reviews: await fetchReviewsForListing(data.slug) };
    } catch (err) {
      console.error("[reviews] list failed", err);
      return { reviews: [] };
    }
  });

/** Public: average rating + review count per blueprint, for the marketplace grid. */
export const listRatingSummaries = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ summaries: Record<string, RatingSummary> }> => {
    try {
      const { fetchRatingSummaries } = await import("@/lib/reviews.server");
      return { summaries: await fetchRatingSummaries() };
    } catch (err) {
      console.error("[reviews] summaries failed", err);
      return { summaries: {} };
    }
  },
);

/** Signed-in: leave or update your review for a blueprint. */
export const upsertListingReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const raw = input as Record<string, unknown>;
    const slug = String(raw?.slug ?? "").trim();
    const rating = Number(raw?.rating);
    const body = typeof raw?.body === "string" ? raw.body.trim().slice(0, 1500) : "";
    if (!slug) throw new Error("Blueprint slug required");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      throw new Error("Rating must be between 1 and 5");
    return { slug, rating, body };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context;
    const email = (claims as any)?.email as string | undefined;
    const authorName = email ? email.split("@")[0] : "Buyer";

    const { data: row, error } = await (supabase.from as any)("listing_reviews")
      .upsert(
        {
          listing_slug: data.slug,
          user_id: userId,
          rating: data.rating,
          body: data.body || null,
          author_name: authorName,
        },
        { onConflict: "listing_slug,user_id" },
      )
      .select("id, listing_slug, rating, body, author_name, created_at")
      .single();

    if (error) {
      console.error("[reviews] upsert failed", error);
      throw new Error("Could not save your review. Please try again.");
    }
    return { review: row as PublicReview };
  });

/** Signed-in: remove your own review. */
export const deleteMyListingReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const slug = String((input as any)?.slug ?? "").trim();
    if (!slug) throw new Error("Blueprint slug required");
    return { slug };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await (supabase.from as any)("listing_reviews")
      .delete()
      .eq("listing_slug", data.slug)
      .eq("user_id", userId);
    if (error) throw new Error("Could not remove your review.");
    return { success: true as const };
  });
