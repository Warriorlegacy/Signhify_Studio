import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://signhify.online";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { projects } = await import("@/lib/projects");
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/projects", priority: "0.9", changefreq: "weekly" },
          { path: "/services", priority: "0.9", changefreq: "monthly" },
          { path: "/ai", priority: "0.8", changefreq: "weekly" },
          { path: "/templates", priority: "0.7", changefreq: "monthly" },
          { path: "/marketplace", priority: "0.7", changefreq: "monthly" },
          { path: "/pricing", priority: "0.8", changefreq: "monthly" },
          { path: "/vision", priority: "0.7", changefreq: "monthly" },
          { path: "/sprint", priority: "0.6", changefreq: "weekly" },
          { path: "/about", priority: "0.7", changefreq: "monthly" },
          { path: "/contact", priority: "0.8", changefreq: "monthly" },
          { path: "/book", priority: "0.8", changefreq: "monthly" },
          { path: "/roadmap", priority: "0.7", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
          ...projects.map((p) => ({
            path: `/projects/${p.slug}`,
            priority: "0.6",
            changefreq: "monthly" as const,
          })),
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
