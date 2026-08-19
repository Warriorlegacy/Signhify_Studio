import { createFileRoute } from "@tanstack/react-router";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { getPublicProjects } from "@/lib/projects-list.functions";
import { CtaSection } from "@/components/sections/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/projects")({
  loader: async () => {
    try {
      const { projects } = await getPublicProjects();
      return { projects };
    } catch (e) {
      console.error("[projects] loader failed:", e);
      const { projects: staticProjects } = await import("@/lib/projects");
      return { projects: staticProjects };
    }
  },
  head: () => ({
    meta: [
      { title: "AI Built Projects & SaaS Product Portfolio — Signhify" },
      {
        name: "description",
        content:
          "Explore 24 live SaaS platforms, AI automation systems, and growth software engineered and shipped globally by Signhify AI Product Studio.",
      },
      { property: "og:title", content: "AI Built Projects & SaaS Product Portfolio — Signhify" },
      {
        property: "og:description",
        content:
          "Selected work from Signhify: live SaaS platforms, AI automation systems, CRMs, and marketing tech.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/projects" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/projects" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Built Projects & SaaS Product Portfolio — Signhify",
          url: "https://signhify.dpdns.org/projects",
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
          <Breadcrumbs items={[{ label: "Projects", to: "/projects" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">The work</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
            Shipped products. <span className="text-gradient">Real businesses.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            A snapshot of products designed, engineered and launched by Signhify across SaaS, AI,
            EdTech, NGO and digital & performance marketing.
          </p>
        </div>
      </section>
      <ProjectsSection items={projects} />
      <CtaSection />
    </>
  );
}
