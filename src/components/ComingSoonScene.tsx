import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  subdomain: string;
  description: string;
  week: string;
  bullets: string[];
};

export function ComingSoonScene({ eyebrow, title, subdomain, description, week, bullets }: Props) {
  return (
    <section className="relative isolate min-h-[100svh] flex items-center pt-32 pb-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-ember)" }}
      />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-40 pointer-events-none" />
      <motion.div
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.21 45 / 0.35), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          <Sparkles size={14} />
          {eyebrow} · ships {week}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 font-mono text-sm text-primary"
        >
          {subdomain}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 grid sm:grid-cols-2 gap-3 max-w-3xl"
        >
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-xl border border-border bg-card/60 backdrop-blur px-4 py-3 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)] shrink-0" />
              {b}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-6px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Get early access
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
          </Link>
          <Link
            to="/sprint"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 backdrop-blur px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/60 transition"
          >
            See the sprint
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
