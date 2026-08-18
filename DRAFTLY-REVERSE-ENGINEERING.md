# Draftly.space — Complete Reverse Engineering Report (FINAL)

> Date: 2026-08-18 · Method: Firecrawl (map/scrape) + direct HTTP analysis of server-rendered HTML, JS bundles, CSS, RSC flight payloads, and live API probing.
> Raw evidence: `.firecrawl/draftly/` (home.html, pages/, chunks/, preset-sites/, i18n-en.json, i18n-en-dump.txt)

---

## 1. What It Is

**Draftly** — "AI 3D Website Builder: Cinematic Scroll Websites from a Single Prompt."
Type a prompt → AI generates a complete scroll-reactive site (copy + cinematic video + imagery) → publish to a live URL in ~5 min. Competes with Framer/Webflow/Relume on "cinematic motion" as the wedge. Indian startup ("Built in India"), contact `support@draftly.business`, predecessor brand **draffi.space** (still in code). 11,400+ sites built, <3 min median time to first live URL.

---

## 2. Infrastructure

| Layer | Tech | Evidence |
|---|---|---|
| Hosting | **Vercel** | `Server: Vercel`, `X-Vercel-Id: bom1::iad1::...` |
| Framework | **Next.js App Router** (RSC, server-rendered, ~250KB HTML) | `X-Powered-By: Next.js`, `Vary: RSC, Next-Router-*` |
| i18n | **next-intl** + middleware, 9 locales (en,hi,es,pt,fr,de,ja,zh,ar) | `X-Matched-Path: /[locale]`, hreflang set |
| Auth | **Firebase Auth** (Google) | CSP, `/__/auth/:path*` rewrite, `getIdToken()` |
| DB/Storage | **Firebase** (project **`draflty`** — typo'd) | `projectId:"draflty"`, `draflty.firebasestorage.app` |
| Media gen | **fal.ai** | CSP `*.fal.ai`/`fal.media`; "Gemini Omni Flash via fal" |
| Payments | **Dodo Payments** + Stripe Buy Button embeds | CSP `api.dodopayments.com`, `/api/dodo/verify` |
| Published-site CDN | **Cloudflare** | Docs: HTML → Firebase Storage → Cloudflare CDN at `*.draftly.space` |
| Analytics | GA4 `G-P6S60N1JV1`, GTM, Meta Pixel, Clarity, Firebase Analytics, Vercel Insights | CSP + `measurementId` |

### Leaked Firebase config (public web config — still notable)
```js
apiKey:            "AIzaSyDQTD9SHIJ9BMnauJ2cJevIVxYxtuWJJaY"
authDomain:        "draflty.firebaseapp.com"
projectId:         "draflty"
storageBucket:     "draflty.firebasestorage.app"
messagingSenderId: "999469134861"
appId:             "1:999469134861:web:207bd3ee83fee13bd6d144"
measurementId:     "G-P6S60N1JV1"
```

---

## 3. AI Engine Stack ("Inside the Agent" — draftly.space/engine)

| Engine | Role | Backend (from code) |
|---|---|---|
| **Draftly Composer** | End-to-end site generation (scroll-reactive HTML+CSS+JS) | **Claude Opus 4.7** — `websiteModelId:"claude-opus-4-7"` |
| **Draftly Composer Extended** | Long-form/multi-page builds (extended thinking) | Claude (server-side) |
| **Draftly Vision / Vision Lite** | Hero imagery 2K/4K (Lite = 1K previews) | fal.ai |
| **Omni Flash** | Cinematic video 720p–4K, scroll-frames | "Gemini Omni Flash via fal" (Gemini video model on fal.ai) |
| **Draftly Concierge** | Site-aware AI chat widget on published Business OS sites | site-owner API key (BYOK supported) |

Cost model: builds billed per **token** (client tracks `promptTokens/completionTokens/totalTokens`); video cost = `ceil(rate × multiplier)`; trials have `daily`/`trial` credit kinds that refresh.

---

## 4. Generated-Site Runtime

**Single self-contained `index.html`** — all CSS in `<style>`, all JS in `<script>`, hero image on CDN, Google Fonts CDN (curated: Manrope, Sora, etc.). Stack:

- **GSAP** + ScrollTrigger + ScrollToPlugin + CustomEase (everything scroll-scrubbed)
- **Lenis** smooth scroll · **SplitType** text splits
- Canvas starfield/occluder layers; **no WebGL** — "3D" = CSS 3D transforms + scroll-scrubbed mp4 (720p–4K)
- Preloader with progress arc + 7–9s escape hatches; `prefers-reduced-motion` respected
- Published sites get injected Business OS extras: GTM `<noscript>` iframe, forms, leads dashboard, analytics, AI concierge

### Publishing pipeline
1. Publish Live → HTML to **Firebase Storage** → served via Cloudflare CDN at `*.draftly.space`
2. Cache purged → live in ~5s. Free, unlimited re-publishes.
3. Subdomain rules: 3–40 chars, lowercase/numbers/hyphens, reserved-word blocklist
4. Custom domains via CNAME (Pro+)

### Exports
Copy HTML (all) · ZIP + README (Basic+) · GitHub push + Pages workflow (Pro+) · deploy to Vercel/Netlify/Cloudflare Pages/S3

### 4b. Preset Runtime Comparison (6 presets diffed)

| Preset | html/js | Distinctive mechanics | Sections | Palette |
|---|---|---|---|---|
| **aether** | 27.8KB/33.6KB | starfield canvas, 4 planets (MERIDIAN/KESH/VELD/ORRIN), hard wipes, image preloader | entry-01..04, surface, archive, compare | #7FFFD4 #FF8A3D #8FD3FF |
| **volta** | 19.8KB/17.3KB | **360° turntable** (quickTo×5), finish picker (Six paints. Two rims.), exploded parts (41 parts), curtain-wipe page transitions | page-home/models/tech, turn, expl, services, about, contact | #0c0c0d + #ffd84d |
| **obsidian** | 24.2KB/23.9KB | pin×14, clip-path/mask reveals, serif editorial deck collapse, 7 artefacts (The Keeper/The Elder/The Guardian) | hero, archive, doctrine, connection, index | #191410 + #c4622d |
| **vanta** | 21.1KB/30.3KB | drive-occluder canvas, silk-lift mask, wordmark interleave, pin×11, 4 paint configs | reveal, specs, drive, gallery, config, outro, reserve | #0a0a0b + #ff4d14 |
| **threshold** | 24.8KB/30.9KB | arch-shaped mask×6, pin×10, portal to six worlds, scroll-scrubbed video | portal, index, conditions, transit | #0b0b0c + #e8ff3a |
| **helix** | 25.4KB/32.3KB | ScrollTrigger.batch, mask×3, dark→light page inversion, unfold/explode sequences, 6 videos | hero, unfold, explode, tech, flight, specs, order | #0e0e12 + #7b5cff #ff3dcb |

Common across all: Lenis + GSAP ScrollTrigger + CustomEase + SplitType, reduced-motion handling, 7–9s loader escape hatches, scroll-scrubbed video, canvas overlays.

---

## 5. API Surface (all `draftly.space/api`, Next.js route handlers)

**Agent / builder** (from `chunks/app/agent/page-*.js`):
```
POST /api/agent/build-prompt          {websiteType,...} → 3 suggested prompts
POST /api/agent/generate-image        {prompt, aspectRatio, projectId, jobId:"img_<ts>"}
POST /api/agent/generate-video        {imageUrls[], motionPrompt, aspectRatio, durationSec, purpose:"section"}
POST /api/agent/generate-site         {sitePrompt, motionPrompt, bgMode, mediaPath, navMode,...} → {siteCode, buildId, modelUsed}
POST /api/agent/upscale-image         {imageUrl, target}
POST /api/agent/upscale-video         {videoUrl, target, durationSec}
POST /api/agent/host-assets           {assets[]}
POST /api/agent/save-project          {projectId, name, sitePrompt, motionPrompt, bgMode, mediaPath, navMode, siteCode, messages[], framesCount, thumbnailUrl, videoUrl}
GET  /api/agent/list-projects
GET  /api/agent/load-project?projectId=
POST /api/agent/publish               {code, mode, videoUrl, frameCount, brandKicker,...} → {publishedUrl, subdomain}
GET  /api/agent/verify-frames?projectId=
POST /api/agent/rate-build            {projectId, buildId, rating, comment, model, promptLength}
```
**3D builder (manual editor)**: `/api/3d-builder/chat-edit {prompt, existingCode, messages[last 8]}` · `bundle-zip {code, mode, videoUrl, frameCount, brandKicker}` · `push-to-github {repoName, isPrivate, siteCode}` · `proxy-download-asset`
**Hosting**: `/api/hosting/connect-domain` · `disconnect-domain` · `verify-domain?domain=`
**Integrations**: `POST /api/integrations {action:"save", integrationId, payload}` (e.g. stripe `{publishableKey, secretKey}`)
**Auth/user/billing**: `/api/auth/embedded-bridge/create` · `local-google?redirect=` · `local-google/status` · `send-verification-email` · `/api/dodo/verify?userId=&email=` · `/api/notifications?limit=20` · `/api/user/activity-ping`
**Affiliate**: `/api/affiliate/set-cookie` · `click` · `convert` (cookies `draftly_ref` / `draftly_utm`)

### Live auth probing (unauthenticated)
| Endpoint | Result |
|---|---|
| GET /api/agent/list-projects | 401 `{"error":"Missing or invalid authorization header"}` |
| GET /api/hosting/verify-domain | 401 `Unauthorized` |
| POST /api/agent/build-prompt, GET /api/agent/verify-frames, GET /api/integrations | 401 |
| GET /api/dodo/verify (junk) | 500 `Verification failed` (public-ish, server-side Dodo lookup) |
| GET /api/notifications | **500 not 401 — missing auth guard (bug)** |
| POST /api/auth/local-google/status | 405 |

All agent/hosting/integrations routes require `Authorization: Bearer <firebase idToken>`.

---

## 6. Builder App (route `/agent`)

- Flow: text brief + optional image upload (product/brand "look") → 3 generated prompts → build → preview → publish
- Section videos: chain-from-seed-image or element (`chain`/`element` radio), motion prompt ("the watch disassembles in mid-air…")
- Frame verification before publish ("live site would show blank frames otherwise")
- Chat-edit loop (patch copy/layout/colors, `patchCount` tracked), inline visual editing, hidden elements, "agent-build-button" tour
- Projects: save/load/resume, cloud save by plan, rate-build (4.8/5 avg)
- **Business OS** (Pro+): inbox, forms, leads dashboard + CSV, analytics, AI concierge, Stripe buy button
- Editor iframe on `app.draftly.space`; `?draftlyEditor=1` toggles editor overlay on published sites
- Integration blocks: GA4 (measurement ID input), GTM, Meta Pixel, LinkedIn, Clarity, TikTok, WhatsApp, cookie banner, Calendly/Cal.com, Zapier/Make webhook, CRM sync (HubSpot/Pipedrive)
- Iframe host allowlist: `draftly.space`, `www`, `app.draftly.space`, `draffi.space`, `www.draffi.space`

---

## 7. Design Tokens (marketing site)

- **Fonts** (self-hosted via next/font): Inter 400–700 (body), Space Grotesk 400–700 (display), JetBrains Mono 400–500 (code/eyebrows); Font Awesome 6.5.1 (icons)
- **Brand accent**: `#0096FF` (`--draftly-hero-sky` / blue-500), hover `#0088EB`
- **Dark navy system**: bg-deep `#030712` → bg-base `#050b18` → elevated `#0a1224` → surface `#0e1830`
- **Borders**: `rgba(102,200,255,.08/.14/.22)` · glows `rgba(0,150,255,…)` shadows
- Blue scale `#eef8ff → #002647`, Tailwind palette also present (emerald/indigo/amber/rose etc. for demo sections)
- Generated sites: CSS custom props per preset (`--ff`, `--sans`, `--serif`, `--display`, `--grotesk`, `--body`), Google Fonts CDN

---

## 8. i18n (next-intl catalogs — extracted from RSC flight payload)

6 sections: `common.{nav, auth, footer, errors, actions, presets}` — full en dump in `i18n-en-dump.txt`.

Key structure (en):
```
nav:    features, agent("New" badge), builder("3D Website Builder"), presets("Beta"),
        blog, pricing, contact, docs, mobileStartHere, openMenu, closeMenu
auth:   login, getStarted, signOut, profile, dashboard
footer: tagline("3D Website Builder for cinematic scroll experiences - generated from a single prompt."),
        sections{product,company,resources,legal}, links{22}, bottomBar{copyright,builtInIndia}, social{4}
errors: generic, notFound
actions: save/cancel/delete/confirm/close/back/next/submit
presets: buildYourOwnPage{title, description, backToGallery, useExample, promptPlaceholder,
         submit, footnote, building, buildFailed, generatingSite, matchingPresets,
         signInRequired, signInLink, signInSuffix}
```
**Finding: i18n is cosmetic.** All 9 locale routes serve identical English UI (verified hi + ja vs en); only blog articles are per-locale translated (e.g. `/ja/blog/india/...`). SEO hreflang coverage without translation effort.

---

## 9. Site Map (111 English pages ≈ 1,000 with i18n)

```
/ (home) · /agent (builder) · /pricing · /features · /integrations · /engine
/about · /contact · /affiliate · /help · /changelog (CSR) · /mcp (CSR)
/docs/* (25): getting-started, account-setup, quick-start, plans-overview,
  credits-reference, billing, builder-overview, prompt-guide, image/video-generation,
  editing, customization-guide, seo-guide, publishing, design-system, presets,
  deployment, error-reference, github-integration, custom-api-key, installation
/presets (65: aether, volta, obsidian, vanta, threshold, helix, bionova, ...)
/preset-sites/:slug (live previews, static via rewrite: /preset-sites/:slug → :slug/index.html)
/blog + categories (tutorials, product, india, seo, industry) + ~10 articles
/legal (privacy, terms, cancellation, cookies, compliance, dpa)
```

---

## 10. Business Model

| Plan | $/mo (annual) | Credits | Full builds | Extras |
|---|---|---|---|---|
| Basic | $20 ($25) | 1,500 | ~3 | 720p, 5 live sites, 25GB, ZIP |
| Basic Plus | $32 ($40) | 2,500 | ~5 | scroll effects, ref images |
| Pro | $48 ($60) | 6,000 | ~12 | Business OS, Topaz upscale 2K, priority |
| Premium | $160 ($200) | 25,000 | ~50 | 4K, custom domains, BYOK, connectors |

- Credit top-ups: 1,000cr/$20 · 3,000cr/$50 · 7,000cr/$100 (stack on cycle, roll over)
- Interactive pricing calculator; affiliate program (cookie + click/convert tracking); cancel anytime

---

## 11. Notable Findings

1. **Firebase prod typo**: project `draflty` (auth domain, storage bucket all typo'd). Config is public by design — but direct Firestore/Storage access attempts are only as safe as the security rules.
2. **MCP server** (`/mcp`) for Claude Code / Cursor / Windsurf — agentic-builders-own-MCP is the emerging pattern.
3. **Legacy `draffi.space`** still whitelisted in editor frame checks.
4. **Cost model in client** (video = ceil(rate×multiplier), token metering) — server is authority but client reveals rates.
5. All marketing pages server-rendered; only builder/changelog/mcp are client-rendered.
6. **i18n cosmetic** — 9 locales, English UI, translated blog only.
7. **Bug**: `/api/notifications` 500s unauthenticated (missing guard).
8. **Custom auth bridge** (`/api/auth/local-google`, `embedded-bridge/create`) — custom Google sign-in for the builder iframe, unusual vs stock Firebase popup.
9. No WebGL anywhere — the "3D" moat is scroll-scrubbed video + GSAP craft; a clone needs a killer motion-spec prompt, not a WebGL engine.
10. Dodo Payments (India-friendly) + Stripe embeds → dual payment rails; credits metered per token/video.

---

## 12. Replication Blueprint

1. **Frontend**: Next.js App Router + Tailwind + next-intl on Vercel; prompt → 3-step flow (brief → prompt gen → build → publish).
2. **Generation**: Claude Opus-class LLM emitting a complete self-contained HTML file against a strict motion spec (GSAP ScrollTrigger + CustomEase + Lenis + SplitType + scroll-scrubbed video + design-system grammar) to keep output consistent.
3. **Media**: fal.ai queue (image + Gemini video), resolution tiers, Topaz-style upscaling on higher plans.
4. **Publish**: object storage → CDN with wildcard subdomains + cache purge; CNAME custom domains; reserved-word blocklist.
5. **Auth/pay**: Firebase Auth (Google) + Dodo/Stripe; credit ledger per token/video; plan gates enforced server-side.
6. **Retention**: chat-edit patch loop, Business OS add-ons (forms/leads/analytics/concierge), preset gallery from real briefs, affiliate program, MCP server.
7. **SEO**: server-render everything, 9 hreflang locales (cheap — UI stays English, translate blog posts only).

---

*Evidence tree: `.firecrawl/draftly/` — chunks/ (27 JS + CSS + build manifest), pages/ (engine, pricing, mcp, agent, docs-*, preset-sites-*), preset-sites/{aether,volta,obsidian,vanta,threshold,helix}/ (index.html, script.js, style.css), i18n-{en,hi,ja}.json, i18n-en-dump.txt, homepage.json, home.html*

## 13. Frontend UI Design & Tech Stack (deep rescrape, 2026-08-18)

### Marketing site (draftly.space) - "dark glass + neon" design language
**Palette (CSS `:root` tokens)**
- Surfaces: 4-step dark navy scale `--draftly-bg-deep:#030712` -> `#050b18` -> `#0a1224` -> `--draftly-bg-surface:#0e1830`; cards `#0c0c16`
- Borders: blue-tinted `--draftly-border-subtle:rgba(102,200,255,.08)` / `.14` / `.22`; section dividers `border-white/[0.04]`
- Accent: 9-step blue scale (`--draftly-blue-300:#66c8ff`, `500:#0096ff`, `600:#0078d4`), hero sky `#0096ff` hover `#0088eb`
- Brand trio: `--brand-primary:#c6ff3a` (lime), `--brand-secondary:#3cffb0` (mint), `--brand-tertiary:#4fd6ff` (cyan)
- Glow system: `--draftly-glow-sm/md/lg` = `0 0 24/40/64px rgba(0,150,255,.12/.2/.28)`; focus rings `0 0 0 1px rgba(102,200,255,.35),0 4px 24px rgba(0,150,255,.28)`; status dots glow lime/mint/purple `0 0 20px rgba(x,.7),0 0 0 6px rgba(x,.15)`
- Easing: `--draftly-ease-out:cubic-bezier(0.16,1,0.3,1)` (expo-out) on every hover/reveal

**Typography** - Inter (UI, 10-18px), Space Grotesk (`font-display`, h2s at `text-4xl`->`lg:text-[72px]` bold `tracking-tight` `leading-[1.05]`), JetBrains Mono (code/uppercase labels), Font Awesome 6.5.1 (cdnjs) for icons. Micro-labels: 9-11px, `uppercase`, `tracking-[0.12em]`-`[0.2em]`, pill bg `bg-[#4fd6ff]/10 border border-[#4fd6ff]/20` or lime `bg-brand-primary/[0.12] border-brand-primary/[0.30]`.

**Page anatomy (6 sections)**
1. Hero: `relative h-screen !overflow-hidden` desktop full-screen interactive scene (z-10, behind nav), separate `mobile-hero-section` bg-black video variant
2. `#best-previews`: 6 preset cards, `grid-cols-1 md:2 xl:3`, card = `rounded-2xl xl:rounded-3xl border-white/[0.08] hover:border-white/[0.18] bg-[#0c0c16]`, `aspect-video` preview with per-preset gradient wash (e.g. `from-rose-950/40 via-[#0a0a0c] to-orange-950/30`), title + 2-line clamp description, `btn-preset-cta agent-glass-shine` CTA
3. `#features` "From prompt to **production**": 6-step pipeline `xl:grid-cols-6` connected by a hairline `via-[#c6ff3a]/20` gradient rule; icon tiles `w-14 h-14 rounded-2xl bg-white/[0.03]` -> `group-hover:scale-110 group-hover:text-[#c6ff3a]`
4. "Your video becomes" (video showcase section)
5. "Built for": 5 feature cards (`bg-white/[0.02] rounded-3xl border-white/[0.04] hover:bg-[#c6ff3a]/5 hover:border-[#c6ff3a]/30 backdrop-blur-md`)
6. Final CTA "Build 3D websites"

**Effects**: glassmorphism `backdrop-blur(8-32px) saturate(180%)`; ambient giant radial blobs (`blur-[120px]-[180px]`, 6-8% opacity, `bg-brand-tertiary/[0.06]`, lime `rgba(198,255,58,0.08)`); 1px grid-line backgrounds (white 3-6%); scroll reveals via inline `opacity:0;transform:translateY(28-40px)` (GSAP ScrollTrigger); shine sweep on CTA (`agent-shine-sweep`, diagonal white 30% band). Keyframes: `draftly-preset-glow`, `draftly-chat-ring-spin`, `handle-pulse(-green)`, `sign-in-shake-vigorous` (auth error), `float`, `slideUp`, `scaleIn`, `slide-in-left`. Button gradients: lime `#d9ff6e->#c6ff3a->#a9e02c`, blue diagonal `135deg rgba(0,120,212,.55)->rgba(0,150,255,.42)`.

### Builder UI (/agent) - completely different "warm dark studio" theme
- Fullscreen app `fixed inset-0 z-[120] bg-[#0a0905]`; surfaces `#141310`, borders `#1c1912`, hover borders `#3b3526`; text `#ebebea`, muted `#aba79f`, dim `#605c54`/`#807d75`
- Own display font `agent-serif` (26px editable site-title input, `border-b focus:border-brand-primary`)
- Lime `brand-primary` = action/focus color (progress fill `from-brand-primary/10 via-brand-primary`, focus rings); cyan `brand-tertiary` = uppercase mono badges `tracking-[0.14em]`; terracotta `#d97757` = destructive/pro CTA (hover `#c9694a`), `#bd5d3c` = warnings
- Glass cards `bg-black/90 backdrop-blur-xl shadow-[0_10px_36px_rgba(61,57,41,0.08)]`; dropdowns/popovers `rounded-xl/2xl shadow-[0_18px_50px.../0_24px_70px rgba(61,57,41,.14-.18)]`, `w-80 max-h-[min(70vh,560px)]`
- Upload = dashed `aspect-[4/3]` dropzone (`hover:border-brand-primary`); asset grid `grid-cols-2/3/4 gap-1-2` with hover-close; pill chips `rounded-full border-[#1c1912]`; slider with gradient fill bar `transition-[width] duration-500 ease-out`; status dots `animate-pulse` green `handle-pulse`
- Fonts: 9-14px UI text, mono for labels, FA icons (`fa-solid fa-lock` etc.)

### Tech stack (additions to Sec. 3)
Tailwind CSS (utility classes everywhere) + custom `:root` tokens; recharts (3 imports, analytics charts); Redux (4 imports); `gapi` (Google API client); Vercel Analytics; Font Awesome 6.5.1 cdnjs; GSAP + ScrollTrigger (marketing reveals); Firecrawl evidence: `chunks/0bf8f82adcefaab6.css` + `a7fabb98b35dfe1f.css` (272KB) = full token + component layer.

**Takeaway**: two design systems, one brand - marketing = blue/glass/navy cinematic, builder = warm-dark studio with lime energy. Replication: Tailwind + token layer (`:root` vars above) + GSAP reveals + Font Awesome is the entire visual stack; "3D" remains CSS/video illusion (no WebGL/three.js in marketing either).
