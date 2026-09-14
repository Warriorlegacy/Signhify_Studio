// ponytail: pure AI-run helpers — DB writes stay in the server functions so
// these are unit-testable without Supabase.

export type AIRunStatus = "ok" | "fallback" | "error";

export type AIRunFields = {
  provider_used: string;
  latency_ms: number;
  status: AIRunStatus;
  error: string | null;
};

export function buildAIRunFields(input: {
  providerUsed?: string | null;
  latencyMs?: number | null;
  error?: unknown;
}): AIRunFields {
  const provider = input.providerUsed?.trim() || "unknown";
  return {
    provider_used: provider,
    latency_ms: Math.max(0, Math.round(input.latencyMs ?? 0)),
    status: provider === "mock" ? "fallback" : input.error ? "error" : "ok",
    error: input.error
      ? String((input.error as Error)?.message ?? input.error).slice(0, 500)
      : null,
  };
}

// Per-user AI throttle reusing ai_sessions as the counter — no new infra.
// Default 10 plans/min is generous for humans, stops runaway loops.
export function aiThrottleExceeded(recentCount: number, limit = 10): boolean {
  return recentCount >= limit;
}
