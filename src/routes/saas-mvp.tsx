import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code2,
  Rocket,
  Shield,
  Zap,
  Users,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/saas-mvp")({
  head: () => ({
    meta: [
      { title: "$299 AI SaaS MVP Sprint — 2-Week Delivery | Signhify" },
      {
        name: "description",
        content:
          "Ship your AI SaaS MVP in 2 weeks for a fixed price. Design, engineering, deployment — code on your GitHub, zero lock-in. Start your Sprint today.",
      },
      { property: "og:title", content: "$299 AI SaaS MVP Sprint — 2-Week Delivery | Signhify" },
      {
        property: "og:description",
        content:
          "From idea to deployed AI SaaS in 14 days. Fixed-price Sprint includes design, engineering, and deployment.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/saas-mvp" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/saas-mvp" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "$299 AI SaaS MVP Sprint",
          image: "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
          description: "2-week fixed-price sprint to design, build, and deploy an AI SaaS MVP.",
          brand: { "@type": "Brand", name: "Signhify" },
          offers: {
            "@type": "Offer",
            price: "299",
            priceCurrency: "USD",
            availability: "https://schema.org/OnlineOnly",
            url: "https://signhify.dpdns.org/saas-mvp",
          },
        }),
      },
    ],
  }),
  component: SaaSMvpPage,
});

const PRICING = {
  label: "MVP Sprint",
  price: "$299",
  usd: "$299",
  period: "one-time",
  desc: "Everything you need to go from idea to deployed AI SaaS in 5–7 days.",
};

const WHATS_INCLUDED = [
  "Design + frontend + backend engineering",
  "AI integration (OpenAI / Anthropic / custom)",
  "Supabase auth + database + RLS",
  "Stripe billing integration",
  "Deployed to your custom domain",
  "Code on your GitHub from day one",
  "Daily async updates via Loom",
  "1 round of revisions",
];

const PROCESS = [
  {
    icon: Code2,
    title: "1. Scope & Architect",
    desc: "We map your idea to a technical blueprint. Tech stack, data model, API endpoints — agreed before we write a line of code.",
  },
  {
    icon: Rocket,
    title: "2. Build & Integrate",
    desc: "One focused build sprint. Auth, database, AI integration, payments — wired end-to-end. You see progress daily.",
  },
  {
    icon: Shield,
    title: "3. Deploy & Deliver",
    desc: "Deployed to your domain on your infra. Source code transferred to your GitHub. You own everything — no lock-in.",
  },
];

const SOCIAL_PROOF = [
  { icon: Star, label: "20+ AI products shipped", sub: "across startups and enterprises" },
  { icon: Users, label: "MSME registered studio", sub: "Govt. of India (UDYAM-UP-30-0081308)" },
  { icon: Clock, label: "24-hour response", sub: "on every brief and support request" },
  { icon: Zap, label: "Zero lock-in", sub: "you own all code and infra" },
];

const FAQ = [
  {
    q: "What exactly do I get in 2 weeks?",
    a: "A production-ready AI SaaS MVP with authentication, database, AI feature, Stripe payments, and deployment on your domain. Everything you need to start charging customers.",
  },
  {
    q: "Who is this for?",
    a: "Founders with a clear idea who want to validate fast. If you're exploring or need a full product suite, our Studio retainer is a better fit.",
  },
  {
    q: "What tech stack do you use?",
    a: "TanStack Start + Supabase + Cloudflare + Stripe. We adapt if you have existing infra. See our full services for details.",
  },
  {
    q: "What if I need changes after the sprint?",
    a: "You can extend with another Sprint or upgrade to Studio retainer. There's zero lock-in — your code, your infra, your domain.",
  },
];

function SaaSMvpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-ember)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Breadcrumbs items={[{ label: "SaaS MVP Sprint", to: "/saas-mvp" }]} />
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
                <Sparkles size={13} /> Fixed-price · 2-week delivery
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
                Ship your AI SaaS MVP <span className="text-gradient">in 2 weeks</span>.
              </h1>
              <p className="mt-5 text-muted-foreground text-lg max-w-xl">
                One focused sprint. Design, engineering, AI integration, payments — deployed to your
                domain. Code on your GitHub from day one. Zero lock-in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
                >
                  Book your sprint <ArrowRight size={16} />
                </Link>
                <Link
                  to="/free-consultation"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold hover:border-primary/60 transition"
                >
                  Free consultation
                </Link>
              </div>
            </div>

            {/* Pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-primary/40 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                Fixed price
              </div>
              <div className="font-display text-2xl font-bold">{PRICING.label}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-gradient">
                  {PRICING.price}
                </span>
                <span className="text-muted-foreground text-sm">/ {PRICING.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{PRICING.usd}</p>
              <p className="mt-4 text-sm text-muted-foreground">{PRICING.desc}</p>

              <div className="mt-6 space-y-2.5">
                {WHATS_INCLUDED.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/book"
                className="mt-7 w-full group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
              >
                Start your sprint{" "}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof badges */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center mb-8">
            Trusted by founders shipping AI products
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SOCIAL_PROOF.map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-border bg-card/60 p-5 text-center"
              >
                <b.icon size={20} className="text-primary mx-auto" />
                <div className="mt-2 font-semibold text-sm">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            How it works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            From idea to deployed SaaS in <span className="text-gradient">14 days</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card/60 p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4">
                  <step.icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Common questions
          </h2>
          <div className="mt-10 space-y-3">
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
                      <ArrowRight size={16} className="text-muted-foreground shrink-0" />
                    </motion.span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  )}
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
            Ready to ship your <span className="text-gradient">AI SaaS MVP</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start with a Sprint. No contracts. No lock-in. Your code, your infra, your success.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
            >
              Book your sprint <ArrowRight size={16} />
            </Link>
            <Link
              to="/free-consultation"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-semibold hover:border-primary/60 transition"
            >
              Free consultation
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Explore our{" "}
            <Link to="/services" className="text-primary hover:underline">
              services
            </Link>{" "}
            and{" "}
            <Link to="/pricing" className="text-primary hover:underline">
              pricing
            </Link>{" "}
            for more options.
          </p>
        </div>
      </section>
    </>
  );
}
