import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Call — Signhify" },
      {
        name: "description",
        content:
          "Tell us about your idea. We'll scope it, map the stack, and tell you exactly what it takes to ship it.",
      },
      { property: "og:title", content: "Book a Call — Signhify" },
      {
        property: "og:description",
        content: "Start a project with Signhify — AI engineering studio.",
      },
    ],
  }),
  component: ContactPage,
});

const projectTypes = ["SaaS / Product", "AI Automation", "Website / Landing", "CRM / Internal Tool", "Performance Marketing", "Other"];
const budgets = ["< ₹1L", "₹1L – ₹5L", "₹5L – ₹15L", "₹15L+"];
const timelines = ["ASAP", "2–4 weeks", "1–3 months", "Exploring"];

function ContactPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: "",
    budget: "",
    timeline: "",
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  const steps = [
    { label: "Project type", key: "type" as const, options: projectTypes },
    { label: "Budget range", key: "budget" as const, options: budgets },
    { label: "Timeline", key: "timeline" as const, options: timelines },
  ];

  return (
    <section className="relative pt-36 pb-28 min-h-[100svh]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-ember)" }} />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Start a project</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black leading-[1.05]">
          Tell us about your <span className="text-gradient">idea</span>.
        </h1>
        <p className="mt-5 text-muted-foreground text-lg max-w-xl">
          Four quick questions. We&rsquo;ll come back within 24 hours with scope, stack and next steps.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-[var(--shadow-glow)]"
          >
            <CheckCircle2 size={40} className="text-primary mx-auto" />
            <div className="mt-4 font-display text-2xl font-bold">We got it.</div>
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
          <div className="mt-12 rounded-2xl border border-border bg-card/80 backdrop-blur p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition ${
                    i <= step ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>

            {step < 3 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-sm text-muted-foreground">
                  Question {step + 1} of 4
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold">
                  {steps[step].label}
                </h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {steps[step].options.map((opt) => {
                    const active = data[steps[step].key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          update(steps[step].key, opt);
                          setTimeout(() => setStep((s) => s + 1), 180);
                        }}
                        className={`text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
                          active
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-surface hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-6 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (data.name && data.email) setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">Question 4 of 4</div>
                <h2 className="font-display text-2xl font-bold">Your details</h2>

                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                  <input
                    required
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    required
                    type="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <textarea
                  value={data.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="What are you building? (optional)"
                  rows={4}
                  className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />

                <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-xs text-muted-foreground space-y-1">
                  <div><span className="text-foreground">Type:</span> {data.type}</div>
                  <div><span className="text-foreground">Budget:</span> {data.budget}</div>
                  <div><span className="text-foreground">Timeline:</span> {data.timeline}</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
                  >
                    Send brief
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        )}

        <div className="mt-10 text-sm text-muted-foreground text-center">
          Prefer email? Reach us at{" "}
          <a href="mailto:hello@signhify.online" className="text-primary hover:underline">
            hello@signhify.online
          </a>
        </div>
      </div>
    </section>
  );
}
