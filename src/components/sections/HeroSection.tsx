import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUp, Mic, Sparkles, Play } from "lucide-react";
import { HeroBackground } from "../HeroBackground";

const MODES = ["Build", "Design", "Automate", "Launch"] as const;
const STACKS = ["Web App", "Landing Page", "AI Agent", "Mobile"] as const;

const SUGGESTIONS = [
  "Build me a Gym CRM with memberships and billing",
  "Cinematic landing page for an AI startup",
  "AI agent that turns YouTube videos into reels",
  "Hotel booking platform with Stripe checkout",
];

export function HeroSection() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<(typeof MODES)[number]>("Build");
  const [stack, setStack] = useState<(typeof STACKS)[number]>("Web App");
  const [openMode, setOpenMode] = useState(false);
  const [openStack, setOpenStack] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [prompt]);

  const submit = (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value) {
      taRef.current?.focus();
      return;
    }
    try {
      sessionStorage.setItem("signhify:prompt", value);
      sessionStorage.setItem("signhify:mode", mode);
      sessionStorage.setItem("signhify:stack", stack);
    } catch {
      /* SSR / privacy mode */
    }
    navigate({ to: "/ai" });
  };

  return (
    <section className="relative isolate min-h-[100svh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      <HeroBackground />

      {/* GIANT WORDMARK — behind content, draftly-style scale */}
      <div className="absolute inset-x-0 bottom-[14%] sm:bottom-[10%] flex justify-center pointer-events-none select-none">
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black tracking-tighter leading-none text-center whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 22vw, 22rem)",
            background:
              "linear-gradient(180deg, oklch(0.72 0.21 45 / 0.95) 0%, oklch(0.78 0.16 70 / 0.55) 55%, transparent 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 80px oklch(0.72 0.21 45 / 0.35))",
          }}
          aria-hidden
        >
          signhify
        </motion.h1>
      </div>

      {/* Corner tagline — bottom-left mono, draftly's "STOP LOOKING START BUILDING" energy */}
      <div className="absolute left-6 sm:left-10 bottom-8 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] text-foreground/90 leading-[1.7]"
        >
          STOP IMAGINING,
          <br />
          START SHIPPING.
        </motion.div>
      </div>

      {/* Corner version chip — bottom-right */}
      <div className="absolute right-6 sm:right-10 bottom-8 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          v2026.06 · Studio
        </motion.div>
      </div>

      {/* Main centered content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-fit inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-primary"
        >
          <Sparkles size={13} />
          AI Engineering Studio · Build with us
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-center font-display font-bold tracking-tight text-3xl sm:text-5xl leading-[1.05] text-foreground"
        >
          Describe your idea.
          <br />
          <span className="text-gradient">Signhify builds it.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-center text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
        >
          From a single sentence to a shipped product — design, engineering,
          AI and launch, all in one studio.
        </motion.p>

        {/* PROMPT INPUT — draftly-style centered glass card */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 relative rounded-2xl border border-white/10 bg-background/60 backdrop-blur-2xl shadow-[0_30px_80px_-20px_oklch(0_0_0/0.7),0_0_0_1px_oklch(1_0_0/0.04)_inset]"
        >
          {/* glow ring */}
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none opacity-60"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.21 45 / 0.4), transparent 40%, oklch(0.78 0.16 70 / 0.25))",
              maskImage:
                "linear-gradient(black, black) content-box, linear-gradient(black, black)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1,
            }}
            aria-hidden
          />

          <div className="relative p-4 sm:p-5">
            <textarea
              ref={taRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder="Describe your product…"
              className="w-full resize-none bg-transparent text-base sm:text-lg text-foreground placeholder:text-muted-foreground/70 outline-none px-1 py-1 min-h-[60px] leading-relaxed"
            />

            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Voice input"
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-surface/60 transition"
                  onClick={() => submit("Voice prompt placeholder — describe your product")}
                >
                  <Mic size={16} />
                </button>

                {/* Mode chip */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMode((v) => !v);
                      setOpenStack(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 transition"
                  >
                    {mode}
                    <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" />
                    </svg>
                  </button>
                  {openMode && (
                    <div className="absolute bottom-full mb-2 left-0 z-30 min-w-[140px] rounded-lg border border-border bg-popover/95 backdrop-blur-xl shadow-xl p-1">
                      {MODES.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setMode(m);
                            setOpenMode(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition ${
                            mode === m
                              ? "bg-primary/15 text-primary"
                              : "text-foreground hover:bg-surface"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stack chip */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenStack((v) => !v);
                      setOpenMode(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 transition"
                  >
                    {stack}
                    <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60">
                      <path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5" />
                    </svg>
                  </button>
                  {openStack && (
                    <div className="absolute bottom-full mb-2 left-0 z-30 min-w-[150px] rounded-lg border border-border bg-popover/95 backdrop-blur-xl shadow-xl p-1">
                      {STACKS.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStack(s);
                            setOpenStack(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition ${
                            stack === s
                              ? "bg-primary/15 text-primary"
                              : "text-foreground hover:bg-surface"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => submit()}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 hover:shadow-[0_0_40px_-2px_var(--primary-glow)] transition"
              >
                Start
                <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setPrompt(s);
                taRef.current?.focus();
              }}
              className="text-[11px] sm:text-xs rounded-full border border-border bg-surface/40 backdrop-blur px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
            >
              {s}
            </button>
          ))}
        </motion.div>

        {/* Watch demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-6 flex justify-center"
        >
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 backdrop-blur px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
            <span className="grid place-items-center h-5 w-5 rounded-full bg-primary/20 text-primary">
              <Play size={10} fill="currentColor" />
            </span>
            Watch the studio reel
          </button>
        </motion.div>
      </div>
    </section>
  );
}
