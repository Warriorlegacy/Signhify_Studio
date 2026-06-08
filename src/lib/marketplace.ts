export type MarketItem = {
  id?: string;
  slug: string;
  name: string;
  blurb: string;
  category: "Template" | "Agent" | "Component" | "Workflow";
  price: number; // 0 = free
  price_cents?: number;
  asset_path?: string | null;
  preview_url?: string | null;
  tags: string[];
  accent: string; // gradient
  badge?: string;
};

export const MARKET: MarketItem[] = [
  {
    slug: "saas-launch-kit",
    name: "SaaS Launch Kit",
    blurb: "Auth, billing, dashboards, marketing site and waitlist — wired and ready to ship.",
    category: "Template",
    price: 0,
    tags: ["TanStack", "Supabase", "Stripe"],
    accent: "linear-gradient(135deg, oklch(0.72 0.21 45), oklch(0.22 0.06 260))",
    badge: "Free this week",
  },
  {
    slug: "studio-portfolio",
    name: "Studio Portfolio",
    blurb: "Cinematic 3D portfolio with bento gallery, lead wizard and Calendly embed.",
    category: "Template",
    price: 49,
    tags: ["Three.js", "Framer Motion"],
    accent: "linear-gradient(135deg, oklch(0.7 0.18 25), oklch(0.18 0.04 280))",
  },
  {
    slug: "support-agent",
    name: "Support Triage Agent",
    blurb: "Drop-in AI agent that classifies tickets, drafts replies and escalates blockers.",
    category: "Agent",
    price: 29,
    tags: ["Claude", "Tool-use", "RAG"],
    accent: "linear-gradient(135deg, oklch(0.7 0.22 320), oklch(0.2 0.04 290))",
  },
  {
    slug: "growth-agent",
    name: "Growth SEO Agent",
    blurb: "Generates SEO briefs, on-page meta and JSON-LD from a sitemap — weekly.",
    category: "Agent",
    price: 39,
    tags: ["SEO", "Schema.org"],
    accent: "linear-gradient(135deg, oklch(0.78 0.18 145), oklch(0.18 0.05 200))",
  },
  {
    slug: "ember-ui",
    name: "Ember UI Kit",
    blurb: "60+ shadcn-compatible primitives themed with the Signhify ember palette.",
    category: "Component",
    price: 19,
    tags: ["shadcn", "Tailwind v4"],
    accent: "linear-gradient(135deg, oklch(0.74 0.2 60), oklch(0.16 0.04 30))",
  },
  {
    slug: "lead-funnel",
    name: "Lead Funnel Workflow",
    blurb: "Wizard → Supabase → Resend → Slack. A whole top-of-funnel in 4 minutes.",
    category: "Workflow",
    price: 0,
    tags: ["Supabase", "Resend"],
    accent: "linear-gradient(135deg, oklch(0.72 0.18 220), oklch(0.18 0.05 260))",
    badge: "Free",
  },
];

export const MARKET_CATEGORIES = ["All", "Template", "Agent", "Component", "Workflow"] as const;
