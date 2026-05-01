# Phase 2: Static Sections - Research

**Researched:** 2026-05-01
**Domain:** Astro 6 component composition, vanilla CSS layout (center-stem timeline, sticky nav), mobile-first responsive design
**Confidence:** HIGH

---

## Summary

Phase 2 builds on a verified Astro 6 scaffold (Phase 1 complete, `pnpm build` green, live at
`https://asaad101.sa`). All locking decisions are documented in `02-CONTEXT.md` (D-01 through
D-15) and the visual contract is fully specified in `02-UI-SPEC.md` (approved 2026-05-01). No
architecture decisions remain open — research scope is narrowly focused on implementation
technique.

The primary technical challenge is the center-stem CSS timeline (D-11/D-12). The proven pattern
uses CSS Grid with three columns (`1fr 2px 1fr`) where the middle column is the stem. Items are
placed into columns 1 and 3 alternately using `nth-child` selectors, and the stem column carries
a dot pseudo-element on each entry. At 768px the grid collapses to two columns (`16px 1fr`) with
all entries in column 2 — a single-column left-aligned layout. No JavaScript is required.

Everything else in this phase (Astro component composition, CSS custom properties, sticky nav,
smooth scrolling, clamp() typography) is well-understood Astro 6 canonical behavior. The UI-SPEC
tokens and component specs are fully defined and need only faithful implementation.

**Primary recommendation:** Create four components (`Nav.astro`, `Hero.astro`, `Journey.astro`,
`Footer.astro`) under `src/components/`, extend `Layout.astro` to host Nav and Footer outside
the slot, extend `global.css` with color and spacing tokens, and rewrite `index.astro` to
compose Hero and Journey inside the existing Layout. Use CSS Grid for the timeline, CSS `position:
sticky` for the nav, and no client-side JS in this phase.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use placeholder text throughout Phase 2. All copy (hero tagline, about narrative,
  timeline entries) will be swapped for real content before launch — this unblocks Phase 2
  execution without waiting for final copy.
- **D-02:** Full-viewport (100vh) section with centered text. No headshot or profile photo.
- **D-03:** Dark-to-darker gradient background — deep navy or charcoal base fading to a darker
  tone. White text on dark.
- **D-04:** Hero contains both the name/tagline and the About narrative (folded in, not a
  separate section). No separate "About" section or nav anchor — all within the hero.
- **D-05:** Base: dark charcoal/navy gradient. Text: white or near-white. Accent: gold/amber for
  interactive elements, timeline dots, hover states, and decorative details.
- **D-06:** Color tokens belong in `src/styles/global.css` `:root` block, following the same
  pattern as the existing typography tokens (`--font-body`, `--font-display`).
- **D-07:** Build the full nav structure now: logo/name on the left, links on the right:
  About | Journey | Values | Contact.
- **D-08:** "About" links to the hero section (`#hero`). "Values" and "Contact" are dead links
  (`href="#"` or omitted) until Phases 3 and 4 ship them.
- **D-09:** Sticky behavior via `position: sticky; top: 0` — no client-side JS required.
- **D-10:** Smooth scrolling for anchor links via `html { scroll-behavior: smooth; }` in
  global.css.
- **D-11:** Desktop: center-stem layout with alternating left/right entries. A vertical line runs
  down the center; entries alternate sides with a dot/marker on the stem.
- **D-12:** Mobile (375px): collapses to a left-aligned single column with a vertical line on
  the left edge. All entries left-aligned — no alternating.
- **D-13:** Each entry displays exactly four fields: Role, Organization, Time period, 1-2
  sentence impact statement. No category tags.
- **D-14:** Placeholder entries: 5-7 entries with Lorem-style content.
- **D-15:** Minimal footer — name and copyright only. `© 2026 Asaad`. No social links, no email.

### Claude's Discretion
- Specific gradient stops for navy/charcoal (within dark-to-darker direction)
- Exact breakpoint at which the timeline switches from center-stem to single-column (768px–1024px)
- Timeline dot/marker visual style (circle, line, diamond) — any clean minimal style
- Nav background treatment on scroll (subtle blur/shadow if it improves legibility)
- Spacing scale and any additional CSS tokens needed beyond what is listed

### Deferred Ideas (OUT OF SCOPE)
- Social links in footer — chose minimal copyright-only; can be added in Phase 4
- Category tags on timeline entries — may add if timeline feels sparse after real content
- Real content copy — placeholder unblocks Phase 2; real copy provided before Phase 4
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Visitor sees a full-viewport hero section with Asaad's name, professional title/tagline, and a clear sense of his identity | Hero component: `min-height: 100vh`, flex centered, h1 + tagline, `id="hero"` anchor |
| HERO-02 | Visitor can read a concise "About" narrative that conveys who Asaad is as a person and professional | About paragraphs folded into Hero component below the tagline (D-04) |
| JOUR-01 | Visitor can view a visual timeline of Asaad's career milestones in chronological order | Journey component: `<ol>` ordered list, 5-7 entries, center-stem desktop / single-column mobile |
| JOUR-02 | Each timeline entry shows role, organization, and time period | Entry structure: role (bold), org (accent color), date (muted), impact statement |
| JOUR-03 | Timeline is readable and well-laid-out on both mobile and desktop | CSS Grid timeline with min-width: 768px breakpoint; verified at 375px and 1024px |
| SITE-04 | Single-page scroll with smooth scrolling between sections | `html { scroll-behavior: smooth; scroll-padding-top: 60px; }` in global.css |
| SITE-05 | Sticky/fixed navigation header with anchor links to each section | `position: sticky; top: 0; z-index: 100` on `<nav>`, no JS required |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

Binding directives — research does not recommend approaches that contradict these.

| Directive | Detail |
|-----------|--------|
| Framework | Astro 6 `^6.2.1`, `output: 'static'` — no adapters |
| Package manager | pnpm only |
| Styling | Vanilla CSS + Astro scoped `<style>` blocks — no Tailwind, no CSS-in-JS |
| Components | Vanilla Astro — no React, Vue, Svelte |
| Fonts | `var(--font-body)` / `var(--font-display)` aliases — do NOT reference `--font-inter` / `--font-playfair` directly in component styles |
| No `client:*` directives | Phase 2 components are purely static — no `client:load`, `client:idle`, `client:visible` |
| No base path | All `href` values root-relative: `/`, `#hero`, `#journey` — never `/Asaad_Webpage/...` |
| `astro.config.mjs` | Must NOT be modified — fonts already configured correctly |
| Mobile-first | Write CSS at 375px first, add min-width media queries for tablet and desktop |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| HTML structure (nav, hero, journey, footer) | Build (Astro components) | — | Compiled to static HTML at build time; no runtime rendering |
| Design tokens (colors, spacing) | Build (global.css `:root`) | Browser (inherited by all components) | CSS custom properties cascade globally; declared once, consumed everywhere |
| Center-stem timeline layout | Browser (CSS Grid) | — | Pure CSS layout; no JS; responsive via media query breakpoint |
| Sticky nav positioning | Browser (CSS `position: sticky`) | — | No scroll listener needed; browser handles paint |
| Font loading | Build (Astro Font API) | CDN (GitHub Pages) | `fontProviders.fontsource()` bundles fonts into `dist/` at build time |
| Smooth scrolling | Browser (CSS `scroll-behavior`) | — | Native CSS; declared on `html` element in global.css |
| Anchor targeting with offset | Browser (CSS `scroll-padding-top`) | — | Compensates for 60px sticky nav height when jumping to `#id` anchors |
| Deployment | GitHub Actions | GitHub Pages CDN | Existing pipeline unchanged — `pnpm build` + `withastro/action@v6` |

---

## Standard Stack

### Core (already installed — no additions needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.2.1 | Framework — compiles `.astro` to static HTML/CSS/JS | Installed; verified with `pnpm exec astro --version` |

[VERIFIED: `pnpm exec astro --version` returns `astro v6.2.1` in this session]

**No new npm packages are required for Phase 2.** All capabilities (CSS layout, sticky nav,
smooth scrolling, responsive design) are native CSS and browser features. The Astro Font API
and fontProviders.fontsource() are already configured. No component library, no icon library.

### Supporting (optional — install only if Wave 0 adds type checking to build script)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/check | 0.9.9 | Runs `astro check` for TypeScript type validation in `.astro` files | Add to `devDependencies` if the build script is updated to `astro check && astro build`; currently not installed |

[VERIFIED: `npm view @astrojs/check version` returns `0.9.9` — latest as of 2026-05-01]
[VERIFIED: `@astrojs/check` is NOT currently in `package.json`; `node_modules/@astrojs/check` does not exist]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid (timeline) | absolute positioning + `left: 50%` | Grid is more robust — handles variable card heights automatically; positioning requires fixed heights or additional JS |
| CSS `position: sticky` (nav) | IntersectionObserver JS | CSS-only satisfies D-09 (locked); JS unnecessary and banned in Phase 2 |
| `scroll-behavior: smooth` | JS smooth-scroll polyfill | CSS-only satisfies D-10 (locked); 97%+ browser support |

---

## Architecture Patterns

### System Architecture Diagram

```
src/pages/index.astro
  └── <Layout title="Asaad">        ← Layout.astro (extended)
        ├── <head>                  ← Font API, global.css (unchanged)
        ├── <Nav />                 ← src/components/Nav.astro (new)
        ├── <slot>                  ← Page content injected here
        │     ├── <Hero />          ← src/components/Hero.astro (new)
        │     └── <Journey />       ← src/components/Journey.astro (new)
        └── <Footer />              ← src/components/Footer.astro (new)

CSS token flow:
  src/styles/global.css (:root tokens)
    → inherited by all HTML elements
    → referenced via var(--color-bg), var(--space-md), etc.
    → in scoped <style> blocks inside each .astro component
```

### Recommended Project Structure

```
src/
├── components/         # New directory — one file per section
│   ├── Nav.astro       # Sticky header with anchor links
│   ├── Hero.astro      # Full-viewport hero + about narrative
│   ├── Journey.astro   # CSS Grid center-stem timeline
│   └── Footer.astro    # Copyright-only footer
├── layouts/
│   └── Layout.astro    # Extended: add <Nav />, <Footer /> around <slot />
├── pages/
│   └── index.astro     # Rewritten: compose <Hero />, <Journey /> inside <Layout>
└── styles/
    └── global.css      # Extended: add color + spacing tokens, scroll-behavior
```

### Pattern 1: Extending Layout.astro

**What:** Add Nav and Footer to the layout shell so they appear on every page without index.astro
knowing about them.
**When to use:** Global elements (nav, footer) that always appear — never put in page files.

```astro
---
// src/layouts/Layout.astro (Phase 2 extension)
// Source: https://docs.astro.build/en/basics/layouts.mdx
import { Font } from "astro:assets";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title?: string;
}
const { title = "Asaad" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <Font cssVariable="--font-inter" />
    <Font cssVariable="--font-playfair" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Key constraints:**
- `<Nav />` and `<Footer />` are imported from `../components/` with full `.astro` extension
- `<main>` wraps `<slot />` to satisfy the `<main>` landmark requirement (Accessibility Contract)
- `<Font />` and `global.css` import remain UNCHANGED from Phase 1

[CITED: https://docs.astro.build/en/basics/layouts.mdx]

---

### Pattern 2: Astro Component with Typed Props and Scoped Styles

**What:** Standard pattern for Phase 2 section components — TypeScript Props interface, Astro.props
destructuring, and scoped `<style>` that consumes global CSS custom properties.
**When to use:** All four new components (Nav, Hero, Journey, Footer).

```astro
---
// src/components/Hero.astro
// Source: https://docs.astro.build/en/basics/astro-components.mdx
interface Props {
  // Optionally typed; Phase 2 components have no required props (all content is hardcoded)
}
---
<section id="hero">
  <h1>Asaad</h1>
  <!-- ... -->
</section>

<style>
  /* Scoped styles — Astro adds data-astro-cid-* attribute automatically */
  /* Global CSS custom properties (--color-bg, --space-3xl, --font-display) are
     accessible here because they are inherited from :root via the cascade.
     No special directive is needed — var() works in scoped styles as-is. */
  section {
    min-height: 100vh;
    background: linear-gradient(160deg, var(--color-bg) 0%, var(--color-bg-deep) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-3xl) var(--space-md);
    font-family: var(--font-body);
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.1;
  }
</style>
```

**Critical insight:** CSS custom properties defined in `global.css` `:root` are inherited by all
elements through the normal CSS cascade. Scoped component styles can reference them with `var()`
without any special Astro directive. The scoping mechanism (data-astro-cid-* attribute) does NOT
block inherited custom property values.

[CITED: https://docs.astro.build/en/guides/styling.mdx — "The Astro `<style>` tag can reference any CSS variables available on the page"]
[CITED: https://docs.astro.build/en/reference/directives-reference.mdx — is:global directive documentation]

---

### Pattern 3: Global CSS Token Extension (global.css)

**What:** Add Phase 2 color and spacing tokens to the `:root` block, and add scroll behavior
rules to the `html` selector.
**When to use:** Phase 2 Wave 0 — first task, before any component is written.

```css
/* src/styles/global.css — Phase 2 additions */
:root {
  /* === Existing Phase 1 tokens (DO NOT REMOVE) === */
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-playfair), Georgia, serif;

  /* === Phase 2 additions: Colors === */
  --color-bg: #0d1b2a;
  --color-bg-deep: #070d14;
  --color-surface: #1a2a3a;
  --color-text: #f5f5f5;
  --color-text-muted: #9baab8;
  --color-accent: #d4a017;
  --color-accent-hover: #e8b520;

  /* === Phase 2 additions: Spacing (8-point scale) === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}

/* === Phase 2 additions: html element === */
html {
  /* existing: font-family, font-size, line-height */
  scroll-behavior: smooth;
  scroll-padding-top: 60px; /* compensates for 60px sticky nav height on anchor jump */
}
```

**Source:** `02-UI-SPEC.md` — CSS Token Additions section (approved 2026-05-01)

---

### Pattern 4: CSS Grid Center-Stem Timeline

**What:** Three-column CSS Grid where column 2 is the vertical stem. Entries are placed in
column 1 (left) or column 3 (right) using `nth-child`. The stem carries dot pseudo-elements.
At <768px the grid collapses to two-column left-aligned.

**Desktop (min-width: 768px):**

```css
/* src/components/Journey.astro <style> */
.timeline {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  column-gap: var(--space-xl); /* 32px gap between card edge and stem */
  max-width: 1100px;
  margin: 0 auto;
}

/* Vertical stem — the middle column itself is the line */
.timeline-stem {
  grid-column: 2;
  background-color: var(--color-surface);
  position: relative;
}

/* Dot on stem for each entry */
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-accent);
  border: 2px solid var(--color-bg);
  position: absolute;
  left: 50%;
  top: var(--space-lg); /* aligns with top of card */
  transform: translateX(-50%);
}

/* Default: odd entries on left (column 1) */
.timeline-entry {
  grid-column: 1;
  justify-self: end; /* push card to the right edge (near stem) */
}

/* Even entries on right (column 3) */
.timeline-entry:nth-child(even) {
  grid-column: 3;
  justify-self: start; /* push card to the left edge (near stem) */
}
```

**Note on HTML structure:** Because the stem column must span all rows, one implementation
approach uses a separate stem element in the HTML that spans the full height. An alternative
uses `::before` on the timeline container. The CSS Grid approach using a dedicated stem column
element (as sourced from dev.to/phuocng) is more robust for variable-height entries because the
grid row height automatically matches the tallest item in each row.

**Alternative — single `::before` vertical line on container:**

```css
/* Simpler but requires careful z-index management */
.timeline {
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-surface);
  transform: translateX(-50%);
}
```

**Recommended:** Use the CSS Grid column approach (first example) — it does not require absolute
positioning and handles variable card heights without overlap. The `::before` approach requires
the container to be `position: relative` and may have z-index interaction issues with the dot
markers.

**Mobile collapse (< 768px):**

```css
@media (max-width: 767px) {
  .timeline {
    grid-template-columns: 16px 1fr; /* left-edge stem, full-width content */
    column-gap: var(--space-md);
  }

  /* All entries go to column 2, regardless of nth-child */
  .timeline-entry,
  .timeline-entry:nth-child(even) {
    grid-column: 2;
    justify-self: stretch;
  }

  /* Stem column moves to left edge */
  .timeline-stem {
    grid-column: 1;
  }
}
```

[VERIFIED via: https://www.w3schools.com/howto/howto_css_timeline.asp — center-stem pattern confirmed]
[CITED: https://dev.to/phuocng/create-a-vertical-timeline-12ln — CSS Grid approach verified]

---

### Pattern 5: Sticky Nav with Backdrop Filter

**What:** `position: sticky; top: 0` keeps the nav fixed at the top as the user scrolls.
`backdrop-filter: blur(8px)` gives a glass effect when scrolling over content.

```css
/* src/components/Nav.astro <style> */
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  background-color: color-mix(in srgb, var(--color-surface) 95%, transparent);
  /* Fallback for browsers that don't support backdrop-filter: */
  /* background-color above provides opaque fallback */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-xl);
}

/* Nav links */
nav a {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--space-sm) var(--space-md);
  transition: color 150ms ease;
  position: relative;
}

/* Hover underline accent */
nav a:hover {
  color: var(--color-accent-hover);
}

nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--space-md);
  right: var(--space-md);
  height: 2px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transition: transform 150ms ease;
}

nav a:hover::after {
  transform: scaleX(1);
}

/* Dead links (Values, Contact) */
nav a[aria-disabled="true"] {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
```

**Browser support notes:**
- `position: sticky` — Baseline since 2017; 99%+ browser support [ASSUMED — universal support]
- `backdrop-filter: blur()` — Baseline 2024 (since September 2024); 97%+ browser support.
  Include `-webkit-backdrop-filter` prefix for Safari compatibility.
- Known issue: `backdrop-filter` may interact unexpectedly if a parent element has `will-change`,
  `opacity`, or `filter` applied. The nav has no such parent in this layout.

[CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter — Baseline 2024 confirmed]

---

### Pattern 6: Mobile-First Responsive CSS

**What:** Write base styles for 375px viewport (no media query). Use `min-width` media queries
to layer on tablet and desktop styles.

```css
/* Base styles (375px — mobile first) */
.container {
  padding: var(--space-2xl) var(--space-md); /* 48px top/bottom, 16px left/right */
  max-width: 100%;
}

/* Tablet and above (768px) */
@media (min-width: 768px) {
  .container {
    padding: var(--space-3xl) var(--space-xl); /* 64px top/bottom, 32px sides */
  }
}

/* Desktop (1024px) — max-width constraint kicks in */
@media (min-width: 1024px) {
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--space-3xl) 0;
  }
}
```

**Key rule:** `max-width: 1100px; margin: 0 auto` is the global content container constraint.
Apply to section inner wrappers, not to the section element itself (sections span full viewport
width for background colors).

[CITED: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries]
[CITED: 02-UI-SPEC.md — Responsive Breakpoints section]

---

### Pattern 7: index.astro Rewrite

**What:** Replace the Phase 1 placeholder with a composed page that imports section components.

```astro
---
// src/pages/index.astro (Phase 2)
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
import Journey from "../components/Journey.astro";
---
<Layout title="Asaad — Data & AI Professional">
  <Hero />
  <Journey />
</Layout>
```

**Constraints:**
- Nav and Footer are rendered inside Layout — do not import them in index.astro
- No `client:*` directives
- All href values root-relative (no `/Asaad_Webpage/` prefix)

---

### Anti-Patterns to Avoid

- **`client:load` or `client:visible` on section components:** Phase 2 components are static.
  Never add hydration directives to Hero, Nav, Journey, or Footer.
- **Importing global.css inside component files:** It is already imported in Layout.astro.
  Importing it again in a component causes duplicate CSS in the build output.
- **Using `--font-inter` or `--font-playfair` directly in component styles:** Always reference
  `var(--font-body)` or `var(--font-display)` — the bridging aliases from global.css.
- **Absolute positioning for the center-stem timeline on variable-height content:** Absolute
  positioning requires fixed heights; cards have variable text lengths. Use CSS Grid instead.
- **Adding `base` to astro.config.mjs:** The project uses a user page repo — no base path. Any
  `base` addition breaks all asset paths.
- **`<style is:global>` on component-specific styles:** Use scoped styles (plain `<style>`) for
  component-specific CSS and global.css for tokens. Reserve `is:global` only if strictly needed.
- **`max-width` on `<section>` elements:** Background colors must span full viewport width.
  Apply `max-width: 1100px; margin: 0 auto` on an inner `.container` div inside each section.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sticky nav on scroll | JS scroll listener + class toggle | `position: sticky; top: 0` CSS | CSS-only; D-09 locked; JS banned in Phase 2 |
| Smooth scroll to anchors | JS `scrollIntoView()` | `html { scroll-behavior: smooth }` | CSS-only; D-10 locked; 97%+ browser support |
| Center-stem layout | JS layout calculation | CSS Grid `1fr 2px 1fr` + nth-child | Grid handles variable heights automatically; no JS |
| Fluid typography | JS resize listener | `clamp(36px, 6vw, 56px)` | Native CSS; defined in UI-SPEC |
| Font loading | `@fontsource/inter` npm install | `fontProviders.fontsource()` (already in config) | Already configured; do not install font packages |
| Anchor offset for sticky nav | JS `scrollY` calculation | `scroll-padding-top: 60px` on `html` | CSS-only; exact value matches nav height |

**Key insight:** Every interaction and layout requirement in Phase 2 has a CSS-native solution.
Adding JavaScript would violate the no-`client:*` constraint and introduce unnecessary complexity.

---

## Common Pitfalls

### Pitfall 1: Scoped Styles Block Global CSS Custom Properties (False)

**What goes wrong:** Developer assumes that Astro's scoped style system will block access to
`:root` CSS custom properties, and adds `is:global` to every component `<style>` block "just in
case", leaking styles globally.
**Why it happens:** Misunderstanding of how CSS scoping works. Astro scoping adds a
`data-astro-cid-*` attribute to elements and corresponding attribute selectors to CSS rules. CSS
custom properties propagate via the cascade, not selector matching — they are inherited by all
descendants of `:root` regardless of scoping.
**How to avoid:** Use plain `<style>` (scoped) in components. Reference global tokens with
`var(--color-bg)` etc. This works without any special directive.
**Warning signs:** `<style is:global>` appearing on component-specific styles (Nav, Hero, etc.).

[CITED: https://docs.astro.build/en/guides/styling.mdx — "The Astro `<style>` tag can reference any CSS variables available on the page"]

---

### Pitfall 2: Max-Width Applied to Section Elements Clips Background Colors

**What goes wrong:** `max-width: 1100px; margin: 0 auto` is applied directly to `<section>`,
causing the background-color / gradient to be 1100px wide with blank margins instead of spanning
the full viewport.
**Why it happens:** Confusing "content width" with "section width".
**How to avoid:** Apply the max-width constraint to an inner `.inner` or `.container` div.
The `<section>` itself should have `width: 100%` and the background treatment.
**Warning signs:** Hero gradient or footer background does not span full viewport width.

---

### Pitfall 3: Center-Stem Timeline Has Gaps Between Rows

**What goes wrong:** Using a single `::before` pseudo-element for the vertical line, but entries
with different heights create visible gaps where the line appears broken.
**Why it happens:** Pseudo-element line depends on `position: absolute` on the container with
`height: 100%` — but if the container has `display: grid` and the rows vary in height, the
pseudo-element may not align correctly across all items.
**How to avoid:** Use the CSS Grid three-column approach where the middle column IS the stem.
The stem column element auto-stretches to match the tallest item in each row, and the background
color provides continuous coverage.
**Warning signs:** Visual gaps in the vertical stem line between timeline entries.

---

### Pitfall 4: nth-child Alternation Breaks When Stem Element is in the Markup

**What goes wrong:** If the HTML structure for the CSS Grid timeline includes a separator element
between entries (e.g., `<div class="timeline-dot">`), the `:nth-child(even)` selector counts
that separator as a child, producing incorrect alternation (e.g., both entry 1 and entry 2 end up
on the same side).
**Why it happens:** `:nth-child` counts ALL child elements of the parent, not just a filtered
subset.
**How to avoid:** Two options:
  1. Use `:nth-of-type` if entry and separator use different element types (e.g., `<li>` entries
     and `<span>` separators).
  2. Use `nth-child(An+B of .class)` (modern CSS — only supported in Chromium 111+, Firefox 113+,
     Safari 9+). Or simply keep the HTML structure clean so each "row" is a single element that
     contains both the card and the dot together, with CSS Grid placement.
**Warning signs:** Alternating pattern repeats instead of flipping sides.

[CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child]

---

### Pitfall 5: `scroll-padding-top` Missing Causes Sections to Hide Behind Sticky Nav

**What goes wrong:** Clicking "Journey" in the nav scrolls to `#journey` but the section
heading is hidden behind the 60px sticky nav bar.
**Why it happens:** Without `scroll-padding-top`, the browser aligns the top of the target
element exactly with the top of the viewport — which is behind the sticky nav.
**How to avoid:** Add `scroll-padding-top: 60px` to the `html` selector in global.css. This
value must match the nav height (60px, per UI-SPEC).
**Warning signs:** After clicking a nav link, the section heading is partially or fully hidden
behind the nav bar.

[CITED: 02-UI-SPEC.md — Interaction Contracts section]

---

### Pitfall 6: Mobile Nav Links Overflow at 375px

**What goes wrong:** At 375px, the nav has 4 text links plus the logo — they overflow
horizontally, causing the page to have a horizontal scrollbar.
**Why it happens:** Four uppercase links at 14px with `padding: 8px 16px` each can total
more than 375px when combined with the logo.
**How to avoid:** At 375px, reduce nav link padding to `var(--space-xs) var(--space-sm)` (4px
8px), or reduce letter-spacing. Do not wrap to two lines (breaks layout). Per UI-SPEC, full
hamburger menu is Phase 3 scope — links must remain visible but can be more compact.
**Warning signs:** Horizontal scrollbar appears on the page at 375px; viewport expands past
375px.

---

### Pitfall 7: `backdrop-filter` Not Rendering in Safari Without `-webkit-` Prefix

**What goes wrong:** Nav glass effect visible in Chrome/Firefox but absent in Safari.
**Why it happens:** Safari requires the `-webkit-backdrop-filter` vendor prefix.
**How to avoid:** Always declare both properties together:
  ```css
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  ```
**Warning signs:** Glass effect missing in Safari browser or iOS WebKit.

[CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter — browser compat table]

---

## Code Examples

Verified patterns from official Astro documentation and confirmed implementation sources.

### Nav Component Structure

```astro
---
// src/components/Nav.astro
// No props needed — content is static in Phase 2
---
<nav aria-label="Primary navigation">
  <a class="nav-logo" href="/">Asaad</a>
  <ul class="nav-links">
    <li><a href="#hero">About</a></li>
    <li><a href="#journey">Journey</a></li>
    <li>
      <a href="#" aria-disabled="true" tabindex="-1">Values</a>
    </li>
    <li>
      <a href="#" aria-disabled="true" tabindex="-1">Contact</a>
    </li>
  </ul>
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-xl);
    background-color: var(--color-surface);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .nav-logo {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links {
    list-style: none;
    display: flex;
    gap: var(--space-sm);
  }

  .nav-links a {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: var(--space-sm) var(--space-md);
    transition: color 150ms ease;
  }

  .nav-links a:hover:not([aria-disabled="true"]) {
    color: var(--color-accent-hover);
  }

  .nav-links a[aria-disabled="true"] {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  /* Mobile: tighter padding at 375px */
  @media (max-width: 767px) {
    nav {
      padding: 0 var(--space-md);
    }
    .nav-links a {
      padding: var(--space-xs) var(--space-sm);
      font-size: 12px;
    }
  }
</style>
```

### Journey Component HTML Structure

```astro
---
// src/components/Journey.astro
// Timeline entries are hardcoded placeholder data per D-14
const entries = [
  { role: "Senior Data Scientist", org: "Example Corp", date: "2019–2021",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
  { role: "Lead AI Engineer", org: "Data Co", date: "2021–2023",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
  { role: "Director of Analytics", org: "AI Lab", date: "2023–Present",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt." },
  // 4-7 total entries
];
---
<section id="journey">
  <div class="inner">
    <h2>Journey</h2>
    <div class="heading-accent"></div>
    <ol class="timeline">
      {entries.map((entry, i) => (
        <li class="timeline-entry">
          <div class="timeline-card">
            <p class="entry-role">{entry.role}</p>
            <p class="entry-org">{entry.org}</p>
            <p class="entry-date">{entry.date}</p>
            <p class="entry-impact">{entry.impact}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>
```

**Note on Astro JSX:** Astro uses JSX-like template syntax. `Array.prototype.map` works inside
`{}` expressions. The `class` attribute (not `className`) is correct in Astro templates.

[CITED: https://docs.astro.build/en/basics/astro-components.mdx]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS scroll listener for sticky nav class toggle | `position: sticky; top: 0` CSS | Supported since 2017 | No JS required; simpler; Phase 2 JS ban satisfied |
| JS smooth-scroll polyfill (`smoothscroll-polyfill`) | `html { scroll-behavior: smooth }` | CSS Level 4 (widely supported) | No package needed; instant |
| Anchor offset via JS (`scrollTo` with offset calculation) | `scroll-padding-top` on `html` | CSS Scroll Snap Level 1 | No JS; exact pixel offset |
| `backdrop-filter` requiring `-webkit-` prefix always | Baseline 2024 — prefix now optional for modern targets | September 2024 | Include prefix for Safari safety; drop for very modern-only targets |
| Separate `About` section with its own anchor | About narrative folded into Hero (D-04) | Project decision | One fewer section component; simpler nav structure |
| `output: 'hybrid'` | Merged into `output: 'static'` | Astro v5 | Removed API; `output: 'static'` is the only static option |

**Deprecated/outdated:**
- `position: fixed` for nav: works but removes element from document flow; `sticky` is preferred
  because it reflows correctly and does not require `padding-top` on the body to compensate.
- Manual `@font-face` declarations: Replaced by `fontProviders.fontsource()` in this project.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | Package management | Yes | 10.15.1 | — |
| Node.js | Astro build | Yes | v23.11.0 | — |
| Astro | Framework | Yes | 6.2.1 | — |
| @astrojs/check | Type checking (optional) | No | — | Skip `astro check` in build script; use `pnpm build` only |

[VERIFIED: `pnpm --version`, `node --version`, `pnpm exec astro --version` — all confirmed in this session]
[VERIFIED: `@astrojs/check` NOT in package.json and NOT in node_modules]
[VERIFIED: `pnpm build` succeeds cleanly in current state — confirmed in this session]

**Missing dependencies with no fallback:** None blocking Phase 2.

**Missing dependencies with fallback:**
- `@astrojs/check` — optional; if Wave 0 adds type checking, install with `pnpm add -D @astrojs/check`
  and update build script to `astro check && astro build`. Without it, `pnpm build` still works
  (Astro transpiles with esbuild but skips type validation).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — visual/CSS phases use observational + build verification |
| Config file | None |
| Quick run command | `pnpm build` (confirms no build/type errors) |
| Full suite command | `pnpm build && pnpm preview` (confirms local serve + visual check) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Full-viewport hero with name + tagline renders | smoke + visual | `pnpm build` (no errors) + browser at 1024px | ❌ Wave 0 — `Hero.astro` |
| HERO-02 | About narrative paragraphs visible in hero section | visual | Open `http://localhost:4321` after `pnpm preview` | ❌ Wave 0 — `Hero.astro` |
| JOUR-01 | Timeline section renders with 5-7 ordered entries | smoke + visual | `pnpm build` (no errors) + count entries in browser | ❌ Wave 0 — `Journey.astro` |
| JOUR-02 | Each entry shows role, org, time period | visual | Inspect DOM — all four fields present per entry | ❌ Wave 0 — `Journey.astro` |
| JOUR-03 | Timeline readable at 375px AND 1024px | responsive visual | DevTools → 375px responsive mode; check no overflow | ❌ Wave 0 — `Journey.astro` |
| SITE-04 | Clicking nav anchor scrolls smoothly to section | manual | Click "Journey" link; observe smooth scroll | ❌ Wave 0 — `global.css` |
| SITE-05 | Nav stays visible at top as user scrolls | visual | Scroll past hero; nav remains pinned | ❌ Wave 0 — `Nav.astro` |

**Phase success criteria verification map:**

| Success Criterion | Verification Method |
|-------------------|---------------------|
| SC-1: Visitor sees name, tagline, About above fold | Open site in browser at 1024px; confirm all three elements visible without scrolling |
| SC-2: Timeline shows 5-7 entries with all four fields | Count entries; inspect each for role, org, date, impact |
| SC-3: Sticky nav visible while scrolling | Scroll the full page; nav remains pinned at top |
| SC-4: Smooth scroll on nav click | Click each active anchor link; motion is smooth not instant |
| SC-5: No horizontal overflow at 375px | DevTools responsive mode at 375px; no scrollbar; `document.documentElement.scrollWidth === 375` |

### Sampling Rate

- **Per task commit:** `pnpm build` — must exit 0 with no errors before committing any component
- **Per wave merge:** `pnpm build && pnpm preview` — open browser and visually verify section
- **Phase gate:** All 5 success criteria verified in browser (375px + 1024px) before `/gsd-verify-work`

### Wave 0 Gaps (files that do not exist yet)

- [ ] `src/components/Nav.astro` — covers SITE-05
- [ ] `src/components/Hero.astro` — covers HERO-01, HERO-02
- [ ] `src/components/Journey.astro` — covers JOUR-01, JOUR-02, JOUR-03
- [ ] `src/components/Footer.astro` — no direct requirement but required by D-15
- [ ] `src/styles/global.css` update — covers SITE-04 (`scroll-behavior`) and all color/spacing tokens
- [ ] `src/layouts/Layout.astro` update — wire Nav and Footer into layout shell
- [ ] `src/pages/index.astro` rewrite — compose Hero and Journey inside Layout

---

## Security Domain

Phase 2 is static content only — no form inputs, no user-supplied data, no authentication,
no dynamic server responses, no JavaScript execution. ASVS categories V2 (authentication),
V3 (session), V4 (access control), V6 (cryptography) do not apply.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Static site — no auth |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | Public content only |
| V5 Input Validation | No | No user inputs in Phase 2 |
| V6 Cryptography | No | No secrets or encryption |

**Threat pattern relevant to Phase 2:** Dead nav links (`href="#"` with `aria-disabled="true"`)
must not allow keyboard focus trap. Implementation: `tabindex="-1"` as specified in UI-SPEC
Accessibility Contract. This prevents keyboard users from being stuck on non-functional anchors.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `position: sticky` has ~99% browser support and requires no fallback for this project's audience | Pattern 5 (Sticky Nav) | Minimal — sticky has been baseline since 2017; virtually no modern browser lacks it |
| A2 | `clamp(36px, 6vw, 56px)` middle value produces correct scaling between 375px and 768px viewports | Pattern 2 (Hero) | At 375px: `6vw = 22.5px` — less than 36px minimum, so clamp correctly outputs 36px. Behavior is mathematically correct. LOW risk. |
| A3 | Mobile nav links (4 links + logo) will fit at 375px with reduced padding | Pitfall 6 | If overflow occurs, further reduction or font-size decrease needed. Test at 375px is mandatory per success criteria |

**All other claims are verified against official Astro docs, UI-SPEC (approved), or confirmed
by running commands in this session.**

---

## Open Questions

1. **@astrojs/check not installed — should it be added?**
   - What we know: `@astrojs/check` is not in `package.json`. The build script is `astro build`
     only (no type checking step).
   - What's unclear: Whether the planner should add it as a Wave 0 task.
   - Recommendation: Keep optional. The Phase 2 components use straightforward TypeScript
     interfaces that esbuild transpiles correctly. If type errors become a problem, add
     `pnpm add -D @astrojs/check` and update the build script. Do not block Phase 2 on this.

2. **Timeline nth-child HTML structure — grid column vs dedicated stem element**
   - What we know: Two approaches work: (a) CSS Grid with a dedicated stem `<div>` in the HTML
     that spans all rows; (b) `:before` pseudo-element on the container.
   - What's unclear: The exact HTML structure for the `<ol>` + stem interaction.
   - Recommendation: Use CSS Grid three-column with the stem as a visual overlay using `::before`
     on the `.timeline` element (absolute positioned full-height line). Place each `<li>` entry
     in the grid manually using `nth-child` for column placement. This avoids having a non-semantic
     stem element in an `<ol>`. The planner should choose one approach and commit to it.

---

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` via Context7 CLI (`npx ctx7@latest docs /withastro/docs`) — component
  composition, slot usage, scoped styles, global styles, `is:global`, `define:vars`, TypeScript
  Props interface, import syntax
- `https://docs.astro.build/en/guides/styling.mdx` — scoped vs global CSS, CSS variable
  inheritance in Astro components
- `https://docs.astro.build/en/basics/astro-components.mdx` — Props, Astro.props, slot
- `https://docs.astro.build/en/reference/directives-reference.mdx` — `is:global`, `define:vars`
- `https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter` — Baseline 2024 status,
  browser support, -webkit- prefix requirement
- `https://www.w3schools.com/howto/howto_css_timeline.asp` — center-stem timeline HTML/CSS
  reference implementation (w3schools canonical pattern)
- `https://dev.to/phuocng/create-a-vertical-timeline-12ln` — CSS Grid timeline approach
- Existing codebase files read: `Layout.astro`, `global.css`, `index.astro`, `package.json`,
  `astro.config.mjs`, `tsconfig.json`, `02-CONTEXT.md`, `02-UI-SPEC.md`, `01-PATTERNS.md`,
  `01-RESEARCH.md`
- Live verification: `pnpm build` exits 0; `pnpm exec astro --version` = 6.2.1; `pnpm --version`
  = 10.15.1; `node --version` = v23.11.0

### Secondary (MEDIUM confidence)
- `https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries`
  — mobile-first min-width media query methodology
- `https://smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/` — clamp() fluid
  typography approach (confirmed clamp behavior is well-documented)

### Tertiary (LOW confidence)
- A1: `position: sticky` universal support (~99%) — training knowledge; not freshly verified
  against caniuse in this session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — astro 6.2.1 verified installed; no new packages needed
- Architecture patterns: HIGH — all patterns sourced from official Astro docs via Context7
- Timeline CSS: HIGH — verified against two authoritative references (w3schools + dev.to/phuocng)
- Sticky nav / backdrop-filter: HIGH — MDN Baseline 2024 confirmed; -webkit- prefix verified
- Mobile-first methodology: HIGH — MDN confirmed
- Pitfalls: HIGH (1–5), MEDIUM (6), HIGH (7)

**Research date:** 2026-05-01
**Valid until:** 2026-06-01 (stable Astro 6 ecosystem; CSS baseline features are permanent)
