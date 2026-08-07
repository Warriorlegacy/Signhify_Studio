# Signhify Hunter — Implementation Plan

> **Codename:** HUNTER · **Version:** 1.0 · **Date:** 07 Aug 2026
> Build order, milestones, tasks, acceptance criteria. ~7–8 weeks to MVP live, solo-founder-executable with AI pairing tools.

---

## 0. Build Strategy

- **Single founder + vibe-coding agents** (Lovable/Cursor/Claude/opencode). Ship vertical slices: every milestone ends with a *working, demoable slice*, not a dead abstraction.
- Use the God-Level Agent Prompt (`07_GOD_LEVEL_AGENT_PROMPT.md`) as the master build instruction for AI tools; reference these docs for specs.
- Env gate: email sending is irreversible and reputation-affecting → **everything delivery-related ships last and is staged (sandbox → test domains → live)**.
- One check per non-trivial unit: Vitest unit tests for verify/scoring/dedup; Playwright smoke for critical flows (login, campaign create, inbox reply).

---

## 1. Milestone Plan (M0–M7)

### M0 — Foundations (Days 1–3)

**Goal:** Repo, infra, CI, compliance skeleton.

- [ ] Init `signhify/hunter` monorepo: `apps/web`, `apps/api`, `packages/agents`, `packages/db`, `packages/scout`, `packages/outreach`, `packages/shared`
- [ ] pnpm + TypeScript strict + ESLint + Prettier + Vitest + Playwright wired
- [ ] Supabase project: auth, `app` schema via Prisma migrations, RLS policies, edge function scaffold
- [ ] Upstash Redis, Resend domain (`hunter.signhify.dev` etc.), Stripe test keys
- [ ] `.env.example` (all secrets stubbed), CI pipeline (typecheck/lint/test/build)
- [ ] Compliance pages: unsubscribe endpoint, suppression table, DSAR route, privacy copy
- [ ] **Accept:** `docker compose up` runs postgres+redis; `pnpm dev` boots API + dashboard skeleton; unsubscribe endpoint returns 200 with test token

### M1 — Scout (Days 4–8)

**Goal:** First real leads flowing from 2 public sources.

- [ ] `SourceConfig` + `Lead` schema live; dedupe by domain
- [ ] Adapter A: **HN Algolia API** (who-is-hiring + Show HN) → leads w/ context + source URL
- [ ] Adapter B: **GitHub API** (search orgs/repos + hiring signals) → leads
- [ ] Adapter C (stretch): **Reddit JSON** (r/forhire, r/SaaS) with politeness delays
- [ ] Scout worker: queue → adapter → dedupe → persist → event log; per-source rate limits; retry with backoff
- [ ] Dashboard: Sources page (config, run status, counts), Leads table (paginated, filter by source)
- [ ] **Accept:** 2 sources configured via UI; ≥ 100 leads persisted; zero duplicates on re-run; every lead has `source_url`

### M2 — Enrich & Verify (Days 9–14)

**Goal:** 85%+ verified emails.

- [ ] Enrich worker: company fields (industry, size, tech stack via Wappalyzer-style API or website heuristics)
- [ ] Verify pipeline: syntax → disposable check → MX → SMTP probe → verdict; catch-all handling
- [ ] Hunter.io/Apollo API fallback for missing contacts (configurable, budget-capped)
- [ ] Lead detail view: full enrichment, verdict badge, manual verify retry
- [ ] **Accept:** batch of 100 leads from M1 → ≥ 85 verified; verdicts visible; re-verify endpoint works

### M3 — Qualify (Days 15–18)

**Goal:** Tier A/B/C with reasons; ICP rules in settings.

- [ ] Deterministic pre-filters (country, industry blacklist, recency) in SQL
- [ ] LLM scoring with JSON-schema output; cost-tiered (mini model)
- [ ] Tier A auto-flags for outreach; Tier B → nurture pool with 14-day re-score job
- [ ] Leads page: tier filter, score column, expandable reason; manual override
- [ ] **Accept:** 3 leads manually force-scored via UI in < 5 min; every tiered lead has score + reason + model event logged

### M4 — Writer + Campaigns (Days 19–25)

**Goal:** Compose + run first campaign in sandbox.

- [ ] Template editor (subject/body with `{{lead.*}}` slots, A/B variants)
- [ ] Writer agent: per-lead personalization (Claude), 120-word cap, honesty rules, brand voice
- [ ] Campaigns CRUD + steps (channel, delay, window); audience = saved lead query
- [ ] Campaign detail: audience size, preview 5 personalized samples, human **Review & Launch**
- [ ] **Accept:** campaign with 20 Tier-A leads → 20 unique personalized emails generated; preview shows 5; launch gate works

### M5 — Delivery Engine (Days 26–32)

**Goal:** Safe, deliverable sending. (Highest risk — take the time.)

- [ ] Sending domains mgmt: SPF/DKIM/DMARC setup guide + live DNS check
- [ ] Warmup engine: 14-day ramp (5→30/day), daily job
- [ ] Scheduler: timezone-aware windows, global + per-campaign caps, weekday-only default
- [ ] Resend integration: send, bounces, opens, clicks; bounce handling (hard → suppression)
- [ ] `list-unsubscribe` + one-click unsubscribe URL in every send; suppression check at send-time
- [ ] Sandbox mode: send to test inboxes only; then test domains → live at 30/day
- [ ] **Accept:** campaign sends to sandbox OK; DNS check validates; warmup completes 14 days; manual test to personal inbox lands in Primary with 100% (no spam) on 5 test domains
- [ ] Deliverability dashboard: SPF/DKIM/DMARC, bounce%, complaint%, blacklist checks

### M6 — Respond + Inbox (Days 33–38)

**Goal:** Replies handled in < 1 hour, HITL gated.

- [ ] Resend inbound webhook → Thread creation, dedupe by message-id
- [ ] Auto-stop sequences on reply/unsubscribe; suppression on unsubscribe instantly
- [ ] Classifier (category + intent + suggestion) with `needs_human` flag
- [ ] Inbox UI: threads, unread badges (Realtime), reply editor, **Approve & Send**
- [ ] Positive → Book meeting (Cal.com) + lead status → `meeting`; CSV export
- [ ] **Accept:** send test reply to campaign address → thread appears < 30s; sequence halts; approved reply lands back to sender

### M7 — Analytics, Billing, Hardening (Days 39–45)

**Goal:** Ship-ready MVP.

- [ ] Funnel analytics: sourced → verified → qualified → sent → replied → positive → meeting; per campaign + channel
- [ ] Usage metering (leads, emails) → Stripe plans (free trial / Pro $49 / Agency $149)
- [ ] Audit log UI (approvals, sends), DSAR processing, retention job
- [ ] Observability: Sentry + OTel → Axiom; health endpoint; DLQ replay UI
- [ ] Playwright E2E suite green; seed script with fixture leads
- [ ] **Accept:** full funnel renders; billing test checkout works; zero PII in logs; all E2E green
- [ ] **GO LIVE:** switch warm domains to production volume (≤ 150/day/domain), flip `live` flag

---

## 2. Week-by-Week Summary

| Week | Milestone | Deliverable (demoable) |
|---|---|---|
| 1 | M0+M1 | Repo + dashboard skeleton + 100 leads from 2 sources |
| 2 | M2 | Enriched, verified lead base |
| 3 | M3+M4 | Tiered leads + campaign composer with AI personalization |
| 4 | M5 (part) | Warmup running, sandbox sends green |
| 5 | M5 (part) | Live delivery at 30/day, deliverability dashboard |
| 6 | M6 | Inbox with HITL replies |
| 7 | M7 | Analytics + billing + hardening |
| 8 | Go-live ramp | Scale to 150/day, first booked meetings |

---

## 3. Build Order Rules (for AI coding agents)

1. **Never build UI before its API exists** — implement API route + types first, then page.
2. **Prisma schema is the contract** — update schema → migrate → regenerate types → then code.
3. **Agents are pure functions over queues** — no agent imports a dashboard component; shared package only.
4. **Delivery code is behind a `SANDBOX` env flag** until M5 acceptance.
5. **Every queue handler is idempotent** (natural key upsert) — replays must be safe.
6. **Compliance code first-class**: unsubscribe + suppression exist in M0 and are never bypassed.

---

## 4. Testing Strategy

| Layer | Tool | Coverage |
|---|---|---|
| Unit | Vitest | verify pipeline, dedupe, scoring pre-filters, writer template engine, scheduler math, suppression |
| Agent | Vitest + mock LLM | JSON-schema parse failures, fallback tier, token caps |
| API | MSW + Vitest | All `/api/*` routes, RLS behavior via service-role test user |
| E2E | Playwright | login, source config, campaign launch (sandbox), inbox reply |
| Deliverability | Manual staged | warmup completion, inbox placement on 5 test domains, unsubscribe latency |
| Security | Manual + tools | RLS attempt with 2 users, secret scanning in CI, no PII in logs |

---

## 5. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Deliverability collapse | Med | High | Warmup ≥ 14d, ≤30/day ramp, complaint alarms at 0.1%, domain rotation |
| LLM cost blowup | Med | Med | mini-model bulk, per-campaign budget cap + alarm |
| Source ToS/blocking | High | Med | Adapters use public APIs/feeds; graceful 429 handling; diversify channels |
| Platform complaint / legal | Low | High | Compliance built-in (M0), honest personalization, suppression permanent |
| Solo-founder overload | High | Med | AI pairing for build; HITL gates keep founder time ≤ 2h/wk |
| Data privacy breach | Low | High | RLS, no PII in logs, retention 90d, DSAR endpoint |

---

## 6. Definition of Done (MVP)

1. Continuous sourcing ≥ 2,000 leads/mo from ≥ 4 channels.
2. ≥ 85% verified emails; Tier-A ≥ 8% of sourced.
3. Campaigns run unattended within limits; sequences auto-stop on reply.
4. Inbox replies triaged < 1 min; founder approves sends; bookings created in 2 clicks.
5. Deliverability: > 97% inbox, < 0.1% complaints — measured on dashboard.
6. Full compliance surface live (unsubscribe, suppression, DSAR, retention).
7. Billing live; first 3 paying agency customers (Phase 7 starts, schema already multi-tenant).
