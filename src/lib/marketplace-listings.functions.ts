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

      const slug = `template-${project.id.slice(0, 8)}`;

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
            creator_id: project.user_id || userId,
          },
        ])
        .select("id, slug, title")
        .single();

      if (insertErr) {
        console.error("Insert error:", insertErr);
        throw new Error("Failed to insert marketplace listing");
      }

      return { success: true as const, listing: inserted };
    } catch (e: any) {
      console.error("[publishProjectToMarketplace]", e);
      throw new Error(e.message || "Failed to publish to marketplace");
    }
  });

