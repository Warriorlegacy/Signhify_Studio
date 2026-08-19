# Session Context — Signhify

_Last updated: 2026-08-19_

## Objective
- Complete zero-knowledge BYOK across every user-facing AI path.
- Site housekeeping: replace Draftly branding, official socials, deliver the embedded video, fix the dead mic buttons.

## Important Details
- **No "Draftly" exists in app code** — only in competitor-research docs (renaming would corrupt their meaning) and `scripts/.leads-sent.json` (runtime data). Site branding is already 100% Signhify.
- **BYOK streaming gap solved**: `supabase/functions/generate-plan/index.ts` has been rewritten with full user JWT authentication via Supabase Auth, profiles plan check (paid/admin → managed providers; free → zero-knowledge BYOK decryption via Deno WebCrypto `crypto.subtle` AES-256-GCM, matching client `SHA-256` key derivation, `clientKeys` from body with fallback to `SECRETS_MASTER_KEY`). Dynamic per-request providers built and streamed with multi-provider failover.
- **Official socials**: LinkedIn `linkedin.com/in/piyushraj-singh`, Instagram `instagram.com/piyushrajsingh.golu`, email `piyushrajsingh092@gmail.com`.
- **lucide-react 1.17 dropped brand icons** — used `Camera` in SiteFooter (LandingFooter has its own inline SVG icon).
- **Mic buttons**: Wired with `useSpeechToText` hook (Web Speech API, `window.SpeechRecognition ?? webkitSpeechRecognition`, en-US, append-to-prompt, pulse state while listening, disabled+tooltip when unsupported).
- **Video**: `public/landing/scroll-experience-demo.mp4` (30.9 MB) copied to `C:\Users\Piyush\Desktop\scroll-experience-demo.mp4`, embed removed from `LandingSections.tsx`, file deleted and staged.
- Build-product mock fallbacks rethrow BYOK gate/decrypt errors (`isByokGateError` checks `error.code` prefix `BYOK`); added `code = "BYOK_DECRYPT_FAILED"` in `ai-access.server.ts`.

## Work State

### Completed
- `build-product.functions.ts`: all 5 fns (buildProduct, editProduct, ejectProduct, buildMultiProduct, editFiles) → middleware `[requireSupabaseAuth, withByokKeys]`, calls via `generateAIResponseFor(options, aiCtxFrom(context))`; `aiCtxFrom` + `isByokGateError` helpers added.
- `ai-with-usage.service.ts` deleted and staged.
- `supabase/functions/generate-plan/index.ts`: rewritten for Deno with user JWT auth, profiles plan check (managed for paid/admin, BYOK for free), WebCrypto AES-256-GCM decrypt, dynamic provider list, SSE streaming.
- `src/lib/ai-generate-stream.functions.ts`: `getGeneratePlanStreamConfig` extracts and returns user authorization `token` alongside `bearer`.
- `src/routes/ai.tsx`: sends `clientKeys: readByokSessionKeys()` in stream body and sets `authorization: Bearer ${token || bearer}`.
- Socials updated across `LandingFooter.tsx`, `SiteFooter.tsx`, `FounderSection.tsx`, `__root.tsx`, `about.tsx`, `brand.tsx`.
- Mic fixed: `src/hooks/use-speech-to-text.ts` created and wired in `LandingHero.tsx` + `HeroSection.tsx`.
- Video delivered to Desktop + embed removed + deleted from git.
- Verification: `bunx tsc --noEmit` passed cleanly (0 errors), `bun test tests/unit` passed (18 pass, 0 fail), `bun run lint` passed (0 errors).

### Active
- Production build validation and git status check.

### Blocked
- (none)

## Next Move
- Commit and push clean working tree.