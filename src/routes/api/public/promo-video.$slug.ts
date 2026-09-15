import { createFileRoute } from "@tanstack/react-router";

/**
 * Streams the promo clip for a publicly live marketplace listing.
 * The bucket itself stays private; this redirects to a short-lived signed URL.
 */
export const Route = createFileRoute("/api/public/promo-video/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = String(params.slug ?? "").slice(0, 200);
        if (!slug) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: listing } = await supabaseAdmin
          .from("marketplace_listings")
          .select("promo_video_url, status, is_active")
          .eq("slug", slug)
          .maybeSingle();

        const path = (listing as { promo_video_url?: string | null } | null)?.promo_video_url;
        if (!listing || !path || listing.status !== "live" || listing.is_active === false) {
          return new Response("Not found", { status: 404 });
        }

        const { data: signed } = await supabaseAdmin.storage
          .from("promo-videos")
          .createSignedUrl(path, 3600);
        if (!signed?.signedUrl) return new Response("Not found", { status: 404 });

        return new Response(null, {
          status: 302,
          headers: { Location: signed.signedUrl, "Cache-Control": "public, max-age=600" },
        });
      },
    },
  },
});
