import { initSchema } from "../src/lib/schema";
import { db, now } from "../src/lib/db.server";

initSchema();

const US_CAMPAIGNS = [
  {
    name: "US SaaS Founders MVP Campaign",
    status: "draft",
    subject_template: "Building {{lead.orgName}}'s AI MVP in 2 weeks?",
    body_template: `Hi {{lead.contactName}},

Noticed {{lead.orgName}}'s work in {{lead.industry}}.

We're Signhify AI Studio — an AI-first product engineering studio that builds production SaaS MVPs in guaranteed 2-week sprints.

What sets us apart for US founders:
• 100% US EST/PST timezone overlap
• 100% full GitHub repository code transfer (zero vendor lock-in)
• Client-side BYOK key encryption vault (SOC2 & HIPAA ready)
• Fixed-fee $299 Sprint / $799 Full Studio pricing

Would you be open to a 15-min chat this week?

Best regards,
Piyush Raj Singh
Founder & Lead AI Engineer | Signhify AI Studio
https://signhify.dpdns.org/us-ai-engineering-studio`,
  },
  {
    name: "US YC / Techstars Fast-Track Engineering",
    status: "draft",
    subject_template: "Scale {{lead.orgName}}'s dev velocity with 6-agent swarm",
    body_template: `Hey {{lead.contactName}},

Congrats on the momentum at {{lead.orgName}}!

If you're looking to launch new features or build a standalone AI micro-service without hiring a $200k/yr US engineer, our 6-agent autonomous engineering swarm delivers Silicon Valley-grade code in days.

Key highlights:
- 14-day production guarantee ($299 Sprint)
- Full IP & GitHub repository transfer
- SOC2 & HIPAA ready BYOK key security

Check out our US founder cases: https://signhify.dpdns.org/us-ai-engineering-studio

Worth a quick 10-min intro?

Piyush Raj Singh
Signhify AI Studio`,
  },
  {
    name: "US Enterprise AI & BYOK Security Architecture",
    status: "draft",
    subject_template: "Client-side BYOK AI key vault for {{lead.orgName}}",
    body_template: `Hi {{lead.contactName}},

Enterprise AI security is a major blocker for US companies shipping LLM features.

At Signhify AI Studio, we built a zero-trust BYOK (Bring Your Own Key) AES-256 GCM encryption vault so your LLM keys never touch server logs or third-party storage.

We help US enterprise teams architect, engineer, and audit production AI agents with 100% US timezone overlap.

Would love to share our security architecture whitepaper: https://signhify.dpdns.org/llms.txt

Best,
Piyush Raj Singh
Founder, Signhify AI Studio`,
  },
];

function seed() {
  console.log("Seeding US campaigns into ClientHunter database...");
  for (const c of US_CAMPAIGNS) {
    const existing = db.prepare("SELECT id FROM campaigns WHERE name = ?").get(c.name) as { id: number } | undefined;
    if (existing) {
      console.log(`Campaign "${c.name}" already exists (id: ${existing.id}) — skipping.`);
      continue;
    }
    const res = db.prepare(
      "INSERT INTO campaigns (name, status, audience, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).run(c.name, c.status, JSON.stringify({ targetRegion: "US" }), now(), now());
    const campaignId = Number(res.lastInsertRowid);

    db.prepare(
      "INSERT INTO campaign_steps (campaign_id, step_order, channel, delay_days, subject_template, body_template) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(campaignId, 0, "email", 0, c.subject_template, c.body_template);

    console.log(`Seeded US Campaign ID ${campaignId}: "${c.name}"`);
  }
  console.log("US Campaigns seeding completed successfully.");
}

seed();
