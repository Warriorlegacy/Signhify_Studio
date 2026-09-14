# Signhify AI Workspace — HLD (interview proof)

## Context

Multi-provider AI full-stack build engine with durable 6-agent orchestration,
per-user BYOK encryption, Stripe billing, Supabase persistence, and GitHub
export. One orchestrator call fans out to sequential agents with state machine,
artifact storage, and live streaming.

## Non-goals

No microservices, no K8s, no new queue infra. Single TanStack Start app on
Vercel/Cloudflare + Supabase + Stripe + Supabase Edge Functions (Deno).

## Request flow (orchestrator mode)

```
client → createOrchestratorRun (auth + BYOK gate)
  → insert runs + 6 run_agents rows (queued)
  → POST /functions/v1/orchestrator (SSE stream)
    → per-agent loop:
        update run_agent → running
        call LLM via provider fallback (priority order, 3-strike cooldown)
        validate output (JSON schema + domain checks)
        insert run_artifacts + run_events
        update run_agent → done | error
    → update runs → completed | failed
  → client polls getOrchestratorRun (1.5s) for status
  → exportArtifactsToGitHub (create repo → push blobs → create PR)
```

## Key decisions (say these verbatim in interviews)

1. **Durable agent state in Postgres, not in-memory.** `run_agents` tracks every
   agent with status, latency, tokens, retries. If the edge function times out
   or crashes, a resume worker can pick up from the last `pending` agent.
2. **Output validation is per-agent, not post-hoc.** Each agent has a typed
   validator (`validateFrontendOutput`, etc.) that enforces JSON shape and
   domain rules before artifacts are persisted. Bad LLM output is caught early
   and retried up to 2x per agent.
3. **Stripe idempotency is claim-first, not handler-guarded.** `stripe_events`
   insert happens before dispatch; `23505` unique-violation → duplicate → 200
   early. One guard covers all six event types — a guard per handler would
   leave every sibling handler broken on retry.
4. **ai_sessions RLS was `USING (true)` for anon.** Fixed to owner-only
   (`user_id = auth.uid()`). Anon rows from before are invisible by design.
5. **Mock fallback is labeled, never silent.** `provider_used='mock'`,
   `status='fallback'` + warn log with latency. Silent mocks fake reliability
   metrics.
6. **Throttle reuses ai_sessions as the counter** (10 plans/min/user) — no
   Redis/new table. Upgrade path in comment.
7. **Signature compare is constant-time pure JS** — edge-safe, no node:crypto.
8. **GitHub export uses Git Data API (blobs + trees + commits + refs)** instead
   of naive file-by-file PUT. Single commit per export, proper base-tree merge,
   then PR from feature branch. No merge conflicts on fresh repo.
9. **Artifacts are content-addressed in run_artifacts**, not Supabase Storage.
   Keeps the stack minimal and queries fast. Upgrade path: move to Storage when
   total artifact size > 5 MB per run.

## Trust boundaries

Stripe signature + 5-min replay window → service-role DB writes → user-scoped
reads. BYOK keys never hit logs (provider name only). GitHub token is
service-level, never exposed to client.

## Agent contracts

| Agent              | Input          | Validator                                                           | Output artifacts                                 |
| ------------------ | -------------- | ------------------------------------------------------------------- | ------------------------------------------------ |
| product_strategist | prompt         | JSON: productName, oneLiner, targetAudience, keyFeatures[]          | docs/product-strategy.json                       |
| system_architect   | prompt + prior | JSON: supabaseMigration (SQL), typescriptTypes (TS), apiRoutes[]    | supabase/migrations/\*.sql, src/lib/types.ts     |
| ui_ux_designer     | prompt + prior | JSON: tailwindConfig, colorPalette, layoutSpec                      | tailwind.config.ts, src/styles/design-tokens.css |
| frontend_engineer  | prompt + prior | JSON: files[] (path, content) — filtered to .tsx/.ts/.css/.json/.md | src/routes/_.tsx, src/components/_.tsx           |
| backend_engineer   | prompt + prior | JSON: files[] — filtered to .ts/.sql/.json/.md                      | src/lib/functions/\*.server.ts                   |
| deployment_agent   | prompt + prior | JSON: vercelConfig, dockerfile, readme, envExample                  | vercel.json, Dockerfile, README.md, .env.example |

## Eval set (manual gate before each promo — 6 cases, all must hold)

| #   | Prompt                           | Expect                                                                                  |
| --- | -------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | "gym SaaS for 500 members"       | 6 agents complete, artifacts include migration + TS + React + server fn + deploy config |
| 2   | "online store for handmade soap" | Same as above, different domain                                                         |
| 3   | "x" (too short)                  | Rejected at createOrchestratorRun (4–1200 chars)                                        |
| 4   | empty prompt                     | Rejected                                                                                |
| 5   | Free user, no BYOK key           | BYOK_REQUIRED surfaces to UI                                                            |
| 6   | Provider down (bad key)          | Falls to next provider or labeled mock                                                  |

## Load gate (k6, staging — fill in deployed action URL)

```js
import http from "k6/http";
import { check } from "k6";
export const options = {
  vus: 20,
  duration: "60s",
  thresholds: { http_req_failed: ["rate<0.01"], http_req_duration: ["p(95)<800"] },
};
export default function () {
  const r = http.post(__ENV.ORCH_URL, JSON.stringify({ prompt: "gym SaaS", projectId: "xxx" }), {
    headers: { "Content-Type": "application/json" },
  });
  check(r, { "2xx/429": (x) => [200, 429].includes(x.status) });
}
```

## Metrics to quote

- Orchestrator: agent-level p50/p95 latency from `run_agents`
- AI runs: provider mix + p50/p95 latency from `run_metrics`
- Billing: zero double-credit incidents since idempotency (query `stripe_events`)
- Tests: `bun run test:unit` green (BYOK crypto + orchestrator validation + workspace proof)
- GitHub: export success rate, PR creation latency

## Skipped → add when

- Redis token-bucket throttle → when per-min DB count shows in slow-query log
- BullMQ for orchestrator jobs → when p95 > 8s sustained
- pgvector run history → when "my past plans" search is requested
- WASM sandbox for generated code execution → when validation needs runtime checks
- WebSocket streaming → when SSE reconnect logic proves insufficient
