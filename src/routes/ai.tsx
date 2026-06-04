import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, Cpu, Database, LayoutDashboard, Rocket } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Signhify AI — Describe anything. We'll build it." },
      {
        name: "description",
        content:
          "Prompt-to-product. Signhify AI turns a single sentence into a working plan, stack and starter build. Live at ai.signhify.online — June 14, 2026.",
      },
      { property: "og:title", content: "Signhify AI — Prompt to product" },
      {
        property: "og:description",
        content: "Describe anything. Signhify AI builds the plan, the stack and the starter app.",
      },
    ],
  }),
  component: AiPage,
});

const EXAMPLES = [
  "Build me a Gym CRM with memberships, attendance and billing.",
  "Create an NGO website with campaigns and donations.",
  "Build a SaaS like Notion for product teams.",
  "Create a hotel booking platform.",
  "Build a cinematic landing page for an AI startup.",
];

const AGENTS = [
  { icon: Sparkles, name: "Product Strategist", out: "PRD + user stories" },
  { icon: Database, name: "System Architect", out: "Schema + APIs" },
  { icon: LayoutDashboard, name: "UI/UX Designer", out: "Layouts + flows" },
  { icon: Cpu, name: "Frontend Engineer", out: "React + Tailwind" },
  { icon: Database, name: "Backend Engineer", out: "Auth + DB + APIs" },
  { icon: Rocket, name: "Deployment Agent", out: "Live on Vercel" },
];

function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<"idle" | "running" | "done">("idle");
  const [activeAgent, setActiveAgent] = useState(0);

  const run = (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value) return;
    setPrompt(value);
    setStage("running");
    setActiveAgent(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= AGENTS.length) {
        clearInterval(id);
        setStage("done");
        return;
      }
      setActiveAgent(i);
    }, 700);
  };

  // Pick up prompt handed off from the homepage hero input
  useEffect(() => {
    try {
      const handoff = sessionStorage.getItem("signhify:prompt");
      if (handoff && handoff.trim()) {
        sessionStorage.removeItem("signhify:prompt");
        run(handoff);
      }
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-ember)" }} />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          <Sparkles size={14} /> Signhify AI · preview · ships June 14, 2026
        </motion.div>

        <h1 className="mt-6 font-display text-5xl sm:text-7xl font-black leading-[0.95]">
          Describe anything. <span className="text-gradient">Signhify builds it.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          One prompt. Six AI agents collaborate to turn it into a real product plan,
          stack and starter build — live at <span className="font-mono text-primary">ai.signhify.online</span>.
        </p>

        {/* Prompt box */}
        <div className="mt-10 rounded-2xl border border-border bg-card/80 backdrop-blur p-2 shadow-[var(--shadow-card)]">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Build me a…"
              className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={() => run()}
              disabled={stage === "running"}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 disabled:opacity-60 transition"
            >
              {stage === "running" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Building
                </>
              ) : (
                <>
                  Generate plan <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Examples */}
        {stage === "idle" && (
          <div className="mt-6 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => run(ex)}
                className="text-xs rounded-full border border-border bg-surface/60 hover:border-primary/60 hover:text-foreground text-muted-foreground px-3 py-1.5 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Agent pipeline */}
        <AnimatePresence>
          {stage !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {AGENTS.map((a, i) => {
                const state =
                  stage === "done" || i < activeAgent ? "done" : i === activeAgent ? "active" : "pending";
                return (
                  <div
                    key={a.name}
                    className={`relative rounded-2xl border bg-card/80 backdrop-blur p-5 transition ${
                      state === "active"
                        ? "border-primary shadow-[var(--shadow-glow)]"
                        : state === "done"
                          ? "border-primary/40"
                          : "border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                        state === "pending" ? "border-border text-muted-foreground" : "border-primary/40 text-primary bg-primary/10"
                      }`}>
                        <a.icon size={16} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Agent {i + 1}
                      </span>
                    </div>
                    <div className="mt-4 font-display text-lg font-semibold">{a.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{a.out}</div>
                    {state === "active" && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
                        <Loader2 size={12} className="animate-spin" /> Thinking…
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-primary/40 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Preview output</div>
            <h3 className="font-display text-2xl font-bold">
              Plan ready for: <span className="text-gradient">{prompt}</span>
            </h3>
            <p className="mt-3 text-muted-foreground">
              This is a UI preview. The live agent pipeline wires up when{" "}
              <span className="font-mono text-primary">ai.signhify.online</span> ships on June 14, 2026.
              Join the early access list and we&rsquo;ll plug your prompt into the real Claude-powered pipeline first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
              >
                Get early access <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => {
                  setStage("idle");
                  setPrompt("");
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
              >
                Try another prompt
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
