# Signhify Hunter

Autonomous client-acquisition OS for the Signhify studio. Scans public feeds (Hacker News, Reddit) for founders in need of a developer, verifies & scores leads, then runs personalized email campaigns from the browser — with unsubscribe and suppression built in.

## Quick start

```bash
bun install
bun run dev        # http://localhost:3001 — app + engine run in-process
bun run worker     # standalone queue worker (engine only, no web)
bun run smoke      # end-to-end pipeline check on a throwaway DB
bun run typecheck
bun run build
```

Copy `.env.example` to `.env`. Everything works with zero keys: agents run in
sandbox mode (messages are created with `sandbox:` provider ids, never sent).

## What it does

- **Scout** (`src/agents/scout.server.ts`) — HN Algolia / Reddit adapters find
  people asking for help; leads are deduped by domain.
- **Verify & qualify** (`src/agents/verify.ts`, `qualify.server.ts`) — SMTP
  probing + ICP scoring (tier A–D). Optional LLM scoring when a key is set.
- **Campaigns** — multi-step email sequences with personalized templates
  (`writer.server.ts`). Engine prepares audiences, schedules sends, marks
  suppression.
- **Inbox** — thread classification and reply suggestions; "unsubscribe" in a
  reply suppresses the sender forever.
- **Compliance** — one-click unsubscribe page (`/unsubscribe`), suppression
  table checked at every send, CAN-SPAM footer + List-Unsubscribe headers on
  real sends.

## Architecture

- **Runtime**: Bun (`bun:sqlite` for storage — the app runs under Bun; the
  node/nitro preview server doesn't provide `bun:sqlite`).
- **Web**: TanStack Start (React 19). `src/start.ts` is the client entry;
  `src/server.ts` boots the engine (`initSchema` + `startEngine`) and serves
  the app. Server-only modules carry `.server.ts` so they never enter the
  client bundle.
- **Engine** (`src/lib/engine.ts`): poll-based worker + scheduler over a
  `jobs` table (`src/lib/queue.server.ts`). Kinds: `scout`, `verify`,
  `qualify`, `campaign_prepare`, `campaign_send`, `classify`. SQLite WAL DB at
  `data/hunter.db` (override with `HUNTER_DB_PATH`).
- **Vite config** (`vite.config.ts`): `bun:sqlite` + node builtins are
  externalized from the SSR bundle.

## Deploy notes

- Dev: `bun run dev` (engine runs in the dev server process; no worker needed).
- Prod on a Bun server: build once, then run `scripts/worker.ts` in a separate
  process plus the server entry from `.output/`.
- The default nitro preset targets Cloudflare; `bun:sqlite` won't run there —
  use a Node/Bun-compatible preset or keep Hunter on the studio machine.
