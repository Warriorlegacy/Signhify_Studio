import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/site-url";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { projects } = await import("@/lib/projects");
        const today = new Date().toISOString().split("T")[0];
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/projects", priority: "0.9", changefreq: "weekly" },
          { path: "/services", priority: "0.9", changefreq: "monthly" },
          { path: "/ai", priority: "0.9", changefreq: "weekly" },
          { path: "/marketplace", priority: "0.8", changefreq: "weekly" },
          { path: "/marketplace/sell", priority: "0.6", changefreq: "monthly" },
          { path: "/pricing", priority: "0.8", changefreq: "monthly" },
          { path: "/templates", priority: "0.7", changefreq: "monthly" },
          { path: "/vision", priority: "0.7", changefreq: "monthly" },
          { path: "/roadmap", priority: "0.7", changefreq: "monthly" },
          { path: "/about", priority: "0.7", changefreq: "monthly" },
          { path: "/contact", priority: "0.8", changefreq: "monthly" },
          { path: "/book", priority: "0.8", changefreq: "monthly" },
          { path: "/sprint", priority: "0.6", changefreq: "weekly" },
          { path: "/insights", priority: "0.9", changefreq: "weekly" },
          { path: "/brand", priority: "0.8", changefreq: "monthly" },
          { path: "/help", priority: "0.6", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
          { path: "/builder", priority: "0.5", changefreq: "monthly" },
          { path: "/publish", priority: "0.5", changefreq: "monthly" },
          { path: "/studio/spike", priority: "0.5", changefreq: "monthly" },
          { path: "/os", priority: "0.5", changefreq: "monthly" },
          { path: "/best-ai-engineering-studio", priority: "0.9", changefreq: "weekly" },
          { path: "/best-vibe-coding-platform", priority: "0.9", changefreq: "weekly" },
          { path: "/best-digital-marketing-studio", priority: "0.9", changefreq: "weekly" },
          { path: "/free-consultation", priority: "0.7", changefreq: "monthly" },
          { path: "/saas-mvp", priority: "0.8", changefreq: "weekly" },
          { path: "/us-ai-engineering-studio", priority: "0.95", changefreq: "weekly" },
          ...projects.map((p) => ({
            path: `/projects/${p.slug}`,
            priority: "0.6",
            changefreq: "monthly" as const,
          })),
        ];
        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
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
