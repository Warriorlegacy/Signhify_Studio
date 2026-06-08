#!/usr/bin/env node
/**
 * Regenerate public/signhify-local-dev-guide.pdf from the Markdown source.
 *
 * Runs automatically before every push via `bun run guide:pdf`. The script
 * is intentionally dependency-light: it shells out to a Python renderer
 * (reportlab) so we don't add a JS PDF stack to the runtime bundle.
 *
 * Usage:
 *   bun run guide:pdf            # always regenerate
 *   bun run guide:pdf --check    # exit 1 if PDF is stale vs MD (CI hook)
 */
import { execFileSync } from "node:child_process";
import { statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MD = path.join(root, "public/signhify-local-dev-guide.md");
const PDF = path.join(root, "public/signhify-local-dev-guide.pdf");
const PY = path.join(root, "scripts/build-guide-pdf.py");

if (!existsSync(MD)) {
  console.error(`[guide:pdf] missing source: ${MD}`);
  process.exit(1);
}

const checkOnly = process.argv.includes("--check");
const mdMtime = statSync(MD).mtimeMs;
const pdfMtime = existsSync(PDF) ? statSync(PDF).mtimeMs : 0;

if (checkOnly) {
  if (pdfMtime >= mdMtime) {
    console.log("[guide:pdf] PDF is up to date.");
    process.exit(0);
  }
  console.error("[guide:pdf] PDF is stale. Run `bun run guide:pdf` and commit the result.");
  process.exit(1);
}

console.log("[guide:pdf] rendering MD → PDF…");
try {
  execFileSync("python3", [PY, MD, PDF], { stdio: "inherit" });
} catch (err) {
  console.error("[guide:pdf] failed:", err.message);
  process.exit(1);
}
console.log(`[guide:pdf] wrote ${path.relative(root, PDF)}`);
