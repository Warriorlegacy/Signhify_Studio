# 🎯 ClientHunter — Complete Operator & User Guide

**ClientHunter** is your autonomous client acquisition engine. It scans public data feeds (Hacker News, Reddit, GitHub, ProductHunt) for founders and tech leaders asking for developers or AI engineering help, qualifies them with AI, and executes compliant, personalized cold email campaigns.

---

## ⚡ Quick Start (Running ClientHunter)

Open your terminal and run:

```bash
cd hunter
bun install
bun run dev
```

- **Dashboard UI**: Open [http://localhost:3001](http://localhost:3001) in your browser.
- **Standalone Queue Worker**: `bun run worker` (runs queue processing without the web server).
- **Pipeline Health Check**: `bun run smoke` (runs an end-to-end sandbox test).
- **Seed US Campaigns**: `bun scripts/seed-us-campaigns.ts` (seeds 3 pre-written US outreach campaigns).

---

## 🔄 The 6-Step Client Acquisition Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 1. SCOUT    │ ──> │ 2. VERIFY   │ ──> │ 3. QUALIFY  │
│ (HN/Reddit) │     │ (Email SMTP)│     │ (ICP Tier A)│
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
┌─────────────┐     ┌─────────────┐            ▼
│ 6. INBOX    │ <── │ 5. DELIVERY │ <── ┌─────────────┐
│ (HITL Reply)│     │ (CAN-SPAM)  │     │ 4. CAMPAIGN │
└─────────────┘     └─────────────┘     │ (AI Writer) │
                                        └─────────────┘
```

---

### Step 1: Lead Sourcing (Scout Agent)

1. Open **[http://localhost:3001/sources](http://localhost:3001/sources)** in your browser.
2. You will see 4 pre-configured data adapters:
   - **Hacker News Algolia**: Scans "Who is Hiring", "Show HN", and queries like `"need a developer"`, `"looking for an agency"`.
   - **Reddit**: Scans `r/forhire`, `r/SaaS`, `r/startups` for hiring posts.
   - **GitHub**: Scans recent repositories with hiring READMEs.
   - **ProductHunt**: Scans new launches with founder contact links.
3. Click **Run Now** next to any source.
4. Leads will be scraped and automatically deduplicated by domain (`org_domain`).

---

### Step 2: Verification & Enrichment (Verify Agent)

1. Navigate to **[http://localhost:3001/leads](http://localhost:3001/leads)**.
2. The Verify Agent automatically probes contact emails:
   - Syntax validation
   - MX domain records lookup
   - Disposable email filtering
   - Direct SMTP probing
3. Each lead receives an email verdict badge: `verified` (green), `risky` (yellow), or `unknown`.

---

### Step 3: ICP Qualification & US Market Prioritization (Qualify Agent)

1. The Qualify Agent scores leads based on your ICP rules in **[http://localhost:3001/settings](http://localhost:3001/settings)**.
2. **US Market Boost**: Any lead with US signals (`.com` domain, US country, SF/NYC/Austin location, US startup terms) automatically receives a **+10 point bonus**.
3. Tiers assigned automatically:
   - **Tier A (Hot - Score ≥ 35)**: Auto-queued for immediate campaign outreach.
   - **Tier B (Warm - Score 15–34)**: Nurture pool for follow-up runs.
   - **Tier C (Cold - Score < 15)**: Saved for retargeting.

---

### Step 4: Campaign Launch & AI Personalization (Writer Agent)

1. Navigate to **[http://localhost:3001/campaigns](http://localhost:3001/campaigns)**.
2. You will find 3 pre-loaded US campaigns:
   - **US SaaS Founders MVP Campaign**: Targets US founders needing a 2-week MVP ($299 Sprint).
   - **US YC / Techstars Fast-Track Engineering**: Targets high-velocity US startups.
   - **US Enterprise AI & BYOK Security Architecture**: Targets enterprise AI teams needing SOC2/HIPAA key security.
3. Click on a campaign to view the audience, preview AI-personalized email body samples (`{{lead.contactName}}`, `{{lead.orgName}}`), and click **Launch Campaign**.

---

### Step 5: Compliant Delivery (Send Agent)

1. Sends are governed by CAN-SPAM compliance rules:
   - **US Timezone Windows**: Scheduled between 9:00 AM EST and 4:00 PM PST.
   - **Physical Postal Address Footer**: Automatically embeds your Delaware US virtual business address.
   - **List-Unsubscribe Header**: Implements one-click unsubscribe links.
   - **Suppression Check**: Checked against the database before every single send.
2. **Sandbox vs Live Mode**:
   - By default, `HUNTER_SANDBOX=true` in `.env`. Emails are simulated safely.
   - When ready for live sending, add your Resend API key to `HUNTER_RESEND_API_KEY` and set `HUNTER_SANDBOX=false` in `hunter/.env`.

---

### Step 6: Inbox Triage & One-Click Reply (Inbox Agent)

1. Navigate to **[http://localhost:3001/inbox](http://localhost:3001/inbox)**.
2. When a prospect replies, sequence automatically pauses.
3. The Inbox Agent categorizes the reply (`meeting_request`, `pricing_question`, `objection`, `unsubscribe`).
4. If a user asks to unsubscribe, they are instantly added to the suppression list forever.
5. For positive replies:
   - AI generates a personalized response.
   - Review or edit the text.
   - Click **Approve & Send** to respond and share your Cal.com / Calendly booking link (`https://signhify.dpdns.org/book`).

---

## ⚙️ Environment Variables Reference (`hunter/.env`)

| Variable | Description | Default |
|---|---|---|
| `HUNTER_SITE_URL` | Base URL of ClientHunter | `http://localhost:3001` |
| `HUNTER_SANDBOX` | `true` for testing mode, `false` for live emails | `true` |
| `HUNTER_RESEND_API_KEY` | Resend API Key for sending emails | (Optional) |
| `HUNTER_FROM_EMAIL` | Sender email address | `hunter@signhify.dev` |
| `HUNTER_FROM_NAME` | Sender name | `Piyush — Signhify Studio` |
| `HUNTER_PHYSICAL_ADDRESS` | CAN-SPAM compliant US footer address | `16192 Coastal Hwy, Lewes, DE 19958, USA` |
| `HUNTER_GITHUB_TOKEN` | GitHub Personal Access Token for GitHub Scout | (Optional) |
| `HUNTER_PRODUCTHUNT_TOKEN` | ProductHunt Developer API Token | (Optional) |

---

## 💡 Daily Operator Checklist

1. **Morning (9:00 AM EST)**: Check **[http://localhost:3001/sources](http://localhost:3001/sources)** → Click **Run Now** on HN Algolia & Reddit.
2. **Mid-Day**: Check **[http://localhost:3001/leads](http://localhost:3001/leads)** → Review Tier-A leads.
3. **Afternoon**: Check **[http://localhost:3001/inbox](http://localhost:3001/inbox)** → Approve AI reply suggestions for meeting requests.
