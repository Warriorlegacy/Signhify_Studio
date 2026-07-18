# Signhify AI Studio — Session Context & Handover

This document serves as the complete session context state to allow another AI agent or developer to resume work seamlessly.

---

## 📋 1. Outstanding Tasks & Next Steps

- [ ] **Google Business Profile Verification**: The profile has been created. Service areas are set to (India, US, UK, Canada, Australia, UAE) and the ads campaign keywords are pruned to 9 target keywords. Photos (logo + storefront mockup) have been uploaded. We are waiting on Google's moderation approval (2-24 hours). The next agent should assist the user once Google prompts for video/postcard verification.
- [ ] **Search Engine Indexing & Autocorrect Bypass**: Google Search Console has successfully fetched the sitemap (`/sitemap.xml`) with **44 discovered pages**.
  - **Issue**: Google currently auto-corrects the search query `Signhify AI Studio` to `Did you mean: Singify AI Studio` due to a lack of brand search volume.
  - **Action**: Once the crawler indexes the sitemap pages, Google will associate the brand name with the site. The next agent should guide the user to perform search-and-click operations to build search volume and stop autocorrect.
- [ ] **Bing Webmaster Tools Import**: Recommend the user imports their verified Search Console property into Bing Webmaster Tools for instant indexation on Bing/Yahoo/DuckDuckGo.
- [ ] **Apply Supabase migration to production**: Run `supabase/migrations/20260718210000_byok_custom_endpoint_manual_payments.sql` on the production Supabase project (new tables: `user_ai_key_custom_endpoints`, `manual_payment_requests`).

---

## 🔑 2. Admin Infrastructure Access

To access the cloud, OS, and deployment dashboard as an administrator:
* **Admin Login URL**: `https://signhify.dpdns.org/login`
* **Admin Email**: `piyushrajsingh092@gmail.com` (or `rajpiyush092@gmail.com`)
* **Secure Generated Password**: `SignhifyOS_SecureAdminPass2026!`
* **Auth mechanism**: Centralized check in `src/lib/admin.ts` (`isAdminEmail` helper) which is called by both client routers and server middleware (`publish-checks.functions.ts`).

---

## ✅ 3. Completed Work in this Session

1. **Domain Migration**:
   - Replaced all 200+ instances of the old domain `signhify.online` with the permanent domain `signhify.dpdns.org` across all components, server functions, edge functions, configurations, and PRD documents.
2. **SEO Foundation**:
   - Configured `robots.txt`, `llms.txt`, and `manifest.json`.
   - Setup comprehensive meta tags and 4 JSON-LD structured schemas (Organization, WebSite, ProfessionalService, SoftwareApplication) in `src/routes/__root.tsx`.
   - Setup dynamic sitemap generation in `src/routes/sitemap[.]xml.ts`.
3. **Core Services Alignment**:
   - Updated descriptions and service lists to explicitly include **Digital & Performance Marketing** as a core offering.
   - Generated a high-quality service image (`digital-marketing.png`) and storefront photo mockup (`signhify_storefront.png`) using stable diffusion.
4. **Git Repository Push**:
   - Committed and pushed all updates to main branch at `https://github.com/Warriorlegacy/Signhify_Studio.git`.
   - Verified compilation locally via `npm run build` (clean client & SSR bundles built in ~2 mins).
5. **Infrastructure & Deployment Hardening**:
   - **Centralized SITE_URL**: Created `src/lib/site-url.ts` as single source of truth (`process.env.VITE_SITE_URL || process.env.SITE_URL || "https://signhify.dpdns.org"`). All 5 server functions (monetization, stripe-checkout, stripe-portal, stripe-subscribe, publish-checks) and sitemap now import from this shared module instead of having 3+ different hardcoded fallbacks.
   - **Created `.env.example`**: Documents all 20+ environment variables (Supabase, Stripe, Cloudflare, Secrets, AI) with descriptions — no more grep-only discovery.
   - **GitHub Actions CI** (`.github/workflows/ci.yml`): Runs `bun install → lint → build` on push/PR to main.
   - **Cleaned up Sentry dead config**: Removed unused `@sentry/node` / `@sentry/tracing` from Vite externals (packages were never imported — only a 4-line stub `console.error` existed).
   - Verified build passes cleanly after all changes.
6. **BYOK Quick Config (🔑 header button)**:
   - Built `src/components/ai/AiKeyQuickConfig.tsx` — inline dropdown in site header for selecting AI provider and entering API key on any page.
   - Updated `SiteHeader.tsx` to render the 🔑 button next to the existing AI link.
   - No page navigation needed to switch keys.
7. **AiKeysPanel — OpenAI + Custom Endpoints**:
   - Added OpenAI provider to `src/components/settings/AiKeysPanel.tsx`.
   - Added Custom Endpoint provider (arbitrary base URL + key) for self-hosted/alternative LLM backends.
   - Enabled custom provider in `BYOK_PROVIDERS` list (`src/lib/ai-access.server.ts`).
8. **api_endpoint field**:
   - `src/lib/user-ai-keys.functions.ts`: added `api_endpoint` column + server logic so custom endpoints persist per user.
9. **Manual Payments**:
   - Created `src/lib/manual-payments.functions.ts` — server functions for creating/approving/denying manual payment requests (offline billing, wire transfers, custom invoicing).
   - Added manual payment route to `src/routes/app/billing/index.tsx` (status display + request upgrade banner).
   - Added manual payment FAQ section to `src/routes/pricing.tsx`.
10. **Supabase Migration**:
    - `supabase/migrations/20260718210000_byok_custom_endpoint_manual_payments.sql`: Creates `user_ai_key_custom_endpoints` and `manual_payment_requests` tables.
11. **Prisma Init**:
    - `prisma/schema.prisma` + `prisma.config.ts`: initial Prisma ORM schema, ready for future data layer migration.
12. **Keepalive Workflow**:
    - `.github/workflows/keepalive.yml`: weekly cron to prevent GitHub Actions from going dormant on free org.
13. **Verified Google OAuth Authentication**:
    - Configured and saved the correct `https://signhify.dpdns.org` Site URL and allowed redirect URIs in the Supabase Authentication dashboard.
    - Successfully verified that the "Continue with Google" flow correctly authenticates the admin account (`piyushrajsingh092@gmail.com`) and redirects them to the live `/app/deploy` dashboard.

---

## 🛠️ 4. Technical Architecture Reference

* **Framework**: TanStack Start (Vite + React + SSR).
* **Router**: TanStack Router (file-based routing in `src/routes/`).
* **Database & Auth**: Supabase (database migrations in `supabase/migrations/`).
* **Admin Verification**: centralized in `src/lib/admin.ts`.
* **Site URL**: centralized in `src/lib/site-url.ts` (used by all server functions).
* **CI/CD**: GitHub Actions at `.github/workflows/ci.yml` (lint + build on push/PR).
* **Important Paths**:
  - Main Layout: `src/routes/__root.tsx`
  - Sitemap handler: `src/routes/sitemap[.]xml.ts`
  - Asset Mockups: `public/images/`
  - BYOK Quick Config: `src/components/ai/AiKeyQuickConfig.tsx`
  - Ai Keys Settings Panel: `src/components/settings/AiKeysPanel.tsx`
  - Manual Payments Server Functions: `src/lib/manual-payments.functions.ts`
  - Centralized Site URL: `src/lib/site-url.ts`
  - Prisma Schema: `prisma/schema.prisma`
