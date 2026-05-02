# Phase 2: Static Sections - Pattern Map

**Mapped:** 2026-05-01
**Files analyzed:** 7 (3 modified, 4 new)
**Analogs found:** 3 / 7 (3 modified files have direct codebase analogs; 4 new components
have no codebase analog yet — RESEARCH.md patterns are authoritative for those)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/styles/global.css` | utility/config | build-time transform | `src/styles/global.css` (self — extend) | exact (self-modification) |
| `src/layouts/Layout.astro` | layout | SSG request-response | `src/layouts/Layout.astro` (self — extend) | exact (self-modification) |
| `src/pages/index.astro` | page/entry-point | SSG request-response | `src/pages/index.astro` (self — rewrite) | exact (self-modification) |
| `src/components/Nav.astro` | component | SSG request-response | `src/layouts/Layout.astro` | role-adjacent (layout shell, same Astro component conventions) |
| `src/components/Hero.astro` | component | SSG request-response | `src/layouts/Layout.astro` | role-adjacent |
| `src/components/Journey.astro` | component | SSG request-response | `src/layouts/Layout.astro` | role-adjacent |
| `src/components/Footer.astro` | component | SSG request-response | `src/layouts/Layout.astro` | role-adjacent |

---

## Pattern Assignments

### `src/styles/global.css` (utility/config, build-time transform)

**Analog:** `src/styles/global.css` (existing file — extend, do not replace)

**Existing file — full contents** (lines 1-21):
```css
/* src/styles/global.css — Phase 1: token shell only, content tokens come in Phase 2 */
:root {
  /* Typography — bridge Astro Font API variables to project-level aliases */
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-playfair), Georgia, serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
}
```

**Phase 2 additions — append to `:root` block** (source: `02-UI-SPEC.md` CSS Token Additions,
approved 2026-05-01):
```css
  /* === Phase 2: Colors (60/30/10 palette) === */
  --color-bg: #0d1b2a;           /* dominant 60% — page bg, hero section */
  --color-bg-deep: #070d14;      /* hero gradient dark end-stop */
  --color-surface: #1a2a3a;      /* secondary 30% — nav, cards, footer */
  --color-text: #f5f5f5;         /* primary text on dark surfaces */
  --color-text-muted: #9baab8;   /* secondary meta — org, date, tagline */
  --color-accent: #d4a017;       /* accent 10% — dots, underlines, dividers */
  --color-accent-hover: #e8b520; /* accent hover / active state */

  /* === Phase 2: Spacing (8-point scale) === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
```

**Phase 2 additions — extend `html` rule** (source: CONTEXT.md D-10, `02-UI-SPEC.md`
Interaction Contracts):
```css
  scroll-behavior: smooth;
  scroll-padding-top: 60px; /* offsets 60px sticky nav height on anchor jump */
```

**Critical constraints:**
- Keep existing Phase 1 tokens (`--font-body`, `--font-display`) — never remove them
- The `--font-inter` / `--font-playfair` variables are injected by the Astro Font API at runtime;
  `--font-body` / `--font-display` are project-level aliases — both sets must coexist
- Do NOT import this file anywhere other than `Layout.astro` (already imported there — importing
  again in a component causes duplicate CSS in build output)
- Hero 96px vertical padding is NOT added as a token here — it is a component-level property
  declared inline inside `Hero.astro` only

---

### `src/layouts/Layout.astro` (layout, SSG)

**Analog:** `src/layouts/Layout.astro` (existing file — extend)

**Existing file — full contents** (lines 1-26):
```astro
---
// src/layouts/Layout.astro
// Source: https://docs.astro.build/en/guides/fonts/
import { Font } from "astro:assets";
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
    <slot />
  </body>
</html>
```

**Phase 2 target state** — add `<Nav />` before `<slot />`, wrap `<slot />` in `<main>`,
add `<Footer />` after `</main>`. Frontmatter gains two new imports:
```astro
---
// src/layouts/Layout.astro
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

**Critical constraints:**
- `<Font />` tags and `global.css` import are UNCHANGED from Phase 1 — do not touch them
- `<main>` wrapping `<slot />` satisfies the ARIA landmark requirement (02-UI-SPEC.md
  Accessibility Contract)
- `<Nav />` and `<Footer />` are NOT imported in page files (`index.astro`) — they live in the
  layout shell only
- No `client:*` directives anywhere in this file

---

### `src/pages/index.astro` (page/entry-point, SSG)

**Analog:** `src/pages/index.astro` (existing file — full rewrite)

**Existing Phase 1 placeholder** (lines 1-11):
```astro
---
// src/pages/index.astro
// Phase 1 placeholder — proves deployment works before UI is built (Phase 2 replaces this)
import Layout from "../layouts/Layout.astro";
---
<Layout title="Asaad — Coming Soon">
  <main>
    <h1>Site coming soon.</h1>
    <p>Deployment pipeline is live.</p>
  </main>
</Layout>
```

**Phase 2 target state** — import and compose section components inside `<Layout>`.
Nav and Footer are NOT imported here (they come from Layout):
```astro
---
// src/pages/index.astro
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
import Journey from "../components/Journey.astro";
---
<Layout title="Asaad — Data & AI Professional">
  <Hero />
  <Journey />
</Layout>
```

**Critical constraints:**
- Drop the `<main>` wrapper — Phase 2 Layout.astro now wraps `<slot />` in `<main>`
- No `client:*` directives — Hero and Journey are purely static
- All `href` values root-relative — never `/Asaad_Webpage/...`
- Nav and Footer are NOT imported here — they are rendered by `Layout.astro`

---

### `src/components/Nav.astro` (component, SSG)

**Analog:** `src/layouts/Layout.astro` (closest existing Astro component — same frontmatter
structure, same Props interface convention, same scoped style pattern)

**Frontmatter and Props pattern** (copy from `src/layouts/Layout.astro` lines 1-11):
```astro
---
// No props needed — nav content is static in Phase 2
// Pattern: empty frontmatter block follows same convention as Layout.astro
---
```

**Scoped style pattern** (established in Phase 1 — from `01-PATTERNS.md` Shared Patterns):
```astro
<style>
  /* Scoped — Astro adds data-astro-cid-* automatically.
     CSS custom properties from global.css :root are fully accessible here
     via var() — scoping does NOT block inherited custom properties. */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 60px;
    background-color: var(--color-surface);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px); /* Safari — required per 02-RESEARCH.md Pitfall 7 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-xl);
  }
</style>
```

**Full component target** (source: `02-RESEARCH.md` Code Examples — Nav Component Structure,
and `02-UI-SPEC.md` Component Contracts — Nav):
```astro
---
// src/components/Nav.astro
// No props — static content in Phase 2
---
<nav aria-label="Primary navigation">
  <a class="nav-logo" href="/">Asaad</a>
  <ul class="nav-links">
    <li><a href="#hero">About</a></li>
    <li><a href="#journey">Journey</a></li>
    <li><a href="#" aria-disabled="true" tabindex="-1">Values</a></li>
    <li><a href="#" aria-disabled="true" tabindex="-1">Contact</a></li>
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
    position: relative;
  }

  .nav-links a:hover:not([aria-disabled="true"]) {
    color: var(--color-accent-hover);
  }

  /* Hover underline accent */
  .nav-links a::after {
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

  .nav-links a:hover:not([aria-disabled="true"])::after {
    transform: scaleX(1);
  }

  .nav-links a[aria-disabled="true"] {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  /* Mobile: tighter padding at 375px — prevents horizontal overflow (Pitfall 6) */
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

**Critical constraints:**
- `aria-label="Primary navigation"` on `<nav>` — required by Accessibility Contract
- Dead links (Values, Contact) use BOTH `aria-disabled="true"` AND `tabindex="-1"` — prevents
  keyboard focus trap (02-UI-SPEC.md Accessibility Contract)
- "About" nav link scrolls to `#hero` (not `#about`) — About narrative is folded into the Hero
  section (CONTEXT.md D-04, D-08)
- No `client:*` directive — CSS sticky requires no JS
- `--font-body` and `--font-display` (not `--font-inter` / `--font-playfair`) in all styles

---

### `src/components/Hero.astro` (component, SSG)

**Analog:** `src/layouts/Layout.astro` (same Astro component skeleton — frontmatter, template,
scoped style block)

**Frontmatter pattern** (from `src/layouts/Layout.astro` lines 1-11):
```astro
---
// src/components/Hero.astro
// No props — content is hardcoded placeholder per CONTEXT.md D-01
---
```

**Core HTML structure** (source: `02-UI-SPEC.md` Component Contracts — Hero, and `02-RESEARCH.md`
Pattern 2):
```astro
<section id="hero">
  <div class="inner">
    <h1>Asaad</h1>
    <p class="tagline">Data &amp; AI professional, inspirational speaker, and technical career coach.</p>
    <div class="about">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
         ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
         nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
    </div>
  </div>
</section>
```

**Scoped style pattern** (source: `02-UI-SPEC.md` Component Contracts — Hero):
```css
<style>
  section {
    min-height: 100vh;
    background: linear-gradient(160deg, var(--color-bg) 0%, var(--color-bg-deep) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-3xl) var(--space-md); /* mobile: 64px top/bottom, 16px sides */
  }

  /* Desktop: hero-only 96px vertical padding (not a scale token) */
  @media (min-width: 768px) {
    section {
      padding: 96px var(--space-md);
    }
  }

  .inner {
    max-width: 640px;
    margin: 0 auto;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.1;
  }

  .tagline {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-muted);
    margin-top: var(--space-md);
    line-height: 1.2;
  }

  .about {
    margin-top: var(--space-xl);
  }

  .about p {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: var(--color-text);
    text-align: left; /* readable left-aligned within centered inner wrapper */
  }

  .about p + p {
    margin-top: var(--space-md);
  }
</style>
```

**Critical constraints:**
- Section `id="hero"` — nav "About" link targets `#hero`
- `min-height: 100vh` not `height: 100vh` — avoids clipping on content overflow
- `max-width: 640px` on `.inner` div, NOT on `<section>` — background gradient must span full
  viewport width (02-RESEARCH.md Pitfall 2 / Anti-Patterns)
- `clamp(36px, 6vw, 56px)` for h1 — at 375px the 6vw resolves to 22.5px which is below the
  36px minimum, so clamp correctly outputs 36px (verified in 02-RESEARCH.md Assumptions A2)
- No `<h2>` in Hero — the page has one `<h1>` only; `<h2>` belongs in Journey section
- No `client:*` directive

---

### `src/components/Journey.astro` (component, SSG)

**Analog:** `src/layouts/Layout.astro` (same Astro component skeleton; the CSS Grid timeline
has no codebase precedent — RESEARCH.md Pattern 4 is authoritative)

**Frontmatter with data array** (source: `02-RESEARCH.md` Code Examples — Journey Component,
and `02-UI-SPEC.md` Component Contracts — Journey):
```astro
---
// src/components/Journey.astro
// Placeholder entries per CONTEXT.md D-14. Real content provided before Phase 4.
const entries = [
  {
    role: "Senior Data Scientist",
    org: "Example Corp",
    date: "2019–2021",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  {
    role: "Lead AI Engineer",
    org: "Data Co",
    date: "2021–2022",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  {
    role: "Director of Analytics",
    org: "AI Lab",
    date: "2022–2023",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  {
    role: "Principal ML Architect",
    org: "Tech Ventures",
    date: "2023–2024",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
  {
    role: "VP of AI Strategy",
    org: "Global Firm",
    date: "2024–Present",
    impact: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
];
---
```

**HTML template** (source: `02-RESEARCH.md` Code Examples — Journey Component HTML):
```astro
<section id="journey">
  <div class="inner">
    <h2>Journey</h2>
    <div class="heading-accent"></div>
    <ol class="timeline">
      {entries.map((entry) => (
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

**Center-stem CSS Grid pattern** (source: `02-RESEARCH.md` Pattern 4, `02-UI-SPEC.md`
Component Contracts — Journey):
```css
<style>
  section {
    background-color: var(--color-bg);
    padding: var(--space-2xl) var(--space-md); /* mobile: 48px top/bottom */
  }

  @media (min-width: 768px) {
    section {
      padding: var(--space-3xl) var(--space-md); /* desktop: 64px top/bottom */
    }
  }

  .inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text);
    text-align: center;
    line-height: 1.2;
  }

  .heading-accent {
    width: 40px;
    height: 2px;
    background-color: var(--color-accent);
    margin: var(--space-xs) auto var(--space-2xl);
  }

  /* === Timeline: mobile-first (single column, left stem) === */
  .timeline {
    position: relative;
    list-style: none;
    display: grid;
    grid-template-columns: 16px 1fr; /* left-edge stem, full-width content */
    column-gap: var(--space-md);
  }

  /* Vertical stem line (mobile: left edge) */
  .timeline::before {
    content: '';
    grid-column: 1;
    grid-row: 1 / -1;  /* span all rows */
    background-color: var(--color-surface);
    width: 2px;
    justify-self: center;
  }

  .timeline-entry {
    grid-column: 2;
    position: relative;
    padding-bottom: var(--space-xl);
  }

  /* Dot on the stem for each entry */
  .timeline-entry::before {
    content: '';
    position: absolute;
    left: calc(-1 * var(--space-md) - 9px); /* centers on the 2px stem in column 1 */
    top: var(--space-lg);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-accent);
    border: 2px solid var(--color-bg);
  }

  .timeline-card {
    background-color: var(--color-surface);
    border-radius: 8px;
    padding: var(--space-lg);
  }

  .entry-role {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text);
  }

  .entry-org {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--color-accent);
    margin-top: 2px;
  }

  .entry-date {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text-muted);
    margin-top: 2px;
  }

  .entry-impact {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: var(--color-text);
    margin-top: var(--space-sm);
  }

  /* === Desktop: center-stem (≥768px) === */
  @media (min-width: 768px) {
    .timeline {
      grid-template-columns: 1fr 2px 1fr;
      column-gap: var(--space-xl); /* 32px between card edge and stem */
    }

    /* Center stem replaces left-edge stem */
    .timeline::before {
      grid-column: 2;
      grid-row: 1 / -1;
      width: 2px;
      justify-self: center;
    }

    /* Odd entries (1, 3, 5…) go to left column */
    .timeline-entry {
      grid-column: 1;
      justify-self: end;
      max-width: 440px;
      width: 100%;
    }

    /* Even entries (2, 4, 6…) go to right column */
    .timeline-entry:nth-child(even) {
      grid-column: 3;
      justify-self: start;
    }

    /* Dot repositioning for desktop (on center stem) */
    .timeline-entry::before {
      left: auto;
      right: calc(-1 * var(--space-xl) - 9px); /* right-side entries: left of stem */
    }

    .timeline-entry:nth-child(even)::before {
      right: auto;
      left: calc(-1 * var(--space-xl) - 9px); /* left-side entries: right of stem */
    }
  }
</style>
```

**Critical constraints:**
- `<ol>` not `<ul>` — chronological sequence is semantically ordered
  (02-UI-SPEC.md Accessibility Contract)
- `max-width: 1100px` on `.inner` div, NOT on `<section>` — section background must span full
  viewport (02-RESEARCH.md Anti-Patterns)
- Breakpoint is 768px (CONTEXT.md D-12, 02-UI-SPEC.md Responsive Breakpoints — locked)
- `nth-child` alternation: if the dot is a `::before` pseudo-element on `<li>`, it is not a
  sibling element and does not disrupt `nth-child` counting (avoids 02-RESEARCH.md Pitfall 4)
- No `client:*` directive — pure CSS layout
- Organization field colored `--color-accent` (02-UI-SPEC.md Component Contracts — Journey)

---

### `src/components/Footer.astro` (component, SSG)

**Analog:** `src/layouts/Layout.astro` (same Astro component skeleton)

**Full component** (source: `02-UI-SPEC.md` Component Contracts — Footer, CONTEXT.md D-15):
```astro
---
// src/components/Footer.astro
// Minimal — name and copyright only per CONTEXT.md D-15 (locked)
---
<footer>
  <p>© 2026 Asaad</p>
</footer>

<style>
  footer {
    background-color: var(--color-surface);
    padding: var(--space-lg) var(--space-md);
    text-align: center;
  }

  p {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text-muted);
  }
</style>
```

**Critical constraints:**
- No social links, no email (CONTEXT.md D-15 — locked; social links deferred to Phase 4)
- `<footer>` semantic element — satisfies ARIA landmark requirement
- No `client:*` directive

---

## Shared Patterns

### Astro Component Frontmatter and Props
**Source:** `src/layouts/Layout.astro` (lines 1-11)
**Apply to:** All four new components (Nav, Hero, Journey, Footer)
```astro
---
// All Phase 2 components have no required props — content is hardcoded
// Follow the same TypeScript-commented, double-dash frontmatter fence pattern
---
```
Phase 2 components have no runtime props. If a future phase adds props, follow the
`interface Props { ... }` + `const { } = Astro.props;` pattern from `Layout.astro` lines 6-11.

### CSS Custom Property Token Consumption
**Source:** `src/layouts/Layout.astro` + `src/styles/global.css` (Phase 1 Patterns)
**Apply to:** All four new component `<style>` blocks
```css
/* Reference global tokens with var() — no is:global needed.
   Astro scoped styles do NOT block CSS custom property inheritance from :root. */
font-family: var(--font-body);       /* NOT var(--font-inter) */
font-family: var(--font-display);    /* NOT var(--font-playfair) */
color: var(--color-text);
background-color: var(--color-bg);
padding: var(--space-md);
```

### No `client:*` Directives (Static Phase)
**Source:** `01-PATTERNS.md` Shared Patterns — "Static Output Only"
**Apply to:** All new components AND updated Layout.astro and index.astro
```astro
<!-- WRONG — never add these in Phase 2 -->
<Hero client:load />
<Nav client:idle />

<!-- CORRECT — no directive on static components -->
<Hero />
<Nav />
```

### No Base Path on Internal Hrefs
**Source:** `01-PATTERNS.md` Shared Patterns — "No Base Path"
**Apply to:** Nav.astro (href attributes), index.astro (title/any links)
```astro
<!-- CORRECT -->
<a href="/">Asaad</a>
<a href="#hero">About</a>
<a href="#journey">Journey</a>

<!-- WRONG — never prefix with /Asaad_Webpage -->
<a href="/Asaad_Webpage/#hero">About</a>
```

### No Duplicate global.css Import
**Source:** `01-PATTERNS.md` Pattern Assignments — `src/styles/global.css`
**Apply to:** Nav.astro, Hero.astro, Journey.astro, Footer.astro
```astro
<!-- WRONG — global.css is already imported in Layout.astro; importing again creates
     duplicate CSS output in the build -->
import "../styles/global.css";

<!-- CORRECT — do not import global.css inside component files -->
<!-- Tokens are inherited via the cascade — just use var() in your <style> block -->
```

### max-width on Inner Container, Not Section
**Source:** `02-RESEARCH.md` Anti-Patterns (Pitfall 2)
**Apply to:** Hero.astro, Journey.astro
```astro
<!-- CORRECT pattern -->
<section id="hero">           <!-- section spans full viewport width -->
  <div class="inner">         <!-- inner div gets max-width constraint -->
    ...
  </div>
</section>

<!-- WRONG — clips background gradient/color to 1100px -->
<section id="hero" style="max-width: 1100px">
  ...
</section>
```

### Mobile-First Media Queries
**Source:** `02-RESEARCH.md` Pattern 6
**Apply to:** Nav.astro, Hero.astro, Journey.astro
```css
/* Base styles — 375px viewport (no media query) */
.element {
  padding: var(--space-2xl) var(--space-md);
}

/* Tablet and above */
@media (min-width: 768px) {
  .element {
    padding: var(--space-3xl) var(--space-md);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    max-width: 1100px;
    margin: 0 auto;
  }
}
```
Write mobile styles first (no media query). Layer tablet (`min-width: 768px`) and desktop
(`min-width: 1024px`) on top. Never use `max-width` media queries except for the nav mobile
override (already documented in Nav section above).

---

## No Analog Found

All four new components (`Nav.astro`, `Hero.astro`, `Journey.astro`, `Footer.astro`) have no
direct codebase analog because `src/components/` does not exist yet. The closest analog for
Astro component skeleton conventions is `src/layouts/Layout.astro` (used above). For
component-specific CSS patterns (center-stem timeline, sticky nav, gradient hero), the
authoritative pattern source is `02-RESEARCH.md` (Patterns 1-7) and `02-UI-SPEC.md`.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/components/Nav.astro` | component | SSG | `src/components/` does not exist; `Layout.astro` used for skeleton; CSS sticky nav pattern from RESEARCH.md Pattern 5 |
| `src/components/Hero.astro` | component | SSG | Same as above; gradient hero pattern from RESEARCH.md Pattern 2 |
| `src/components/Journey.astro` | component | SSG | Same as above; CSS Grid center-stem pattern from RESEARCH.md Pattern 4 — most complex and highest-risk task |
| `src/components/Footer.astro` | component | SSG | Same as above; minimal, no novel patterns needed |

---

## Metadata

**Analog search scope:** `src/` (3 files found: `layouts/Layout.astro`, `pages/index.astro`,
`styles/global.css`)
**Files scanned:** 3 source files + `01-PATTERNS.md` (canonical Phase 1 reference)
**Phase 1 patterns inherited:** No base path, static output only, font variable bridging,
pnpm lockfile committed
**Pattern extraction date:** 2026-05-01
