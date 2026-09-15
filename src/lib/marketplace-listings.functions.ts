import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { MarketItem } from "@/lib/marketplace";
import { MARKET } from "@/lib/marketplace";

export const fetchMarketplaceListings = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: MarketItem[] }> => {
    try {
      const { fetchListings } = await import("@/lib/marketplace.server");
      const rows = await fetchListings();
      if (!rows.length) return { items: MARKET };
      const items: MarketItem[] = rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.title,
        blurb: row.description ?? "Marketplace listing",
        category: (row.category as MarketItem["category"]) ?? "Template",
        price: Math.round((row.price_cents ?? 0) / 100),
        price_cents: row.price_cents ?? 0,
        preview_url: row.preview_url,
        // asset_path is intentionally omitted from public listings for security
        // Internal systems can access it through secure channels if needed
        asset_path: null,
        tags: row.category ? [row.category] : [],
        accent: "linear-gradient(135deg, oklch(0.72 0.21 45), oklch(0.22 0.06 260))",
        badge: (row.price_cents ?? 0) === 0 ? "Free" : undefined,
      }));
      return { items };
    } catch (err) {
      console.error("[marketplace] listings serverFn failed", err);
      return { items: MARKET };
    }
  },
);

export const publishProjectToMarketplace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const projectId = (input as Record<string, unknown>)?.projectId;
    if (typeof projectId !== "string" || !projectId.trim())
      throw new Error("Project ID is required");
    return { projectId: projectId.trim() };
  })
  .handler(async ({ context, data }) => {
    try {
      const { supabase, userId } = context;
      const projectId = data.projectId;

      const { data: project, error: projErr } = await supabase
        .from("user_projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      if (projErr || !project) {
        throw new Error("Project not found or access denied");
      }

      const baseSlug = `template-${project.id.slice(0, 8)}`;

      // A project can be published more than once; slug is unique, so make it so.
      const { data: existing } = await supabase
        .from("marketplace_listings")
        .select("slug")
        .like("slug", `${baseSlug}%`);
      const slug = existing?.length ? `${baseSlug}-${existing.length + 1}` : baseSlug;

      const { data: inserted, error: insertErr } = await supabase
        .from("marketplace_listings")
        .insert([
          {
            slug,
            title: project.title || "Untitled Cinematic Template",
            description:
              "An AI-generated cinematic scroll experience built in Signhify Scroll Studio.",
            category: "Template",
            price_cents: 0,
            preview_url: `/projects/${project.id}`,
            asset_path: null,
            status: "pending",
            is_active: false,
            creator_id: project.user_id || userId,
          },
        ])
        .select("id, slug, title")
        .single();

      if (insertErr) {
        console.error("Insert error:", insertErr);
        throw new Error(
          insertErr.code === "23505"
            ? "This project is already listed on the marketplace."
            : `Could not publish listing: ${insertErr.message}`,
        );
      }

      return {
        success: true as const,
        listing: inserted,
        status: "pending" as const,
        message: "Submitted for review — it goes live once approved.",
      };
    } catch (e: any) {
      console.error("[publishProjectToMarketplace]", e);
      throw new Error(e.message || "Failed to publish to marketplace");
    }
  });

/** Public detail read for one approved marketplace listing. */
export const fetchListingDetail = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const slug = String((input as any)?.slug ?? "").trim();
    if (!slug) throw new Error("Slug required");
    return { slug };
  })
  .handler(async ({ data }) => {
    try {
      const { fetchListingBySlug } = await import("@/lib/marketplace.server");
      const row = await fetchListingBySlug(data.slug);
      if (!row) {
        const fallback = MARKET.find((m) => m.slug === data.slug) ?? null;
        return { listing: fallback };
      }
      const item: MarketItem = {
        id: row.id,
        slug: row.slug,
        name: row.title,
        blurb: row.description ?? "Marketplace listing",
        category: (row.category as MarketItem["category"]) ?? "Template",
        price: Math.round((row.price_cents ?? 0) / 100),
        price_cents: row.price_cents ?? 0,
        preview_url: row.preview_url,
        asset_path: null,
        tags: row.category ? [row.category] : [],
        accent: "linear-gradient(135deg, oklch(0.72 0.21 45), oklch(0.22 0.06 260))",
        badge: (row.price_cents ?? 0) === 0 ? "Free" : undefined,
        promo_video: Boolean(row.promo_video_url),
      };
      return { listing: item };
    } catch (err) {
      console.error("[marketplace] detail serverFn failed", err);
      return { listing: MARKET.find((m) => m.slug === data.slug) ?? null };
    }
  });
