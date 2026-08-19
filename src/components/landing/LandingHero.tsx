import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  ArrowUp,
  Menu,
  Bolt,
  ChevronDown,
  Box,
  Globe,
  Layers,
  Mail,
  Mic,
  Newspaper,
  Paperclip,
  Rocket,
  Tags,
  Zap,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";
import { useSpeechToText } from "@/hooks/use-speech-to-text";

interface NavLinkItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  beta?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { to: "/scroll-studio", label: "3D Builder", icon: Box },
  { to: "/templates", label: "Presets", icon: Layers, beta: true },
  { to: "/insights", label: "Blog", icon: Newspaper },
  { to: "/pricing", label: "Pricing", icon: Tags },
  { to: "/contact", label: "Contact", icon: Mail },
];

/* ── Logo ────────────────────────────────────────────────── */

function LogoMark() {
  return <SignhifyLogo size={30} />;
}

/* ── Pricing pill CTA ────────────────────────────────────── */

function PricingPillCta() {
  return (
    <a
      aria-label="Signhify Basic — $25/mo — Get started"
      className="group relative block overflow-hidden rounded-full bg-[rgba(10,4,18,0.96)] backdrop-blur-xl pl-3 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 shadow-[0_14px_40px_rgba(0,0,0,0.55),0_0_0_1.5px_rgba(255,107,26,0.95),0_0_48px_rgba(255,107,26,0.36)] transition-all duration-300 hover:shadow-[0_18px_48px_rgba(0,0,0,0.6),0_0_0_1.5px_rgba(255,107,26,1),0_0_64px_rgba(255,107,26,0.5)] hover:scale-[1.015] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b1a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      href="/pricing"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ffb347]/12 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative flex items-center gap-2.5 sm:gap-3">
        <span className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            aria-hidden
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#ff6b1a] text-[#1a0a00] shadow-[0_4px_18px_rgba(255,107,26,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] shrink-0 ring-2 ring-[#ff6b1a]/20"
          >
            <Rocket className="text-[12px] sm:text-[13px]" size={13} />
          </span>
          <span className="min-w-0 flex flex-col gap-0.5 sm:gap-1">
            <span className="text-[13px] sm:text-[14px] font-extrabold tracking-[-0.02em] text-white leading-tight">
              Signhify Basic — $25/mo
            </span>
            <span className="text-[11px] sm:text-[11.5px] font-medium text-white/95 leading-snug truncate">
              Full Agent builds · 5 live sites · cancel anytime
            </span>
          </span>
        </span>
        <span className="agent-glass-shine shrink-0 inline-flex items-center justify-center gap-2 rounded-[15px] bg-[#ff6b1a] backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-extrabold text-[#1a0a00] transition-all duration-300 group-hover:bg-[#ffb347] group-hover:gap-2.5 shadow-[0_4px_20px_rgba(255,107,26,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]">
          <Bolt size={12} />
          Get started
          <ArrowRight
            className="opacity-80 transition-transform duration-300 group-hover:translate-x-0.5"
            size={11}
          />
        </span>
      </span>
    </a>
  );
}

/* ── Chat input card ─────────────────────────────────────── */

function ChatCard() {
  const [prompt, setPrompt] = useState("");
  const { supported, listening, toggle } = useSpeechToText((text) =>
    setPrompt((p) => (p ? `${p} ${text}` : text)),
  );
  return (
    <div className="relative">
      <div className="signhify-chat-bloom" aria-hidden />
      <div className="signhify-chat-ring">
        <div className="relative backdrop-blur-2xl bg-[#0a0a14]/95 rounded-[16.5px] overflow-hidden p-2">
          <div className="px-2 pt-2 pb-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website for our new Signhify Agent V2"
              rows={1}
              className="w-full resize-none bg-transparent border-none outline-none text-sm text-white/90 placeholder:text-white/60 leading-relaxed min-h-[44px]"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-1 pt-1 pb-0.5">
            <div className="flex items-center gap-1 min-w-0">
              <button
                type="button"
                disabled
                title="Add reference image"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 cursor-not-allowed"
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                onClick={toggle}
                disabled={!supported}
                title={
                  supported
                    ? listening
                      ? "Stop voice input"
                      : "Voice input"
                    : "Voice input is not supported in this browser"
                }
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  listening
                    ? "text-[#ff6b1a] animate-pulse bg-[#ff6b1a]/10"
                    : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                } ${supported ? "" : "text-white/30 cursor-not-allowed"}`}
              >
                <Mic size={16} />
              </button>
            </div>
            <Link
              to="/scroll-studio"
              search={{ prompt: prompt.trim() || undefined }}
              title="Start"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all bg-[#ff6b1a] text-[#1a0a00] hover:scale-105 shadow-[0_2px_10px_rgba(255,107,26,0.4)]"
            >
              <ArrowUp size={16} />
              <span className="sr-only">Start</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Canvas starfield ────────────────────────────────────── */

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * DPR;
      canvas.height = canvas.clientHeight * DPR;
    };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() < 0.4 ? 25 : Math.random() < 0.7 ? 35 : 30,
      drift: Math.random() * 0.0002 + 0.00005,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      for (const d of dots) {
        const y = (d.y + progress * 0.6) % 1;
        const x = (d.x + Math.sin((window.scrollY + d.y * 1000) * 0.0006) * 0.05) % 1;
        ctx.beginPath();
        ctx.arc(
          x * canvas.width,
          y * canvas.height,
          d.r * DPR * (1 + progress * 0.4),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `hsla(${d.hue}, 90%, 62%, ${0.04 + progress * 0.2})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1, transition: "opacity 600ms" }}
    />
  );
}

/* ── Stats bar ───────────────────────────────────────────── */

const HERO_STATS = [
  { icon: Users, value: "11,400+", label: "Sites Built" },
  { icon: Clock, value: "<3 min", label: "Time to First URL" },
  { icon: Star, value: "4.8/5", label: "Avg Build Rating" },
  { icon: Zap, value: "10×", label: "Faster Than Manual" },
];

function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
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
      className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 sm:mt-10"
    >
      {HERO_STATS.map((s, i) => (
        <div
          key={s.label}
          className="flex items-center gap-2.5 sm:gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            transitionDelay: `${i * 120 + 400}ms`,
          }}
        >
          <s.icon size={14} className="text-[#ff6b1a]/70" />
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight leading-none">
              {s.value}
            </span>
            <span className="text-[10px] sm:text-[11px] text-white/40 font-medium tracking-wide uppercase">
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Navigation ──────────────────────────────────────────── */

function LandingNav() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);
  const anim = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    filter: mounted ? "blur(0px)" : "blur(7px)",
    transition: "opacity 0.7s ease, filter 0.7s ease",
    transitionDelay: `${delay}ms`,
  });
  return (
    <div className="fixed top-4 sm:top-5 inset-x-0 z-[200] px-3 sm:px-5 pointer-events-none">
      <div className="relative w-full flex items-center justify-between gap-3">
        <div className="pointer-events-auto shrink-0" style={anim(0)}>
          <Link
            to="/"
            className="flex items-center gap-2.5 h-[50px] pl-2.5 pr-4 rounded-full border border-white/[0.09] backdrop-blur-xl transition-shadow duration-300 bg-[#0b0d16] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          >
            <LogoMark />
            <span className="font-display font-extrabold text-[13px] tracking-[0.02em] uppercase text-white hidden sm:block">
              SIGNHIFY
            </span>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block pointer-events-auto">
          <div className="relative" style={anim(100)}>
            <div className="absolute inset-0" aria-hidden>
              <div className="absolute inset-0 rounded-full bg-[#0b0d16]" />
              <div
                className="absolute left-1/2 top-1/2 w-[26px] h-[26px] -ml-[13px] -mt-[13px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 34% 28%, rgba(255,170,120,0.8) 0%, rgba(230,110,40,0.45) 38%, rgb(11,13,22) 72%)",
                }}
              />
            </div>
            <nav aria-label="Main" className="relative flex items-center gap-1 h-[50px] px-2">
              {NAV_LINKS.map(({ to, label, icon: Icon, beta }) => (
                <Link
                  key={to}
                  to={to}
                  className="group relative flex items-center gap-2 px-3.5 h-[38px] rounded-full text-[13px] transition-colors duration-200 text-white hover:bg-white/[0.07] font-medium"
                >
                  <Icon
                    className="text-[11px] text-white/80 group-hover:text-[#ff6b1a] transition-colors"
                    size={11}
                  />
                  {label}
                  {beta && (
                    <span className="text-[8px] font-bold uppercase px-1 rounded bg-white/[0.12] text-white/80">
                      Beta
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pointer-events-auto shrink-0 flex items-center gap-2" style={anim(200)}>
          <div className="hidden lg:block">
            <button
              type="button"
              className="flex items-center gap-1.5 h-[50px] px-3.5 rounded-full text-[12px] font-medium text-white/70 hover:text-white border border-white/[0.09] hover:border-white/[0.18] bg-[#0b0d16] transition-all"
              aria-label="Change language"
            >
              <Globe size={10} />
              <span className="hidden sm:inline">English</span>
              <span className="inline sm:hidden">🇬🇧</span>
              <ChevronDown size={8} className="opacity-50" />
            </button>
          </div>
          <Link
            to="/login"
            search={{ redirect: "/app" }}
            className="hidden md:inline-flex items-center gap-2 h-[50px] px-4 rounded-full text-[13px] font-medium text-white hover:text-white border border-white/[0.09] bg-[#0b0d16] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            search={{ redirect: "/app/billing" }}
            className="group hidden md:block rounded-full p-[1.5px] bg-[conic-gradient(from_140deg,#ff9442,#ffb347,#ff6b1a,#ffb347,#ff9442)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          >
            <span className="flex items-center gap-2.5 h-[47px] px-5 rounded-full bg-[#0b0d16] text-[13px] font-semibold tracking-[-0.01em] text-white transition-colors group-hover:bg-[#12141f]">
              Get started
              <ArrowRight
                className="text-[10px] text-[#ff6b1a] transition-transform duration-300 group-hover:translate-x-0.5"
                size={10}
              />
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden w-[50px] h-[50px] rounded-full flex items-center justify-center text-white/80 bg-[#0b0d16] border border-white/[0.09] hover:text-white transition-all"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={14} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden pointer-events-auto mt-3 rounded-2xl border border-white/[0.09] bg-[#0b0d16]/95 backdrop-blur-xl p-3 flex flex-col gap-1 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          {NAV_LINKS.map(({ to, label, icon: Icon, beta }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] text-white hover:bg-white/[0.07] font-medium"
            >
              <Icon size={11} className="text-white/80" />
              {label}
              {beta && (
                <span className="text-[8px] font-bold uppercase px-1 rounded bg-white/[0.12] text-white/80">
                  Beta
                </span>
              )}
            </Link>
          ))}
          <div className="h-px bg-white/[0.08] my-1" />
          <Link
            to="/login"
            search={{ redirect: "/app" }}
            onClick={() => setMenuOpen(false)}
            className="px-3.5 py-2.5 rounded-xl text-[13px] text-white/80 hover:bg-white/[0.07]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            search={{ redirect: "/app/billing" }}
            onClick={() => setMenuOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6b1a] px-3.5 py-2.5 text-[13px] font-bold text-[#1a0a00]"
          >
            Get started <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Hero background ─────────────────────────────────────── */

function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          top: "-15%",
          right: "-8%",
          background: "radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          bottom: "5%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(255,148,66,0.06) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          top: "30%",
          left: "40%",
          background: "radial-gradient(circle, rgba(255,179,71,0.05) 0%, transparent 70%)",
          filter: "blur(160px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "rgb(3,7,18)",
          backgroundImage:
            "radial-gradient(420px at 86% 12%, rgba(255,170,120,0.14) 0%, rgba(255,200,130,0.05) 45%, rgba(5,5,10,0) 100%), linear-gradient(228deg, rgba(255,107,26,0.1) 12%, rgba(255,179,71,0.07) 30%, rgba(255,148,66,0.06) 48%, rgba(5,5,10,0) 66%), radial-gradient(rgba(150,156,190,0.1) 0.6px, transparent 0.9px)",
          backgroundSize: "100% 100%, 100% 100%, 7px 7px",
        }}
      />
      <HeroCanvas />
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(28px)",
    transition:
      "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
    transitionDelay: `${delay}ms`,
  });

  return (
    <>
      <svg aria-hidden className="absolute w-0 h-0 pointer-events-none" focusable="false">
        <defs>
          <filter id="signhify-nav-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <LandingNav />

      {/* Desktop hero */}
      <section
        className="relative h-screen !overflow-hidden hidden md:block"
        style={{ zIndex: 10 }}
      >
        <div className="absolute inset-0">
          <HeroBackground />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 20 }}
        >
          {/* Headline */}
          <div className="text-center max-w-4xl px-6 mb-8" style={fadeIn(0)}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffb347] mb-5 bg-[#ffb347]/10 px-3.5 py-1.5 rounded-full border border-[#ffb347]/20">
              <Zap size={10} />
              AI 3D Website Builder
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] xl:text-[72px] font-bold text-white tracking-tight leading-[1.05] mb-5">
              Cinematic Scroll Websites
              <br />
              <span className="bg-gradient-to-r from-[#ff6b1a] to-[#ffb347] bg-clip-text text-transparent">
                from a Single Prompt
              </span>
            </h2>
            <p className="text-white/70 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
              Type a prompt. AI generates a complete scroll-reactive site with cinematic video,
              imagery, and motion — publish to a live URL in minutes.
            </p>
          </div>

          {/* Stats bar */}
          <div style={fadeIn(150)}>
            <StatsBar />
          </div>

          {/* Pricing pill */}
          <div
            className="w-full max-w-[min(100vw-1rem,560px)] px-2 sm:px-3 mt-8 mb-3"
            style={fadeIn(250)}
          >
            <PricingPillCta />
          </div>

          {/* Chat card */}
          <div
            className="w-full max-w-[min(100vw-1rem,660px)] px-2 sm:px-3 relative"
            style={fadeIn(350)}
          >
            <div className="relative z-10">
              <ChatCard />
            </div>
          </div>

          {/* Builder CTA */}
          <div
            className="flex items-center justify-center gap-2.5 mt-5 w-full max-w-[min(94vw,340px)]"
            style={fadeIn(450)}
          >
            <Link
              to="/scroll-studio"
              search={{ prompt: undefined }}
              className="btn-moonlit agent-glass-shine group flex-1 h-12 px-4 rounded-[15px] text-[14px] font-semibold tracking-[-0.01em] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Box size={12} className="group-hover:rotate-12 transition-transform duration-300" />
              <span>3D Website Builder</span>
              <ArrowRight
                size={11}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20 }}
        >
          <span className="text-white/25 text-[10px] font-mono tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown size={12} className="text-white/20 animate-bounce" />
        </div>
      </section>

      {/* Mobile hero */}
      <section
        className="relative md:hidden overflow-hidden bg-black mobile-hero-section"
        style={{ zIndex: 10 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: "#030712",
            backgroundImage:
              "radial-gradient(circle 420px at 86% 12%, rgba(255,170,120,0.14) 0%, rgba(255,200,130,0.05) 45%, rgba(5,5,10,0) 100%),linear-gradient(228deg, rgba(255,107,26,0.10) 12%, rgba(255,179,71,0.07) 30%, rgba(255,148,66,0.06) 48%, rgba(5,5,10,0) 66%),radial-gradient(rgba(150,156,190,0.10) 0.6px, transparent 0.9px)",
            backgroundSize: "100% 100%, 100% 100%, 7px 7px",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            top: "10%",
            right: "-20%",
            background: "radial-gradient(circle, rgba(255,107,26,0.08) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div className="relative z-10 px-4 pt-28 pb-8 flex flex-col items-center gap-4 min-h-screen justify-center">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb347] mb-4 bg-[#ffb347]/10 px-3 py-1.5 rounded-full border border-[#ffb347]/20">
              <Zap size={9} />
              AI 3D Website Builder
            </span>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight leading-[1.1] mb-3">
              Cinematic Scroll Websites
              <br />
              <span className="bg-gradient-to-r from-[#ff6b1a] to-[#ffb347] bg-clip-text text-transparent">
                from a Single Prompt
              </span>
            </h2>
            <p className="text-white/60 text-[14px] max-w-sm mx-auto leading-relaxed">
              AI generates motion, frames, and production HTML — publish in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            {HERO_STATS.slice(0, 3).map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={12} className="text-[#ff6b1a]/60" />
                <span className="text-[13px] font-bold text-white">{s.value}</span>
                <span className="text-[9px] text-white/35 uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-[min(100vw-1rem,560px)] px-2 sm:px-3 mb-2.5 sm:mb-3">
            <PricingPillCta />
          </div>
          <div className="w-full max-w-[min(100vw-1rem,660px)] px-2 sm:px-3 relative">
            <div className="relative z-10">
              <ChatCard />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full max-w-[400px]">
            <Link
              to="/scroll-studio"
              search={{ prompt: undefined }}
              className="btn-moonlit agent-glass-shine flex-1 h-11 px-3 rounded-[15px] text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Box size={10} />
              3D Website Builder
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
