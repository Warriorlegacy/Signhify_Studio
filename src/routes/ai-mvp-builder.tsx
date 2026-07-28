import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Rocket,
  Code2,
  Sparkles,
  Ship,
  Star,
  Clock,
  ShieldCheck,
  Zap,
  Wallet,
  AlertCircle,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/ai-mvp-builder")({
  head: () => ({
    meta: [
      { title: "AI MVP Builder — Ship Your SaaS in 2 Weeks for $299 | Signhify" },
      {
        name: "description",
        content:
          "Describe your idea. We build a production-ready AI SaaS in 14 days. Full code on your GitHub, BYOK encryption, Stripe billing. Fixed-price from $299. No lock-in.",
      },
      {
        property: "og:title",
        content: "AI MVP Builder — Ship Your SaaS in 2 Weeks for $299 | Signhify",
      },
      {
        property: "og:description",
        content:
          "Describe your SaaS idea. Our 6 AI agents generate the architecture. We ship it in 14 days. Full code ownership, fixed price, no lock-in.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/ai-mvp-builder" },
      { property: "og:image", content: "https://signhify.dpdns.org/og-ai-mvp.png" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/ai-mvp-builder" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "AI MVP Builder by Signhify",
          description:
            "Fixed-price AI SaaS development sprint. Describe your idea, get a production-ready app in 14 days with full code ownership.",
          brand: { "@type": "Brand", name: "Signhify AI Studio" },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "299",
            highPrice: "799",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            bestRating: "5",
            ratingCount: "12",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How much does the AI MVP Builder cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sprint tier is $299 for a 5-7 day MVP. Studio tier is $799+ for a full 14-day platform. Both are fixed-price with no hidden fees.",
              },
            },
            {
              "@type": "Question",
              name: "Do I get the source code?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes — full MIT-licensed source code is transferred to your GitHub on day 1. There is no lock-in or proprietary framework.",
              },
            },
            {
              "@type": "Question",
              name: "How long does it take to build an MVP?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sprint MVP ships in 5-7 days. Studio full platform ships in 14 days. This is possible because our 6-agent AI pipeline generates the architecture in 15 seconds, so engineers build instead of designing from scratch.",
              },
            },
            {
              "@type": "Question",
              name: "What tech stack do you use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "TanStack Start + React 19 SSR for frontend, Supabase PostgreSQL with Row-Level Security for backend, Stripe for billing, Cloudflare Workers for edge deployment, and BYOK AES-256 encryption for enterprise security.",
              },
            },
            {
              "@type": "Question",
              name: "What is BYOK encryption and why does it matter?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BYOK (Bring Your Own Key) means your API keys for OpenAI, Anthropic, etc. are encrypted client-side with AES-256 GCM before they ever touch our server. This is an enterprise security requirement that most AI SaaS startups don't offer.",
              },
            },
            {
              "@type": "Question",
              name: "Can I see examples of your work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The entire Signhify codebase is open source on GitHub at github.com/Warriorlegacy/Signhify_Studio. You can inspect every line of code, commit history, and architecture decision.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AiMvpBuilderPage,
});

const TIERS = [
  {
    name: "Sprint",
    price: "$299",
    timeline: "5-7 days",
    desc: "Production MVP with full stack — validate your idea with real users fast.",
    features: [
      "Core UI + responsive design",
      "Supabase auth + database + RLS",
      "Custom domain deployment",
      "CI/CD pipeline",
      "Full GitHub transfer (MIT)",
    ],
    cta: "Start Sprint",
    popular: false,
  },
  {
    name: "Studio",
    price: "$799",
    timeline: "14 days",
    desc: "Full SaaS platform with AI agents, billing, and enterprise security.",
    features: [
      "Everything in Sprint, plus:",
      "6-agent AI pipeline integration",
      "BYOK AES-256 encryption vault",
      "Stripe billing with metering",
      "Admin dashboard with analytics",
      "30-day support",
    ],
    cta: "Start Studio",
    popular: true,
  },
  {
    name: "Platform",
    price: "Custom",
    timeline: "Tailored",
    desc: "Dedicated multi-agent orchestration and custom infrastructure.",
    features: [
      "Custom LLM fine-tuning",
      "Multi-agent orchestration",
      "Dedicated infrastructure",
      "SLA guarantees",
      "Team training & handoff",
    ],
    cta: "Contact us",
    popular: false,
  },
];

const STEPS = [
  {
    icon: Code2,
    title: "Describe",
    desc: "Tell us your idea in one sentence. Our 6 AI agents generate a full architecture plan — schema, routes, UI specs, security audit — in 15 seconds.",
  },
  {
    icon: Rocket,
    title: "We Build",
    desc: "Engineers ship the production SaaS in 14 days. You get daily updates, full code on your GitHub from day 1, and zero lock-in.",
  },
  {
    icon: Ship,
    title: "You Launch",
    desc: "Deployed on your domain with Stripe billing live. You own the code, the infra, and the business. No recurring fees, no vendor dependency.",
  },
];

const FAQS = [
  {
    q: "How much does it cost?",
    a: "Sprint ($299) for a 5-7 day production MVP. Studio ($799+) for a full 14-day platform with AI agents and Stripe billing. Both are fixed-price.",
  },
  {
    q: "Do I get the source code?",
    a: "Yes — full MIT-licensed source code on your GitHub from day 1. No proprietary frameworks, no lock-in. You can walk at any time with everything you paid for.",
  },
  {
    q: "What kind of projects do you build?",
    a: "AI SaaS platforms, agent workflows, analytics dashboards, marketplace apps, internal tools — anything with auth, database, billing, and AI integration.",
  },
  {
    q: "How is this different from Lovable / v0 / Bolt?",
    a: "Those are prototyping tools. Signhify ships production-grade SaaS with auth, RLS, Stripe billing, BYOK encryption, and edge deployment. Prototypes vs production.",
  },
  {
    q: "What if I don't like the result?",
    a: "We do a 30-min handoff call, document all feedback, and make one revision round. If it's still not right, you only pay for the time spent (prorated).",
  },
  {
    q: "Do you offer maintenance?",
    a: "No retainers. You get the full code and CI/CD pipeline. Need changes? Commission a new sprint. You're never locked into ongoing payments.",
  },
  {
    q: "Can you sign an NDA?",
    a: "Yes — standard mutual NDA. But the conversation and our open-source codebase are worth more than any NDA.",
  },
  {
    q: "How do I start?",
    a: "Fill the form below or book a 15-min blueprint call. I'll review your idea and send a fixed-price proposal within 24 hours.",
  },
];

const TESTIMONIALS = [
  {
    quote: "The BYOK feature alone closed 3 enterprise deals. They wouldn't sign without it.",
    author: "Client, AI Analytics SaaS",
    tier: "Studio ($799)",
  },
  {
    quote: "I should have done this 3 months ago — I'd be 3 months ahead on revenue.",
    author: "Client, E-commerce AI Platform",
    tier: "Studio ($799)",
  },
  {
    quote: "Full code ownership removed every vendor objection my board had.",
    author: "Client, B2B SaaS Startup",
    tier: "Studio ($799)",
  },
];

function AiMvpBuilderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [tier, setTier] = useState("studio");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [source, setSource] = useState("direct");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    if (utm) setSource(utm);
  }, []);

  const valid =
    name.trim().length >= 2 && /^[^\s]+@[^\s]+\.[^\s]+$/.test(email) && project.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!valid) return;

    setSubmitting(true);
    try {
      const { submitLead } = await import("@/lib/leads.functions");
      await submitLead({
        data: {
          type: "SaaS / Product",
          scope: "Brand-new build",
          budget: tier === "sprint" ? "< $500" : "$2,000 – $5,000",
          timeline: "2–4 weeks",
          goals: ["Launch an MVP", "Replace manual work with AI"],
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: `[AI MVP Builder - ${tier}] ${project.trim()}`,
        },
      });
      setSubmitted(true);
    } catch (e) {
      // Local fallback
      try {
        const key = "signhify_pending_leads";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({
          name,
          email,
          company,
          project,
          tier,
          source,
          at: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(prev));
      } catch {
        /* noop */
      }
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong — email Piyushrajsingh092@gmail.com instead.",
      );
    } finally {
      setSubmitting(false);
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
        <Breadcrumbs items={[{ label: "AI MVP Builder", to: "/ai-mvp-builder" }]} />

        {/* ─── Hero ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mt-6">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles size={14} />
              {source !== "direct" ? `Via ${source}` : "Fixed-price sprint"}
            </div>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl font-black leading-[1.05]">
              From idea to <span className="text-gradient">working SaaS</span> in 14 days.
            </h1>
            <p className="mt-5 text-muted-foreground text-lg">
              Describe your idea. Our 6 AI agents generate the full architecture. Engineers ship
              production code to your GitHub. Stripe billing, BYOK encryption, edge deployment —
              included. <span className="text-foreground font-semibold">From $299.</span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: CheckCircle2, text: "Full code ownership" },
                { icon: ShieldCheck, text: "BYOK encryption" },
                { icon: Zap, text: "14-day delivery" },
                { icon: Wallet, text: "Fixed price" },
              ].map((badge) => (
                <span
                  key={badge.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium"
                >
                  <badge.icon size={12} className="text-primary" />
                  {badge.text}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card/60 p-5">
              <p className="text-sm font-medium mb-1">Try it free:</p>
              <a
                href="/ai"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                AI Blueprint Generator →
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Describe your idea in one sentence. Get a full architecture plan in 15 seconds. No
                signup needed.
              </p>
            </div>
          </div>

          {/* ─── Lead Form ───────────────────────────────── */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <CheckCircle2 size={40} className="text-primary mx-auto" />
                  <h2 className="mt-4 font-display text-2xl font-bold">Blueprint received.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Piyush (founder) will reply within 24 hours at{" "}
                    <span className="text-foreground font-medium">{email}</span> with scope,
                    architecture, and fixed pricing.
                  </p>
                  <div className="mt-6 space-y-2 text-sm text-left">
                    <p className="text-xs text-muted-foreground">In the meantime:</p>
                    <a href="/ai" className="block text-primary hover:underline text-sm">
                      → Try the free AI Blueprint Generator
                    </a>
                    <a
                      href="https://github.com/Warriorlegacy/Signhify_Studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline text-sm"
                    >
                      → Browse the open-source codebase
                    </a>
                    <a
                      href="mailto:Piyushrajsingh092@gmail.com"
                      className="block text-primary hover:underline text-sm"
                    >
                      → Or email directly
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-display text-xl font-bold">Get your fixed-price quote</h2>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your idea. We'll send scope, architecture, and pricing within 24
                    hours.
                  </p>

                  {/* Tier selector */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "sprint", label: "Sprint $299", desc: "5-7 day MVP" },
                      { value: "studio", label: "Studio $799", desc: "14-day full platform" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTier(t.value)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          tier === t.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-surface hover:border-primary/50"
                        }`}
                      >
                        <span className="font-semibold">{t.label}</span>
                        <span className="block text-xs text-muted-foreground">{t.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1"
                    >
                      Your name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="e.g. Sarah Chen"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="sarah@company.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1"
                    >
                      Company (optional)
                    </label>
                    <input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Your startup name"
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="project"
                      className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1"
                    >
                      Describe your idea
                    </label>
                    <textarea
                      id="project"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="e.g. AI-powered invoicing for freelancers with Stripe integration and team collaboration..."
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive" role="alert">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!valid || submitting}
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {submitting ? "Sending..." : "Get my fixed-price quote"}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Free. No commitment. Response within 24 hours from the founder.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ─── Social Proof ──────────────────────────────── */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-3">
              <Star size={12} /> Trusted by founders building AI startups
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">What clients say</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-surface/50 p-5"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.author}</span>
                  <span className="text-primary">{t.tier}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Pricing ───────────────────────────────────── */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Fixed-price sprints</h2>
            <p className="mt-2 text-muted-foreground">
              No hourly billing. No surprise overages. No lock-in.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {TIERS.map((t) => (
              <motion.div
                key={t.name}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                viewport={{ once: true }}
                className={`rounded-xl border p-6 relative ${
                  t.popular
                    ? "border-primary bg-card shadow-[0_0_32px_-12px_var(--primary-glow)]"
                    : "border-border bg-surface/50"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{t.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black">{t.price}</span>
                  {t.price !== "Custom" && (
                    <span className="text-sm text-muted-foreground">one-time</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.timeline} &middot; {t.desc}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.price === "Custom" ? "/contact" : "#form"}
                  className={`mt-6 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    t.popular
                      ? "bg-primary text-primary-foreground shadow-[0_0_24px_-6px_var(--primary-glow)] hover:brightness-110"
                      : "border border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  {t.cta} <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Govt. MSME registered (UDYAM-UP-30-0081308) &middot; Open source (MIT) on{" "}
            <a
              href="https://github.com/Warriorlegacy/Signhify_Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>

        {/* ─── How it works ──────────────────────────────── */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="mt-2 text-muted-foreground">
              Describe, we build, you launch. Fourteen days, start to finish.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <s.icon size={24} className="text-primary" />
                </div>
                <div className="mt-4 rounded-full bg-primary/10 text-primary text-xs font-mono px-2 py-0.5 inline-block">
                  Step {i + 1}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Technology Stack ──────────────────────────── */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Production stack, not prototype tools
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every sprint ships on this battle-tested architecture.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "TanStack Start", desc: "React 19 SSR, file-based routing" },
              { name: "Supabase", desc: "PostgreSQL, auth, RLS, edge functions" },
              { name: "BYOK Vault", desc: "AES-256 GCM client-side encryption" },
              { name: "Stripe", desc: "Subscriptions, metered billing" },
              { name: "Cloudflare", desc: "Workers edge, ~50ms cold start" },
              { name: "Claude / GPT-4o", desc: "Multi-model AI with auto-fallback" },
            ].map((tech) => (
              <div key={tech.name} className="rounded-xl border border-border bg-surface/50 p-4">
                <div className="font-semibold text-sm">{tech.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://github.com/Warriorlegacy/Signhify_Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View the full open-source codebase on GitHub →
            </a>
          </div>
        </div>

        {/* ─── FAQ ────────────────────────────────────────── */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Final CTA ─────────────────────────────────── */}
        <div className="mt-24 text-center max-w-2xl mx-auto">
          <div className="rounded-2xl border border-primary/30 bg-card p-10 shadow-[0_0_40px_-16px_var(--primary-glow)]">
            <h2 className="font-display text-3xl font-bold">Ready to ship your SaaS?</h2>
            <p className="mt-3 text-muted-foreground">
              Describe your idea above. We'll send scope, architecture, and fixed pricing within 24
              hours. No commitment. No sales pitch. Just a blueprint.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
              >
                Get my quote <ArrowRight size={16} />
              </a>
              <a
                href="mailto:Piyushrajsingh092@gmail.com"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold hover:border-primary/50 transition"
              >
                <Mail size={16} /> Email Piyush directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
