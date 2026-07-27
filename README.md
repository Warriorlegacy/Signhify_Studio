# ⚡ Signhify — AI Product Studio & SaaS Engineering Engine

<div align="center">

![Signhify](https://signhify.dpdns.org/favicon.ico)

**Describe your idea. Signhify builds it. Ship AI SaaS in 2 weeks.**

[![Live Site](https://img.shields.io/badge/Live-signhify.dpdns.org-000?style=flat-square&logo=vercel)](https://signhify.dpdns.org)
[![GitHub Stars](https://img.shields.io/github/stars/Warriorlegacy/Signhify_Studio?style=flat-square&logo=github)](https://github.com/Warriorlegacy/Signhify_Studio/stargazers)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-React%2019-ff4154?style=flat-square&logo=react)](https://tanstack.com/start)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite%206-Nitro-646cff?style=flat-square&logo=vite)](https://vite.dev)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-008cdd?style=flat-square&logo=stripe)](https://stripe.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Edge-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000?style=flat-square&logo=three.js)](https://threejs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS%204-v4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![MSME](https://img.shields.io/badge/Govt%20MSME-UDYAM--UP--30--0081308-1e40af?style=flat-square)](https://udyamregistration.gov.in)
[![License](https://img.shields.io/badge/License-MIT-a855f7?style=flat-square)](/LICENSE)

[🌐 Website](https://signhify.dpdns.org) · [📖 Insights](https://signhify.dpdns.org/insights) · [⚡ AI Blueprint](https://signhify.dpdns.org/ai) · [💰 Pricing](https://signhify.dpdns.org/pricing) · [📬 Contact](https://signhify.dpdns.org/contact)

</div>

---

## For Whom

- **Founders** who want a production-ready AI SaaS in weeks, not months
- **Agencies** looking for a battle-tested full-stack AI platform to white-label
- **Developers** exploring TanStack Start + Supabase + Stripe architecture

## What Makes Signhify Different

| You get                                         | vs Typical Agency                   |
| ----------------------------------------------- | ----------------------------------- |
| Code on your GitHub day one                     | Proprietary platform lock-in        |
| 2-week sprints, fixed price                     | Open-ended timeline, hourly billing |
| BYOK AES-256 GCM encryption                     | API keys stored server-side         |
| Multi-provider AI (OpenAI + Anthropic + custom) | Single-model dependency             |
| Edge-deployed (Cloudflare Workers)              | Centralized VPS                     |
| Govt-registered MSME (UDYAM-UP-30-0081308)      | Unregistered entity                 |

## Stack

```
React 19 + TanStack Start  →  Nitro SSR (edge)
Supabase (Postgres + Auth + RLS + Realtime)
Stripe (subscriptions + credit packs + marketplace)
Cloudflare Workers / Pages  →  Global edge
Tailwind CSS 4 + Framer Motion + Three.js
OpenAI + Anthropic + Custom LLM endpoints
AES-256 GCM client-side encryption (BYOK)
```

## Local Setup

```bash
git clone https://github.com/Warriorlegacy/Signhify_Studio.git
cd Signhify_Studio
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Architecture Highlights

- **Server functions** (`createServerFn`) — AI calls and DB queries run server-side, no key exposure
- **Row Level Security** — tenant isolation at the Postgres level
- **BYOK vault** — user API keys encrypted in-browser before hitting our server
- **SSE streaming** — AI responses streamed via Server-Sent Events through Nitro
- **Credit-based billing** — deduct-before-call, refund-on-failure pattern

## Production Build

```bash
npm run build
npx vite preview
```

## Insights

Practical AI SaaS guides at [/insights](https://signhify.dpdns.org/insights):

- How to Build an AI SaaS MVP in 2 Weeks
- AEO Guide: Rank on ChatGPT, Perplexity & Google AI
- BYOK Security Architecture for AI SaaS
- Postgres pgvector vs Dedicated Vector Databases
- And 8 more engineering playbooks

## Trust

- **Govt MSME**: UDYAM-UP-30-0081308 (Govt of India)
- **Founder**: Piyush Raj Singh
- **Location**: Noida, Uttar Pradesh, India
- **Contact**: Piyushrajsingh092@gmail.com · +91-6202442690

## License

MIT — see [LICENSE](LICENSE).

<div align="center">

Built by [Piyush Raj Singh](https://github.com/Warriorlegacy) · Signhify AI Studio

</div>
