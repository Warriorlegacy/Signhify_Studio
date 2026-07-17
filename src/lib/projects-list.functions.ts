import { createServerFn } from "@tanstack/react-start";
import { projects as staticProjects, type Project } from "@/lib/projects";

export const getPublicProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ projects: Project[] }> => {
    try {
      const { fetchProjects } = await import("@/lib/projects.server");
      const rows = await fetchProjects();
      if (!rows.length) return { projects: staticProjects };

      const mapped: Project[] = rows.map((p) => ({
        slug: p.slug,
        name: p.title,
        category: p.tags?.[0] ?? "Studio",
        url: p.live_url ?? `/projects/${p.slug}`,
        blurb: p.description ?? "Signhify project",
        tags: p.tags ?? [],
        stack: [],
        size: p.featured ? "md" : "sm",
        featured: !!p.featured,
        year: p.created_at ? new Date(p.created_at).getFullYear() : undefined,
      }));
      // Merge in static-only projects (e.g. new curated entries) missing from DB
      const dbSlugs = new Set(mapped.map((m) => m.slug));
      const extras = staticProjects.filter((s) => !dbSlugs.has(s.slug));
      return { projects: [...extras, ...mapped] };
    } catch (e) {
      console.error("[projects-list] getPublicProjects serverFn failed:", e);
      return { projects: staticProjects };
    }
  },
);

export const getPublicProjectBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => {
    const slug = typeof input === "string" ? input : input?.slug;
    if (!slug || typeof slug !== "string") throw new Error("Slug is required");
    return { slug };
  })
  .handler(async ({ data }): Promise<{ project: Project | null }> => {
    const { slug } = data;
    try {
      const { fetchProjectBySlug } = await import("@/lib/projects.server");
      const row = await fetchProjectBySlug(slug);
      if (!row) {
        const found = staticProjects.find((p) => p.slug === slug);
        return { project: found ?? null };
      }
      const project: Project = {
        slug: row.slug,
        name: row.title,
        category: row.tags?.[0] ?? "Studio",
        url: row.live_url ?? `/projects/${row.slug}`,
        blurb: row.description ?? "Signhify project",
        tags: row.tags ?? [],
        stack: [],
        size: row.featured ? "md" : "sm",
        featured: !!row.featured,
        year: row.created_at ? new Date(row.created_at).getFullYear() : undefined,
      };
      return { project };
    } catch (e) {
      console.error("[projects-list] getPublicProjectBySlug serverFn failed:", e);
      const found = staticProjects.find((p) => p.slug === slug);
      return { project: found ?? null };
    }
  });
