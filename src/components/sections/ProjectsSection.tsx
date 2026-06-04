import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { projects, type Project } from "@/lib/projects";

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
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
              Selected work
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-2xl">
              Shipped products. Real users. Real revenue.
            </h2>
          </div>
          {limit && (
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View all projects <ArrowUpRight size={16} />
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.button
              key={p.slug}
              onClick={() => setActive(p)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className="group relative text-left overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  {p.category}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
                />
              </div>
              <div className="mt-4 font-display text-2xl font-semibold">{p.name}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {p.blurb}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{
                  background:
                    "radial-gradient(600px circle at 50% 0%, oklch(0.72 0.21 45 / 0.12), transparent 60%)",
                }}
              />
            </motion.button>
          ))}
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
                className="absolute inset-x-0 top-0 h-32 pointer-events-none"
                style={{ background: "var(--gradient-ember)" }}
              />
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="relative p-8 sm:p-10">
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
