import { createServerFn } from "@tanstack/react-start";
import { MARKET, MARKET_CATEGORIES } from "@/lib/marketplace";

const EXPECTED_TITLE = "Marketplace — Signhify";
const EXPECTED_DESCRIPTION_TOKEN = "templates, AI agents, components";
const EXPECTED_OG_URL = "https://signhify.online/marketplace";

function pickOrigin(input: { origin?: string } | undefined, fallback: string) {
  const o = input?.origin?.trim();
  if (!o) return fallback;
  try {
    const u = new URL(o);
    return `${u.protocol}//${u.host}`;
  } catch {
    return fallback;
  }
}

function defaultOrigin(): string {
  // Prefer the id-preview build (always serves the latest preview commit) over
  // the published .lovable.app host, which may be stale until the next Publish.
  return (
    process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    "https://id-preview--aa291db4-244a-4e91-a876-f74145815ff4.lovable.app"
  );
}

async function fetchMarketplaceHtml(origin: string) {
  const url = `${origin.replace(/\/$/, "")}/marketplace`;
  const started = Date.now();
  const res = await fetch(url, {
    headers: { "user-agent": "signhify-prepublish/1.0" },
    redirect: "follow",
  });
  const html = await res.text();
  return { url, status: res.status, html, ms: Date.now() - started };
}

function checkContains(html: string, needle: string) {
  return html.toLowerCase().includes(needle.toLowerCase());
}

export const runMarketplaceSmoke = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const origin = (input as any)?.origin;
    return { origin: typeof origin === "string" ? origin : undefined };
  })
  .handler(async ({ data }) => {
    const origin = pickOrigin(data, defaultOrigin());
    const { url, status, html, ms } = await fetchMarketplaceHtml(origin);

    const checks: Array<{ id: string; label: string; passed: boolean; detail?: string }> = [];

    checks.push({
      id: "http_ok",
      label: `HTTP ${status} on ${url}`,
      passed: status >= 200 && status < 400,
    });

    checks.push({
      id: "h1_present",
      label: "Hero heading rendered",
      passed: checkContains(html, "Ship faster") && checkContains(html, "Borrow our spine"),
    });

    const missingCats = MARKET_CATEGORIES.filter((c) => !checkContains(html, `>${c}<`));
    checks.push({
      id: "category_chips",
      label: `All ${MARKET_CATEGORIES.length} category chips render`,
      passed: missingCats.length === 0,
      detail: missingCats.length ? `Missing: ${missingCats.join(", ")}` : undefined,
    });

    const cardHits = MARKET.filter((m) => checkContains(html, m.name)).length;
    checks.push({
      id: "card_count",
      label: `At least 1 marketplace card present (${cardHits}/${MARKET.length})`,
      passed: cardHits >= 1,
    });

    checks.push({
      id: "no_error_overlay",
      label: "Error boundary not triggered",
      passed: !checkContains(html, "Something glitched"),
    });

    const passed = checks.every((c) => c.passed);
    return { passed, checks, target: url, durationMs: ms, ranAt: new Date().toISOString() };
  });

export const runMarketplaceDiff = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const origin = (input as any)?.origin;
    return { origin: typeof origin === "string" ? origin : undefined };
  })
  .handler(async ({ data }) => {
    const origin = pickOrigin(data, defaultOrigin());
    const { url, html } = await fetchMarketplaceHtml(origin);

    const findings: Array<{ id: string; label: string; passed: boolean; detail?: string }> = [];

    findings.push({
      id: "title",
      label: `<title> = "${EXPECTED_TITLE}"`,
      passed: new RegExp(`<title[^>]*>${EXPECTED_TITLE}`, "i").test(html),
    });

    findings.push({
      id: "description",
      label: "Meta description mentions templates / agents / components",
      passed: checkContains(html, EXPECTED_DESCRIPTION_TOKEN),
    });

    findings.push({
      id: "og_title",
      label: 'og:title = "Marketplace — Signhify"',
      passed: /<meta[^>]+property=["']og:title["'][^>]+Marketplace/i.test(html),
    });

    findings.push({
      id: "og_url",
      label: `og:url = ${EXPECTED_OG_URL}`,
      passed: html.includes(EXPECTED_OG_URL),
    });

    findings.push({
      id: "canonical",
      label: "Canonical link present",
      passed: /<link[^>]+rel=["']canonical["']/i.test(html),
    });

    // Expected slug coverage — every MARKET entry's display name should appear.
    const missingSlugs = MARKET.filter((m) => !checkContains(html, m.name)).map((m) => m.slug);
    findings.push({
      id: "expected_slugs",
      label: `All ${MARKET.length} expected listings render`,
      passed: missingSlugs.length === 0,
      detail: missingSlugs.length ? `Missing slugs: ${missingSlugs.join(", ")}` : undefined,
    });

    const passed = findings.every((f) => f.passed);
    return {
      passed,
      findings,
      target: url,
      expected: {
        title: EXPECTED_TITLE,
        ogUrl: EXPECTED_OG_URL,
        slugs: MARKET.map((m) => m.slug),
      },
      ranAt: new Date().toISOString(),
    };
  });

export type AuditPayload = {
  gates: Record<string, boolean>;
  smokeResult: unknown;
  diffResult: unknown;
  previewUrl?: string;
  approverEmail?: string;
  commitSha?: string;
  notes?: string;
};

export const recordPublishAudit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input as AuditPayload)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await (supabaseAdmin.from as any)("publish_audit")
      .insert({
        gates: data.gates ?? {},
        smoke_result: data.smokeResult ?? {},
        diff_result: data.diffResult ?? {},
        preview_url: data.previewUrl ?? null,
        approver_email: data.approverEmail ?? null,
        commit_sha: data.commitSha ?? null,
        notes: data.notes ?? null,
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string, createdAt: row.created_at as string };
  });

export const listPublishAudits = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin.from as any)("publish_audit")
    .select("id, created_at, gates, smoke_result, diff_result, preview_url, approver_email, commit_sha")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return { audits: (data ?? []) as Array<Record<string, any>> };
});

export type ConnectivityStatus = {
  ok: boolean;
  hasUrl: boolean;
  hasServiceRole: boolean;
  adminProbe: { ok: boolean; error?: string };
  checkedAt: string;
};

export const checkSupabaseConnectivity = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConnectivityStatus> => {
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const checkedAt = new Date().toISOString();

    if (!hasUrl || !hasServiceRole) {
      return {
        ok: false,
        hasUrl,
        hasServiceRole,
        adminProbe: { ok: false, error: "Missing Supabase env var(s)" },
        checkedAt,
      };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await (supabaseAdmin.from as any)("publish_audit")
        .select("id", { count: "exact", head: true })
        .limit(1);
      if (error) {
        return { ok: false, hasUrl, hasServiceRole, adminProbe: { ok: false, error: error.message }, checkedAt };
      }
      return { ok: true, hasUrl, hasServiceRole, adminProbe: { ok: true }, checkedAt };
    } catch (e: any) {
      return {
        ok: false,
        hasUrl,
        hasServiceRole,
        adminProbe: { ok: false, error: e?.message ?? String(e) },
        checkedAt,
      };
    }
  },
);
