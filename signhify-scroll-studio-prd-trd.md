# Signhify Scroll Studio – PRD & TRD

> Working spec to build a Draftly‑class cinematic scroll‑site builder under the Signhify brand. Structure: concise Product Requirements Document (PRD), followed by Technical Requirements Document (TRD), plus a short cinematic UI appendix.

---

## 1. Product Requirements Document (PRD)

### 1.1 Product Vision

Build an AI‑powered cinematic scroll‑site creator that lets non‑technical users generate, edit, and export production‑ready, 3D‑feeling websites from natural‑language prompts and simple visual controls – compressing time‑to‑launch from weeks to minutes.

The product sits alongside the Signhify studio offering:

- **Studio:** high‑touch, done‑for‑you builds.
- **Scroll Studio (this product):** self‑serve cinematic website builder.

### 1.2 Business Objectives (Year 1)

1. Acquire ≥10,000 free users within 6 months of launch.
2. Achieve ≥5% free‑to‑paid conversion within 30 days of first export.
3. Maintain ≥80% monthly active rate among users with at least one deployed site.
4. Launch a community template marketplace by Month 12.

### 1.3 Target Users & Personas (Summary)

**Primary persona – Freelance / agency web designer**

- Needs cinematic motion and premium visuals without deep WebGL / 3D expertise.
- Wants to move faster than manual After Effects → Web motion pipelines.

**Secondary persona – Startup founder / indie hacker**

- Needs investor‑grade landing pages quickly.
- Prefers prompt‑driven flows and simple visual tweaks.

**Tertiary persona – Marketing / growth lead**

- Runs many campaigns, cannot wait for engineering backlog.
- Needs on‑brand but visually varied landings.

### 1.4 Scope (V1) & Out of Scope

**In scope (V1)**

- Single‑page, scroll‑driven sites (hero → features → narrative → CTA).
- Frame‑based cinematic animations (no runtime WebGL required in exported sites).
- Prompt‑to‑site generation (text prompt → working preview).
- Preset template gallery.
- Chat‑based content and style editing.
- Static export (HTML/CSS/JS + frames) and optional 1‑click deploy to Vercel/Netlify.

**Out of scope (V1)**

- Full CMS integration (WordPress, headless CMS, etc.).
- E‑commerce flows (cart, checkout, inventory).
- Real‑time multi‑user collaboration.
- Native mobile app exports.
- Arbitrary multi‑page sites; focus on cinematic landings.

### 1.5 User Stories & Acceptance Criteria (Condensed)

#### Epic 1 – Prompt‑to‑Site Generation

**US‑1.1 Prompt input**  
As a user, I describe my desired website in natural language so that the system can generate a cinematic landing page.

- Prompt input accepts ~50–500 characters.
- Initial preview appears within 60 seconds.
- Generated site includes at least hero, feature and CTA sections.

**US‑1.2 Template gallery**  
As a user, I choose from preset templates to start from a proven design.

- Gallery lists ≥7 templates with live previews (scroll behavior visible).
- Templates have tags (industry, style) and filters.
- Selecting a template creates a new project pre‑filled with content.

**US‑1.3 Scroll preview**  
As a user, I want a scroll preview that matches exported behavior.

- Scroll‑linked preview updates within 3 seconds after changes.
- Mobile device viewport toggle is available.
- Preview includes loading/progress indicator for frames.

#### Epic 2 – Chat‑Based Editing

**US‑2.1 Content edits via chat**  
As a user, I modify copy and basic styling with chat commands instead of editing code.

- Supports commands like “change hero headline to…”, “make background darker”.
- AI keeps context over ≥10 turns per project.
- Visual changes apply in ≤10 seconds.
- Undo/redo is available for each AI change.

**US‑2.2 Media swap**  
As a user, I swap images/videos while preserving layout and motion.

- Drag‑and‑drop upload for JPG/PNG/WebP/MP4 up to ~50 MB.
- System auto‑crops / scales to fit expected aspect ratios.
- Builder shows clear error states for failures.

#### Epic 3 – Cinematic Scroll Animation

**US‑3.1 AI video generation**  
As a user, I generate cinematic scroll segments from text/image prompts.

- Each job produces ~6–8 seconds of video.
- Jobs complete (video ready) in ~2–5 minutes under normal load.
- The system extracts ~200–400 compressed frames per segment.

**US‑3.2 Multi‑segment scrolls**  
As a user, I chain segments to build a longer scroll narrative.

- Up to 5 segments per project.
- Segment transitions are blended smoothly.
- Total animation size kept under ~20–25 MB via compression.

#### Epic 4 – Export & Deploy

**US‑4.1 Static export**  
As a user, I download production‑ready code to host on my own stack.

- ZIP contains index.html, styles.css, script.js, and /frames directory.
- Bundle size ≤25 MB; assets are optimized.
- README includes simple deployment instructions.

**US‑4.2 One‑click deploy**  
As a user, I deploy directly to Vercel/Netlify without manual setup.

- OAuth to link Vercel/Netlify.
- Custom domain mapping supported (where host allows).
- SSL auto‑provisioned; typical deploy <60 seconds.

### 1.6 Non‑Functional Requirements (NFRs)

**Performance**

- Builder: TTI <3 s on a typical 3G/4G connection.
- Generated sites: LCP ≤1.5–2.0 s on broadband; 60 fps scroll on desktop, ≥30 fps on mid‑range mobile.
- Frame bundles per site ≤20–25 MB; initial viewport loads a subset first.

**Scalability**

- Support ≥10,000 concurrent builder sessions.
- Support ≥1,000 concurrent video generation jobs via queueing.

**Security & Privacy**

- TLS 1.3, hardened HTTP security headers.
- JWT auth, OAuth providers, and role‑based access control (free, pro, enterprise, admin).
- PII and AI API keys encrypted at rest.
- Rate‑limiting on user and IP level.
- GDPR‑compatible data retention and deletion.

**Reliability & Availability**

- Target ≥99.9% uptime for app and APIs.
- Video job success rate ≥95%.
- Automated backups with RPO <1 h, RTO <4 h.

**Accessibility**

- Builder and generated sites meet WCAG 2.1 AA where practical.
- Keyboard navigation and visible focus states across controls.

---

## 2. Technical Requirements Document (TRD)

### 2.1 Architecture Overview

High‑level pattern: modular monolith + worker pool; can evolve into microservices later.

**Logical components**

- **Web app (Next.js)** – marketing site, authenticated builder UI, dashboard, account settings.
- **API gateway** – REST + WebSocket layer for auth, projects, chat, jobs, exports.
- **AI orchestrator** – wraps LLMs for code generation and chat editing.
- **Video generation service** – wraps providers like Runway/Kling/Sora; handles polling, errors, and cost tracking.
- **Frame processor** – FFmpeg + Sharp for extracting, resizing, and compressing frames.
- **Data layer** – PostgreSQL for relational data, object storage for videos/frames/ZIPs, Redis for cache and queues.
- **Worker pool** – background workers for heavy jobs (video, frames, exports, deployments).

### 2.2 Recommended Tech Stack

**Frontend**

- Next.js 15 App Router + React 19 + TypeScript.
- Tailwind CSS v4 for styling; design system wired via tokens.
- shadcn/ui + Radix primitives for accessible components.
- Zustand for local UI state, TanStack Query for async/server state.
- Framer Motion for page/section transitions and subtle parallax.
- Canvas 2D API or Three.js (for illustrative hero scenes only).

**Backend**

- Node.js 20 LTS.
- Express.js (or Next.js route handlers) for REST APIs.
- Prisma ORM targeting PostgreSQL 16.
- Auth.js / NextAuth for OAuth and email.
- Redis 7 + BullMQ for queues (video_jobs, frame_jobs, export_jobs).
- S3‑compatible storage (AWS S3, R2, Supabase storage) for videos, frames, and exports.
- LLMs: Anthropic Claude Sonnet as primary, OpenAI GPT‑4 as fallback.
- Video providers: Runway Gen‑3 Turbo primary, Kling Pro as optional.
- Sharp for image/frame optimization.

**DevOps & Observability**

- Hosting: Vercel (frontend + light APIs) + AWS ECS / Railway for workers.
- CI/CD: GitHub Actions (tests, lint, build, deploy).
- Monitoring: Datadog / New Relic; Sentry for error tracking.
- Logging: structured logs shipped to ELK or managed logging.

### 2.3 Data Model (Conceptual Schema)

Tables are illustrative; adapt names/columns as needed.

**users**

- id (UUID, PK)
- email (unique), name
- password_hash (nullable for OAuth‑only)
- subscription_tier (enum: free, pro, enterprise)
- subscription_expires_at
- monthly_credits, credits_reset_at
- created_at, updated_at, deleted_at

**api_keys** (optional for user‑provided AI keys)

- id (UUID, PK)
- user_id (FK → users)
- provider (enum: openai, anthropic, runway, etc.)
- encrypted_key (AES‑256)
- label, is_active, last_used_at

**templates**

- id (UUID, PK)
- name, slug, description
- category (SaaS, ecommerce, portfolio, AI, etc.)
- tags (string array)
- preview_url, thumbnail_url
- base_html, base_css, base_js
- system_prompt (LLM instructions to preserve style)
- metadata (JSON: colors, fonts, sections, motion tokens)
- is_public, is_featured
- created_by (FK → users, nullable), created_at, updated_at

**projects**

- id (UUID, PK)
- user_id (FK → users)
- template_id (FK → templates)
- title, slug (optional public URL slug)
- initial_prompt (text)
- current_html, current_css, current_js (text)
- conversation_history (JSONB) – chat transcript
- video_urls (text[])
- frame_metadata (JSONB – total_frames, fps, resolution, total_size)
- settings (JSONB – fps, quality presets, etc.)
- status (enum: draft, processing, completed, published)
- published_url (if deployed)
- view_count (int)
- created_at, updated_at, deleted_at

**chat_messages**

- id (UUID, PK)
- project_id (FK → projects)
- role (user/assistant/system)
- content (text)
- code_changes (JSONB – patches applied)
- attachments (text[] – asset URLs)
- created_at

**video_jobs**

- id (UUID, PK)
- project_id (FK → projects)
- user_id (FK → users)
- provider (runway, kling, etc.)
- model (text)
- input_type (text / image_to_video)
- input_image_url (nullable)
- duration_seconds (int)
- aspect_ratio (string, default 16:9)
- status (queued/processing/completed/failed)
- external_job_id (provider job reference)
- video_url (output URL)
- frame_count, processing_time_ms, cost_usd, error_message
- retry_count
- created_at, started_at, completed_at

**frames**

- id (UUID, PK)
- video_job_id (FK → video_jobs)
- project_id (FK → projects)
- frame_index (int)
- cdn_url (text)
- width, height, file_size_bytes
- created_at

**exports**

- id (UUID, PK)
- project_id (FK → projects)
- export_type (frontend/fullstack)
- cdn_url (download URL)
- file_size_mb (numeric)
- expires_at
- download_count
- created_at

**deployments**

- id (UUID, PK)
- project_id (FK → projects)
- provider (vercel/netlify)
- deployment_url (text)
- custom_domain (text)
- status (deploying/ready/failed)
- external_deployment_id (provider id)
- logs (text)
- created_at, completed_at

**usage_events**

- id (UUID, PK)
- user_id (FK → users)
- project_id (FK → projects)
- event_type (project_created, video_generated, frames_extracted, export_downloaded, deployed, etc.)
- metadata (JSONB)
- created_at

### 2.4 API Surface (Conceptual)

Use REST with a consistent envelope:

```json
{
  "success": true,
  "data": {
    /* payload */
  },
  "meta": {
    "request_id": "...",
    "rate_limit": { "remaining": 58, "reset_at": "..." }
  },
  "error": null
}
```

**Auth & users**

- POST /api/auth/signup – create account.
- POST /api/auth/login – login.
- POST /api/auth/oauth/:provider – OAuth callback.
- GET /api/users/me – current profile.
- PATCH /api/users/me – update profile.
- GET /api/users/me/credits – remaining credits.

**Projects**

- POST /api/projects – create from prompt or template.
- GET /api/projects – list (paginated).
- GET /api/projects/:id – get details + current code.
- PATCH /api/projects/:id – update metadata.
- DELETE /api/projects/:id – soft delete.
- POST /api/projects/:id/duplicate – clone.

**Chat editing**

- POST /api/projects/:id/chat – send message.
- GET /api/projects/:id/chat – get history.
- POST /api/projects/:id/chat/apply – apply AI‑suggested change.
- POST /api/projects/:id/chat/undo – undo last.

**Video generation & frames**

- POST /api/videos/generate – create video job { project_id, prompt, model, duration, ratio }.
- GET /api/videos/:job_id/status – poll.
- GET /api/videos/:job_id/result – get output URL.
- POST /api/videos/:job_id/extract – trigger frame extraction.
- GET /api/projects/:id/frames – list frame URLs.
- POST /api/projects/:id/frames/optimize – reprocess (compression changes).

**Templates**

- GET /api/templates – list public templates.
- GET /api/templates/:id – get details.
- POST /api/templates/:id/fork – create project from template.

**Export & deploy**

- POST /api/projects/:id/export – generate ZIP; returns download URL + expiry.
- GET /api/projects/:id/deploy/status – check deployment.
- POST /api/projects/:id/deploy – trigger deploy { provider, custom_domain? }.

**Realtime (WebSocket)**

- WS /ws/projects/:id – subscribe to events:
  - section_code_update
  - video_progress
  - frames_ready
  - chat_message

### 2.5 Security & Compliance

- Short‑lived JWTs (~15 min) with refresh tokens (~7 days).
- OAuth scopes limited to email/profile where possible.
- PII and API keys encrypted at rest via KMS / equivalent.
- Parameterized queries everywhere via Prisma.
- XSS and CSRF protections (same‑site cookies, CSRF tokens on mutations).
- File upload scanning, strict MIME type validation, max size limits (~50 MB).
- Network isolation (private subnets for DB, public for load balancers only).
- Centralized logging, anomaly alerts, rate‑limit alerts.

### 2.6 Performance Optimization Notes

- Code splitting for chat interface, gallery, heavy components.
- Use Next.js Image (or similar) with WebP/AVIF + lazy loading.
- Batch frame loading (e.g. 20 at a time) to stay under browser connection limits.
- Use Service Worker + IndexedDB or Cache Storage for offline frame caching where appropriate.

---

## 3. Appendix – Cinematic 3D Immersive UI Brief (High Level)

This appendix summarizes the desired cinematic website / UI behavior for Signhify Scroll Studio.

**Tone & art direction**

- Mood: “Hands in Motion. Voices in Light.” – deep, atmospheric backgrounds, luminous teal accents, warm ember highlights, subtle violet AI cues.
- Typography: geometric display font for big headings, clean grotesk for body.
- Logo: simple geometric S‑mark that can glow in hero scenes.

**Narrative scenes (conceptual)**

1. **Hero – The Void Awakens**: single glowing hand mid‑gesture in volumetric light; camera slowly pushes in; overlay headline and CTAs.
2. **Gesture Decoded**: orbiting camera reveals labeled joints and AI confidence overlays.
3. **Language Bridge**: particle stream from signing figure to floating text bubbles (translation visual).
4. **Scroll Gallery**: circular carousel of screens showing templates and real builds.
5. **Launch Trajectory**: zoomed‑out orbit view of Signhify ecosystem with Scroll Studio highlighted.

**Interaction principles**

- Single scroll axis driving a normalized progress variable used to control camera paths, opacity bands, and parallax.
- Mouse/touch for subtle parallax and tap‑to‑expand panels.
- Respect `prefers-reduced-motion`: fall back to static hero + gentle fades.

This file is intended to live in the repo as the canonical PRD/TRD for Signhify Scroll Studio, with the appendix guiding cinematic UI and front‑of‑site design.
