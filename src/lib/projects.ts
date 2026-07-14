import signhifyAi2 from "@/assets/signhify-ai-2.jpg.asset.json";
import signhifyAi3 from "@/assets/signhify-ai-3.jpg.asset.json";
import signhifyAi4 from "@/assets/signhify-ai-4.jpg.asset.json";
import signhifyAi5 from "@/assets/signhify-ai-5.jpg.asset.json";
import signhifyAi6 from "@/assets/signhify-ai-6.jpg.asset.json";
import signhifyAiUi1 from "@/assets/signhify-ai-ui-1.png.asset.json";
import signhifyAiUi2 from "@/assets/signhify-ai-ui-2.png.asset.json";
import signhifyAiUi5 from "@/assets/signhify-ai-ui-5.png.asset.json";
import signhifyAiUi3 from "@/assets/signhify-ai-ui-3.png.asset.json";
import signhifyAiUi4 from "@/assets/signhify-ai-ui-4.png.asset.json";

export type ProjectSize = "sm" | "md" | "lg";

export type Project = {
  slug: string;
  name: string;
  category: string;
  url: string;
  blurb: string;
  tags: string[];
  stack?: string[];
  metric?: string;
  size?: ProjectSize;
  featured?: boolean;
  year?: number;
  image?: string;
  story?: string;
  gallery?: string[];
};

/**
 * Signhify Studio — shipped product universe.
 * Seeded as structured content so the gallery, /projects route,
 * and a future Supabase-backed CMS read from one source of truth.
 */
export const projects: Project[] = [
  {
    slug: "signhify-ai",
    name: "Signhify AI",
    category: "AI Workspace",
    url: "https://signhify-ai-web.vercel.app/",
    blurb:
      "An AI workspace that learns how you work, remembers what matters, and improves with every interaction — 7 specialized agents, BYOK, open source.",
    tags: ["AI", "Workspace", "Memory", "Open Source", "BYOK"],
    stack: ["Next.js", "TanStack", "Supabase", "Multi-provider AI"],
    metric: "7 agents · 10+ AI providers · 100% your data",
    size: "lg",
    featured: true,
    year: 2026,
    image: signhifyAiUi1.url,
    story: [
      "I got tired of explaining myself to AI.",
      "Every new chat felt like meeting a stranger. The same goals. The same projects. The same context. The same explanations. Again. And again. And again.",
      "The problem wasn’t intelligence. The problem was memory.",
      "Because the most valuable thing about working together isn’t what you know. It’s what you remember.",
      "So I built Signhify AI — an AI workspace designed to learn how you work, remember what matters, and improve with every interaction.",
      "Not another chatbot. A workspace that grows with you.",
      "Because technology should adapt to humans. Not the other way around.",
    ].join("\n\n"),
    gallery: [
      signhifyAiUi1.url,
      signhifyAi5.url,
      signhifyAi6.url,
      signhifyAi4.url,
      signhifyAi3.url,
      signhifyAi2.url,
      signhifyAiUi2.url,
      signhifyAiUi5.url,
      signhifyAiUi3.url,
      signhifyAiUi4.url,
    ],
  },
  {
    slug: "veepee-engineers",
    name: "Veepee Engineers",
    category: "Engineering Brand",
    url: "https://veepee-engineers.lovable.app",
    blurb:
      "Cinematic brand site for an engineering firm — services, capabilities and case work presented as a confident industrial portfolio.",
    tags: ["Brand", "Industrial", "Portfolio"],
    stack: ["TanStack Start", "Tailwind", "Lovable"],
    metric: "Shipped 2026",
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/veepee-engineers.png",
  },
  {
    slug: "gymflow-saas",
    name: "GymFlow",
    category: "SaaS Product",
    url: "https://gymflow-saas.vercel.app",
    blurb:
      "Multi-tenant gym OS — memberships, attendance, billing and front-desk ops collapsed into one cinematic dashboard.",
    tags: ["SaaS", "Multi-tenant", "Dashboards"],
    stack: ["Next.js", "Supabase", "Stripe", "Tailwind"],
    metric: "5 gyms onboarded · 2 cities",
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/gymflow-saas.png",
  },
  {
    slug: "autoreels-ai",
    name: "AutoReels AI",
    category: "AI Automation",
    url: "https://autoreels-ai.vercel.app",
    blurb:
      "Long-form video → publish-ready short-form reels. An AI pipeline that runs end-to-end with zero human edit.",
    tags: ["Generative AI", "Pipelines", "Content"],
    stack: ["Python", "ffmpeg", "OpenAI", "Whisper"],
    metric: "Reels generated at scale",
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/autoreels-ai.png",
  },
  {
    slug: "gigmind",
    name: "GigMind",
    category: "AI Marketplace",
    url: "https://gigmind-gamma.vercel.app",
    blurb:
      "AI-matched gig marketplace where freelancers and clients discover, scope and ship work in days.",
    tags: ["Marketplace", "AI Matching", "Platform"],
    stack: ["Next.js", "Postgres", "Vercel AI SDK"],
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/gigmind.png",
  },
  {
    slug: "tuitiontrack",
    name: "TuitionTrack",
    category: "EdTech",
    url: "https://tuitiontrack.vercel.app",
    blurb:
      "All-in-one operations layer for coaching institutes — students, attendance, fees and parent reporting.",
    tags: ["EdTech", "CRM", "Reporting"],
    stack: ["React", "Supabase", "Resend"],
    size: "sm",
    year: 2025,
    image: "/images/projects/tuitiontrack.png",
  },
  {
    slug: "signhify-crm",
    name: "Signhify CRM",
    category: "Internal Tool",
    url: "https://signhify-crm.vercel.app",
    blurb:
      "Our own pipeline engine — leads, deals, automations and AI follow-ups, powering every Signhify project.",
    tags: ["CRM", "Automations", "Workflows"],
    stack: ["Next.js", "Supabase", "n8n"],
    size: "md",
    year: 2025,
    image: "/images/projects/signhify-crm.png",
  },
  {
    slug: "vibe-coding",
    name: "Vibe Coding",
    category: "Developer Tools",
    url: "https://vibe-coding-platform-neon-kappa.vercel.app",
    blurb: "Prototype of an AI-native coding environment — the seed that grew into Signhify AI.",
    tags: ["Dev Tools", "AI Pair", "Editor"],
    stack: ["React", "Monaco", "Claude"],
    size: "sm",
    year: 2025,
    image: "/images/projects/vibe-coding.png",
  },
  {
    slug: "sewarth-path",
    name: "Sewarth Path",
    category: "Non-Profit",
    url: "https://sewarthpathsansthanam.vercel.app",
    blurb:
      "Brand and digital home for an NGO running campaigns, donations and community programs across India.",
    tags: ["Brand", "Campaigns", "Donations"],
    stack: ["Next.js", "Razorpay"],
    size: "sm",
    year: 2025,
    image: "/images/projects/sewarth-path.png",
  },
  {
    slug: "jmd-online-book",
    name: "JMD Bookings",
    category: "Bookings",
    url: "https://jmd-online-book.vercel.app",
    blurb:
      "Friction-free appointment and slot booking with automated reminders and live availability.",
    tags: ["Booking", "Scheduling", "Notify"],
    stack: ["Next.js", "Supabase", "WhatsApp API"],
    size: "sm",
    year: 2025,
    image: "/images/projects/jmd-online-book.png",
  },
  {
    slug: "gple-sports",
    name: "GPLE Sports",
    category: "Brand Platform",
    url: "https://gplesports.vercel.app",
    blurb: "Sports brand presentation surface — fixtures, fan engagement, partner showcases.",
    tags: ["Brand", "Engagement", "Web"],
    stack: ["React", "Tailwind"],
    size: "sm",
    year: 2025,
    image: "/images/projects/gple-sports.png",
  },
  {
    slug: "rahul-silk",
    name: "Rahul Silk",
    category: "Business Web",
    url: "https://rahul-silk.vercel.app",
    blurb: "Storefront-led brand site for a heritage textile house — catalogue, story, enquiry.",
    tags: ["Brand", "Catalog"],
    stack: ["Next.js"],
    size: "sm",
    year: 2025,
    image: "/images/projects/rahul-silk.png",
  },
  {
    slug: "vip-tennis",
    name: "VIP Telegram Funnel",
    category: "Performance Marketing",
    url: "https://vip-free-tennis-page.vercel.app",
    blurb:
      "High-conversion landing engineered around paid-traffic mechanics — CRO, social proof, deep funnel.",
    tags: ["CRO", "Funnels", "Landing"],
    stack: ["Astro", "Tailwind"],
    metric: "Built for paid acquisition",
    size: "sm",
    year: 2025,
    image: "/images/projects/vip-tennis.png",
  },
  {
    slug: "nebulapay",
    name: "NebulaPay",
    category: "Fintech",
    url: "https://signhify.online/projects/nebulapay",
    blurb:
      "Cinematic fintech checkout layer — embeddable Pay-with-Nebula button, dark glass UI, sub-200ms perceived latency.",
    tags: ["Fintech", "Embeddable", "Checkout"],
    stack: ["Next.js", "Stripe", "Cloudflare Workers"],
    metric: "Concept · launching 2026",
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/nebulapay.png",
  },
  {
    slug: "aurora-analytics",
    name: "Aurora Analytics",
    category: "Analytics",
    url: "https://signhify.online/projects/aurora-analytics",
    blurb:
      "Real-time product analytics with AI-narrated dashboards — Aurora explains why your numbers moved overnight.",
    tags: ["Analytics", "AI Narration", "Real-time"],
    stack: ["TanStack Start", "ClickHouse", "OpenAI"],
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/aurora-analytics.png",
  },
  {
    slug: "skillforge-ai",
    name: "SkillForge AI",
    category: "AI Education",
    url: "https://signhify.online/projects/skillforge",
    blurb:
      "Adaptive AI tutor that turns a curriculum into a per-learner journey — adjusts pace, depth and tone in real time.",
    tags: ["AI Tutor", "Adaptive", "EdTech"],
    stack: ["Next.js", "Supabase", "Claude"],
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/skillforge-ai.png",
  },
];
