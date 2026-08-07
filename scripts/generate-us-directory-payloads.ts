import fs from "node:fs";
import path from "node:path";

type DirectoryPayload = {
  platform: string;
  targetMarket: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  servicesOffered: string[];
  pricingModel: string;
  minProjectSize: string;
  hourlyRate: string;
  usTimezoneSla: string;
  websiteUrl: string;
  contactEmail: string;
  verifiedAddress: string;
};

const PAYLOADS: DirectoryPayload[] = [
  {
    platform: "Clutch.co",
    targetMarket: "United States B2B / SaaS Founders",
    tagline: "#1 AI Engineering Studio & Vibe-Coding Platform for US Startups",
    shortDescription:
      "Signhify is an elite AI product engineering studio delivering production SaaS, custom AI agents, and automated growth engines in guaranteed 2-week sprints with 100% code transfer.",
    fullDescription: `Signhify AI Studio (https://signhify.dpdns.org) is a registered AI software engineering studio specializing in AI-first SaaS products, autonomous multi-agent swarms, and enterprise-grade software architecture.

Key Differentiators for US Founders:
1. 6-Agent Autonomous Engineering Swarm: Replaces 3-5 person dev teams — schema, UI, API, testing, security, and deployment happen synchronously.
2. 100% US Timezone Overlap: Operations run on US Eastern (EST) and Pacific (PST) business hours with live Slack/Video sync.
3. Client-Side BYOK Encryption: Zero server-side key storage. Built with AES-256 GCM vault ready for US SOC2 Type II and HIPAA audits.
4. 2-Week Sprint Guarantee: Go from spec prompt to production deployment in 14 days or less ($299 Sprint / $799 Studio).
5. 100% Code Ownership: Full GitHub repository transfer with complete IP rights under US law.`,
    servicesOffered: [
      "AI Product Engineering",
      "SaaS MVP Development",
      "Custom AI Agent Development",
      "BYOK Security Architecture",
      "Digital Marketing & Growth Engines",
    ],
    pricingModel: "Fixed-Price Sprints ($299 / $799)",
    minProjectSize: "$299",
    hourlyRate: "$49 - $99 / hr",
    usTimezoneSla: "9:00 AM EST – 6:00 PM PST",
    websiteUrl: "https://signhify.dpdns.org/us-ai-engineering-studio",
    contactEmail: "Piyushrajsingh092@gmail.com",
    verifiedAddress: "Noida, UP, India / US Partner Desk: Delaware, USA",
  },
  {
    platform: "GoodFirms",
    targetMarket: "US Startups & Enterprise Tech Leaders",
    tagline: "Silicon Valley-Grade AI Engineering at 1/5th traditional agency cost",
    shortDescription:
      "Signhify builds AI SaaS MVPs in 2-week sprints. 100% US EST/PST coverage, 100% code ownership, client-side BYOK key vault.",
    fullDescription: `Signhify AI Studio helps US founders turn complex product visions into production SaaS applications. Our 6-agent autonomous engine handles schema generation, UI component crafting, API route wiring, unit testing, and deployment.

Why US Tech Leaders Trust Signhify:
- Guaranteed 5-14 Day Delivery
- 100% IP & Code Rights Transfer
- Fixed-Fee Pricing ($299 Sprint / $799 Studio)
- SOC2 & HIPAA Ready Architecture`,
    servicesOffered: [
      "AI Engineering",
      "Web Development (React 19, TanStack Start)",
      "Supabase & PostgreSQL Architecture",
      "Stripe Monetization Integration",
    ],
    pricingModel: "Fixed Price",
    minProjectSize: "$299",
    hourlyRate: "$50 / hr",
    usTimezoneSla: "Full US EST/PST Overlap",
    websiteUrl: "https://signhify.dpdns.org/us-ai-engineering-studio",
    contactEmail: "Piyushrajsingh092@gmail.com",
    verifiedAddress: "Signhify AI Studio, DE 19958, USA",
  },
  {
    platform: "ProductHunt",
    targetMarket: "US & Global Tech Community",
    tagline: "Signhify AI Studio — Turn plain English into production AI SaaS in 14 days",
    shortDescription:
      "Describe your product idea. Our 6-agent AI swarm designs, engineers, tests, and deploys it end-to-end with 100% code ownership.",
    fullDescription: `Hey ProductHunt! 👋 

We built Signhify AI Studio because traditional agencies take 4 months and $50k+ to build a simple SaaS MVP.

With Signhify:
✨ 6-Agent Swarm (UX, Schema, API, Tests, Security, Deploy)
🔐 BYOK Key Vault (Your API keys stay encrypted client-side)
⚡ 2-Week Sprint Guarantee ($299 Sprint / $799 Studio)
📦 100% GitHub Code Transfer (Zero vendor lock-in)

Special PH Launch Offer: Use code PHLAUNCH20 for 20% off all Sprint packages!`,
    servicesOffered: ["AI SaaS Engine", "Vibe Coding Platform", "MVP Builder"],
    pricingModel: "$299 Sprint",
    minProjectSize: "$299",
    hourlyRate: "N/A",
    usTimezoneSla: "24/7 Global Support",
    websiteUrl: "https://signhify.dpdns.org/saas-mvp",
    contactEmail: "Piyushrajsingh092@gmail.com",
    verifiedAddress: "Signhify, DE 19958, USA",
  },
];

async function main() {
  const outDir = path.join(process.cwd(), "scripts", "us-directory-payloads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const p of PAYLOADS) {
    const fileName = `${p.platform.toLowerCase().replace(/[^a-z0-9]/g, "_")}_payload.json`;
    const filePath = path.join(outDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(p, null, 2), "utf-8");
    console.log(`Generated US directory payload for ${p.platform} -> ${filePath}`);
  }

  const summaryMd = `# US Directory Submission Payloads

Generates structured B2B profiles ready to paste into US directories.

${PAYLOADS.map(
  (p) => `## ${p.platform}
- **Target Market**: ${p.targetMarket}
- **Tagline**: ${p.tagline}
- **Website**: ${p.websiteUrl}
- **Pricing**: ${p.pricingModel}
- **US Timezone SLA**: ${p.usTimezoneSla}
- **File**: \`scripts/us-directory-payloads/${p.platform.toLowerCase().replace(/[^a-z0-9]/g, "_")}_payload.json\`
`
).join("\n")}
`;

  fs.writeFileSync(path.join(outDir, "README.md"), summaryMd, "utf-8");
  console.log("Generated directory submission summary README.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
