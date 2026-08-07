# Signhify Hunter — Roadmap

> **Codename:** HUNTER · **Version:** 1.0 · **Date:** 07 Aug 2026
> From internal acquisition engine (Weeks 1–8) to productized Signhify product (Quarter 4).

---

## Horizon View

```
W1-8 ──► MVP LIVE: first booked meetings (internal tool)
Q3    ──► V1.5: multi-channel, nurture, CRM export (internal, polished)
Q4    ──► V2: productized — Signhify Hunter as paid SaaS (multi-tenant)
2027  ──► V3: autonomous account-based engine, integrations marketplace
```

---

## Phase 1 — Foundations & MVP (Weeks 1–8) · *internal tool*

**Goal: 5–10 qualified meetings/week booked, ≤ 2h founder time.**

| Milestone | Weeks | Exit criteria |
|---|---|---|
| M0 Foundations | 1 | Repo, Supabase, queues, compliance skeleton green |
| M1 Scout | 1 | 100+ leads from 2 sources, dedupe proven |
| M2 Enrich & Verify | 1 | ≥ 85% verified email rate |
| M3 Qualify | 0.5 | Tier A/B/C + reasons, manual override |
| M4 Writer + Campaigns | 1 | First campaign w/ AI-personalized samples |
| M5 Delivery Engine | 1.5 | Warmup done, live sends ≤ 30/day, deliverability dashboard |
| M6 Respond + Inbox | 1 | HITL replies < 1 min, bookings in 2 clicks |
| M7 Analytics + Billing + Hardening | 1 | Funnel, Stripe, E2E green, go-live |
| **Go-live ramp** | 1 | Scale to 150/day/domain, first 10 meetings |

**KPIs at Phase 1 exit:** 2,000+ leads/mo · 85% verified · 3–5% positive reply · 5–10 meetings/wk · < 0.1% complaints.

---

## Phase 2 — V1.5: Sharpen the Loop (Quarter 3)

**Goal: higher reply rates, more channels, less founder time.**

- [ ] **LinkedIn channel v1:** semi-manual DM workflow (copy-ready + open-in-LinkedIn deep links), connection-note personalization, ToS-safe only
- [ ] **X channel:** public-post-trigger sourcing (people asking for dev help) → suggestion DMs
- [ ] **Nurture engine:** Tier-B drip (3-touch, 2-week cadence), re-score on signal changes
- [ ] **Semantic dedupe:** pgvector embeddings — catch same company via different domains/socials
- [ ] **CRM exports:** HubSpot + Pipedrive + CSV (deeper than V1)
- [ ] **Personalization 2.0:** tech-stack-aware hooks (e.g., "your site is Next.js…"), project-repo-aware case studies
- [ ] **A/B testing suite:** subject + body + CTA experiments with significance reporting
- [ ] **Meeting pipeline:** automated pre-meeting briefing card (lead signals + suggested agenda) attached to booked meetings
- [ ] **Founder mode:** daily digest email (yesterday's numbers, today's approval queue)

**KPIs:** positive reply 5%+ · 10–15 meetings/wk · founder time < 1 hr/wk · 4+ active channels.

---

## Phase 3 — V2: Productize as Signhify Hunter SaaS (Quarter 4)

**Goal: second revenue line for Signhify; other agencies pay for the engine.**

- [ ] **Multi-tenant hardening:** workspace isolation review, audit, security pass
- [ ] **Onboarding:** connect domain → DNS wizard → warmup → first campaign templates (agency/studio ICP presets)
- [ ] **Template gallery:** 10 starter campaigns (SaaS dev, agency, AI automation, EdTech) — ships with the studio's own proven sequences
- [ ] **Billing full:** Pro $49/mo (2 domains, 3k leads/mo), Agency $149/mo (10 domains, 20k leads/mo, team seats), usage add-ons
- [ ] **Public site:** hunter.signhify.dpdns.org — cinematic landing (same design language), docs, pricing, affiliate program
- [ ] **API + webhooks:** lead/event streaming to customer CRMs
- [ ] **Signhify eat-own-dogfood:** Hunter is the acquisition engine for all future Signhify sales
- [ ] **Case study:** publish Hunter's own funnel data (with consent) as the flagship testimonial

**KPIs:** 30 paying agencies · $5k MRR · NRR > 110%.

---

## Phase 4 — V3: Autonomous Account Engine (2027)

**Goal: from leads to accounts; from outreach to revenue orchestration.**

- [ ] **Account-based mode:** target account lists → multi-contact sequences (CEO+CTO+founder), coordinated touches
- [ ] **Intent signals:** funding events, hiring spikes, tech migrations, competitor activity → auto-wake dormant campaigns
- [ ] **AI SDR conversations:** reply engine with escalating HITL (auto-answer FAQs, escalate anything novel)
- [ ] **Multi-channel orchestration:** email ↔ LinkedIn ↔ WhatsApp (with consent) unified journeys
- [ ] **Revenue analytics:** pipeline value, win rates by source/channel, CAC/LTV per channel — "the ROI sheet" feature
- [ ] **Integration marketplace:** n8n, HubSpot, Salesforce, Slack alerts, Google Sheets sync
- [ ] **Agent marketplace:** third-party agents (scrapers, enrichers, writers) sellable on Hunter

**KPIs:** 200 agencies · $50k MRR · positive-reply benchmark library shared publicly.

---

## Guardrails for Every Phase

1. **Deliverability is sacred** — never ship a volume feature before its reputation-protection (warmup/limits/alarms) ships with it.
2. **Compliance is a feature** — unsubscribe/suppression/DSAR exist from M0 and are never bypassed.
3. **ToS-aware by design** — platforms that prohibit automation get suggestion-mode, not loopholes.
4. **Dogfood first** — every phase ships internally for 2 weeks before it's a product feature.
5. **Data hygiene** — retention, dedupe, and suppression are quarterly review items, not one-time fixes.
6. **AI costs tracked per campaign** — hard budget caps from day 1 (mini-model defaults).

---

## Milestone Owners & Cadence

- Owner: Piyush Raj Singh (founder) — all phases, with AI pairing tools per `07_GOD_LEVEL_AGENT_PROMPT.md`.
- Review cadence: weekly funnel review (Mon 09:30), monthly roadmap re-plan, quarterly compliance & deliverability audit.
- Definitions: MVP = Phase 1 exit; Product-ready = Phase 3 exit; Scale = Phase 4.
