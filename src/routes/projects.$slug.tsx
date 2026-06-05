import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Layers, Sparkles } from "lucide-react";
import { projects } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) {
      return { meta: [{ title: "Project — Signhify" }] };
    }
    const title = `${p.name} — Signhify`;
    const description = p.blurb;
    const url = `https://signhify.online/projects/${p.slug}`;
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
            "@type": "CreativeWork",
            name: p.name,
            description: p.blurb,
            url,
            creator: { "@type": "Organization", name: "Signhify" },
            keywords: p.tags.join(", "),
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
      <div className="mx-auto max-w-4xl px-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div
          className="mt-6 relative overflow-hidden rounded-3xl border border-border aspect-[16/8]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.21 45) 0%, oklch(0.22 0.06 260) 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: "radial-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
              <Layers size={11} /> {p.category}
              {p.year && <span className="text-muted-foreground">· {p.year}</span>}
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl font-black text-background drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]">
              {p.name}
            </h1>
          </div>
        </div>

        <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">{p.blurb}</p>

        {p.metric && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground">
            <Sparkles size={12} className="text-primary" /> {p.metric}
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {p.stack && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-foreground"
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
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
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
