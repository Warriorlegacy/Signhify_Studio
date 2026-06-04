import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { leadSchema, emptyLead, type Lead } from "@/lib/leads-schema";

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

type FieldErrors = Partial<Record<keyof Lead, string>>;

function ContactPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Lead>(emptyLead);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleGoal = (g: string) => {
    setData((d) => ({
      ...d,
      goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g],
    }));
    if (errors.goals) setErrors((e) => ({ ...e, goals: undefined }));
  };

  const single = (key: "type" | "scope" | "budget" | "timeline", options: readonly string[]) => (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const on = data[key] === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => {
              set(key, opt);
              setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 180);
            }}
            className={`text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
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

  const submit = async () => {
    setError(null);
    const result = leadSchema.safeParse(data);
    if (!result.success) {
      const fe: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof Lead | undefined;
        if (field && !fe[field]) fe[field] = issue.message;
      }
      setErrors(fe);
      // Jump to first invalid step if any are missing from prior steps
      const order: (keyof Lead)[] = ["type", "scope", "budget", "timeline", "goals", "name"];
      const firstBad = order.findIndex((k) => fe[k]);
      if (firstBad >= 0 && firstBad < STEPS.length) setStep(firstBad);
      return;
    }
    setSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        const key = "signhify_pending_leads";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ ...result.data, at: new Date().toISOString() });
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

  const hasContactBasics = useMemo(
    () => data.name.trim().length >= 2 && /^[^\s]+@[^\s]+\.[^\s]+$/.test(data.email),
    [data.name, data.email],
  );

  return (
    <section className="relative pt-36 pb-28 min-h-[100svh]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-ember)" }} aria-hidden />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles size={14} /> Start a project
        </div>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl font-black leading-[1.05]">
          Tell us about your <span className="text-gradient">idea</span>.
        </h1>
        <p className="mt-5 text-muted-foreground text-lg max-w-xl">
          Six quick questions. We come back within 24 hours with scope, stack and next
          steps — personally, from Piyush.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-[var(--shadow-glow)]"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={40} className="text-primary mx-auto" />
            <div className="mt-4 font-display text-2xl font-bold">Brief received.</div>
            <p className="mt-2 text-muted-foreground">
              Piyush will personally reply within 24 hours at{" "}
              <span className="text-foreground font-medium">{data.email}</span>.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-surface/60 p-5 text-left text-sm space-y-1">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">Your brief</div>
              <Row k="Project" v={data.type} />
              <Row k="Scope" v={data.scope} />
              <Row k="Budget" v={data.budget} />
              <Row k="Timeline" v={data.timeline} />
              <Row k="Goals" v={data.goals.join(", ")} />
            </div>

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
                Step {step + 1} of {STEPS.length} ·{" "}
                <span className="text-foreground">{current.label}</span>
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-border overflow-hidden mb-8" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
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
                            type="button"
                            onClick={() => toggleGoal(g)}
                            aria-pressed={on}
                            className={`text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
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
                    {errors.goals && <FieldError msg={errors.goals} />}
                    <button
                      type="button"
                      onClick={() => {
                        if (data.goals.length === 0) {
                          setErrors((e) => ({ ...e, goals: "Pick at least one goal" }));
                          return;
                        }
                        setStep((s) => s + 1);
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        id="name"
                        label="Your name"
                        value={data.name}
                        onChange={(v) => set("name", v)}
                        error={errors.name}
                        maxLength={120}
                        autoComplete="name"
                      />
                      <Field
                        id="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(v) => set("email", v)}
                        error={errors.email}
                        maxLength={200}
                        autoComplete="email"
                      />
                    </div>
                    <Field
                      id="company"
                      label="Company (optional)"
                      value={data.company ?? ""}
                      onChange={(v) => set("company", v)}
                      error={errors.company}
                      maxLength={120}
                      autoComplete="organization"
                    />
                    <div>
                      <label htmlFor="message" className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                        Anything else?
                      </label>
                      <textarea
                        id="message"
                        value={data.message ?? ""}
                        maxLength={2000}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Constraints, references, secret sauce — whatever helps."
                        rows={4}
                        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    {/* Summary */}
                    <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-xs text-muted-foreground grid grid-cols-2 gap-y-1">
                      <Row k="Type" v={data.type} muted />
                      <Row k="Scope" v={data.scope} muted />
                      <Row k="Budget" v={data.budget} muted />
                      <Row k="Timeline" v={data.timeline} muted />
                      <div className="col-span-2">
                        <span className="text-foreground">Goals:</span>{" "}
                        {data.goals.length ? data.goals.join(", ") : "—"}
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive" role="alert">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        By sending you agree to be contacted by Signhify.
                      </p>
                      <button
                        type="submit"
                        disabled={!hasContactBasics || submitting}
                        className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
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

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-md border bg-surface px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
          error
            ? "border-destructive/70 focus:border-destructive focus:ring-destructive/30"
            : "border-border focus:border-primary focus:ring-primary/30"
        }`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-3 flex items-center gap-1 text-xs text-destructive" role="alert">
      <AlertCircle size={12} /> {msg}
    </p>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div>
      <span className={muted ? "text-foreground" : "text-muted-foreground"}>{k}:</span>{" "}
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{v || "—"}</span>
    </div>
  );
}
