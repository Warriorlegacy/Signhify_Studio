---
name: claude-seo
description: "Comprehensive SEO analysis for any website or business type. Full site audits, single-page analysis, technical SEO (crawlability, indexability, Core Web Vitals with INP), schema markup, content quality (E-E-A-T), image optimization, sitemap analysis, and GEO for AI Overviews/ChatGPT/Perplexity. Industry detection for SaaS, e-commerce, local, publishers, agencies."
---

# SEO: Universal SEO Analysis Skill

Comprehensive SEO analysis across all industries (SaaS, local services, e-commerce, publishers, agencies). Orchestrates 24 sub-skills and 18 sub-agents.

## Quick Reference

| Command | What it does |
|---------|-------------|
| `audit <url>` | Full website audit with parallel subagent delegation |
| `page <url>` | Deep single-page analysis |
| `sitemap <url or generate>` | Analyze or generate XML sitemaps |
| `schema <url>` | Detect, validate, and generate Schema.org markup |
| `images <url or optimize>` | Image SEO: on-page audit, SERP analysis, file optimization |
| `technical <url>` | Technical SEO audit (9 categories) |
| `content <url>` | E-E-A-T and content quality analysis |
| `content-brief <topic or url>` | Generate detailed SEO content brief |
| `geo <url>` | AI Overviews / Generative Engine Optimization |
| `plan <business-type>` | Strategic SEO planning |
| `local <url>` | Local SEO analysis (GBP, citations, reviews, map pack) |
| `backlinks <url>` | Backlink profile analysis |
| `cluster <seed-keyword>` | SERP-based semantic clustering |
| `competitor-pages [url\|generate]` | Competitor comparison page generation |

## Scoring

**SEO Health Score (0-100):** Technical 22%, Content Quality 23%, On-Page 20%, Schema 10%, Performance 10%, AI Search Readiness 10%, Images 5%.

**Priority:** Critical (blocks indexing), High (1 week), Medium (1 month), Low (backlog).

## Industry Detection

- **SaaS**: pricing, /features, /integrations, "free trial"
- **Local**: phone, address, service area, Google Maps
- **E-commerce**: /products, /cart, product schema
- **Publisher**: /blog, /articles, article schema
- **Agency**: /case-studies, /portfolio, client logos

## Quality Gates

- WARNING at 30+ location pages (60%+ unique content required)
- HARD STOP at 50+ location pages
- Never recommend HowTo schema (deprecated Sept 2023)
- FAQ schema: retired May 7, 2026 — use QAPage for genuine Q&A
- All CWV references use INP, never FID

## Source

**GitHub:** AgriciDaniel/claude-seo · ⭐ 11.4k  
Install the full repo for 24 sub-skills, Python tools, and Chromium-based analysis: `npx skills add AgriciDaniel/claude-seo`
