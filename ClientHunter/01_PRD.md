# Signhify Hunter — Product Requirements Document (PRD)

> **Codename:** HUNTER
> **Product:** Signhify Hunter — Autonomous Client Acquisition OS
> **Version:** 1.0 · **Date:** 07 Aug 2026 · **Status:** Draft for build
> **Owner:** Piyush Raj Singh (Founder, Signhify)

---

## 1. Executive Summary

Signhify Hunter is an autonomous AI agent system that finds prospective clients for Signhify (AI engineering studio, signhify.dpdns.org) across the public internet, enriches and scores them, then executes compliant, personalized cold outreach (email, LinkedIn, X, WhatsApp) at scale to generate a continuous pipeline of qualified leads for the studio.

**The problem:** Signhify ships 14+ products but acquires clients manually — one outreach at a time. Manual sourcing + personalization doesn't scale, so pipeline is lumpy and founder-time is spent on prospecting instead of shipping.

**The solution:** A 6-agent autonomous system (`Scout → Enrich → Qualify → Writer → Ops → Respond`) that runs continuously, from a dashboard, with human-in-the-loop approval at every money-relevant gate.

**Success in one line:** 5+ qualified meetings booked per week with < 3% complaint rate and deliverability > 97%, running with < 2 hours/week of founder time.

### 1.1 North Star Metric

**Qualified meetings booked per week (QMB/wk).** Target: 5/week by week 8 of operation.

| Metric | Baseline (manual) | Target (Hunter) |
|---|---|---|
| Leads sourced / week | 20 | 2,000+ |
| Verified email rate | — | ≥ 85% |
| Positive reply rate | ~2% | 3–5% |
| Qualified meetings / week | 1–2 | 5–10 |
| Cost per meeting | High (founder time) | < $25 |

---

## 2. Background & Context

- Signhify is an AI engineering studio (MSME, UDYAM registered, India) selling: AI automation, LLM integrations, SaaS builds, web/product, CRM systems, API engineering, cloud/devops, data/analytics, mobile, performance marketing, security, brand.
- Founder: Piyush Raj Singh (LinkedIn/GitHub: Warriorlegacy). Existing lead channels: contact wizard, bookings, WhatsApp.
- Hunter turns the studio's own capability ("Describe your idea. Signhify builds it.") into an outbound engine that *goes to* the idea before it comes to the studio.

### 2.1 Who Hunter serves

| Persona | Description | Needs |
|---|---|---|
| Founder (primary user) | Piyush — runs studio, ships client work | Pipeline without manual prospecting; replies without context-switching |
| Future sales ops hire | Operator of campaigns, dashboards | Campaign management, sequence builder, reporting |
| Future Hunter customers | Other agencies/studios (productization in Phase 7) | Same system, multi-tenant |

---

## 3. Goals & Non-Goals

### 3.1 Goals (V1)
1. Continuously discover 2,000+ relevant prospects/month from public sources.
2. Enrich (email/company/tech-stack/decision-maker) with ≥ 85% email verification.
3. Score & auto-qualify leads; top 10% flagged for outreach.
4. Run multi-step, personalized email campaigns with automatic warm-up, scheduling, A/B subjects, and delivery limits.
5. Auto-triage replies with suggested responses; founder approves before sending (HITL).
6. Full compliance: unsubscribe one-click, suppression list, CAN-SPAM/GDPR/DPDP, sender reputation dashboards.
7. Lead-to-meeting tracking integrated with booking link + CRM export.

### 3.2 Non-Goals (V1)
- No mass DM *automation* on LinkedIn that violates platform ToS — LinkedIn DMs are generated as "copy-ready" suggestions for semi-manual send (Phase 5).
- No purchased/rented lead lists. All sourcing from public, verifiable signals.
- No intent-data products, no dark scraping of gated data.
- No full CRM — Hunter is pipeline-to-meeting; CRM export (CSV/API) only.
- Not a general-purpose marketing automation platform (that's Phase 7 productization).

---

## 4. Users & Personas

| Persona | Role | Key jobs |
|---|---|---|
| **The Founder** | Piyush | Approves campaigns & replies, reviews pipeline, books meetings, tracks ROI |
| **The Operator** | Future hire / SDR | Builds campaigns, curates lists, personalizes at scale, handles inbox |
| **The Observer** | Investor / advisor | Reads dashboards: pipeline value, meetings, costs |
| **The Prospect** | Lead (indirect) | Receives ≤ 2-3 genuinely personalized touches; one-click opt-out; zero spam feel |

---

## 5. Product Modules (V1)

```
┌─────────────────────────────────────────────────────────────┐
│                     HUNTER DASHBOARD (Web)                   │
│  Campaigns │ Leads │ Inbox │ Sources │ Analytics │ Settings  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐  ┌────────────▼──────────────┐
│        AGENT CORE           │  │       DELIVERY ENGINE      │
│  Scout → Enrich → Qualify   │  │  Warmup · Sequences · Send │
│  Writer → Ops → Respond     │  │  Rate-limits · Bounce mgmt │
└─────────────────────────────┘  └────────────────────────────┘
```

### 5.1 Agent Modules

| # | Agent | Job | Input → Output |
|---|---|---|---|
| 1 | **Scout** | Find prospects across the internet | Source configs → raw leads (company, URL, contact, context) |
| 2 | **Enrich** | Enrich + verify | Raw lead → verified email, tech stack, size, decision-maker, socials |
| 3 | **Qualify** | LLM score & route | Enriched lead → score 0–100, tier (A/B/C), reason, next action |
| 4 | **Writer** | Personalize copy | Lead + campaign → subject + body (per-lead, on-brand, honest) |
| 5 | **Ops** | Schedule & deliver | Writer output → sequenced sends w/ limits, warmup, retries |
| 6 | **Respond** | Triage replies | Inbox → category, suggested reply (founder approves) |

### 5.2 Sourcing Channels (V1)

| Channel | Method | Volume/mo (est.) |
|---|---|---|
| Clutch / agency directories | Public scrape (Firecrawl) — companies that *hire* agencies | 600 |
| GitHub | API — orgs w/ active repos, hiring signals, no marketing team | 400 |
| Hacker News (Algolia API) | "Who is hiring" + Show HN asking for help | 300 |
| Reddit (public JSON API) | r/forhire, r/webdev, r/SaaS, r/startups — "need dev", "looking for agency" | 300 |
| Product Hunt (API) | New launches — no dev team, likely need help | 200 |
| Upwork / Freelancer (public listings) | Projects tagged web/app/AI | 300 |
| Google (SERP via API) | "hire AI development agency" style queries + local SaaS lists | 300 |
| X/Twitter | Public posts: "need a developer", "looking for AI agency" | 200 |

**Ethical sourcing rules (hard):** only public data; respect robots.txt & ToS; no gated/purchased data; personal data (emails) used only for B2B outreach with lawful basis; every lead carries a source URL for provenance.

### 5.3 Outreach Channels (V1)

| Channel | V1 scope | Constraint |
|---|---|---|
| Email (primary) | Full automation | Warmup, SPF/DKIM/DMARC, limits, unsubscribe, CAN-SPAM/GDPR |
| LinkedIn | "Copy-ready" suggestions | No auto-DM; founder pastes/sends (ToS safety) |
| X DM | "Copy-ready" suggestions | Same |
| WhatsApp | Manual follow-up only | Only after prospect replies with consent |

### 5.4 Campaigns & Sequences

- Campaign = audience (source config + filters) × sequence (steps).
- Sequence step: channel, delay (0–7d), template slot (A/B), send window (timezone-aware).
- Max 3 touchpoints per sequence (V1); reply → stop sequence automatically.
- One-click unsubscribe on every email + `list-unsubscribe` header + physical address (compliance).
- Sending limits: ≤ 30/account/day while warming → ≤ 150/account/day steady, per domain; multi-domain rotation supported.

### 5.5 Inbox & HITL

- Replies land in Hunter Inbox (also forwarded to founder email).
- Respond agent classifies: `positive / question / negative / unsubscribe / OOO`.
- Suggests reply (context-aware). Founder clicks **Approve & Send** or **Edit**. Never auto-sends replies (V1).
- Positive → one-click "Book meeting" → Cal.com-style booking (Signhify `/book` or calendly) + CRM export.

---

## 6. Functional Requirements

### 6.1 Sourcing (FR-SRC)
- FR-SRC-1: Configure sources per campaign (channel, keywords, filters, geography, max leads).
- FR-SRC-2: Dedupe across channels (company domain primary key).
- FR-SRC-3: Every lead stores provenance URL + scraped-at timestamp.
- FR-SRC-4: Scout runs on schedule (cron) with per-source rate limiting and failure retry.

### 6.2 Enrichment (FR-ENR)
- FR-ENR-1: Enrich company: domain, size, HQ, industry, tech stack, socials, decision-maker contact.
- FR-ENR-2: Email verification (syntax + MX + SMTP + catch-all heuristics) — mark verified/unverified/risky.
- FR-ENR-3: Privacy filter: skip leads with no lawful B2B contact info.

### 6.3 Qualification (FR-QUAL)
- FR-QUAL-1: LLM scores on: budget signals, need signals ("agency", "hire dev"), tech fit (needs what Signhify sells), recency, competition intensity.
- FR-QUAL-2: Output tiers: A (outreach now), B (nurture 2w), C (archive).
- FR-QUAL-3: Each score must carry a 1-line human-readable reason.

### 6.4 Writing (FR-WR)
- FR-WR-1: Personalize subject + 2–3 body sentences from lead signals; max 120 words.
- FR-WR-2: Honesty mode: never fabricate facts about the lead's company; unknown → generic hook.
- FR-WR-3: Brand voice: cinematic, direct, "Describe your idea. Signhify builds it." — no hype.

### 6.5 Delivery (FR-OPS)
- FR-OPS-1: Global + per-campaign send limits, timezone windows, weekday-only default.
- FR-OPS-2: Auto-stop sequence on reply/unsubscribe/bounce/hard-bounce.
- FR-OPS-3: Warmup automation for each sending domain.
- FR-OPS-4: Deliverability dashboard: SPF/DKIM/DMARC status, bounce %, spam complaint %, blacklist checks.

### 6.6 Inbox (FR-RESP)
- FR-RESP-1: All replies thread in Hunter Inbox; dedupe by message-id.
- FR-RESP-2: Auto-categorize replies; route unsubscribes to suppression list instantly.
- FR-RESP-3: Suggested replies; founder approval required before send (V1).

### 6.7 Analytics (FR-AN)
- FR-AN-1: Funnel: sourced → verified → qualified → sent → replied → positive → meeting.
- FR-AN-2: Campaign KPIs: open, reply, positive-reply, meeting rate; cost per meeting.
- FR-AN-3: Deliverability health & per-domain reputation trend.

### 6.8 Settings & Billing (FR-SET)
- FR-SET-1: Workspace settings: sending domains, integrations (booking link, CRM export), team members.
- FR-SET-2: Usage meter (leads sourced, emails sent) → Stripe billing (free trial → $49/mo pro; agency $149/mo).

---

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Dashboard < 2s p95; campaign create → first send < 5 min; agent loop < 30s/lead |
| Reliability | 99.5% uptime; jobs retried 3× with backoff; no silent drops |
| Security | RLS on all data; secrets in vault; no PII in logs; audit log of human approvals |
| Compliance | CAN-SPAM (unsubscribe, physical address, truthful headers), GDPR (lawful basis, DSAR endpoint), India DPDP, platform ToS |
| Scalability | 50k leads, 1M events/mo at V1 cost; multi-tenant ready in schema |
| Observability | Structured logs, OpenTelemetry traces, error alerts to founder |

---

## 8. Compliance & Risk (built-in, not bolted-on)

1. **CAN-SPAM:** one-click unsubscribe, `list-unsubscribe`, physical address, no deceptive subjects, sender identification.
2. **GDPR/DPDP:** lawful basis (legitimate interest for B2B), DSAR endpoint (`/privacy-request`), suppression & erasure flow, data retention 90 days for non-responsive leads.
3. **Deliverability risk:** warmup > 2 weeks before volume, complaint-rate alarms at 0.1%, immediate domain rotation on blacklist.
4. **Platform ToS risk:** LinkedIn/X/Reddit/Upwork — scraping and DMs constrained by their terms; Hunter uses public APIs/feeds where offered and *suggestion mode* where not. Manual human action for ToS-sensitive sends.
5. **Reputation risk:** every email can be traced to a lead source; quality bar: positive-reply rate is the primary KPI, volume is secondary.

---

## 9. Success Metrics & Targets

| KPI | Target (steady state, week 8+) |
|---|---|
| Leads sourced / month | 2,000+ |
| Verified email rate | ≥ 85% |
| Tier-A conversion of sourced | ≥ 8% |
| Open rate | ≥ 60% (personalized) |
| Positive reply rate | 3–5% |
| Meetings booked / week | 5–10 |
| Complaint rate | < 0.1% |
| Deliverability (inbox %) | ≥ 97% |
| Founder time / week | ≤ 2 hrs |

---

## 10. Open Questions (resolve in design phase)

1. Send volume ambition: 30/day/domain (safe) vs 150/day (aggressive)? → Default safe, scale with domains.
2. Enrichment vendor budget: Apollo/Hunter.io API credits vs self-built verification (MX/SMTP)? → Hybrid.
3. LinkedIn: accept suggestion-mode only for V1? → Yes.
4. Productize as paid Signhify product in Phase 7? → Yes, schema multi-tenant from day 1.
