import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EmberParticles } from "./EmberParticles";
import { useReducedMotionPref } from "@/hooks/use-reduced-motion-pref";

/**
 * Cinematic hero backdrop with scroll-linked parallax depth.
 * Three layers move at different rates as the user scrolls,
 * so the hero "falls away" rather than scrolls away. Respects
 * prefers-reduced-motion (renders the static composition).
 */
export function HeroBackground() {
  const reduced = useReducedMotionPref();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Deep background scrolls fastest (closer), grid slower, orbs slowest.
  const yEmber = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const yGrid = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -160]);
  const yOrbs = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -240]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Ember radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "var(--gradient-ember)", y: yEmber, opacity }}
      />
      {/* Grid */}
      <motion.div
        className="absolute inset-0 bg-grid mask-fade-edges opacity-70"
        style={{ y: yGrid }}
      />

      {/* Ember particles — reduced count + skipped under reduced-motion */}
      <EmberParticles count={reduced ? 0 : 28} />

      {/* Perspective floor grid */}
      <svg
        viewBox="0 0 1200 600"
        className="absolute bottom-0 inset-x-0 w-full h-[55%] opacity-50"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.21 45)" stopOpacity="0" />
            <stop offset="60%" stopColor="oklch(0.72 0.21 45)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.72 0.21 45)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }).map((_, i) => {
          const y = (i / 15) * 600;
          return (
            <line key={`h-${i}`} x1={0} x2={1200} y1={y} y2={y} stroke="url(#lineFade)" strokeWidth={0.6} />
          );
        })}
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i / 23) * 1200;
          return (
            <line key={`v-${i}`} x1={x} x2={600 + (x - 600) * 0.15} y1={0} y2={600} stroke="url(#lineFade)" strokeWidth={0.6} />
          );
        })}
      </svg>

      {/* Floating orbs */}
      <motion.div style={{ y: yOrbs }} className="absolute inset-0">
        {[
          { x: "10%", y: "30%", size: 280, delay: 0 },
          { x: "75%", y: "20%", size: 360, delay: 1.2 },
          { x: "55%", y: "75%", size: 220, delay: 2.4 },
        ].map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: o.x,
              top: o.y,
              width: o.size,
              height: o.size,
              background:
                "radial-gradient(circle, oklch(0.72 0.21 45 / 0.35), transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={
              reduced
                ? undefined
                : { opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }
            }
            transition={{ duration: 7, repeat: Infinity, delay: o.delay, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
