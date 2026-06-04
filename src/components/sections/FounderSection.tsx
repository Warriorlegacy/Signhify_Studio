import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export function FounderSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
            Founder
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
            Built by <span className="text-gradient">Piyush Raj Singh</span> — engineer,
            founder, AI native.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            14+ shipped products across SaaS, AI automation, EdTech and NGO platforms.
            Signhify is the studio I always wanted to hire — one that treats software like
            a film: scripted, designed and shipped with conviction.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-6px_var(--primary-glow)] hover:brightness-110 transition"
            >
              Work with us
            </Link>
            <a
              href="https://linkedin.com/in/piyushraj-singh"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold hover:border-primary/60 transition"
            >
              Founder on LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
