# Phase 2: Static Sections - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Build and deploy the visible static content sections of the site: Hero (including the About narrative), Journey/Timeline, sticky navigation header, and footer. All sections must render on the live URL and be verified responsive at 375px. No interactive JS behavior in this phase — that comes in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Content Strategy
- **D-01:** Use placeholder text throughout Phase 2. All copy (hero tagline, about narrative, timeline entries) will be swapped for real content before launch — this unblocks Phase 2 execution without waiting for final copy.

### Hero Section
- **D-02:** Full-viewport (100vh) section with centered text. No headshot or profile photo.
- **D-03:** Dark-to-darker gradient background — deep navy or charcoal base fading to a darker tone. White text on dark.
- **D-04:** Hero contains both the name/tagline and the About narrative (folded in, not a separate section). No separate "About" section or nav anchor — all within the hero.

### Color Palette (global tokens to add in Phase 2)
- **D-05:** Base: dark charcoal/navy gradient. Text: white (`#ffffff`) or near-white. Accent: gold/amber for interactive elements, timeline dots, hover states, and decorative details.
- **D-06:** Color tokens belong in `src/styles/global.css` `:root` block, following the same pattern as the existing typography tokens (`--font-body`, `--font-display`).

### Navigation (Sticky Header)
- **D-07:** Build the full nav structure now: logo/name on the left, links on the right: About | Journey | Values | Contact.
- **D-08:** "About" links to the hero section (`#hero`). "Values" and "Contact" are dead links (`href="#"` or omitted) until Phases 3 and 4 ship them.
- **D-09:** Sticky behavior via `position: sticky; top: 0` — no client-side JS required.
- **D-10:** Smooth scrolling for anchor links via `html { scroll-behavior: smooth; }` in global.css.

### Journey / Timeline
- **D-11:** Desktop: center-stem layout with alternating left/right entries. A vertical line runs down the center; entries alternate sides with a dot/marker on the stem.
- **D-12:** Mobile (375px): collapses to a left-aligned single column with a vertical line on the left edge. All entries left-aligned — no alternating.
- **D-13:** Each entry displays exactly four fields: Role, Organization, Time period, 1-2 sentence impact statement. No category tags.
- **D-14:** Placeholder entries: 5-7 entries with Lorem-style content for role/org/dates/impact.

### Footer
- **D-15:** Minimal — name and copyright only. Example: `© 2026 Asaad`. No social links, no email.

### Claude's Discretion
- Specific gradient stops (e.g., exact hex values for navy/charcoal) — stay within the dark-to-darker direction.
- Exact breakpoint at which the timeline switches from center-stem to single-column (somewhere between 768px and 1024px is reasonable).
- Timeline dot/marker visual style (circle, line, diamond) — any clean minimal style.
- Nav background treatment on scroll (e.g., subtle blur/shadow when scrolled past hero) — use if it improves legibility.
- Spacing scale and any additional CSS tokens needed beyond what's listed.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Configuration
- `CLAUDE.md` — Binding project constraints: tech stack, font API setup, no `base` path, mobile-first requirement, no client-side hydration on static content
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: HERO-01, HERO-02, JOUR-01, JOUR-02, JOUR-03, SITE-04, SITE-05
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 criteria) and phase boundary

### Existing Code
- `src/layouts/Layout.astro` — Shell to extend: add `<nav>` and `<footer>`, wire `<slot>` for sections
- `src/styles/global.css` — Token file to extend: add color tokens (`:root`), `scroll-behavior: smooth`
- `astro.config.mjs` — Fonts already configured (`--font-inter`, `--font-playfair`); do not modify

### Phase 1 Patterns
- `.planning/phases/01-foundation-and-deployment-pipeline/01-PATTERNS.md` — Established patterns: font CSS variable bridging, static-output-only rule, no-base-path rule, pnpm workflow

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/Layout.astro` — Already imports global.css and Font API components; extend by adding `<nav>` before `<slot>` and `<footer>` after. Do not create a separate layout.
- `src/styles/global.css` — Token shell already has `--font-body` / `--font-display`. Add color tokens (`--color-bg`, `--color-text`, `--color-accent`, etc.) and `scroll-behavior: smooth` here.

### Established Patterns
- **No client-side JS on static content:** Do not add `client:*` directives to Hero, Nav, Timeline, or Footer components — these are purely static in Phase 2.
- **Scoped styles in `.astro` components:** Use `<style>` blocks inside each component; global tokens flow in via CSS custom properties.
- **Font variable bridging:** Use `var(--font-body)` and `var(--font-display)` in component styles, not the raw `--font-inter` / `--font-playfair` variables.
- **No base path:** All `href` values are root-relative (`/`, `#hero`, `#journey`). Never prefix with `/Asaad_Webpage`.

### Integration Points
- `src/pages/index.astro` will be rewritten: import and compose `<Hero />`, `<Journey />` inside the existing `<Layout>`.
- `src/layouts/Layout.astro` receives `<Nav />` (outside `<slot>`) and `<Footer />` (outside `<slot>`).
- New component directory: `src/components/` — one file per section component.

</code_context>

<specifics>
## Specific Ideas

- The "dark-to-darker" gradient on the hero should feel premium and confident — appropriate for a Data & AI professional and inspirational speaker. Deep navy (`#0d1b2a` range) or dark charcoal (`#1a1a2e` range) are good starting points.
- Gold/amber accent (e.g. `#f0a500` or `#d4a017` range) for timeline dots, nav hover states, and any decorative underlines.
- The nav "About" link scrolls to `#hero` since About is part of the Hero section. The link label is "About" (not "Hero").

</specifics>

<deferred>
## Deferred Ideas

- **Social links in footer** — User considered this but chose minimal copyright-only. Can be added in Phase 4 polish if desired.
- **Category tags on timeline entries** — Considered and deferred; may add if the timeline feels sparse after real content is loaded.
- **Real content copy** — Hero tagline, about narrative, and timeline entries will be provided by Asaad before Phase 4 (or earlier). Placeholders unblock execution now.

</deferred>

---

*Phase: 2-Static-Sections*
*Context gathered: 2026-05-01*
