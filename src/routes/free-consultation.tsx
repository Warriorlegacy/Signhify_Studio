import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/free-consultation")({
  head: () => ({
    meta: [
      { title: "Free AI Product Consultation — Signhify AI Studio" },
      {
        name: "description",
        content:
          "Get a free 30-minute AI product consultation with Founder Piyush Raj Singh. Scope your idea, map the tech stack, and get a fixed-price estimate.",
      },
      {
        property: "og:title",
        content: "Free AI Product Consultation — Signhify AI Studio",
      },
      {
        property: "og:description",
        content:
          "Tell us about your idea. We come back within 24 hours with scope, tech stack, and fixed pricing.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/free-consultation" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/free-consultation" }],
  }),
  component: FreeConsultationPage,
});

function FreeConsultationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    name.trim().length >= 2 && /^[^\s]+@[^\s]+\.[^\s]+$/.test(email) && project.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!valid) return;
    try {
      const { submitLead } = await import("@/lib/leads.functions");
      await submitLead({
        data: {
          type: "SaaS / Product",
          scope: "Brand-new build",
          budget: "Not sure yet",
          timeline: "Exploring",
          goals: ["Launch an MVP"],
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: project.trim(),
        },
      });
      setSubmitted(true);
    } catch (e) {
      try {
        if (typeof window !== "undefined") {
          const key = "signhify_pending_leads";
          const prev = JSON.parse(localStorage.getItem(key) || "[]");
          prev.push({ name, email, company, project, at: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(prev));
        }
      } catch {
        /* noop */
      }
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Email Piyushrajsingh092@gmail.com instead.",
      );
    }
  };

  return (
    <section className="relative pt-36 pb-28 min-h-svh">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-ember)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Free Consultation", to: "/free-consultation" }]} />

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start mt-6">
          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
              <Sparkles size={13} /> Free 30-min call
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-black leading-[1.05]">
              Scope your AI idea. <span className="text-gradient">No charge.</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl">
              Tell us what you're building. Piyush — founder and lead engineer — reviews every
              submission personally and comes back within 24 hours with a scope, stack, and
              fixed-price estimate.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Architecture blueprint</div>
                  <div className="text-xs text-muted-foreground">
                    Tech stack diagram, data model, and deployment plan
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Fixed-price quote</div>
                  <div className="text-xs text-muted-foreground">
                    No surprises. You know the cost before we start.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">2-week delivery option</div>
                  <div className="text-xs text-muted-foreground">
                    Production-ready sprint for focused builds
                  </div>
                </div>
              </div>
            </div>

            {/* Fast lanes */}
            <div className="mt-10 space-y-3">
              <div className="text-xs uppercase tracking-[0.25em] text-primary">
                Prefer instant?
              </div>
              <a
                href="https://calendly.com/signhify/30min"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition mr-3"
              >
                <CalendarClock size={16} className="text-primary" /> Pick a Calendly slot
              </a>
              <a
                href="https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%20want%20a%20free%20consultation."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition mr-3"
              >
                <MessageCircle size={16} className="text-emerald-400" /> WhatsApp
              </a>
              <a
                href="tel:+916202442690"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
              >
                <Phone size={16} className="text-primary" /> Call +91 62024 42690
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 sm:p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle2 size={40} className="text-primary mx-auto" />
                <div className="mt-4 font-display text-2xl font-bold">Brief received.</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Piyush will reply within 24 hours at{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                </p>
                <div className="mt-6 rounded-xl border border-border bg-surface/60 p-5 text-left text-sm">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
                    What happens next
                  </div>
                  <ol className="space-y-2 text-xs text-muted-foreground list-decimal ml-4">
                    <li>Piyush reviews your brief personally</li>
                    <li>We prepare a scope doc and fixed-price estimate</li>
                    <li>30-min call to walk through the plan</li>
                    <li>If it fits, we start your Sprint within 48 hours</li>
                  </ol>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  In a hurry?{" "}
                  <a
                    href="https://calendly.com/signhify/30min"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Book a Calendly slot
                  </a>{" "}
                  instead.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="font-display text-xl font-bold mb-1">Get your free plan</div>
                <p className="text-xs text-muted-foreground mb-6">
                  Fill this in. We reply within 24 hours.
                </p>

                <div className="space-y-4">
                  <Field
                    id="fc-name"
                    label="Your name"
                    value={name}
                    onChange={setName}
                    placeholder="Piyush Raj Singh"
                    maxLength={120}
                    autoComplete="name"
                  />
                  <Field
                    id="fc-email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="piyush@example.com"
                    maxLength={200}
                    autoComplete="email"
                  />
                  <Field
                    id="fc-company"
                    label="Company (optional)"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Inc."
                    maxLength={120}
                    autoComplete="organization"
                  />
                  <div>
                    <label
                      htmlFor="fc-project"
                      className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5"
                    >
                      Describe your project *
                    </label>
                    <textarea
                      id="fc-project"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      placeholder="What are you building? What problem does it solve? Any timeline or budget constraints?"
                      rows={5}
                      maxLength={2000}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    {project.length > 0 && project.length < 10 && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle size={12} /> Please describe your project briefly
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div
                    className="mt-4 flex items-center gap-2 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!valid}
                  className="mt-6 w-full group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Get my free plan{" "}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                </button>

                <p className="mt-3 text-[10px] text-muted-foreground text-center">
                  By submitting you agree to be contacted by Signhify. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Trusted by / social proof */}
        <div className="mt-20 border-t border-border/50 pt-12 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Trusted by founders building AI products
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="px-3 py-1.5 rounded-md border border-border bg-surface/40">
              ⚡ 24-hour response guarantee
            </span>
            <span className="px-3 py-1.5 rounded-md border border-border bg-surface/40">
              🔒 Zero lock-in — you own all code
            </span>
            <span className="px-3 py-1.5 rounded-md border border-border bg-surface/40">
              📦 2-week sprint delivery
            </span>
            <span className="px-3 py-1.5 rounded-md border border-border bg-surface/40">
              🏭 MSME registered (UDYAM-UP-30-0081308)
            </span>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            Prefer browsing first? See{" "}
            <Link to="/services" className="text-primary hover:underline">
              our services
            </Link>{" "}
            or{" "}
            <Link to="/pricing" className="text-primary hover:underline">
              pricing
            </Link>
            .
          </div>
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
  placeholder,
  type = "text",
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
