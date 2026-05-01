# Phase 2: Static Sections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-01
**Phase:** 2-Static-Sections
**Areas discussed:** Content readiness, Hero visual layout, About placement, Timeline pattern, Hero colors, Accent color, Nav links, Footer, Timeline fields, Timeline mobile collapse

---

## Content Readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholder text | Build with Lorem-style content; swap real copy before launch | ✓ |
| Real content ready | Use final copy from Asaad now | |

**User's choice:** Placeholder text throughout
**Notes:** Unblocks Phase 2 execution without waiting for final copy.

---

## Hero Visual Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Full-viewport centered text | 100vh, text centered, no photo | ✓ |
| Text + headshot | Split layout with profile photo | |
| Gradient background | Dark-to-darker behind centered text | ✓ |

**User's choice:** Full-viewport, centered text, gradient background, no headshot photo
**Notes:** All in one freeform response — confirmed via reflection.

---

## About Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Folded into Hero | About narrative is part of the Hero section, no separate anchor | ✓ |
| Standalone section | Separate "About" section after Hero with own nav link | |

**User's choice:** Folded into the Hero section
**Notes:** Nav will still have an "About" link that scrolls to `#hero`.

---

## Timeline Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Center-stem alternating | Vertical center line, entries alternate left/right | ✓ |
| Left-aligned vertical list | Single column, left side line | |
| Card grid | Cards in a grid layout | |

**User's choice:** Center-stem with alternating entries (desktop)

---

## Hero Colors

| Option | Description | Selected |
|--------|-------------|----------|
| Dark-to-darker | Deep navy/charcoal fading darker, white text | ✓ |
| Light neutral | Off-white/gray base with soft tint | |
| Bold gradient | Two distinct accent colors | |

**User's choice:** Dark-to-darker (Recommended)
**Notes:** Sets the palette anchor — premium, confident feel appropriate for AI/Data professional.

---

## Accent Color

| Option | Description | Selected |
|--------|-------------|----------|
| Gold / amber | Warm gold against dark backgrounds — aspirational | ✓ |
| Electric blue / indigo | Tech-forward, trustworthy | |
| Teal / cyan | Modern, distinctive | |

**User's choice:** Gold / amber (Recommended)

---

## Nav Links

| Option | Description | Selected |
|--------|-------------|----------|
| Only current sections | Nav shows Journey only; Values + Contact added later | |
| Full nav structure now | All 4 links built now; Values + Contact dead until those phases | ✓ |

**User's choice:** Full nav structure now — About | Journey | Values | Contact

---

## Footer Content

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal — name + copyright | © 2026 Asaad — clean, uncluttered | ✓ |
| Name + social links | Copyright + LinkedIn (and optionally other social) | |

**User's choice:** Minimal — name + copyright (Recommended)

---

## Timeline Entry Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Four fields only | Role + Org + Period + Impact statement | ✓ |
| Add category tag | Plus a tag like Leadership / Technical / Speaking | |

**User's choice:** Just the four fields (Recommended)

---

## Timeline Mobile Collapse

| Option | Description | Selected |
|--------|-------------|----------|
| Left-aligned single column | All entries stack left with left-side vertical line | ✓ |
| Cards stacked full-width | Full-width cards, loses timeline feel | |

**User's choice:** Left-aligned single column (Recommended)

---

## Claude's Discretion

- Specific gradient hex values (within dark navy/charcoal direction)
- Exact responsive breakpoint for timeline center-stem → single-column collapse
- Timeline dot/marker visual style (circle, diamond, etc.)
- Nav background treatment on scroll (blur/shadow for legibility)
- Spacing scale and additional CSS tokens

## Deferred Ideas

- Social links in footer — considered, deferred to Phase 4 polish
- Category tags on timeline entries — considered, deferred; revisit after real content loads
- Real content copy (tagline, about, timeline entries) — provided by Asaad before Phase 4
