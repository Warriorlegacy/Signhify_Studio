# DESIGN.md: Draftly.space (Signhify clone target)

## Source
- URL: https://www.draftly.space/
- Capture date: 2026-08-18
- Evidence: Firecrawl `branding`/`images`/`markdown`/`html`/`rawHtml` scrapes, full-page screenshot, both Next.js CSS bundles (`.firecrawl/`)

## Reference Screenshot
![Full-page screenshot of Draftly](./.firecrawl/draftly-screenshot.png)

## Tech Stack (verified from raw HTML)
- **Next.js App Router** (SSR, `_next/static` chunks, `<next-route-announcer>`), deployed on **Vercel** (`?dpl=` cache-busting)
- **Tailwind CSS v4** (arbitrary values `bg-[#050508]`, `@theme`-style tokens, tw vars)
- **Fonts (self-hosted via next/font)**: Inter (body/sans), Space Grotesk (display), JetBrains Mono (mono)
- **Icons**: Font Awesome 6.5.1 (CDN, nav/footer/hero CTAs) + Lucide (inline SVG, feature cards)
- Custom component classes: `bg-grid-global`, `bg-lines`, `bg-dots`, `bg-noise`, `divider`, `btn-moonlit`, `btn-preset-cta`, `agent-glass-shine`, `draftly-chat-bloom`, `draftly-chat-ring`, `tag`
- Client animation: scroll-linked `<canvas>` pair (hero + global), IntersectionObserver reveal (`opacity:0;translateY` inline styles), gooey SVG filter for nav pill

## Design Summary
Near-black (`#050508`) cinematic dark theme with a **lime** primary (`#c6ff3a`), mint (`#3cffb0`) and cyan (`#4fd6ff`) accents. Glassmorphism pills and cards (backdrop-blur, `border-white/[0.09]`, `bg-[#0b0d16]`), layered fixed background textures (grid 80px, diagonal lines, dots 24px, noise 2.5%), glow blobs, mono uppercase micro-labels, Space Grotesk display headings, 15px-radius "cinema" buttons.

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `--brand-primary` | `#c6ff3a` | lime — CTAs, accents, hover text |
| `--brand-secondary` | `#3cffb0` | mint — glow blobs, chat ring |
| `--brand-tertiary` | `#4fd6ff` | cyan — section eyebrow badges |
| background | `#050508` | page base |
| surface | `#0b0d16` | nav pills, glass cards |
| card | `#0c0c16` / `rgba(10,10,20,0.85)` | preset cards / testimonials |
| text | `#EDEDED` / white | headings & body |
| text muted | `white/40`–`white/70` | secondary copy |
| lime-on-lime text | `#10160a` | text on lime buttons |

### Typography
- Body: Inter 400/500/600 (`font-sans`), sizes 12–18px, `leading-relaxed`, white/90
- Display: Space Grotesk 500–800 (`font-display`), h2 `text-4xl md:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.05]`, key word highlighted `text-[#c6ff3a]`
- Mono: JetBrains Mono (`font-mono`) — section numbers (`01`–`06`, `text-[10px] uppercase tracking-widest`), footer headings (`text-[11px] tracking-[0.18em]`), micro-labels
- Eyebrow badges: `text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4fd6ff] bg-[#4fd6ff]/10 px-3 py-1.5 rounded-full border border-[#4fd6ff]/20`

### Spacing & Layout
- Max widths: `max-w-[1400px]` content, `max-w-6xl` footer, `max-w-3xl` section headers
- Section rhythm: `py-24 md:py-32` (footer `pt-[72px]`), dividers: 1px gradient line `max-w-[1200px]` with `scaleX` reveal
- Cards: `rounded-2xl xl:rounded-3xl` (presets), `rounded-3xl` (features), border `white/[0.04]`–`white/[0.12]`
- Buttons: 15px radius lime CTAs (`#c6ff3a` bg, `#10160a` text, glow shadow), full-pill secondary (`rounded-full border border-white/10 bg-white/5`)
- Shadows: `shadow-[0_20px_60px_rgba(0,0,0,0.55)]` cards, `0_10px_30px_rgba(0,0,0,0.45)` nav

## Components
- **Nav**: fixed top-4/5, three pills: logo (`rounded-full bg-[#0b0d16]`, gradient lime square mark `from-[#d9ff6e] to-[#9fd62a]` + inner `2.5` square), center nav pill (5 links, Font Awesome icons `text-[11px]`, hover `bg-white/[0.07]`, Presets gets `Beta` badge), right (Login ghost pill, **Get started** = conic-gradient ring `from_140deg #4fd6ff,#3cffb0,#c6ff3a…` with dark inner pill + lime arrow). Mobile: hamburger. Gooey SVG filter `draftly-nav-goo` + radial gradient dot behind nav.
- **Hero**: full-screen, layered background (radial lime glows + 228deg gradient + 7px dot grid), two scroll-linked canvases, bottom-anchored stack: pricing pill CTA (lime ring glow, rocket icon, "Draftly Basic — $25/mo", shine sweep on hover, lime "Get started" button that turns cyan on hover), chat card (`draftly-chat-ring` spinning conic gradient border, `draftly-chat-bloom` glow, textarea + paperclip/mic/arrow-up buttons), "3D Website Builder" lime button, "Scroll" mono hint with bouncing chevron. Mobile variant: gradient bottom fade, same cards stacked.
- **Preset cards**: `aspect-video` gradient art placeholder (per-preset color: rose/orange, blue/cyan, cyan/slate…), title + 2-line desc, "Customize" lime button + "Preview" ghost pill w/ external icon. Hover: `border-white/[0.18]`.
- **Testimonials**: fanned deck — center card `z-4` normal, sides `scale(0.84–0.92) rotate(±5–11deg)` fading out, serif `"` quote glyph, avatar+name+role+flag footer, arrows, pill dot indicators (active `w-6`), "drag" hint, auto-advance 3s.
- **Pipeline**: 6 cards `xl:grid-cols-6` with connecting gradient line, icon in `w-14 h-14 rounded-2xl` glass box (lucide: sparkles, terminal, image, video, layers, download), mono number, hover `bg-[#c6ff3a]/5 border-[#c6ff3a]/30`.
- **Zero Code**: 2-col — copy + CTAs left, right: browser-chrome mock (`rounded-3xl` glass, 3 dots, `aspect-[4/3]` auto-playing muted looped demo video, `mix-blend-overlay` mint gradient).
- **Pro Tools**: bento grid — 2-col feature ("Multi-Video Continuation", lucide layers) + 4 singles (file-code2, messages-square, box, clock).
- **CTA/Stats**: `rounded-[40px]` glass panel with mint blur blobs, "Build 3D websites **10x faster** with AI", lime "Start Building Free" + ghost "View Pricing", 4 stat cards (`400+` Frames per Site, `~8s` Video Duration, `10–40` Adjustable FPS, `ZIP` Ready to Deploy) with lucide icons.
- **Footer**: 5-col grid `[1.4fr_repeat(4,1fr)]`, brand block (logo + tagline + 4 social squares), 4 mono-heading columns (Product, Company, Resources, Legal) `text-[13px]` links `hover:text-white/70`, bottom bar: copyright mono + Privacy/Terms/Cancellation + "Built in India" (mini tri-color flag built from CSS bars).
- **Cookie banner**: fixed bottom card `bg-[#0c0c14]/95`, "Essential only" ghost + "Accept all" white button.

## Page Patterns
Section order: Hero → Preset Gallery (#best-previews) → divider → Pipeline (#features) → divider → Zero Code → divider → Pro Tools → divider → CTA/Stats → divider → Footer. All sections `relative z-10` over fixed background layers (z-0 grid, z-1 lines/dots, z-2 noise). Reveal animations: `translateY(28–40px)` + fade via IntersectionObserver, dividers `scaleX(0→1)`.

## Content Style
Product copy, punchy: "From prompt to production", "Your video becomes a scroll experience", "Built for serious websites". CTAs: "Get started", "Start Building Free", "Try the Builder", "Browse all presets", "Customize". Micro-labels in caps mono ("PRESET GALLERY", "Zero Code", "Pro Tools", "The Pipeline", "From our community").

## Agent Build Instructions
1. Use Signhify's existing stack (TanStack Start + React 19 + Tailwind v4 + lucide-react — equivalent to Next.js+Tailwind; fonts Inter/Space Grotesk/JetBrains Mono already loaded).
2. Replicate class-for-class from `.firecrawl/draftly-pretty.html`; swap all "Draftly"/"DRAFTLY"/"draftly" brand strings to Signhify/SIGNHIFY/signhify and copy mentions.
3. Port custom CSS classes verbatim (grid/lines/dots/noise layers, divider, btn-moonlit, btn-preset-cta, agent-glass-shine, draftly-chat-bloom/ring, tag).
4. Self-host `/landing/scroll-experience-demo.mp4` (already in `public/landing/`).
5. Keep functional behavior: IntersectionObserver reveals, testimonial carousel (drag + arrows + 3s auto-advance), chat ring spin, shine sweeps, canvas hero scrub.
6. Map links to existing Signhify routes (builder, templates, insights, pricing, contact, login, signup, about, affiliate, roadmap, help, privacy, terms).
7. Hide the global SiteHeader/SiteFooter/WhatsAppFab on `/` since the page carries its own nav + footer.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://www.draftly.space/
target_stack: TanStack Start + React 19 + Tailwind v4 (existing Signhify stack)
output: DESIGN.md + rebuilt `src/routes/index.tsx`