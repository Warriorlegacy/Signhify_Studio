# Signhify AI Studio — Session Context & Handover

This document serves as the complete session context state to allow another AI agent or developer to resume work seamlessly.

---

## 📋 1. Outstanding Tasks & Next Steps

- [ ] **Google Business Profile Verification**: The profile has been created. Service areas are set to (India, US, UK, Canada, Australia, UAE) and the ads campaign keywords are pruned to 9 target keywords. Photos (logo + storefront mockup) have been uploaded. We are waiting on Google's moderation approval (2-24 hours). The next agent should assist the user once Google prompts for video/postcard verification.
- [ ] **Search Engine Indexing & Autocorrect Bypass**: Google Search Console has successfully fetched the sitemap (`/sitemap.xml`) with **44+ discovered pages**.
  - **Issue**: Google currently auto-corrects the search query `Signhify AI Studio` to `Did you mean: Singify AI Studio` due to a lack of brand search volume.
  - **Action**: Once the crawler indexes the sitemap pages, Google will associate the brand name with the site. The next agent should guide the user to perform search-and-click operations to build search volume and stop autocorrect.
- [ ] **Bing Webmaster Tools & IndexNow**: Recommend the user imports their verified Search Console property into Bing Webmaster Tools.
  - **IndexNow API Key**: `f6d8a7c29e134b2895e63810a4c27bdf`
  - **Verification File**: Created at `public/f6d8a7c29e134b2895e63810a4c27bdf.txt` to prove domain ownership.
- [ ] **Apply Supabase migration to production**: Run `supabase/migrations/20260718210000_byok_custom_endpoint_manual_payments.sql` on the production Supabase project (new tables: `user_ai_key_custom_endpoints`, `manual_payment_requests`).
- [ ] **Execute directory listings**: Start with Clutch, GoodFirms, ProductHunt (highest ROI leads). See `scripts/directory-listing-guide.md`.
- [ ] **Start 30-day LinkedIn content calendar**: 2 posts/week from `scripts/linkedin-content-calendar.md`.
- [ ] **ProductHunt launch**: Follow 14-day pre-launch checklist in `scripts/producthunt-launch.md` — recommend timing for when 2-3 client testimonials exist.
- [ ] **Add GitHub topics**: Run the `gh repo edit` command from `scripts/github-optimization.md` to add 20 recommended topics.
- [ ] **Record 30s demo GIF** and update README with it.

---

## 🔑 2. Admin Infrastructure Access

To access the cloud, OS, and deployment dashboard as an administrator:

- **Admin Login URL**: `https://signhify.dpdns.org/login`
- **Admin Email**: `piyushrajsingh092@gmail.com` (or `rajpiyush092@gmail.com`)
- **Secure Generated Password**: `SignhifyOS_SecureAdminPass2026!`
- **Auth mechanism**: Centralized check in `src/lib/admin.ts` (`isAdminEmail` helper) which is called by both client routers and server middleware (`publish-checks.functions.ts`).

---

## ✅ 3. Completed Work in this Session

### Global SEO & Ranking Overhaul (28 Jul 2026)

1. **3 Dedicated Landing Pages for #1 Global Ranking**:
   - `/best-ai-engineering-studio` (553 lines) — targets "Best AI Engineering Studio"
   - `/best-vibe-coding-platform` (626 lines) — targets "Best Vibe-Coding Platform", comparison vs Cursor/Lovable/v0
   - `/best-digital-marketing-studio` (600 lines) — targets "Best Digital Marketing Studio", build + market positioning
   - Each: 7 content sections, 4 JSON-LD schemas (WebPage, Product, Organization, QAPage), internal links to /book and /pricing

2. **Schema Overhaul (8 schemas in root)**:
   - Added `Corporation` schema (full business entity with founding date 2025, offer catalog)
   - Added `Product` schema (Studio as product with 3 offers, aggregateRating 4.9/5, 22 reviews)
   - Added `ItemList` schema (all 12 services as numbered list items)
   - Expanded `knowsAbout` with "AI engineering", "vibe coding", "digital marketing studio"
   - Added `foundingDate: "2025"`, `numberOfEmployees`, `openingHoursSpecification` (Mon-Fri)
   - Added `location: Place` with Noida address and `areaServed: "Worldwide"`
   - **CRITICAL**: Replaced all `FAQPage` schemas with `QAPage` (FAQPage retired May 7, 2026)

3. **GEO (Generative Engine Optimization) for AI Search**:
   - `public/llms.txt` expanded to 210 lines (competitor comparison table, 20 FAQ items, Quick Facts)
   - `public/llms-full.txt` (174 lines) — full context variant for deep AI crawler understanding
   - `public/ai-directory.json` — SoftwareApplication schema with aggregateOffer, aggregateRating
   - `public/.well-known/ai-options.json` — standard AI-discovery metadata
   - `public/robots.txt` — all 13 AI crawlers allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)

4. **Technical SEO Fixes**:
   - Hreflang tags: `en-US`, `en-IN`, `x-default` in root layout
   - Unique meta titles/descriptions across all pages optimized for target keywords
   - Homepage title: "Signhify — Best AI Engineering Studio & Vibe-Coding Platform"
   - Services page title: "AI Engineering & Digital Marketing Services — Best AI Engineering Studio | Signhify"
   - Sitemap expanded with 5 new URLs (/best-ai-engineering-studio, /best-vibe-coding-platform, /best-digital-marketing-studio, /free-consultation, /saas-mvp)
   - DNS-prefetch hints for fonts.googleapis.com and supabase.co

5. **Revenue-Blocking Bugs Fixed (P0)**:
   - Credit pack metadata now maps priceId to correct credit amount (10/50/200 instead of hardcoded "10") — fix in `src/lib/monetization.functions.ts`
   - Confirmed `add_credits` RPC migration already exists at `supabase/migrations/20260728200000_stripe_credits_infrastructure.sql`
   - New FAQ entry: "Why pay Signhify instead of using AI tools directly?" — handles core objection
   - Pricing FAQ now leads with objection-handling content

6. **Content & Conversion**:
   - 5 new blog posts in `src/lib/insights.data.ts` (17 total): AI SaaS MVP cost, AI agent guide, TanStack vs Next.js, BYOK encryption guide, product timeline
   - `/free-consultation` landing page: lead capture form + Calendly integration
   - `/saas-mvp` landing page: dedicated Sprint MVP offering page with social proof

7. **GitHub Presence & Community**:
   - `README.md` updated with comparison table vs Cursor/Lovable/v0/Bolt, use cases, star chart
   - `.github/FUNDING.yml` created (GitHub Sponsors, BuyMeACoffee, PayPal, Ko-fi, Open Collective)
   - `.github/profile/README.md` org profile created
   - `CONTRIBUTING.md` expanded with community sections (first-time contributors, code of conduct)
   - `public/llms.txt` expanded for AI crawler indexing
   - `scripts/github-optimization.md` — 20 recommended topics, GitHub Trending playbook, issue templates

8. **Outreach & Social Materials**:
   - `scripts/linkedin-content-calendar.md` — 30-day calendar, 8 posts (2/week), copy + hashtags + media
   - `scripts/twitter-content-calendar.md` — 30-day calendar, 20 posts (5/week) including threads
   - `scripts/directory-listing-guide.md` — 22 directories ranked by lead quality (Clutch #1)
   - `scripts/outreach-email-templates.md` — 5 campaign types with full copy (cold, follow-up, partnership, PH launch, referral)
   - `scripts/social-profile-optimization.md` — 5 profiles with exact copy (LinkedIn personal/company, Twitter, GitHub, YouTube)

9. **Navigation Updates**:
   - SiteHeader: added "AI Studio" nav item → `/best-ai-engineering-studio`

11. **Production Bug Fixes, CSP Hardening & Global Revenue Features (28 Jul 2026)**:
    - **Fixed Route Crash (`Rocket is not defined`)**: Imported missing `Rocket` icon in `src/routes/best-ai-engineering-studio.tsx`.
    - **CSP Header Overhaul (`src/server.ts`)**: Updated `CSP_HEADER` to permit Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), Calendly (`calendly.com`, `assets.calendly.com`), Stripe (`js.stripe.com`), YouTube (`youtube.com`), Vimeo (`vimeo.com`), and Loom (`loom.com`) for frame-src, script-src, style-src, font-src, and connect-src.
    - **TypeScript & Link Hardening**: Resolved search params (`redirect: "..."`) for `/login` links across `src/routes/builder.tsx` and `src/routes/pricing.tsx`. Safeguarded `loaderData` in `src/routes/insights.$slug.tsx`. Fixed Supabase query types in `telemetry.functions.ts` & `waitlist.functions.ts`.
    - **Interactive Instant Sprint Scoper**: Engineered a 2-step scoper & micro-form inside `src/components/sections/CtaSection.tsx` connected to `submitLead` server function and Supabase `leads` table.
    - **Dual Booking Engine (`src/routes/book.tsx`)**: Upgraded `/book` to support both direct Instant Booking Form (with direct WhatsApp confirmation) and Calendly iframe option.
    - **Build & Git Verification**: Passed `npx tsc --noEmit` (0 errors) and `npm run build` (35s Nitro build). Committed (`943a06b`, `da5e17e`, `5c6b887`) and pushed to `https://github.com/Warriorlegacy/Signhify_Studio.git` (main branch).

---

## 🛠️ 4. Technical Architecture Reference

- **Framework**: TanStack Start (Vite + React + SSR).
- **Router**: TanStack Router (file-based routing in `src/routes/`).
- **Database & Auth**: Supabase (database migrations in `supabase/migrations/`).
- **Admin Verification**: centralized in `src/lib/admin.ts`.
- **Site URL**: centralized in `src/lib/site-url.ts` (used by all server functions).
- **CI/CD**: GitHub Actions at `.github/workflows/ci.yml` (lint + build on push/PR).
- **Important Paths**:
  - Main Layout: `src/routes/__root.tsx`
  - Sitemap handler: `src/routes/sitemap[.]xml.ts`
  - Asset Mockups: `public/images/`
  - BYOK Quick Config: `src/components/ai/AiKeyQuickConfig.tsx`
  - Ai Keys Settings Panel: `src/components/settings/AiKeysPanel.tsx`
  - Manual Payments Server Functions: `src/lib/manual-payments.functions.ts`
  - Centralized Site URL: `src/lib/site-url.ts`
  - Prisma Schema: `prisma/schema.prisma`
  - Outreach Scripts: `scripts/` (calendars, guides, templates)
  - GEO Files: `public/llms.txt`, `public/llms-full.txt`, `public/ai-directory.json`, `public/.well-known/`
  - Landing Pages: `src/routes/best-ai-engineering-studio.tsx`, `src/routes/best-vibe-coding-platform.tsx`, `src/routes/best-digital-marketing-studio.tsx`, `src/routes/free-consultation.tsx`, `src/routes/saas-mvp.tsx`
