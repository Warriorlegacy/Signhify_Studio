import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

const STATS = [
  { value: 14, suffix: "+", label: "Products shipped" },
  { value: 5, suffix: "", label: "SaaS platforms live" },
  { value: 2, suffix: "", label: "Countries" },
  { value: 100, suffix: "k+", label: "End users reached" },
];

function useCountUp(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const duration = 1800;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, inView]);
  return count;
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(value, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <div className="font-display text-4xl sm:text-5xl font-black text-gradient">
        {count}
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  );
}

export function FounderSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.1]);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Aurora background orb */}
      <motion.div
        style={{ scale: orbScale, y: bgY }}
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[70vw] h-[70vw] max-w-3xl rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.72 0.21 45 / 0.7), oklch(0.78 0.16 70 / 0.3) 50%, transparent 75%)",
          }}
        />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 relative">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs uppercase tracking-[0.25em] text-primary mb-4"
        >
          Founder
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
        >
          Built by{" "}
          <span className="text-gradient">Piyush Raj Singh</span>
          {" "}— engineer, founder, AI native.
        </motion.h2>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 mx-auto max-w-3xl relative"
        >
          <div className="rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-md p-8 text-center relative overflow-hidden">
            {/* Gradient border */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.21 45 / 0.5), transparent 40%, oklch(0.78 0.16 70 / 0.3))",
                maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: 1,
              }}
              aria-hidden
            />
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              "14+ shipped products across SaaS, AI automation, EdTech and NGO platforms. Signhify is
              the studio I always wanted to hire — one that treats software like a film: scripted,
              designed and shipped with conviction."
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-primary/60" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Piyush Raj Singh · Founder
              </span>
              <div className="h-px w-8 bg-primary/60" />
            </div>
          </div>
        </motion.div>

        {/* Stat counters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
