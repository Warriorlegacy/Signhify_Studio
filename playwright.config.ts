import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression config for Signhify routes.
 *
 * One-time setup:
 *   bun add -D @playwright/test
 *   bunx playwright install chromium
 *
 * Run:
 *   bunx playwright test           # compare against baselines
 *   bunx playwright test -u        # update baselines after intentional changes
 *
 * Override the target URL with PLAYWRIGHT_BASE_URL=https://signhify.online
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8080";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  expect: {
    // Allow a tiny ratio of pixel drift (font rendering, anti-aliasing).
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
