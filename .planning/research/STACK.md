# Stack Research: Asaad Personal Website

**Researched:** 2026-04-29
**Overall Confidence:** HIGH (primary sources: Context7/withastro/docs, npm registry)

---

## Recommended Stack (2025/2026)

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | `^6.1.10` (latest stable) | Site framework | Zero JS by default, native font API, static output, GitHub Pages support built-in |
| Node.js | `>=22` (LTS) | Build runtime | Required by Astro 6; GitHub Actions default is 22 |

**Note:** Astro 5 introduced the Content Layer API. Astro 6 removed all legacy content collections. Use `^6` — do not pin to an older major to avoid a future migration cliff.

### CSS Approach: Vanilla CSS with Astro Scoped Styles

Use **Astro's built-in scoped `<style>` blocks** in each `.astro` component plus a single global `src/styles/global.css`.

**Do not add Tailwind.** Rationale:

- The site is a single page with approximately 6 sections. A utility-first framework adds ~300KB of dependency surface and a config file for no meaningful productivity gain at this scale.
- Astro scoped styles co-locate CSS with markup — ideal for a minimal, bespoke design that does not follow a Tailwind theme.
- No purge configuration, no class naming conventions, no cognitive overhead.
- Tailwind 4 (current, via `@tailwindcss/vite`) works fine in Astro 5.2+, but the tradeoff is not worth it here.

**CSS Architecture (lean):**

```
src/
  styles/
    global.css        ← CSS custom properties, resets, typography base, layout tokens
  components/
    Hero.astro        ← <style> scoped per component
    Timeline.astro
    Values.astro
    Contact.astro
```

`global.css` defines CSS custom properties (design tokens):

```css
:root {
  --color-text: #1a1a1a;
  --color-bg: #fafafa;
  --color-accent: #2563eb;
  --font-sans: "Inter Variable", system-ui, sans-serif;
  --font-heading: "Playfair Display", Georgia, serif;
  --spacing-section: 5rem;
}
```

### Typography

Use **Astro's native Font API** (stable in Astro 5+, continued in 6) with `fontProviders.fontsource()`.

**Font choices for a professional Data & AI profile:**
- **Inter Variable** — body text (clean, modern, readable, ubiquitous in tech)
- **Playfair Display** — headings/display (elegant serif, adds personality, strong contrast with Inter)

```js
// astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.fontsource(),
      weights: ["100 900"],   // variable font — full range, one file
      styles: ["normal"],
      subsets: ["latin"],
      formats: ["woff2"],
    },
    {
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      provider: fontProviders.fontsource(),
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      formats: ["woff2"],
    },
  ],
});
```

Then in the layout:

```astro
---
import { Font } from "astro:assets";
---
<head>
  <Font cssVariable="--font-inter" preload />
  <Font cssVariable="--font-playfair" preload />
</head>
```

**Why this over Google Fonts CDN:** Astro's font API self-hosts fonts into the build output at build time. No third-party CDN request at runtime, no GDPR tracking concern, no network round-trip. Fonts are served from GitHub Pages alongside your assets.

**Why Fontsource provider over `fontProviders.google()`:** Both work. Fontsource pulls from npm (offline-safe during CI), Google pulls from Google's CDN at build time. Either is fine; Fontsource is slightly more reproducible in air-gapped or rate-limited CI.

**Why NOT `@fontsource/inter` npm package installed directly:** The native Astro Font API (introduced in Astro 4.x, stable in 5+) supersedes manual Fontsource package installation. It handles `<link rel="preload">`, `font-display: swap`, subsetting, and CSS variable injection automatically. Do not install `@fontsource/inter` directly alongside the Font API — they conflict.

### Package Manager

Use **pnpm** (`pnpm@9` or later).

- Faster installs, smaller `node_modules` via content-addressable store.
- Astro's official GitHub Action auto-detects the package manager from the lockfile — just commit `pnpm-lock.yaml` and the workflow requires no `package-manager:` override.
- The Astro docs treat pnpm as a first-class option throughout.

### Component Libraries

**Use none.** This site has one page, six sections, and a contact form. No component library is justified.

Specific evaluation:

| Library | Verdict | Reason |
|---------|---------|--------|
| shadcn/ui | No | React dependency, zero-config styling opinions that fight a bespoke design |
| Flowbite | No | Tailwind-dependent, generic look unsuitable for personal branding |
| Radix UI | No | Headless primitives for accessible apps — overkill for a static page |
| Vanilla Astro components | YES | Write `<Hero />`, `<ValueCard />`, `<Timeline />` as `.astro` files with scoped styles |

The values "clickable cards" feature requires only a CSS `:target` or minimal vanilla JavaScript toggle — no JS framework island needed.

### Contact Form

Use **Formspree** (free tier, no backend required). Drop in an `<form action="https://formspree.io/f/YOUR_ID">` — zero JS needed. If Formspree is not available, the action URL is a placeholder comment per the project spec.

### Content: Hardcode vs. Content Collections

**Hardcode the content in `.astro` component props or a `src/data/` TypeScript file. Do not use content collections.**

Rationale:
- Content collections are designed for blogs (many entries of the same type queried at build time). This site has one timeline, four value cards, one bio — fixed, enumerated content.
- A `src/data/values.ts` array is simpler, fully typed, co-located, and requires no `content.config.ts` or loader setup.
- No markdown is needed. All content is short structured data (title, subtitle, body paragraph).

Example structure:

```ts
// src/data/values.ts
export const values = [
  {
    id: "integrity",
    label: "Integrity",
    story: "...",
  },
  // ...
] as const;
```

Content collections become worth it if a blog is added in a future phase.

---

## What NOT to Use

| Technology | Verdict | Reason |
|------------|---------|--------|
| Tailwind CSS | Avoid | Adds config overhead and generic utility classes to a site that needs bespoke, minimal styling. The productivity benefit is real for large projects; irrelevant here. |
| UnoCSS | Avoid | Same problem as Tailwind, with added uncertainty around Astro integration maturity for this use case. |
| React / Vue / Svelte island | Avoid | The only interactivity needed (values card expand/collapse) is achievable with vanilla JS or CSS `:target`. Adding a framework island pulls in a JS runtime bundle. |
| Content collections | Avoid for v1 | Overkill for static structured data. Use typed TS arrays instead. |
| `@fontsource/*` direct packages | Avoid | Superseded by Astro's native Font API. Installing both causes double font declarations. |
| Google Fonts `<link>` in `<head>` | Avoid | Astro Font API handles this better — self-hosted, no CDN dependency at runtime. |
| `@astrojs/tailwind` (legacy v3 wrapper) | Avoid | Deprecated approach; Tailwind 4 uses `@tailwindcss/vite` directly. Not relevant here since Tailwind is not recommended at all. |
| `output: 'server'` or SSR adapter | Avoid | GitHub Pages serves static files only. Keep `output: 'static'` (Astro default). No adapter needed. |
| npm (as package manager) | Defer | Works fine, but pnpm is faster and Astro's CI action auto-detects it. Use pnpm from day one. |

---

## GitHub Pages Deployment

### `astro.config.mjs`

**Case 1 — username.github.io repository** (repo name matches `<username>.github.io`):

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://<your-github-username>.github.io",
  // No `base` needed — the site IS at the root
  output: "static", // default; explicit for clarity
  fonts: [
    // ... font config as above
  ],
});
```

**Case 2 — project repository** (repo name is e.g. `asaad-website`):

```js
export default defineConfig({
  site: "https://<your-github-username>.github.io",
  base: "/asaad-website",   // must match repo name exactly
  output: "static",
});
```

**Important:** When `base` is set, all internal `href` and `src` attributes must use Astro's `import.meta.env.BASE_URL` or the `base` helper — Astro handles this automatically for assets imported through Astro's pipeline, but manually written `href="/about"` links will break. Keep everything as relative or use `Astro.url` for absolute links.

### `.github/workflows/deploy.yml`

This is the official Astro GitHub Action workflow. Copy verbatim:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Install, build, and upload site
        uses: withastro/action@v6
        # Auto-detects pnpm from pnpm-lock.yaml
        # No additional configuration needed for default setups
        # Optional overrides:
        # with:
        #   node-version: 24
        #   package-manager: pnpm@latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

### GitHub Repository Settings Required

1. Go to **Settings > Pages**.
2. Set **Source** to **GitHub Actions** (not "Deploy from a branch").
3. That is all — the workflow handles everything else.

### Full Installation Commands

```bash
# Create project
pnpm create astro@latest asaad-website
# Choose: Empty template, TypeScript strict mode

# No additional packages needed for the base site
# The Font API is built into Astro — no separate install

# Optional: if you want to lint/format
pnpm add -D prettier prettier-plugin-astro
```

---

## Confidence Levels

| Area | Confidence | Source | Notes |
|------|------------|--------|-------|
| Astro version (6.1.10) | HIGH | npm registry (live) | Latest stable confirmed |
| GitHub Pages workflow | HIGH | Context7 / withastro/docs | Official workflow verbatim from Astro docs |
| `output: 'static'` (no adapter) | HIGH | Context7 / withastro/docs | Static is the default; no adapter needed for GH Pages |
| Font API (fontProviders) | HIGH | Context7 / withastro/docs | Stable in Astro 5+, unchanged in 6 |
| Vanilla CSS over Tailwind | HIGH | First-principles + Astro docs | Tailwind integration confirmed working; recommendation is judgment call based on project scale |
| pnpm over npm | HIGH | Context7 / withastro/docs + CI auto-detect | withastro/action@v6 auto-detects from lockfile |
| No content collections for v1 | HIGH | First-principles | Content collections documented for blog/multi-entry use cases; not appropriate for fixed structured data |
| Hardcoded TypeScript data files | HIGH | Standard Astro pattern | No special Astro docs needed; idiomatic for small sites |
| Font pairing (Inter + Playfair) | MEDIUM | Design convention, not Astro-specific | Good professional pairing for tech/personal brand; can be swapped without architectural impact |
| No component library | HIGH | Project scope analysis | Single page, ~6 components; no UI library justified |
| Formspree for contact form | MEDIUM | Common community pattern | Free tier sufficient; alternative is Netlify Forms or EmailJS, but requires no backend change |
