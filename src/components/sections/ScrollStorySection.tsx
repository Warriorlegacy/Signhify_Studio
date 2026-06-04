import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/use-reduced-motion-pref";

/**
 * Sticky scroll storytelling — a pinned stage where each act
 * fades in/out as the viewer scrolls. Cinematic but light:
 * one sticky container, no scroll libraries, no IntersectionObserver.
 */
const SCENES = [
  {
    n: "01",
    chip: "Describe",
    title: "It starts with one sentence.",
    body:
      "You drop your idea — a CRM for gyms, an AI agent that ships reels, a fintech for diaspora. We map outcomes, stack and scope in a single working session.",
    accent: "oklch(0.72 0.21 45)",
  },
  {
    n: "02",
    chip: "Design",
    title: "Cinematic, in days.",
    body:
      "Brand system, product architecture and AI surfaces — prototyped fast, refined to a luxury finish. You see and feel the product before a line of business logic is written.",
    accent: "oklch(0.78 0.16 70)",
  },
  {
    n: "03",
    chip: "Build",
    title: "Engineered to ship.",
    body:
      "Modern stacks. Multi-tenant. Typed end-to-end. Auth, billing, dashboards, AI ops — all production-ready, not demo-ware.",
    accent: "oklch(0.88 0.14 90)",
  },
  {
    n: "04",
    chip: "Launch",
    title: "Live on your domain.",
    body:
      "We deploy to Vercel, Cloudflare or your stack. Analytics, payments, AI ops wired in. Then we stay on for v2, v3 — the part that compounds.",
    accent: "oklch(0.72 0.21 45)",
  },
];

export function ScrollStorySection() {
  const reduced = useReducedMotionPref();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map progress → active scene index (0..3)
  const progress = useTransform(scrollYProgress, [0, 1], [0, SCENES.length]);

  // Static fallback for reduced motion users
  if (reduced) {
    return (
      <section
        className="relative py-28"
        aria-labelledby="how-we-work"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">How we work</div>
          <h2 id="how-we-work" className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
            From a sentence to a shipped product — in weeks.
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SCENES.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-mono text-primary">{s.n}</div>
                <div className="mt-3 font-display text-xl font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-labelledby="how-we-work"
      className="relative"
      style={{ height: `${SCENES.length * 100}vh` }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center">
        {/* Parallax backdrop */}
        <BackdropParallax scrollYProgress={scrollYProgress} />

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.13 0.02 260 / 0.85) 90%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl w-full px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          {/* Left rail — progress + chip stack */}
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
              How we work
            </div>
            <h2 id="how-we-work" className="font-display text-4xl sm:text-5xl font-bold leading-[1.05]">
              A film unfolding,
              <br />
              <span className="text-gradient">scene by scene.</span>
            </h2>

            <div className="mt-10 flex flex-col gap-2">
              {SCENES.map((s, i) => (
                <SceneChip key={s.n} index={i} progress={progress} scene={s} />
              ))}
            </div>
          </div>

          {/* Right — scene stack with masked reveals */}
          <div className="relative h-[520px]">
            {SCENES.map((s, i) => (
              <Scene key={s.n} index={i} progress={progress} scene={s} />
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
          Scroll · Scene <ProgressNumber progress={progress} /> of {SCENES.length}
        </div>
      </div>
    </section>
  );
}

function ProgressNumber({ progress }: { progress: MotionValue<number> }) {
  const display = useTransform(progress, (v) =>
    String(Math.min(SCENES.length, Math.max(1, Math.floor(v) + 1))).padStart(2, "0"),
  );
  return <motion.span className="text-foreground">{display}</motion.span>;
}

function SceneChip({
  index,
  progress,
  scene,
}: {
  index: number;
  progress: MotionValue<number>;
  scene: (typeof SCENES)[number];
}) {
  const opacity = useTransform(progress, [index - 0.5, index, index + 0.8], [0.35, 1, 0.35]);
  const x = useTransform(progress, [index - 0.5, index, index + 0.8], [0, 8, 0]);
  return (
    <motion.div
      style={{ opacity, x }}
      className="flex items-center gap-3 text-sm"
    >
      <span
        className="h-1.5 w-8 rounded-full"
        style={{ background: scene.accent, boxShadow: `0 0 16px ${scene.accent}` }}
      />
      <span className="font-mono text-muted-foreground">{scene.n}</span>
      <span className="font-medium text-foreground">{scene.chip}</span>
    </motion.div>
  );
}

function Scene({
  index,
  progress,
  scene,
}: {
  index: number;
  progress: MotionValue<number>;
  scene: (typeof SCENES)[number];
}) {
  const opacity = useTransform(
    progress,
    [index - 0.6, index - 0.15, index + 0.6, index + 1],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [index - 0.6, index, index + 1], [40, 0, -40]);
  const scale = useTransform(progress, [index - 0.6, index, index + 1], [0.96, 1, 0.98]);
  const blur = useTransform(progress, [index - 0.6, index, index + 1], [12, 0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.article
      style={{ opacity, y, scale, filter }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div
        className="inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
        style={{
          color: scene.accent,
          borderColor: `${scene.accent}66`,
          background: `${scene.accent}1A`,
        }}
      >
        <span className="font-mono">{scene.n}</span> · {scene.chip}
      </div>

      <h3
        className="mt-4 font-display font-bold leading-[1.02]"
        style={{ fontSize: "clamp(2.6rem, 5.4vw, 5.2rem)" }}
      >
        {scene.title}
      </h3>

      <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
        {scene.body}
      </p>

      {/* Aurora glow keyed to the scene */}
      <div
        aria-hidden
        className="absolute -z-10 inset-0 opacity-60"
        style={{
          background: `radial-gradient(600px circle at 80% 30%, ${scene.accent}22, transparent 60%)`,
        }}
      />
    </motion.article>
  );
}

function BackdropParallax({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  return (
    <>
      <motion.div
        style={{ y: y1 }}
        aria-hidden
        className="absolute inset-0 bg-grid mask-fade-edges opacity-40"
      />
      <motion.div
        style={{ y: y2, rotate }}
        aria-hidden
        className="absolute -inset-[20%]"
      >
        <div
          className="absolute left-[10%] top-[20%] w-[40vw] h-[40vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.21 45 / 0.18), transparent 70%)",
          }}
        />
        <div
          className="absolute right-[5%] bottom-[10%] w-[35vw] h-[35vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.16 70 / 0.12), transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}
