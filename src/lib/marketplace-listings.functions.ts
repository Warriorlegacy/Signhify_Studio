import { createServerFn } from "@tanstack/react-start";
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
        asset_path: row.asset_path,
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
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    if (!projectId) throw new Error("Project ID is required");
    return { projectId };
  })
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      // Fetch the project data
      const { data: project, error: projErr } = await (supabaseAdmin.from as any)("user_projects")
        .select("*")
        .eq("id", data.projectId)
        .single();

      if (projErr || !project) {
        throw new Error("Project not found");
      }

      const slug = `template-${project.id.slice(0, 8)}`;

      const { data: inserted, error: insertErr } = await (supabaseAdmin.from as any)("marketplace_listings")
        .insert([
          {
            slug,
            title: project.title || "Untitled Cinematic Template",
            description: "An AI-generated cinematic scroll experience built in Signhify Scroll Studio.",
            category: "Template",
            price_cents: 0, // Free by default
            preview_url: `/projects/${project.id}`, // Route directly to a preview page
            asset_path: null,
            creator_id: project.user_id || "system",
          }
        ])
        .select()
        .single();

      if (insertErr) {
        console.error("Insert error:", insertErr);
        throw new Error("Failed to insert marketplace listing");
      }

      return { success: true, listing: inserted };
    } catch (e: any) {
      console.error("[publishProjectToMarketplace]", e);
      throw new Error(e.message || "Failed to publish to marketplace");
    }
  });
