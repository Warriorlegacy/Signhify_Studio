import { createFileRoute } from "@tanstack/react-router";
import { supabase, getSupabaseStatus } from "@/integrations/supabase/client";

// Public liveness probe. Returns only a generic ok/degraded signal so the
// endpoint can be used by uptime monitors without leaking infrastructure
// details (stack names, env var errors, raw DB error strings).
async function isHealthy(): Promise<boolean> {
  if (typeof Response === "undefined" || typeof crypto === "undefined") return false;

  // The supabase client must respond (real or stub fallback) without throwing.
  // Env misconfig alone is NOT fatal — the stub fallback path is the contract
  // that keeps SSR from blanking.
  try {
    const res = await Promise.race([
      (supabase.from as (t: string) => any)("_healthcheck_nonexistent")
        .select("*")
        .limit(1)
        .maybeSingle(),
      new Promise((resolve) => setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 1500)),
    ]);
    if (res == null || typeof res !== "object") return false;
  } catch {
    return false;
  }

  // Surface env problems to server logs only.
  const status = getSupabaseStatus();
  if (!status.ok) console.warn(`[health] supabase env degraded: ${status.reason}`);

  return true;
}

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const ok = await isHealthy();
        return new Response(
          JSON.stringify({ ok, timestamp: new Date().toISOString() }),
          {
            status: ok ? 200 : 503,
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
