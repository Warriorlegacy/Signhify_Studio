import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Loader2, RefreshCw, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import {
  checkSupabaseConnectivity,
  listPublishAudits,
  recordPublishAudit,
  runMarketplaceDiff,
  runMarketplaceSmoke,
  type ConnectivityStatus,
} from "@/lib/publish-checks.functions";

export const Route = createFileRoute("/publish")({
  loader: async () => {
    try {
      const { audits } = await listPublishAudits();
      return { audits };
    } catch {
      return { audits: [] as Array<Record<string, any>> };
    }
  },
  head: () => ({
    meta: [
      { title: "Pre-Publish checklist — Signhify" },
      {
        name: "description",
        content:
          "Operator-only pre-publish gate: confirm preview health, run the marketplace smoke test and SEO diff, then log an audit row before clicking Publish.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublishPage,
});

type CheckResult = {
  passed: boolean;
  checks?: Array<{ id: string; label: string; passed: boolean; detail?: string }>;
  findings?: Array<{ id: string; label: string; passed: boolean; detail?: string }>;
  target?: string;
  ranAt?: string;
};

const GATES = [
  { id: "preview_green", label: "Preview rebuilt green — no error overlay on /, /marketplace, /ai, /roadmap." },
  { id: "console_clean", label: "Browser console clean (no red errors, no unresolved import warnings)." },
  { id: "marketplace_items", label: "/marketplace shows every MARKET item with the right category, price and badge." },
  { id: "header_switcher", label: "EcosystemSwitcher opens and the Marketplace node is reachable." },
  { id: "seo_unique", label: "New routes have a unique head() (title, description, og:*) — no \"Lovable App\" defaults." },
  { id: "no_generated_edits", label: "src/routeTree.gen.ts / supabase/types.ts / bun.lockb were not hand-edited." },
  { id: "rls_grants", label: "Any new public.* table has GRANTs + RLS in the same migration." },
  { id: "secrets_safe", label: "Secrets read only inside .handler() — no process.env.* at module scope." },
  { id: "no_parallel_codex", label: "No in-flight Codex PR touching the same files; main matches preview commit." },
] as const;

function PublishPage() {
  const { audits } = Route.useLoaderData();
  const smokeFn = useServerFn(runMarketplaceSmoke);
  const diffFn = useServerFn(runMarketplaceDiff);
  const auditFn = useServerFn(recordPublishAudit);
  const connFn = useServerFn(checkSupabaseConnectivity);

  const [origin, setOrigin] = useState<string>("");
  const [gates, setGates] = useState<Record<string, boolean>>({});
  const [smoke, setSmoke] = useState<CheckResult | null>(null);
  const [diff, setDiff] = useState<CheckResult | null>(null);
  const [smokeLoading, setSmokeLoading] = useState(false);
  const [diffLoading, setDiffLoading] = useState(false);
  const [approverEmail, setApproverEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [recording, setRecording] = useState(false);
  const [auditConfirmation, setAuditConfirmation] = useState<{ id: string; createdAt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conn, setConn] = useState<ConnectivityStatus | null>(null);
  const [connLoading, setConnLoading] = useState(false);
  const [autoRetry, setAutoRetry] = useState(false);
  const autoRetryRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !origin) setOrigin(window.location.origin);
  }, [origin]);

  const allGatesTicked = GATES.every((g) => gates[g.id]);
  const smokePassed = smoke?.passed === true;
  const diffPassed = diff?.passed === true;
  const everythingGreen = allGatesTicked && smokePassed && diffPassed;
  const auditLogged = !!auditConfirmation;

  async function handleSmoke() {
    setError(null);
    setSmokeLoading(true);
    try {
      const r = await smokeFn({ data: { origin } });
      setSmoke(r);
    } catch (e: any) {
      setError(`Smoke test failed: ${e?.message ?? String(e)}`);
    } finally {
      setSmokeLoading(false);
    }
  }

  async function handleDiff() {
    setError(null);
    setDiffLoading(true);
    try {
      const r = await diffFn({ data: { origin } });
      setDiff(r);
    } catch (e: any) {
      setError(`Diff check failed: ${e?.message ?? String(e)}`);
    } finally {
      setDiffLoading(false);
    }
  }

  const refreshConn = useCallback(async () => {
    setConnLoading(true);
    try {
      const r = await connFn();
      setConn(r);
      return r;
    } catch (e: any) {
      const fallback: ConnectivityStatus = {
        ok: false,
        hasUrl: false,
        hasServiceRole: false,
        adminProbe: { ok: false, error: e?.message ?? String(e) },
        checkedAt: new Date().toISOString(),
      };
      setConn(fallback);
      return fallback;
    } finally {
      setConnLoading(false);
    }
  }, [connFn]);

  useEffect(() => {
    void refreshConn();
  }, [refreshConn]);

  const handleRecord = useCallback(async () => {
    setError(null);
    setRecording(true);
    try {
      const r = await auditFn({
        data: {
          gates,
          smokeResult: smoke ?? {},
          diffResult: diff ?? {},
          previewUrl: origin || undefined,
          approverEmail: approverEmail || undefined,
          notes: notes || undefined,
        },
      });
      setAuditConfirmation(r);
      setAutoRetry(false);
      autoRetryRef.current = false;
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(`Could not record audit: ${msg}`);
      if (/SUPABASE_SERVICE_ROLE_KEY|Missing Supabase environment/i.test(msg)) {
        setAutoRetry(true);
        autoRetryRef.current = true;
      }
    } finally {
      setRecording(false);
    }
  }, [auditFn, gates, smoke, diff, origin, approverEmail, notes]);

  // Auto-retry: when the service role secret was missing, poll connectivity
  // every 8s. As soon as the Worker reports OK, re-attempt the audit once.
  useEffect(() => {
    if (!autoRetry || auditConfirmation) return;
    let cancelled = false;
    const interval = window.setInterval(async () => {
      if (cancelled) return;
      const status = await refreshConn();
      if (cancelled) return;
      if (status.ok && autoRetryRef.current) {
        autoRetryRef.current = false;
        setAutoRetry(false);
        await handleRecord();
      }
    }, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [autoRetry, auditConfirmation, refreshConn, handleRecord]);

  const publishDisabledReason = useMemo(() => {
    if (!allGatesTicked) return "Tick every checklist gate.";
    if (!smoke) return "Run the marketplace smoke test.";
    if (!smokePassed) return "Smoke test is failing — fix and re-run.";
    if (!diff) return "Run the SEO / route diff.";
    if (!diffPassed) return "Diff has missing sections — fix and re-run.";
    if (!auditLogged) return "Record the audit row before publishing.";
    return null;
  }, [allGatesTicked, smoke, smokePassed, diff, diffPassed, auditLogged]);

  return (
    <section className="relative pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Operator console · pre-publish gate
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black">
          Confirm before you <span className="text-gradient">Publish</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Lovable's Publish button stays one click away — but this page is the gate. Walk through the
          checklist, run the two automated checks, then record the audit row. Only then does the
          "Open Publish" CTA below light up.
        </p>

        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Target origin to check (defaults to this preview)
          </span>
          <input
            type="url"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="https://id-preview--…lovable.app"
            className="mt-1 w-full rounded-md bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
          />
        </label>

        {/* Connectivity */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Worker ↔ Supabase connectivity</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Confirms the deployed Worker has the secrets needed to write the audit row before
                you start the checklist.
              </p>
            </div>
            <button
              onClick={() => refreshConn()}
              disabled={connLoading}
              className="shrink-0 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold disabled:opacity-60"
            >
              {connLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Re-check
            </button>
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            <ConnLine ok={conn?.hasUrl === true} label="SUPABASE_URL present in Worker" />
            <ConnLine
              ok={conn?.hasServiceRole === true}
              label="SUPABASE_SERVICE_ROLE_KEY present in Worker"
              detail={
                conn && !conn.hasServiceRole
                  ? "Re-publish the project so the managed secret is injected into the live Worker."
                  : undefined
              }
            />
            <ConnLine
              ok={conn?.adminProbe.ok === true}
              label="Admin probe against publish_audit"
              detail={conn?.adminProbe.error}
            />
          </ul>
          {conn?.checkedAt ? (
            <div className="mt-2 text-xs text-muted-foreground">
              Last checked {new Date(conn.checkedAt).toLocaleTimeString()}
            </div>
          ) : null}
          {autoRetry && !auditConfirmation ? (
            <div className="mt-3 text-xs text-amber-300 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" />
              Auto-retry armed — will record the audit automatically as soon as the Worker reports OK.
            </div>
          ) : null}
        </div>

        {/* Gates */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">A. Manual checklist</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Each box is your attestation — they get saved verbatim in the audit row.
          </p>
          <ul className="mt-4 space-y-2">
            {GATES.map((g) => {
              const checked = !!gates[g.id];
              return (
                <li key={g.id}>
                  <label className="flex items-start gap-3 rounded-md p-2 hover:bg-surface/60 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-primary"
                      checked={checked}
                      onChange={(e) => setGates((s) => ({ ...s, [g.id]: e.target.checked }))}
                    />
                    <span className="text-sm">{g.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 text-xs text-muted-foreground">
            {Object.values(gates).filter(Boolean).length} / {GATES.length} ticked
          </div>
        </div>

        {/* Smoke */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">B. Marketplace smoke test</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Server-side fetch of <code className="text-primary">/marketplace</code> on the target origin —
                asserts H1, category chips, listing names, and absence of the error overlay.
              </p>
            </div>
            <button
              onClick={handleSmoke}
              disabled={smokeLoading}
              className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {smokeLoading ? <Loader2 size={14} className="animate-spin" /> : null}
              {smoke ? "Re-run" : "Run smoke test"}
            </button>
          </div>
          {smoke ? <ResultList result={smoke} kind="smoke" /> : null}
        </div>

        {/* Diff */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">C. SEO &amp; route diff</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Compares the rendered HTML against the expected shape derived from{" "}
                <code className="text-primary">src/lib/marketplace.ts</code> and the route's{" "}
                <code className="text-primary">head()</code> — flags missing slugs, og tags or canonical.
              </p>
            </div>
            <button
              onClick={handleDiff}
              disabled={diffLoading}
              className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {diffLoading ? <Loader2 size={14} className="animate-spin" /> : null}
              {diff ? "Re-run" : "Run diff"}
            </button>
          </div>
          {diff ? <ResultList result={diff} kind="diff" /> : null}
        </div>

        {/* Audit */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">D. Audit row</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Timestamped record of which gates you approved and what the checks returned. Required.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Approver email (optional)
              </span>
              <input
                type="email"
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                className="mt-1 w-full rounded-md bg-surface border border-border px-3 py-2 text-sm"
                placeholder="you@signhify.online"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Notes (optional)
              </span>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-md bg-surface border border-border px-3 py-2 text-sm"
                placeholder="e.g. Codex PR #42 merged"
              />
            </label>
          </div>
          <button
            onClick={handleRecord}
            disabled={
              recording ||
              !allGatesTicked ||
              !smokePassed ||
              !diffPassed ||
              auditLogged ||
              conn?.ok !== true
            }
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {recording ? <Loader2 size={14} className="animate-spin" /> : null}
            {auditLogged ? "Audit recorded ✓" : "Record audit"}
          </button>
          {conn && !conn.ok ? (
            <div className="mt-2 text-xs text-amber-300">
              Worker connectivity check is failing — fix above before recording.
            </div>
          ) : null}
          {auditConfirmation ? (
            <div className="mt-3 text-xs text-emerald-400 font-mono">
              {auditConfirmation.id} · {auditConfirmation.createdAt}
            </div>
          ) : null}
        </div>

        {/* Publish CTA */}
        <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            {everythingGreen && auditLogged ? (
              <ShieldCheck className="text-emerald-400" />
            ) : (
              <ShieldAlert className="text-amber-400" />
            )}
            <h2 className="font-display text-xl font-bold">Publish gate</h2>
          </div>
          {publishDisabledReason ? (
            <p className="mt-2 text-sm text-amber-300">{publishDisabledReason}</p>
          ) : (
            <p className="mt-2 text-sm text-emerald-300">
              All gates green and audit row written. Open Lovable and click Publish.
            </p>
          )}
          <button
            type="button"
            disabled={!!publishDisabledReason}
            onClick={() => {
              window.alert(
                "Gates passed. Now open Lovable → Publish to ship. (This page does not call Publish directly — Lovable owns the deploy.)",
              );
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            I'm ready — open Publish
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {/* Audit log */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold">Recent audits</h2>
          {audits.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No audit rows yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {audits.map((a: Record<string, any>) => {
                const gateCount = Object.values(a.gates ?? {}).filter(Boolean).length;
                const smokeOk = a.smoke_result?.passed === true;
                const diffOk = a.diff_result?.passed === true;
                return (
                  <li
                    key={a.id}
                    className="rounded-md border border-border bg-surface/50 p-3 text-xs font-mono flex flex-wrap gap-x-4 gap-y-1"
                  >
                    <span className="text-muted-foreground">{a.created_at}</span>
                    <span>gates {gateCount}/{GATES.length}</span>
                    <span className={smokeOk ? "text-emerald-400" : "text-destructive"}>
                      smoke {smokeOk ? "✓" : "✗"}
                    </span>
                    <span className={diffOk ? "text-emerald-400" : "text-destructive"}>
                      diff {diffOk ? "✓" : "✗"}
                    </span>
                    {a.approver_email ? <span>{a.approver_email}</span> : null}
                    {a.commit_sha ? <span className="text-muted-foreground">{a.commit_sha.slice(0, 7)}</span> : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ResultList({ result, kind }: { result: CheckResult; kind: "smoke" | "diff" }) {
  const items = kind === "smoke" ? result.checks ?? [] : result.findings ?? [];
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-sm">
        {result.passed ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <XCircle size={16} className="text-destructive" />
        )}
        <span className={result.passed ? "text-emerald-400" : "text-destructive"}>
          {result.passed ? "All checks passed" : "Checks failed"}
        </span>
        {result.target ? (
          <span className="text-xs text-muted-foreground ml-2">· {result.target}</span>
        ) : null}
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-sm">
            {c.passed ? (
              <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
            ) : (
              <Circle size={14} className="mt-0.5 text-destructive shrink-0" />
            )}
            <span>
              {c.label}
              {c.detail ? <span className="block text-xs text-muted-foreground">{c.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
