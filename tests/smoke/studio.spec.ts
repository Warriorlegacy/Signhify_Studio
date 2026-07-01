import { test, expect } from "@playwright/test";

test.describe("studio spike smoke", () => {
  test("loads with canvas, controls, and sidebar without errors", async ({ page }) => {
    const response = await page.goto("/studio/spike", { waitUntil: "domcontentloaded" });
    expect(response, "navigation response").not.toBeNull();
    expect(response!.status(), "HTTP status").toBeLessThan(400);

    // Error boundary must not be active.
    await expect(page.getByText("Something glitched")).toHaveCount(0);

    // Headline or title in sidebar
    await expect(page.getByText("Scroll Studio Spike", { exact: true })).toBeVisible();

    // Visual Tokens header
    await expect(page.getByText("VISUAL TOKENS")).toBeVisible();

    // Canvas element should exist
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();

    // SEO / Title
    await expect(page).toHaveTitle(/Scroll Studio Spike/);
  });
});
