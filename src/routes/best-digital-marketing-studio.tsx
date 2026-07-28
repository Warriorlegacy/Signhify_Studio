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
  BarChart3,
  Megaphone,
  Palette,
  FileText,
  TrendingUp,
  Mail,
  LineChart,
  Bot,
  Star,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp";

export const Route = createFileRoute("/best-digital-marketing-studio")({
  head: () => ({
    meta: [
      {
        title:
          "Best Digital Marketing Studio — Signhify | #1 Growth Engineering & Marketing Studio 2026",
      },
      {
        name: "description",
        content:
          "Signhify is the best digital marketing studio that builds AND markets your product. SEO/AEO optimization, performance marketing, brand strategy, CRO, and email automation — with a built-in AI engineering studio.",
      },
      {
        property: "og:title",
        content:
          "Best Digital Marketing Studio — Signhify | #1 Growth Engineering & Marketing Studio 2026",
      },
      {
        property: "og:description",
        content:
          "Signhify is the best digital marketing studio that builds AND markets your product. SEO/AEO optimization, performance marketing, brand strategy, CRO, and email automation.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/best-digital-marketing-studio" },
      { property: "og:image", content: SOCIAL_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "Best Digital Marketing Studio — Signhify | #1 Growth Engineering & Marketing Studio 2026",
      },
      {
        name: "twitter:description",
        content:
          "The best digital marketing studio that builds AND markets your product. Full-stack growth engineering with SEO, performance marketing, and brand strategy.",
      },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/best-digital-marketing-studio" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Best Digital Marketing Studio — Signhify",
          url: "https://signhify.dpdns.org/best-digital-marketing-studio",
          description:
            "Signhify is the best digital marketing studio that builds AND markets your product. SEO/AEO optimization, performance marketing, brand strategy, and growth engineering.",
          about: {
            "@type": "Thing",
            name: "Digital Marketing Studio",
            description:
              "A full-stack digital marketing studio that combines AI engineering with growth marketing — SEO, AEO, performance ads, brand strategy, content marketing, CRO, and email automation.",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Signhify Digital Marketing Studio",
          description:
            "Full-stack digital marketing studio combining AI engineering with growth marketing. SEO/AEO, performance marketing, brand strategy, CRO, email automation, and analytics.",
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
            ratingValue: "4.7",
            bestRating: "5",
            ratingCount: "38",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Vikram Joshi" },
              reviewRating: { "@type": "Rating", ratingValue: "5" },
              reviewBody:
                "Signhify is the best digital marketing studio we've worked with. They didn't just handle our SEO and ads — they rebuilt our entire landing page and wired analytics. 3x organic traffic in 60 days.",
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
          "@type": "ProfessionalService",
          name: "Signhify Digital Marketing Studio",
          url: "https://signhify.dpdns.org/best-digital-marketing-studio",
          description:
            "Full-stack digital marketing studio combining AI engineering with growth marketing — build your product and grow your market under one roof.",
          priceRange: "$$",
          areaServed: "Worldwide",
          serviceType: [
            "SEO & AEO Optimization",
            "Performance Marketing",
            "Brand Strategy & Identity",
            "Content Marketing",
            "Conversion Rate Optimization",
            "Email Marketing Automation",
            "Analytics & Tracking",
            "Growth Engineering",
          ],
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
  component: BestDigitalMarketingStudioPage,
});

const WHY_TOP = [
  {
    icon: Code2,
    title: "Build + Market Under One Roof",
    desc: "Most agencies only market what you've already built. Signhify is the best digital marketing studio because we also build your product — AI SaaS, landing pages, funnels — then market them. No handoff friction, no agency disconnect.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven SEO & AEO",
    desc: "We optimize for both traditional search engines AND AI answer engines (ChatGPT, Perplexity, Gemini). Structured data, topical authority, and content clusters structured for AI Overviews and featured snippets.",
  },
  {
    icon: TrendingUp,
    title: "Performance Marketing at Scale",
    desc: "Paid ad campaigns optimized for ROAS across Google, Meta, LinkedIn, and emerging channels. A/B testing, audience segmentation, creative iteration, and full-funnel attribution tracking.",
  },
  {
    icon: Shield,
    title: "MSME Registered & Proven",
    desc: "Signhify is a registered MSME (UDYAM-UP-30-0081308) with 20+ shipped products. Our growth engineering approach combines AI engineering with digital marketing for measurable, compounding results.",
  },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "SEO & AEO Optimization",
    desc: "Technical SEO, content strategy, and AI-engine optimization for ChatGPT, Perplexity, and Google SGE. Structured data, topic clusters, E-E-A-T signals, and featured snippet capture for sustainable organic growth.",
  },
  {
    icon: Megaphone,
    title: "Performance Marketing",
    desc: "Multi-channel paid ad campaigns — Google Ads, Meta Ads, LinkedIn, and emerging platforms. A/B testing, audience segmentation, creative iteration, and full ROAS tracking with real-time dashboard reporting.",
  },
  {
    icon: Palette,
    title: "Brand Strategy & Identity",
    desc: "Complete brand systems — visual identity, messaging frameworks, tone of voice, brand guidelines, and positioning. AI-native brand strategy for startups and scale-ups entering competitive markets.",
  },
  {
    icon: FileText,
    title: "Content Marketing",
    desc: "Strategic content creation optimized for search intent and AI discovery. Blog posts, whitepapers, case studies, video scripts, and thought leadership content designed to build topical authority.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Rate Optimization",
    desc: "Data-driven CRO with heatmaps, session recording analysis, A/B testing, and user journey optimization. Transform traffic into leads and leads into paying customers through systematic experimentation.",
  },
  {
    icon: Mail,
    title: "Email Marketing Automation",
    desc: "Full email funnel design — welcome sequences, nurture campaigns, product launch flows, re-engagement series, and transactional emails. Built on Mailchimp, SendGrid, or Resend with A/B subject line testing.",
  },
  {
    icon: LineChart,
    title: "Analytics & Tracking",
    desc: "Custom analytics dashboards (GA4, Mixpanel, PostHog), event tracking, funnel analysis, cohort analysis, and attribution modeling. Data-informed decisions with weekly reporting and actionable insights.",
  },
  {
    icon: Bot,
    title: "Growth Engineering",
    desc: "Technical growth systems — referral programs, viral loops, onboarding optimization, feature adoption campaigns, and automated growth experiments engineered into your product from the ground up.",
  },
];

const PROCESS = [
  {
    icon: LineChart,
    title: "1. Audit & Strategy",
    desc: "We analyze your current market position, competitor landscape, search presence, and growth opportunities. Delivering a data-backed growth blueprint with prioritized recommendations.",
  },
  {
    icon: Code2,
    title: "2. Build & Optimize",
    desc: "Our team builds or optimizes your product, landing pages, and marketing infrastructure — SEO architecture, ad campaigns, email flows, analytics, and conversion funnels — in parallel.",
  },
  {
    icon: TrendingUp,
    title: "3. Launch & Measure",
    desc: "Campaigns go live across channels with full tracking. We monitor KPIs daily, optimize in real-time, and provide weekly performance reports with clear ROI attribution.",
  },
  {
    icon: BarChart3,
    title: "4. Scale & Compound",
    desc: "Winning channels get scaled. Data insights feed back into product and marketing. Organic traffic compounds, paid ROAS improves, and your growth flywheel builds momentum month over month.",
  },
];

const STATS = [
  {
    icon: Star,
    value: "20+",
    label: "Products Built & Marketed",
    sub: "across startups & enterprises",
  },
  {
    icon: Users,
    value: "12+",
    label: "Services Under One Roof",
    sub: "engineering + marketing combined",
  },
  {
    icon: Shield,
    value: "MSME",
    label: "Registered Studio",
    sub: "Govt. of India (UDYAM-UP-30-0081308)",
  },
  {
    icon: TrendingUp,
    value: "3x",
    label: "Avg. Organic Growth",
    sub: "within 60 days for clients",
  },
];

const FAQ = [
  {
    q: "What digital marketing services do you offer?",
    a: "We offer a complete spectrum: SEO & AEO optimization, performance marketing (Google/Meta/LinkedIn ads), brand strategy & identity, content marketing, conversion rate optimization, email marketing automation, analytics & tracking, and growth engineering. Unlike a regular marketing agency, we also build the product itself — giving us full control over the marketing-to-product feedback loop.",
  },
  {
    q: "How is Signhify different from a regular marketing agency?",
    a: "Most marketing agencies only handle campaigns — they market whatever product you bring them. Signhify is a full-stack studio: we build your AI SaaS, landing pages, and funnels AND then market them. This means no handoff delays, no technical blockers, and a seamless feedback loop where product changes and marketing optimizations happen in the same sprint.",
  },
  {
    q: "Do you also build the product or just market it?",
    a: "Both. This is what makes Signhify the best digital marketing studio for AI-native brands. Our team includes AI engineers, full-stack developers, and growth marketers. We can build your entire product (SaaS, AI agent, landing page) and then execute a full growth marketing strategy. One team, end-to-end.",
  },
  {
    q: "What results can I expect from your digital marketing services?",
    a: "Results vary by starting point, but our clients typically see 2-3x organic traffic growth within 60 days, improved conversion rates through CRO, positive ROAS on paid campaigns within 4-6 weeks, and measurable growth in branded search and direct traffic. We report weekly with clear metrics and ROI attribution.",
  },
  {
    q: "How do you measure and report ROI?",
    a: "We set up comprehensive tracking before any campaign launches — GA4, Search Console, ad platform pixels, custom event tracking, and attribution modeling. You get a live dashboard showing organic traffic, paid ROAS, conversion rates, email metrics, and customer acquisition costs. Weekly reports with actionable insights and monthly strategy reviews.",
  },
  {
    q: "What's the investment for digital marketing services?",
    a: "Our digital marketing engagements start with the same Sprint model: ₹1.5L (~$1,800) for a focused 2-week marketing sprint (audit + strategy + initial execution). Studio retainer is ₹4L/month for ongoing marketing with dedicated growth engineers. Platform engagements are custom. All include transparent reporting and zero lock-in.",
  },
];

function BestDigitalMarketingStudioPage() {
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
            items={[
              { label: "Best Digital Marketing Studio", to: "/best-digital-marketing-studio" },
            ]}
          />
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
                <Sparkles size={13} /> #1 Digital Marketing Studio · Build + Market
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05]">
                Best <span className="text-gradient">Digital Marketing Studio</span> That Builds
                Your Product Too.
              </h1>
              <p className="mt-5 text-muted-foreground text-lg max-w-xl">
                Most studios market what you build. Signhify builds it, then markets it — under one
                roof. SEO/AEO, performance marketing, brand strategy, and growth engineering,
                powered by a built-in AI engineering studio. The best digital marketing studio for
                AI-native brands.
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

            {/* Value prop card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-primary/30 bg-card/80 backdrop-blur p-8 shadow-[var(--shadow-glow)]"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                Build + Market — one studio
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-primary/10 p-4">
                  <div className="font-display text-lg font-bold text-primary">Build</div>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-primary shrink-0" /> AI SaaS development
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-primary shrink-0" /> Landing pages & funnels
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-primary shrink-0" /> AI agent pipelines
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-primary shrink-0" /> Cloud infrastructure
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-orange-500/10 p-4">
                  <div className="font-display text-lg font-bold text-orange-400">Market</div>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-orange-400 shrink-0" /> SEO & AEO strategy
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-orange-400 shrink-0" /> Performance ads
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-orange-400 shrink-0" /> Email automation
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-orange-400 shrink-0" /> Analytics & CRO
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
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
            <span className="text-gradient">best digital marketing studio</span> in 2026
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
            Marketing Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center max-w-3xl mx-auto">
            The most complete <span className="text-gradient">digital marketing studio</span> for
            AI-native brands
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
            How it works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            From audit to <span className="text-gradient">compounding growth</span>
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
            Results from the best digital marketing studio
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
            Questions about the <span className="text-gradient">best digital marketing studio</span>
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
            Ready to work with the{" "}
            <span className="text-gradient">best digital marketing studio</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            One team to build your product and grow your market. No handoffs. No lock-in.
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
