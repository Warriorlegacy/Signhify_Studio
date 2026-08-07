# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual\routes.spec.ts >> visual: services (/services)
- Location: tests\visual\routes.spec.ts:24:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: A snapshot doesn't exist at D:\Signhify\tests\visual\routes.spec.ts-snapshots\services-desktop-chromium-win32.png, writing actual.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Signhify AI Engineering StudioSignhify" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Signhify AI Engineering Studio" [ref=e5]
        - text: Signhify
      - navigation [ref=e6]:
        - link "Studio" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e8] [cursor=pointer]:
          - /url: /projects
        - link "Services" [ref=e9] [cursor=pointer]:
          - /url: /services
        - link "AINew" [ref=e10] [cursor=pointer]:
          - /url: /ai
        - link "Market" [ref=e11] [cursor=pointer]:
          - /url: /marketplace
        - link "Deploy" [ref=e12] [cursor=pointer]:
          - /url: /app/deploy
        - link "Cloud" [ref=e13] [cursor=pointer]:
          - /url: /app
        - link "OS" [ref=e14] [cursor=pointer]:
          - /url: /os
        - link "AI Studio" [ref=e15] [cursor=pointer]:
          - /url: /best-ai-engineering-studio
        - button "Ecosystem" [ref=e17]:
          - img [ref=e18]
          - text: Ecosystem
          - img [ref=e22]
        - button "AI Keys" [ref=e24]:
          - img [ref=e25]
      - link "Start a Project" [ref=e30] [cursor=pointer]:
        - /url: /contact
        - text: Start a Project
        - img [ref=e32]
      - button "Toggle menu" [ref=e34]:
        - img [ref=e35]
  - main [ref=e36]:
    - generic [ref=e38]:
      - navigation "Breadcrumb" [ref=e39]:
        - list [ref=e40]:
          - listitem [ref=e41]:
            - link "Home" [ref=e42] [cursor=pointer]:
              - /url: /
              - img [ref=e43]
              - text: Home
          - listitem [ref=e46]:
            - img [ref=e47]
            - text: Services
      - generic [ref=e49]: Services
      - heading "One studio. End-to-end execution." [level=1] [ref=e50]
      - paragraph [ref=e51]: We don’t hand off deliverables — we ship outcomes. From idea, through design, into production and beyond. Twelve capabilities. One team. Every build signed.
    - region "One studio. End-to-end execution." [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]:
          - generic [ref=e55]:
            - generic [ref=e56]: What we do
            - heading "One studio. End-to-end execution." [level=2] [ref=e57]
          - generic [ref=e58]:
            - paragraph [ref=e59]: Twelve core capabilities, one team. We stitch them together to ship outcomes — not deliverables.
            - link "Explore all services" [ref=e60] [cursor=pointer]:
              - /url: /services
              - text: Explore all services
              - img [ref=e61]
        - generic [ref=e64]:
          - generic [ref=e68]:
            - generic [ref=e69]:
              - img "AI Automation service preview" [ref=e70]
              - generic [ref=e71]: AI Automation
            - generic [ref=e72]:
              - generic [ref=e73]:
                - img [ref=e75]
                - generic [ref=e78]: AI Automation
              - paragraph [ref=e79]: Custom agents, workflows and integrations that remove operational friction — from inbox to invoicing.
          - generic [ref=e83]:
            - generic [ref=e84]:
              - img "AI & LLM Integrations service preview" [ref=e85]
              - generic [ref=e86]: AI & LLM Integrations
            - generic [ref=e87]:
              - generic [ref=e88]:
                - img [ref=e90]
                - generic [ref=e93]: AI & LLM Integrations
              - paragraph [ref=e94]: RAG pipelines, semantic search, vector databases, and custom fine-tuned model agents.
        - generic [ref=e95]:
          - generic [ref=e99]:
            - generic [ref=e100]:
              - img "SaaS Development service preview" [ref=e101]
              - generic [ref=e102]: SaaS Development
            - generic [ref=e103]:
              - generic [ref=e104]:
                - img [ref=e106]
                - generic [ref=e110]: SaaS Development
              - paragraph [ref=e111]: Multi-tenant products built to scale — auth, billing, dashboards, infra.
          - generic [ref=e115]:
            - generic [ref=e116]:
              - img "Web & Product service preview" [ref=e117]
              - generic [ref=e118]: Web & Product
            - generic [ref=e119]:
              - generic [ref=e120]:
                - img [ref=e122]
                - generic [ref=e127]: Web & Product
              - paragraph [ref=e128]: Cinematic websites, MVPs and product surfaces engineered for conversion.
          - generic [ref=e132]:
            - generic [ref=e133]:
              - img "CRM & Systems service preview" [ref=e134]
              - generic [ref=e135]: CRM & Systems
            - generic [ref=e136]:
              - generic [ref=e137]:
                - img [ref=e139]
                - generic [ref=e143]: CRM & Systems
              - paragraph [ref=e144]: Internal tools, CRMs and pipelines tailored to how your business actually runs.
          - generic [ref=e148]:
            - generic [ref=e149]:
              - img "API Engineering service preview" [ref=e150]
              - generic [ref=e151]: API Engineering
            - generic [ref=e152]:
              - generic [ref=e153]:
                - img [ref=e155]
                - generic [ref=e160]: API Engineering
              - paragraph [ref=e161]: High-throughput REST & GraphQL endpoints, webhooks, and secure third-party integrations.
          - generic [ref=e165]:
            - generic [ref=e166]:
              - img "Cloud & DevOps service preview" [ref=e167]
              - generic [ref=e168]: Cloud & DevOps
            - generic [ref=e169]:
              - generic [ref=e170]:
                - img [ref=e172]
                - generic [ref=e174]: Cloud & DevOps
              - paragraph [ref=e175]: Scalable hosting (AWS, Supabase, Vercel), continuous delivery, and load scaling.
          - generic [ref=e179]:
            - generic [ref=e180]:
              - img "Data & Analytics service preview" [ref=e181]
              - generic [ref=e182]: Data & Analytics
            - generic [ref=e183]:
              - generic [ref=e184]:
                - img [ref=e186]
                - generic [ref=e189]: Data & Analytics
              - paragraph [ref=e190]: Real-time reporting pipelines, database tracking, and custom metrics engines.
          - generic [ref=e194]:
            - generic [ref=e195]:
              - img "Mobile App Development service preview" [ref=e196]
              - generic [ref=e197]: Mobile App Development
            - generic [ref=e198]:
              - generic [ref=e199]:
                - img [ref=e201]
                - generic [ref=e203]: Mobile App Development
              - paragraph [ref=e204]: React Native and Flutter apps built for speed, offline capability, and App Store readiness.
          - generic [ref=e208]:
            - generic [ref=e209]:
              - img "Performance Marketing service preview" [ref=e210]
              - generic [ref=e211]: Performance Marketing
            - generic [ref=e212]:
              - generic [ref=e213]:
                - img [ref=e215]
                - generic [ref=e218]: Performance Marketing
              - paragraph [ref=e219]: Landing pages, funnels and paid acquisition systems that compound over time.
          - generic [ref=e223]:
            - generic [ref=e224]:
              - img "Security & Compliance service preview" [ref=e225]
              - generic [ref=e226]: Security & Compliance
            - generic [ref=e227]:
              - generic [ref=e228]:
                - img [ref=e230]
                - generic [ref=e233]: Security & Compliance
              - paragraph [ref=e234]: SOC2 readiness, penetration testing, secure auth policy, and data encryption audits.
          - generic [ref=e238]:
            - generic [ref=e239]:
              - img "Brand & Identity service preview" [ref=e240]
              - generic [ref=e241]: Brand & Identity
            - generic [ref=e242]:
              - generic [ref=e243]:
                - img [ref=e245]
                - generic [ref=e248]: Brand & Identity
              - paragraph [ref=e249]: Visual systems, logos and creative direction for AI-first brands that want to be remembered.
    - region "From a sentence to a shipped product — in weeks." [ref=e250]:
      - generic [ref=e251]:
        - generic [ref=e252]: How we work
        - heading "From a sentence to a shipped product — in weeks." [level=2] [ref=e253]
        - generic [ref=e254]:
          - generic [ref=e256]:
            - generic [ref=e257]: "01"
            - generic [ref=e258]:
              - img [ref=e260]
              - generic [ref=e262]: Step 01
            - generic [ref=e263]: Describe
            - paragraph [ref=e264]: You share the idea. We map outcomes, scope and stack in one working session.
          - generic [ref=e266]:
            - generic [ref=e267]: "02"
            - generic [ref=e268]:
              - img [ref=e270]
              - generic [ref=e276]: Step 02
            - generic [ref=e277]: Design
            - paragraph [ref=e278]: Cinematic UI, product architecture and AI surfaces — prototyped in days, not months.
          - generic [ref=e280]:
            - generic [ref=e281]: "03"
            - generic [ref=e282]:
              - img [ref=e284]
              - generic [ref=e286]: Step 03
            - generic [ref=e287]: Build
            - paragraph [ref=e288]: Engineered with modern stacks. Multi-tenant, typed, automated, production-ready.
          - generic [ref=e290]:
            - generic [ref=e291]: "04"
            - generic [ref=e292]:
              - img [ref=e294]
              - generic [ref=e299]: Step 04
            - generic [ref=e300]: Launch
            - paragraph [ref=e301]: We ship to your domain, wire analytics, payments and AI ops — and stay on for v2.
    - generic [ref=e304]:
      - generic [ref=e305]:
        - generic [ref=e306]: 14+ products shipped
        - generic [ref=e307]: Multi-tenant SaaS
        - generic [ref=e308]: AI-first engineering
        - generic [ref=e309]: Delivered in weeks
      - heading "Your idea, Signhified." [level=2] [ref=e310]
      - paragraph [ref=e311]: Scope your idea, pick your budget, and get a production-ready AI product deployed to your infrastructure in 14 days.
      - generic [ref=e312]:
        - button "Instant Sprint Scoper" [ref=e313]:
          - img [ref=e314]
          - text: Instant Sprint Scoper
          - img [ref=e317]
        - link "Book a 10-Min Call" [ref=e319] [cursor=pointer]:
          - /url: /book
          - img [ref=e320]
          - text: Book a 10-Min Call
      - paragraph [ref=e322]: No commitment. 100% Code Ownership on your GitHub from Day One.
  - contentinfo [ref=e323]:
    - generic [ref=e324]:
      - generic [ref=e325]:
        - generic [ref=e327]:
          - generic [ref=e328]: Signhify
          - generic [ref=e329]: AI Engineering Studio
        - paragraph [ref=e330]: Describe your idea. Signhify builds it. We design, ship, and scale AI-first products end-to-end — from MVP to revenue.
        - generic [ref=e331]:
          - img [ref=e332]
          - text: Registered MSME · Govt. of India (UDYAM)
      - generic [ref=e335]:
        - generic [ref=e336]: Studio
        - list [ref=e337]:
          - listitem [ref=e338]:
            - link "Services" [ref=e339] [cursor=pointer]:
              - /url: /services
          - listitem [ref=e340]:
            - link "Pricing" [ref=e341] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e342]:
            - link "Projects" [ref=e343] [cursor=pointer]:
              - /url: /projects
          - listitem [ref=e344]:
            - link "AI Generator" [ref=e345] [cursor=pointer]:
              - /url: /ai
          - listitem [ref=e346]:
            - link "Marketplace" [ref=e347] [cursor=pointer]:
              - /url: /marketplace
          - listitem [ref=e348]:
            - link "About" [ref=e349] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e350]:
            - link "Vision 2030" [ref=e351] [cursor=pointer]:
              - /url: /vision
          - listitem [ref=e352]:
            - link "Roadmap" [ref=e353] [cursor=pointer]:
              - /url: /roadmap
          - listitem [ref=e354]:
            - link "Insights & AEO Playbooks" [ref=e355] [cursor=pointer]:
              - /url: /insights
          - listitem [ref=e356]:
            - link "Brand Entity" [ref=e357] [cursor=pointer]:
              - /url: /brand
          - listitem [ref=e358]:
            - link "Help Center" [ref=e359] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e360]:
            - link "AI Engineering Studio" [ref=e361] [cursor=pointer]:
              - /url: /best-ai-engineering-studio
          - listitem [ref=e362]:
            - link "Vibe-Coding Platform" [ref=e363] [cursor=pointer]:
              - /url: /best-vibe-coding-platform
          - listitem [ref=e364]:
            - link "Digital Marketing Studio" [ref=e365] [cursor=pointer]:
              - /url: /best-digital-marketing-studio
          - listitem [ref=e366]:
            - link "SaaS MVP Development" [ref=e367] [cursor=pointer]:
              - /url: /saas-mvp
          - listitem [ref=e368]:
            - link "Free Consultation" [ref=e369] [cursor=pointer]:
              - /url: /free-consultation
          - listitem [ref=e370]:
            - link "Book a call" [ref=e371] [cursor=pointer]:
              - /url: /book
          - listitem [ref=e372]:
            - link "Affiliate Program" [ref=e373] [cursor=pointer]:
              - /url: /affiliate
      - generic [ref=e374]:
        - generic [ref=e375]: Connect
        - list [ref=e376]:
          - listitem [ref=e377]:
            - link "LinkedIn" [ref=e378] [cursor=pointer]:
              - /url: https://linkedin.com/in/piyushraj-singh
              - img [ref=e379]
              - text: LinkedIn
          - listitem [ref=e382]:
            - link "GitHub" [ref=e383] [cursor=pointer]:
              - /url: https://github.com/Warriorlegacy
              - img [ref=e384]
              - text: GitHub
          - listitem [ref=e388]:
            - link "Piyushrajsingh092@gmail.com" [ref=e389] [cursor=pointer]:
              - /url: mailto:Piyushrajsingh092@gmail.com
              - img [ref=e390]
              - text: Piyushrajsingh092@gmail.com
          - listitem [ref=e393]:
            - link "WhatsApp · +91 62024 42690" [ref=e394] [cursor=pointer]:
              - /url: https://wa.me/916202442690
              - img [ref=e395]
              - text: WhatsApp · +91 62024 42690
          - listitem [ref=e398]:
            - link "Privacy" [ref=e399] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e400] [cursor=pointer]:
              - /url: /terms
    - generic [ref=e402]:
      - generic [ref=e403]: © 2026 Signhify · Built by Piyush Raj Singh
      - generic [ref=e404]: signhify.dpdns.org
  - link "Chat with Signhify on WhatsApp" [ref=e405] [cursor=pointer]:
    - /url: https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.
    - img [ref=e407]
    - text: WhatsApp us
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * Screenshot baselines for every public route.
  5  |  *
  6  |  * First run creates the baseline images under tests/visual/__snapshots__/.
  7  |  * Commit those PNGs. Subsequent runs diff against them and fail if a route
  8  |  * drifts beyond the maxDiffPixelRatio set in playwright.config.ts.
  9  |  *
  10 |  * To intentionally update a baseline after a design change:
  11 |  *   bunx playwright test -u
  12 |  */
  13 | const ROUTES: { path: string; name: string }[] = [
  14 |   { path: "/", name: "home" },
  15 |   { path: "/projects", name: "projects" },
  16 |   { path: "/services", name: "services" },
  17 |   { path: "/vision", name: "vision" },
  18 |   { path: "/sprint", name: "sprint" },
  19 |   { path: "/about", name: "about" },
  20 |   { path: "/contact", name: "contact" },
  21 | ];
  22 | 
  23 | for (const route of ROUTES) {
  24 |   test(`visual: ${route.name} (${route.path})`, async ({ page }) => {
  25 |     await page.goto(route.path, { waitUntil: "networkidle" });
  26 |     // Give framer-motion in-view animations a frame to settle, then freeze.
  27 |     await page.waitForTimeout(400);
  28 |     await page.addStyleTag({
  29 |       content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
  30 |     });
> 31 |     await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true });
     |     ^ Error: A snapshot doesn't exist at D:\Signhify\tests\visual\routes.spec.ts-snapshots\services-desktop-chromium-win32.png, writing actual.
  32 |   });
  33 | }
  34 | 
```