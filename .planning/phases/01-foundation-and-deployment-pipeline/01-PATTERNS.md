# Phase 1: Foundation and Deployment Pipeline - Pattern Map

**Mapped:** 2026-04-29
**Files analyzed:** 6 (all new — greenfield project)
**Analogs found:** 0 / 6 (no source code exists yet; all patterns sourced from Astro 6 official docs as recorded in RESEARCH.md)

---

## Greenfield Notice

This is Phase 1 of a greenfield Astro 6 project. The repository contains only `.planning/` and
`CLAUDE.md` — no `.astro`, `.ts`, `.css`, or workflow files exist. There are no in-codebase
analogs to map from. All patterns below are Astro 6 canonical patterns, derived from:

- `01-RESEARCH.md` (official Astro docs, withastro/action docs, verified npm versions)
- `CLAUDE.md` (binding project constraints)

The planner must treat the RESEARCH.md code examples as the authoritative pattern source.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `astro.config.mjs` | config | build-time transform | Astro 6 official docs example | canonical (no codebase analog) |
| `src/layouts/Layout.astro` | layout | request-response (SSG) | Astro 6 official docs example | canonical (no codebase analog) |
| `src/pages/index.astro` | page/entry-point | request-response (SSG) | Astro 6 official docs example | canonical (no codebase analog) |
| `src/styles/global.css` | config/utility | build-time transform | CSS custom properties convention | canonical (no codebase analog) |
| `.github/workflows/deploy.yml` | config/CI | event-driven (push trigger) | withastro/action@v6 official YAML | canonical (no codebase analog) |
| `public/favicon.svg` | static-asset | file-I/O | Astro scaffold default | canonical (no codebase analog) |

---

## Pattern Assignments

### `astro.config.mjs` (config, build-time transform)

**Source:** RESEARCH.md — Pattern 1 + Key Conflict Resolution section
**Astro docs:** https://docs.astro.build/en/guides/deploy/github/ + https://docs.astro.build/en/guides/fonts/

**Complete pattern:**
```javascript
// astro.config.mjs
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://asaad101.sa",
  output: "static",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      weights: ["400 900"],
      styles: ["normal", "italic"],
    },
  ],
});
```

**Critical constraints (from CLAUDE.md — non-negotiable):**
- `site` must be `"https://asaad101.sa"` — exact value, no trailing slash
- `output` must be `"static"` — GitHub Pages is static hosting only
- NO `base` property — this is a user page repo (`asaadco/asaadco.github.io`), not a project page repo
- Do NOT install `@fontsource/inter` or `@fontsource/playfair-display` as packages — `fontProviders.fontsource()` fetches and bundles them automatically at build time
- Font `name` values must match Fontsource catalog names exactly: `"Inter"` and `"Playfair Display"`

**Anti-pattern to reject:**
```javascript
// WRONG — do not add base; breaks all asset paths on user page repo
export default defineConfig({
  site: "https://asaad101.sa",
  base: "/Asaad_Webpage",  // ← NEVER add this for asaadco/asaadco.github.io
});
```

---

### `src/layouts/Layout.astro` (layout, SSG request-response)

**Source:** RESEARCH.md — Pattern 3 (Font Usage in Layout)
**Astro docs:** https://docs.astro.build/en/guides/fonts/ + https://docs.astro.build/en/reference/modules/astro-assets/

**Complete pattern:**
```astro
---
// src/layouts/Layout.astro
import { Font } from "astro:assets";
import "../styles/global.css";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{Astro.props.title ?? "Asaad"}</title>
    <Font cssVariable="--font-inter" />
    <Font cssVariable="--font-playfair" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Critical constraints:**
- `<Font />` is imported from `"astro:assets"` — not from any npm package
- Both `<Font cssVariable="--font-inter" />` and `<Font cssVariable="--font-playfair" />` must be in `<head>` — the `cssVariable` values must match exactly what is declared in `astro.config.mjs`
- `global.css` is imported here so it applies site-wide
- Phase 1 version is a minimal shell — no nav, no footer, no sections yet
- No `client:load`, `client:idle`, or other hydration directives (static output only)

---

### `src/pages/index.astro` (page/entry-point, SSG)

**Source:** RESEARCH.md — Code Examples: "Minimal Placeholder index.astro"

**Phase 1 placeholder pattern (pipeline proof, not final UI):**
```astro
---
// src/pages/index.astro
// Phase 1 placeholder — proves deployment works before UI is built
import Layout from "../layouts/Layout.astro";
---
<Layout title="Asaad — Coming Soon">
  <main>
    <h1>Site coming soon.</h1>
    <p>Deployment pipeline is live.</p>
  </main>
</Layout>
```

**Constraints:**
- This file will be replaced in Phase 2 with actual content sections
- No inline styles or component imports beyond Layout in Phase 1
- Internal `href` values (if any added later) must NOT use a base path prefix — write `/` not `/Asaad_Webpage/`
- No `client:*` directives — this is a static page

---

### `src/styles/global.css` (config/utility, build-time transform)

**Source:** RESEARCH.md — Code Examples: "global.css design token shell"
**Convention:** CSS custom properties (design tokens) pattern

**Phase 1 token shell pattern:**
```css
/* src/styles/global.css — Phase 1: token shell only, content comes in Phase 2 */
:root {
  /* Typography — CSS variables bridging Font API to design system */
  --font-body: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-playfair), Georgia, serif;
}

*, *::before, *::after {
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

**Constraints:**
- Font CSS variables (`--font-inter`, `--font-playfair`) are injected by the Astro Font API into the `<head>` via the `<Font />` component — they are available as custom properties at runtime
- `--font-body` and `--font-display` are project-level aliases that wrap the Font API variables — this is the pattern to use in component `<style>` blocks throughout the project
- Phase 1 adds only the typographic token shell; color tokens, spacing tokens, and breakpoint variables are added in Phase 2
- This file is imported in `Layout.astro` — do not import it again in individual page components

---

### `.github/workflows/deploy.yml` (config/CI, event-driven)

**Source:** RESEARCH.md — Pattern 2 (GitHub Actions Workflow) + Pitfall #2 (concurrency)
**Astro docs:** https://docs.astro.build/en/guides/deploy/github/
**Action version:** `withastro/action@v6` (v6.1.1 released 2026-04-20, verified current)

**Complete pattern:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install, build, and upload site
        uses: withastro/action@v6
        with:
          package-manager: pnpm@latest

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

**Constraints:**
- `package-manager: pnpm@latest` must be explicit — though the action also auto-detects via `pnpm-lock.yaml`, being explicit prevents ambiguity
- `withastro/action@v6` handles pnpm install, caching, build (`pnpm build`), and artifact upload — do NOT add extra steps for these
- `workflow_dispatch` trigger is required — enables manual re-run from the GitHub Actions tab without a code push
- `concurrency` block prevents overlapping deploys when multiple pushes occur in quick succession
- Both `pages: write` and `id-token: write` permissions are mandatory for `actions/deploy-pages@v5`
- The `deploy` job must reference `environment: name: github-pages` — this links to the GitHub Pages environment that is created when you enable "GitHub Actions" as the Pages source in repo Settings

**Pre-deploy manual step (human action required, not automatable):**
Before the first push, go to: GitHub repo → Settings → Pages → Build and deployment → Source → select "GitHub Actions". Without this step the deploy job will fail with "github-pages environment not found".

---

### `public/favicon.svg` (static-asset, file-I/O)

**Source:** Astro scaffold default (`pnpm create astro@latest -- --template minimal`)
**Note:** The scaffold generates a default `public/favicon.svg`. No custom favicon is required for Phase 1.

**Constraint:**
- Files in `public/` are copied verbatim to `dist/` at build time — no Vite processing
- Do not place fonts in `public/` — use `fontProviders.fontsource()` instead (fonts go into `.astro/fonts/` cache and are bundled automatically)

---

## Shared Patterns

### No Base Path (applies to ALL files)
**Source:** CLAUDE.md Key Configuration Notes + RESEARCH.md Conflict Resolution
**Apply to:** Every file that contains internal href, src, or import paths

No file in this project should ever include `/Asaad_Webpage` in an internal path. The site deploys to the root (`https://asaad101.sa`). Write internal paths as:
- `/` for home
- `/about` (future)
- `/_astro/...` (Astro-generated, automatic)

### Static Output Only (applies to ALL .astro files)
**Source:** CLAUDE.md Tech Stack + RESEARCH.md Constraints
**Apply to:** All `.astro` components and pages

- Never use `output: 'server'` or `output: 'hybrid'`
- Never add `client:load`, `client:idle`, `client:visible` on below-fold or static content components
- The only permitted hydration in later phases is `client:visible` for interactive components that require JS (Values cards in Phase 3)

### pnpm Lockfile Committed
**Source:** RESEARCH.md Pitfall #3
**Apply to:** `pnpm-lock.yaml` (must be in repo root, committed, not gitignored)

The `withastro/action` uses `pnpm-lock.yaml` for:
1. Auto-detecting pnpm as the package manager
2. Cache key hashing for deterministic installs

### Font API CSS Variable Bridging
**Source:** RESEARCH.md Pattern 3
**Apply to:** `src/styles/global.css` and any component `<style>` blocks that reference fonts

The pattern is a two-layer alias:
1. `--font-inter` / `--font-playfair` — injected by `<Font />` component (do not define these manually)
2. `--font-body` / `--font-display` — project aliases defined in `global.css`, used in component styles

Component styles should reference `var(--font-body)` and `var(--font-display)`, not the raw `--font-inter` / `--font-playfair` variables directly.

---

## No Analog Found

All Phase 1 files have no in-codebase analog because this is a greenfield project. The table below documents this formally for the planner.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `astro.config.mjs` | config | build-time transform | No existing source code in repo |
| `src/layouts/Layout.astro` | layout | SSG | No existing source code in repo |
| `src/pages/index.astro` | page | SSG | No existing source code in repo |
| `src/styles/global.css` | utility | build-time transform | No existing source code in repo |
| `.github/workflows/deploy.yml` | CI config | event-driven | No existing source code in repo |
| `public/favicon.svg` | static-asset | file-I/O | No existing source code in repo |

**Planner action:** Use the patterns documented in the "Pattern Assignments" section above as the implementation source. These patterns are sourced from official Astro 6 docs and recorded verbatim in `01-RESEARCH.md`.

---

## Scaffold vs Manual Creation Decision

**Source:** RESEARCH.md Open Questions #2

| File | Creation Method | Rationale |
|------|----------------|-----------|
| `package.json` | Generated by `pnpm create astro@latest . -- --template minimal --no-install` | Scaffold produces correct Astro 6 `package.json` with `astro` dependency and `dev`/`build`/`preview` scripts |
| `tsconfig.json` | Generated by scaffold | Astro's pre-configured `tsconfig.json` includes strict settings required by `@astrojs/check` — do not hand-write |
| `astro.config.mjs` | Scaffold generates stub — OVERWRITE with pattern above | Scaffold produces a bare `defineConfig({})` — must be replaced with the `site`, `output`, and `fonts` config |
| `src/layouts/Layout.astro` | Write manually per pattern above | Scaffold may not generate a layout; must include `<Font />` component |
| `src/pages/index.astro` | Scaffold generates stub — OVERWRITE with pattern above | Scaffold produces boilerplate HTML — replace with minimal placeholder that imports Layout |
| `src/styles/global.css` | Write manually per pattern above | Scaffold may not generate this file; must be created |
| `.github/workflows/deploy.yml` | Write manually per pattern above | Not generated by scaffold; must be created |
| `public/favicon.svg` | Keep scaffold-generated default | Acceptable as-is for Phase 1 |

---

## Metadata

**Analog search scope:** Repository root `/Users/neoasaad/Projects/Asaad_Webpage/` (greenfield — only `.planning/` and `CLAUDE.md` exist)
**Files scanned:** 2 (RESEARCH.md, CLAUDE.md)
**Source of patterns:** Astro 6 official documentation, as captured in `01-RESEARCH.md`
**Pattern extraction date:** 2026-04-29
