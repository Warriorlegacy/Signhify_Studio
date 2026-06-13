# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development (preview)
- `npm run preview` - Preview production build
- `npm run start` - Same as preview
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run guide:pdf` - Generate guide PDF
- `npm run guide:check` - Check guide PDF generation
- `npm run prepublish:check` - Run guide PDF generation and prepublish script
- `bunx playwright test` - Run Playwright visual tests (compares against baselines)
- `bunx playwright test -u` - Update Playwright baselines after intentional changes
- `bunx playwright test tests/smoke` - Run smoke tests
- `bunx playwright test <test-file>` - Run a specific test file (e.g., `bunx playwright test tests/smoke/marketplace.spec.ts`)
- `bunx playwright test <test-file> -t "<test-title>"` - Run a specific test by title within a file

## Code Architecture

### Entry Points

- `src/start.ts` - Creates TanStack Start instance with middleware (Supabase auth, error handling)
- `src/router.tsx` - Sets up TanStack React Router with generated route tree
- `src/server.ts` - Custom server logic (SSR error wrapper)

### Routing

- File-based routing via TanStack React Router
- Route definitions generated in `src/routeTree.gen.ts` (updated by TanStack router plugin)
- To regenerate routes after adding new route files, run the dev server or `npx @tanstack/router-generator build`
- Home page: `src/routes/index.tsx` - Composes page sections
- Projects page: `src/routes/projects.tsx` - Loads projects data via server function
- Project detail: `src/routes/projects.$slug.tsx` - Shows individual project

### Data Layer

- Supabase is the primary backend (database, auth, storage)
- Database schema managed via Supabase migrations (`supabase/migrations/`)
- Supabase client:
  - User-authenticated: `src/integrations/supabase/client.ts`
  - Admin/service role: `src/integrations/supabase/client.server.ts`
- Server functions (TanStack Start) for API routes:
  - AI plan generation: `src/lib/ai-generate.functions.ts` (calls Lovable API or local mock)
  - Projects listing: `src/lib/projects-list.functions.ts` (calls `src/lib/projects.server.ts`)
  - Other functions: analytics, auth-generate, cloudflare, etc. in `src/lib/`
- Supabase Edge Functions (Denon/TypeScript):
  - `supabase/functions/generate-plan/index.ts` - Streams AI-generated plan in sections
  - `supabase/functions/log-pageview/index.ts` - Logs page views
  - `supabase/functions/run-agent/index.ts` - Runs AI agent tasks
  - `supabase/functions/send-waitlist-email/index.ts` - Sends waitlist emails

### UI Structure

- Reusable UI components: `src/components/ui/` (shadcn/ui inspired)
- Page sections: `src/components/sections/` (Hero, Projects, Services, etc.)
- 3D/Three.js components: `src/components/three/` (CinematicHero3D, EmberField, etc.)
- Layout components: Header, Footer, etc.

### State Management

- TanStack React Query for server state (queryClient provided in router)
- React state (useState, useEffect) for UI state
- Session storage used for persisting prompt/mode/stack between pages (HeroSection)

### Styling

- Tailwind CSS configured via `@tailwindcss/vite` plugin
- Custom CSS in `src/index.css` (if exists) or via Tailwind
- Prettier configuration: `.prettierrc` (printWidth: 100, semi: true, singleQuote: false, trailingComma: all)

### Key Dependencies

- Framework: TanStack Start (`@tanstack/react-start`)
- Routing: TanStack React Router (`@tanstack/react-router`)
- State: TanStack React Query (`@tanstack/react-query`)
- Forms: React Hook Form (`react-hook-form`) with Zod validation
- UI: Radix UI components (`@radix-ui/*`) for accessibility
- Animations: Framer Motion (`framer-motion`)
- 3D: React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`)
- Icons: Lucide React (`lucide-react`)
- Toast: Sonner (`sonner`)
- Date formatting: date-fns
- Markdown: marked
- Supabase: `@supabase/supabase-js`

### AI Features

- AI plan generation: Uses Lovable API (`ai.gateway.lovable.dev`) with Claude Sonnet 4.5 model
- Fallback to local mock generator when API key missing
- Structured output: Product name, one-liner, 6 sections (Product Strategist, System Architect, UI/UX Designer, Frontend Engineer, Backend Engineer, Deployment Agent), technology stack

## Testing

- Visual regression tests: Playwright tests in `tests/visual/` (route screenshots)
  - Run: `bunx playwright test` (compares against baselines)
  - Update baselines: `bunx playwright test -u`
- Smoke tests: `tests/smoke/marketplace.spec.ts` and `tests/smoke/studio.spec.ts` (basic functionality checks)
  - Run all smoke tests: `bunx playwright test tests/smoke`
  - Run a specific smoke test: `bunx playwright test tests/smoke/<test-file>.spec.ts`
- Tests require Playwright browsers: `bunx playwright install chromium` (one-time setup)
- Override target URL with `PLAYWRIGHT_BASE_URL` environment variable (defaults to http://localhost:3000)

## Environment Variables

Check `.env` file (not committed) for:

- `LOVABLE_API_KEY` - For AI plan generation via Lovable API
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- Other variables as needed for integrations

## Common Tasks

- Adding a new page: Create a file in `src/routes/` (supports nested routes, layout, etc.)
- Adding a UI component: Add to `src/components/ui/` following existing patterns
- Adding a section: Create in `src/components/sections/` and use in a route
- Supabase migrations: Create new SQL files in `supabase/migrations/`
- Edge functions: Modify or add in `supabase/functions/`
- Regenerate route types: Run dev server or `npx @tanstack/router-generator build`
- Working with AI features: Modify `src/lib/ai-generate.functions.ts` or edge functions in `supabase/functions/generate-plan/`
- Utility functions: Add helper functions to `src/lib/utils.ts` or domain-specific files in `src/lib/`
- Build scripts: Check the `scripts/` directory for maintenance scripts (e.g., `scripts/build-guide-pdf.mjs`)