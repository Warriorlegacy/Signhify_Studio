# Architecture

## Overview

`Warriorlegacy/Signhify_Studio` is an AI-native platform combining:
- **Hunter** — AI agent system for research, analysis, and automation
- **SEO Workspace** — RAG-powered content optimization
- **Billing** — Usage-based billing with per-user/per-workflow cost tracking
- **Evaluation** — Reproducible agent benchmarks

## Tech Stack

- **Runtime:** Bun + Node.js
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend:** Express/Next.js API Routes + Prisma ORM
- **Database:** Supabase PostgreSQL
- **AI:** OpenAI/Anthropic/Google via provider-agnostic gateway
- **Testing:** Playwright (E2E) + Jest/Vitest (unit/integration)
- **Deployment:** Vercel + Docker

## AI-Native Pipeline

```
USER / EVENT / SCHEDULE
  → INTENT DETECTION
  → CONTEXT RETRIEVAL
  → PLANNING
  → AGENT / WORKFLOW EXECUTION
  → TOOL CALLS
  → VALIDATION
  → OPTIONAL HUMAN APPROVAL
  → ACTION
  → OBSERVABILITY
  → RESULT
  → FEEDBACK
  → OPTIMIZATION
```

## Directory Structure

```
hunter/              AI agent system
├── agents/          Agent definitions, prompts, configurations
├── memory/          Short-term, working, persistent, semantic memory
├── tools/           Tool definitions, MCP integration
├── routes/          API routes for agent interactions
├── billing/         Subscription, usage metering, cost tracking
└── evaluation/      Eval datasets, benchmarks, metrics

src/                 Core application code
prisma/              Database schema
supabase/            Supabase configuration
public/              Static assets
docs/                Documentation
seo-workspace/       SEO RAG workspace
tests/               Test suite
```

## Security

See [SECURITY.md](SECURITY.md).

## Observability

Structured logging, metrics, and tracing are implemented via OpenTelemetry-compatible patterns.

## Evaluation

Reproducible evaluation framework with benchmark datasets, regression tests, and hallucination checks.

## License

Apache-2.0 — see [LICENSE](LICENSE).
