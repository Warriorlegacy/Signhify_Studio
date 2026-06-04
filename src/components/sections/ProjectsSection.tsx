import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { projects, type Project } from "@/lib/projects";

// Category → gradient + label energy (preset-gallery vibe)
const CATEGORY_STYLE: Record<string, { from: string; to: string; tag: string }> = {
  "SaaS Product": { from: "oklch(0.72 0.21 45)", to: "oklch(0.45 0.18 30)", tag: "Saas" },
  "AI Automation": { from: "oklch(0.78 0.16 70)", to: "oklch(0.4 0.12 280)", tag: "AI" },
  "AI Marketplace": { from: "oklch(0.7 0.18 320)", to: "oklch(0.35 0.1 260)", tag: "Marketplace" },
  EdTech: { from: "oklch(0.7 0.15 200)", to: "oklch(0.3 0.08 240)", tag: "EdTech" },
  "Internal Tool": { from: "oklch(0.6 0.12 160)", to: "oklch(0.25 0.04 220)", tag: "Tool" },
  "Developer Tools": { from: "oklch(0.65 0.18 250)", to: "oklch(0.25 0.06 260)", tag: "DevTools" },
  "Non-Profit": { from: "oklch(0.75 0.14 130)", to: "oklch(0.3 0.06 180)", tag: "NGO" },
  Bookings: { from: "oklch(0.7 0.16 50)", to: "oklch(0.3 0.08 30)", tag: "Booking" },
  "Brand Platform": { from: "oklch(0.65 0.18 350)", to: "oklch(0.25 0.08 320)", tag: "Brand" },
  "Business Web": { from: "oklch(0.6 0.14 60)", to: "oklch(0.25 0.06 40)", tag: "Web" },
  "Performance Marketing": { from: "oklch(0.72 0.21 45)", to: "oklch(0.3 0.12 20)", tag: "Growth" },
};

function styleFor(category: string) {
  return (
    CATEGORY_STYLE[category] ?? {
      from: "oklch(0.72 0.21 45)",
      to: "oklch(0.25 0.06 260)",
      tag: category,
    }
  );
}

export function ProjectsSection({ limit }: { limit?: number }) {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const base = filter === "All" ? projects : projects.filter((p) => p.category === filter);
    return limit ? base.slice(0, limit) : base;
  }, [filter, limit]);

  return (
    <section className="relative py-28 bg-surface/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
              Preset Gallery · Beta
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
              Best previews. Real founders. Real shipped products.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Every project here is a real Signhify build — their brief, their industry,
              their visual taste — shared with consent so you can start from something
              proven. Pick one. Make it yours. Ship it.
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
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`text-xs rounded-full border px-3 py-1.5 transition ${
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const s = styleFor(p.category);
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/60 transition shadow-[var(--shadow-card)] flex flex-col"
              >
                {/* PRESET PREVIEW SURFACE */}
                <button
                  onClick={() => setActive(p)}
                  className="relative block aspect-[16/10] w-full overflow-hidden text-left"
                  aria-label={`Preview ${p.name}`}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
                    }}
                  />
                  {/* dotted texture */}
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  {/* big watermark name */}
                  <div className="absolute inset-0 flex items-end p-5">
                    <div
                      className="font-display font-black tracking-tight leading-[0.9] text-background/90"
                      style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)" }}
                    >
                      {p.name}
                    </div>
                  </div>
                  {/* corner chip */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {s.tag}
                  </div>
                  <div className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full bg-background/60 backdrop-blur-md border border-white/15 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <ArrowUpRight size={14} />
                  </div>
                  {/* fade to card */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                </button>

                {/* Card body */}
                <div className="relative p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      {p.name} —{" "}
                      <span className="text-muted-foreground font-medium">{p.category}</span>
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {p.blurb}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <Link
                      to="/contact"
                      onClick={() => {
                        try {
                          sessionStorage.setItem(
                            "signhify:prompt",
                            `Build me something like ${p.name} — ${p.blurb}`,
                          );
                        } catch {
                          /* noop */
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/25 transition"
                    >
                      <Sparkles size={12} /> Customize
                    </Link>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 transition"
                    >
                      <ExternalLink size={12} /> Preview
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border border-primary/30 bg-card shadow-[var(--shadow-glow)] overflow-hidden"
            >
              <div
                className="relative h-40"
                style={{
                  background: `linear-gradient(135deg, ${styleFor(active.category).from} 0%, ${styleFor(active.category).to} 100%)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(oklch(1 0 0 / 0.25) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
              </div>
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/60 backdrop-blur text-muted-foreground hover:text-foreground transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="relative p-8 sm:p-10 -mt-10">
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary">
                  {active.category}
                </div>
                <h3 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
                  {active.name}
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {active.blurb}
                </p>
                {active.metric && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                    {active.metric}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
                  >
                    Visit live site
                    <ExternalLink size={14} />
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
                    onClick={() => setActive(null)}
                  >
                    Build something like this
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
