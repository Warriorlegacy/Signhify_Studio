import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

const layers = [
  { name: "Signhify Studio", year: "2026", status: "live", desc: "AI engineering studio. Revenue-generating today." },
  { name: "Signhify AI", year: "2027", status: "soon", desc: "Vibe-coding platform. Prompt-to-product builder." },
  { name: "Signhify Deploy", year: "2028", status: "planned", desc: "One-click deployment infrastructure for AI apps." },
  { name: "Signhify Marketplace", year: "2028", status: "planned", desc: "Templates, agents and blueprints, community-built." },
  { name: "Signhify Cloud", year: "2029", status: "planned", desc: "Managed infrastructure for AI-native businesses." },
  { name: "Signhify OS", year: "2030", status: "planned", desc: "An operating system for running an AI business end-to-end." },
];

export function EcosystemSection() {
  return (
    <section className="relative py-28 bg-surface/20 border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          The roadmap
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
          We&rsquo;re not building an agency. We&rsquo;re building an ecosystem.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Today: a world-class AI engineering studio. Tomorrow: the platform that
          turns any idea into a deployed AI product.
        </p>

        <div className="mt-14 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-amber to-transparent" />
          <div className="space-y-4">
            {layers.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-background">
                  {l.status === "live" ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : (
                    <Circle size={12} className="text-primary/70" />
                  )}
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-display text-lg font-semibold">{l.name}</div>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          l.status === "live"
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xl">{l.desc}</p>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground">{l.year}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
