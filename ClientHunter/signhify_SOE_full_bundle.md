

---

# Source: output/signhify_SOE_PRD.md

# Product Requirements Document (PRD)
## Signhify Outreach Engine (SOE) — Autonomous B2B SaaS Client Acquisition Agent

**Version:** 1.0  
**Date:** August 2026  
**Owner:** Piyush Raj Singh

---

## 1. Problem Statement

Signhify is positioned as an AI engineering studio and vibe-coding platform that designs, builds, and launches AI-first SaaS products, autonomous agents, and growth systems end-to-end.[cite:32] Manual prospecting and one-off DM outreach cannot sustain a predictable pipeline of B2B SaaS clients (founders and teams) who need MVPs, internal tools, and AI integrations built quickly. The founder requires an autonomous AI agent system that continuously discovers, qualifies, and contacts B2B SaaS prospects and converts them into booked calls and signed projects, while strictly adhering to CAN-SPAM, GDPR, CASL, and other cold email regulations.[cite:17][cite:24][cite:30]

## 2. Goals & Non-Goals

### Goals
- Automatically discover and enrich B2B SaaS prospects that match a defined ICP (company size 5–200 employees, product-led SaaS, recent funding or launch signals) at a target rate of 500–2,000 net-new contacts per week.[cite:25][cite:27]
- Generate highly personalized cold email sequences referencing real buying signals (funding, hiring, product launches, tech stack) rather than generic blasts, to achieve reply rates in the 8–15% range typical for well-targeted AI SDR systems.[cite:27][cite:28]
- Integrate reply classification, meeting booking, and CRM pipeline tracking into a single dashboard so the founder can see the full funnel from discovery to signed deals.
- Embed legal and deliverability guardrails (SPF/DKIM/DMARC, unsubscribe, suppression, geography filters) into the platform so every outbound touch is compliant by design.[cite:17][cite:24][cite:30]

### Non-Goals (v1)
- Do not automate paid ads or performance marketing channels in v1 (no Google Ads, Meta, etc.).
- Do not include voice or cold-calling agents in the first release; these can be roadmap items once email/DM channels are stable.
- Do not target B2C or personal email addresses; focus exclusively on professional B2B SaaS contacts to remain within legitimate interest frameworks.[cite:30]
- Do not attempt to replace high-touch sales calls; SOE optimizes discovery, outreach, and qualification, not closing.

## 3. ICP Definition

**Primary ICP:**
- Role: Founders, co-founders, CTOs, Heads of Product/Engineering at B2B SaaS companies.
- Company size: 5–200 employees.
- Geography: Primarily US, UK, Canada, and EU countries where B2B cold email with legitimate interest is permissible, with the ability to exclude or limit strict opt-in jurisdictions.
- Signals:
  - Recent funding announcements.
  - Hiring for product/engineering leadership.
  - Product Hunt / IndieHackers launches.
  - Job postings mentioning "MVP", "AI agent", "no-code", "internal tools", or "workflow automation".[cite:27][cite:28]

The ICP will be configurable in the SOE dashboard via filters and signal selectors.

## 4. Core User Stories

1. As Piyush, I can define or update my B2B SaaS ICP in a single configuration panel, including target regions, company sizes, roles, and buying signals.
2. As Piyush, I can see a continuously refreshed list of discovered prospects, each enriched with name, role, company, domain, verified work email, LinkedIn URL, and detected signals.
3. As Piyush, I can review AI-generated personalized email sequences for a batch of prospects, approve them in bulk or modify specific messages, and then launch the campaign.
4. As Piyush, I can monitor compliance indicators (unsubscribe rate, spam complaints, bounce rate, geography distribution) to ensure outbound activity remains within safe and legal boundaries.
5. As Piyush, I receive categorized reply summaries (positive interest, neutral, negative, out-of-office, unsubscribe) and can trigger follow-up actions or booking links with one click.
6. As Piyush, I see a visual funnel from discovered → enriched → contacted → replied → booked → closed, and can attribute revenue back to campaigns.

## 5. Feature Overview (v1)

| Feature | Description | Priority |
|--------|-------------|----------|
| ICP & Signal Config | UI to define B2B SaaS target segments, company size, geography, and buying signals | P0 |
| Discovery Agent | Agent that uses APIs and web scraping to identify new ICP-matching companies and contacts | P0 |
| Enrichment & Verification | Email, role, and company enrichment with email verification waterfall to keep bounce rate under 3% | P0 |
| Personalization Agent | LLM-based generator for per-contact subject lines, openers, and email bodies referencing specific signals | P0 |
| Sequence Engine | Multi-step outreach cadence (Day 0/4/8/15) with automatic stop on reply/bounce/unsubscribe | P0 |
| Sending Infrastructure | Multi-domain, multi-mailbox sending with warmup and per-mailbox caps, SPF/DKIM/DMARC enforcement | P0 |
| Compliance Layer | Central suppression list, unsubscribe handling, geographic filters, logging of lawful basis for EU contacts | P0 |
| Reply Classification | AI classification of inbound replies into categories and suggested actions | P0 |
| CRM & Pipeline Dashboard | Web UI showing pipeline stages, metrics, and per-campaign performance | P0 |
| Calendar Integration | Integration with Calendly/Cal.com to insert booking links and track meetings | P1 |
| Analytics & Optimization | A/B testing of email variants and self-learning prompts based on outcome data | P1 |
| LinkedIn/X DM Expansion | Optional multi-channel support for professional networks and social DMs | P2 |

## 6. Success Metrics

- Inbox placement rate above 85% for active campaigns, measured via open rates and deliverability reports.[cite:16]
- Reply rate between 8–15% for personalized sequences to ICP-matched B2B SaaS leads.[cite:27]
- Bounce rate below 3% and spam complaint rate below 0.1% across all mailboxes.[cite:16][cite:28]
- Minimum of 5–10 booked calls per week once steady state is reached, with at least 2–3 converting into paid engagements.
- No documented violations of CAN-SPAM, GDPR, or CASL from outbound activity.

## 7. Constraints & Compliance Requirements

- CAN-SPAM: honest, non-deceptive subject lines; accurate sender information; physical postal address; clear, functioning unsubscribe link in every email; opt-out requests honored within 24 hours.[cite:17][cite:30]
- GDPR: document Legitimate Interest Assessments for EU recipients; restrict to professional contacts where Signhify's services are relevant to their role; include an easy opt-out and clear explanation of why they are being contacted; maintain a record of processing activities.[cite:24]
- CASL: ensure implied or express consent for Canadian recipients; include required identification and contact details in each message.[cite:17]
- Geography-based controls: allow the user to include/exclude specific jurisdictions and default to opt-out of strict B2C countries.
- Deliverability: require SPF, DKIM, and DMARC on sending domains and implement mailbox warmup, volume throttling, and regular monitoring of Google Postmaster-like metrics.[cite:16][cite:28]
- Data protection: store lead data securely with role-based access control, encryption at rest, and retention policies that respect data minimization principles.

## 8. Risks and Mitigations

- Risk: Deliverability collapse due to aggressive volume increases.  
  Mitigation: Gradual warmup, daily send limits per mailbox, automated throttling when bounce or complaint rates spike.
- Risk: Legal exposure from contacting inappropriate recipients.  
  Mitigation: Strict ICP filters, geography allow-list, professional email detection, and clear compliance defaults in the UI.
- Risk: Platform policy violations on LinkedIn/X automation.  
  Mitigation: Start with email-only in v1 and maintain conservative, human-like rates and patterns for any future social automation.
- Risk: Brand damage from low-quality or spammy messaging.  
  Mitigation: Mandatory personalization checks, human-in-the-loop review, and tone templates aligned with Signhify's brand.


---

# Source: output/signhify_SOE_TRD.md

# Technical Requirements Document (TRD)
## Signhify Outreach Engine (SOE)

---

## 1. High-Level Architecture

SOE will be a cloud-native, multi-service system composed of:
- **Frontend SPA**: Next.js/React front-end hosted on Vercel, matching Signhify's existing AI workspace and studio branding.[cite:31][cite:32]
- **Backend APIs**: TypeScript/Node.js services exposing REST/GraphQL endpoints for ICP config, discovery, enrichment, outreach, compliance, and analytics.
- **Worker Layer**: Queue-based workers for discovery, enrichment, sending, reply classification, and analytics, running on serverless functions (Vercel Edge Functions, Cloudflare Workers) or containerized tasks.
- **Data Layer**: Postgres database (Supabase or managed Postgres) storing prospects, campaigns, events, suppression lists, and configuration.[cite:32]
- **LLM Layer**: Integration with OpenAI, Anthropic, and Google Gemini via BYOK keys, reusing Signhify's existing multi-provider workspace pattern.[cite:31]
- **Email Sending Layer**: Integration with dedicated email providers (e.g., SMTP relays, specialized outreach tools) with custom logic for warmup and throttling.
- **Compliance & Monitoring**: Modules for suppression list management, lawful basis tracking, geography filters, deliverability metrics, and audit logging.

## 2. Tech Stack Choices

### Frontend
- Framework: Next.js 14 with React 19.[cite:32]
- Styling: Tailwind CSS v4 with cinematic UI components (shadcn/ui, Framer Motion) aligned to Signhify's brand (dark backgrounds, gradients, neon accent colors).[cite:32]
- State management: React Query (TanStack Query) and server actions for data fetching.[cite:32]
- Authentication: NextAuth or custom JWT-based auth integrated with Signhify workspace accounts.

### Backend
- Runtime: Node.js/TypeScript.
- Framework: tRPC or NestJS-style API or direct Next.js Route Handlers.
- Database: Supabase Postgres (shared with Signhify core where appropriate).[cite:32]
- Background jobs: Queue system using Redis or Supabase queue-like capabilities, with workers deployed as serverless functions.
- Email provider: Integration with transactional/outreach ESPs (e.g., Mailgun, Postmark, or Smartlead-like platform) via API.
- Scraping/discovery: Use official APIs where possible (e.g., Crunchbase, job board APIs) and headless browser-based scraping via Playwright/Puppeteer with rate-limits.

### LLM & AI
- Prompt orchestration: LangChain or custom pipeline with per-task prompts (personalization, reply classification, ICP match scoring).[cite:32]
- Models: OpenAI GPT-4.1, Anthropic Claude 3.5, Google Gemini via BYOK, with routing logic based on task type.[cite:31]

## 3. Core Services

### 3.1 ICP & Config Service
- Stores ICP definitions: roles, company sizes, regions, signals, and exclusions.
- Provides CRUD APIs to manage ICP profiles.
- Validates config for compliance defaults (e.g., default geography allow-list).

### 3.2 Discovery Service
- Periodically queries external data sources:
  - SaaS company databases.
  - Funding and job listing APIs.
  - Product launch sites (Product Hunt, IndieHackers).
- Produces candidate companies and contacts pushed into the enrichment queue.

### 3.3 Enrichment & Verification Service
- Integrates with enrichment APIs (e.g., Apollo-like, Hunter-like) to retrieve emails and firmographics.[cite:19][cite:22]
- Runs email verification (syntax, MX records, risk scoring) and tags contacts as "verified", "risky", or "invalid".
- Automatically suppresses invalid addresses and logs reasons.

### 3.4 Personalization & Sequence Service
- Uses LLM prompts to generate per-contact email content:
  - Subject line referencing role and signal.
  - First-line personalized opener.
  - Body tailored to SaaS pain points and Signhify capabilities.[cite:31][cite:32]
- Stores templates and variants for A/B testing.
- Manages cadence schedules and triggers send events.

### 3.5 Sending & Warmup Service
- Implements mailbox warmup schedule:
  - Start with 10–20 emails/day per mailbox; ramp gradually.
- Enforces per-mailbox and per-domain daily caps.
- Tracks send events, bounces, and spam complaints.

### 3.6 Reply Classification Service
- Ingests inbound emails via webhooks.
- Uses LLM classification to label replies.
- Updates contact/campaign state and creates tasks (e.g., follow-up needed).

### 3.7 Compliance Service
- Central suppression list with hashed email identifiers.
- Manages unsubscribe requests and ensures they propagate across campaigns.
- Stores lawful basis records (e.g., legitimate interest notes for GDPR).
- Provides queryable audit logs for outbound events.

### 3.8 Analytics & Dashboard Service
- Aggregates metrics for funnels and campaigns.
- Provides API endpoints for charts and reports.

## 4. Data Model (Simplified)

Key entities:
- **User**: workspace owner or collaborator.
- **ICPProfile**: configuration for a target segment.
- **Company**: SaaS company record.
- **Contact**: person record with email, role, LinkedIn, signals.
- **Campaign**: outreach campaign tied to an ICPProfile.
- **SequenceStep**: individual email/DM steps.
- **Message**: outgoing communication.
- **Reply**: inbound communication classification.
- **SuppressionEntry**: suppressed email domains/addresses.
- **DeliverabilityMetric**: daily metrics per mailbox.

## 5. Security & Privacy Requirements

- Use HTTPS/TLS for all communications.
- Store sensitive keys in environment variables or secret managers.
- Encrypt contact data at rest where required.
- Enable RBAC for access to prospect and campaign data.

## 6. Performance & Reliability

- Design for thousands of contacts and messages per day with horizontal scaling of workers.
- Implement retries for transient API failures.
- Log and monitor worker queues with alerting on backlogs.



---

# Source: output/signhify_SOE_frontend_PRD_TRD.md

# Frontend PRD/TRD — Signhify Outreach Engine

## 1. UX Goals

- Provide a cinematic, AI-native dashboard that feels consistent with Signhify's studio and AI workspace aesthetics: dark theme, gradient accents, clean typography, agent cards, and workflow timelines.[cite:31][cite:32]
- Minimize clicks for core actions: ICP editing, campaign review, launch, and monitoring.
- Make compliance visible via subtle but clear indicators (green/yellow/red status chips, banner warnings) without overwhelming the user.

## 2. Key Screens

1. **Command Center Dashboard**
   - At-a-glance metrics: discovered, enriched, contacted, replied, booked, closed.
   - Live funnels and trend charts.
   - Compliance status: deliverability health, bounce rate, spam complaints, GDPR/consent flags.

2. **ICP Configuration Screen**
   - Form wizard to define B2B SaaS ICP.
   - Geography selector with compliance hints.
   - Signal toggles (funding, hiring, launches).

3. **Prospect List & Detail View**
   - Table/grid of contacts with company, role, signal tags, verification status.
   - Detail view showing extracted signals and suggested personalized email.

4. **Campaign Builder**
   - Select ICP profile and prospect segments.
   - Configure cadence steps (subject, body, send day offsets).
   - Preview and edit AI-generated content.

5. **Compliance & Suppression Screen**
   - View and search suppression entries.
   - Export audit logs.

6. **Settings**
   - API keys (LLM providers, email services).
   - Calendar integration.
   - Notification preferences.

## 3. Interaction & Component Design

- Reuse Signhify workspace patterns: agent cards, memory vault elements, schedule widgets.[cite:31]
- Use state machines for campaign states (draft, scheduled, running, paused, completed).

## 4. Accessibility & Internationalization

- WCAG AA contrast.
- Localized content for compliance notices and regions.



---

# Source: output/signhify_SOE_backend_PRD_TRD.md

# Backend PRD/TRD — Signhify Outreach Engine

## 1. Service Responsibilities

- Implement APIs for ICP config, prospect management, campaign control, compliance enforcement, and analytics.
- Coordinate discovery, enrichment, sending, reply classification, and suppression.

## 2. API Endpoints (Examples)

- POST /api/icp
- GET /api/icp/:id
- POST /api/prospects/discover
- POST /api/campaigns
- POST /api/campaigns/:id/launch
- POST /api/unsubscribe

## 3. Compliance Logic

- Validate outbound messages against jurisdiction rules.
- Attach required footer elements.
- Update suppression lists on unsubscribe or complaints.



---

# Source: output/signhify_SOE_roadmap.md

# Roadmap — Signhify Outreach Engine

## Phase 1 (Weeks 1–2): Compliance & Infra

- Domains, mailboxes, SPF/DKIM/DMARC.
- Legal docs and suppression lists.

## Phase 2 (Weeks 2–4): Discovery & Enrichment

- ICP config.
- External data sources and enrichment.

## Phase 3 (Weeks 3–5): Personalization & Sequencing

- LLM prompts and cadence engine.

## Phase 4 (Weeks 5–6): Sending, Reply Handling, CRM

- Warmup, reply classification, dashboard.

## Phase 5 (Week 6+): Optimization & Multi-Channel

- A/B tests, LinkedIn/X expansion.



---

# Source: output/signhify_SOE_vibe_prompt.md

You are an autonomous AI engineering system tasked with designing, building, and deploying the **Signhify Outreach Engine (SOE)** — an AI-native B2B SaaS client acquisition platform for **Signhify — Best AI Engineering Studio & Vibe-Coding Platform**.

## Mission

Continuously discover B2B SaaS prospects that match the defined ICP, enrich and verify their contact data, generate legally compliant personalized cold email sequences, send them via warmed-up mailboxes, classify replies, and push qualified opportunities into a CRM pipeline and calendar — all while preserving deliverability and complying with CAN-SPAM, GDPR, and CASL.

## Brand & Aesthetic Anchors

- Align with Signhify's existing studio and AI workspace branding: cinematic dark UI, gradient accents, "agents" metaphor (Nexus, Scribe, Scout, Forge, Herald, Vault, Vision), and "vibe-coding" philosophy.[cite:31][cite:32]
- Convey that this is an AI-native engineering studio with end-to-end capability from idea to shipped product.

## ICP (Initial Default)

- Role: founders, co-founders, CTOs, Heads of Product/Engineering at B2B SaaS companies.
- Company size: 5–200 employees.
- Geography: US, UK, Canada, EU (excluding strict opt-in-only jurisdictions when necessary).
- Signals: recent funding, hiring for product/engineering, product launches on Product Hunt/IndieHackers, job posts mentioning "MVP", "AI agent", "no-code", "automation".

## Hard Constraints (Compliance)

1. **CAN-SPAM**
   - Honest, non-deceptive subject lines.
   - Accurate From and Reply-To fields.
   - Include a physical postal address.
   - Provide a clear, easy unsubscribe link in every email.
   - Honor unsubscribe requests within 24 hours.

2. **GDPR (EU)**
   - Contact only professional B2B recipients whose role is relevant to Signhify's services.
   - Use "legitimate interest" as the lawful basis and document this for each campaign.
   - Explain why the recipient is being contacted and provide an easy opt-out.
   - Maintain records of processing activities.

3. **CASL (Canada)**
   - Ensure implied or express consent before contacting.
   - Include required identification and contact details.

4. **Deliverability**
   - Only send from domains with SPF, DKIM, and DMARC configured.
   - Warm up new mailboxes gradually; enforce daily send caps.
   - Monitor bounce and complaint rates and auto-throttle to protect reputation.

5. **Data Protection**
   - Store prospect data securely; minimize retained fields.
   - Implement suppression lists and never email suppressed contacts.

## System Capabilities to Build

Design and implement, step by step, the following components:

1. **ICP & Config Module**
   - UI and API to define ICP profiles, geography, signals, exclusions.

2. **Discovery Agent**
   - Integrations with SaaS company databases, funding trackers, job boards, and launch platforms.
   - Scheduled workflows to pull new prospects that fit the ICP.

3. **Enrichment & Verification Agent**
   - Integrations with enrichment APIs (Apollo-like, Hunter-like) for work emails and firmographics.
   - Email verification waterfall; tag invalid addresses; auto-suppress.

4. **Personalization Agent**
   - Prompt pipelines that generate per-contact subject, opener, and body, referencing real signals.
   - Tone: helpful expert studio, focused on outcomes, never pushy or spammy.

5. **Sequence & Sending Engine**
   - Data model for campaigns and sequence steps.
   - Scheduler that triggers sends by day offsets (0/4/8/15) and stops on reply/bounce/unsubscribe.
   - Warmup and daily cap logic per mailbox and domain.

6. **Reply Classification Agent**
   - Ingest incoming replies via webhooks.
   - Classify into positive, neutral, negative, out-of-office, unsubscribe.
   - Trigger appropriate next actions (follow-up suggestion, booking link, suppression).

7. **Compliance Layer**
   - Central suppression list; audit log of outbound events.
   - Jurisdiction rules engine determining whether a contact can be emailed.

8. **CRM & Dashboard**
   - Pipeline visualization; metrics and trends.
   - Campaign performance breakdown.

## Implementation Behaviour

When executed in a vibe-coding or AI-building environment:

- Start by scaffolding the architecture (frontend, backend, data models, queues) using the host platform's best practices.
- Generate production-ready Next.js/React frontends, Node.js/TypeScript backends, and database schemas for Postgres/Supabase.
- Wire API integrations and background workers step by step, validating each component via test data.
- Expose configuration and control through a cinematic dashboard aligned with Signhify's brand.
- Continuously refine prompts and logic based on outcome data to improve reply rates and maintain compliance.

Always prioritize:
- Legal compliance.
- Deliverability health.
- High-quality, respectful outreach.
- Alignment with Signhify's positioning as an AI engineering studio.

