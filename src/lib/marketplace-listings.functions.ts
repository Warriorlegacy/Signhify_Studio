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
