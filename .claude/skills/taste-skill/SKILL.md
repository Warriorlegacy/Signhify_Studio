---
name: taste-skill
description: "Anti-slop frontend design skill for landing pages, portfolios, and redesigns. Gives Claude real design taste — bold type, intentional color, premium layout. Makes your UI stop looking like generic AI slop."
---

# Taste Skill — Anti-Slop Frontend Design

Three dials: DESIGN_VARIANCE (1-10), MOTION_INTENSITY (1-10), VISUAL_DENSITY (1-10).  
Baseline: 8/6/4. Inferred from brief signals.

## Design Engineering Directives

- **Typography:** Avoid Inter as default. Serif very discouraged. No Fraunces/Instrument_Serif defaults.
- **Color:** Max 1 accent color. No AI-purple by default. No beige/brass/oxblood premium-consumer palette.
- **Layout:** Anti-center bias, no 3-equal-cards, shape consistency lock, bento cell count = content count.
- **Hero:** Viewport fit, ≤4 text elements, ≤20 word subtext, max pt-24.
- **Content density:** Short headlines, no data-dump sections. Copy self-audit.

## AI Tells (BANNED)

- Neon/outer glows, oversaturated accents, custom mouse cursors
- Inter as default, oversized H1s, fake generic names/avatars/numbers
- Div-based fake screenshots, version labels, section-numbering eyebrows
- Middle-dot abuse, em-dashes, scroll cues, decorative status dots
- "Quietly in use at", "From the field" labels, fake-precise numbers

## Dark Mode

Dual-mode by default. Tailwind `dark:` or CSS variables. No pure black/white.

## Performance & Accessibility

Animate only `transform`/`opacity`. `prefers-reduced-motion` mandatory above MOTION 3. Dark mode mandatory for consumer-facing.

## Usage

```
Use the taste skill to design a landing page for my lead magnet. Editorial and warm, think premium magazine, not SaaS template. Brand colors: cream and berry.
```

## Sub-Skills Already Installed

Some taste-skill sub-skills are already in this project:
- gpt-taste — Elite UX/UI & GSAP Motion Engineering
- brandkit — Premium brand-kit image generation
- high-end-visual-design — Soft/editorial visual design
- minimalist-ui — Minimal, clean interfaces
- industrial-brutalist-ui — Industrial brutalist aesthetics
- redesign-existing-projects — Redesign protocol
- image-to-code — Convert images to code
- full-output-enforcement — Quality gate enforcement
- imagegen-frontend-web/imagegen-frontend-mobile — Image generation

## Source

**GitHub:** Leonxlnx/taste-skill · ⭐ 63.4k  
Full repo: `npx skills add Leonxlnx/taste-skill`
