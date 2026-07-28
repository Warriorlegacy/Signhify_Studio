import fs from "node:fs";
import path from "node:path";

const PROSPECTS_FILE = path.resolve("scripts/outreach-prospects.json");
const TEMPLATE_FILE = path.resolve("scripts/outreach-email-templates.md");
const OUTPUT_DIR = path.resolve("scripts/generated-outreach");

const PROSPECTS = [
  { name: "Alex", company: "TechStart", platform: "IndieHackers", email: "founder@techstart.com", pain: "building an AI-powered CRM" },
  { name: "Sarah", company: "NextGen SaaS", platform: "LinkedIn", email: "sarah@nextgensaas.com", pain: "MVP for their SaaS idea" },
  { name: "Mike", company: "DataFlow", platform: "Twitter/X", email: "mike@dataflow.io", pain: "AI agent automation workflow" },
  { name: "Priya", company: "CloudKit", platform: "IndieHackers", email: "priya@cloudkit.dev", pain: "full-stack app with auth and billing" },
  { name: "James", company: "ScaleUp", platform: "LinkedIn", email: "james@scaleup.co", pain: "BYOK encryption for enterprise clients" },
  { name: "Emma", company: "LaunchPad", platform: "ProductHunt", email: "emma@launchpad.ai", pain: "SaaS MVP in 2 weeks" },
  { name: "Raj", company: "CodeBase", platform: "Twitter/X", email: "raj@codebase.dev", pain: "AI pipeline integration" },
  { name: "Lisa", company: "GrowthHub", platform: "LinkedIn", email: "lisa@growthhub.io", pain: "marketing automation tool" },
];

function generateEmail(prospect, templateType) {
  const firstName = prospect.name.split(" ")[0];
  const company = prospect.company;

  if (templateType === "cold") {
    return {
      to: prospect.email,
      subject: `${company} — 2-week AI SaaS build slot just opened`,
      body: `Hi ${firstName},

Saw ${company}'s recent work on ${prospect.platform}. Looks like you're shipping fast.

Quick question — are you actively exploring AI features or a product build right now?

Most founders burn 3-6 months and $15k+ piecing together dev agencies. Not great.

At Signhify, we ship production-ready AI SaaS apps in 2-week fixed sprints. Full source code to your GitHub, BYOK encryption, Stripe billing, Supabase backend — the whole stack.

→ Sprint ($299): MVP in 5-7 days
→ Studio ($799+): Full platform in 14 days

Live demo & portfolio: https://signhify.dpdns.org

Open to a 10-min blueprint call this week? I can show you the exact stack for ${prospect.pain}.

Best,
Piyush Raj Singh
Founder & Lead AI Engineer, Signhify AI Studio
Govt. MSME: UDYAM-UP-30-0081308
WhatsApp: +91-6202442690`,
    };
  }

  if (templateType === "followup") {
    return {
      to: prospect.email,
      subject: `Re: ${company} — 2-week AI SaaS build slot`,
      body: `Hi ${firstName},

Following up — I put together a recommended architecture for ${company}'s space:

→ Frontend: TanStack Start + React 19 (zero-latency SSR)
→ AI Layer: Claude 3.5 Sonnet / GPT-4o with auto-fallback + BYOK key vault
→ Backend: Supabase PostgreSQL + Edge Functions + Row-Level Security
→ Deployment: Cloudflare Workers (edge, multi-region)
→ Billing: Stripe Checkout + webhook-driven metering

Here's our free AI Blueprint Generator — describe your product in one sentence and it outputs the full plan: https://signhify.dpdns.org/ai

Want me to run a custom blueprint for ${company}'s exact idea? Takes 5 minutes.

Best,
Piyush`,
    };
  }

  return {
    to: prospect.email,
    subject: `White-label dev partner for ${company}`,
    body: `Hi ${firstName},

I've been following ${company}'s work — great portfolio.

Quick idea: we can be your development backend.

You sell the engagement to your client at $2-5k. We build the full AI SaaS in 14 days, white-labeled under your brand. Your client never sees us.

Your margin: $1k-$4k per deal. No hiring, no managing developers, no delivery risk.

Full code transfer to your client's GitHub on day 1. You look like the hero.

Worth a 10-minute call to structure this?

Best,
Piyush Raj Singh
Founder, Signhify AI Studio
https://signhify.dpdns.org`,
  };
}

function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  for (const prospect of PROSPECTS) {
    for (const type of ["cold", "followup", "partnership"]) {
      const email = generateEmail(prospect, type);
      const filename = `${prospect.company.toLowerCase().replace(/\s+/g, "-")}-${type}.txt`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(
        filepath,
        `To: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`,
      );
      results.push({ prospect: prospect.name, company: prospect.company, type, filename });
    }
  }

  const summary = {
    generated: results.length,
    prospects: PROSPECTS.length,
    templates: 3,
    files: results,
    generated_at: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(`✅ Generated ${results.length} personalized outreach emails in ${OUTPUT_DIR}`);
  console.log(`📊 Summary: ${PROSPECTS.length} prospects × 3 templates = ${results.length} emails`);
}

generateAll();
