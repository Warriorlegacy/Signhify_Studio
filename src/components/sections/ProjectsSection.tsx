import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, Sparkles, Layers } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { projects, type Project } from "@/lib/projects";
import { ThreeDCard } from "@/components/ui/ThreeDCard";

// Category → gradient + label energy (preset-gallery vibe)
const CATEGORY_STYLE: Record<string, { from: string; to: string; tag: string }> = {
  "SaaS Product": { from: "oklch(0.72 0.21 45)", to: "oklch(0.35 0.14 30)", tag: "Saas" },
  "AI Automation": { from: "oklch(0.78 0.16 70)", to: "oklch(0.3 0.12 280)", tag: "AI" },
  "AI Marketplace": { from: "oklch(0.7 0.18 320)", to: "oklch(0.3 0.1 260)", tag: "Marketplace" },
  EdTech: { from: "oklch(0.7 0.15 200)", to: "oklch(0.25 0.08 240)", tag: "EdTech" },
  "Internal Tool": { from: "oklch(0.6 0.12 160)", to: "oklch(0.22 0.04 220)", tag: "Tool" },
  "Developer Tools": { from: "oklch(0.65 0.18 250)", to: "oklch(0.22 0.06 260)", tag: "DevTools" },
  "Non-Profit": { from: "oklch(0.75 0.14 130)", to: "oklch(0.25 0.06 180)", tag: "NGO" },
  Bookings: { from: "oklch(0.7 0.16 50)", to: "oklch(0.25 0.08 30)", tag: "Booking" },
  "Brand Platform": { from: "oklch(0.65 0.18 350)", to: "oklch(0.22 0.08 320)", tag: "Brand" },
  "Business Web": { from: "oklch(0.6 0.14 60)", to: "oklch(0.22 0.06 40)", tag: "Web" },
  "Performance Marketing": {
    from: "oklch(0.72 0.21 45)",
    to: "oklch(0.25 0.12 20)",
    tag: "Growth",
  },
  Fintech: { from: "oklch(0.68 0.16 230)", to: "oklch(0.2 0.08 260)", tag: "Fintech" },
  Analytics: { from: "oklch(0.7 0.16 180)", to: "oklch(0.22 0.06 240)", tag: "Analytics" },
  "AI Education": { from: "oklch(0.74 0.18 90)", to: "oklch(0.3 0.1 300)", tag: "AI EDU" },
  "Engineering Brand": {
    from: "oklch(0.62 0.2 350)",
    to: "oklch(0.22 0.06 280)",
    tag: "Engineering",
  },
};

function styleFor(category: string) {
  return (
    CATEGORY_STYLE[category] ?? {
      from: "oklch(0.72 0.21 45)",
      to: "oklch(0.22 0.06 260)",
      tag: category,
    }
  );
}

function sizeClass(size: Project["size"]) {
  switch (size) {
    case "lg":
      return "sm:col-span-2 lg:col-span-2 sm:row-span-2";
    case "md":
      return "sm:col-span-2 lg:col-span-2";
    default:
      return "";
  }
}

export function ProjectsSection({
  limit,
  items = projects,
}: {
  limit?: number;
  items?: Project[];
}) {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.category)))],
    [items],
  );

  const filtered = useMemo(() => {
    const base = filter === "All" ? items : items.filter((p) => p.category === filter);
    return limit ? base.slice(0, limit) : base;
  }, [filter, limit, items]);

  return (
    <section
      id="studio"
      className="relative py-28 bg-surface/20 border-y border-border"
      aria-labelledby="studio-heading"
    >
      {/* Section vignette */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, oklch(0.13 0.02 260) 0%, transparent 100%)" }}
      />
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
              Studio · Preset Gallery
            </div>
            <h2
              id="studio-heading"
              className="font-display text-4xl sm:text-5xl font-bold max-w-3xl"
            >
              A luxury product universe — built, shipped, signed.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Every entry below is a real Signhify build. Filter by track, hover to spotlight, open
              one to step inside the brief.
            </p>
          </div>
          {limit && (
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View full gallery <ArrowUpRight size={16} />
            </Link>
          )}
        </div>

        {!limit && (
          <div
            className="mb-10 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Project categories"
          >
            {categories.map((c) => {
              const on = filter === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(c)}
                  className={`text-xs rounded-full border px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                    on
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-surface/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {/* Bento grid — featured items span larger */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(280px,auto)] gap-5">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.slug}
              p={p}
              i={i}
              onOpen={() => setActive(p)}
              spanClass={limit ? "" : sizeClass(p.size)}
            />
          ))}
        </div>
      </div>

      {/* Side panel detail */}
      <AnimatePresence>
        {active && <ProjectPanel project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  p,
  i,
  onOpen,
  spanClass,
}: {
  p: Project;
  i: number;
  onOpen: () => void;
  spanClass: string;
}) {
  const s = styleFor(p.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px 0px" }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
      className={spanClass}
    >
      <ThreeDCard className="relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/60 transition shadow-(--shadow-card) flex flex-col h-full w-full">
        {/* PRESET COVER */}
        <button
          onClick={onOpen}
          className="relative block w-full aspect-16/10 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          aria-label={`Open ${p.name} preview`}
        >
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
              style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
            />
          )}
          {/* subtle dark overlay */}
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
          {/* dotted texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: "radial-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute inset-0 flex items-end p-5">
            <div
              className="font-display font-black tracking-tight leading-[0.9] text-background/95 drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
              style={{ fontSize: "clamp(1.8rem, 3.8vw, 3.4rem)" }}
            >
              {p.name}
            </div>
          </div>
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {s.tag}
          </div>
          <div className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full bg-background/60 backdrop-blur-md border border-white/15 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition">
            <ArrowUpRight size={14} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />
        </button>

        {/* BODY */}
        <div className="relative p-5 flex flex-col gap-3 flex-1 z-2">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-tight">
              {p.name} <span className="text-muted-foreground font-medium">· {p.category}</span>
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.blurb}</p>
          <div className="flex flex-wrap gap-1.5">
            {(p.stack ?? p.tags).slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-3 flex items-center gap-2">
            <button
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Sparkles size={12} /> Open brief
            </button>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 transition"
            >
              <ExternalLink size={12} /> Visit
            </a>
          </div>
        </div>
      </ThreeDCard>
    </motion.div>
  );
}

function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const s = styleFor(project.category);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex justify-end bg-background/80 backdrop-blur"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} brief`}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full sm:max-w-xl bg-card border-l border-primary/30 shadow-(--shadow-glow) overflow-y-auto"
      >
        <div className="relative h-48 overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 h-full w-full"
              style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-card" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: "radial-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close brief"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/70 backdrop-blur border border-white/15 text-muted-foreground hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <X size={18} />
          </button>
          <div className="absolute top-4 left-5 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
            <Layers size={11} /> {project.category}
            {project.year && <span className="text-muted-foreground">· {project.year}</span>}
          </div>
        </div>

        <div className="p-8 sm:p-10 -mt-12 relative">
          <h3 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            {project.name}
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.blurb}</p>

          {project.metric && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
              {project.metric}
            </div>
          )}

          {project.stack && (
            <div className="mt-8">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
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

          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Surface</div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
              onClick={onClose}
            >
              Open full brief
              <ArrowUpRight size={14} />
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
            >
              Visit live site
              <ExternalLink size={14} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
              onClick={onClose}
            >
              Build something like this
            </Link>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
