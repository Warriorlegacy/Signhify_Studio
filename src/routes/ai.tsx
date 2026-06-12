import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Cpu,
  Database,
  LayoutDashboard,
  Rocket,
  Check,
  Mail,
  Share2,
  Copy,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { generatePlan, savePlan, type GeneratedPlan } from "@/lib/ai-generate.functions";
import { getGeneratePlanStreamConfig } from "@/lib/ai-generate-stream.functions";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Signhify AI — Describe anything. We'll build it." },
      {
        name: "description",
        content:
          "Prompt-to-product. Signhify AI turns a single sentence into a working plan, stack and starter build — powered by Claude.",
      },
      { property: "og:title", content: "Signhify AI — Prompt to product" },
      {
        property: "og:description",
        content: "Describe anything. Signhify AI builds the plan, the stack and the starter app.",
      },
      { property: "og:url", content: "https://signhify.online/ai" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/ai" }],
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

const AGENT_META = [
  { icon: Sparkles, name: "Product Strategist", stage: "briefing" },
  { icon: Database, name: "System Architect", stage: "architecture" },
  { icon: LayoutDashboard, name: "UI/UX Designer", stage: "design_tokens" },
  { icon: Cpu, name: "Frontend Engineer", stage: "codegen" },
  { icon: Database, name: "Backend Engineer", stage: "review" },
  { icon: Rocket, name: "Deployment Agent", stage: "deploy_plan" },
] as const;
type PipelineStage = (typeof AGENT_META)[number]["stage"];

function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<"idle" | "running" | "done" | "error">("idle");
  const [activeAgent, setActiveAgent] = useState(0);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const [stageText, setStageText] = useState<Record<PipelineStage, string>>({
    briefing: "",
    architecture: "",
    design_tokens: "",
    codegen: "",
    review: "",
    deploy_plan: "",
  });
  const [completedStages, setCompletedStages] = useState<PipelineStage[]>([]);
  const { user } = useUser();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = useServerFn(generatePlan);
  const getStreamConfig = useServerFn(getGeneratePlanStreamConfig);
  const save = useServerFn(savePlan);

  const handleShare = async () => {
    if (!plan) return;
    setSharing(true);
    setCopied(false);
    try {
      const result = await save({
        data: {
          prompt,
          plan,
          userId: user?.id,
        },
      });
      const url = `${window.location.origin}/ai/share/${result.id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("[handleShare] failed:", err);
      alert("Could not share plan. Try again.");
    } finally {
      setSharing(false);
    }
  };

  const run = async (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value) return;
    setPrompt(value);
    setStage("running");
    setActiveAgent(0);
    setPlan(null);
    setError(null);
    setStreamText("");
    setStageText({
      briefing: "",
      architecture: "",
      design_tokens: "",
      codegen: "",
      review: "",
      deploy_plan: "",
    });
    setCompletedStages([]);

    const accumulatedStageText: Record<PipelineStage, string> = {
      briefing: "",
      architecture: "",
      design_tokens: "",
      codegen: "",
      review: "",
      deploy_plan: "",
    };

    try {
      const { url, bearer } = await getStreamConfig({ data: undefined });
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ prompt: value }),
      });
      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Streaming plan failed.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastStage: PipelineStage = "briefing";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const event = JSON.parse(line.slice(5).trim()) as { stage: PipelineStage; delta: string };
          if (event.stage !== lastStage) {
            setCompletedStages((prev) => [...new Set([...prev, lastStage])]);
            lastStage = event.stage;
          }
          const stageIndex = AGENT_META.findIndex((a) => a.stage === event.stage);
          if (stageIndex >= 0) setActiveAgent(stageIndex);
          setStreamText((prev) => prev + event.delta);
          accumulatedStageText[event.stage] =
            (accumulatedStageText[event.stage] ?? "") + event.delta;
          setStageText((prev) => ({
            ...prev,
            [event.stage]: (prev[event.stage] ?? "") + event.delta,
          }));
        }
      }
      setCompletedStages((prev) => [
        ...new Set([...prev, lastStage, ...AGENT_META.map((a) => a.stage)]),
      ]);
      setPlan({
        productName: "Signhify AI Plan",
        oneLiner: value,
        sections: AGENT_META.map((a) => ({
          title: a.name,
          bullets: (accumulatedStageText[a.stage] || "Generated section")
            .split("\n")
            .filter(Boolean)
            .slice(0, 5),
        })),
        stack: ["TanStack Start", "Supabase", "Tailwind", "Stripe", "Cloudflare", "Anthropic"],
      });
      setStage("done");
    } catch (e) {
      try {
        const result = await generate({ data: { prompt: value } });
        setActiveAgent(AGENT_META.length - 1);
        setPlan(result);
        setStage("done");
      } catch {
        setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
        setStage("error");
      }
    }
  };

  // Pick up prompt handed off from the homepage hero input
  useEffect(() => {
    try {
      const handoff = sessionStorage.getItem("signhify:prompt");
      if (handoff && handoff.trim()) {
        sessionStorage.removeItem("signhify:prompt");
        void run(handoff);
      }
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] pt-32 pb-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-ember)" }}
      />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          <Sparkles size={14} /> Signhify AI · powered by Claude
        </motion.div>

        <h1 className="mt-6 font-display text-5xl sm:text-7xl font-black leading-[0.95]">
          Describe anything. <span className="text-gradient">Signhify builds it.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          One prompt. Six AI agents collaborate to turn it into a real product plan, stack and
          starter build.
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
                  Generate plan{" "}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
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
              {AGENT_META.map((a, i) => {
                const state =
                  stage === "done" || completedStages.includes(a.stage)
                    ? "done"
                    : stage === "running" && i === activeAgent
                      ? "active"
                      : stage === "error"
                        ? "pending"
                        : "pending";
                const sectionTitle =
                  plan?.sections?.[i]?.title ??
                  (stageText[a.stage] ? stageText[a.stage].slice(0, 72) : undefined);
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
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                          state === "pending"
                            ? "border-border text-muted-foreground"
                            : "border-primary/40 text-primary bg-primary/10"
                        }`}
                      >
                        <a.icon size={16} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Agent {i + 1}
                      </span>
                    </div>
                    <div className="mt-4 font-display text-lg font-semibold">{a.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {sectionTitle ?? "Standing by…"}
                    </div>
                    {state === "active" && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
                        <Loader2 size={12} className="animate-spin" /> Thinking…
                      </div>
                    )}
                    {state === "done" && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
                        <Check size={12} /> Done
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "running" && streamText && (
          <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6 text-sm text-muted-foreground whitespace-pre-wrap">
            {streamText}
            <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />
          </div>
        )}

        {stage === "error" && (
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/5 p-6 text-sm text-red-200">
            <div className="font-semibold mb-1">Signhify AI hit a snag</div>
            <div className="text-red-200/80">{error}</div>
            <button
              onClick={() => run()}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Try again <ArrowRight size={12} />
            </button>
          </div>
        )}

        {stage === "done" && plan && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-primary/40 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Plan · generated by Claude
            </div>
            <h2 className="font-display text-3xl font-bold">{plan.productName}</h2>
            <p className="mt-2 text-muted-foreground">{plan.oneLiner}</p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {plan.sections.map((s, i) => (
                <div
                  key={s.title + i}
                  className="rounded-xl border border-border bg-surface/40 p-5"
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
                    Agent {i + 1}
                  </div>
                  <div className="font-display font-semibold">{s.title}</div>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-primary mt-1">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
                Recommended stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.stack.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] rounded-full border border-border bg-surface px-2 py-0.5 text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <WaitlistForm prompt={prompt} />

            {shareUrl && (
              <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Shareable Plan Link
                  </span>
                  <input
                    readOnly
                    value={shareUrl}
                    className="w-full bg-transparent text-sm text-foreground font-mono outline-none"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  }}
                  className="shrink-0 text-xs rounded-md border border-border bg-surface hover:border-primary/60 px-3 py-2 transition inline-flex items-center gap-1.5"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
              >
                Have Signhify build this <ArrowRight size={16} />
              </Link>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition disabled:opacity-60"
              >
                {sharing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sharing…
                  </>
                ) : copied ? (
                  <>
                    <Check size={16} className="text-emerald-400" /> Link copied!
                  </>
                ) : (
                  <>
                    <Share2 size={16} /> Share plan
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setStage("idle");
                  setPlan(null);
                  setPrompt("");
                  setShareUrl(null);
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

function WaitlistForm({ prompt }: { prompt: string }) {
  const join = useServerFn(joinWaitlist);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    setMsg(null);
    try {
      await join({ data: { email: email.trim(), prompt, source: "ai-page" } });
      setState("done");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Could not join. Try again.");
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 rounded-xl border border-border bg-surface/40 p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Early access</div>
      <div className="font-display font-semibold">Get the live Claude pipeline first.</div>
      <p className="text-sm text-muted-foreground mt-1">
        Join the waitlist and we&rsquo;ll plug your prompt into the real Signhify AI build queue.
      </p>
      {state === "done" ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
          <Check size={14} /> You&rsquo;re on the list. We&rsquo;ll email you.
        </div>
      ) : (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3">
            <Mail size={14} className="text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {state === "loading" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>Join waitlist</>
            )}
          </button>
        </div>
      )}
      {state === "error" && msg && <div className="mt-3 text-xs text-red-300">{msg}</div>}
    </form>
  );
}
