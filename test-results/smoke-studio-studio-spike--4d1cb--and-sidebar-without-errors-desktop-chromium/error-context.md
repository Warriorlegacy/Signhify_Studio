# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke\studio.spec.ts >> studio spike smoke >> loads with canvas, controls, and sidebar without errors
- Location: tests\smoke\studio.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Scroll Studio Spike')
Expected: visible
Error: strict mode violation: getByText('Scroll Studio Spike') resolved to 2 elements:
    1) <span class="font-display font-bold text-lg tracking-tight">Scroll Studio Spike</span> aka getByText('Scroll Studio Spike', { exact: true })
    2) <div class="rounded-2xl p-3.5 text-sm leading-relaxed bg-surface-2/60 border border-border/40 text-muted-foreground rounded-tl-none">Welcome to Signhify Scroll Studio Spike! I'm your…</div> aka getByText('Welcome to Signhify Scroll')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Scroll Studio Spike')

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
                - link "AINew" [ref=e8] [cursor=pointer]:
                    - /url: /ai
                - link "Market" [ref=e9] [cursor=pointer]:
                    - /url: /marketplace
                - link "Pricing" [ref=e10] [cursor=pointer]:
                    - /url: /pricing
                - link "Roadmap" [ref=e11] [cursor=pointer]:
                    - /url: /roadmap
                - button "Ecosystem" [ref=e14]:
                    - img [ref=e15]
                    - generic [ref=e19]: Ecosystem
                    - img [ref=e20]
            - link "Start a Project" [ref=e23] [cursor=pointer]:
                - /url: /contact
                - text: Start a Project
                - img [ref=e24]
    - main [ref=e26]:
        - generic [ref=e28]:
            - complementary [ref=e29]:
                - generic [ref=e30]:
                    - generic [ref=e31]:
                        - generic [ref=e32]:
                            - img [ref=e33]
                            - generic [ref=e36]: Scroll Studio Spike
                        - generic [ref=e37]: Signhify v1.0 · Technical Spike
                    - button "Reset config" [ref=e38]:
                        - img [ref=e39]
                - generic [ref=e42]:
                    - generic [ref=e43]:
                        - img [ref=e44]
                        - generic [ref=e45]: VISUAL TOKENS
                    - generic [ref=e46]:
                        - button "wireframe" [ref=e47]
                        - button "glowing" [ref=e48]
                        - button "particle" [ref=e49]
                    - generic [ref=e50]:
                        - generic [ref=e51]:
                            - generic [ref=e52]: Timeline density
                            - generic [ref=e53]: 150 frames
                        - slider [ref=e54] [cursor=pointer]: "150"
                    - generic [ref=e55]:
                        - generic [ref=e56]: Mock engine color
                        - generic [ref=e57]:
                            - button [ref=e58]
                            - button [ref=e59]
                            - button [ref=e60]
                    - generic [ref=e61]:
                        - generic [ref=e62]: Autoplay preview
                        - generic [ref=e63]:
                            - button "Scroll" [ref=e64]
                            - button "24 FPS" [ref=e65]
                - generic [ref=e67]:
                    - generic [ref=e68]: Welcome to Signhify Scroll Studio Spike! I'm your AI Strategist. Describe style edits (e.g., 'make it a wireframe', 'change color to purple', 'increase frame count to 200') to update the scroll-locked animation engine.
                    - generic [ref=e69]: 09:30 PM
                - generic [ref=e70]:
                    - textbox "e.g. 'wireframe', 'make it purple'..." [ref=e71]
                    - button [ref=e72]:
                        - img [ref=e73]
            - main [ref=e76]:
                - generic [ref=e77]:
                    - generic [ref=e80]: LINKED TO SCROLL CONTAINER
                    - generic [ref=e81]:
                        - generic [ref=e82]:
                            - button [ref=e83]:
                                - img [ref=e84]
                            - button [ref=e86]:
                                - img [ref=e87]
                        - button "Export ZIP" [ref=e89]:
                            - img [ref=e90]
                            - generic [ref=e93]: Export ZIP
                - generic:
                    - generic:
                        - generic:
                            - generic: "FRAME INDEX: 0"
                            - generic: "FPS CACHE: Scroll driver"
                            - generic: "MEMORY STATE: Bitmaps cached"
                - generic:
                    - generic: Narrative Steps
                    - generic: 01. The Void Awakens
                    - generic: 02. Gesture Decoded
                    - generic: 03. Translation Bridge
                    - generic: 04. Launch Trajectory
                - generic:
                    - generic: Scroll Down to Play Story
    - contentinfo [ref=e94]:
        - generic [ref=e96]:
            - generic [ref=e97]:
                - generic [ref=e99]:
                    - generic [ref=e100]: Signhify
                    - generic [ref=e101]: AI Engineering Studio
                - paragraph [ref=e102]: Describe your idea. Signhify builds it. We design, ship, and scale AI-first products end-to-end — from MVP to revenue.
                - generic [ref=e103]:
                    - img [ref=e104]
                    - text: Registered MSME · Govt. of India (UDYAM)
            - generic [ref=e107]:
                - generic [ref=e108]: Studio
                - list [ref=e109]:
                    - listitem [ref=e110]:
                        - link "Projects" [ref=e111] [cursor=pointer]:
                            - /url: /projects
                    - listitem [ref=e112]:
                        - link "Services" [ref=e113] [cursor=pointer]:
                            - /url: /services
                    - listitem [ref=e114]:
                        - link "About" [ref=e115] [cursor=pointer]:
                            - /url: /about
                    - listitem [ref=e116]:
                        - link "Vision 2030" [ref=e117] [cursor=pointer]:
                            - /url: /vision
                    - listitem [ref=e118]:
                        - link "Roadmap" [ref=e119] [cursor=pointer]:
                            - /url: /roadmap
                    - listitem [ref=e120]:
                        - link "Book a call" [ref=e121] [cursor=pointer]:
                            - /url: /book
            - generic [ref=e122]:
                - generic [ref=e123]: Connect
                - list [ref=e124]:
                    - listitem [ref=e125]:
                        - link "LinkedIn" [ref=e126] [cursor=pointer]:
                            - /url: https://linkedin.com/in/piyushraj-singh
                            - img [ref=e127]
                            - text: LinkedIn
                    - listitem [ref=e130]:
                        - link "GitHub" [ref=e131] [cursor=pointer]:
                            - /url: https://github.com/Warriorlegacy
                            - img [ref=e132]
                            - text: GitHub
                    - listitem [ref=e136]:
                        - link "hello@signhify.online" [ref=e137] [cursor=pointer]:
                            - /url: mailto:hello@signhify.online
                            - img [ref=e138]
                            - text: hello@signhify.online
                    - listitem [ref=e141]:
                        - link "WhatsApp · +91 62024 42690" [ref=e142] [cursor=pointer]:
                            - /url: https://wa.me/916202442690
                            - img [ref=e143]
                            - text: WhatsApp · +91 62024 42690
                    - listitem [ref=e146]:
                        - link "Privacy" [ref=e147] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e148] [cursor=pointer]:
                            - /url: /terms
        - generic [ref=e150]:
            - generic [ref=e151]: © 2026 Signhify · Built by Piyush Raj Singh
            - generic [ref=e152]: signhify.online
    - link "Chat with Signhify on WhatsApp" [ref=e153] [cursor=pointer]:
        - /url: https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.
        - img [ref=e156]
        - generic [ref=e158]: WhatsApp us
    - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("studio spike smoke", () => {
  4  |   test("loads with canvas, controls, and sidebar without errors", async ({ page }) => {
  5  |     const response = await page.goto("/studio/spike", { waitUntil: "domcontentloaded" });
  6  |     expect(response, "navigation response").not.toBeNull();
  7  |     expect(response!.status(), "HTTP status").toBeLessThan(400);
  8  |
  9  |     // Error boundary must not be active.
  10 |     await expect(page.getByText("Something glitched")).toHaveCount(0);
  11 |
  12 |     // Headline or title in sidebar
> 13 |     await expect(page.getByText("Scroll Studio Spike")).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  14 |
  15 |     // Visual Tokens header
  16 |     await expect(page.getByText("VISUAL TOKENS")).toBeVisible();
  17 |
  18 |     // Canvas element should exist
  19 |     const canvas = page.locator("canvas");
  20 |     await expect(canvas).toBeVisible();
  21 |
  22 |     // SEO / Title
  23 |     await expect(page).toHaveTitle(/Scroll Studio Spike/);
  24 |   });
  25 | });
  26 |
```
