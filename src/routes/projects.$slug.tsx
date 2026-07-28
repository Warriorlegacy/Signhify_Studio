import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Layers, Sparkles } from "lucide-react";
import { getPublicProjectBySlug } from "@/lib/projects-list.functions";
import { ThreeDDevicePreview } from "@/components/three/ThreeDDevicePreview";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    try {
      const { project } = await getPublicProjectBySlug({ data: { slug: params.slug } });
      if (!project) throw notFound();
      return { project };
    } catch (e) {
      console.error("[projects.$slug] loader failed:", e);
      const { projects } = await import("@/lib/projects");
      const project = projects.find((p) => p.slug === params.slug);
      if (!project) throw notFound();
      return { project };
    }
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) {
      return { meta: [{ title: "Project Case Study — Signhify AI Studio" }] };
    }
    const rawTitle = `${p.name} — AI Built Case Study | Signhify`;
    const title =
      rawTitle.length >= 50 && rawTitle.length <= 60
        ? rawTitle
        : `${p.name} — AI SaaS Case Study | Signhify Studio`;
    const description = `${p.blurb} Built & shipped by Signhify AI Engineering Studio.`;
    const url = `https://signhify.dpdns.org/projects/${p.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.blurb,
            url,
            applicationCategory: p.category || "BusinessApplication",
            operatingSystem: "Web",
            creator: {
              "@type": "Organization",
              name: "Signhify",
              url: "https://signhify.dpdns.org",
            },
            keywords: p.tags ? p.tags.join(", ") : "AI, SaaS",
            ...(p.year ? { dateCreated: String(p.year) } : {}),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <section className="pt-40 pb-24 mx-auto max-w-3xl px-6 text-center">
      <h1 className="font-display text-4xl font-bold">Project not found</h1>
      <p className="mt-3 text-muted-foreground">
        That brief doesn’t exist yet. Browse the full gallery.
      </p>
      <Link
        to="/projects"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        <ArrowLeft size={14} /> All projects
      </Link>
    </section>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project: p } = Route.useLoaderData();
  return (
    <article className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <Breadcrumbs items={[{ label: "Projects", to: "/projects" }, { label: p.name }]} />
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        {/* 3D Immersive Hero Section Grid */}
        <div className="mt-8 grid md:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary">
              <Layers size={11} /> {p.category}
              {p.year && <span className="text-muted-foreground">· {p.year}</span>}
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
              {p.name}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {p.blurb}
            </p>

            {p.metric && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground">
                <Sparkles size={12} className="text-primary" /> {p.metric}
              </div>
            )}
          </div>

          {/* 3D device frame mockup */}
          <div className="relative border border-border bg-card/30 backdrop-blur rounded-3xl overflow-hidden aspect-4/3 sm:aspect-square flex items-center justify-center shadow-(--shadow-card)">
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ background: "var(--gradient-ember)" }}
            />
            <ThreeDDevicePreview
              accentColor={p.category.includes("AI") ? "#c084fc" : "#ff7a2a"}
              className="w-full h-full"
            />
          </div>
        </div>

        {p.image && (
          <div className="mt-16 border border-border bg-card/15 rounded-3xl overflow-hidden shadow-(--shadow-card) p-2.5 backdrop-blur-md">
            <div className="text-xs uppercase tracking-[0.22em] text-primary mb-3.5 px-4 pt-3.5 font-bold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live Workspace Interface
            </div>
            <img
              src={p.image}
              alt={`${p.name} UI interface preview`}
              className="w-full rounded-2xl border border-border object-cover aspect-16/10 shadow-inner"
              loading="eager"
            />
          </div>
        )}

        {p.story && (
          <div className="mt-16 max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-3">
              The Story
            </div>
            <div className="space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {p.story}
            </div>
          </div>
        )}

        {p.gallery && p.gallery.length > 0 && (
          <div className="mt-16">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-4">Gallery</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {p.gallery.map((src: string, i: number) => (
                <div
                  key={src}
                  className="border border-border bg-card/20 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] backdrop-blur-md"
                >
                  <img
                    src={src}
                    alt={`${p.name} — visual ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 grid sm:grid-cols-2 gap-6 pt-8 border-t border-border">
          {p.stack && p.stack.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((t: string) => (
                  <span
                    key={t}
                    className="text-[11px] rounded-full border border-border bg-surface px-2.5 py-0.5 text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Surface</div>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t: string) => (
                <span
                  key={t}
                  className="text-[11px] rounded-full border border-border bg-surface px-2.5 py-0.5 text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Visit live site <ExternalLink size={14} />
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
          >
            Build something like this
          </Link>
        </div>
      </div>
    </article>
  );
}
