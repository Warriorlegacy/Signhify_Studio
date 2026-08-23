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
  links?: {
    label: string;
    url: string;
    icon?: "github" | "telegram" | "external";
  }[];
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
    slug: "nexusvip-sports-exchange",
    name: "NexusVIP — Sports Betting Exchange",
    category: "Fintech",
    url: "https://nexusvipexch.vercel.app",
    blurb:
      "Enterprise peer-to-peer sports betting exchange with sub-millisecond in-memory order matching, dynamic worst-case liability calculation, 5-tier agent downlines, and 1-tap Telegram Bot OTP verification — 36/36 invariant tests passing.",
    tags: [
      "React 18",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "WebSockets",
      "Telegram Bot API",
      "Jest",
      "High Concurrency",
      "RBAC",
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Supabase",
      "WebSockets",
      "Tailwind CSS",
      "Telegram Bot API",
      "Jest",
      "Vercel",
    ],
    metric: "36/36 Tests Passed · Sub-ms Order Matching · 5-Tier RBAC",
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/nexusvip-sports-exchange.png",
    story: [
      "Traditional sportsbooks impose high margins and put the house against the player. Building a real P2P exchange is a different problem entirely.",
      "It requires sub-millisecond order book crossing, multi-runner liability risk management, and hierarchical agent credit accounting — all without double-spending vulnerabilities.",
      "I designed an in-memory FIFO matching engine that pairs Back and Lay positions at exact market odds and auto-settles with 2% net commission deduction.",
      "The worst-case liability engine calculates exposure across every runner in a fixture simultaneously — locking only the net required credit, not the gross sum of all stakes.",
      "A 5-tier RBAC hierarchy (Global Admin → Super Master → Master → Agent → Player) enforces complete subtree data isolation so every agent sees only their branch.",
      "On top of that, I engineered a 1-tap Telegram Bot (@nexusvip_verify_bot) verification system that delivers OTPs through deep-linked /start commands — zero SMS cost, instant delivery.",
      "36 Jest test suites. 36 passing. 100% coverage on every financial invariant.",
    ].join("\n\n"),
    links: [
      { label: "Agent Backoffice", url: "https://nexusvipagent.vercel.app", icon: "external" },
      { label: "View Source", url: "https://github.com/Warriorlegacy/Sports_Betting_Specifications", icon: "github" },
      { label: "Telegram Bot", url: "https://t.me/nexusvip_verify_bot", icon: "telegram" },
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
    url: "https://tuitiontrack-app.vercel.app",
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
    url: "https://signhify.dpdns.org/projects/nebulapay",
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
    url: "https://signhify.dpdns.org/projects/aurora-analytics",
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
    url: "https://signhify.dpdns.org/projects/skillforge",
    blurb:
      "Adaptive AI tutor that turns a curriculum into a per-learner journey — adjusts pace, depth and tone in real time.",
    tags: ["AI Tutor", "Adaptive", "EdTech"],
    stack: ["Next.js", "Supabase", "Claude"],
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/skillforge-ai.png",
  },
  {
    slug: "signhify-ai",
    name: "Signhify AI",
    category: "Developer Tools",
    url: "https://signhify-ai.vercel.app",
    blurb:
      "Signhify's own AI studio — a full-stack coding and product intelligence platform built to accelerate how we ship for clients.",
    tags: ["AI Studio", "Coding", "Platform"],
    stack: ["TanStack Start", "Supabase", "Claude", "OpenAI"],
    metric: "Powers every Signhify build",
    size: "lg",
    featured: true,
    year: 2026,
    image: "/images/projects/signhify-ai.png",
  },
  {
    slug: "adshield-india",
    name: "AdShield India",
    category: "AI Automation",
    url: "https://adshield-india.vercel.app",
    blurb:
      "AI-powered ad fraud detection and protection layer for Indian performance marketers — blocks invalid traffic in real time.",
    tags: ["Ad Fraud", "Protection", "Real-time"],
    stack: ["Next.js", "Python", "ML", "Supabase"],
    metric: "Shipped Jun 2026",
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/adshield-india.png",
  },
  {
    slug: "autotube",
    name: "AutoTube",
    category: "AI Automation",
    url: "https://autotube-signhify.vercel.app",
    blurb:
      "YouTube channel automation — AI scripts, auto-publish, thumbnail generation and SEO metadata pipeline end-to-end.",
    tags: ["YouTube", "AI Pipeline", "Content"],
    stack: ["Next.js", "OpenAI", "YouTube API", "n8n"],
    metric: "Shipped Jun 2026",
    size: "md",
    year: 2026,
    image: "/images/projects/autotube.png",
  },
  {
    slug: "cricket-king-rahul",
    name: "Cricket King",
    category: "Performance Marketing",
    url: "https://cricket-king-rahul.vercel.app",
    blurb:
      "High-conversion Telegram funnel for a cricket picks channel — social proof, scarcity mechanics and deep CRO architecture.",
    tags: ["CRO", "Funnels", "Sports"],
    stack: ["Astro", "Tailwind"],
    metric: "Built for paid acquisition",
    size: "sm",
    year: 2026,
    image: "/images/projects/cricket-king-rahul.png",
  },
  {
    slug: "hari-cricket",
    name: "Hari Cricket",
    category: "Performance Marketing",
    url: "https://hari-cricket.vercel.app",
    blurb:
      "Conversion-first landing page for a cricket Telegram community — engineered around trust signals and frictionless join flow.",
    tags: ["CRO", "Funnels", "Landing"],
    stack: ["React", "Tailwind"],
    metric: "Built for paid acquisition",
    size: "sm",
    year: 2026,
    image: "/images/projects/hari-cricket.png",
  },
  {
    slug: "tennis-king-jackpot",
    name: "Tennis King Jackpot",
    category: "Performance Marketing",
    url: "https://tennis-king-jackpot.vercel.app",
    blurb:
      "Sports picks landing page with urgency mechanics, animated win-rate counter, and Telegram CTA optimised for paid traffic.",
    tags: ["CRO", "Funnels", "Sports"],
    stack: ["Astro", "Tailwind"],
    metric: "Built for paid acquisition",
    size: "sm",
    year: 2026,
    image: "/images/projects/tennis-king-jackpot.png",
  },
  {
    slug: "examastra",
    name: "ExamAstra",
    category: "AI Education",
    url: "https://examastra.vercel.app",
    blurb:
      "AI-driven exam prep for UPSC, SSC & State PSC — personalised study paths, adaptive question banks and real-time timeline analytics.",
    tags: ["AI Tutor", "Adaptive", "Government Exams"],
    stack: ["Next.js", "Supabase", "OpenAI", "Tailwind"],
    metric: "10K+ aspirants · UPSC · SSC · State PSC",
    size: "md",
    featured: true,
    year: 2026,
    image: "/images/projects/examastra.png",
  },
];
