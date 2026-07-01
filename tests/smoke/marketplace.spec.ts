import { test, expect } from "@playwright/test";

/**
 * Pre-publish smoke for /marketplace.
 *
 * Run with:
 *   PLAYWRIGHT_BASE_URL=https://id-preview--…lovable.app \
 *     bunx playwright test tests/smoke/marketplace.spec.ts
 *
 * Or via the bundled wrapper:
 *   bun run prepublish:check
 */
test.describe("marketplace smoke", () => {
  test("loads with hero, chips, listings, no error overlay", async ({ page }) => {
    const response = await page.goto("/marketplace", { waitUntil: "domcontentloaded" });
    expect(response, "navigation response").not.toBeNull();
    expect(response!.status(), "HTTP status").toBeLessThan(400);

    // Error boundary must not be active.
    await expect(page.getByText("Something glitched")).toHaveCount(0);

    // Hero headline.
    await expect(page.getByRole("heading", { name: /Ship faster/i })).toBeVisible();

    // Category chips.
    for (const c of ["All", "Template", "Agent", "Component", "Workflow"]) {
      await expect(page.getByRole("button", { name: c, exact: true })).toBeVisible();
    }

    // At least one listing card in the grid.
    await expect(page.locator('[class*="rounded-2xl"][class*="bg-card"]').first()).toBeVisible();

    // SEO essentials.
    await expect(page).toHaveTitle(/Marketplace — Signhify/);
  });
});
