import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { EmberParticles } from "@/components/EmberParticles";

const TRUST_SIGNALS = [
  "14+ products shipped",
  "Multi-tenant SaaS",
  "AI-first engineering",
  "Delivered in weeks",
];

export function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ember radial backdrop */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-ember)" }} />
      {/* Grid layer */}
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30" />
      {/* Ember particles for depth */}
      <EmberParticles count={20} />

      {/* Animated border pulse ring */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[600px] h-[600px] rounded-full border border-primary/30"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute w-[800px] h-[800px] rounded-full border border-primary/20"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Trust chips */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {TRUST_SIGNALS.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {s}
            </span>
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-6xl font-black leading-[1.05]"
        >
          Your idea, <span className="text-gradient">Signhified.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          One call. We&rsquo;ll scope your idea, map the stack, and tell you exactly what it takes
          to ship it — fast, cinematic, production-ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_60px_-8px_var(--primary-glow)] hover:brightness-110 hover:shadow-[0_0_80px_-4px_var(--primary-glow)] transition"
          >
            Start a Project
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
          </Link>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-surface/50 backdrop-blur px-7 py-4 text-base font-semibold hover:border-primary/50 hover:bg-surface/70 transition"
          >
            <MessageSquare size={18} className="text-primary" />
            Book a free call
          </Link>
        </motion.div>

        {/* Micro social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          No commitment. No slide deck required. Just your idea.
        </motion.p>
      </div>
    </section>
  );
}
