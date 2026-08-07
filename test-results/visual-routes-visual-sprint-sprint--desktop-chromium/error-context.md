# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual\routes.spec.ts >> visual: sprint (/sprint)
- Location: tests\visual\routes.spec.ts:24:3

# Error details

```
Error: A snapshot doesn't exist at D:\Signhify\tests\visual\routes.spec.ts-snapshots\sprint-desktop-chromium-win32.png, writing actual.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner:
    - generic:
      - link "Signhify AI Engineering Studio Signhify" [ref=e2] [cursor=pointer]:
        - /url: /
        - img "Signhify AI Engineering Studio" [ref=e3]
        - generic [ref=e4]: Signhify
      - navigation [ref=e5]:
        - link "Studio" [ref=e6] [cursor=pointer]:
          - /url: /
        - link "Projects" [ref=e7] [cursor=pointer]:
          - /url: /projects
        - link "Services" [ref=e8] [cursor=pointer]:
          - /url: /services
        - link "AINew" [ref=e9] [cursor=pointer]:
          - /url: /ai
        - link "Market" [ref=e10] [cursor=pointer]:
          - /url: /marketplace
        - link "Deploy" [ref=e11] [cursor=pointer]:
          - /url: /app/deploy
        - link "Cloud" [ref=e12] [cursor=pointer]:
          - /url: /app
        - link "OS" [ref=e13] [cursor=pointer]:
          - /url: /os
        - link "AI Studio" [ref=e14] [cursor=pointer]:
          - /url: /best-ai-engineering-studio
        - button "Ecosystem" [ref=e17]:
          - img [ref=e18]
          - generic [ref=e22]: Ecosystem
          - img [ref=e23]
        - button "AI Keys" [ref=e25]:
          - img [ref=e26]
      - link "Start a Project" [ref=e31] [cursor=pointer]:
        - /url: /contact
        - generic [ref=e32]: Start a Project
        - img [ref=e34]
  - main [ref=e36]:
    - generic [ref=e38]:
      - navigation "Breadcrumb" [ref=e39]:
        - list [ref=e40]:
          - listitem [ref=e41]:
            - link "Home" [ref=e42] [cursor=pointer]:
              - /url: /
              - img [ref=e43]
              - generic [ref=e46]: Home
          - listitem [ref=e47]:
            - img [ref=e48]
            - generic [ref=e50]: Sprint Checklist
      - generic [ref=e51]: End-of-month delivery checklist
      - heading "June 2026 sprint, tracked live." [level=1] [ref=e52]
      - paragraph [ref=e53]: "Every remaining Phase 1 item — status, owner and due date. Updated as we ship. Deadline: June 30, 2026."
      - generic [ref=e54]:
        - generic [ref=e55]:
          - generic [ref=e56]: Total items
          - generic [ref=e57]: "24"
        - generic [ref=e58]:
          - generic [ref=e59]: Done
          - generic [ref=e60]: "11"
        - generic [ref=e61]:
          - generic [ref=e62]: In progress
          - generic [ref=e63]: "0"
        - generic [ref=e64]:
          - generic [ref=e65]: Todo
          - generic [ref=e66]: "12"
        - generic [ref=e67]:
          - generic [ref=e68]: Blocked
          - generic [ref=e69]: "1"
      - generic [ref=e71]:
        - generic [ref=e72]: Overall progress
        - generic [ref=e73]: 46%
    - generic [ref=e77]:
      - generic [ref=e78]:
        - generic [ref=e79]:
          - generic [ref=e80]:
            - generic [ref=e81]: Week 1 · June 1–7
            - heading "Signhify Studio" [level=2] [ref=e82]
            - paragraph [ref=e83]: The Phase 1 marketing site, portfolio of 14 projects, and lead capture.
          - generic [ref=e84]:
            - generic [ref=e85]: signhify.dpdns.org
            - generic [ref=e86]: 7 / 8 done
        - list [ref=e87]:
          - listitem [ref=e88]:
            - generic [ref=e90]:
              - generic [ref=e91]:
                - generic [ref=e92]: Cinematic hero + particle bg
                - generic [ref=e93]: Done
              - paragraph [ref=e94]: tsparticles canvas, gradient orbs, CTA above the fold.
            - generic [ref=e95]:
              - generic [ref=e96]: Piyush
              - generic [ref=e97]: due Jun 5
          - listitem [ref=e98]:
            - generic [ref=e100]:
              - generic [ref=e101]:
                - generic [ref=e102]: All 14 projects seeded
                - generic [ref=e103]: Done
              - paragraph [ref=e104]: Project objects + grid + filters live on /projects.
            - generic [ref=e105]:
              - generic [ref=e106]: Piyush
              - generic [ref=e107]: due Jun 6
          - listitem [ref=e108]:
            - generic [ref=e110]:
              - generic [ref=e111]:
                - generic [ref=e112]: Services + Process sections
                - generic [ref=e113]: Done
              - paragraph [ref=e114]: Engagement model, deliverables, pricing tiers.
            - generic [ref=e115]:
              - generic [ref=e116]: Piyush
              - generic [ref=e117]: due Jun 6
          - listitem [ref=e118]:
            - generic [ref=e120]:
              - generic [ref=e121]:
                - generic [ref=e122]: Vision page + roadmap
                - generic [ref=e123]: Done
              - paragraph [ref=e124]: June sprint timeline + ecosystem layers.
            - generic [ref=e125]:
              - generic [ref=e126]: Piyush
              - generic [ref=e127]: due Jun 6
          - listitem [ref=e128]:
            - generic [ref=e130]:
              - generic [ref=e131]:
                - generic [ref=e132]: Contact form → Supabase
                - generic [ref=e133]: Done
              - paragraph [ref=e134]: Server fn writes lead, sends notification email.
            - generic [ref=e135]:
              - generic [ref=e136]: Piyush
              - generic [ref=e137]: due Jun 7
          - listitem [ref=e138]:
            - generic [ref=e140]:
              - generic [ref=e141]:
                - generic [ref=e142]: Per-route meta + sitemap
                - generic [ref=e143]: Done
              - paragraph [ref=e144]: Distinct og:title/description on every public route.
            - generic [ref=e145]:
              - generic [ref=e146]: Piyush
              - generic [ref=e147]: due Jun 7
          - listitem [ref=e148]:
            - generic [ref=e150]:
              - generic [ref=e151]:
                - generic [ref=e152]: MSME trust badge in footer
                - generic [ref=e153]: Done
              - paragraph [ref=e154]: UDYAM-BR-08-0036671 displayed on every page.
            - generic [ref=e155]:
              - generic [ref=e156]: Piyush
              - generic [ref=e157]: due Jun 5
          - listitem [ref=e158]:
            - generic [ref=e160]:
              - generic [ref=e161]:
                - generic [ref=e162]: Publish signhify.dpdns.org
                - generic [ref=e163]: Todo
              - paragraph [ref=e164]: Custom domain wired, SSL green, OG previews verified.
            - generic [ref=e165]:
              - generic [ref=e166]: Piyush
              - generic [ref=e167]: due Jun 7
      - generic [ref=e168]:
        - generic [ref=e169]:
          - generic [ref=e170]:
            - generic [ref=e171]: Week 2 · June 8–14
            - heading "Signhify AI" [level=2] [ref=e172]
            - paragraph [ref=e173]: Prompt → AI-generated product plan via Claude with streaming UI.
          - generic [ref=e174]:
            - generic [ref=e175]: ai.signhify.dpdns.org
            - generic [ref=e176]: 4 / 5 done
        - list [ref=e177]:
          - listitem [ref=e178]:
            - generic [ref=e180]:
              - generic [ref=e181]:
                - generic [ref=e182]: Claude system prompt locked
                - generic [ref=e183]: Done
              - paragraph [ref=e184]: Versioned in repo, JSON output schema defined.
            - generic [ref=e185]:
              - generic [ref=e186]: Piyush
              - generic [ref=e187]: due Jun 9
          - listitem [ref=e188]:
            - generic [ref=e190]:
              - generic [ref=e191]:
                - generic [ref=e192]: Streaming UI
                - generic [ref=e193]: Done
              - paragraph [ref=e194]: Server route streams tokens to client renderer.
            - generic [ref=e195]:
              - generic [ref=e196]: Piyush
              - generic [ref=e197]: due Jun 11
          - listitem [ref=e198]:
            - generic [ref=e200]:
              - generic [ref=e201]:
                - generic [ref=e202]: "Rate limit: 3 free builds"
                - generic [ref=e203]: Done
              - paragraph [ref=e204]: Per-IP + per-user counter in Supabase.
            - generic [ref=e205]:
              - generic [ref=e206]: Piyush
              - generic [ref=e207]: due Jun 12
          - listitem [ref=e208]:
            - generic [ref=e210]:
              - generic [ref=e211]:
                - generic [ref=e212]: Save + share plan
                - generic [ref=e213]: Done
              - paragraph [ref=e214]: Plans persisted, shareable public URL.
            - generic [ref=e215]:
              - generic [ref=e216]: Piyush
              - generic [ref=e217]: due Jun 13
          - listitem [ref=e218]:
            - generic [ref=e220]:
              - generic [ref=e221]:
                - generic [ref=e222]: Publish ai.signhify.dpdns.org
                - generic [ref=e223]: Todo
              - paragraph [ref=e224]: Subdomain routed, analytics on.
            - generic [ref=e225]:
              - generic [ref=e226]: Piyush
              - generic [ref=e227]: due Jun 14
      - generic [ref=e228]:
        - generic [ref=e229]:
          - generic [ref=e230]:
            - generic [ref=e231]: Week 3 · June 15–17
            - heading "Signhify Deploy" [level=2] [ref=e232]
            - paragraph [ref=e233]: GitHub repo → 1-click Vercel deploy with status dashboard.
          - generic [ref=e234]:
            - generic [ref=e235]: deploy.signhify.dpdns.org
            - generic [ref=e236]: 0 / 3 done
        - list [ref=e237]:
          - listitem [ref=e238]:
            - generic [ref=e240]:
              - generic [ref=e241]:
                - generic [ref=e242]: GitHub OAuth App approved
                - generic [ref=e243]: Blocked
              - paragraph [ref=e244]: Apply TODAY — approval can take days.
            - generic [ref=e245]:
              - generic [ref=e246]: Piyush
              - generic [ref=e247]: due Jun 5
          - listitem [ref=e248]:
            - generic [ref=e250]:
              - generic [ref=e251]:
                - generic [ref=e252]: Vercel REST integration
                - generic [ref=e253]: Todo
              - paragraph [ref=e254]: POST /v13/deployments wired with project linking.
            - generic [ref=e255]:
              - generic [ref=e256]: Piyush
              - generic [ref=e257]: due Jun 16
          - listitem [ref=e258]:
            - generic [ref=e260]:
              - generic [ref=e261]:
                - generic [ref=e262]: Status dashboard
                - generic [ref=e263]: Todo
              - paragraph [ref=e264]: Live build logs + URL preview after success.
            - generic [ref=e265]:
              - generic [ref=e266]: Piyush
              - generic [ref=e267]: due Jun 17
      - generic [ref=e268]:
        - generic [ref=e269]:
          - generic [ref=e270]:
            - generic [ref=e271]: Week 3 · June 18–21
            - heading "Signhify Marketplace" [level=2] [ref=e272]
            - paragraph [ref=e273]: Browse + download 10+ launch templates derived from the 14 projects.
          - generic [ref=e274]:
            - generic [ref=e275]: marketplace.signhify.dpdns.org
            - generic [ref=e276]: 0 / 3 done
        - list [ref=e277]:
          - listitem [ref=e278]:
            - generic [ref=e280]:
              - generic [ref=e281]:
                - generic [ref=e282]: Package 10 launch templates
                - generic [ref=e283]: Todo
              - paragraph [ref=e284]: Repackage existing projects as cloneable starters.
            - generic [ref=e285]:
              - generic [ref=e286]: Piyush
              - generic [ref=e287]: due Jun 19
          - listitem [ref=e288]:
            - generic [ref=e290]:
              - generic [ref=e291]:
                - generic [ref=e292]: Browse + filter UI
                - generic [ref=e293]: Todo
              - paragraph [ref=e294]: Category, stack, tag filters with search.
            - generic [ref=e295]:
              - generic [ref=e296]: Piyush
              - generic [ref=e297]: due Jun 20
          - listitem [ref=e298]:
            - generic [ref=e300]:
              - generic [ref=e301]:
                - generic [ref=e302]: Community submit form
                - generic [ref=e303]: Todo
              - paragraph [ref=e304]: Form → Supabase review queue.
            - generic [ref=e305]:
              - generic [ref=e306]: Piyush
              - generic [ref=e307]: due Jun 21
      - generic [ref=e308]:
        - generic [ref=e309]:
          - generic [ref=e310]:
            - generic [ref=e311]: Week 4 · June 22–28
            - heading "Signhify Cloud" [level=2] [ref=e312]
            - paragraph [ref=e313]: "Supabase Management API wrapper: DB, storage, auth visible per project."
          - generic [ref=e314]:
            - generic [ref=e315]: cloud.signhify.dpdns.org
            - generic [ref=e316]: 0 / 3 done
        - list [ref=e317]:
          - listitem [ref=e318]:
            - generic [ref=e320]:
              - generic [ref=e321]:
                - generic [ref=e322]: List user projects
                - generic [ref=e323]: Todo
              - paragraph [ref=e324]: Supabase mgmt API → project list view.
            - generic [ref=e325]:
              - generic [ref=e326]: Piyush
              - generic [ref=e327]: due Jun 24
          - listitem [ref=e328]:
            - generic [ref=e330]:
              - generic [ref=e331]:
                - generic [ref=e332]: DB + storage + auth tabs
                - generic [ref=e333]: Todo
              - paragraph [ref=e334]: Read-only inspector for each resource.
            - generic [ref=e335]:
              - generic [ref=e336]: Piyush
              - generic [ref=e337]: due Jun 27
          - listitem [ref=e338]:
            - generic [ref=e340]:
              - generic [ref=e341]:
                - generic [ref=e342]: Publish cloud.signhify.dpdns.org
                - generic [ref=e343]: Todo
              - paragraph [ref=e344]: Auth gate + analytics live.
            - generic [ref=e345]:
              - generic [ref=e346]: Piyush
              - generic [ref=e347]: due Jun 28
      - generic [ref=e348]:
        - generic [ref=e349]:
          - generic [ref=e350]:
            - generic [ref=e351]: Week 4 · June 29–30
            - heading "Signhify OS" [level=2] [ref=e352]
            - paragraph [ref=e353]: "Unified dashboard: CRM, Projects, AI shortcuts, full Signhify nav."
          - generic [ref=e354]:
            - generic [ref=e355]: os.signhify.dpdns.org
            - generic [ref=e356]: 0 / 2 done
        - list [ref=e357]:
          - listitem [ref=e358]:
            - generic [ref=e360]:
              - generic [ref=e361]:
                - generic [ref=e362]: Unified dashboard shell
                - generic [ref=e363]: Todo
              - paragraph [ref=e364]: Sidebar nav, widgets, stitched Supabase data.
            - generic [ref=e365]:
              - generic [ref=e366]: Piyush
              - generic [ref=e367]: due Jun 29
          - listitem [ref=e368]:
            - generic [ref=e370]:
              - generic [ref=e371]:
                - generic [ref=e372]: Launch June 30
                - generic [ref=e373]: Todo
              - paragraph [ref=e374]: All six subdomains live, announcement post.
            - generic [ref=e375]:
              - generic [ref=e376]: Piyush
              - generic [ref=e377]: due Jun 30
    - generic [ref=e381]:
      - generic [ref=e382]:
        - generic [ref=e383]: 14+ products shipped
        - generic [ref=e385]: Multi-tenant SaaS
        - generic [ref=e387]: AI-first engineering
        - generic [ref=e389]: Delivered in weeks
      - heading "Your idea, Signhified." [level=2] [ref=e391]
      - paragraph [ref=e392]: Scope your idea, pick your budget, and get a production-ready AI product deployed to your infrastructure in 14 days.
      - generic [ref=e393]:
        - button "Instant Sprint Scoper" [ref=e394] [cursor=pointer]:
          - img [ref=e395]
          - text: Instant Sprint Scoper
          - img [ref=e398]
        - link "Book a 10-Min Call" [ref=e400] [cursor=pointer]:
          - /url: /book
          - img [ref=e401]
          - text: Book a 10-Min Call
      - paragraph [ref=e403]: No commitment. 100% Code Ownership on your GitHub from Day One.
  - contentinfo [ref=e404]:
    - generic [ref=e406]:
      - generic [ref=e407]:
        - generic [ref=e409]:
          - generic [ref=e410]: Signhify
          - generic [ref=e411]: AI Engineering Studio
        - paragraph [ref=e412]: Describe your idea. Signhify builds it. We design, ship, and scale AI-first products end-to-end — from MVP to revenue.
        - generic [ref=e413]:
          - img [ref=e414]
          - text: Registered MSME · Govt. of India (UDYAM)
      - generic [ref=e417]:
        - generic [ref=e418]: Studio
        - list [ref=e419]:
          - listitem [ref=e420]:
            - link "Services" [ref=e421] [cursor=pointer]:
              - /url: /services
          - listitem [ref=e422]:
            - link "Pricing" [ref=e423] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e424]:
            - link "Projects" [ref=e425] [cursor=pointer]:
              - /url: /projects
          - listitem [ref=e426]:
            - link "AI Generator" [ref=e427] [cursor=pointer]:
              - /url: /ai
          - listitem [ref=e428]:
            - link "Marketplace" [ref=e429] [cursor=pointer]:
              - /url: /marketplace
          - listitem [ref=e430]:
            - link "About" [ref=e431] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e432]:
            - link "Vision 2030" [ref=e433] [cursor=pointer]:
              - /url: /vision
          - listitem [ref=e434]:
            - link "Roadmap" [ref=e435] [cursor=pointer]:
              - /url: /roadmap
          - listitem [ref=e436]:
            - link "Insights & AEO Playbooks" [ref=e437] [cursor=pointer]:
              - /url: /insights
          - listitem [ref=e438]:
            - link "Brand Entity" [ref=e439] [cursor=pointer]:
              - /url: /brand
          - listitem [ref=e440]:
            - link "Help Center" [ref=e441] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e442]:
            - link "AI Engineering Studio" [ref=e443] [cursor=pointer]:
              - /url: /best-ai-engineering-studio
          - listitem [ref=e444]:
            - link "Vibe-Coding Platform" [ref=e445] [cursor=pointer]:
              - /url: /best-vibe-coding-platform
          - listitem [ref=e446]:
            - link "Digital Marketing Studio" [ref=e447] [cursor=pointer]:
              - /url: /best-digital-marketing-studio
          - listitem [ref=e448]:
            - link "SaaS MVP Development" [ref=e449] [cursor=pointer]:
              - /url: /saas-mvp
          - listitem [ref=e450]:
            - link "Free Consultation" [ref=e451] [cursor=pointer]:
              - /url: /free-consultation
          - listitem [ref=e452]:
            - link "Book a call" [ref=e453] [cursor=pointer]:
              - /url: /book
          - listitem [ref=e454]:
            - link "Affiliate Program" [ref=e455] [cursor=pointer]:
              - /url: /affiliate
      - generic [ref=e456]:
        - generic [ref=e457]: Connect
        - list [ref=e458]:
          - listitem [ref=e459]:
            - link "LinkedIn" [ref=e460] [cursor=pointer]:
              - /url: https://linkedin.com/in/piyushraj-singh
              - img [ref=e461]
              - text: LinkedIn
          - listitem [ref=e464]:
            - link "GitHub" [ref=e465] [cursor=pointer]:
              - /url: https://github.com/Warriorlegacy
              - img [ref=e466]
              - text: GitHub
          - listitem [ref=e470]:
            - link "Piyushrajsingh092@gmail.com" [ref=e471] [cursor=pointer]:
              - /url: mailto:Piyushrajsingh092@gmail.com
              - img [ref=e472]
              - text: Piyushrajsingh092@gmail.com
          - listitem [ref=e475]:
            - link "WhatsApp · +91 62024 42690" [ref=e476] [cursor=pointer]:
              - /url: https://wa.me/916202442690
              - img [ref=e477]
              - text: WhatsApp · +91 62024 42690
          - listitem [ref=e480]:
            - link "Privacy" [ref=e481] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e482] [cursor=pointer]:
              - /url: /terms
    - generic [ref=e484]:
      - generic [ref=e485]: © 2026 Signhify · Built by Piyush Raj Singh
      - generic [ref=e486]: signhify.dpdns.org
  - link "Chat with Signhify on WhatsApp" [ref=e487] [cursor=pointer]:
    - /url: https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.
    - img [ref=e490]
    - generic [ref=e492]: WhatsApp us
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
     |     ^ Error: A snapshot doesn't exist at D:\Signhify\tests\visual\routes.spec.ts-snapshots\sprint-desktop-chromium-win32.png, writing actual.
  32 |   });
  33 | }
  34 | 
```