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
            - button "Toggle menu" [ref=e5]:
                - img [ref=e6]
    - main [ref=e7]:
        - generic [ref=e9]:
            - complementary [ref=e10]:
                - generic [ref=e11]:
                    - generic [ref=e12]:
                        - generic [ref=e13]:
                            - img [ref=e14]
                            - generic [ref=e17]: Scroll Studio Spike
                        - generic [ref=e18]: Signhify v1.0 · Technical Spike
                    - button "Reset config" [ref=e19]:
                        - img [ref=e20]
                - generic [ref=e23]:
                    - generic [ref=e24]:
                        - img [ref=e25]
                        - generic [ref=e26]: VISUAL TOKENS
                    - generic [ref=e27]:
                        - button "wireframe" [ref=e28]
                        - button "glowing" [ref=e29]
                        - button "particle" [ref=e30]
                    - generic [ref=e31]:
                        - generic [ref=e32]:
                            - generic [ref=e33]: Timeline density
                            - generic [ref=e34]: 150 frames
                        - slider [ref=e35] [cursor=pointer]: "150"
                    - generic [ref=e36]:
                        - generic [ref=e37]: Mock engine color
                        - generic [ref=e38]:
                            - button [ref=e39]
                            - button [ref=e40]
                            - button [ref=e41]
                    - generic [ref=e42]:
                        - generic [ref=e43]: Autoplay preview
                        - generic [ref=e44]:
                            - button "Scroll" [ref=e45]
                            - button "24 FPS" [ref=e46]
                - generic [ref=e48]:
                    - generic [ref=e49]: Welcome to Signhify Scroll Studio Spike! I'm your AI Strategist. Describe style edits (e.g., 'make it a wireframe', 'change color to purple', 'increase frame count to 200') to update the scroll-locked animation engine.
                    - generic [ref=e50]: 09:30 PM
                - generic [ref=e51]:
                    - textbox "e.g. 'wireframe', 'make it purple'..." [ref=e52]
                    - button [ref=e53]:
                        - img [ref=e54]
            - main [ref=e57]:
                - generic [ref=e58]:
                    - generic [ref=e61]: LINKED TO SCROLL CONTAINER
                    - generic [ref=e62]:
                        - generic [ref=e63]:
                            - button [ref=e64]:
                                - img [ref=e65]
                            - button [ref=e67]:
                                - img [ref=e68]
                        - button "Export ZIP" [ref=e70]:
                            - img [ref=e71]
                            - generic [ref=e74]: Export ZIP
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
    - contentinfo [ref=e75]:
        - generic [ref=e77]:
            - generic [ref=e78]:
                - generic [ref=e80]:
                    - generic [ref=e81]: Signhify
                    - generic [ref=e82]: AI Engineering Studio
                - paragraph [ref=e83]: Describe your idea. Signhify builds it. We design, ship, and scale AI-first products end-to-end — from MVP to revenue.
                - generic [ref=e84]:
                    - img [ref=e85]
                    - text: Registered MSME · Govt. of India (UDYAM)
            - generic [ref=e88]:
                - generic [ref=e89]: Studio
                - list [ref=e90]:
                    - listitem [ref=e91]:
                        - link "Projects" [ref=e92] [cursor=pointer]:
                            - /url: /projects
                    - listitem [ref=e93]:
                        - link "Services" [ref=e94] [cursor=pointer]:
                            - /url: /services
                    - listitem [ref=e95]:
                        - link "About" [ref=e96] [cursor=pointer]:
                            - /url: /about
                    - listitem [ref=e97]:
                        - link "Vision 2030" [ref=e98] [cursor=pointer]:
                            - /url: /vision
                    - listitem [ref=e99]:
                        - link "Roadmap" [ref=e100] [cursor=pointer]:
                            - /url: /roadmap
                    - listitem [ref=e101]:
                        - link "Book a call" [ref=e102] [cursor=pointer]:
                            - /url: /book
            - generic [ref=e103]:
                - generic [ref=e104]: Connect
                - list [ref=e105]:
                    - listitem [ref=e106]:
                        - link "LinkedIn" [ref=e107] [cursor=pointer]:
                            - /url: https://linkedin.com/in/piyushraj-singh
                            - img [ref=e108]
                            - text: LinkedIn
                    - listitem [ref=e111]:
                        - link "GitHub" [ref=e112] [cursor=pointer]:
                            - /url: https://github.com/Warriorlegacy
                            - img [ref=e113]
                            - text: GitHub
                    - listitem [ref=e117]:
                        - link "hello@signhify.online" [ref=e118] [cursor=pointer]:
                            - /url: mailto:hello@signhify.online
                            - img [ref=e119]
                            - text: hello@signhify.online
                    - listitem [ref=e122]:
                        - link "WhatsApp · +91 62024 42690" [ref=e123] [cursor=pointer]:
                            - /url: https://wa.me/916202442690
                            - img [ref=e124]
                            - text: WhatsApp · +91 62024 42690
                    - listitem [ref=e127]:
                        - link "Privacy" [ref=e128] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e129] [cursor=pointer]:
                            - /url: /terms
        - generic [ref=e131]:
            - generic [ref=e132]: © 2026 Signhify · Built by Piyush Raj Singh
            - generic [ref=e133]: signhify.online
    - link "Chat with Signhify on WhatsApp" [ref=e134] [cursor=pointer]:
        - /url: https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.
        - img [ref=e137]
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
