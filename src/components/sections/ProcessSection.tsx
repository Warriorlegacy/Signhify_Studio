import { motion } from "framer-motion";
import { MessageSquareText, Palette, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Describe",
    desc: "You share the idea. We map outcomes, scope and stack in one working session.",
    icon: MessageSquareText,
    accent: "oklch(0.72 0.18 250)",
  },
  {
    n: "02",
    title: "Design",
    desc: "Cinematic UI, product architecture and AI surfaces — prototyped in days, not months.",
    icon: Palette,
    accent: "oklch(0.74 0.18 320)",
  },
  {
    n: "03",
    title: "Build",
    desc: "Engineered with modern stacks. Multi-tenant, typed, automated, production-ready.",
    icon: Wrench,
    accent: "oklch(0.72 0.21 45)",
  },
  {
    n: "04",
    title: "Launch",
    desc: "We ship to your domain, wire analytics, payments and AI ops — and stay on for v2.",
    icon: Rocket,
    accent: "oklch(0.7 0.16 130)",
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
          How we work
        </div>
        <h2 id="process-heading" className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
          From a sentence to a shipped product — in weeks.
        </h2>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.18 250 / 0.3), oklch(0.72 0.21 45 / 0.5), oklch(0.7 0.16 130 / 0.3))",
            }}
            aria-hidden
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="relative rounded-2xl border border-border bg-card p-7 overflow-hidden hover:border-primary/50 transition-colors h-full">
                {/* Large watermark number */}
                <div className="absolute -top-6 -right-6 font-display text-7xl font-black text-primary/8 select-none pointer-events-none">
                  {s.n}
                </div>

                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${s.accent} / 0.08, transparent 70%)`,
                  }}
                />

                {/* Icon + step number */}
                <div className="relative flex items-center gap-3 mb-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${s.accent} 12%, transparent)`,
                      borderColor: `color-mix(in oklch, ${s.accent} 30%, transparent)`,
                    }}
                  >
                    <s.icon size={18} style={{ color: s.accent }} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Step {s.n}</span>
                </div>

                <div className="relative font-display text-xl font-semibold">{s.title}</div>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
