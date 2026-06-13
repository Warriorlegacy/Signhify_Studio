# Signhify vs Draftly: Reverse-Engineered PRD, TRD, Gap Analysis, Roadmap, and Cinematic UI Prompt

## 1. Ethical Reverse‑Engineering Plan

### 1.1 Objectives

This document outlines an ethical approach to studying Draftly (draftly.space) as a public product, then defines Product and Technical Requirements for building a comparable platform under the Signhify umbrella, followed by a gap analysis against the current Signhify project (signhify.lovable.app). The goal is to understand Draftly’s capabilities and patterns without copying proprietary code or protected assets.[^1][^2][^3]

### 1.2 Allowed Analysis Methods

Permitted activities focus on publicly exposed behavior and metadata rather than internal implementation details.[^4][^1]

- Public interface analysis of landing pages, features, pricing, builder UI and docs.
- Network inspection via browser DevTools limited to:
  - Endpoint names, HTTP verbs, and high‑level payload shapes.
  - Latency ranges and rate‑limit behavior.
  - No storage or redistribution of proprietary response bodies.
- Technology detection using Wappalyzer/BuiltWith, response headers, and HTML.
- Feature documentation via screenshots and written notes on workflows and state machines.
- Pattern recognition of scroll animation, frame‑based playback, loading strategies, and editing flows.[^2][^3][^1]
- Architecture inference based on URL structures, documented behavior, and your own reverse‑engineered diagrams and ERDs.[^1]
- Competitive research on related tools (Framer, Webflow, Spline, Vercel, Lovable, etc.).[^5][^6]

### 1.3 Prohibited Activities

To remain compliant with copyright and fair‑use norms, certain techniques must be avoided.[^4][^1]

- Decompiling, beautifying, or reverse‑engineering minified/compiled JavaScript bundles.
- Scraping or bulk‑downloading Draftly’s images, videos, frame sequences, or template assets.
- Attempting to bypass authentication, paywalls, or private admin endpoints.
- Copying layout, wording, or code verbatim from Draftly into Signhify products.
- Extracting or de‑obfuscating proprietary AI models or weights.

---

## 2. Reverse‑Engineered View of Draftly

### 2.1 Product Concept

Draftly is positioned as an **AI‑powered 3D website builder** focused on cinematic, scroll‑driven sites rather than generic no‑code page builders. It takes a natural‑language prompt describing the desired site, generates AI video clips, extracts frames, and uses a frame‑based canvas renderer to deliver smooth scroll‑synced animations without requiring WebGL in the end product.[^3][^2][^1]

### 2.2 Core Features (Inferred)

Based on the public site and your reverse‑engineering PDF, Draftly’s main capabilities can be summarized as follows.[^2][^3][^1]

1. **AI‑Powered Website Generation**
   - Input: natural‑language prompt describing layout, tone, and sections.
   - Processing: LLM interprets prompt, generates HTML/CSS/JS skeleton and AI video instructions.
   - Output: production‑ready cinematic landing page with hero, feature blocks, and CTA.

2. **Preset Template Gallery**
   - A catalog of scroll‑reactive templates spanning SaaS, AI tools, e‑commerce, travel, etc.
   - Each template has brand‑specific design systems (type, color, spacing) and pre‑configured scroll motions.

3. **AI Video → Scroll Animation Pipeline**
   - AI model (e.g., Runway or Kling) generates 6–8 second transition clips from a text or image prompt.[^1]
   - FFmpeg extracts ~200–400 WebP frames per clip for 30–50 fps playback.[^1]
   - A JavaScript canvas renderer draws frames based on normalized scroll position, enabling buttery scroll‑locked motion at 60 fps on desktop.

4. **Iterative Chat Editor**
   - Chat interface for live content and style editing (“make hero darker”, “change CTA text”).
   - Maintains multi‑turn context and tracks code changes, similar to v0.dev or Lovable’s chat editing.[^6][^7][^1]

5. **Multi‑Video Continuation**
   - Ability to chain multiple 8‑second sequences into longer scroll journeys (e.g., up to 40 seconds total).[^1]

6. **Production Export**
   - Export as optimized HTML/CSS/JS + frames ZIP, optionally with an Express.js backend starter.
   - FPS and quality sliders to balance performance and smoothness.

### 2.3 Technical Architecture (Inferred)

Your attached guide sketches a layered architecture for a Draftly‑class product.[^1]

- **Frontend (Next.js)**
  - Chat interface, template gallery, builder canvas, live code editor.
  - SSR for landing pages and builder shell.
- **API Gateway (Node/Express)**
  - Auth, rate‑limiting, routing to core services, REST and WebSocket interfaces.
- **Core Services**
  - AI code generator (Claude/GPT‑4) for HTML/CSS/JS.
  - Video generation wrapper (Runway/Kling/Sora).
  - Frame processor (FFmpeg) and asset optimizer (Sharp/ImageMagick) for WebP extraction and resize/compress.
- **Data Layer**
  - PostgreSQL for users, projects, templates, jobs, exports, usage events.
  - Object storage (S3‑like) for videos, frames, ZIPs.
  - Redis cache for sessions, rate‑limits, and queues.
- **CDN Layer**
  - CloudFront‑style CDN for global frame delivery with low latency.

The PDF also contains an ERD, detailed table schemas, and endpoint sketches that can be treated as a reference architecture when building a similar platform, without copying implementation details.[^1]

---

## 3. PRD: “Signhify Scroll Studio” (Draftly‑Class Product)

### 3.1 Product Vision & Objectives

**Vision**  
Build an AI‑powered cinematic scroll‑site creator that lets non‑technical users generate, edit, and export production‑ready 3D‑feeling websites from natural‑language prompts and simple visual controls, compressing time‑to‑launch from weeks to minutes.[^3][^2][^1]

**Business Objectives (Year 1)**

- Reach ≥10,000 free users within 6 months.
- Achieve ≥5% free‑to‑paid conversion within 30 days of first export.
- Maintain ≥80% monthly active usage for projects with at least one deployed site.
- Launch a community template marketplace by Month 12.

### 3.2 Target Users & Personas (Summary)

Adapted from the Draftly spec to your context.[^1]

- **Freelance/agency web designers**
  - Need impressive sites with cinematic motion but lack deep WebGL or 3D expertise.
  - Want to reduce time spent on hand‑coding complex animations.

- **Startup founders / indie hackers**
  - Need investor‑grade landing pages quickly, cannot justify agency prices.
  - Prefer a prompt‑driven flow with some visual editing.

- **Marketing / growth teams**
  - Run frequent campaigns, cannot wait for dev backlog.
  - Need brand‑consistent but visually differentiated landing pages.

### 3.3 Scope & Out‑of‑Scope (V1)

**In scope (V1)**

- Single‑page, scroll‑driven sites (hero → features → narrative → CTA).
- Frame‑based cinematic animations (no runtime WebGL required).
- Natural‑language prompt to initial site.
- Preset template gallery.
- Chat‑based content and style editing.
- Static export (HTML/CSS/JS + frames) and optional 1‑click deploy to Vercel/Netlify.

**Out of scope (V1)**

- Full CMS integration (WordPress/Contentful/headless CMS connectors).
- E‑commerce (cart, checkout, inventory).
- Real‑time multi‑user collaboration.
- Native mobile app exports.
- Arbitrary multi‑page sites beyond scroll‑narrative landings.[^1]

### 3.4 Epics, User Stories & Acceptance Criteria (Condensed)

#### Epic 1: Prompt‑to‑Site Generation

- **US‑1.1:** As a user, I describe my desired website in natural language so that the system generates a tailored cinematic landing page.
  - Prompt accepts ~50–500 characters.
  - Initial preview appears within ~60 seconds.
  - Generated site includes at least a hero, features, and CTA sections.[^1]

- **US‑1.2:** As a user, I can choose from preset templates for a proven starting point.
  - Gallery lists ≥7 templates with live previews and metadata.
  - Templates are filterable by industry and style.[^1]

- **US‑1.3:** As a user, I see a real‑time scroll preview that matches exported behavior exactly.
  - Preview updates within ~3 seconds of changes.
  - Mobile device emulation and frame loading progress indicator are available.[^1]

#### Epic 2: Iterative Chat Editing

- **US‑2.1:** As a user, I can edit content via chat commands instead of manually editing code.
  - Supports commands like “change hero headline to…” or “make background darker”.
  - AI maintains multi‑turn context (≥10 messages).
  - Changes apply in ≤10 seconds with undo/redo support.[^1]

- **US‑2.2:** As a user, I can swap images/videos while preserving design integrity.
  - Drag‑and‑drop upload of JPG/PNG/WebP/MP4 up to ~50 MB.
  - AI auto‑crops and adjusts aspect ratio to fit the layout.[^1]

#### Epic 3: Cinematic Scroll Animation

- **US‑3.1:** As a user, I can trigger AI video generation for cinematic scroll segments.
  - Text/image prompts create ~8 second video clips.
  - Processing completes in ~2–5 minutes.
  - Extracted frames total <20 MB via compression and resolution control.[^1]

- **US‑3.2:** As a user, I can chain multiple segments for longer scroll experiences.
  - Support up to ~5 segments (≈40 seconds total).
  - Transitions blend smoothly at boundaries.[^1]

#### Epic 4: Export & Deploy

- **US‑4.1:** As a user, I download production‑ready code for self‑hosting.
  - ZIP includes index.html, styles.css, script.js, and /frames directory.
  - Bundle size ≤25 MB and code is minified.

- **US‑4.2:** As a user, I can deploy in one click to supported hosts.
  - OAuth integration with Vercel/Netlify.
  - SSL auto‑provisioned, deployment completes in ≤60 seconds.[^1]

### 3.5 Non‑Functional Requirements (Highlights)

- **Performance**: builder load <3 seconds TTI on 3G; exported sites achieve 60 fps scroll on desktop and ~30 fps on mobile.[^2][^3][^1]
- **Scalability**: support at least 10,000 concurrent builder sessions and 1,000 simultaneous video jobs with acceptable queue delays.[^1]
- **Security**: AES‑256 at rest, TLS 1.3 in transit, JWT auth, rate‑limiting, encrypted AI API keys, GDPR‑compatible data policies.[^3][^1]
- **Reliability**: ≥99.9% uptime, video generation success >95%, regular backups and disaster recovery (RTO <4 h, RPO <1 h).[^1]
- **Accessibility**: WCAG 2.1 AA for builder and generated sites; keyboard navigation and ARIA labeling where needed.[^1]

### 3.6 Conceptual Data Model (ERD‑Level)

Entities adapted from the Draftly ERD but suitable as an independent design.[^1]

- **users** – accounts, auth provider data, subscription tier, API key vault and credit counters.
- **templates** – base HTML/CSS/JS, preview media, metadata (category, tags, style tokens).
- **projects** – user‑specific instances: title, initial prompt, current code, frame metadata, status.
- **video_jobs** – AI video generation jobs with provider, model, status, outputs, costs.
- **frames** – extracted frames linked to jobs and projects: index, URLs, dimensions.
- **exports** – downloadable ZIPs: type, S3 URL, expiry, download counts.
- **deployments** – Vercel/Netlify deployment attempts and resulting URLs.
- **usage_events** – analytics for behavior and billing.

---

## 4. TRD: Technical Requirements for Signhify Scroll Studio

### 4.1 Architecture Overview

The recommended architecture largely mirrors the reference design in the Draftly guide while allowing an MVP to start as a modular monolith plus workers.[^1]

**Core components**

- **Next.js Web App** – SSR marketing site, authenticated builder, gallery, account pages.
- **API Gateway** – Node.js/Express or Next.js route handlers providing REST and WebSocket APIs.
- **AI Orchestrator** – Service for LLM interactions (Claude, GPT‑4) and prompt engineering.
- **Video Generation Service** – Wraps Runway/Kling/Sora APIs, handles polling and error states.
- **Frame Processor** – FFmpeg and Sharp to extract, transcode and compress frames.[^1]
- **Data Layer** – PostgreSQL for relational data; S3‑style storage for large assets; Redis for sessions, cache and job queues.[^1]
- **Worker Pool** – Background workers that process jobs (video, frames, exports, deployments).[^1]

### 4.2 Technology Stack

**Frontend**[^6][^1]

- Next.js 15 App Router + React 19 + TypeScript.
- Tailwind CSS v4 for styling.
- shadcn/ui + Radix UI primitives for accessible components.
- Zustand + TanStack Query for state management.
- Framer Motion for DOM animation; Canvas 2D API for frame playback.

**Backend & Services**[^1]

- Node 20 LTS + Express.js for core API.
- Prisma ORM for PostgreSQL 16.
- NextAuth/Auth.js for OAuth + email.
- BullMQ + Redis 7 (ElastiCache) for distributed job processing.
- AWS S3 (or equivalent) for storing videos, frames, and ZIPs.
- LLMs: Anthropic Claude Sonnet 4.0 primary, GPT‑4 fallback.
- Video providers: Runway Gen‑3 Turbo, Kling Pro as alternate.
- Image and frame optimization: Sharp in Node.

**Hosting & DevOps**[^3][^1]

- Frontend and light APIs: Vercel or AWS ECS Fargate.
- Heavy worker pool: ECS or Railway containers with GPU‑enabled nodes if necessary.
- CI/CD: GitHub Actions + AWS CodeDeploy or Vercel pipelines.
- Monitoring: Datadog/New Relic; Sentry for errors; structured logging shipped to ELK.

### 4.3 Deployment & Scalability

- Use CDN (CloudFront or Vercel Edge) in front of static assets and frame URLs for low‑latency global delivery.[^3][^1]
- Autoscale worker pool based on queue depth and CPU usage.
- Institute data‑lifecycle policies for frames and videos to manage storage costs.

### 4.4 API Design Principles (Conceptual)

Follow a JSON REST style with a consistent response envelope as in your reference design.[^1]

- Auth endpoints: signup, login, OAuth callbacks, token refresh, credit checks.
- Project endpoints: CRUD, duplication, retrieve current HTML/CSS/JS, list by user.
- Chat endpoints: send message, get history, apply or undo AI‑suggested changes.
- Video endpoints: create job, poll status, fetch result, trigger frame extraction.
- Frame endpoints: list frames, optimize/reprocess, delete.
- Template endpoints: list/filter, get details, fork.
- Export & deployment endpoints: generate ZIP, obtain download URL, trigger deploy, poll status.
- WebSocket events for job progress and code updates.

### 4.5 Security & Compliance

Security measures should align with the TRD you derived.[^3][^1]

- Short‑lived JWT access tokens with refresh tokens.
- Strong OAuth scopes and role‑based access control across free/pro/enterprise/admin roles.
- Encryption of PII and AI API keys at rest via KMS/HashiCorp Vault.
- Strict rate‑limiting per user/IP.
- SQL injection, XSS, CSRF protections; secure file upload with AV scanning and type whitelisting.
- Network isolation for databases, least‑privilege IAM, centralized logging.

---

## 5. Gap Analysis: Draftly vs Current Signhify Project

### 5.1 Signhify Today (Public View)

The current Signhify marketing presence at signhify.lovable.app positions the brand as an **AI Engineering Studio** offering end‑to‑end systems: Studio, AI, Deploy, Marketplace, Cloud, and OS, with discovery calls and bespoke builds rather than a self‑serve tool. The stack hints (Next.js, TanStack, Tailwind, Supabase, Vercel, Anthropic/OpenAI) show a modern, cloud‑native foundation suitable for building a Draftly‑style product.[^8][^6]

The referenced GitHub repository could not be accessed via public search, so code‑level quality and architecture cannot be directly assessed.[^9]

### 5.2 Functional Comparison

| Area             | Draftly‑Class Product (Target)                                                                                    | Current Signhify Site                                                                           | Gap                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Core value prop  | Self‑serve AI 3D scroll website builder: prompt → cinematic site → export/deploy.[^2][^3][^1]                     | Studio selling high‑end AI engineering sprints, with ecosystem messaging but no public builder. | Product category mismatch; Signhify is services‑led, not tool‑led.          |
| Builder UI       | Authenticated web app with prompt input, template gallery, preview canvas, chat editor, export flows.[^2][^3][^1] | Primarily a marketing site with case studies and lead capture; no visible interactive builder.  | Need builder surface, project dashboard, and editing UI.                    |
| Templates        | 3D scroll‑oriented templates with live previews and tags.[^2][^1]                                                 | “Preset gallery” on site is a curated portfolio of client projects, not reusable templates.     | Need template data model and reusable presets.                              |
| Motion engine    | Frame‑based scroll‑locked playback with AI‑generated videos and frames.[^1]                                       | Marketing site may use conventional JS/CSS animations and Framer Motion, not frame pipelines.   | Need video integration, frame extraction, canvas renderer, and storage/CDN. |
| Chat editing     | Real‑time chat for modifying copy, colors, sections.[^1]                                                          | No chat editor exposed in public marketing UX.                                                  | Need LLM chat orchestration and UI.                                         |
| Code export      | ZIP export and optional backend starter.[^1]                                                                      | Studio likely hand‑delivers code to clients; no self‑service export.                            | Need export pipeline and 1‑click deployment flows.                          |
| Billing & quotas | SaaS tiers with usage limits.                                                                                     | Consultation‑driven pricing and custom projects.                                                | Need subscription, credits, metering, and in‑product upgrade paths.         |

### 5.3 Architectural & Operational Gaps

- **Data model** – Signhify currently orients around clients and engagements; the Draftly‑style model requires users, templates, projects, jobs, frames, and exports.[^8][^1]
- **Media pipeline** – No public evidence of AI video integration or FFmpeg‑scale processing in Signhify’s app footprint; this is core to a frame‑based scroll product.[^1]
- **Product analytics** – A tool product needs feature‑usage tracking, funnels, and SLO monitoring for jobs; the studio site likely focuses on marketing analytics only.[^3][^1]

### 5.4 Potential Blockers

- Cost and complexity of running GPU‑intensive video generation for many users.
- Storage and CDN spend for frame bundles at scale.
- Shifting from project‑based services revenue to SaaS pricing and support expectations.

---

## 6. MVP Implementation Roadmap

### 6.1 Phase 0 – Technical Spike (2–3 Weeks)

**Objectives**

- Validate the viability of video → frames → scroll‑locked playback.
- Confirm stack choices and basic schema.

**Tasks**

- Build a tiny Next.js page with a prompt field and “Generate test animation” button.
- Hard‑code one Runway‑generated video; extract frames with FFmpeg, store in S3, and implement scroll‑linked Canvas playback.
- Design minimal ERD with users, projects, video_jobs, frames.

### 6.2 Phase 1 – Core Builder MVP (6–8 Weeks)

**Goals**

- Single‑user prompt‑to‑site with one template and one video provider.

**Features**

- Auth for internal testers.
- Create project from prompt; trigger video job; extract frames.
- Builder UI with scroll preview and editable hero copy.
- Export as static ZIP.

### 6.3 Phase 2 – Usable Private Beta (6–8 Weeks)

**Goals**

- Onboard a small external cohort.

**Features**

- Template gallery (8–12 presets).
- Chat‑based editing with undo/redo.
- Media uploads for hero assets.
- Basic quotas and analytics.

### 6.4 Phase 3 – Public Launch (6–8 Weeks)

**Goals**

- Open signups, add billing, multi‑segment scrolls, and 1‑click deploy.

**Features**

- Stripe billing and subscription tiers.
- Chain multiple video segments into one scroll timeline.
- Deployment to Vercel/Netlify from within the product.
- Hardening of security, SLOs, and observability.

---

## 7. Cinematic 3D Immersive Signhify UI Prompt

### 7.1 Visual Direction

- Mood: “Hands in Motion. Voices in Light.” – dark, atmospheric scenes with luminous teal light on hands and interfaces representing sign language and AI translation.[^10][^11]
- Palette: deep navy/black backgrounds, teal primary accent, ember orange for human warmth, and violet for AI processing states.
- Typography: cinematic display face for headlines; clean grotesk for body.

### 7.2 Narrative Scenes (High Level)

1. **Hero – The Void Awakens**: single glowing hand mid‑sign in a volumetric light cone; scroll and cursor subtly tilt the camera; headline and CTAs emerge as if projected from the gesture.
2. **Gesture Decoded**: orbit around the hand reveals labeled joints and neural‑network constellations visualizing recognition confidence.
3. **Language Bridge**: particle stream flowing from signing figure to floating text bubbles, demonstrating translation.
4. **Scroll Gallery**: circular carousel of screens showcasing sites built with the platform; scroll rotates the reel.
5. **Launch Trajectory**: zoom‑out to an orbital view of Signhify’s ecosystem (Studio, AI, Deploy, Marketplace, Cloud, OS) with Scroll Studio highlighted.

### 7.3 Interaction Model

- Scroll drives a normalized `progress` variable controlling camera paths, opacity bands, and scene transitions.
- Mouse and touch events provide parallax and tap‑to‑expand interactions.
- `prefers-reduced-motion` triggers a static variant with gentle fades instead of large camera moves.

### 7.4 Asset & Performance Guidelines

- Prefer frame‑based animations rendered to WebP/AVIF; keep initial payload within 2–4 seconds load time on modern connections.[^2][^3][^1]
- Limit hero 3D models to ~20k triangles, using glTF/GLB with 2K textures and texture atlases where possible.
- Use level‑of‑detail (LOD), lazy‑loading and batching for off‑screen scenes.

### 7.5 Starter Skeleton & Testing Checklist

- Next.js app with `scenes` components, hooks for `useScrollProgress` and `useParallax`, and a `/frames` directory.
- Testing across major browsers and key breakpoints, with Lighthouse and accessibility audits.
- Visual regression checks on hero, gallery and CTA sections.

---

This report consolidates an ethical reconnaissance plan, PRD, TRD‑level architecture, comparative gap analysis, phased roadmap, and a cinematic UI prompt tailored to evolving Signhify into a Draftly‑class builder product while maintaining a unique brand and implementation.

---

## References

1. [Draftly-Reverse-Engineering-Complete-PRD-TRD-Implementation-Guide.pdf](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/90478849/c147f46e-c299-4757-aa71-dd11129a35c3/Draftly-Reverse-Engineering-Complete-PRD-TRD-Implementation-Guide.pdf?AWSAccessKeyId=ASIA2F3EMEYEQYIDABZI&Signature=wU%2BhPEG%2BqluQ26N%2FOqIT%2BosD%2B1I%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEEkaCXVzLWVhc3QtMSJHMEUCIQC%2FGYkauufS03O4q2boktM3WTex7vpaPRiNxkdTzseWTgIgJ9tchHcMXJpHhNI8vkBxbp9s7uF723Mo4ZN9vb2oeXIq8wQIEhABGgw2OTk3NTMzMDk3MDUiDEjjJkePhkFn3uXS%2FyrQBDM73CxkMpTSt0lNWefr%2FztYO1uEnnOLx5xd%2FajgDGbGqtdW5kSntCcZ71G19KSvc7n9%2BxUwjmaQ5QKi70NT0y6cQ9djzowE8C9ML7WUjXzl2NRspDKIqQL8h79hTLVqvL7WrCr6z9l3d2HGKJw5jEbfOLZAPUPadD5r35PbgEvipMSjXCjXcQubbayc9mTr%2F2vb1qclEvFOBH%2F59qLOd1XFjmRMTPrnHekdM1Ld2jGw2UN6NGoNNa1OW0qNCaMEhT%2BVL%2Fh8CaTPMNsw740dk8Hk5ywy9t%2BwtXf4PIFgjHdSO3vfrQrMlR1oK%2FaSzsXlWhMUtBUMDokxH8AV2F67AkXYhj8gQzfYszipWZl7E1qnmnMZm9kQ%2FuM2NnS2oW%2FA6%2FB4NFWaqVDobb94VS9737YompBp99XuHpVIIHPCbPTzrpLkMxe8%2BPcmaF2rs54yXuWUOWQD0o2%2FEKDft3UQo%2BxV3dznta5nRN%2Bx4A7bKngiqoGaB9IjO4U0eAyFx1PrQMhFlzXpn5%2BNhFWOaZ8sa75PB9lsSTIO2GceLXH2ztiE4sT%2Fwnf%2BB8MCG2VrLW6K%2FJ%2BKOaabyU55ft%2BKWMkLgQ5QCreRZKVIFvALxwuGbGlfE4LDnch0PhzDtHvUteaFKOFDhEWs0CdLzkWQD3c0quf2GksX88BUn87Vvrizgd6rYQH2WogjBStQS9feyq%2FF25%2F%2F5rMXNvzhkn1yI4jY8yFKPCnKP3qIOdvgoXzPXwa7kQDaW94imfzN3EkURJnnSdiDjCCP2XdRIlLzESs%2B7K0wjImv0QY6mAGhOb4lvzjjPtNAMzSRPzBR2QGiE0FiHmS4PwfjT%2BN6R70ke8ny3cYlgRsz%2BMbmpA8%2BjGmfQrKfc9O5Oe4oqfqg1Hsr9NXBOw4c6BZObz6aCLcfCfwHLWcai%2FnExzR%2B1JbTKnCSmTP428qHFsQDZzFTxvwpHdn4hBBO%2BwQoWM4%2BKTgB8Xfa6dFOFRirKyKKpxLN9P0RUIbB8Q%3D%3D&Expires=1781256799)

2. [Features — Draftly](https://www.draftly.space/features) - Every tool you need to ship a cinematic 3D site. AI generation, scroll-locked motion engine, node-ba...

3. [3D Website Builder - Draftly](https://www.draftly.space/docs/gdpr) - Draftly is a 3D website builder: turn one prompt into a cinematic scroll-driven site with AI-generat...

4. [Requirements Reverse Engineering - Noqta – AI Agents from $5](https://noqta.tn/en/blog/requirements-reverse-engineering) - Rebuild a reliable Software Requirements Specification from legacy systems, shadow IT, or undocument...

5. [Best WebGL Websites | Web Design Inspiration - Awwwards](https://www.awwwards.com/websites/webgl/) - Beautiful WebGL Designs for Inspiration. Selection of Awwwards winning WebGL websites or websites wi...

6. [Lovable Documentation: Welcome to Lovable](https://docs.lovable.dev/introduction/welcome)

7. [Demo of how to use DRFATLY](https://www.youtube.com/watch?v=UZncXbsYF8s) - Why I’m Building draftly.space

my insta - piyush.glitch
mail - piyushsingh123443@gmail.com

For ...

8. [10 Best Spline 3D Websites (Jan 2025)](https://www.youtube.com/watch?v=vnCspPqVURc) - 👀 10 Best 3D Websites (Jan 2025) 👀

Hey guys, I’m Jack, a 3D and immersive web designer, and today I...

9. [Perfect Pixel download | SourceForge.net](https://sourceforge.net/projects/perfect-pixel.mirror/) - Download Perfect Pixel for free. Refine and quantize messy AI pixel art into clean, perfect pixels. ...

10. [Solution Challenge Demo Day 2022 Project: SIGNify](https://www.youtube.com/watch?v=XwFkx-PG1b0) - SIGNify provides an interface where deaf and non-deaf people can easily understand sign language thr...

11. [🎯 Project: Signify – Sign Language Learning App](https://www.youtube.com/watch?v=Vq8oY_6cG0k) - 🎯 Project: Signify – Sign Language Learning App
    🚀 Built for SIH 2024 | Empowering communication thro...
