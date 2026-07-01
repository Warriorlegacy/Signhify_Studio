# Task Plan: Signhify Scroll Studio Implementation

## Goal

Implement the Signhify Scroll Studio by establishing the frame-based scroll-linked canvas playback spike (Phase 0) and setting up the foundations for prompt-to-site generation, chat-based editing, and code exports.

## Current Phase

Phase 6: UI Expansion & Template Gallery

## Phases

### Phase 1: Requirements & Discovery

- [x] Read reverse engineering and comparison documents (`signhify-scroll-studio-prd-trd.md`, `Signhify vs Draftly...`)
- [x] Analyze current codebase layout, existing routes, and assets
- [x] Create project planning files (`task_plan.md`, `findings.md`, `progress.md`)
- [x] Define precise specs for Phase 0 (Technical Spike)
- **Status:** complete

### Phase 2: Spike Preparation (Canvas Renderer & Mock Pipeline)

- [x] Implement a prototype Canvas-based scroll-interpolated frame player component in a new route (`/studio/spike`)
- [x] Provide a set of mock frames (or a script to extract/optimize them from a test MP4) to run in the local environment
- [x] Create hooks for tracking scroll percentage (`useScrollProgress`) and drawing frames to canvas
- **Status:** complete

### Phase 3: DB and Edge Function Foundation

- [x] Define the schema additions (PostgreSQL / Supabase migrations) for `video_jobs`, `frames`, and `projects`
- [x] Prepare standard API endpoints or TanStack Server Functions for job management
- [x] Establish a robust database client wrapper with a graceful in-memory fallback for local development
- **Status:** complete

### Phase 4: Chat-Based Code Editor skeleton

- [x] Mock the LLM orchestration logic to accept edits and regenerate or patch mockup styles
- [x] Integrate simple chat interface in the studio builder route
- [x] Bind UI data hook-up to call server functions for video generation, polling, and frame buffering
- **Status:** complete

### Phase 5: Testing & Verification

- [x] Verify 60 fps rendering on desktop, frame loading progress indicator, and responsiveness
- [x] Add basic Playwright test for visual stability
- **Status:** complete

### Phase 6: UI Expansion & Template Gallery

- [x] Expand TemplateGallery with Draftly-style preset categories (SaaS, E-commerce, Portfolio, AI, Fintech, Logistics, Newsletter)
- [x] Add preset template data with real content, tags, and preview URLs
- [x] Build TemplatePreview component for live scroll preview of presets
- [x] Implement Pipeline section (Pick → Describe → Generate → Animate → Build → Deploy)
- [x] Add multi-video continuation support in SettingsPanel
- [x] Improve export pipeline with README and deployment instructions
- **Status:** in-progress

## Key Questions

1. Do we want to start directly with Phase 0 (technical spike for frame-based scroll-locked playback) or do we want to map out the Supabase schemas first?
2. What mock video/frame sequence should we use for testing the scroll renderer? Can we use one of the existing assets in `Signhify_assets` or should we create a generator?
3. Should the builder interface live under a new path like `/studio` or `/builder`?

## Decisions Made

| Decision                | Rationale                                                           |
| ----------------------- | ------------------------------------------------------------------- |
| Create file-based plans | Track multi-stage implementation details for Signhify Scroll Studio |

## Errors Encountered

| Error    | Attempt | Resolution |
| -------- | ------- | ---------- |
| None yet | -       | -          |

## Notes

- We must maintain the premium design system (deep navy, teal glow, warm ember) in all new pages.
- Respect `prefers-reduced-motion` in the canvas rendering engine by fading between keyframes rather than rendering a continuous scroll animation.
