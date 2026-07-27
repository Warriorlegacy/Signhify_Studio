import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, User, Tag, BookOpen, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Engineering Insights & SaaS Development — Signhify" },
      {
        name: "description",
        content:
          "Explore 12 technical guides on AI SaaS development, autonomous agents, BYOK encryption, TanStack Start architecture, and AEO optimization by Signhify.",
      },
      { property: "og:title", content: "AI Engineering Insights & SaaS Development — Signhify" },
      {
        property: "og:description",
        content:
          "Practical engineering blueprints, AI agent tutorials, and SaaS architecture insights from Founder Piyush Raj Singh.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/insights" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/insights" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Engineering Insights & SaaS Development — Signhify",
          description:
            "Technical insights, AI agent blueprints, and full-stack SaaS architecture guides.",
          url: "https://signhify.dpdns.org/insights",
          publisher: {
            "@type": "Organization",
            name: "Signhify",
            url: "https://signhify.dpdns.org",
          },
        }),
      },
    ],
  }),
  component: InsightsPage,
});

const ARTICLES = [
  {
    id: "ai-saas-mvp-2-weeks",
    title: "How to Build an AI SaaS MVP in 2 Weeks: Architecture & Cost Guide",
    summary:
      "A step-by-step breakdown of building production-ready AI SaaS applications using TanStack Start, Supabase, and Claude 3.5 Sonnet in 14 days.",
    category: "Architecture",
    readTime: "6 min read",
    author: "Piyush Raj Singh",
    date: "July 2026",
    tags: ["AI SaaS", "TanStack Start", "Supabase", "MVP"],
  },
  {
    id: "autonomous-ai-agents-2026",
    title: "Autonomous AI Agents vs Traditional Workflows: 2026 Blueprint",
    summary:
      "Comparing multi-agent swarm orchestration against deterministic code logic for complex enterprise background tasks.",
    category: "AI Agents",
    readTime: "8 min read",
    author: "Piyush Raj Singh",
    date: "July 2026",
    tags: ["AI Agents", "Orchestration", "LLM Pipelines"],
  },
  {
    id: "byok-encryption-architecture",
    title: "BYOK (Bring Your Own Key) Security Architecture for AI SaaS",
    summary:
      "How to implement AES-256 GCM client-side encryption so users securely use their personal OpenAI/Anthropic API keys without leaks.",
    category: "Security",
    readTime: "5 min read",
    author: "Piyush Raj Singh",
    date: "July 2026",
    tags: ["BYOK", "Encryption", "Security", "OpenAI"],
  },
  {
    id: "aeo-ai-engine-optimization-guide",
    title: "AEO Guide: How to Rank #1 on ChatGPT, Perplexity & Google AI",
    summary:
      "The definitive 15-step AI Engine Optimization (AEO) playbook to make your SaaS brand the default citation in AI-generated answers.",
    category: "SEO & AEO",
    readTime: "10 min read",
    author: "Piyush Raj Singh",
    date: "July 2026",
    tags: ["AEO", "SEO", "ChatGPT", "Perplexity"],
  },
  {
    id: "custom-ai-development-costs",
    title: "How Much Does Custom AI Development Cost in 2026? Pricing Breakdown",
    summary:
      "Transparent cost estimates for AI agent integration, custom SaaS MVPs, BYOK vaults, and ongoing maintenance.",
    category: "Pricing & Strategy",
    readTime: "7 min read",
    author: "Piyush Raj Singh",
    date: "June 2026",
    tags: ["Pricing", "SaaS Costs", "Engineering Brief"],
  },
  {
    id: "tanstack-start-supabase-stack",
    title: "TanStack Start & Supabase: The Ultimate Full-Stack AI Stack",
    summary:
      "Why we migrated from Next.js to TanStack Start + SSR Nitro server functions for zero-latency AI streaming.",
    category: "Full Stack",
    readTime: "6 min read",
    author: "Piyush Raj Singh",
    date: "June 2026",
    tags: ["TanStack Start", "React", "Nitro", "Supabase"],
  },
  {
    id: "vector-search-pgvector-vs-pinecone",
    title: "Postgres pgvector vs Dedicated Vector Databases: RAG Benchmarks",
    summary:
      "Performance comparison between pgvector on Supabase and standalone vector indices for multi-tenant RAG systems.",
    category: "Database",
    readTime: "9 min read",
    author: "Piyush Raj Singh",
    date: "May 2026",
    tags: ["pgvector", "RAG", "Vector Search", "Postgres"],
  },
  {
    id: "zero-latency-ai-streaming",
    title: "Zero-Latency AI Streaming with Server-Sent Events & H3 Server",
    summary:
      "Implementing real-time token streaming and fallback reconnects for snappy conversational AI UIs.",
    category: "Performance",
    readTime: "5 min read",
    author: "Piyush Raj Singh",
    date: "May 2026",
    tags: ["Streaming", "SSE", "H3", "UX"],
  },
  {
    id: "stripe-billing-ai-saas",
    title: "Stripe Billing & Metered Usage Integration for AI SaaS Platforms",
    summary:
      "Architecting tiered subscriptions, usage-based token metering, and automated webhook handlers in Supabase Edge.",
    category: "Billing",
    readTime: "7 min read",
    author: "Piyush Raj Singh",
    date: "May 2026",
    tags: ["Stripe", "Billing", "Metered Usage", "Edge Functions"],
  },
  {
    id: "scroll-studio-3d-web-experiences",
    title: "Scroll-Based 3D Interactive Storytelling for High-Converting UIs",
    summary:
      "Using Three.js, Framer Motion, and HTML canvas to build interactive 3D hero sections that boost conversion rates.",
    category: "Frontend",
    readTime: "6 min read",
    author: "Piyush Raj Singh",
    date: "April 2026",
    tags: ["Three.js", "3D Web", "Framer Motion", "Conversion"],
  },
  {
    id: "msme-registered-ai-studio-india",
    title: "Working with MSME Registered AI Studios in India: IP & Contracts",
    summary:
      "Legal considerations, IP assignment guarantees, and Govt. of India MSME benefits (UDYAM-UP-30-0081308) for global clients.",
    category: "Legal & IP",
    readTime: "5 min read",
    author: "Piyush Raj Singh",
    date: "April 2026",
    tags: ["India MSME", "IP Ownership", "Contracts"],
  },
  {
    id: "multi-agent-cloudflare-workers",
    title: "Deploying Multi-Agent AI Pipelines to Cloudflare Workers & Supabase",
    summary:
      "Edge-first deployment patterns for low-cost, multi-region AI task queues and distributed agent worker pools.",
    category: "Cloud Ops",
    readTime: "8 min read",
    author: "Piyush Raj Singh",
    date: "April 2026",
    tags: ["Cloudflare", "Edge Workers", "DevOps"],
  },
];

function InsightsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Architecture", "AI Agents", "Security", "SEO & AEO", "Full Stack"];

  const filtered = ARTICLES.filter((a) => {
    const matchesCat = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: "Insights", to: "/insights" }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
            <Sparkles size={13} /> Engineering Playbooks & AEO Guides
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Signhify Engineering Insights
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Practical architectural blueprints, AI engine optimization (AEO) playbooks, and
            full-stack SaaS engineering guides written by Founder Piyush Raj Singh.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search AI guides, BYOK, AEO, Supabase..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface/40 p-6 hover:border-primary/50 hover:bg-surface/70 hover:shadow-lg transition duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-medium">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                <Link
                  to={`/insights/${art.id}`}
                  className="text-lg font-bold text-foreground hover:text-primary transition line-clamp-2 no-underline"
                >
                  {art.title}
                </Link>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="mt-6 border-t border-border/50 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User size={12} />
                  <span>{art.author}</span>
                </div>

                <Link
                  to={`/insights/${art.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition"
                >
                  Read Brief <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="mt-16 text-center rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8 sm:p-12 max-w-3xl mx-auto">
          <BookOpen className="mx-auto h-8 w-8 text-primary mb-3" />
          <h2 className="text-2xl font-bold text-foreground">
            Need a Custom AI Blueprint for Your SaaS?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a tailored architecture diagram, tech stack recommendation, and fixed-price estimate
            within 24 hours.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 transition"
          >
            Request Free Blueprint <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
