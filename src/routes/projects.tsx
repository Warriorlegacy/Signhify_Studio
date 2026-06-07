import { createFileRoute } from "@tanstack/react-router";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { projects as staticProjects, type Project } from "@/lib/projects";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/projects")({
  loader: async () => {
    const { fetchProjects } = await import("@/lib/projects.server");
    const rows = await fetchProjects();
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
    return { projects: mapped.length ? mapped : staticProjects };
  },
  head: () => ({
    meta: [
      { title: "Projects — Signhify" },
      {
        name: "description",
        content:
          "14+ shipped products across SaaS, AI automation, EdTech and growth — built and launched by Signhify.",
      },
      { property: "og:title", content: "Projects — Signhify" },
      {
        property: "og:description",
        content: "Selected work from Signhify: SaaS, AI automation, CRMs, marketing systems.",
      },
      { property: "og:url", content: "https://signhify.online/projects" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/projects" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects — Signhify",
          url: "https://signhify.online/projects",
          description:
            "Selected work from Signhify across SaaS, AI automation, CRMs and marketing systems.",
        }),
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = Route.useLoaderData();
  return (
    <>
      <section className="pt-36 pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">The work</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
            Shipped products. <span className="text-gradient">Real businesses.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            A snapshot of products designed, engineered and launched by Signhify across
            SaaS, AI, EdTech, NGO and performance marketing.
          </p>
        </div>
      </section>
      <ProjectsSection items={projects} />
      <CtaSection />
    </>
  );
}
