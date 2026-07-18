import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const layers = [
  {
    name: "Signhify Studio",
    year: "Live now",
    status: "live",
    desc: "AI engineering studio. Revenue-generating today.",
    href: "/",
  },
  {
    name: "Signhify AI",
    year: "Live now",
    status: "live",
    desc: "Prompt-to-product pipeline. 6-agent generation, streaming, and builder.",
    href: "/ai",
  },
  {
    name: "Signhify Deploy",
    year: "Live now",
    status: "live",
    desc: "One-click deployment dashboard for Cloudflare Pages and custom domains.",
    href: "/app/deploy",
  },
  {
    name: "Signhify Marketplace",
    year: "Live now",
    status: "live",
    desc: "Browse, sell, and purchase templates and agents with Stripe checkout.",
    href: "/marketplace",
  },
  {
    name: "Signhify Cloud",
    year: "Live now",
    status: "live",
    desc: "Workspace dashboard, project management, secrets vault, and analytics.",
    href: "/app",
  },
  {
    name: "Signhify OS",
    year: "Live now",
    status: "live",
    desc: "Agent orchestration runtime. Manage agents, workflows, and system logs.",
    href: "/os",
  },
];

const statusConfig = {
  live: {
    badgeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    label: "LIVE",
  },
  preview: {
    badgeClass: "border-violet-500/50 bg-violet-500/10 text-violet-400",
    icon: Sparkles,
    iconClass: "text-violet-400",
    label: "PREVIEW",
  },
  soon: {
    badgeClass: "border-teal-500/50 bg-teal-500/10 text-teal-400",
    icon: Clock,
    iconClass: "text-teal-400",
    label: "SOON",
  },
} as const;

export function EcosystemSection() {
  return (
    <section className="relative py-28 bg-surface/20 border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          The Signhify Ecosystem
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
          One studio. Six products. Built for the AI-native era.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          From cinematic studio sites to autonomous agent runtimes — every product is
          accessible from your dashboard.
        </p>

        <div className="mt-14 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-amber to-transparent" />
          <div className="space-y-4">
            {layers.map((l, i) => {
              const cfg = statusConfig[l.status as keyof typeof statusConfig];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "100px 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative pl-12"
                >
                  <Link
                    to={l.href}
                    className="block rounded-2xl border border-border bg-card p-5 flex flex-wrap items-center justify-between gap-3 hover:border-primary/40 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border bg-background ${
                          l.status === "live"
                            ? "border-emerald-500/50"
                            : l.status === "preview"
                              ? "border-violet-500/50"
                              : "border-teal-500/50"
                        }`}
                      >
                        <Icon size={l.status === "preview" ? 15 : 16} className={cfg.iconClass} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`font-display text-lg font-semibold group-hover:text-primary transition`}>
                            {l.name}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground max-w-xl">{l.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{l.year}</span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
