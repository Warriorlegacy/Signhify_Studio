# Findings & Decisions: Signhify Scroll Studio

## Requirements

- Self-serve AI cinematic scroll-site builder under the Signhify brand.
- Core target: Freelance/agency web designers who need scroll-locked 3D-feeling animations.
- Tech Stack constraints: React 19, TypeScript, TanStack Start/Router/Query, Tailwind CSS, Supabase backend.
- V1 Scope:
  - Single-page, scroll-driven sites.
  - Frame-based cinematic animations.
  - Prompt-to-site generation.
  - Preset template gallery.
  - Chat-based editing.
  - ZIP export + 1-click deployment.

## Research Findings

- **Draftly's Motion Technique**: Rather than using runtime WebGL or raw Three.js (which can be heavy, slow on mobile, and complex to code), Draftly uses a **frame-based scroll-linked canvas playback** model.
  - It generates an AI video (e.g. Runway or Kling).
  - It extracts frames (usually 200–400 WebP images).
  - It preloads them in batches.
  - On scroll, it maps the normalized scroll position to draw the corresponding frame on an HTML5 Canvas.
  - This guarantees 60fps on desktop and >30fps on mobile with perfect cross-device compatibility.
- **Current Signhify Base**:
  - The repo has TanStack Start, TanStack Router, and Tailwind.
  - `src/routes/ai.tsx` already has a multi-agent generation UI that outputs a text plan, stack, and lists sections.
  - `src/routes/templates.tsx` is currently a placeholder ("Coming Soon").
  - `src/components/sections/ScrollStorySection.tsx` uses Framer Motion's `useScroll` and `useTransform` to animate text and background color/glow, which is a great baseline, but not a frame-based canvas playback.

## Technical Decisions

| Decision                     | Rationale                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Frame-based scroll rendering | Avoids WebGL overhead, works across all devices, delivers consistent 60fps scrolling                                                        |
| Mock Spike first             | Validate the canvas interpolation, batch loading, and memory footprints before integrating the full Supabase and Runway video jobs pipeline |
| Separate `/studio` route     | Keep the self-serve builder separate from the marketing site (`/` and services)                                                             |

## Issues Encountered

| Issue                 | Resolution                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Omit ArtifactMetadata | Project-level files in the workspace directory (e.g. `D:\Signhify`) should not have `ArtifactMetadata` since it causes permission errors in the CLI |

## Resources

- Draftly reverse engineering guide: [Draftly Reverse Engineering Complete PRD, TRD & Implementation Guide.md](file:///D:/Signhify/Draftly%20Reverse%20Engineering%20%20Complete%20PRD,%20TRD%20&%20Implementation%20Guide.md)
- Comparison & Gap Analysis: [Signhify vs Draftly Reverse-Engineered PRD, TRD, Gap Analysis, Roadmap, and Cinematic UI Prompt.md](file:///D:/Signhify/Signhify%20vs%20Draftly%20%20Reverse-Engineered%20PRD,%20TRD,%20Gap%20Analysis,%20Roadmap,%20and%20Cinematic%20UI%20Prompt.md)
- Target PRD/TRD: [signhify-scroll-studio-prd-trd.md](file:///D:/Signhify/signhify-scroll-studio-prd-trd.md)
