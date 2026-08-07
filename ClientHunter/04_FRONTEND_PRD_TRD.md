# Signhify Hunter — Frontend PRD-TRD

> **Codename:** HUNTER · **Version:** 1.0 · **Date:** 07 Aug 2026
> Scope: Dashboard web app. Companions: `01_PRD.md`, `02_TRD.md`, `03_IMPLEMENTATION_PLAN.md`

---

## 1. Product Requirements (Frontend)

### 1.1 Goals

1. Founder sees the entire acquisition funnel in one cinematic dashboard — sourced → verified → qualified → sent → replied → booked.
2. Campaigns, sources, inbox, and approvals usable on a phone in under 3 taps.
3. Feels like a Signhify product (same design language as signhify.dpdns.org) — not like a generic CRM.
4. Every AI action is visible and reversible (audit trail, preview before send, human gates).

### 1.2 Pages & Routes

| Route | Page | Key features |
|---|---|---|
| `/` | **Dashboard** | KPI row (leads this week, meetings booked, positive replies, cost/meeting), funnel visualization, live agent activity feed, deliverability health strip |
| `/leads` | **Leads** | Table + filters (tier, source, channel, verification, status), search, bulk actions (re-tier, add to campaign), lead drawer (detail: enrichment, score reason, events timeline, email preview) |
| `/sources` | **Sources** | Source cards (channel, config, status, last run, counts), enable/disable, run-now, config editor (keywords, geo, limits) |
| `/campaigns` | **Campaigns** | List w/ status; campaign wizard: audience → sequence steps (channel/delay/window) → template editor (A/B, `{{lead.*}}` slots) → AI sample preview → **Review & Launch** gate |
| `/campaigns/{id}` | Campaign detail | Step pipeline view, per-step stats, sent/replied lists, pause/resume, budget consumed |
| `/inbox` | **Inbox** | Thread list w/ unread (Realtime badge), category chips (positive/question/…), thread view: conversation, AI suggestion card (copy / edit / approve-send), book-meeting action, unsubscribe indicator |
| `/analytics` | **Analytics** | Funnel by channel/campaign/time; reply-rate trend; deliverability (inbox%, bounce%, complaint%, blacklist); export CSV |
| `/settings` | **Settings** | Sending domains + DNS check status, warmup status, ICP rules editor, integrations (booking link, Stripe), team, compliance (DSAR requests, suppression export) |
| `/usage` | **Usage & billing** | Metered usage, plan, upgrade (Stripe checkout) |
| `/compliance/unsubscribe` | Unsubscribe (public) | One-click, no auth, token-validated |
| `/compliance/dsar` | DSAR form (public) | Request data export/erasure |

### 1.3 User Flows (top 5)

1. **Launch a campaign:** Sources → Leads → filter Tier-A → New Campaign → wizard → AI preview 5 samples → Review & Launch → queue status live.
2. **Handle a reply:** Inbox badge (1) → thread → AI suggestion → Edit or Approve → sent; if positive → Book meeting → lead → `meeting`.
3. **Check health:** Dashboard strip shows inbox % + complaints; warning state when complaints > 0.1%.
4. **Add a source:** Sources → New → pick channel → paste config → Test run → results visible → enable.
5. **Privacy action:** any email → unsubscribe link → confirm screen → suppression confirmed (data deleted per retention).

### 1.4 UI/UX Requirements

| Area | Requirement |
|---|---|
| Design language | Signhify brand system: obsidian `#0D0D14`, electric orange `#FF6B00`, amber `#F59E0B`, glassmorphism cards, Space Grotesk display / Inter body |
| Density | Dashboard = cinematic & sparse; tables = dense but readable; inbox = mail-client standard |
| Motion | Framer Motion: page transitions, funnel bar animations, agent activity stream, subtle glow pulses on live indicators (matches studio aesthetic) |
| Live updates | Supabase Realtime for inbox unread, agent activity feed, campaign progress |
| Empty states | Cinematic + instructive (no dead grey boxes): each page has a "first run" guided empty state |
| Responsive | Desktop-first; critical flows (approve reply, campaign pause, KPI glance) usable on mobile |
| Accessibility | WCAG AA: contrast on orange-on-dark, keyboard nav for inbox/campaign wizard, focus rings |
| Loading | Skeleton glass panels (not spinners) on data pages |
| States | Every action has optimistic UI + revert; errors as inline glass toasts |

---

## 2. Technical Requirements (Frontend)

### 2.1 Stack

- TanStack Start (v1) + React 19 + TypeScript strict
- Tailwind v4 (CSS-first config, Signhify tokens below) + shadcn/ui + Framer Motion
- TanStack Query (server state) + TanStack Router (file-based)
- Supabase JS (auth + Realtime)
- Recharts (funnel/charts) — already studio standard

### 2.2 Design tokens (shared, mirrors signhify.dpdns.org)

```css
:root {
  --bg-obsidian: #0D0D14;   /* near-black base */
  --bg-panel: rgba(255,255,255,0.03);        /* frosted glass */
  --bg-panel-strong: rgba(255,255,255,0.06);
  --border-glass: rgba(255,255,255,0.08);
  --accent-electric: #FF6B00;   /* electric orange */
  --accent-amber: #F59E0B;      /* gold/amber highlight */
  --text-primary: #E2E8F0;      /* slate-200 */
  --text-muted: #94A3B8;        /* slate-400 */
  --success: #34D399; --danger: #F87171; --info: #38BDF8;
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --glow-orange: 0 0 24px rgba(255,107,0,0.25);
}
```

### 2.3 Component architecture

```
apps/web/src
  routes/            # file-based router: index, leads, sources, campaigns, inbox, analytics, settings, usage
  components/
    layout/          # AppShell (sidebar: logo, nav, live-pulse, usage meter), TopBar
    dashboard/       # KpiCard, Funnel, ActivityFeed, DeliverabilityStrip
    leads/           # LeadsTable, LeadDrawer, LeadTimeline, TierBadge
    campaigns/       # CampaignWizard (3 steps), StepPipeline, TemplateEditor, SamplePreview
    inbox/           # ThreadList, ThreadView, SuggestionCard, ReplyComposer
    sources/         # SourceCard, SourceConfigForm, RunStatusPill
    shared/          # GlassCard, StatusPill, EmptyState, ConfirmDialog, Toast, Skeleton
  lib/               # api client (typed), query hooks, auth guard, format utils
  styles/            # tailwind v4 tokens + global glass utilities
```

### 2.4 Data fetching

- All `/api/*` calls via typed client generated from OpenAPI (`orval`/`openapi-typescript`); TanStack Query keys: `['leads', {filters}]`, `['campaigns', id]`, `['inbox', {status}]`, `['analytics', {range}]`.
- Realtime subscriptions: `inbox_unread` (workspace), `agent_events` (workspace, recent 50), `campaign:{id}:progress`.
- Optimistic updates only for human-owned actions (re-tier, approve reply); AI-owned state always refetched.

### 2.5 Key screens — spec detail

**Dashboard**
- KPI cards (glass, glow on hover): `Leads this week`, `Meetings booked`, `Positive replies`, `Cost per meeting` — 24h/7d/30d toggle.
- Funnel: horizontal bars, orange gradient, stage-to-stage conversion % inline.
- Agent activity feed: streaming console of agent events (`[12:04:12] Scout: 40 leads from HN…`) — same pattern as Signhify AI `/ai` live console.
- Deliverability strip: inbox %, bounce %, complaint % with red/green state.

**Campaign wizard (3 steps)**
1. Audience: saved query builder (source, tier, filters) + live count.
2. Sequence: add steps (channel, delay, send window, A/B toggle).
3. Template + samples: editor w/ `{{lead.*}}` autocomplete; **Generate 5 AI samples** button; Review & Launch gate listing exact send count + first-send time.

**Inbox thread**
- Left: thread list (unread dot, category chip). Right: conversation; sticky suggestion card: `AI: [reply] — Edit · Approve & Send · Reject`; positive → `Book meeting` button (opens Cal.com link creation + lead → meeting).

**Analytics**
- Funnel by channel (stacked), reply-rate trend line, deliverability health, CSV export; date range presets.

### 2.6 Error & edge handling

- 401 → session refresh → login redirect; 403 → locked state with support link.
- Empty data → guided empty states with primary action.
- Realtime disconnect → badge `reconnecting` + refetch on reconnect.
- Approve-send conflicts (thread already replied) → inline stale-warning, block double-send.
- All destructive actions (stop campaign, delete source) → ConfirmDialog; campaign stop shows sent-pending count.

### 2.7 Acceptance criteria (frontend)

1. Full funnel renders live with Realtime updates; KPI toggles work.
2. Campaign wizard: create → samples → launch in < 5 min; gate blocks empty templates.
3. Inbox: reply → suggestion → approve → sent, end-to-end, with optimistic UI.
4. Mobile: approve reply + pause campaign work on 390px viewport.
5. WCAG AA automated checks pass (axe in CI); keyboard navigable inbox.
6. No console errors/warnings in production build; p95 route load < 2s.
