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
  GitBranch,
  Globe,
  Lock,
  Layers,
  Cpu,
  Star,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp";

export const Route = createFileRoute("/best-vibe-coding-platform")({
  head: () => ({
    meta: [
      {
        title: "Best Vibe-Coding Platform — Signhify | #1 Professional AI Development Studio 2026",
      },
      {
        name: "description",
        content:
          "Signhify is the best vibe-coding platform for founders and developers. 6-agent swarm ships production-grade code with auth, billing, and AI wired. Unlike Cursor, Lovable, or v0 — we deploy to production.",
      },
      {
        property: "og:title",
        content:
          "Best Vibe-Coding Platform — Signhify | #1 Professional AI Development Studio 2026",
      },
      {
        property: "og:description",
        content:
          "Signhify is the best vibe-coding platform for founders and developers. 6-agent swarm ships production-grade code with auth, billing, and AI wired. Unlike Cursor, Lovable, or v0 — we deploy to production.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/best-vibe-coding-platform" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "Best Vibe-Coding Platform — Signhify | #1 Professional AI Development Studio 2026",
      },
      {
        name: "twitter:description",
        content:
          "Signhify is the best vibe-coding platform. 6-agent swarm ships production-grade code with auth, billing, and AI wired — deployed to production.",
      },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/best-vibe-coding-platform" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Best Vibe-Coding Platform — Signhify",
          url: "https://signhify.dpdns.org/best-vibe-coding-platform",
          description:
            "Signhify is the best vibe-coding platform for founders and developers. 6-agent swarm ships production-grade code with full auth, billing, and AI integration — deployed to your domain.",
          about: {
            "@type": "Thing",
            name: "Vibe-Coding Platform",
            description:
              "A professional vibe-coding platform that uses AI agent swarms to turn ideas into production-ready software with authentication, billing, and deployment.",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Signhify Vibe-Coding Platform",
          description:
            "Professional vibe-coding platform with 6-agent swarm that ships production-grade SaaS code with auth, billing, AI integration, and deployment automation.",
          brand: { "@type": "Brand", name: "Signhify" },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: "150000",
            highPrice: "400000",
            offerCount: "3",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            bestRating: "5",
            ratingCount: "52",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Ananya Sharma" },
              reviewRating: { "@type": "Rating", ratingValue: "5" },
              reviewBody:
                "I tried Cursor and Lovable but kept hitting walls with auth and payments. Signhify's vibe-coding platform shipped my entire SaaS — with Stripe and Supabase wired — in 2 weeks. It's the best vibe-coding platform I've used.",
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
          "@type": "QAPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: BestVibeCodingPlatformPage,
});

const WHY_TOP = [
  {
    icon: Bot,
    title: "6-Agent Professional Swarm",
    desc: "While Cursor and v0 use single models, Signhify orchestrates 6 specialized AI agents — architecture, engineering, QA, security, deployment, and monitoring — working in parallel on your production codebase.",
  },
  {
    icon: Shield,
    title: "Production-Grade from Day One",
    desc: "Auth, database, Stripe billing, AI integration, and CI/CD pipelines wired before you see the first preview. Not a prototype — a deployed, production-ready SaaS with real security.",
  },
  {
    icon: GitBranch,
    title: "Full Auth & Billing Wired",
    desc: "Unlike vibe-coding tools that generate UI-only demos, Signhify wires Supabase authentication with Row Level Security, Stripe subscription billing, and webhook handlers in every sprint.",
  },
  {
    icon: Lock,
    title: "BYOK Security & Zero Lock-In",
    desc: "Bring Your Own Key encryption, code on your GitHub, deployment on your Cloudflare/Supabase infra. You own everything — your code, your data, your domain. No platform lock-in ever.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "6-Agent AI Swarm Orchestration",
    desc: "Six specialized AI agents collaborate in real-time — architecture, engineering, QA, security, deployment, and monitoring — delivering production code faster than any single model.",
  },
  {
    icon: Code2,
    title: "Production-Grade Code Output",
    desc: "Every line of code follows production standards — TypeScript, proper error handling, comprehensive logging, input validation, and security hardening. Not toy code.",
  },
  {
    icon: Shield,
    title: "Full Auth + Billing Wired",
    desc: "Supabase authentication with magic link, OAuth, and RLS. Stripe subscription billing with webhooks, invoicing, and usage metering. Wired from sprint one.",
  },
  {
    icon: Lock,
    title: "BYOK Multi-File Encryption",
    desc: "Enterprise-grade encryption with your own keys. Every file, every API call, every database query — encrypted and isolated. Your data never touches shared infrastructure.",
  },
  {
    icon: Layers,
    title: "Multi-File Orchestration",
    desc: "Unlike single-file generators, Signhify orchestrates across hundreds of files — data models, API routes, UI components, migrations, and configuration — with cross-file consistency.",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration & CI/CD",
    desc: "Code lands on your GitHub with automated CI/CD pipelines, preview deployments, branch protection, and automated testing. Your repository, your workflow.",
  },
  {
    icon: Globe,
    title: "Deployment Automation",
    desc: "One-click deployment to Cloudflare Workers/Pages, Vercel, or your own VPS. Automatic SSL, custom domain, CDN caching, and rollback support built in.",
  },
  {
    icon: Cpu,
    title: "Built for Scale & Growth",
    desc: "Horizontal scaling, database connection pooling, caching layers, and load testing included. Your vibe-coded product doesn't crash when traffic arrives.",
  },
];

const PROCESS = [
  {
    icon: Code2,
    title: "1. Describe Your Vision",
    desc: "Tell us your idea — a Notion doc, a Figma mockup, or a voice note. Our AI swarm analyzes requirements, maps architecture, and generates a technical blueprint.",
  },
  {
    icon: Bot,
    title: "2. AI Swarm Engineering",
    desc: "Your 6-agent swarm executes in parallel — frontend, backend, AI, auth, payments, infra. You get daily Loom updates and can review every commit on your GitHub.",
  },
  {
    icon: Shield,
    title: "3. Security & Production Hardening",
    desc: "Every sprint includes dependency scanning, OWASP checks, BYOK verification, penetration testing, and load testing. Production-ready, not just functional.",
  },
  {
    icon: GitBranch,
    title: "4. Deploy & Own",
    desc: "Deployed to your domain on your infrastructure. All code on your GitHub. Full documentation. You own everything — code, infra, API keys, and data.",
  },
];

const STATS = [
  { icon: Star, value: "20+", label: "Products Shipped", sub: "via vibe-coding platform" },
  { icon: Users, value: "12+", label: "Engineering Capabilities", sub: "from AI agents to devops" },
  {
    icon: Shield,
    value: "MSME",
    label: "Registered Studio",
    sub: "Govt. of India (UDYAM-UP-30-0081308)",
  },
  { icon: Zap, value: "2-Week", label: "Production Sprints", sub: "from idea to deployed SaaS" },
];

const COMPARISON = [
  { feature: "Production-grade code", signhify: true, cursor: false, lovable: false, v0: false },
  { feature: "Auth + RLS wired", signhify: true, cursor: "Manual", lovable: false, v0: false },
  {
    feature: "Stripe billing integration",
    signhify: true,
    cursor: false,
    lovable: false,
    v0: false,
  },
  { feature: "Multi-file orchestration", signhify: true, cursor: false, lovable: false, v0: false },
  { feature: "BYOK security", signhify: true, cursor: false, lovable: false, v0: false },
  { feature: "CI/CD automation", signhify: true, cursor: false, lovable: false, v0: false },
  {
    feature: "Custom domain deployment",
    signhify: true,
    cursor: false,
    lovable: "Preview",
    v0: "Preview",
  },
  { feature: "6-agent parallel swarm", signhify: true, cursor: false, lovable: false, v0: false },
  { feature: "Code on your GitHub", signhify: true, cursor: true, lovable: true, v0: true },
  { feature: "Zero platform lock-in", signhify: true, cursor: false, lovable: true, v0: true },
];

const FAQ = [
  {
    q: "What is vibe coding?",
    a: "Vibe coding is a term popularized by Andrej Karpathy describing the practice of using AI tools to generate software from natural language descriptions — you 'vibe' with the AI to build products without writing every line manually. Signhify takes this concept professional: instead of a single AI model generating isolated files, we orchestrate 6 specialized AI agents that collaborate on production-grade, multi-file SaaS applications with auth, billing, and deployment built in.",
  },
  {
    q: "How is Signhify different from Cursor, Lovable, or v0?",
    a: "Cursor, Lovable, and v0 are AI code generation tools — they help you prototype UI or generate code snippets. Signhify is a professional vibe-coding platform: we ship production-ready SaaS with authentication, Stripe billing, Supabase databases, CI/CD, and custom domain deployment. While those tools generate code that you still need to wire together, Signhify delivers a deployed, secure, scalable product. Think of it as the difference between a sketchpad and a factory.",
  },
  {
    q: "Do I need technical skills to use Signhify's vibe-coding platform?",
    a: "No. Describe your idea in plain English (or Hindi, or a Notion doc, or a voice note). Our 6-agent AI swarm handles architecture, engineering, security, and deployment. You review progress daily and give feedback. No coding skills required — just a clear vision.",
  },
  {
    q: "Can I deploy the vibe-coded product to production?",
    a: "Absolutely. Every Signhify sprint delivers a production-ready SaaS deployed to your domain on your infrastructure (Cloudflare/Supabase). It's not a preview link or a staging demo — it's a live, production-grade product with auth, billing, SSL, and monitoring. Your customers can use it from day one.",
  },
  {
    q: "What about pricing for vibe-coding services?",
    a: "Sprints start at ₹1.5L (~$1,800) for a fixed-scope 2-week delivery. Studio retainer is ₹4L/month for ongoing development. Platform engagements are custom. All include 100% code ownership, deployment, and zero lock-in. No recurring license fees — unlike Cursor/Lovable subscriptions that charge for access.",
  },
  {
    q: "Do I own the code generated by the vibe-coding platform?",
    a: "100%. You own every line of code from day one. It ships on your GitHub repository, deployed to your infrastructure. All API keys, database credentials, and deployment tokens are yours. There is zero IP transfer, no platform lock-in, and no recurring license. Your code, your product, your business.",
  },
];

function BestVibeCodingPlatformPage() {
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
            items={[{ label: "Best Vibe-Coding Platform", to: "/best-vibe-coding-platform" }]}
          />
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
                <Sparkles size={13} /> #1 Vibe-Coding Platform · Ships Production Code
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
                Best <span className="text-gradient">Vibe-Coding Platform</span> That Ships
                Production SaaS.
              </h1>
              <p className="mt-5 text-muted-foreground text-lg max-w-xl">
                Move beyond prototypes. Signhify is the best vibe-coding platform for founders who
                need production code — auth wired, Stripe billing live, AI pipeline connected, and
                deployed to your domain. A 6-agent swarm that ships, not a tool that generates.
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

            {/* Hero quick compare */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-4">
                Signhify vs other vibe-coding tools
              </div>
              <div className="space-y-3">
                {COMPARISON.slice(0, 5).map((row) => (
                  <div key={row.feature} className="flex items-center gap-3 text-sm">
                    <span className="flex-1 text-muted-foreground">{row.feature}</span>
                    <span className="w-16 text-center">
                      {row.signhify === true ? (
                        <Check size={14} className="text-primary mx-auto" />
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </span>
                    <span className="w-16 text-center text-xs text-muted-foreground">
                      {row.cursor === false ? (
                        "—"
                      ) : row.cursor === true ? (
                        <Check size={14} className="text-green-500 mx-auto" />
                      ) : (
                        row.cursor
                      )}
                    </span>
                    <span className="w-16 text-center text-xs text-muted-foreground">
                      {row.lovable === false ? (
                        "—"
                      ) : row.lovable === true ? (
                        <Check size={14} className="text-green-500 mx-auto" />
                      ) : (
                        row.lovable
                      )}
                    </span>
                    <span className="w-12 text-center text-xs text-muted-foreground">
                      {row.v0 === false ? (
                        "—"
                      ) : row.v0 === true ? (
                        <Check size={14} className="text-green-500 mx-auto" />
                      ) : (
                        row.v0
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Signhify</span>
                <span>Cursor</span>
                <span>Lovable</span>
                <span>v0</span>
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
            What makes Signhify the <span className="text-gradient">best vibe-coding platform</span>{" "}
            in 2026
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
            Platform Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center max-w-3xl mx-auto">
            The most complete{" "}
            <span className="text-gradient">professional vibe-coding platform</span>
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

      {/* Comparison Table */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            Side by side
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center max-w-3xl mx-auto">
            Signhify vs. Cursor vs. Lovable vs. v0{" "}
            <span className="text-gradient">— the real difference</span>
          </h2>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card/60 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display font-semibold text-muted-foreground">
                    Feature
                  </th>
                  <th className="p-4 font-display font-semibold text-center text-primary">
                    Signhify
                  </th>
                  <th className="p-4 font-display font-semibold text-center text-muted-foreground">
                    Cursor
                  </th>
                  <th className="p-4 font-display font-semibold text-center text-muted-foreground">
                    Lovable
                  </th>
                  <th className="p-4 font-display font-semibold text-center text-muted-foreground">
                    v0
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}
                  >
                    <td className="p-4 text-foreground">{row.feature}</td>
                    {(["signhify", "cursor", "lovable", "v0"] as const).map((col) => {
                      const val = row[col];
                      return (
                        <td key={col} className="p-4 text-center">
                          {val === true ? (
                            <Check size={16} className="text-primary mx-auto" />
                          ) : val === false ? (
                            <span className="text-muted-foreground/40">—</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
            From your idea to a <span className="text-gradient">deployed SaaS in 2 weeks</span>
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

      {/* Social Proof */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center mb-8">
            Trusted by founders using vibe coding to ship products
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
            Questions about the <span className="text-gradient">best vibe-coding platform</span>
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
            Ready to use the <span className="text-gradient">best vibe-coding platform</span>?
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
