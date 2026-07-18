# SIGNHIFY — JUNE 2026 SPRINT PRD

### 6 Products · 25 Days · June 5 → June 30, 2026

**Owner:** Piyush Raj Singh | **Entity:** Piyush Media and Marketing | **UDYAM:** UDYAM-BR-08-0036671  
**Mission:** Ship the entire Signhify Ecosystem as live, working MVPs by June 30, 2026.  
**Status as of today (June 5):** Studio = in progress. All others = planned.

---

## ⚡ THE 25-DAY MASTER PLAN

```
TODAY        WEEK 1         WEEK 2         WEEK 3              WEEK 4         DEADLINE
June 5       June 1–7       June 8–14      June 15–21          June 22–28     June 30
   │              │              │               │                   │              │
   ▼              ▼              ▼               ▼                   ▼              ▼
[You are   [🟠 STUDIO]    [🤖 AI]        [🚀 DEPLOY]         [☁️ CLOUD]    [💻 OS]
  here]    signhify.      ai.            deploy.             cloud.        os.
           online         signhify.      signhify.           signhify.     signhify.
                          online         online + market     online        online
                                         place.signhify.
                                         online
```

---

## GROUND RULES FOR EXECUTION

### What "Done" Means for Each Product

Every product ships as an **MVP** — not a prototype, not a mockup, but a **live, deployed, functional application** at its subdomain that a real user can open, use, and share.

| Product              | "Done" Definition                                                             |
| -------------------- | ----------------------------------------------------------------------------- |
| Signhify Studio      | signhify.dpdns.org is live, leads can book a call, all 14 projects are showcased |
| Signhify AI          | Prompt → AI-generated product plan, live and usable with real Claude API      |
| Signhify Deploy      | GitHub repo → 1-click Vercel deploy, status dashboard working                 |
| Signhify Marketplace | Browse + download 10+ templates, submit form working                          |
| Signhify Cloud       | Supabase project dashboard, DB/storage/auth visible, functioning              |
| Signhify OS          | Unified dashboard with CRM, Projects, AI shortcuts, and Signhify nav          |

### Engineering Constraints (Be Honest)

- **Solo developer** — prioritize ruthlessly. No perfectionism.
- **Shared monorepo** — all 6 apps in one Next.js monorepo (`apps/studio`, `apps/ai`, etc.)
- **One design system** — built once in Week 1, reused across all products.
- **One Supabase project** — shared auth and database, different schemas per product.
- **One deployment** — Vercel with per-app domain routing.
- **AI-assisted development** — use Claude, Cursor, or similar heavily.

### What Gets Cut (Scope Discipline)

❌ No payment/billing in June (add in July)  
❌ No mobile apps (web-first, mobile-responsive)  
❌ No complex AI agent orchestration (single-model calls only)  
❌ No blog CMS (static markdown for now)  
❌ No admin panel (manage via Supabase dashboard)  
❌ No OAuth social login (email + magic link only)  
✅ Everything ships to production, not staging

---

## SHARED FOUNDATION (Build This First — June 5–6)

Before writing a single product-specific line, build these shared pieces. Everything else depends on them.

### F1. Monorepo Setup

```
signhify-ecosystem/
├── apps/
│   ├── studio/        → signhify.dpdns.org
│   ├── ai/            → ai.signhify.dpdns.org
│   ├── deploy/        → deploy.signhify.dpdns.org
│   ├── marketplace/   → marketplace.signhify.dpdns.org
│   ├── cloud/         → cloud.signhify.dpdns.org
│   └── os/            → os.signhify.dpdns.org
├── packages/
│   ├── ui/            → Shared component library (design system)
│   ├── db/            → Supabase client + shared types
│   ├── auth/          → Shared auth hooks
│   └── config/        → Shared tailwind config, env types
└── turbo.json         → Turborepo build orchestration
```

**Setup commands:**

```bash
npx create-turbo@latest signhify-ecosystem
# Add each app as Next.js 15 workspace
# Add packages/ui with shadcn components + custom Signhify tokens
```

### F2. Design System Package (`packages/ui`)

Build these once, import everywhere:

**Colors (CSS variables):**

```css
--orange: #ff6b00;
--orange-light: #ff8c33;
--black: #000000;
--surface-1: #0a0a0a;
--surface-2: #111111;
--surface-3: #1a1a1a;
--border: rgba(255, 107, 0, 0.15);
--border-hover: rgba(255, 107, 0, 0.4);
--text-primary: #ffffff;
--text-muted: #a0a0a0;
```

**Required Components (build all 15 today):**

```
SignhifyLogo        → SVG logo, 3 sizes
NavBar              → Dark, blur backdrop, orange CTA button
PageHero            → Title + subtitle + CTA pattern
Button              → Primary/Secondary/Ghost/Danger variants
Card                → Dark surface, orange hover glow
Badge               → Category/status chips (LIVE/SOON/PLANNED)
Input               → Dark theme, orange focus
Textarea            → Same as Input
Modal               → Dark, blur backdrop
Timeline            → Vertical/horizontal with orange nodes
ProjectCard         → Thumbnail, title, category, CTA
StatusBadge         → LIVE (green) / SOON (orange) / PLANNED (gray)
Footer              → Signhify nav, MSME registration number
ProductNav          → Cross-product navigation (used on all 6 apps)
LoadingSpinner      → Orange animated spinner
```

### F3. Supabase Schema (Deploy Once)

```sql
-- Shared auth (Supabase handles this)
-- Extend with:

-- Studio
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
  company TEXT, project_type TEXT, description TEXT,
  budget TEXT, timeline TEXT, source TEXT,
  status TEXT DEFAULT 'new', created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, title TEXT, category TEXT,
  description TEXT, live_url TEXT, tech_stack TEXT[],
  thumbnail TEXT, featured BOOLEAN DEFAULT false,
  tier INTEGER DEFAULT 2, published BOOLEAN DEFAULT true
);

-- AI
CREATE TABLE ai_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt TEXT, response JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE, name TEXT, use_case TEXT,
  product TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE, title TEXT, description TEXT,
  category TEXT, tags TEXT[], preview_url TEXT,
  download_url TEXT, price NUMERIC DEFAULT 0,
  downloads INTEGER DEFAULT 0, published BOOLEAN DEFAULT true
);

-- OS / CRM
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT, email TEXT, phone TEXT, company TEXT,
  status TEXT DEFAULT 'lead', notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE os_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT, description TEXT, status TEXT DEFAULT 'active',
  due_date DATE, created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### F4. Environment Variables Template

```env
# Shared across all apps
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Studio
RESEND_API_KEY=
CALENDLY_LINK=
WHATSAPP_NUMBER=916202442690

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Deploy
VERCEL_TOKEN=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
```

---

## WEEK 1: SIGNHIFY STUDIO

### June 1–7 | signhify.dpdns.org | Status: IN PROGRESS

**Goal:** Live marketing website that generates leads. The face of the entire ecosystem.  
**Remaining time from June 5:** 2 days (June 6–7)

---

### S1. Pages to Ship

| Page             | Route               | Priority       |
| ---------------- | ------------------- | -------------- |
| Homepage         | `/`                 | P0 — Must ship |
| Projects Gallery | `/projects`         | P0 — Must ship |
| Project Detail   | `/projects/[slug]`  | P0 — Must ship |
| Services         | `/services`         | P0 — Must ship |
| About / Founder  | `/about`            | P1             |
| Vision / Roadmap | `/vision`           | P1             |
| Contact          | `/contact`          | P0 — Must ship |
| Book Call        | `/book`             | P0 — Must ship |
| Privacy / Terms  | `/privacy` `/terms` | P1             |

---

### S2. Homepage — Section Breakdown

#### Hero Section

```
Visual:     Animated particle canvas (Three.js / tsparticles for speed)
            Orange nodes on black, connected by glowing lines
            Reacts to mouse movement (gentle parallax)

Headline:   "Build What Others Only Imagine."
Sub:        "AI-powered products, SaaS platforms, and growth systems
             engineered for ambitious businesses."

CTAs:       [Start Your Project →]  [Explore Our Work]

Stats:      14+ Products  ·  5+ Industries  ·  MSME Registered

Implementation note: Use tsparticles (lighter than Three.js) for Week 1
                     speed. Upgrade to Three.js post-launch.
```

#### Trust Strip

```
Animated counter: 14 Products · 5 Industries · 3 Years · MSME Certified
MSME badge with Udyam number: UDYAM-BR-08-0036671
```

#### Projects Section (Top 6 Featured)

```
Filter tabs: All / SaaS / AI / NGO / Corporate
Grid: 3-column masonry
Featured: GymFlow · AutoReels · Signhify CRM · GigMind · TuitionTrack · Sewarth
CTA on each: "View Project →"
```

#### Services Section (6 Cards)

```
AI Automation / SaaS Development / Web Development
CRM Systems / Performance Marketing / Branding
```

#### AI Demo Preview (Teaser only in Week 1)

```
Static card with animated typing effect showing example prompt
CTA: "Signhify AI is launching Week 2 — Join Waitlist →"
Links to waitlist form (Supabase waitlist table)
```

#### Ecosystem Roadmap (The Timeline from the screenshot)

```
This exact section from your screenshot:
● Signhify Studio   LIVE      Week 1 · June
○ Signhify AI       SOON      Week 2 · June
○ Signhify Deploy   PLANNED   Week 3 · June
○ Signhify Marketplace PLANNED Week 3 · June
○ Signhify Cloud    PLANNED   Week 4 · June
○ Signhify OS       PLANNED   June 30, 2026

Animate: active node pulses orange, line fills as weeks progress
```

#### Founder Section

```
Photo of Piyush Raj Singh
"21-year-old founder. 14 products. 1 vision."
Timeline: 2020 First code → 2025 MSME Registered → 2026 AI Studio
```

#### Contact / CTA Section

```
Multi-step form (Name → Project Details → Budget)
Calendly embed
WhatsApp button
```

---

### S3. All 14 Project Data (Seed to Supabase)

```javascript
const projects = [
  {
    slug: "gymflow-saas",
    title: "GymFlow SaaS",
    category: "saas",
    description: "Gym Management SaaS — memberships, attendance, billing, and ops dashboard.",
    live_url: "https://gymflow-saas.vercel.app",
    tech_stack: ["Next.js", "React", "Supabase", "TypeScript", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "autoreels-ai",
    title: "AutoReels AI",
    category: "ai",
    description: "AI-powered reel generation and content scheduling platform.",
    live_url: "https://autoreels-ai.vercel.app",
    tech_stack: ["Next.js", "OpenAI", "Automation APIs", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "signhify-crm",
    title: "Signhify CRM",
    category: "saas",
    description: "Full CRM — lead tracking, client management, sales pipeline.",
    live_url: "https://signhify-crm.vercel.app",
    tech_stack: ["Next.js", "Supabase", "TypeScript", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "gigmind",
    title: "GigMind",
    category: "ai",
    description: "AI-powered freelancing platform for gig professionals.",
    live_url: "https://gigmind-gamma.vercel.app",
    tech_stack: ["Next.js", "LLM APIs", "Supabase", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "tuitiontrack",
    title: "TuitionTrack",
    category: "edtech",
    description: "Student & tuition management — attendance, fees, reporting.",
    live_url: "https://tuitiontrack.vercel.app",
    tech_stack: ["Next.js", "React", "Database", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "sewarth-path-sansthanam",
    title: "Sewarth Path Sansthanam",
    category: "ngo",
    description: "Complete NGO digital ecosystem — website, campaigns, community.",
    live_url: "https://sewarthpathsansthanam.vercel.app",
    tech_stack: ["Next.js", "CMS", "Tailwind"],
    featured: true,
    tier: 1,
  },
  {
    slug: "tuitiontrack-app",
    title: "TuitionTrack App",
    category: "edtech",
    description: "Extended operational version of TuitionTrack.",
    live_url: "https://tuitiontrack-app.vercel.app",
    tech_stack: ["Next.js", "React", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "vibe-coding-platform",
    title: "Vibe Coding Platform",
    category: "dev-tool",
    description: "AI-assisted developer platform for vibe coding workflows.",
    live_url: "https://vibe-coding-platform-neon-kappa.vercel.app",
    tech_stack: ["Next.js", "AI APIs", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "jmd-online-book",
    title: "JMD Online Book",
    category: "corporate",
    description: "Online booking and appointment management platform.",
    live_url: "https://jmd-online-book.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "rahul-silk",
    title: "Rahul Silk",
    category: "corporate",
    description: "Business website for a silk and textile brand.",
    live_url: "https://rahul-silk.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "gple-sports",
    title: "GPLE Sports",
    category: "corporate",
    description: "Sports platform with branding and community engagement.",
    live_url: "https://gplesports.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "vip-tennis-landing",
    title: "VIP Tennis Landing",
    category: "marketing",
    description: "High-conversion Telegram lead generation landing page.",
    live_url: "https://vip-free-tennis-page.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 3,
  },
  {
    slug: "signhify-portfolio",
    title: "Signhify Portfolio",
    category: "corporate",
    description: "Agency portfolio and digital presence website.",
    live_url: "https://signhify.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 2,
  },
  {
    slug: "web-experimental",
    title: "Web (Experimental)",
    category: "dev-tool",
    description: "Prototype and development environment project.",
    live_url: "https://web-two-gamma-49.vercel.app",
    tech_stack: ["Next.js", "Tailwind"],
    featured: false,
    tier: 3,
  },
];
```

### S4. Week 1 Daily Task Breakdown

| Day            | Tasks                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------- |
| June 5 (Today) | ✅ Monorepo setup · Design system tokens · Supabase schema                               |
| June 6         | Hero + navbar + particle canvas · Trust strip · Project grid                             |
| June 7         | Services · Roadmap timeline · Founder section · Contact form · Deploy to signhify.dpdns.org |

**Week 1 Exit Criteria:**

- [ ] signhify.dpdns.org resolves and loads <3s
- [ ] Lead form submits to Supabase
- [ ] All 14 projects visible and filterable
- [ ] Calendly link working
- [ ] Mobile responsive at 375px
- [ ] Lighthouse ≥85

---

## WEEK 2: SIGNHIFY AI

### June 8–14 | ai.signhify.dpdns.org | Status: SOON

**Goal:** A working prompt-to-product AI builder. User enters an idea, gets a full product plan back. Real AI, real output, real value.

---

### A1. What It Does (MVP Scope)

The user types a product idea. Signhify AI returns:

1. **Product Name** suggestion
2. **Feature List** (10 core features for the MVP)
3. **Tech Stack** recommendation with rationale
4. **System Architecture** (text-based diagram)
5. **3-Screen Wireframe Descriptions** (home, dashboard, key feature)
6. **Development Timeline** (week-by-week estimate)
7. **Estimated Cost** breakdown (if building with Signhify Studio)

At the bottom of every output: a **"Build This With Signhify →"** CTA that goes to signhify.dpdns.org/contact with the prompt pre-filled.

---

### A2. Pages

| Page     | Route       | Description                                  |
| -------- | ----------- | -------------------------------------------- |
| Landing  | `/`         | Explain what Signhify AI does, CTA to try it |
| Builder  | `/build`    | The main prompt → output interface           |
| History  | `/history`  | Past builds (requires auth)                  |
| Waitlist | `/waitlist` | Email capture for future features            |

---

### A3. Builder Interface Specification

```
┌─────────────────────────────────────────────────────────┐
│  SIGNHIFY AI                              [Sign In]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  What do you want to build?                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Build me a gym management SaaS with member-    │   │
│  │ ship tracking, billing, and attendance...       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Try: CRM for real estate]  [EdTech platform]         │
│  [Restaurant ordering app]   [AI content tool]         │
│                                                         │
│  [ Generate Product Plan → ]                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ▼ OUTPUT (streams in real-time)                        │
│                                                         │
│  📦 Product: GymFlow Pro                               │
│  ───────────────────────────────                       │
│  ✅ Feature 1: Member onboarding with profile          │
│  ✅ Feature 2: Subscription and billing management     │
│  ... (10 features)                                      │
│                                                         │
│  ⚡ Tech Stack: Next.js · Supabase · Stripe            │
│                                                         │
│  🏗️ Architecture: [text diagram]                       │
│                                                         │
│  📅 Timeline: 6 weeks · 2 developers                   │
│                                                         │
│  💰 Build this with Signhify: ₹1.5L–₹2.5L             │
│                                                         │
│  [ Build This With Signhify → ]  [ Save ] [ Share ]   │
└─────────────────────────────────────────────────────────┘
```

---

### A4. Claude API Integration

**System Prompt:**

```
You are Signhify AI, a product architect and AI engineering assistant
by Signhify (signhify.dpdns.org). When given a product idea, respond with
a structured JSON object only — no markdown, no preamble.

JSON structure:
{
  "product_name": "string",
  "tagline": "string (under 10 words)",
  "features": ["feature 1", "feature 2", ... (10 items)],
  "tech_stack": {
    "frontend": "string",
    "backend": "string",
    "database": "string",
    "ai_layer": "string or null",
    "deployment": "string"
  },
  "architecture": "string (text-based system diagram, 5–8 lines)",
  "screens": [
    { "name": "Home/Landing", "description": "..." },
    { "name": "Dashboard", "description": "..." },
    { "name": "Core Feature", "description": "..." }
  ],
  "timeline_weeks": number,
  "team_size": number,
  "signhify_price_range": "₹X–₹Y"
}
```

**API Call:**

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  }),
});
```

**Rate Limiting:** 3 free builds per session. Sign up for unlimited.

---

### A5. Authentication (Week 2 Only — Keep Simple)

- Supabase magic link (email only)
- No OAuth in June — add Google in July
- Unauthenticated: 3 free builds, no history saved
- Authenticated: unlimited builds, history saved, shareable links

---

### A6. Week 2 Daily Task Breakdown

| Day     | Tasks                                                                |
| ------- | -------------------------------------------------------------------- |
| June 8  | Landing page · Auth (magic link) · Basic layout                      |
| June 9  | Builder UI · Prompt input · Example prompts                          |
| June 10 | Claude API integration · Streaming response · JSON parsing           |
| June 11 | Output display components · Feature list · Tech stack · Architecture |
| June 12 | History page · Save to Supabase · Share link                         |
| June 13 | Rate limiting · Waitlist page · "Build With Signhify" CTA            |
| June 14 | Deploy to ai.signhify.dpdns.org · Cross-link from Studio · Test         |

**Week 2 Exit Criteria:**

- [ ] ai.signhify.dpdns.org is live
- [ ] Prompt → JSON output working with real Claude API
- [ ] Streaming response (text appears progressively)
- [ ] 3 free builds per session enforced
- [ ] Auth (magic link) working
- [ ] History saved for logged-in users
- [ ] "Build This With Signhify" CTA links to Studio contact
- [ ] Lighthouse ≥80

---

## WEEK 3: SIGNHIFY DEPLOY + SIGNHIFY MARKETPLACE

### June 15–21 | deploy.signhify.dpdns.org + marketplace.signhify.dpdns.org | Status: PLANNED

**Split the week:** Deploy = June 15–17 (3 days). Marketplace = June 18–21 (4 days).

---

## SIGNHIFY DEPLOY (June 15–17)

### deploy.signhify.dpdns.org

**What it does (MVP):**  
Connect your GitHub repo → select a framework → click Deploy → it deploys to Vercel → shows live URL and deployment logs. No SSH, no DevOps knowledge needed.

### D1. Pages

| Page              | Route               |
| ----------------- | ------------------- |
| Landing           | `/`                 |
| Dashboard         | `/dashboard`        |
| New Deployment    | `/deploy/new`       |
| Deployment Detail | `/deploy/[id]`      |
| Logs              | `/deploy/[id]/logs` |

### D2. Deploy Flow (Step by Step)

```
Step 1: Connect GitHub
├── OAuth GitHub connection (GitHub App)
└── List user's repositories

Step 2: Select Repository
├── Search/filter repos
├── Select branch (main by default)
└── Auto-detect framework (Next.js, React, etc.)

Step 3: Configure
├── Project name (auto-filled from repo)
├── Build command (auto-detected or custom)
├── Output directory (auto-detected or custom)
└── Environment variables (key-value editor)

Step 4: Deploy
├── Button: [Deploy Now →]
├── Triggers Vercel API: POST /v13/deployments
├── Streams deployment logs in real-time
└── Shows live URL on success

Step 5: Dashboard
├── All deployments list
├── Status: Building / Live / Failed
├── Live URL with copy button
└── Redeploy / Delete actions
```

### D3. Vercel API Integration

```javascript
// Create deployment via Vercel API
const deployment = await fetch("https://api.vercel.com/v13/deployments", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: projectName,
    gitSource: {
      type: "github",
      repo: `${owner}/${repo}`,
      ref: branch,
    },
    projectSettings: {
      framework: detectedFramework,
      buildCommand: buildCmd,
      outputDirectory: outputDir,
    },
  }),
});
```

### D4. Deploy Dashboard UI

```
┌─────────────────────────────────────────────────────────┐
│  SIGNHIFY DEPLOY         [New Deployment +]  [Account] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  YOUR DEPLOYMENTS                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 gymflow-saas      LIVE     gymflow.vercel.app│   │
│  │    Deployed 2h ago · Next.js                   │   │
│  │                    [Visit] [Redeploy] [Logs]   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ 🟡 signhify-crm      BUILDING  ...             │   │
│  │    Started 3m ago · Building...                │   │
│  │    ▓▓▓▓▓▓░░░░ 60%   [View Logs]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### D5. Deploy Daily Tasks

| Day     | Tasks                                                            |
| ------- | ---------------------------------------------------------------- |
| June 15 | Landing · Auth · GitHub OAuth · Repo listing                     |
| June 16 | Deploy flow (steps 1–4) · Vercel API integration · Log streaming |
| June 17 | Dashboard · Status tracking · Live URL display · Deploy to prod  |

---

## SIGNHIFY MARKETPLACE (June 18–21)

### marketplace.signhify.dpdns.org

**What it does (MVP):**  
Browse and download free/paid templates for SaaS, landing pages, CRM, AI apps. Creators can submit templates. Downloads tracked.

### M1. MVP Catalog (10 Templates at Launch)

Launch with these 10 templates (all built from Signhify's existing work):

| #   | Template Name           | Category   | Price |
| --- | ----------------------- | ---------- | ----- |
| 1   | Gym SaaS Starter        | SaaS       | Free  |
| 2   | Tuition Management Kit  | EdTech     | Free  |
| 3   | CRM Dashboard Starter   | SaaS       | Free  |
| 4   | NGO Website Kit         | NGO        | Free  |
| 5   | AI Landing Page         | Marketing  | Free  |
| 6   | SaaS Marketing Page     | Marketing  | Free  |
| 7   | Corporate Website Kit   | Corporate  | Free  |
| 8   | Booking System Starter  | SaaS       | Free  |
| 9   | Sports Platform Kit     | Corporate  | Free  |
| 10  | Silk/E-commerce Starter | E-commerce | Free  |

_All templates built from your existing 14 projects — export their structures as Next.js starter templates and upload to GitHub._

### M2. Pages

| Page             | Route               |
| ---------------- | ------------------- |
| Marketplace Home | `/`                 |
| Browse All       | `/templates`        |
| Template Detail  | `/templates/[slug]` |
| Submit Template  | `/submit`           |
| Creator Profile  | `/creator/[slug]`   |

### M3. Template Detail Page

```
┌─────────────────────────────────────────────────────────┐
│  [Preview Image — full width]                           │
├─────────────────────────────────────────────────────────┤
│  Gym SaaS Starter                    FREE               │
│  By Signhify · 234 downloads · ⭐ 4.9                   │
│                                                         │
│  Built with Next.js · Supabase · Tailwind               │
│                                                         │
│  A complete starting point for gym management SaaS.     │
│  Includes: Member dashboard, billing, attendance...     │
│                                                         │
│  [↓ Download Free]      [👁 Live Preview]              │
│  [🚀 Deploy with Signhify Deploy →]                    │
│                                                         │
│  Includes:                                              │
│  ✅ Next.js 15 + TypeScript                             │
│  ✅ Supabase schema + migrations                        │
│  ✅ Tailwind + Shadcn UI                                │
│  ✅ Authentication setup                                │
│  ✅ README with setup guide                             │
└─────────────────────────────────────────────────────────┘
```

_Key cross-product CTA: "Deploy with Signhify Deploy →" links to deploy.signhify.dpdns.org_

### M4. Marketplace Daily Tasks

| Day     | Tasks                                                          |
| ------- | -------------------------------------------------------------- |
| June 18 | Marketplace homepage · Template grid · Filter/search           |
| June 19 | Template detail page · Download tracking · Preview modal       |
| June 20 | Submit template form · Auth for submitters · Seed 10 templates |
| June 21 | Polish · Cross-links to Deploy/Studio · Deploy to prod         |

**Week 3 Exit Criteria (Deploy):**

- [ ] deploy.signhify.dpdns.org live
- [ ] GitHub OAuth working
- [ ] Vercel deployment triggered from UI
- [ ] Real-time log streaming
- [ ] Dashboard showing deployment status

**Week 3 Exit Criteria (Marketplace):**

- [ ] marketplace.signhify.dpdns.org live
- [ ] 10 templates visible and downloadable
- [ ] Download count tracked in Supabase
- [ ] Submit template form working
- [ ] "Deploy with Signhify Deploy" CTA working

---

## WEEK 4: SIGNHIFY CLOUD

### June 22–28 | cloud.signhify.dpdns.org | Status: PLANNED

**Goal:** A managed cloud dashboard where users can create and manage Supabase projects, storage, and auth — branded as Signhify Cloud.

---

### C1. What It Actually Is (Be Honest About MVP)

Building a full cloud provider in one week is impossible.  
**What Signhify Cloud MVP is:** A branded management dashboard that wraps Supabase Management API + Vercel API to give users a unified "cloud console" experience. Users create Supabase projects, manage databases, and view their deployments — all inside Signhify's UI.

This is still genuinely useful and genuinely differentiated.

---

### C2. Pages

| Page            | Route             | Description                            |
| --------------- | ----------------- | -------------------------------------- |
| Landing         | `/`               | What Signhify Cloud offers             |
| Dashboard       | `/dashboard`      | Overview of all resources              |
| Databases       | `/databases`      | List, create, manage Supabase projects |
| Database Detail | `/databases/[id]` | Tables, schema, storage                |
| Storage         | `/storage`        | File buckets and management            |
| Functions       | `/functions`      | Edge function list (Supabase)          |
| Settings        | `/settings`       | API keys, billing (coming soon)        |

---

### C3. Dashboard UI

```
┌─────────────────────────────────────────────────────────┐
│  SIGNHIFY CLOUD           [New Resource +]  [Account]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RESOURCE OVERVIEW                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 3        │  │ 12.4 GB  │  │ 2        │             │
│  │ Databases│  │ Storage  │  │ Functions│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  DATABASES                          [+ New Database]   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 signhify-prod   PostgreSQL  12 tables  LIVE │   │
│  │    Region: ap-south-1 · 245MB used             │   │
│  │    [Open] [Tables] [SQL Editor] [Settings]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  RECENT ACTIVITY                                        │
│  • New table 'leads' created · 2h ago                   │
│  • 124 new rows inserted today                          │
│  • Backup completed · 6h ago                            │
└─────────────────────────────────────────────────────────┘
```

---

### C4. Supabase Management API Integration

```javascript
// Create new project
POST https://api.supabase.com/v1/projects
{
  "name": projectName,
  "organization_id": orgId,
  "plan": "free",
  "region": "ap-southeast-1",
  "db_pass": generatedPassword
}

// List tables
GET https://api.supabase.com/v1/projects/{ref}/database/tables

// List buckets
GET https://api.supabase.com/v1/projects/{ref}/storage/buckets

// Get project metrics
GET https://api.supabase.com/v1/projects/{ref}/usage
```

---

### C5. Week 4 Daily Task Breakdown

| Day     | Tasks                                                 |
| ------- | ----------------------------------------------------- |
| June 22 | Landing page · Auth · Connect Supabase Management API |
| June 23 | Dashboard overview · Database list · Resource stats   |
| June 24 | Database detail page · Tables view · Schema browser   |
| June 25 | Storage management · Bucket list · File browser       |
| June 26 | Functions list · Activity feed · Settings page        |
| June 27 | Polish UI · Error states · Loading skeletons          |
| June 28 | Deploy to cloud.signhify.dpdns.org · Cross-links · Test  |

**Week 4 Exit Criteria:**

- [ ] cloud.signhify.dpdns.org live
- [ ] Supabase Management API connected
- [ ] Create new database project working
- [ ] Tables visible in database detail view
- [ ] Storage buckets visible
- [ ] Dashboard shows real resource stats
- [ ] Lighthouse ≥80

---

## JUNE 29–30: SIGNHIFY OS

### os.signhify.dpdns.org | Status: PLANNED — Launch June 30

**Goal:** A unified business operating system dashboard that brings together CRM, project management, AI access, and cross-product navigation — the homepage of the entire Signhify ecosystem for logged-in users.

---

### O1. What Signhify OS MVP Is

OS is not built from scratch in 2 days.  
**OS MVP strategy:** Assemble existing pieces into one unified dashboard. The Supabase tables are already there (leads, contacts, os_projects). The auth is shared. The UI components exist. You're building the container and wiring.

---

### O2. Modules (All Powered by Existing Supabase Data)

```
MODULE 1: COMMAND CENTER (Home)
├── Good morning, Piyush
├── Today's stats: X leads · Y tasks · Z deployments
├── Quick actions: [New Lead] [New Project] [Ask AI]
└── Recent activity feed

MODULE 2: CRM
├── Contacts list (from leads/contacts table)
├── Add/edit contact
├── Status pipeline: Lead → Contacted → Qualified → Closed
└── Notes per contact

MODULE 3: PROJECTS
├── Active projects list (from os_projects table)
├── Status: Active / On Hold / Completed
├── Due dates
└── Quick notes

MODULE 4: AI ASSISTANT
├── Embed of Signhify AI (iframe or inline)
├── Quick prompts: "Plan a new project" / "Write a proposal"
└── Links to full ai.signhify.dpdns.org

MODULE 5: ECOSYSTEM NAV (THE MOST IMPORTANT PIECE)
├── Links to all Signhify products with status badges
├── Studio (LIVE) · AI (LIVE) · Deploy (LIVE)
├── Marketplace (LIVE) · Cloud (LIVE) · OS (YOU ARE HERE)
└── This is the "App Switcher" — like Google's 9-dot menu

MODULE 6: ANALYTICS OVERVIEW
├── Website traffic (GA4 embed or simple Supabase queries)
├── Leads this week/month
├── Projects by status
└── Simple charts (recharts)
```

---

### O3. OS Dashboard UI

```
┌─────────────────────────────────────────────────────────┐
│  [≡] SIGNHIFY OS         [⚡AI] [🔔] [Piyush ▼]       │
├──────────┬──────────────────────────────────────────────┤
│  NAV     │  COMMAND CENTER                              │
│          │  ┌────────┐ ┌────────┐ ┌────────┐          │
│  🏠 Home │  │ 8 Leads│ │ 3 Proj │ │ 2 Live │          │
│  👥 CRM  │  │ Today  │ │ Active │ │ Deploy │          │
│  📁 Proj │  └────────┘ └────────┘ └────────┘          │
│  🤖 AI   │                                              │
│  ☁️ Cloud│  QUICK ACTIONS                              │
│  🛒 Mkt  │  [+ New Lead] [+ Project] [Ask AI ⚡]      │
│  📊 Stats│                                              │
│  ⚙️ Sett │  ECOSYSTEM                                  │
│          │  ● Studio LIVE  ● AI LIVE  ● Deploy LIVE   │
│  ──────  │  ● Market LIVE  ● Cloud LIVE               │
│  SIGN OUT│                                              │
└──────────┴──────────────────────────────────────────────┘
```

---

### O4. OS Daily Task Breakdown

| Day     | Tasks                                                                                 |
| ------- | ------------------------------------------------------------------------------------- |
| June 29 | Layout (sidebar + main) · Auth check · Command center module · CRM list               |
| June 30 | Projects module · AI embed · Ecosystem nav · Deploy to os.signhify.dpdns.org · LAUNCH 🚀 |

**June 30 Exit Criteria:**

- [ ] os.signhify.dpdns.org live
- [ ] Auth required (redirect to login if no session)
- [ ] CRM contacts list showing Supabase data
- [ ] Projects list working
- [ ] Ecosystem nav links to all 6 products
- [ ] Command center stats loading
- [ ] Mobile responsive

---

## COMPLETE JUNE EXECUTION TIMELINE

```
JUNE 5 (TODAY)
├── Set up monorepo (Turborepo)
├── Build packages/ui (design tokens + 15 components)
├── Initialize Supabase (schema migration)
└── Configure all environment variables

JUNE 6
├── Studio: Hero + navbar + particle canvas
└── Studio: Projects section + filter tabs

JUNE 7 (WEEK 1 DONE)
├── Studio: Services + roadmap timeline + founder + contact
└── 🚀 Deploy signhify.dpdns.org → LIVE

JUNE 8
└── Signhify AI: Landing + auth + layout

JUNE 9
└── Signhify AI: Builder UI + prompt input

JUNE 10
└── Signhify AI: Claude API integration + streaming

JUNE 11
└── Signhify AI: Output components + display

JUNE 12
└── Signhify AI: History + save + share

JUNE 13
└── Signhify AI: Rate limiting + waitlist

JUNE 14 (WEEK 2 DONE)
└── 🚀 Deploy ai.signhify.dpdns.org → LIVE

JUNE 15
└── Signhify Deploy: Landing + GitHub OAuth + repo list

JUNE 16
└── Signhify Deploy: Deploy flow + Vercel API + log streaming

JUNE 17 (DEPLOY DONE)
└── 🚀 Deploy deploy.signhify.dpdns.org → LIVE

JUNE 18
└── Signhify Marketplace: Home + template grid

JUNE 19
└── Signhify Marketplace: Template detail + downloads

JUNE 20
└── Signhify Marketplace: Submit form + seed 10 templates

JUNE 21 (WEEK 3 DONE)
└── 🚀 Deploy marketplace.signhify.dpdns.org → LIVE

JUNE 22
└── Signhify Cloud: Landing + Supabase Management API connect

JUNE 23
└── Signhify Cloud: Dashboard + database list

JUNE 24
└── Signhify Cloud: Database detail + tables browser

JUNE 25
└── Signhify Cloud: Storage + functions

JUNE 26
└── Signhify Cloud: Activity feed + settings

JUNE 27
└── Signhify Cloud: Polish + error states

JUNE 28 (WEEK 4 DONE)
└── 🚀 Deploy cloud.signhify.dpdns.org → LIVE

JUNE 29
└── Signhify OS: Layout + CRM + command center

JUNE 30 (DEADLINE)
├── Signhify OS: Projects + AI embed + ecosystem nav
├── 🚀 Deploy os.signhify.dpdns.org → LIVE
└── 🎉 ALL 6 PRODUCTS LIVE — LAUNCH ANNOUNCEMENT
```

---

## SHARED TECHNICAL ARCHITECTURE

### Domain Configuration (Vercel)

```
signhify.dpdns.org          → apps/studio
ai.signhify.dpdns.org       → apps/ai
deploy.signhify.dpdns.org   → apps/deploy
marketplace.signhify.dpdns.org → apps/marketplace
cloud.signhify.dpdns.org    → apps/cloud
os.signhify.dpdns.org       → apps/os
```

Vercel project per app, all in the same GitHub monorepo. Push to `main` auto-deploys all apps simultaneously via Turborepo.

### Cross-Product Navigation

Every app must include `<ProductNav />` (from packages/ui) in the header. This shows:

```
[Signhify Logo]
├── Studio (signhify.dpdns.org)
├── AI (ai.signhify.dpdns.org)
├── Deploy (deploy.signhify.dpdns.org)
├── Marketplace (marketplace.signhify.dpdns.org)
├── Cloud (cloud.signhify.dpdns.org)
└── OS (os.signhify.dpdns.org) [Dashboard]
```

This makes the ecosystem feel unified even though it's 6 separate apps.

### Auth Strategy (Shared SSO)

All 6 apps use the **same Supabase project** for auth. Users who sign up on Signhify AI are already signed in on Signhify OS. This is free SSO via shared JWT cookies on the `signhify.dpdns.org` domain.

```javascript
// packages/auth/index.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Shared session check (use in all apps)
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

---

## MVP SCOPE SUMMARY

| Product         | Must Ship by Deadline                               | Save for July                               |
| --------------- | --------------------------------------------------- | ------------------------------------------- |
| **Studio**      | Homepage, 14 projects, services, contact, book call | Blog, deep case studies, video testimonials |
| **AI**          | Prompt → plan output, auth, history, waitlist       | Multi-model, image generation, code export  |
| **Deploy**      | GitHub → Vercel deploy, logs, dashboard             | AWS/GCP support, custom domains, teams      |
| **Marketplace** | 10 templates, download, submit form                 | Paid templates, ratings, creator payouts    |
| **Cloud**       | DB/storage dashboard, Supabase API wrapper          | Custom hosting, functions editor, billing   |
| **OS**          | CRM, projects, ecosystem nav, AI embed              | Finance module, HR, full kanban, reports    |

---

## LAUNCH DAY PLAN (June 30)

### Morning (Before 12pm IST)

- [ ] Final deployment of all 6 apps
- [ ] Smoke test every app on mobile and desktop
- [ ] Verify all cross-product links work
- [ ] Check Supabase connections on all apps

### Launch Announcement (12pm IST)

LinkedIn post (drafted below):

> **"I just shipped 6 products in 30 days. 🟠"**
>
> At 21, running an MSME-registered AI engineering studio from Bihar:
>
> ✅ Signhify Studio (signhify.dpdns.org) — Live agency
> ✅ Signhify AI — Prompt-to-product builder
> ✅ Signhify Deploy — 1-click deployment
> ✅ Signhify Marketplace — AI templates
> ✅ Signhify Cloud — Infrastructure dashboard
> ✅ Signhify OS — Business operating system
>
> All live. All real. All built this month.
>
> UDYAM-BR-08-0036671 ✓
>
> #Signhify #BuildInPublic #AI #StartupIndia

### After Launch

- [ ] Post demo video on Twitter/X
- [ ] Share in IndieHackers
- [ ] Post in relevant WhatsApp groups
- [ ] DM 20 potential clients directly
- [ ] Monitor Sentry for errors
- [ ] Reply to all comments within 2 hours

---

## RISK REGISTER

| Risk                                      | Probability | Impact | Mitigation                                              |
| ----------------------------------------- | ----------- | ------ | ------------------------------------------------------- |
| Claude API rate limits during Signhify AI | Medium      | High   | Implement queue + cached example responses              |
| Vercel API changes for Deploy product     | Low         | High   | Build Vercel integration first, fallback to manual      |
| GitHub OAuth approval delay               | Medium      | High   | Apply for GitHub OAuth App immediately today            |
| Design system inconsistency across apps   | Medium      | Medium | Build and finalize packages/ui before touching any app  |
| Scope creep on Cloud (most complex)       | High        | High   | Lock MVP scope Day 1, ignore everything not in this doc |
| Running out of energy by Week 4           | High        | Medium | OS is the lightest lift — it assembles existing pieces  |
| Supabase rate limits on free tier         | Low         | Medium | Upgrade to Pro ($25/month) if needed                    |

---

## POST-JUNE ROADMAP (July 2026+)

Once all 6 are live, the July priority list:

1. **Signhify AI:** Add code generation (actual file download), multi-model support
2. **Studio:** Add case studies, client testimonials, blog
3. **Deploy:** Add AWS + Cloudflare support, custom domain management
4. **Marketplace:** Launch paid templates (₹499–₹2,999), creator revenue split
5. **Cloud:** Add billing/invoicing, upgrade prompts
6. **OS:** Add Kanban board, invoice generation, team members
7. **All products:** Google OAuth, pricing pages, upgrade flows

---

## APPENDIX — KEY RESOURCES

| Resource           | URL / Value                        |
| ------------------ | ---------------------------------- |
| Primary Domain     | signhify.dpdns.org                    |
| GitHub             | github.com/Warriorlegacy           |
| Supabase Dashboard | supabase.com/dashboard             |
| Vercel Dashboard   | vercel.com/dashboard               |
| Calendly           | calendly.com (set up booking link) |
| WhatsApp           | wa.me/916202442690                 |
| MSME Registration  | UDYAM-BR-08-0036671                |
| Claude API Docs    | docs.anthropic.com                 |
| Vercel API Docs    | vercel.com/docs/rest-api           |
| Supabase Mgmt API  | supabase.com/docs/reference/api    |
| Turborepo Docs     | turbo.build/repo/docs              |
| tsparticles        | particles.js.org                   |

---

_SIGNHIFY JUNE SPRINT PRD — v1.0_  
_25 days. 6 products. Zero excuses._  
_June 5 → June 30, 2026 | Piyush Raj Singh | UDYAM-BR-08-0036671_
