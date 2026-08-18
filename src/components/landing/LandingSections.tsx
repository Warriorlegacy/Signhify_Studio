import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Download,
  FileCode2,
  Image,
  Layers,
  MessagesSquare,
  Quote,
  Sparkles,
  Terminal,
  Video,
  WandSparkles,
} from "lucide-react";
import { PIPELINE, PRESETS, PRO_TOOLS, STATS, TESTIMONIALS } from "./landing-data";
import { Reveal } from "./LandingShared";

const ICONS: Record<string, ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  sparkles: Sparkles,
  terminal: Terminal,
  image: Image,
  video: Video,
  layers: Layers,
  download: Download,
  file: FileCode2,
  chat: MessagesSquare,
  box: Box,
  clock: Clock,
  code: Code2,
};

/* ── Divider ─────────────────────────────────────────────── */

function Divider() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.transform = "scaleX(1)";
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="divider max-w-[1200px] mx-auto origin-center relative z-10"
      style={{ transform: "scaleX(0)", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }}
    />
  );
}

/* ── Section badge ───────────────────────────────────────── */

function SectionBadge({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4fd6ff] mb-4 bg-[#4fd6ff]/10 px-3 py-1.5 rounded-full border border-[#4fd6ff]/20">
      <Icon size={11} />
      {label}
    </span>
  );
}

/* ── Preset card ─────────────────────────────────────────── */

function PresetCard({ preset, delay }: { preset: (typeof PRESETS)[number]; delay: number }) {
  return (
    <Reveal from="up" delay={delay} className="h-full">
      <article className="group relative rounded-2xl xl:rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c0c16] hover:border-white/[0.18] transition-all duration-500 h-full flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(198,255,58,0.06) 0%, transparent 70%)" }} />
        <div className="aspect-video w-full relative overflow-hidden bg-[#0a0a0c] border-b border-white/10 isolate z-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${preset.gradient}`} aria-hidden />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
        </div>
        <div className="p-4 md:p-5 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="text-white font-semibold text-base md:text-lg tracking-tight line-clamp-1">
              {preset.name}
            </h3>
            <p className="text-white/60 text-[12px] md:text-[13px] mt-1 line-clamp-2 leading-relaxed">
              {preset.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            <Link
              to="/templates"
              className="btn-preset-cta agent-glass-shine flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[15px] text-[12px] md:text-[13px] font-bold transition-transform hover:scale-[1.02]"
            >
              Customize <WandSparkles size={10} />
            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-semibold bg-white/[0.06] border border-white/[0.12] text-white/95 hover:text-white hover:bg-white/[0.1] transition-colors"
            >
              Preview <ArrowUpRight size={10} className="opacity-70" />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ── Testimonial carousel ────────────────────────────────── */

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const drag = useRef<{ startX: number; dragging: boolean }>({ startX: 0, dragging: false });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = TESTIMONIALS.length;
  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, 3000);
  };
  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    if (offset === 0) {
      return {
        zIndex: 4,
        opacity: 1,
        transform: "translateX(0) scale(1) rotate(0deg)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        cursor: "grab",
      };
    }
    const dir = offset > 0 ? 1 : -1;
    const scale = abs === 1 ? 0.92 : 0.84;
    const rotate = abs === 1 ? 5 : 11;
    return {
      zIndex: 4 - abs,
      opacity: abs === 1 ? 1 : 0.6,
      transform: `translateX(${dir * 160}px) scale(${scale}) rotate(${dir * rotate}deg)`,
      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      pointerEvents: "none",
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, dragging: true };
    if (timer.current) clearInterval(timer.current);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.dragging = false;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    restart();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative h-[360px] w-full max-w-[880px] mx-auto flex items-start justify-center">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => {
            prev();
            restart();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 bg-black/70 backdrop-blur-md text-white/80 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => {
            next();
            restart();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 bg-black/70 backdrop-blur-md text-white/80 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight size={14} />
        </button>
        {TESTIMONIALS.map((t, i) => {
          const offset = (((i - index + count) % count) + count) % count;
          const normalized = offset <= count / 2 ? offset : offset - count;
          return (
            <div
              key={t.name}
              className="flex flex-col gap-5 h-[340px] w-[300px] select-none rounded-2xl border border-white/[0.10] bg-[rgba(10,10,20,0.85)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl absolute top-0 left-1/2 -ml-[150px] touch-pan-y"
              style={{
                ...cardStyle(normalized),
                ...(normalized === 0 ? { userSelect: "none" } : {}),
              }}
              onPointerDown={normalized === 0 ? onPointerDown : undefined}
              onPointerUp={normalized === 0 ? onPointerUp : undefined}
            >
              <Quote size={36} className="leading-none text-white/10 -mb-2" />
              <p className="text-[14px] leading-relaxed text-white/75 flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.07]">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/[0.10] bg-[#0c0c14] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-white/90 truncate">{t.name}</div>
                  <div className="text-[11px] text-white/40 truncate">{t.role}</div>
                </div>
                <span className="ml-auto text-[11px] text-white/30 shrink-0">{t.flag}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => {
              setIndex(i);
              restart();
            }}
            className={`rounded-full transition-all duration-300 ${i === index ? "w-6 h-1.5 bg-[#c6ff3a]/70" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-white/25 font-mono tracking-widest uppercase">
        Use arrows or drag · auto-advances every 3s
      </p>
    </div>
  );
}

/* ── Preset Gallery ──────────────────────────────────────── */

function PresetGallery() {
  return (
    <section
      id="best-previews"
      className="relative z-10 py-14 md:py-24 scroll-mt-20 border-b border-white/[0.04]"
    >
      <div className="absolute top-1/2 left-0 w-[min(100%,480px)] h-[min(100%,480px)] -translate-y-1/2 rounded-full blur-[140px] pointer-events-none bg-brand-tertiary/[0.06]" />
      <div className="relative w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-6 mb-10 md:mb-14">
          <Reveal className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="tag inline-flex">
                <Layers size={8} className="text-blue-400" /> PRESET GALLERY
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-brand-primary/[0.12] border border-brand-primary/[0.30] text-brand-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                Beta Version
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Best Previews
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] mt-4 max-w-2xl mx-auto leading-relaxed">
              Every preset here is inspired by a real Signhify customer — their brief, their
              industry, their visual taste — shared with their consent so you can start from
              something proven. Pick one, make it yours, ship it.
            </p>
          </Reveal>
        </div>
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {PRESETS.map((p, i) => (
              <PresetCard key={p.name} preset={p} delay={i * 80} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              to="/templates"
              className="btn-preset-cta agent-glass-shine inline-flex items-center gap-2 px-7 py-3 rounded-[15px] text-[13px] font-bold"
            >
              Browse all presets <ArrowRight size={11} />
            </Link>
          </div>
          <div className="mt-20 flex flex-col items-center gap-4">
            <Reveal className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
                <Quote size={9} /> From our community
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
                Builders who shipped with presets
              </h3>
              <p className="text-white/50 text-[14px] mt-2">
                Real people, real launches — shared with their consent.
              </p>
            </Reveal>
            <Reveal className="w-full">
              <TestimonialCarousel />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Pipeline Section ────────────────────────────────────── */

function PipelineSection() {
  return (
    <section id="features" className="relative z-10 py-24 md:py-32 scroll-mt-20 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] md:blur-[180px] pointer-events-none"
        style={{ background: "rgba(198,255,58,0.08)" }}
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-6 relative z-10">
        <Reveal className="text-center mb-16 md:mb-24">
          <SectionBadge icon={Sparkles} label="The Pipeline" />
          <h2 className="font-display text-4xl md:text-6xl lg:text-[72px] font-bold text-white tracking-tight leading-[1.05] mb-6">
            From prompt to <span className="text-[#c6ff3a]">production</span>
          </h2>
          <p className="text-white/70 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Use a stunning preset and edit in place — or describe a 3D scroll site from scratch. AI
            generates motion, extracts frames, and ships production HTML without a long prompt.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-4 relative">
          <div className="hidden xl:block absolute top-1/2 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[#c6ff3a]/20 to-transparent -translate-y-1/2 z-0" />
          {PIPELINE.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <Reveal key={step.n} from="up" delay={i * 90} className="relative z-10 h-full">
                <div className="relative bg-white/[0.02] rounded-3xl border border-white/[0.04] p-6 md:p-8 h-full group hover:bg-[#c6ff3a]/5 hover:border-[#c6ff3a]/30 transition-all duration-500 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(198,255,58,0.06) 0%, transparent 60%)" }} />
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 text-white group-hover:text-[#c6ff3a] transition-all duration-500 shadow-inner group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(198,255,58,0.15)]">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-medium text-[#4fd6ff]/80 uppercase tracking-widest mb-3">
                      {step.n}
                    </span>
                    <h3 className="text-white/90 font-semibold text-[18px] mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-[14px] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="flex items-center justify-center gap-3 mt-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#c6ff3a]/40 border border-[#c6ff3a]/20" />
              {i < 4 && <div className="w-8 h-px bg-[#c6ff3a]/10" />}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Zero Code Section ───────────────────────────────────── */

function ZeroCodeSection() {
  return (
    <section className="relative z-10 py-24 md:py-32 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] md:blur-[180px] pointer-events-none"
        style={{ background: "rgba(60,255,176,0.1)" }}
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal from="left">
            <SectionBadge icon={WandSparkles} label="Zero Code" />
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.05] mb-6">
              Your video becomes
              <br className="hidden md:block" />
              <span className="text-[#c6ff3a]">a scroll experience</span>
            </h2>
            <div className="space-y-6 text-white/70 text-[16px] md:text-[18px] leading-relaxed mb-10">
              <p>
                AI generates a cinematic video, then extracts hundreds of frames. As visitors
                scroll, the frames play forward — creating a 3D parallax effect that feels like a
                film.
              </p>
              <p>
                No WebGL, no Three.js, no code — just native browser scroll with buttery-smooth
                frame interpolation. Works perfectly on every device and browser.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/builder"
                className="group relative px-8 py-4 rounded-[15px] text-[14px] font-bold bg-[#c6ff3a]/70 backdrop-blur-md agent-glass-shine text-[#10160a] hover:bg-[#9fd62a]/80 hover:shadow-[0_0_20px_rgba(198,255,58,0.55)] transition-all duration-300 flex items-center gap-3"
              >
                Try the Builder
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <Reveal from="right">
            <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-[0_20px_60px_rgba(60,255,176,0.1)] p-2 group hover:border-[#3cffb0]/30 transition-colors duration-500 backdrop-blur-md">
              <div className="absolute top-5 left-5 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3cffb0]/10 via-transparent to-[#3cffb0]/10 z-10 pointer-events-none mix-blend-overlay" />
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#0a0a14] to-[#050508] overflow-hidden">
                  <video
                    src="/landing/scroll-experience-demo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Pro Tools Section ───────────────────────────────────── */

function ProToolsSection() {
  return (
    <section className="relative z-10 py-24 md:py-32 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] md:blur-[180px] pointer-events-none"
        style={{ background: "rgba(198,255,58,0.08)" }}
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-6">
        <Reveal className="text-center mb-16 md:mb-24">
          <SectionBadge icon={Box} label="Pro Tools" />
          <h2 className="font-display text-4xl md:text-6xl lg:text-[72px] font-bold text-white tracking-tight leading-[1.05] mb-6">
            Built for <span className="text-[#c6ff3a]">serious websites</span>
          </h2>
          <p className="text-white/70 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Presets give you polished UI instantly; the 3D builder adds cinematic scroll on top.
            Chain videos, swap media, layer elements over frames, and export production-ready code.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PRO_TOOLS.map((tool, i) => {
            const Icon = ICONS[tool.icon];
            return (
              <Reveal
                key={tool.title}
                from="up"
                delay={i * 80}
                className={`${tool.span ?? ""} h-full`}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.04] bg-white/[0.02] p-8 md:p-10 h-full group hover:border-[#c6ff3a]/30 hover:bg-white/[0.03] transition-all duration-500 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#c6ff3a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-inner flex items-center justify-center mb-16 text-white group-hover:text-[#c6ff3a] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(198,255,58,0.15)]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-white/90 font-semibold text-[20px] md:text-[24px] tracking-tight mb-3">
                        {tool.title}
                      </h3>
                      <p className="text-white/50 text-[14px] md:text-[15px] leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── CTA + Stats ─────────────────────────────────────────── */

function CtaStatsSection() {
  return (
    <section className="relative z-10 py-24 md:py-40 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] md:blur-[180px] pointer-events-none"
        style={{ background: "rgba(60,255,176,0.08)" }}
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-6 relative z-10">
        <div className="rounded-[40px] border border-white/[0.06] bg-white/[0.02] p-8 md:p-16 lg:p-24 overflow-hidden relative backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-[#3cffb0]/15 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#c6ff3a]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <Reveal from="left">
              <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.05] mb-6">
                Build 3D websites
                <br />
                <span className="text-[#c6ff3a]">10x faster</span> with AI
              </h2>
              <p className="text-white/70 text-[16px] md:text-[18px] leading-relaxed mb-10 max-w-lg">
                Describe what you want once. Signhify generates cinematic motion, extracts frames,
                and builds a scroll-driven 3D website in minutes — not days. Download the ZIP and
                ship.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  to="/signup"
                  search={{ redirect: "/app/billing" }}
                  className="group relative px-8 py-4 rounded-[15px] text-[14px] font-bold bg-[#c6ff3a]/70 backdrop-blur-md agent-glass-shine text-[#10160a] hover:bg-[#9fd62a]/80 hover:shadow-[0_0_20px_rgba(198,255,58,0.55)] transition-all duration-300 flex items-center gap-3"
                >
                  <Sparkles size={16} className="text-[#c6ff3a]" />
                  Start Building Free
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 rounded-full text-[14px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  View Pricing
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {STATS.map((stat, i) => {
                const Icon = ICONS[stat.icon];
                return (
                  <Reveal key={stat.label} from="scale" delay={i * 100}>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-start group hover:bg-white/[0.04] hover:border-[#c6ff3a]/30 transition-all duration-300 shadow-inner">
                      <Icon
                        size={24}
                        className="text-white/60 mb-4 group-hover:text-[#c6ff3a] transition-colors duration-300 group-hover:scale-110"
                      />
                      <div className="font-display text-3xl md:text-4xl font-bold text-white/90 tracking-tight mb-2">
                        {stat.value}
                      </div>
                      <div className="text-white/50 text-[13px] font-medium">{stat.label}</div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main export ─────────────────────────────────────────── */

export function LandingSections() {
  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="fixed inset-0"
          style={{
            backgroundColor: "#030712",
            backgroundImage: "radial-gradient(rgba(158,164,200,0.10) 0.6px, transparent 0.9px)",
            backgroundSize: "7px 7px",
          }}
        />
      </div>
      <PresetGallery />
      <Divider />
      <PipelineSection />
      <Divider />
      <ZeroCodeSection />
      <Divider />
      <ProToolsSection />
      <Divider />
      <CtaStatsSection />
      <Divider />
    </div>
  );
}
