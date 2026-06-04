import { motion } from "framer-motion";
import { EmberParticles } from "./EmberParticles";

/**
 * Cinematic hero backdrop: layered ember gradient, perspective grid,
 * pulsing orbs, ember particles, and a fading horizon line.
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ember radial glow */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-ember)" }}
      />
      {/* Grid */}
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-70" />

      {/* Ember particles */}
      <EmberParticles count={32} />


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
            <line
              key={`h-${i}`}
              x1={0}
              x2={1200}
              y1={y}
              y2={y}
              stroke="url(#lineFade)"
              strokeWidth={0.6}
            />
          );
        })}
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i / 23) * 1200;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              x2={600 + (x - 600) * 0.15}
              y1={0}
              y2={600}
              stroke="url(#lineFade)"
              strokeWidth={0.6}
            />
          );
        })}
      </svg>

      {/* Floating orbs */}
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
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: o.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
