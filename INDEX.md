# Signhify — Project Index

_Generated: 2026-07-27_

## Overview

**Signhify** is an AI-powered product studio platform. Users describe an idea and Signhify designs, engineers, markets, launches, and scales it end-to-end. Built with TanStack Start (SSR), React 19, Supabase, Stripe, Three.js, and Cloudflare Workers.

**Repository:** `github.com/Warriorlegacy/Signhify_Studio` (private)  
**Live:** `https://signhify.dpdns.org`  
**Founder:** Piyush Raj Singh

---

## Architecture

```
Browser → Cloudflare (DNS/CDN) → Nitro SSR (Node) → TanStack React Router → Supabase (DB/Auth)
                                                          ↕
                                                    Stripe (Billing)
                                                          ↕
                                                    Cloudflare API (Deploy)
                                                          ↕
                                                    AI Gateways (Lovable + BYOK)
```

### Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Framework  | TanStack React Start (SSR via Nitro)                |
| Build      | Vite 7 + `@lovable.dev/vite-tanstack-config`        |
| Language   | TypeScript 5.8, React 19                            |
| Styling    | Tailwind CSS v4, Radix UI, shadcn/ui, Framer Motion |
| 3D         | Three.js 0.184, React Three Fiber / Drei            |
| DB/Backend | Supabase (Postgres + Auth + Edge Functions)         |
| ORM        | Prisma (schema-only, maps to Supabase Postgres)     |
| Billing    | Stripe (Checkout, Portal, Webhooks, Subscriptions)  |
| Deploy     | Cloudflare Workers API                              |
| AI         | Lovable API gateway + BYOK custom endpoints         |
| Forms      | React Hook Form + Zod                               |
| Testing    | Playwright (E2E), Bun (unit)                        |
| Runtime    | Bun, Node (SSR)                                     |
| Monitoring | Sentry, Pino (logging)                              |

---

## Source Map

### `src/` — Main Application

#### Configuration Layer

| File                   | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `src/server.ts`        | SSR entrypoint — CSP headers, error normalization, Sentry capture |
| `src/router.tsx`       | TanStack Router factory with QueryClient                          |
| `src/routeTree.gen.ts` | Auto-generated route tree                                         |
| `src/start.ts`         | App bootstrap entry                                               |
| `src/styles.css`       | Global Tailwind + CSS variables                                   |
| `vite.config.ts`       | Vite config via Lovable preset                                    |
| `tsconfig.json`        | TypeScript config (`@/*` → `./src/*`)                             |

#### Routes (`src/routes/`)

**Public pages (22 routes):**
| File | Path | Purpose |
|------|------|---------|
| `__root.tsx` | `/` (layout) | Root shell, SEO meta, SiteHeader/Footer, QueryClient, Toaster |
| `index.tsx` | `/` | Home / landing page |
| `about.tsx` | `/about` | About Signhify |
| `ai.tsx` | `/ai` | AI section |
| `ai.share.$id.tsx` | `/ai/share/:id` | Shared AI result |
| `book.tsx` | `/book` | Booking |
| `builder.tsx` | `/builder` | Project builder |
| `confirm.tsx` | `/confirm` | Confirmation page |
| `contact.tsx` | `/contact` | Contact form |
| `help.tsx` | `/help` | Help center |
| `login.tsx` | `/login` | Authentication |
| `marketplace.tsx` | `/marketplace` | Template/asset marketplace |
| `marketplace.sell.tsx` | `/marketplace/sell` | Sell on marketplace |
| `marketplace.success.tsx` | `/marketplace/success` | Purchase success |
| `os.tsx` | `/os` | OS sub-platform |
| `pricing.tsx` | `/pricing` | Pricing plans |
| `privacy.tsx` | `/privacy` | Privacy policy |
| `projects.tsx` | `/projects` | Project portfolio |
| `projects.$slug.tsx` | `/projects/:slug` | Single project detail |
| `publish.tsx` | `/publish` | Publish flow |
| `roadmap.tsx` | `/roadmap` | Product roadmap |
| `services.tsx` | `/services` | Services listing |
| `sitemap[.]xml.ts` | `/sitemap.xml` | SEO sitemap |
| `sprint.tsx` | `/sprint` | Sprint info |
| `studio.spike.tsx` | `/studio/spike` | Studio prototype |
| `templates.tsx` | `/templates` | Templates gallery |
| `terms.tsx` | `/terms` | Terms of service |
| `vision.tsx` | `/vision` | Vision page |

**Authenticated app routes (`/app/`):**
| File | Path | Purpose |
|------|------|---------|
| `app/index.tsx` | `/app` | Dashboard |
| `app/settings.tsx` | `/app/settings` | User settings |
| `app/billing/index.tsx` | `/app/billing` | Billing & subscription |
| `app/deploy/index.tsx` | `/app/deploy` | Deploy projects |
| `app/marketplace/index.tsx` | `/app/marketplace` | App marketplace |
| `app/services/index.tsx` | `/app/services` | App services |
| `app/projects/new.tsx` | `/app/projects/new` | New project |
| `app/projects/$id.tsx` | `/app/projects/:id` | Project detail |
| `app/projects/$id.analytics.tsx` | `/app/projects/:id/analytics` | Project analytics |
| `app/projects/$id/runs/$runId.tsx` | `/app/projects/:id/runs/:runId` | Run detail |

**OS sub-platform routes (`/os/`):**
| File | Path | Purpose |
|------|------|---------|
| `os/index.tsx` | `/os` | OS dashboard |
| `os/logs.tsx` | `/os/logs` | System logs |
| `os/marketplace.tsx` | `/os/marketplace` | OS marketplace |
| `os/agents/index.tsx` | `/os/agents` | AI agents list |
| `os/agents/new.tsx` | `/os/agents/new` | Create agent |
| `os/workflows/index.tsx` | `/os/workflows` | Workflows list |
| `os/workflows/new.tsx` | `/os/workflows/new` | Create workflow |

**Scroll Studio (`/scroll-studio/`):**
| File | Path | Purpose |
|------|------|---------|
| `scroll-studio/index.tsx` | `/scroll-studio` | Scroll animation builder |

**API routes (`/api/`):**
| File | Path | Purpose |
|------|------|---------|
| `api/public/health.ts` | `/api/public/health` | Health check |
| `api/public/auth-provider.ts` | `/api/public/auth-provider` | Auth provider info |
| `api/stripe/webhook.ts` | `/api/stripe/webhook` | Stripe event webhook |
| `api/telemetry/event.ts` | `/api/telemetry/event` | Telemetry events |

#### Components (`src/components/`)

| Directory        | Files    | Purpose                                                                                                              |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `ui/`            | 47 files | shadcn/ui primitives (button, card, dialog, form, table, chart, etc.)                                                |
| `sections/`      | 9 files  | Landing page sections — Hero, Services, Projects, Process, CTA, Ecosystem, Founder, Marquee, ScrollStory             |
| `scroll-studio/` | 7 files  | Scroll Studio: ChatInterface, PreviewCanvas, Builder, SettingsPanel, Sidebar, TemplateGallery, CreditsDisplay        |
| `three/`         | 4 files  | 3D: CinematicHero3D, EmberField, Scene3D, ThreeDDevicePreview                                                        |
| `ai/`            | 1 file   | AiKeyQuickConfig                                                                                                     |
| `settings/`      | 1 file   | AiKeysPanel                                                                                                          |
| Root-level       | 8 files  | SiteHeader, SiteFooter, Breadcrumbs, ComingSoonScene, EcosystemSwitcher, EmberParticles, HeroBackground, WhatsAppFab |

#### Library (`src/lib/`)

**AI Services:**

- `ai-gateway.server.ts` — AI gateway (Lovable proxy)
- `ai-access.server.ts` — AI access control
- `ai-generate.functions.ts` — AI generation functions
- `ai-generate-stream.functions.ts` — Streaming AI generation
- `ai-with-usage.service.ts` — AI with usage tracking
- `robust-ai-service.ts` — Resilient AI service with retry
- `user-ai-keys.functions.ts` — BYOK user key management
- `validate-and-enhance.functions.ts` — Prompt validation/enhancement
- `video-generation.functions.ts` — AI video generation

**Stripe/Billing:**

- `stripe-checkout.functions.ts` — Checkout session creation
- `stripe-portal.functions.ts` — Customer portal
- `stripe-prices.server.ts` — Price fetching
- `stripe-subscribe.functions.ts` — Subscription management
- `monetization.functions.ts` — Monetization logic
- `manual-payments.functions.ts` — Manual payment processing

**Projects:**

- `projects.ts` — Project types/queries
- `projects.server.ts` — Server-side project logic
- `projects.functions.ts` — Project CRUD functions
- `projects-list.functions.ts` — Project listing
- `runs.functions.ts` — Run-tracking functions

**Marketplace:**

- `marketplace.ts` — Marketplace types/queries
- `marketplace.server.ts` — Server-side marketplace
- `marketplace-listings.functions.ts` — Listing CRUD
- `marketplace-download.functions.ts` — Asset downloads
- `marketplace-creator.functions.ts` — Creator onboarding

**Cloudflare:**

- `cloudflare.server.ts` — Cloudflare API client
- `cloudflare-deploy.service.ts` — Deploy to Cloudflare Workers
- `cloudflare-domains.functions.ts` — Custom domain management

**Auth/Security:**

- `auth-guard.server.ts` — Auth middleware
- `secrets.functions.ts` — Secret management
- `secrets.server.ts` — Server-side secrets

**Studio:**

- `studio.server.ts` — Server-side studio logic
- `studio.functions.ts` — Studio functions
- `studio-export.functions.ts` — Studio export

**Scroll Studio:**

- `scroll-studio.functions.ts` — Scroll Studio CRUD
- `scroll-studio-projects.functions.ts` — Project management

**Build/Deploy:**

- `build-and-deploy.functions.ts` — Build + deploy pipeline
- `build-full-stack.functions.ts` — Full-stack build
- `build-product.functions.ts` — Product build
- `publish-checks.functions.ts` — Pre-publish validation

**Infrastructure:**

- `config.server.ts` — Server config
- `logger.ts` — Pino logger
- `sentry.server.ts` — Sentry capture
- `rate-limit.server.ts` — Rate limiting
- `error-capture.ts` — Global error capture
- `error-page.ts` — Error page renderer
- `site-url.ts` — Site URL utilities
- `utils.ts` — `cn()` helper (clsx + tailwind-merge)

**Other:**

- `waitlist.functions.ts`, `creator-waitlist.functions.ts`, `leads.functions.ts`, `leads-schema.ts` — Lead gen
- `analytics.functions.ts`, `telemetry.functions.ts` — Analytics/telemetry
- `github.functions.ts` — GitHub integration
- `browser-use.service.ts` — Browser automation service
- `client-video-extractor.ts` — Client-side video extraction
- `export.functions.ts` — Export utilities
- `ecosystem.ts`, `os-state.ts` — Ecosystem/OS state
- `admin.ts` — Admin utilities
- `sprint-checklist.ts` — Sprint checklist
- `product-validation.service.ts` — Product validation
- `lovable-error-reporting.ts` — Lovable error reporting
- `content/index.ts` — Site content
- `api/example.functions.ts` — API example

#### Hooks (`src/hooks/`)

| File                         | Purpose                        |
| ---------------------------- | ------------------------------ |
| `useUser.ts`                 | Current user state             |
| `use-mobile.tsx`             | Mobile/responsive detection    |
| `use-reduced-motion-pref.ts` | Accessibility — reduced motion |
| `use-spotlight.ts`           | Mouse spotlight/follow effect  |

#### Integrations (`src/integrations/`)

| File                          | Purpose                   |
| ----------------------------- | ------------------------- |
| `supabase/client.ts`          | Browser Supabase client   |
| `supabase/client.server.ts`   | Server Supabase client    |
| `supabase/auth-attacher.ts`   | Auth token attacher       |
| `supabase/auth-middleware.ts` | Auth middleware           |
| `supabase/types.ts`           | Supabase type definitions |

---

### `supabase/` — Database & Edge Functions

**Edge Functions (4):**
| Function | Purpose |
|----------|---------|
| `generate-plan` | AI plan generation |
| `log-pageview` | Page view analytics |
| `run-agent` | Agent execution |
| `send-waitlist-email` | Waitlist email notifications |

**Migrations (38 files):** Covering rate limits, projects, marketplace, creator waitlist, runs, artifacts, analytics, secrets, profiles, AI sessions, scroll studio, builder projects, BYOK, custom endpoints, manual payments, waitlist confirmation, run errors.

### `prisma/` — Prisma Schema

- `schema.prisma` — Single file, maps to Supabase Postgres. Client output at `src/generated/prisma`.

### `tests/` — Tests

- `tests/unit/byok-encryption.test.ts` — Unit tests for BYOK encryption (via `bun test`)
- Playwright E2E config at `playwright.config.ts`

---

## Key Domains

### 1. Scroll Studio (Core Product)

No-code scroll-driven animation builder. Users create animated scroll stories via:

- AI chat interface for description-based generation
- Template gallery
- Preview canvas (real-time)
- Settings panel
- Credits/usage system

### 2. OS Sub-platform

A second internal platform with:

- Agent management (create, list, run)
- Workflow management (create, list)
- System logs viewer
- Internal marketplace

### 3. BYOK (Bring Your Own Key)

Users can configure their own AI API keys instead of using the platform's default AI gateway. Includes encryption for key storage.

### 4. Marketplace

Template and asset marketplace with:

- Listing management
- Purchase/download flow
- Creator onboarding
- Credit-based monetization

### 5. Billing & Monetization

Stripe-powered billing with:

- Subscription plans (Studio, Scale tiers)
- Credit packs
- Customer portal
- Webhook processing
- Manual payment support

### 6. Project Builder & Deploy

End-to-end pipeline: create a project → build (full-stack or product) → deploy to Cloudflare Workers → custom domain.

---

## Environment Variables

See `.env.example` for all required vars: Supabase URL/keys, Stripe keys, Cloudflare token, site URL, secrets master key, Lovable API key.

---

## Scripts

| Command             | Purpose           |
| ------------------- | ----------------- |
| `bun run dev`       | Dev server (Vite) |
| `bun run build`     | Production build  |
| `bun run preview`   | Preview build     |
| `bun run lint`      | ESLint            |
| `bun run format`    | Prettier          |
| `bun run test:unit` | Unit tests        |
| `bun run guide:pdf` | Build guide PDF   |

---

## Domain Model (Key Tables — from migrations)

- `profiles` → User profiles with soft delete
- `projects` → User projects
- `runs` → Project execution runs
- `artifacts` → Build/deploy artifacts
- `analytics` → Usage analytics
- `project_secrets` → Encrypted secrets per project
- `rate_limits` → Rate limit config
- `marketplace_listings` → Marketplace items
- `creator_waitlist` → Creator signups
- `ai_sessions` → AI chat sessions
- `scroll_studio_projects` → Scroll Studio projects
- `builder_projects` → Builder projects
- `waitlist_confirmation` → Waitlist confirmations
- `run_errors` → Error tracking for runs
- `user_ai_keys` → BYOK encryption keys
