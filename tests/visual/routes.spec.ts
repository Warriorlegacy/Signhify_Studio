import { test, expect } from "@playwright/test";

/**
 * Screenshot baselines for every public route.
 *
 * First run creates the baseline images under tests/visual/__snapshots__/.
 * Commit those PNGs. Subsequent runs diff against them and fail if a route
 * drifts beyond the maxDiffPixelRatio set in playwright.config.ts.
 *
 * To intentionally update a baseline after a design change:
 *   bunx playwright test -u
 */
const ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/services", name: "services" },
  { path: "/vision", name: "vision" },
  { path: "/sprint", name: "sprint" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

for (const route of ROUTES) {
  test(`visual: ${route.name} (${route.path})`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    // Give framer-motion in-view animations a frame to settle, then freeze.
    await page.waitForTimeout(400);
    await page.addStyleTag({
      content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
    });
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true });
  });
}
