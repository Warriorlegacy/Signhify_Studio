# Deployment

Signhify is a TanStack Start app — server-rendered React + Vite, runs on edge
(Cloudflare Workers / Vercel Edge) or any Node host.

## Environment variables

Required at build/runtime. Already wired through `src/integrations/supabase/`.

| Variable                          | Where used                       | Example                          |
| --------------------------------- | -------------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`               | Browser + server clients         | `https://xxx.supabase.co`        |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | Browser (anon, RLS-bounded)      | `eyJhbGc...`                     |
| `SUPABASE_URL`                    | Server functions                 | same as above                    |
| `SUPABASE_PUBLISHABLE_KEY`        | Server (auth-middleware)         | same as above                    |
| `SUPABASE_SERVICE_ROLE_KEY`       | Admin-only server routes         | secret                           |
| `LOVABLE_API_KEY`                 | AI gateway (optional)            | secret                           |

When previewing on Lovable, the publishable + URL pair is auto-injected.

## Deployment targets

### Vercel (recommended)

1. Push the GitHub repo connected to this Lovable project.
2. Import into Vercel as a TanStack Start project (auto-detected from `vite.config.ts`).
3. Add all `SUPABASE_*` and `VITE_SUPABASE_*` vars in **Settings → Environment Variables**.
4. Build command: `bun run build` · Output: `.output/public` (handled by Vite plugin).
5. Stable production URL: `signhify.online` (via custom domain).

### Netlify

1. New site from Git → pick the repo.
2. Build command `bun run build`, publish directory `dist` (TanStack adapter).
3. Same env vars as Vercel.

### Cloudflare Pages / Workers

Native target for TanStack Start. Use `wrangler` or the Cloudflare Pages GitHub
integration. Confirm `nodejs_compat` is enabled (it ships on by default in this
template).

## Deployment gates

A health check lives at `/api/public/health` and reports SSR runtime,
Supabase reachability, and whether the client fallback path is exercised.
`scripts/check-deploy.mjs` pings the endpoint and exits non-zero on failure —
wire it into a GitHub Action or post-deploy hook before flipping DNS.

```bash
bun scripts/check-deploy.mjs https://signhify.online
```

## Future-ready hooks (already scaffolded)

- **Auth**: `requireSupabaseAuth` middleware ready in `src/integrations/supabase/auth-middleware.ts` — gate any `createServerFn` with it.
- **Admin dashboard**: drop routes under `src/routes/_authenticated/admin/` once a `user_roles` table exists.
- **Analytics**: `src/lib/lovable-error-reporting.ts` is the seam — add PostHog / Plausible alongside it.
- **CMS-like updates**: `src/lib/content/index.ts` is the single registry — swap each export with a `createServerFn` Supabase loader and consumers don't change.
