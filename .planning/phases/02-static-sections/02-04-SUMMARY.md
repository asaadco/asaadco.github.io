---
phase: 02-static-sections
plan: "04"
subsystem: journey-timeline-component
tags: [journey, timeline, css-grid, responsive, astro-component, static]
key-files:
  created:
    - src/components/Journey.astro
  modified: []
metrics:
  tasks_completed: 1
  tasks_total: 1
  commits: 1
---

# Plan 02-04 Summary: Journey.astro

## What Was Built

Created `src/components/Journey.astro` — the career timeline section satisfying JOUR-01, JOUR-02, and JOUR-03.

**Key implementation details:**
- Section `id="journey"` — Nav "Journey" anchor target
- `<h2>Journey</h2>` with 40px gold accent underline (`--color-accent`)
- `<ol class="timeline">` — semantic ordered list (chronological order matters)
- 6 placeholder entries defined as TypeScript array in frontmatter, rendered via `.map()`
- Each `<li class="timeline-entry">` has 4 fields: `.entry-role` (bold), `.entry-org` (accent color), `.entry-date` (muted), `.entry-impact` (body text)

**Responsive layout:**
- **Desktop (>=768px):** `grid-template-columns: 1fr 2px 1fr` — center-stem with entries alternating left/right via `:nth-child(even)`. `::before` pseudo provides stem line at `left: 50%`.
- **Mobile (<768px):** `grid-template-columns: 16px 1fr` — all entries in column 2, left-edge stem at `left: 7px`
- **Open Question #2 resolved:** Chose `::before` stem on `.timeline` container; `<li>` are the only children of `<ol>`, so `:nth-child(odd|even)` counts them correctly (Pitfall 4 avoided)

**Visual details:**
- Timeline dot: 12px circle, `background-color: var(--color-accent)`, `border: 2px solid var(--color-bg)`
- Card: `--color-surface` background, `border-radius: 8px`, `max-width: 440px` on desktop
- `max-width: 1100px` on `.inner` wrapper — section background spans full viewport

## Commits

| Commit | Description |
|--------|-------------|
| e554abe | feat(02-04): create Journey.astro career timeline component |

## Deviations

None. Implementation follows UI-SPEC Journey component contract exactly. Responsive breakpoint at 768px as specified in UI-SPEC.

## Self-Check: PASSED

- [x] 6 entries with role/org/date/impact fields (D-13, D-14)
- [x] Desktop CSS Grid `1fr 2px 1fr` center-stem with alternating `:nth-child(even)` sides
- [x] Mobile CSS Grid `16px 1fr` single-column with left-edge stem
- [x] Gold dots: `width: 12px; height: 12px; background-color: var(--color-accent); border: 2px solid var(--color-bg)`
- [x] Card `max-width: 440px` desktop, full width mobile
- [x] Section `.inner` has `max-width: 1100px` — section itself is full-viewport width
- [x] `pnpm build` exits 0
- [x] No hydration directives, all tokens via `var(--color-*)` / `var(--font-body)` / `var(--font-display)`
