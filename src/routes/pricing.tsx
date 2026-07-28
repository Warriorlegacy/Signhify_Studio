import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronDown, Shield, Code2, Zap } from "lucide-react";
import { ThreeDCard } from "@/components/ui/ThreeDCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AI Product Studio Pricing & Development Plans — Signhify" },
      {
        name: "description",
        content:
          "Transparent pricing for AI product development. Choose 2-week fixed sprints, dedicated studio team retainers, or custom platform engineering.",
      },
      { property: "og:title", content: "AI Product Studio Pricing & Development Plans — Signhify" },
      {
        property: "og:description",
        content:
          "Sprint, Studio and Platform engagement models. Transparent pricing for AI-first product execution.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/pricing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "AI Product Studio Pricing & Development Plans — Signhify",
          url: "https://signhify.dpdns.org/pricing",
          description:
            "Sprint, Studio and Platform engagement models for AI-first product execution.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }),
      },
    ],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Sprint",
    tag: "Fixed scope",
    price: "$299",
    period: "/ 5–7 day sprint",
    desc: "One focused outcome. Landing page, MVP slice, or critical feature — designed, built and deployed.",
    features: [
      "Design + build + deploy",
      "1 cinematic landing page or 1 product slice",
      "Async updates, daily Loom",
      "Code on your GitHub from day one",
      "1 round of revisions included",
    ],
    cta: "Start a sprint",
    featured: false,
    gradient: "from-blue-500/20 to-indigo-600/5",
    accent: "oklch(0.72 0.18 250)",
  },
  {
    name: "Studio",
    tag: "Most chosen",
    price: "$799",
    period: "/ 14 days",
    desc: "Embedded product team. End-to-end execution from idea to revenue, on a fixed timeline.",
    features: [
      "Dedicated product + design + engineering",
      "Weekly releases on your domain",
      "Full Signhify stack — Auth, AI, payments wired",
      "Architecture, infra, analytics included",
      "Priority Slack/WhatsApp channel",
      "Unlimited revisions per sprint",
    ],
    cta: "Book the studio",
    featured: true,
    gradient: "from-primary/25 to-orange-600/10",
    accent: "oklch(0.72 0.21 45)",
  },
  {
    name: "Platform",
    tag: "Retainer",
    price: "Custom",
    period: "",
    desc: "For founders building on the Signhify ecosystem. Custom platform work, AI pipelines, multi-app stacks.",
    features: [
      "Signhify AI / Deploy / Cloud integration",
      "Multi-app monorepo architecture",
      "Priority access to new products",
      "Direct founder line",
      "Custom SLA & support",
      "Dedicated infrastructure setup",
    ],
    cta: "Talk to Piyush",
    featured: false,
    gradient: "from-purple-500/20 to-violet-600/5",
    accent: "oklch(0.68 0.18 300)",
  },
];

const FAQ = [
  {
    q: "What's included in a Sprint?",
    a: "A Sprint is a 5–7 day engagement focused on one deliverable — a landing page, MVP feature, or product slice. You get design, engineering, deployment, and one revision round. Code is on your GitHub from day one.",
  },
  {
    q: "Can I switch from Sprint to Studio mid-project?",
    a: "Absolutely. Most clients start with a Sprint to validate fit, then upgrade to Studio for ongoing execution. We apply your Sprint investment toward the first Studio month.",
  },
  {
    q: "Do you build on my tech stack or yours?",
    a: "We adapt. If you have existing infra (Next.js, Supabase, AWS, etc.), we build on it. For greenfield projects, we recommend our proven stack — TanStack Start, Supabase, Cloudflare, Stripe — but the final call is yours.",
  },
  {
    q: "What happens after the project ships?",
    a: "You own everything — code, infra, domain. We offer optional maintenance retainers, but there's zero lock-in. Your GitHub repo and deployment credentials are yours.",
  },
  {
    q: "How do payments work?",
    a: "Sprint ($299): 100% upfront. Studio ($799): 50% at kickoff, 50% on delivery. Platform: custom terms. We accept UPI (6202442690@jio), PayPal (paypal.me/signhify), and bank transfer (A/C 000521712140642, Piyush Raj Singh, Jio Payments Bank, IFSC JIOP0000001). Stripe and Razorpay also available. Send payment confirmation on WhatsApp (+91 620202442690) and we'll credit your account within 2 hours.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We're remote-first and work across time zones. Most of our Studio clients are in India, the US, and the UK. We communicate async via Loom, Slack, and WhatsApp.",
  },
  {
    q: "Why pay Signhify instead of using AI tools directly?",
    a: "AI tools generate code, but they don't architect systems, set up auth, integrate payments, deploy to production, or handle security. Signhify delivers a production-ready SaaS — with authentication, database, Stripe billing, CI/CD, and custom domain — in 2 weeks. You get a shipping partner, not a code generator.",
  },
];

const TRUST_BADGES = [
  { icon: Code2, label: "Code on your GitHub", sub: "from day one" },
  { icon: Shield, label: "Zero lock-in", sub: "you own everything" },
  { icon: Zap, label: "Ship in weeks", sub: "not quarters" },
];

const COMPARISON_FEATURES = [
  { name: "Design + Engineering", sprint: true, studio: true, platform: true },
  { name: "Deployment to your domain", sprint: true, studio: true, platform: true },
  { name: "Code on your GitHub", sprint: true, studio: true, platform: true },
  { name: "Async daily updates", sprint: true, studio: true, platform: true },
  { name: "Weekly releases", sprint: false, studio: true, platform: true },
  { name: "Full-stack (Auth, AI, Payments)", sprint: false, studio: true, platform: true },
  { name: "Architecture & infra", sprint: false, studio: true, platform: true },
  { name: "Priority support channel", sprint: false, studio: true, platform: true },
  { name: "Unlimited revisions", sprint: false, studio: true, platform: true },
  { name: "Multi-app monorepo", sprint: false, studio: false, platform: true },
  { name: "Custom SLA", sprint: false, studio: false, platform: true },
  { name: "Direct founder line", sprint: false, studio: false, platform: true },
];

function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Breadcrumbs items={[{ label: "Pricing", to: "/pricing" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Engagement models
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-3xl">
            Three ways to ship <span className="text-gradient">with Signhify</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            Pricing is anchored, not opaque. Pick the cadence that fits your stage — a focused
            sprint, an embedded studio, or a long-term platform partnership.
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 backdrop-blur px-4 py-2"
              >
                <b.icon size={16} className="text-primary" />
                <span className="text-sm font-medium">{b.label}</span>
                <span className="text-xs text-muted-foreground">— {b.sub}</span>
              </div>
            ))}
          </div>

          {/* Pricing cards */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {TIERS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ThreeDCard
                  className={`relative rounded-2xl border bg-card/80 backdrop-blur p-7 flex flex-col h-full ${
                    t.featured ? "border-primary shadow-[var(--shadow-glow)]" : "border-border"
                  }`}
                >
                  {t.featured && (
                    <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_20px_-4px_var(--primary-glow)]">
                      {t.tag}
                    </div>
                  )}
                  {!t.featured && (
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t.tag}
                    </div>
                  )}
                  <div className="mt-4 font-display text-2xl font-bold">{t.name}</div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-black text-gradient">
                      {t.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{t.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-7 group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition ${
                      t.featured
                        ? "bg-primary text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110"
                        : "border border-border bg-surface/60 hover:border-primary/60"
                    }`}
                  >
                    {t.cta}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            All engagements include source code on your GitHub, deployment on your infra (Vercel /
            Netlify / Cloudflare), and no platform lock-in.
          </p>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">AI credits</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-2xl">
            Self-serve AI credits — no call needed
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-xl">
            Used for AI prototype generation, landing page builds, and video creation. Credits never
            expire.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              {
                label: "Starter Pack",
                credits: 10,
                price: "$19",
                desc: "Try a single AI prototype or landing page",
              },
              {
                label: "Pro Pack",
                credits: 50,
                price: "$79",
                desc: "For active founders iterating weekly",
                featured: true,
              },
              {
                label: "Ultra Pack",
                credits: 200,
                price: "$249",
                desc: "Production-scale generation",
              },
            ].map((pack, i) => (
              <div
                key={pack.label}
                className={`rounded-2xl border p-6 flex flex-col ${pack.featured ? "border-primary shadow-[var(--shadow-glow)] bg-card/80 backdrop-blur" : "border-border bg-card/60"}`}
              >
                {pack.featured && (
                  <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                    Best value
                  </div>
                )}
                <div className="font-display text-xl font-bold">{pack.label}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-gradient">
                    {pack.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/ {pack.credits} credits</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{pack.desc}</p>
                <Link
                  to="/login"
                  search={{ redirect: "/app/billing" }}
                  className={`mt-5 group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition ${
                    pack.featured
                      ? "bg-primary text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110"
                      : "border border-border bg-surface/60 hover:border-primary/60"
                  }`}
                >
                  Sign up & buy{" "}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Compare plans</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-2xl">
            Feature-by-feature breakdown
          </h2>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card/60 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display font-semibold text-muted-foreground">
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.name}
                      className={`p-4 font-display font-semibold text-center ${t.featured ? "text-primary" : ""}`}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((f, i) => (
                  <tr
                    key={f.name}
                    className={`border-b border-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}
                  >
                    <td className="p-4 text-foreground">{f.name}</td>
                    {(["sprint", "studio", "platform"] as const).map((tier) => (
                      <td key={tier} className="p-4 text-center">
                        {f[tier] ? (
                          <Check size={16} className="text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Questions founders ask
          </h2>

          <div className="mt-12 space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={false}
                  className="rounded-xl border border-border bg-card/80 backdrop-blur overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-semibold text-base">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown size={18} className="text-muted-foreground" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 border-t border-border">
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Ready to <span className="text-gradient">ship something real</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start with a Sprint. Upgrade when you&rsquo;re ready. No contracts, no lock-in.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
            >
              Start a project <ArrowRight size={16} />
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-semibold hover:border-primary/60 transition"
            >
              Book a 30-min call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
