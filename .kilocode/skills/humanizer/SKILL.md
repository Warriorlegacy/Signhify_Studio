---
name: humanizer
description: "Detects and removes 33 patterns of AI-generated writing in multiple self-auditing passes. Strips every AI writing tell from your copy, then rewrites it in your actual voice. Warm, direct, skips corporate jargon. Makes your posts sound like you, not a LinkedIn bot."
---

# humanizer — AI Writing Humanizer

Strips every AI writing tell from copy in multiple self-auditing passes, then rewrites it in the user's actual voice.

## What It Detects & Fixes

33 patterns of AI-generated writing including:
- Overused transitional phrases ("Moreover", "Furthermore", "In conclusion")
- Generic modifiers ("delve", "navigate", "landscape", "dynamic")
- Balanced sentence structures (AI's signature rhythm)
- Excessive hedging ("it's worth noting", "importantly")
- Corporate jargon and buzzwords
- Perfect paragraph symmetry
- Missing contractions (don't → do not overuse)
- Generic concluding statements
- Unnecessary formality

## Process

1. **Scan** — Identify all 33 AI tell patterns in the input
2. **Flag** — Mark each occurrence with the pattern type
3. **Rewrite** — Strip each tell and rewrite in natural voice
4. **Audit** — Run the detector on the output (self-audit pass)
5. **Deliver** — Output the humanized version with zero AI tells remaining

## Usage

```
Run the humanizer on this caption I drafted with AI help. My voice is warm, direct, and skips corporate jargon. Make it sound like me, not a bot.
[paste caption]
```

## Source

**GitHub:** blader/humanizer · ⭐ 29.2k · MIT
