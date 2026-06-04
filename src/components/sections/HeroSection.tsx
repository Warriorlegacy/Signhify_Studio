import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroBackground } from "../HeroBackground";

const words = ["Describe", "your", "idea.", "Signhify", "builds", "it."];

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] flex items-center pt-24 pb-20">
      <HeroBackground />

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          <Sparkles size={14} />
          AI Engineering Studio · Building the future ecosystem
        </motion.div>

        <h1 className="mt-6 font-display font-black tracking-tight text-5xl sm:text-7xl lg:text-8xl leading-[0.95] max-w-5xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.25em] ${
                w === "Signhify" ? "text-gradient" : ""
              }`}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          We design, engineer and ship AI-first software for ambitious founders and
          teams — SaaS platforms, automation, CRMs and growth systems. End-to-end,
          from idea to revenue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-6px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Start a project
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 backdrop-blur px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/60 transition"
          >
            See the work
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border/60"
        >
          {[
            { k: "14+", v: "Shipped products" },
            { k: "6", v: "Industries served" },
            { k: "100%", v: "AI-native delivery" },
            { k: "2030", v: "Ecosystem roadmap" },
          ].map((s) => (
            <div key={s.v} className="bg-background/80 backdrop-blur px-6 py-6">
              <div className="font-display text-3xl font-bold text-gradient">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
