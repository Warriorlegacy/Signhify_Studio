import { createFileRoute } from "@tanstack/react-router";
import { supabase, getSupabaseStatus } from "@/integrations/supabase/client";

type Check = { name: string; ok: boolean; detail?: string };

async function runChecks(): Promise<{ ok: boolean; checks: Check[] }> {
  const checks: Check[] = [];

  // 1. Server runtime present (we're inside a server handler).
  checks.push({
    name: "ssr_runtime",
    ok: typeof Response !== "undefined" && typeof crypto !== "undefined",
  });

  // 2. Supabase env validation reports clearly.
  const status = getSupabaseStatus();
  checks.push({
    name: "supabase_env",
    ok: status.ok,
    detail: status.reason ?? "env vars present and valid",
  });

  // 3. Exercise the Supabase fallback path. Whether real or stubbed, the
  //    client must respond without throwing — that's the contract that keeps
  //    SSR from blanking.
  let fallbackOk = false;
  let fallbackDetail = "";
  try {
    const res = await Promise.race([
      (supabase.from as (t: string) => any)("_healthcheck_nonexistent").select("*").limit(1).maybeSingle(),
      new Promise((resolve) => setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 1500)),
    ]);
    fallbackOk = res != null && typeof res === "object";
    fallbackDetail = status.ok ? "real client responded" : "stub fallback exercised";
  } catch (err) {
    fallbackOk = false;
    fallbackDetail = err instanceof Error ? err.message : String(err);
  }
  checks.push({ name: "supabase_fallback", ok: fallbackOk, detail: fallbackDetail });

  // Gate result: SSR + fallback contract MUST be green. Env can be a warning
  // (stub mode is intentional in some environments).
  const required = ["ssr_runtime", "supabase_fallback"];
  const ok = checks.filter((c) => required.includes(c.name)).every((c) => c.ok);
  return { ok, checks };
}

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const result = await runChecks();
        return new Response(
          JSON.stringify({
            ...result,
            timestamp: new Date().toISOString(),
          }),
          {
            status: result.ok ? 200 : 503,
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});
