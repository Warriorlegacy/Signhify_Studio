import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Start a Project — Signhify" },
      {
        name: "description",
        content:
          "Tell us about your idea. Six quick steps. Within 24 hours we come back with scope, stack and next steps.",
      },
      { property: "og:title", content: "Start a Project — Signhify" },
      {
        property: "og:description",
        content: "Start a project with Signhify — AI engineering studio.",
      },
    ],
  }),
  component: ContactPage,
});

type WizardData = {
  type: string;
  scope: string;
  budget: string;
  timeline: string;
  goals: string[];
  name: string;
  email: string;
  company: string;
  message: string;
};

const TYPES = [
  "SaaS / Product",
  "AI Builder / Agents",
  "Website / Landing",
  "CRM / Internal Tool",
  "Performance Marketing",
  "Mobile / Other",
];
const SCOPES = [
  "Brand-new build",
  "MVP / first version",
  "V2 / redesign",
  "Add a feature / module",
  "Migration / platform move",
  "Just exploring",
];
const BUDGETS = ["< ₹1L", "₹1L – ₹5L", "₹5L – ₹15L", "₹15L – ₹40L", "₹40L+", "Not sure yet"];
const TIMELINES = ["This week", "2–4 weeks", "1–3 months", "3–6 months", "Exploring"];
const GOAL_OPTIONS = [
  "Generate leads",
  "Launch an MVP",
  "Replace manual work with AI",
  "Look premium / cinematic",
  "Scale infrastructure",
  "Raise / fundraise",
  "Internal tooling",
  "Revenue / conversion lift",
];

const STEPS = [
  { key: "type", label: "Project type", helper: "What are we building?" },
  { key: "scope", label: "Scope", helper: "Where are you in the journey?" },
  { key: "budget", label: "Budget", helper: "Anchor the conversation." },
  { key: "timeline", label: "Timeline", helper: "When do you want it live?" },
  { key: "goals", label: "Goals", helper: "Pick everything that fits." },
  { key: "contact", label: "Contact", helper: "How do we reach you?" },
] as const;

function ContactPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    type: "",
    scope: "",
    budget: "",
    timeline: "",
    goals: [],
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const toggleGoal = (g: string) =>
    setData((d) => ({
      ...d,
      goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g],
    }));

  const single = (key: "type" | "scope" | "budget" | "timeline", options: readonly string[]) => (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const on = data[key] === opt;
        return (
          <button
            key={opt}
            onClick={() => {
              set(key, opt);
              setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 180);
            }}
            className={`text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
              on
                ? "border-primary bg-primary/10 text-foreground shadow-[0_0_24px_-8px_var(--primary-glow)]"
                : "border-border bg-surface hover:border-primary/50"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  const canSubmit = data.name.trim() && /.+@.+\..+/.test(data.email);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      // Frontend-only for now. Persist locally so nothing is lost while
      // Supabase 'leads' table comes online later this sprint.
      if (typeof window !== "undefined") {
        const key = "signhify_pending_leads";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ ...data, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
      }
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Email hello@signhify.online instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];

  return (
    <section className="relative pt-36 pb-28 min-h-[100svh]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-ember)" }} />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles size={14} /> Start a project
        </div>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl font-black leading-[1.05]">
          Tell us about your <span className="text-gradient">idea</span>.
        </h1>
        <p className="mt-5 text-muted-foreground text-lg max-w-xl">
          Six quick questions. We come back within 24 hours with scope, stack and next steps —
          personally, from Piyush.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-[var(--shadow-glow)]"
          >
            <CheckCircle2 size={40} className="text-primary mx-auto" />
            <div className="mt-4 font-display text-2xl font-bold">Brief received.</div>
            <p className="mt-2 text-muted-foreground">
              Piyush will personally reply within 24 hours at{" "}
              <span className="text-foreground font-medium">{data.email}</span>.
            </p>
            <a
              href="mailto:hello@signhify.online"
              className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail size={16} /> hello@signhify.online
            </a>
          </motion.div>
        ) : (
          <div className="mt-12 rounded-2xl border border-border bg-card/80 backdrop-blur p-6 sm:p-10">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>
                Step {step + 1} of {STEPS.length} · <span className="text-foreground">{current.label}</span>
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-border overflow-hidden mb-8">
              <motion.div
                className="h-full bg-primary shadow-[0_0_12px_var(--primary-glow)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-display text-2xl font-bold">{current.label}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{current.helper}</p>

                {current.key === "type" && single("type", TYPES)}
                {current.key === "scope" && single("scope", SCOPES)}
                {current.key === "budget" && single("budget", BUDGETS)}
                {current.key === "timeline" && single("timeline", TIMELINES)}

                {current.key === "goals" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {GOAL_OPTIONS.map((g) => {
                        const on = data.goals.includes(g);
                        return (
                          <button
                            key={g}
                            onClick={() => toggleGoal(g)}
                            className={`text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
                              on
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-surface hover:border-primary/50"
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={data.goals.length === 0}
                      className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </>
                )}

                {current.key === "contact" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        required
                        maxLength={120}
                        value={data.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                      <input
                        required
                        type="email"
                        maxLength={200}
                        value={data.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <input
                      maxLength={120}
                      value={data.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Company (optional)"
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                    <textarea
                      value={data.message}
                      maxLength={2000}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Anything else we should know? (optional)"
                      rows={4}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />

                    {/* Summary */}
                    <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-xs text-muted-foreground grid grid-cols-2 gap-y-1">
                      <div><span className="text-foreground">Type:</span> {data.type || "—"}</div>
                      <div><span className="text-foreground">Scope:</span> {data.scope || "—"}</div>
                      <div><span className="text-foreground">Budget:</span> {data.budget || "—"}</div>
                      <div><span className="text-foreground">Timeline:</span> {data.timeline || "—"}</div>
                      <div className="col-span-2">
                        <span className="text-foreground">Goals:</span>{" "}
                        {data.goals.length ? data.goals.join(", ") : "—"}
                      </div>
                    </div>

                    {error && <div className="text-sm text-destructive">{error}</div>}

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 disabled:opacity-50 transition"
                      >
                        {submitting ? "Sending…" : "Send brief"}
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {step > 0 && !submitted && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
          </div>
        )}

        <div className="mt-10 text-sm text-muted-foreground text-center">
          Prefer email?{" "}
          <a href="mailto:hello@signhify.online" className="text-primary hover:underline">
            hello@signhify.online
          </a>
        </div>
      </div>
    </section>
  );
}
