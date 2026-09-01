# UI Stack & Prompt Engineering Architecture

> Developer documentation for the Signhify UI Stack & Prompt Systems.
> Reference: [UI_STACK_PROMPTS_PLAYBOOK.md](file:///d:/Signhify/Signhify_assets/prompts/UI_STACK_PROMPTS_PLAYBOOK.md)

## Core Stack Overview

Signhify leverages a battle-tested, high-performance 4-tier frontend foundation:

1. **Components (`shadcn/ui` + `@radix-ui/*`):**
   - Accessible primitives with custom dark-mode token variables.
   - Standardized in `src/components/ui/`.
2. **Motion (`framer-motion`):**
   - Micro-interactions, spring physics, layout animations, and entry reveals.
   - Three-step progression: `Static -> Shift -> Transition`.
3. **Iconography (`lucide-react`):**
   - 16px actions, 20px navigation, nested circular icon badges.
4. **Data & Synchronization (`@tanstack/react-query`):**
   - Stale-while-revalidate server state management with optimistic mutations.

## Specialized UI Extensions

### 1. Interactive Tours (`driver.js`)
- Integrated via `src/hooks/useTour.ts` and `src/components/ui/OnboardingTour.tsx`.
- Provides guided step walkthroughs with dark glassmorphism popovers.

### 2. Kinetic Visuals (`reactbits`)
- Integrated in `src/components/ui/ReactBits.tsx`.
- Includes `DitherWaves`, `AuroraGlow`, `SpotlightCard`, `SilkTouchCard`, and `TextDither`.

### 3. AI Copilot & Chat (`assistant-ui` pattern)
- Integrated in `src/components/ai/AssistantChat.tsx`.
- Includes multi-model selection, color theme switcher, prompt chip starters, and streamed markdown formatting.

### 4. High-Converting Landing Blocks (`tailark` pattern)
- Asymmetrical bento grid layouts, nested double-bezel cards, and island CTA buttons.
