<div align="center">

# Signhify Studio

**AI Software Engineering Operating System**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2D3748?style=for-the-badge&logo=playwright)](https://playwright.dev/)

</div>

## Overview

Signhify Studio is an AI-native platform that combines:

- **Hunter** — AI agent system for research, analysis, and automation
- **SEO Workspace** — RAG-powered content optimization and retrieval
- **Billing** — Usage-based billing with per-user/per-workflow cost tracking
- **Evaluation** — Reproducible agent benchmarks and regression testing

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun + Node.js |
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Backend | Express/Next.js API Routes + Prisma ORM |
| Database | Supabase PostgreSQL |
| AI | OpenAI/Anthropic/Google (provider-agnostic gateway) |
| Testing | Playwright (E2E) + Jest/Vitest (unit/integration) |
| Deployment | Vercel + Docker |

## Key Features

- Multi-agent orchestration with human-in-the-loop approval gates
- RAG pipeline with hybrid retrieval and reranking
- Usage-based billing with cost controls and quotas
- Reproducible evaluation framework with benchmark datasets
- Structured observability (traces, logs, metrics via OpenTelemetry)
- Multi-tenant architecture with row-level security

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

## Development Notes

This project was initially prototyped with AI-assisted coding tools. The engineering team has since reviewed, refactored, and validated all production code. See [CONTRIBUTING.md](CONTRIBUTING.md) for code review standards and [docs/architecture.md](docs/architecture.md) for system design.

## Getting Started

```bash
# Clone and install
git clone https://github.com/Warriorlegacy/Signhify_Studio.git
cd Signhify_Studio
bun install

# Set environment variables
cp .env.example .env.local

# Launch dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to access the local AI Studio dashboard.

## Testing

```bash
# Run E2E tests
npx playwright test

# Run unit/integration tests
npm test
```

## Documentation

- [Architecture](docs/architecture.md) — System design and AI-native pipeline
- [Security](SECURITY.md) — Security policy and responsible disclosure
- [Contributing](CONTRIBUTING.md) — Code review standards and development workflow
- [Evaluation](docs/evaluation.md) — Benchmark datasets and regression testing

## Security

See [SECURITY.md](SECURITY.md) for responsible disclosure and security best practices.

## License

MIT — see [LICENSE](LICENSE).
