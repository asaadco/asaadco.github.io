# Architecture Research: Asaad Personal Website

**Domain:** Single-page personal/portfolio site
**Researched:** 2026-04-29
**Overall confidence:** HIGH (sourced directly from Astro official docs via Context7)

---

## Recommended Folder Structure

Astro enforces one hard rule: pages live in `src/pages/`. Everything else is convention, not requirement. For a single-page site the convention is flat and simple.

```
/
├── public/
│   ├── favicon.svg
│   └── og-image.png           # Open Graph preview image
├── src/
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with anchor links
│   │   ├── Hero.astro          # Hero / About section
│   │   ├── Timeline.astro      # Professional journey section
│   │   ├── TimelineItem.astro  # Single timeline entry
│   │   ├── Values.astro        # Values section wrapper
│   │   ├── ValueCard.astro     # Single interactive card
│   │   ├── Contact.astro       # Contact form section
│   │   └── Footer.astro        # Footer
│   ├── data/
│   │   ├── timeline.ts         # Career milestone objects
│   │   └── values.ts           # Value name + story objects
│   ├── layouts/
│   │   └── BaseLayout.astro    # Full HTML shell (<html>, <head>, <body>)
│   ├── styles/
│   │   └── global.css          # CSS custom properties, reset, base typography
│   └── pages/
│       └── index.astro         # Single page — composes all sections
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

**Why this shape:**

- `src/pages/index.astro` is the only page. Astro builds it to `dist/index.html`. No sub-routing needed.
- `src/layouts/BaseLayout.astro` owns the `<html>` shell, `<head>` metadata, and global imports. `index.astro` just feeds it section components via `<slot />`.
- `src/data/` holds plain TypeScript objects — no markdown, no content collections. This project does not need the overhead of a content pipeline.
- `public/` is for binary assets (images, favicon) that are served as-is without Astro processing.

---

## Content/Data Strategy

**Recommendation: plain TypeScript data files in `src/data/`.**

Astro content collections (with `content.config.ts`, `glob()` loader, Zod schemas) are designed for large, file-based content sets like blog posts or product catalogs. For this site, the entire content payload is:

- 4–6 timeline entries
- 4 value cards with short story text
- One bio paragraph in Hero

That does not warrant a content pipeline. Plain `.ts` files give type safety, IDE autocomplete, and zero framework overhead.

```typescript
// src/data/timeline.ts
export interface TimelineEntry {
  year: string;
  role: string;
  company: string;
  description: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2024",
    role: "Principal AI Engineer",
    company: "Example Corp",
    description: "Led AI transformation across ...",
  },
  // ...
];
```

```typescript
// src/data/values.ts
export interface Value {
  id: string;
  title: string;
  tagline: string;
  story: string;
}

export const values: Value[] = [
  {
    id: "integrity",
    title: "Integrity",
    tagline: "Doing the right thing when no one is watching.",
    story: "Early in my career ...",
  },
  // ...
];
```

Components import these directly:

```astro
---
// src/components/Timeline.astro
import { timeline } from '../data/timeline';
---
```

**When to switch to content collections:** If the number of timeline entries grows large (>20), or if Asaad wants to edit content in Markdown without touching `.ts` files, migrate to the `file()` loader approach. That is a future concern, not a v1 concern.

---

## Component Breakdown

| Component | What it does | Notes |
|-----------|-------------|-------|
| `BaseLayout.astro` | HTML shell, `<head>`, global meta, imports global CSS | Used only by `index.astro` |
| `Header.astro` | Sticky top nav with 4 anchor links; mobile hamburger toggle | Owns its own `<script>` for toggle logic |
| `Hero.astro` | Name, title, tagline, CTA button linking to `#contact` | Static — no JS |
| `Timeline.astro` | Section wrapper; renders the list of `TimelineItem` | Iterates `timeline` data array |
| `TimelineItem.astro` | Single entry: year, role, company, description | Receives props; purely presentational |
| `Values.astro` | Section wrapper; renders grid of 4 `ValueCard` | Iterates `values` data array |
| `ValueCard.astro` | Front-face summary + expandable story panel | CSS-only expand or inline `<script>` toggle (see below) |
| `Contact.astro` | HTML form with Formspree `action` placeholder | Static HTML; no JS needed |
| `Footer.astro` | Copyright, optional social links | Static |

`index.astro` becomes a clean composition layer:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Timeline from '../components/Timeline.astro';
import Values from '../components/Values.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Asaad — Data & AI Professional">
  <Header />
  <main>
    <Hero />
    <Timeline />
    <Values />
    <Contact />
  </main>
  <Footer />
</BaseLayout>
```

---

## Navigation and Smooth Scroll

**Pattern: standard HTML anchor links + CSS `scroll-behavior` + vanilla JS for sticky state.**

Astro does not provide a `<Link>` component. Navigation is standard `<a href="#section-id">` tags pointing to section IDs on the same page. Smooth scrolling is a single CSS declaration — no JavaScript required.

```css
/* src/styles/global.css */
html {
  scroll-behavior: smooth;
}
```

The sticky header uses CSS `position: sticky`:

```astro
<!-- src/components/Header.astro -->
<header class="site-header">
  <nav>
    <a href="#hero">About</a>
    <a href="#journey">Journey</a>
    <a href="#values">Values</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-surface);
    backdrop-filter: blur(8px);
  }
</style>
```

Each section carries a matching `id`:

```astro
<!-- src/components/Hero.astro -->
<section id="hero">...</section>
```

**Active link highlighting** (optional): add a vanilla JS `<script>` in `Header.astro` using `IntersectionObserver` to watch sections and toggle an `aria-current` or `.active` class on the matching nav link as the user scrolls. This is ~15 lines of vanilla JS and requires no framework.

**Mobile hamburger**: also vanilla JS in `Header.astro`. Toggle `aria-expanded` on the button, toggle a `.nav-open` class on the `<header>` or `<nav>`, hide/show links via CSS. Astro docs show exactly this pattern with a `<script>` tag containing a `click` event listener on the menu element.

---

## Interactive Patterns (Values Cards)

**Two viable approaches — prefer CSS-only for this use case.**

### Option A: CSS-only with `<details>`/`<summary>` (Recommended)

Use the native HTML `<details>` element. No JavaScript, no framework, fully accessible by default, works without client-side hydration.

```astro
<!-- src/components/ValueCard.astro -->
---
const { title, tagline, story } = Astro.props;
---
<details class="value-card">
  <summary>
    <h3>{title}</h3>
    <p class="tagline">{tagline}</p>
  </summary>
  <div class="story">
    <p>{story}</p>
  </div>
</details>

<style>
  .value-card {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
  }
  .value-card[open] {
    background: var(--color-surface-raised);
  }
  .value-card summary {
    list-style: none; /* removes default triangle */
  }
  .story {
    margin-top: 1rem;
    animation: fade-in 200ms ease;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
```

Advantages: zero JS shipped, native browser accessibility (keyboard, screen reader), no hydration cost, instant. The `[open]` CSS selector handles visual state.

### Option B: Vanilla JS toggle (if custom animation needed)

If the design requires an animation that `<details>` cannot produce (e.g., smooth height transition), use a `<script>` tag inside `ValueCard.astro`. Astro automatically bundles and deduplicates scripts — if the component is used 4 times, the script ships once.

```astro
<script>
  document.querySelectorAll('.value-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.value-card');
      const isOpen = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!isOpen));
    });
  });
</script>
```

**Do NOT use a UI framework (React, Vue, Svelte) for this.** The interactivity here is simple toggle state. Adding a framework adds kilobytes of runtime with no benefit for this use case. Astro's `client:*` directives are for framework components only — not needed here.

---

## CSS Architecture

**Pattern: CSS custom properties in `global.css` + scoped component styles.**

### Layer 1: `src/styles/global.css`

Owns the design token layer and base resets. Imported once in `BaseLayout.astro`.

```css
/* src/styles/global.css */

/* Design tokens */
:root {
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-surface: #ffffff;
  --color-surface-raised: #f9fafb;
  --color-border: #e5e7eb;
  --color-accent: #2563eb;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;

  --space-section: 5rem;
  --space-component: 2rem;
  --max-width: 72rem;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background: var(--color-surface);
}

/* Utility: container */
.container {
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: 1.5rem;
}
```

### Layer 2: Scoped component `<style>` tags

Each `.astro` component uses a `<style>` block. Astro automatically scopes these — no BEM, no CSS modules, no naming conventions needed. Styles do not leak out of the component.

```astro
<!-- src/components/Hero.astro -->
<style>
  /* These rules only apply inside Hero.astro */
  .hero { padding-block: var(--space-section); }
  .hero-title { font-size: clamp(2rem, 5vw, 4rem); }
</style>
```

### Layer 3: `is:global` escape hatch

Used sparingly for styles that must cross component boundaries — for example, styling slotted content or third-party-injected markup.

```astro
<style is:global>
  /* Only use when scoping is genuinely a problem */
</style>
```

**Rule of thumb:** Start with scoped styles. Use `global.css` for design tokens and resets only. Use `is:global` only when a component genuinely cannot control what it styles.

---

## Build Sequence

The following order minimises rework. Each step has clear inputs from the previous.

**Phase 1 — Foundation (no visible UI)**

1. `astro.config.mjs` — set `site`, `base` (for GitHub Pages), `output: 'static'`
2. `src/styles/global.css` — full design token set; base reset
3. `src/layouts/BaseLayout.astro` — HTML shell; imports global CSS; sets `<meta>` tags
4. `src/pages/index.astro` — empty shell using `BaseLayout`; verify build produces valid HTML

**Phase 2 — Static sections (no interactivity)**

5. `src/data/timeline.ts` and `src/data/values.ts` — write data structures first so components have real content to render
6. `src/components/Hero.astro` — static; easiest to build; establishes visual style
7. `src/components/Footer.astro` — static
8. `src/components/Timeline.astro` + `TimelineItem.astro` — iterates data; tests that data layer works
9. `src/components/Contact.astro` — static form with placeholder action

**Phase 3 — Interactive layer**

10. `src/components/ValueCard.astro` — implement `<details>` pattern first; add animation after
11. `src/components/Values.astro` — section wrapper; iterates `values` data
12. `src/components/Header.astro` — build static nav first; add sticky + mobile toggle script last

**Phase 4 — Integration and polish**

13. Compose everything in `index.astro`; assign section `id` attributes for anchor links
14. Add `scroll-behavior: smooth` to `html` in `global.css`
15. Test mobile breakpoints across all components
16. GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)

**Dependency graph:**

```
global.css
    └── BaseLayout.astro
            └── index.astro
                    ├── Header.astro (depends on section IDs existing)
                    ├── Hero.astro
                    ├── Timeline.astro ← timeline.ts
                    ├── Values.astro   ← values.ts
                    │       └── ValueCard.astro
                    ├── Contact.astro
                    └── Footer.astro
```

Build `global.css` and `BaseLayout` before any visible component. Build data files before the components that consume them. Build `Header` last because it links to section IDs that must already exist.

---

## Sources

- Astro official docs — Project Structure: https://docs.astro.build/en/basics/project-structure/
- Astro official docs — Layouts: https://docs.astro.build/en/basics/layouts/
- Astro official docs — Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro official docs — Client-Side Scripts: https://docs.astro.build/en/guides/client-side-scripts/
- Astro official docs — Styling: https://docs.astro.build/en/guides/styling/
- Astro official docs — Islands Architecture: https://docs.astro.build/en/concepts/islands/
- Astro official docs — GitHub Pages Deploy: https://docs.astro.build/en/guides/deploy/github/
- All documentation retrieved via Context7 (library ID: `/withastro/docs`) — HIGH confidence
