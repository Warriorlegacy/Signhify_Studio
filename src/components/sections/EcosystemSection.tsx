import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const layers = [
  {
    name: "Signhify Studio",
    year: "Week 1 · June",
    status: "live",
    desc: "AI engineering studio. Revenue-generating today.",
  },
  {
    name: "Signhify AI",
    year: "Week 2 · June",
    status: "soon",
    desc: "Vibe-coding platform. Prompt-to-product builder.",
  },
  {
    name: "Signhify Deploy",
    year: "Week 3 · June",
    status: "planned",
    desc: "One-click deployment infrastructure for AI apps.",
  },
  {
    name: "Signhify Marketplace",
    year: "Week 3 · June",
    status: "planned",
    desc: "Templates, agents and blueprints, community-built.",
  },
  {
    name: "Signhify Cloud",
    year: "Week 4 · June",
    status: "planned",
    desc: "Managed infrastructure for AI-native businesses.",
  },
  {
    name: "Signhify OS",
    year: "June 30, 2026",
    status: "planned",
    desc: "An operating system for running an AI business end-to-end.",
  },
];

const statusConfig = {
  live: {
    badgeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    label: "LIVE",
  },
  soon: {
    badgeClass: "border-amber-500/50 bg-amber-500/10 text-amber-400",
    icon: Clock,
    iconClass: "text-amber-400",
    label: "SOON",
  },
  planned: {
    badgeClass: "border-border text-muted-foreground",
    icon: Circle,
    iconClass: "text-muted-foreground",
    label: "PLANNED",
  },
} as const;

export function EcosystemSection() {
  return (
    <section className="relative py-28 bg-surface/20 border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Sprint completed · 6 products shipped
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
          Live now. Studio and AI are shipping. The rest is queued.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Studio is live and generating revenue. AI is in preview — try the prompt-to-product
          pipeline. Deploy, Marketplace, Cloud, and OS are built and queued for launch.
        </p>

        <div className="mt-14 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-amber to-transparent" />
          <div className="space-y-4">
            {layers.map((l, i) => {
              const cfg = statusConfig[l.status];
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
                  <div
                    className={`absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border bg-background ${
                      l.status === "live"
                        ? "border-emerald-500/50"
                        : l.status === "soon"
                          ? "border-amber-500/50"
                          : "border-border"
                    }`}
                  >
                    <Icon size={l.status === "planned" ? 12 : 16} className={cfg.iconClass} />
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-display text-lg font-semibold">{l.name}</div>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground max-w-xl">{l.desc}</p>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground">{l.year}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
