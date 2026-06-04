import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { projects } from "@/lib/projects";

export function ProjectsSection({ limit }: { limit?: number }) {
  const items = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="relative py-28 bg-surface/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p, i) => (
            <motion.a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition shadow-[var(--shadow-card)]"
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
              <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                   style={{
                     background:
                       "radial-gradient(600px circle at var(--x,50%) var(--y,0%), oklch(0.72 0.21 45 / 0.10), transparent 40%)",
                   }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
