import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Describe", desc: "You share the idea. We map outcomes, scope and stack in one working session." },
  { n: "02", title: "Design", desc: "Cinematic UI, product architecture and AI surfaces — prototyped in days, not months." },
  { n: "03", title: "Build", desc: "Engineered with modern stacks. Multi-tenant, typed, automated, production-ready." },
  { n: "04", title: "Launch", desc: "We ship to your domain, wire analytics, payments and AI ops — and stay on for v2." },
];

export function ProcessSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          How we work
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
          From a sentence to a shipped product — in weeks.
        </h2>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-7 overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 font-display text-7xl font-black text-primary/10 select-none">
                {s.n}
              </div>
              <div className="text-xs font-mono text-primary">{s.n}</div>
              <div className="mt-3 font-display text-xl font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
