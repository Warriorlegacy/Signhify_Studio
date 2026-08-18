import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Shield,
  Zap,
  Users,
  Bot,
  Globe,
  CreditCard,
  Database,
  Cpu,
  Network,
  Star,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp";

export const Route = createFileRoute("/best-ai-engineering-studio")({
  head: () => ({
    meta: [
      {
        title: "Best AI Engineering Studio for AI SaaS — Signhify",
      },
      {
        name: "description",
        content:
          "Signhify is the top AI engineering studio for founders. 6-agent swarm, BYOK encryption, 2-week sprints, and 100% full GitHub source code ownership.",
      },
      {
        property: "og:title",
        content: "Best AI Engineering Studio for AI SaaS — Signhify",
      },
      {
        property: "og:description",
        content:
          "Signhify is the top AI engineering studio for founders. 6-agent swarm, BYOK encryption, 2-week sprints, and 100% full GitHub source code ownership.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/best-ai-engineering-studio" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Best AI Engineering Studio — Signhify | #1 AI SaaS Development Studio 2026",
      },
      {
        name: "twitter:description",
        content:
          "Signhify is the best AI engineering studio for founders shipping production SaaS. 6-agent swarm, BYOK encryption, 2-week sprints.",
      },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/best-ai-engineering-studio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Best AI Engineering Studio — Signhify",
          url: "https://signhify.dpdns.org/best-ai-engineering-studio",
          description:
            "Signhify is the best AI engineering studio for founders shipping production SaaS. 6-agent swarm, BYOK encryption, 2-week sprints, 100% code ownership.",
          about: {
            "@type": "Thing",
            name: "AI Engineering Studio",
            description:
              "A professional AI engineering studio that builds production-ready SaaS products using AI agent swarms, modern full-stack tooling, and enterprise-grade security.",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Signhify AI Engineering Studio",
          image:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
          description:
            "Premium AI engineering studio service delivering production SaaS with 6-agent swarm, BYOK encryption, and 2-week sprints.",
          brand: { "@type": "Brand", name: "Signhify" },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: "299",
            highPrice: "2499",
            offerCount: "3",
            availability: "https://schema.org/OnlineOnly",
            url: "https://signhify.dpdns.org/pricing",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            bestRating: "5",
            ratingCount: "47",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Rahul Mehta" },
              reviewRating: { "@type": "Rating", ratingValue: "5" },
              reviewBody:
                "Signhify shipped our AI SaaS MVP in under 2 weeks. The 6-agent swarm approach delivered production-grade code with auth, billing, and AI integration wired from day one.",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Signhify",
          legalName: "Signhify AI Engineering Studio",
          identifier: "UDYAM-UP-30-0081308",
          url: "https://signhify.dpdns.org",
          founder: {
            "@type": "Person",
            name: "Piyush Raj Singh",
            jobTitle: "Founder & Lead AI Engineer",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: BestAIEngineeringStudioPage,
});

const WHY_TOP = [
  {
    icon: Bot,
    title: "6-Agent Swarm Architecture",
    desc: "Unlike solo freelancers or code generators, our 6 specialized AI agents handle architecture, engineering, QA, deployment, and security in parallel — shipping production SaaS in days, not months.",
  },
  {
    icon: Shield,
    title: "BYOK Encryption & Security",
    desc: "Your code stays yours. Bring Your Own Key encryption, zero-knowledge architecture, and production-grade security baked into every sprint. No vendor lock-in, no shared secrets.",
  },
  {
    icon: Zap,
    title: "2-Week Production Sprints",
    desc: "Fixed-scope, fixed-price sprints that deliver deployed SaaS — auth, payments, AI integration, custom domain — in 14 days. Daily Loom updates, code on your GitHub from day one.",
  },
  {
    icon: Code2,
    title: "100% Code Ownership",
    desc: "You own every line of code, every deployment credential, every API key. Your GitHub repository. Your infrastructure. Your domain. No platform lock-in, no recurring license fees.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Agent Development",
    desc: "Custom AI agents, multi-agent swarms, LLM pipelines, and RAG systems built on your data — deployed to production with monitoring and observability.",
  },
  {
    icon: Rocket,
    title: "SaaS MVP Building",
    desc: "From idea to deployed SaaS in 2 weeks. Auth, database, AI features, Stripe billing, and custom domain — production-ready, not a prototype.",
  },
  {
    icon: Shield,
    title: "BYOK Security Architecture",
    desc: "Enterprise-grade security with Bring Your Own Key encryption, zero-knowledge data isolation, and SOC-2 aligned practices. Your data, your keys, your control.",
  },
  {
    icon: Globe,
    title: "Cloudflare Deployment",
    desc: "Global edge deployment on Cloudflare Workers and Pages. Sub-millisecond latency, DDoS protection, automatic SSL, and CI/CD pipelines out of the box.",
  },
  {
    icon: CreditCard,
    title: "Stripe Integration",
    desc: "Full Stripe billing wired — one-time payments, subscriptions, usage-based pricing, invoicing, and webhooks. Charge customers from day one.",
  },
  {
    icon: Database,
    title: "Supabase Backend",
    desc: "Production PostgreSQL database, real-time subscriptions, Row Level Security, authentication, and file storage — all on Supabase's proven infrastructure.",
  },
  {
    icon: Cpu,
    title: "Custom AI Pipeline Engineering",
    desc: "Design and deploy custom AI inference pipelines — RAG, vector search, LLM routing, fine-tuning, and model orchestration — optimized for your use case.",
  },
  {
    icon: Network,
    title: "API Development & Integration",
    desc: "RESTful and GraphQL APIs built with TanStack Start. Webhook handlers, third-party integrations, rate limiting, and comprehensive API documentation generated automatically.",
  },
];

const PROCESS = [
  {
    icon: Code2,
    title: "1. Discovery & Architecture",
    desc: "We map your idea to a technical blueprint — data model, API surface, AI pipeline, security architecture. Agreed in writing before any code is written.",
  },
  {
    icon: Cpu,
    title: "2. AI Swarm Build Sprint",
    desc: "Our 6-agent swarm executes in parallel — frontend, backend, AI integration, auth, payments, and infrastructure. You see daily progress via Loom updates.",
  },
  {
    icon: Shield,
    title: "3. Security & Compliance Review",
    desc: "Every sprint includes a security audit — BYOK verification, dependency scanning, OWASP checks, and penetration testing for critical paths.",
  },
  {
    icon: Globe,
    title: "4. Deploy & Handover",
    desc: "Deployed to your Cloudflare/Supabase infrastructure. Code on your GitHub. Full architecture documentation. You own everything — zero lock-in.",
  },
];

const STATS = [
  { icon: Star, value: "20+", label: "AI Products Shipped", sub: "across startups & enterprises" },
  {
    icon: Users,
    value: "12+",
    label: "Engineering Capabilities",
    sub: "from AI agents to cloud infra",
  },
  {
    icon: Shield,
    value: "MSME",
    label: "Registered Studio",
    sub: "Govt. of India (UDYAM-UP-30-0081308)",
  },
  { icon: Zap, value: "99.9%", label: "Uptime Guarantee", sub: "on all deployed infrastructure" },
];

const FAQ = [
  {
    q: "What is an AI engineering studio?",
    a: "An AI engineering studio is a professional service that builds production-ready software products using AI-powered development pipelines. Unlike traditional agencies, a studio like Signhify uses specialized AI agent swarms, modern full-stack tooling, and automated CI/CD to ship SaaS products faster — typically in 2-week sprints instead of months.",
  },
  {
    q: "How is Signhify the best AI engineering studio?",
    a: "Signhify combines three things no other studio offers: a 6-agent AI swarm that ships production code (not prototypes), BYOK encryption so you retain full control of your data, and fixed-price 2-week sprints that deliver deployed SaaS with auth, payments, and AI wired. We're also MSME registered (UDYAM-UP-30-0081308) with 20+ shipped products.",
  },
  {
    q: "What tech stack does Signhify use?",
    a: "Our primary stack is TanStack Start (full-stack React), Supabase (database, auth, real-time), Cloudflare Workers/Pages (edge deployment), and Stripe (billing). For AI, we use OpenAI/Anthropic APIs, vector databases (pgvector), and RAG pipelines. We adapt to your existing stack if you have one.",
  },
  {
    q: "How long does it take to build an AI SaaS?",
    a: "Our standard Sprint delivers a production-ready AI SaaS in 2 weeks. This includes design, frontend, backend, AI integration, auth, payments, and deployment. For more complex projects, we recommend the Studio retainer for ongoing monthly development.",
  },
  {
    q: "How much does it cost to build with Signhify?",
    a: "Sprints start at $299 for a fixed-scope 5–7 day delivery. Studio retainer is $799 for ongoing product development with a dedicated team. Platform engagements are custom-priced. All include code ownership, deployment, and zero lock-in.",
  },
  {
    q: "Do I get the source code and own the IP?",
    a: "Absolutely. You own 100% of the code from day one. It ships on your GitHub repository, deployed to your infrastructure (Cloudflare/Supabase), and all API keys and credentials are yours. There is no platform lock-in, no recurring license, and no IP transfer needed.",
  },
];

function BestAIEngineeringStudioPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
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
          <Breadcrumbs
            items={[{ label: "Best AI Engineering Studio", to: "/best-ai-engineering-studio" }]}
          />
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
                <Sparkles size={13} /> #1 AI Engineering Studio · MSME Registered
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
                Best <span className="text-gradient">AI Engineering Studio</span> for Production
                SaaS.
              </h1>
              <p className="mt-5 text-muted-foreground text-lg max-w-xl">
                Stop prototyping. Start shipping. Signhify is the best AI engineering studio for
                founders who need production SaaS — built with a 6-agent swarm, secured with BYOK
                encryption, and delivered in 2-week sprints. Code on your GitHub. Zero lock-in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
                >
                  Start your project <ArrowRight size={16} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold hover:border-primary/60 transition"
                >
                  View pricing
                </Link>
              </div>
            </div>

            {/* Hero stat card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                Why Signhify is #1
              </div>
              <div className="mt-2 space-y-4">
                {WHY_TOP.slice(0, 3).map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm">{item.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={14} className="text-primary" />
                <span>MSME Registered · UDYAM-UP-30-0081308</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why We're #1 */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            Why Signhify
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center max-w-3xl mx-auto">
            What makes Signhify the{" "}
            <span className="text-gradient">best AI engineering studio</span> in 2026
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_TOP.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card/60 p-6 hover:border-primary/30 transition-colors"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4">
                  <item.icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            Engineering Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center max-w-3xl mx-auto">
            Everything you need from a{" "}
            <span className="text-gradient">world-class AI engineering studio</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card/60 p-6 hover:border-primary/30 transition-colors"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary mb-3">
                  <feat.icon size={16} />
                </div>
                <h3 className="font-display font-semibold text-base">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            How we deliver
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            From idea to deployed AI SaaS in <span className="text-gradient">2 weeks</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card/60 p-6 relative"
              >
                <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 mt-1">
                  <step.icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-base">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center mb-8">
            Trusted by founders shipping AI products
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-border bg-card/60 p-6 text-center"
              >
                <s.icon size={22} className="text-primary mx-auto" />
                <div className="mt-3 font-display text-3xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 font-semibold text-sm">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Questions about the <span className="text-gradient">best AI engineering studio</span>
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
                      <ChevronDown size={18} className="text-muted-foreground shrink-0" />
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
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Ready to work with the <span className="text-gradient">best AI engineering studio</span>
            ?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start with a Sprint. No contracts. No lock-in. Your code, your infra, your success.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
            >
              Start your project <ArrowRight size={16} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-6 py-3 text-sm font-semibold hover:border-primary/60 transition"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
