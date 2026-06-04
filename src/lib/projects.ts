export type Project = {
  slug: string;
  name: string;
  category: string;
  url: string;
  blurb: string;
  tags: string[];
  metric?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "gymflow-saas",
    name: "GymFlow SaaS",
    category: "SaaS Product",
    url: "https://gymflow-saas.vercel.app",
    blurb:
      "Modern gym management platform — memberships, attendance, billing and operations in one dashboard.",
    tags: ["Next.js", "SaaS", "Auth", "Dashboards"],
    metric: "Multi-tenant ready",
    featured: true,
  },
  {
    slug: "autoreels-ai",
    name: "AutoReels AI",
    category: "AI Automation",
    url: "https://autoreels-ai.vercel.app",
    blurb:
      "AI pipeline that turns long-form content into short-form social reels — fully automated end-to-end.",
    tags: ["Generative AI", "Automation", "Content"],
    metric: "Reels at scale",
    featured: true,
  },
  {
    slug: "gigmind",
    name: "GigMind",
    category: "AI Marketplace",
    url: "https://gigmind-gamma.vercel.app",
    blurb:
      "AI-powered gig economy platform helping freelancers find, manage and deliver opportunities.",
    tags: ["AI", "Marketplace", "Platform"],
    featured: true,
  },
  {
    slug: "tuitiontrack",
    name: "TuitionTrack",
    category: "EdTech",
    url: "https://tuitiontrack.vercel.app",
    blurb:
      "Student and coaching management — records, attendance, fees and parent reporting.",
    tags: ["EdTech", "CRM", "Reporting"],
  },
  {
    slug: "signhify-crm",
    name: "Signhify CRM",
    category: "Internal Tool",
    url: "https://signhify-crm.vercel.app",
    blurb:
      "Custom CRM powering Signhify's own pipeline — leads, deals, automations and client workflows.",
    tags: ["CRM", "Automation", "Workflows"],
  },
  {
    slug: "vibe-coding",
    name: "Vibe Coding Platform",
    category: "Developer Tools",
    url: "https://vibe-coding-platform-neon-kappa.vercel.app",
    blurb:
      "Prototype of an AI-assisted coding environment — the first step toward Signhify AI.",
    tags: ["AI", "Dev Tools", "Editor"],
  },
  {
    slug: "sewarth-path",
    name: "Sewarth Path Sansthanam",
    category: "Non-Profit",
    url: "https://sewarthpathsansthanam.vercel.app",
    blurb:
      "NGO website with brand system, campaigns and community engagement.",
    tags: ["Web", "Branding", "Campaigns"],
  },
  {
    slug: "jmd-online-book",
    name: "JMD Online Book",
    category: "Bookings",
    url: "https://jmd-online-book.vercel.app",
    blurb: "Online booking and appointment management platform.",
    tags: ["Booking", "Scheduling"],
  },
  {
    slug: "gple-sports",
    name: "GPLE Sports",
    category: "Brand Platform",
    url: "https://gplesports.vercel.app",
    blurb: "Sports brand platform with presentation and fan engagement surfaces.",
    tags: ["Brand", "Web"],
  },
  {
    slug: "rahul-silk",
    name: "Rahul Silk",
    category: "Business Web",
    url: "https://rahul-silk.vercel.app",
    blurb: "Storefront-style business website for a textile brand.",
    tags: ["Web", "Brand"],
  },
  {
    slug: "vip-tennis",
    name: "VIP Telegram Landing",
    category: "Performance Marketing",
    url: "https://vip-free-tennis-page.vercel.app",
    blurb: "High-conversion landing page engineered for paid acquisition.",
    tags: ["CRO", "Landing", "Funnels"],
  },
];
