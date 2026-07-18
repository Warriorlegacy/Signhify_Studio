#!/usr/bin/env node
/**
 * Deployment gate. Pings /api/public/health and exits non-zero if checks fail.
 *
 * Usage:
 *   BASE_URL=https://signhify.dpdns.org node scripts/check-deploy.mjs
 *   # or
 *   node scripts/check-deploy.mjs https://signhify.dpdns.org
 *
 * Wire into CI / pre-publish to block ships when SSR or the Supabase
 * fallback contract is broken.
 */

const url = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const endpoint = `${url.replace(/\/$/, "")}/api/public/health`;

const TIMEOUT_MS = 10_000;

async function main() {
  console.log(`[deploy-gate] GET ${endpoint}`);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(endpoint, { signal: ctrl.signal });
  } catch (err) {
    console.error(`[deploy-gate] FAIL — request error:`, err?.message || err);
    process.exit(2);
  } finally {
    clearTimeout(timer);
  }

  const body = await res.json().catch(() => ({ ok: false, parseError: true }));
  console.log(`[deploy-gate] status=${res.status} ok=${body.ok}`);

  if (!res.ok || !body.ok) {
    console.error("[deploy-gate] BLOCKED — health check failed.");
    process.exit(1);
  }
  console.log("[deploy-gate] PASS — safe to ship.");
}

main();
