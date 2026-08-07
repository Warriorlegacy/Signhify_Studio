# Signhify Hunter — Theme Analysis, Design Inspiration & Credits

> Source analysis of **signhify.dpdns.org**, **signhify-ai-web.vercel.app**, and recent Signhify projects — extracted for the Hunter product design system.

---

## 1. Website Analysis — signhify.dpdns.org (Studio HQ)

### 1.1 Design system (extracted)

| Token | Value | Usage |
|---|---|---|
| Base background | Near-black `#0D0D14` ("obsidian") | Global page base |
| Electric orange | `#FF6B00` | Primary accent, CTA glow, active states |
| Amber / gold | `#F59E0B` | Secondary highlights, badges, ratings |
| Surface | Glassmorphism `rgba(255,255,255,0.03–0.06)` | Cards, panels over blurred imagery |
| Borders | `rgba(255,255,255,0.08)` | Hairline glass borders |
| Text | `slate-200` / `slate-400` | Primary / muted |
| Display font | Space Grotesk (300–700) | Headlines, hero |
| Body font | Inter (300–600) | UI copy |
| Motion | Framer Motion, glow pulses, scroll scenes | Cinematic feel |

### 1.2 Thematic language

- **Cinema metaphor throughout:** "A film unfolding, scene by scene", "Scroll · Scene 01 of 4", "scripted, designed and shipped with conviction".
- **Anti-hype copy, big statements:** "STOP IMAGINING, START SHIPPING." · "Describe your idea. Signhify builds it."
- **Versioned identity:** "v2026.06 · Studio" badge.
- **Structure:** cinematic hero → marquee tech stack → preset gallery (hover-spotlight cards) → services grid (12 capabilities) → process (01–04) → ecosystem (6 live products) → founder section → CTA with Instant Sprint Scoper.
- **Trust signals:** MSME UDYAM registration, real shipped project URLs (not mockups), "100% Code Ownership on your GitHub from Day One", free credits, no lock-in.

### 1.3 What to reuse in Hunter

1. The **exact token set** (obsidian/orange/amber/glass) — Hunter must feel like the same family.
2. **Live-console streaming pattern** from `/ai` (Signhify AI): `[12:04:12] Scout: Parsing requirements…` style agent logs → Hunter's activity feed.
3. **Process-section treatment** (01 Describe → 02 Design → 03 Build → 04 Launch) → Hunter's funnel visualization.
4. **Gallery card pattern** (hover spotlight, "Open brief / Visit" links) → Hunter's campaigns and source cards.
5. **Founder proof block** with counts → Hunter's "results" dashboard strip.
6. **Ecosystem grid** (Studio/AI/Deploy/Marketplace/Cloud/OS — all LIVE) → Hunter slots in as the 7th product: acquisition engine.

---

## 2. App Analysis — signhify-ai-web.vercel.app (Signhify AI)

- **Tagline:** "Type less. Orchestrate more."
- **Identity:** `bg-obsidian text-slate-200 antialiased`, `html class="dark"` — pure dark theme SPA.
- **Fonts:** Inter + Space Grotesk (300–700) — same pair as studio.
- **Concept:** AI workspace with 7 specialized agents, BYOK, open source — the "agent pipeline UI" (Schema Design → Design Tokens → Code Gen → Test Suite → Deploy Setup) with live SSE console and glowing progress is the signature interaction.
- **Stack visible:** Next.js (build artifact: `assets/index-*.js`), React, Vite-style client bundle, Google Fonts.
- **What to reuse in Hunter:** the multi-agent progress pipeline UI (6 agents in Hunter = same visual pattern), the streaming console, "orchestrate" mental model — Hunter literally orchestrates agents, so the UI speaks the same language.

---

## 3. Recent Projects — Portfolio DNA & Credits

| Project | Category | Stack | Design signal |
|---|---|---|---|
| **Signhify AI** (signhify-ai-web.vercel.app) | AI Workspace | Next.js, TanStack, Supabase, multi-provider AI | Agent pipeline UI, streaming console |
| **Veepee Engineers** (veepee-engineers.lovable.app) | Engineering brand | TanStack Start, Tailwind, Lovable | Cinematic industrial portfolio, confident typography |
| **GymFlow** (gymflow-saas.vercel.app) | SaaS | Next.js, Supabase, Stripe, Tailwind | Multi-tenant gym OS, cinematic dashboard |
| **AutoReels AI** (autoreels-ai.vercel.app) | AI automation | Python, ffmpeg, OpenAI, Whisper | Pipeline automation UI (Transcribe → Clip → Caption → Export) |
| **GigMind** (gigmind-gamma.vercel.app) | Marketplace | Next.js, Postgres, Vercel AI SDK | AI match-score badges, two-sided marketplace |
| **TuitionTrack** (tuitiontrack-app.vercel.app) | EdTech | React, Supabase, Resend | Ops dashboard, WhatsApp notifications, Resend email — **Resend is already a proven studio pattern → reuse for Hunter** |

**Portfolio-wide design recipe (from `Signhify_assets/ALL_PROJECT_IMAGE_PROMPTS.md`):** "Dark near-black background #0D0D14 · Electric orange #FF6B00 glow accents · Amber/gold #F59E0B highlights · Glassmorphism frosted-glass panels · Cinematic premium dark product screenshot · 16:9 · No watermarks" — applied to **every** project asset. Hunter inherits this recipe verbatim.

---

## 4. Hunter — Recommended Theme (derived)

- **Codename visual:** "HUNTER" = scout/radar metaphor. Radar-sweep motif in orange glow for loading/scanning states; target-lock animation on qualification; a "signal" pulse for live agent activity.
- **Dashboard = control room:** obsidian base, glass panels, orange glowing KPIs (matches GymFlow's glowing KPI cards), funnel bars with orange gradient, cinematic empty states.
- **Inbox = mission control:** suggestion cards glow amber when positive, red when risky; unread pulses orange.
- **Motion language:** slow cinematic transitions (studio standard), glow pulses on live indicators, streaming agent console (Signhify AI pattern).
- **Copy voice:** "Find them. Qualify them. Sign them." · "The studio's clients, found before they ask." · "Type less. Orchestrate more." family.

---

## 5. Credits & Attribution

**Product & code:**
- Signhify studio & all listed projects — built by **Piyush Raj Singh** (Founder, Signhify). LinkedIn: linkedin.com/in/piyushraj-singh · GitHub: github.com/Warriorlegacy · Email: Piyushrajsingh092@gmail.com · WhatsApp: +91 62024 42690
- Signhify is a registered MSME · Govt. of India (UDYAM)

**Framework & service credits (for Hunter docs/attribution page):**
- Frontend: React 19, TanStack Start, Tailwind CSS v4, shadcn/ui, Framer Motion
- Backend: Node/TypeScript, Supabase (Postgres, Auth, Realtime), Prisma, Upstash Redis, Resend
- AI: OpenAI (gpt-4o-mini), Anthropic (Claude Sonnet)
- Data/sourcing: Firecrawl, GitHub API, Hacker News Algolia API, Reddit JSON, Product Hunt API, Hunter.io/Apollo, SerpAPI
- Infra: Vercel, Cloudflare, Stripe, Axiom, Sentry
- Design/build tooling: Lovable (used on portfolio builds incl. Veepee Engineers)

**Asset credits (existing portfolio):**
- Project imagery generated via image-gen tools (ChatGPT Images) using Signhify's shared cinematic prompt recipe (`Signhify_assets/ALL_PROJECT_IMAGE_PROMPTS.md`); some stock assets sourced from stock marketplaces (e.g., iStock-style library files in `Signhify_assets/`).

---

## 6. Design Handoff for Builders

When implementing Hunter UI, open in this order:
1. `04_FRONTEND_PRD_TRD.md` — routes, components, acceptance criteria
2. This file §1–2 — the source-of-truth design system and signature patterns
3. `Signhify_assets/ALL_PROJECT_IMAGE_PROMPTS.md` — the shared asset-prompt recipe (reuse for Hunter screenshots/OG images)
4. Live references: signhify.dpdns.org (structure + tokens), signhify-ai-web.vercel.app (agent pipeline + console)
