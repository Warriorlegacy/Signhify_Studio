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
  Star,
  Sparkles,
  Rocket,
  Building2,
  Lock,
  Clock,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp";

export const Route = createFileRoute("/us-ai-engineering-studio")({
  head: () => ({
    meta: [
      {
        title: "Best AI Engineering Studio for US Startups — Signhify",
      },
      {
        name: "description",
        content:
          "Signhify is the top AI engineering studio for US startups. 6-agent swarm, 100% US timezone overlap, 2-week MVP sprints & full GitHub code ownership.",
      },
      {
        property: "og:title",
        content: "Best AI Engineering Studio for US Startups — Signhify",
      },
      {
        property: "og:description",
        content:
          "Signhify is the top AI engineering studio for US startups. 6-agent swarm, 100% US timezone overlap, 2-week MVP sprints & full GitHub code ownership.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/us-ai-engineering-studio" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Best AI Engineering Studio for US Startups — Signhify",
      },
      {
        name: "twitter:description",
        content:
          "Scale your US startup with Signhify AI Studio. 2-week guaranteed sprints, full GitHub code transfer, 100% US EST/PST coverage.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://signhify.dpdns.org/us-ai-engineering-studio" },
      {
        rel: "alternate",
        hrefLang: "en-US",
        href: "https://signhify.dpdns.org/us-ai-engineering-studio",
      },
      {
        rel: "alternate",
        hrefLang: "x-default",
        href: "https://signhify.dpdns.org/us-ai-engineering-studio",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Best AI Engineering Studio for US Startups & Enterprise Teams",
          url: "https://signhify.dpdns.org/us-ai-engineering-studio",
          description:
            "Signhify delivers elite AI product engineering, multi-agent SaaS architecture, and growth engines for United States startups and technology leaders.",
          areaServed: {
            "@type": "Country",
            name: "United States",
            alternateName: "US",
          },
          publisher: {
            "@type": "Organization",
            name: "Signhify AI Studio",
            url: "https://signhify.dpdns.org",
            logo: "https://signhify.dpdns.org/favicon.ico",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Signhify AI Engineering Studio (US Edition)",
          image:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
          description:
            "Full-stack AI SaaS development studio with 6-agent swarm, 2-week delivery sprint, BYOK security vault, and 100% US timezone coverage.",
          brand: { "@type": "Brand", name: "Signhify" },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "299",
            highPrice: "799",
            priceCurrency: "USD",
            offerCount: 2,
            availability: "https://schema.org/OnlineOnly",
            url: "https://signhify.dpdns.org/pricing",
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
              name: "Why do US startups choose Signhify over local US agencies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Signhify delivers Silicon Valley-grade AI architecture at 1/5th the cost of US agencies ($299 Sprint vs $50k+ traditional agencies), with 100% US EST/PST timezone overlap, 2-week delivery guarantees, and 100% code ownership.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: USAiEngineeringStudioPage,
});

const US_BENEFITS = [
  {
    icon: Clock,
    title: "100% US Timezone Overlap",
    desc: "Our engineering operations run synchronously during standard US business hours (9:00 AM EST to 6:00 PM PST). Instant Slack updates, daily standups, zero lag.",
  },
  {
    icon: Lock,
    title: "SOC2 & HIPAA Enterprise Security",
    desc: "Client-side BYOK AES-256 key encryption vault. We never store your LLM API keys. Built with zero-trust architecture ready for US SOC2 & HIPAA audits.",
  },
  {
    icon: DollarSign,
    title: "Transparent USD Pricing",
    desc: "Fixed-scope $299 Sprints & $799 Full Studio packages with zero hourly surprises. Full GitHub repository transfer with 100% IP ownership.",
  },
  {
    icon: Rocket,
    title: "2-Week Sprint Guarantee",
    desc: "From initial spec prompt to live production deployment in 14 days or less. Complete with auth, database, Stripe billing, and AI micro-services.",
  },
];

const COMPARISON = [
  {
    feature: "Average Cost for MVP",
    signhify: "$299 – $799 flat",
    usAgencies: "$30,000 – $75,000+",
    devShops: "$15,000 – $40,000",
  },
  {
    feature: "Delivery Time",
    signhify: "5 – 14 Days Guaranteed",
    usAgencies: "3 – 6 Months",
    devShops: "2 – 4 Months",
  },
  {
    feature: "AI Stack & Multi-Agent Swarm",
    signhify: "6-Agent Autonomous Engine",
    usAgencies: "Manual Dev / Junior Engineers",
    devShops: "Basic API Wrappers",
  },
  {
    feature: "Code Ownership & IP Transfer",
    signhify: "100% Full GitHub Transfer",
    usAgencies: "Retainer Lock-in / Vendor Lock",
    devShops: "Proprietary Framework Lock",
  },
  {
    feature: "US Timezone Support",
    signhify: "9:00 AM EST – 6:00 PM PST",
    usAgencies: "9:00 AM – 5:00 PM Local",
    devShops: "Offshore Delay (12h gap)",
  },
];

const FAQS = [
  {
    q: "How does Signhify provide 100% US timezone coverage?",
    a: "Our lead engineering leads and client success managers operate directly on US Eastern (EST) and Pacific (PST) business hours, conducting live video reviews, Slack communications, and deployment checks in real time.",
  },
  {
    q: "How is IP and code ownership handled for US companies?",
    a: "Upon sprint completion, 100% of the GitHub repository, database schemas, deployment pipelines, and design assets are transferred directly to your organization. You hold complete legal copyright and IP ownership under US law.",
  },
  {
    q: "What security compliance frameworks does Signhify support?",
    a: "We implement client-side BYOK (Bring Your Own Key) AES-256 GCM encryption, ensuring your proprietary LLM keys never touch our servers. Our database and API architectures adhere strictly to US SOC2 Type II and HIPAA security guidelines.",
  },
  {
    q: "What is included in the $299 Sprint vs $799 Studio package?",
    a: "The $299 Sprint delivers a complete, production-ready AI SaaS MVP in 5–7 days with auth, database, Stripe integration, and core AI workflows. The $799 Studio package adds advanced multi-agent pipelines, custom design-system, and 30 days of post-launch scaling engineering.",
  },
];

function USAiEngineeringStudioPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "US AI Engineering Studio" }]} />

          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary sm:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Dedicated AI Engineering Studio for US Market Founders</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Build & Launch Your US Startup with{" "}
              <span className="text-gradient">Silicon Valley-Grade AI Engineering</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground sm:text-xl"
            >
              The premier AI development engine for US founders and enterprise teams. 6-agent
              autonomous swarm, 100% US EST/PST coverage, BYOK AES-256 security, 2-week guaranteed
              sprints, and 100% GitHub code transfer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/free-consultation"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25 sm:w-auto"
              >
                <span>Book US Founder Consult</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-8 font-semibold text-foreground transition-all hover:bg-surface/80 sm:w-auto"
              >
                <span>Explore $299 Sprint</span>
              </Link>
            </motion.div>

            {/* US Proof Banner */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border/40 pt-8 text-xs font-medium text-muted-foreground sm:text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>100% US EST / PST Timezone Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>BYOK SOC2/HIPAA Security Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>100% Code & IP Rights Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core US Benefits */}
      <section className="border-t border-border/40 bg-surface/30 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Why US Tech Founders Partner with Signhify
            </h2>
            <p className="mt-4 text-muted-foreground">
              Engineered specifically to solve the high cost, slow timelines, and vendor lock-in of
              traditional US software agencies.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {US_BENEFITS.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agency Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Signhify vs. US Software Agencies
            </h2>
            <p className="mt-4 text-muted-foreground">
              Compare our 6-agent autonomous engineering studio against legacy agencies and
              traditional dev shops.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="p-4 text-sm font-semibold text-muted-foreground">
                    Feature / Metric
                  </th>
                  <th className="p-4 text-sm font-bold text-primary">Signhify Studio</th>
                  <th className="p-4 text-sm font-semibold text-muted-foreground">
                    Traditional US Agencies
                  </th>
                  <th className="p-4 text-sm font-semibold text-muted-foreground">
                    Offshore Dev Shops
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface/30">
                    <td className="p-4 font-medium text-foreground">{row.feature}</td>
                    <td className="p-4 font-bold text-primary">{row.signhify}</td>
                    <td className="p-4 text-muted-foreground">{row.usAgencies}</td>
                    <td className="p-4 text-muted-foreground">{row.devShops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border/40 bg-surface/20 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions (US Market)
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-sm text-muted-foreground"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Launch Your US AI SaaS in 14 Days?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Schedule a 1-on-1 consultation with our founder & AI lead architect.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/free-consultation"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
