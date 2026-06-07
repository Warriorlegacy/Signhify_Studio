#!/usr/bin/env node
/**
 * Pre-publish CLI gate.
 *
 *   bun run prepublish:check                                  # checks the default preview origin
 *   PLAYWRIGHT_BASE_URL=https://signhify.lovable.app bun run prepublish:check
 *
 * Runs:
 *   1. Playwright smoke against /marketplace.
 *   2. Lightweight SEO/route diff (title, og:*, canonical, MARKET slugs).
 *
 * Exits non-zero on any failure so CI / git hooks can block a publish.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_BASE =
  process.env.PLAYWRIGHT_BASE_URL ||
  "https://id-preview--aa291db4-244a-4e91-a876-f74145815ff4.lovable.app";

const base = DEFAULT_BASE.replace(/\/$/, "");
console.log(`▶ pre-publish gate against ${base}`);

// ---- 1. Playwright smoke ---------------------------------------------------
console.log("\n[1/2] Playwright smoke (tests/smoke/marketplace.spec.ts)");
const pw = spawnSync(
  "bunx",
  ["playwright", "test", "tests/smoke/marketplace.spec.ts", "--reporter=list"],
  { stdio: "inherit", env: { ...process.env, PLAYWRIGHT_BASE_URL: base } },
);
if (pw.status !== 0) {
  console.error("✗ Playwright smoke failed");
  process.exit(pw.status ?? 1);
}

// ---- 2. SEO / route diff ---------------------------------------------------
console.log("\n[2/2] SEO + route diff against src/lib/marketplace.ts");

// Lightweight TS literal parser: extract every `slug:` and `name:` from MARKET.
const marketSrc = readFileSync(resolve("src/lib/marketplace.ts"), "utf8");
const slugs = [...marketSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const names = [...marketSrc.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);

if (slugs.length === 0) {
  console.error("✗ Could not parse any MARKET slugs from src/lib/marketplace.ts");
  process.exit(2);
}

const res = await fetch(`${base}/marketplace`);
if (!res.ok) {
  console.error(`✗ /marketplace returned HTTP ${res.status}`);
  process.exit(2);
}
const html = await res.text();

const expectations = [
  { label: "<title> Marketplace — Signhify", ok: /<title[^>]*>Marketplace\s*—\s*Signhify/i.test(html) },
  { label: 'og:title contains "Marketplace"', ok: /<meta[^>]+property=["']og:title["'][^>]+Marketplace/i.test(html) },
  { label: "og:url points to /marketplace", ok: /og:url[^>]+\/marketplace/i.test(html) },
  { label: "canonical link present", ok: /<link[^>]+rel=["']canonical["']/i.test(html) },
  { label: "no error boundary overlay", ok: !html.includes("Something glitched") },
  ...names.map((n) => ({ label: `listing "${n}" renders`, ok: html.includes(n) })),
];

let failed = 0;
for (const e of expectations) {
  console.log(`  ${e.ok ? "✓" : "✗"} ${e.label}`);
  if (!e.ok) failed++;
}

if (failed > 0) {
  console.error(`\n✗ ${failed} expectation(s) failed`);
  console.error(`Expected slugs from MARKET: ${slugs.join(", ")}`);
  process.exit(1);
}

console.log("\n✓ Pre-publish gate passed. Open Lovable → Publish.");
