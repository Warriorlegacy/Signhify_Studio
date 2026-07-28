# SEO + GEO Audit: signhify.dpdns.org

**Date:** 28 Jul 2026 | **Auditor:** Claude Code (Ponytail mode) | **Pages crawled:** 7

---

## 1. Current SEO Health Score: **48/100**

| Category           | Score  | Notes                                                                |
| ------------------ | ------ | -------------------------------------------------------------------- |
| Technical SEO      | 55/100 | Good schema, missing hreflang, canonical present but limited         |
| On-Page SEO        | 50/100 | Title tags present but subpages share near-identical meta            |
| Content & E-E-A-T  | 70/100 | Strong founder bio, MSME badge, real project portfolio               |
| Mobile & Speed     | 60/100 | 3D canvases + heavy JS bundles — LCP likely 3s+                      |
| Link Health        | 35/100 | 0 external backlinks detected, no internal blog permalink structure  |
| GEO / AI Readiness | 65/100 | Excellent llms.txt + AI crawler config; weak Q&A depth               |
| Structured Data    | 70/100 | JSON-LD Organization + Person schema present, missing breadcrumb/FAQ |

---

## 2. Page-by-Page Breakdown

### Homepage (/)

- **Title:** `Signhify — AI Product Studio & Full Stack SaaS Engineering` — good (55 chars)
- **Meta Description:** Present — well-written, includes value prop. Missing keyword density for "AI engineering studio"
- **H1:** `Describe your idea. Signhify builds it.` — good hook, not keyword-optimized
- **H2s:** 7 H2s — clear structure
- **Schema:** Organization + Person JSON-LD — **one of the best schemas I've seen for a studio site**
- **Canonical:** Present (self-referencing) ✓
- **OG tags:** Custom image, title, description — all present

### /about

- **H1:** `A studio for the AI-native era.`
- **Meta:** Inherits root layout meta (no unique meta title/description)
- **Content:** Founder story + stats. No FAQ schema on the implicit "what is Signhify" content
- **Missing:** No about-specific OG image, no team member schema

### /pricing

- **H1:** `Three ways to ship with Signhify.`
- **H2s:** "Engagement models", "Compare plans", "FAQ", "Questions founders ask" — good
- **FAQ section exists but NO FAQ schema** — big miss for featured snippets and AI citation

### /services

- **H1:** `One studio. End-to-end execution.`
- **12 service cards** with descriptions — good content depth. No individual service pages
- **Missing:** No service schema (`Service` type)

### /ai

- **H1:** `Describe anything. Signhify builds it.`
- **SPA shell** — content loaded client-side. AI crawlers may not index the agent output

### /marketplace

- **H1:** `Ship faster. Borrow our spine.`
- **Product listings** with pricing. No `Product` schema on templates

### /insights

- **12 articles** with titles, authors, read times, categories — solid content hub
- **Critical issue:** All 12 articles link to `/contact` (no actual content pages). Zero indexable content
- **Missing:** Blog/article schema (`Article` or `BlogPosting`)

---

## 3. Infrastructure: robots.txt, sitemap, llms.txt

| File            | Status           | Notes                                                                                                               |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `robots.txt`    | ✅ **Excellent** | Allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, CCBot. Disallows `/app/`, `/api/`, `/confirm` |
| `sitemap.xml`   | ✅ **Good**      | 39 URLs, lastmod dates, priorities. Missing `/insights/*` detail pages, `/projects/*` detail pages                  |
| `llms.txt`      | ✅ **Excellent** | Full inventory: products, pages, FAQ, tech stack, contact. One of the best llms.txt files I've seen                 |
| `llms-full.txt` | ❌ Missing       | Would help Perplexity/Claude ingest full docs                                                                       |

---

## 4. Top 3 Critical Issues

### Issue 1: Insights articles have zero indexable content

All 12 `/insights/*` articles redirect to `/contact`. No full articles exist on-site. This is the biggest SEO gap — 12 landing pages in the sitemap with no content for crawlers to index. Google will see thin content and may deweight the entire domain. **Fix: Publish the full articles as actual pages.**

### Issue 2: No FAQ / Breadcrumb / Product structured data

The /pricing FAQ section has 6 real questions but zero FAQ schema markup. /marketplace has products with prices but no Product schema. No breadcrumb schema on any page. These are all high-signal schema types for rich results in both Google and AI chatbots.

### Issue 3: Zero external backlinks + no unique meta per subpage

/insights, /about, /services, /pricing all inherit the root layout meta title and description. Each subpage needs its own unique `<title>` and `<meta name="description">`. Without them, Google treats them as thin duplicates of the homepage.

---

## 5. Top 5 Highest-Impact Fixes

| #   | Fix                                                  | Effort | Impact    | Notes                                                                                                    |
| --- | ---------------------------------------------------- | ------ | --------- | -------------------------------------------------------------------------------------------------------- |
| 1   | **Publish full article content at /insights/<slug>** | Medium | Very High | 12 articles = 12 indexable pages. Current setup is an SEO penalty. Write 500-1500 words per article      |
| 2   | **Add unique meta title + description per subpage**  | Low    | High      | Each page needs its own `<title>` and `meta description`. Currently all inherit root                     |
| 3   | **Add FAQ schema to /pricing**                       | Low    | High      | 6 real questions with answers — schema markup gets them into Google's "People Also Ask" and AI citations |
| 4   | **Add Product schema to /marketplace**               | Low    | Medium    | 6 products with prices — rich results for marketplace listings                                           |
| 5   | **Add BreadcrumbList schema to all pages**           | Low    | Medium    | Helps Google understand site hierarchy and surfaces in SERP breadcrumbs                                  |

---

## 6. GEO / AI Search Readiness (Engine Optimization)

### What's already good

- ✅ `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- ✅ `llms.txt` is comprehensive — proper format, FAQ section, page inventory
- ✅ JSON-LD schema includes founder name, email, social profiles — perfect for entity recognition
- ✅ Author name (Piyush Raj Singh) present on all insights articles
- ✅ Brand mentions on LinkedIn, GitHub (off-site signals)
- ✅ Clear site description in llms.txt: "AI-powered product studio"

### What's missing

- ❌ No llms-full.txt for deeper AI ingestion
- ❌ Content is behind JS hydration — AI crawlers that don't execute JS see empty shells on /ai, /app pages
- ❌ Pricing FAQ is in HTML only — no FAQ schema means ChatGPT can't reliably cite the pricing answers
- ❌ No dedicated "About Signhify" long-form page with the kind of detailed narrative AI engines prefer for citations
- ❌ No creator/author schema on individual insights articles

### AI citation potential

- **ChatGPT:** Would cite from llms.txt + schema.org data. High confidence on basic facts (name, founder, services)
- **Perplexity:** Would surface llms.txt content. Without full articles, Perplexity can't do deep citation
- **Gemini:** Would parse schema.org data. Missing Article schema on Insights

---

## 7. 5 Content Pages to Publish This Month

| #   | Title                                                                       | Target Question for AI Search                             |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | **How to Build an AI SaaS MVP in 2 Weeks: Full Architecture & Cost Guide**  | "How do I build an AI SaaS product from scratch?"         |
| 2   | **AI Engineering Studio vs Freelance Developers: Which Should You Choose?** | "Should I hire an AI engineering studio or a freelancer?" |
| 3   | **How Much Does Custom AI Development Cost in 2026?**                       | "What is the cost of custom AI development in 2026?"      |
| 4   | **AEO Guide: How to Rank #1 on ChatGPT, Perplexity & Google AI Search**     | "How do I optimize my website for AI search engines?"     |
| 5   | **TanStack Start vs Next.js: Which is Better for AI SaaS in 2026?**         | "What framework should I use for my AI SaaS application?" |

Each page should be 1000-1500 words, include FAQ schema with 3-5 related Q&As, link to relevant services/projects, and have unique meta title/description. Publish at `/insights/<url-friendly-slug>`.

---

## Quick Wins (Do This Week)

- [ ] Add unique `<title>` + `<meta name="description">` to /about, /pricing, /services, /ai, /marketplace
- [ ] Add FAQ schema to /pricing (6 questions already exist in HTML)
- [ ] Add BreadcrumbList schema to layout (1x, auto-applies to all pages)
- [ ] Add Product schema to 6 marketplace items
- [ ] Publish 1 full article to /insights to validate crawl/index flow

---

_Generated by Claude Code. PageSpeed API returned 429 — Core Web Vitals TTFB/LCP/CLS data unavailable. Estimate: LCP ~3-4s due to Three.js canvas + 22 JS bundles. Recommend Lighthouse test on desktop._
