# Phase 1: Foundation and Deployment Pipeline - Research

**Researched:** 2026-04-29
**Domain:** Astro 6 static site scaffold + GitHub Pages CI/CD via GitHub Actions
**Confidence:** HIGH

---

## Summary

Phase 1 establishes the deployment pipeline before any UI is built. The goal is a working Astro 6
project that can be pushed to GitHub and automatically deployed to the live GitHub Pages URL via
a GitHub Actions workflow. No UI content is required — a placeholder index page is sufficient to
prove the pipeline works end-to-end.

The tech stack is fully locked: Astro 6 with `output: 'static'`, pnpm, and `withastro/action@v6`
for CI/CD. No component framework, no Tailwind, no adapters. Fonts are loaded via the Astro Font
API with the built-in `fontProviders.fontsource()` provider — no separate font packages to install.

The most important decision in this phase is the correct `astro.config.mjs` configuration. The
project targets a **user page repo** (`neoasaad/neoasaad.github.io`), which deploys to the root
URL `https://neoasaad.github.io`. User page repos do NOT need a `base` path — unlike project page
repos (e.g., `username/Asaad_Webpage`) which would require `base: '/Asaad_Webpage'`. CLAUDE.md is
authoritative on this point and the most recent commit ("correct astro config — user page repo, no
base path needed") confirms this decision.

**Primary recommendation:** Scaffold a minimal Astro 6 project with `pnpm create astro@latest`,
configure `astro.config.mjs` with `site` only (no `base`), add the GitHub Actions workflow, push
to `neoasaad/neoasaad.github.io`, and verify the live URL loads.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SITE-01 | Site is built with Astro and configured to deploy to GitHub Pages (github.io) | Covered by: astro.config.mjs setup, withastro/action@v6 workflow YAML, GitHub Pages "GitHub Actions" source setting |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

The following directives from CLAUDE.md are binding. Research does not recommend approaches
that contradict these.

| Directive | Detail |
|-----------|--------|
| Framework | Astro 6, `output: 'static'` — no adapters |
| Package manager | pnpm (not npm, not yarn) |
| Styling | Vanilla CSS + Astro scoped styles — no Tailwind, no CSS-in-JS |
| Fonts | Astro Font API with `fontProviders.fontsource()` — Inter Variable + Playfair Display |
| Hosting | GitHub Pages via `withastro/action@v6` workflow |
| No component framework | Vanilla Astro + vanilla JS only (no React, Vue, Svelte) |
| `site` config | `'https://neoasaad.github.io'` — no `base` (user page repo) |
| Internal hrefs | Do NOT prefix with base path |
| GitHub Pages source | Must be set to "GitHub Actions" in repo Settings (not `gh-pages` branch) |

---

## Architectural Responsibility Map

This phase has no meaningful tier split — it is infrastructure only. All work lives at the
static build layer. Noting for completeness.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Static file generation | Build (Astro) | — | Astro compiles `.astro` to HTML/CSS/JS at build time |
| Asset serving | CDN / Static (GitHub Pages) | — | GitHub Pages serves `dist/` directly |
| CI/CD trigger | GitHub Actions | — | Push to `main` triggers build + deploy |
| Font loading | Build (Astro Font API) | CDN (GitHub Pages) | Font files bundled into `dist/` at build time |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.10 | Framework — compiles `.astro` to static HTML/CSS/JS | Locked project decision; current npm `latest` tag |
| typescript | 6.0.3 (bundled via astro) | Type checking for `.astro` frontmatter | Bundled with Astro; `tsconfig.json` included in scaffold |

[VERIFIED: npm registry — `npm view astro version` returned `6.1.10` on 2026-04-29]
[VERIFIED: npm registry — `npm view @astrojs/check version` returned `0.9.9`]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/check | 0.9.9 | Type-check `.astro` files | Include in `package.json` scripts for CI lint gate |

[VERIFIED: npm registry]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `fontProviders.fontsource()` | `fontProviders.google()` | Fontsource is decided; Google Fonts requires network fetch at client load time; Fontsource bundles files into dist |
| `withastro/action@v6` | Custom workflow with `pnpm build` + `actions/deploy-pages` | Official action handles pnpm detection, caching, and artifact upload automatically — no custom steps needed |

**Installation:**
```bash
pnpm create astro@latest . -- --template minimal
pnpm install
```

Note: The scaffold already installs `astro` as a dependency. No separate install needed for font
providers — `fontProviders.fontsource()` is built into `astro/config`.

---

## Architecture Patterns

### System Architecture Diagram

```
Developer pushes to main
        |
        v
GitHub Actions trigger (on: push to main)
        |
        v
withastro/action@v6
  - Detects pnpm via pnpm-lock.yaml
  - Runs pnpm install (with cache)
  - Runs pnpm build  --> /dist (static files)
  - Uploads dist/ as GitHub Pages artifact
        |
        v
actions/deploy-pages@v5
  - Deploys artifact to github-pages environment
        |
        v
https://neoasaad.github.io  (live URL)
```

### Recommended Project Structure

```
.                          # repo root (neoasaad/neoasaad.github.io)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow
├── public/
│   └── favicon.svg        # Static assets (not processed by Vite)
├── src/
│   ├── layouts/
│   │   └── Layout.astro   # Base HTML shell with <Font /> in <head>
│   ├── pages/
│   │   └── index.astro    # Single entry point (single-page scroll)
│   └── styles/
│       └── global.css     # Design tokens (CSS custom properties)
├── astro.config.mjs        # Astro config (site, output, fonts)
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

### Pattern 1: astro.config.mjs for User Page Repo

**What:** Minimal config for a user page repo deploying to root URL
**When to use:** When the repo name is `<username>.github.io` (no `base` needed)

```javascript
// Source: https://docs.astro.build/en/guides/deploy/github/
// Source: https://docs.astro.build/en/guides/fonts/
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://neoasaad.github.io",
  output: "static",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],  // variable font weight range
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      weights: ["400 900"],  // variable font weight range
      styles: ["normal", "italic"],
    },
  ],
});
```

[CITED: https://docs.astro.build/en/guides/fonts/]
[CITED: https://docs.astro.build/en/guides/deploy/github/]

**Critical note:** No `base` property. Internal `href` values stay as `/`, `/about`, etc.
STATE.md incorrectly includes `base: /Asaad_Webpage` — this is a doc artifact that was
corrected in commit `7cf0fe8`. CLAUDE.md and the Astro official docs for user page repos are
authoritative.

### Pattern 2: GitHub Actions Workflow (withastro/action@v6)

**What:** Two-job workflow: build (withastro/action) + deploy (deploy-pages)
**When to use:** All Astro + GitHub Pages deployments

```yaml
# Source: https://docs.astro.build/en/guides/deploy/github/
# .github/workflows/deploy.yml
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

[CITED: https://docs.astro.build/en/guides/deploy/github/ — official Astro docs YAML]
[VERIFIED: withastro/action@v6 is current; v6.1.1 released 2026-04-20 per github.com/withastro/action]

**Notes on pnpm:**
- `package-manager: pnpm@latest` is explicit; action also auto-detects via `pnpm-lock.yaml`
- The action handles pnpm store caching automatically (cache input defaults to `true`)
- No need to add a separate `pnpm/action-setup` step

### Pattern 3: Font Usage in Layout

**What:** Import `<Font />` from `astro:assets` and place in `<head>`; reference CSS variable in styles
**When to use:** Any Astro component or layout that needs the custom fonts

```astro
---
// src/layouts/Layout.astro
// Source: https://docs.astro.build/en/guides/fonts/
import { Font } from "astro:assets";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Asaad</title>
    <Font cssVariable="--font-inter" />
    <Font cssVariable="--font-playfair" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Then in `global.css` or a `<style>` block:
```css
body {
  font-family: var(--font-inter), sans-serif;
}
h1, h2, h3 {
  font-family: var(--font-playfair), serif;
}
```

[CITED: https://docs.astro.build/en/guides/fonts/]
[CITED: https://docs.astro.build/en/reference/modules/astro-assets/ — Font component docs]

### Anti-Patterns to Avoid

- **`base: '/Asaad_Webpage'` in astro.config.mjs:** This is for project page repos. The target
  repo is `neoasaad/neoasaad.github.io` (user page) — no base needed. Adding it will break asset
  paths (all assets will look for `/Asaad_Webpage/...` which doesn't exist at root).
- **`output: 'server'` or `output: 'hybrid'`:** GitHub Pages is static hosting only. Always use
  `output: 'static'`.
- **Installing `@fontsource/inter` or `@fontsource/playfair-display` manually:** Not needed.
  `fontProviders.fontsource()` fetches and bundles fonts during the Astro build automatically —
  no separate `pnpm add` for font packages.
- **Skipping `workflow_dispatch` trigger:** Omitting this means you can't manually re-trigger
  the deploy from the GitHub Actions tab without a new push.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub Pages deployment | Custom shell scripts pushing to `gh-pages` branch | `withastro/action@v6` + `deploy-pages@v5` | Official action handles pnpm detection, caching, artifact upload, and the `github-pages` environment linkage automatically |
| Font self-hosting | Manually downloading WOFF2 files and placing in `public/` | `fontProviders.fontsource()` in astro.config.mjs | Built-in; handles font caching in `.astro/fonts`, generates optimal fallbacks, no manual CORS or preload management |
| TypeScript config | Writing `tsconfig.json` by hand | Use scaffold output from `pnpm create astro@latest` | Astro provides a pre-configured `tsconfig.json`; hand-rolling often misses strict settings required by `@astrojs/check` |

---

## Common Pitfalls

### Pitfall 1: GitHub Pages source not set to "GitHub Actions" before first push

**What goes wrong:** The workflow file is committed and pushed to `main`, but the deploy job
silently fails or shows a "github-pages environment not found" error. The live URL returns a 404.
**Why it happens:** The `github-pages` GitHub Actions environment only exists after you manually
enable "GitHub Actions" as the Pages source in the repo Settings. If you push the workflow first,
the deploy step has nowhere to push to.
**How to avoid:** Before the first push: go to repo Settings → Pages → Build and deployment →
select "GitHub Actions" as the Source.
**Warning signs:** Workflow passes "build" but fails or is skipped at "deploy" step in Actions tab.

[CITED: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site]

### Pitfall 2: Missing `concurrency` setting causes overlapping deploys

**What goes wrong:** Two quick pushes to `main` both trigger the workflow. The second deploy can
overwrite the first mid-deploy and result in a broken state or wasted runner minutes.
**Why it happens:** No concurrency control by default.
**How to avoid:** Add a `concurrency` block at the top of the workflow:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
**Warning signs:** Multiple workflow runs active simultaneously in the Actions tab.

[ASSUMED — common GitHub Actions best practice; not verified against official withastro docs]

### Pitfall 3: `pnpm-lock.yaml` not committed

**What goes wrong:** CI runs `pnpm install` but without the lockfile it installs latest minor
versions, which may differ from local dev, causing non-deterministic builds or silent version
mismatches.
**Why it happens:** Developer adds `pnpm-lock.yaml` to `.gitignore` by mistake, or doesn't run
`pnpm install` before first commit.
**How to avoid:** Verify `pnpm-lock.yaml` is committed. It must be present in the repo root.
The `withastro/action` relies on it for package manager detection and cache key hashing.
**Warning signs:** CI build takes unusually long (no cache hit) or produces different output than local.

[VERIFIED: withastro/action auto-detects pnpm via pnpm-lock.yaml presence — github.com/withastro/action/blob/main/action.yml]

### Pitfall 4: Wrong repo — pushing Astro code to `Asaad_Webpage` instead of `neoasaad.github.io`

**What goes wrong:** If code is pushed to a repo named `Asaad_Webpage` (which does not currently
exist on GitHub), it deploys to `https://neoasaad.github.io/Asaad_Webpage` (project page), not
the root URL. All asset paths would then break unless `base: '/Asaad_Webpage'` is also set.
**Why it happens:** Confusion between two repo naming strategies. CLAUDE.md and the most recent
commit confirm the intent is `neoasaad/neoasaad.github.io` (user page repo, root URL).
**How to avoid:** Ensure the GitHub remote is set to `git@github.com:neoasaad/neoasaad.github.io.git`
or `https://github.com/neoasaad/neoasaad.github.io.git`. Verify with `git remote -v`.
**Warning signs:** `git push` creates a new repo named `Asaad_Webpage` on GitHub.

[VERIFIED: `curl https://api.github.com/repos/neoasaad/neoasaad.github.io` returns 200 + `has_pages: true`;
 `curl https://api.github.com/repos/neoasaad/Asaad_Webpage` returns 404]

### Pitfall 5: Fontsource font name mismatch

**What goes wrong:** Using the display name "Playfair Display" when the Fontsource package name
is different, causing a build error or fallback to system fonts silently.
**Why it happens:** Fontsource uses the canonical font name from the Fontsource catalog. The
`name` property in astro.config.mjs must match the Fontsource catalog name exactly.
**How to avoid:** Verify both "Inter" and "Playfair Display" are present in the Fontsource
catalog at fontsource.org. These are widely-used fonts and their Fontsource names match the
display names.
**Warning signs:** Build warning about font not found, or `var(--font-playfair)` resolves to a
system serif at runtime.

[ASSUMED — exact Fontsource catalog name matching requirement; not independently verified in this session]

---

## Key Conflict Resolution: `base` vs No `base`

This is the most important clarification for the planner.

**The conflict:**
- ROADMAP.md success criterion #4 (written earlier) references `base: /Asaad_Webpage` and URL
  `https://neoasaad.github.io/Asaad_Webpage`
- STATE.md Accumulated Context says `base: /Asaad_Webpage`
- CLAUDE.md (authoritative, checked in) says: `site: 'https://neoasaad.github.io'` — no `base` needed
- Most recent commit `7cf0fe8` is explicitly titled "correct astro config — user page repo, no base path needed"

**The resolution (verified):**
- Repo `neoasaad/neoasaad.github.io` exists on GitHub with `has_pages: true`
- Repo `neoasaad/Asaad_Webpage` does NOT exist on GitHub (returns 404)
- GitHub Pages user page repos (`<username>.github.io`) deploy to the root URL — no `base` needed
- Official Astro docs confirm: "If your repository name matches the special `<username>.github.io`
  pattern, you can skip the `base` configuration"

**Locked decision for planning:**
```javascript
// astro.config.mjs
export default defineConfig({
  site: "https://neoasaad.github.io",
  output: "static",
  // NO base property
});
```

The ROADMAP.md and STATE.md references to `base: /Asaad_Webpage` are stale documentation
artifacts. The planner should use CLAUDE.md as the source of truth.

---

## Code Examples

### Minimal Placeholder index.astro

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

### Complete astro.config.mjs

```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/deploy/github/
// Source: https://docs.astro.build/en/guides/fonts/
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://neoasaad.github.io",
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

### global.css design token shell

```css
/* src/styles/global.css — Phase 1: token shell only, content comes in Phase 2 */
:root {
  /* Typography */
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

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Self-host fonts via `public/` | `fontProviders.fontsource()` in astro.config.mjs | Astro 6.0.0 (Font API) | Zero font packages to install; fonts bundled into dist automatically |
| `output: 'hybrid'` mode | `output: 'static'` (hybrid merged in) | Astro v5.0 | `hybrid` is removed — don't use it |
| Custom GitHub Actions with `pnpm/action-setup` + manual caching | `withastro/action@v6` | 2024 | Official action handles all of this internally |
| Push dist to `gh-pages` branch | GitHub Actions + `actions/deploy-pages` | GitHub Pages GitHub Actions source | Cleaner, no branch pollution, official pattern |

**Deprecated/outdated:**
- `output: 'hybrid'`: Removed in Astro v5; merged into `output: 'static'` [CITED: Astro upgrade guide]
- `@astrojs/image` integration: Replaced by built-in `astro:assets` in Astro 3+ [ASSUMED]

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | Package management | Yes | 10.15.1 | — |
| Node.js | Astro build | Yes | v23.11.0 | — |
| git | Version control | Yes | 2.50.1 | — |
| GitHub remote | CI/CD deployment | Not configured yet | — | Must be added in Wave 0 |

[VERIFIED: `pnpm --version`, `node --version`, `git --version` all run successfully on local machine]

**Missing dependencies with no fallback:**
- GitHub remote not yet configured (`git remote -v` returns empty). The `git remote add origin` step
  must occur before CI/CD can be tested. This is expected for Phase 1 Wave 0.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — Phase 1 is infrastructure only; validation is observational |
| Config file | n/a |
| Quick run command | `pnpm build` (verifies build succeeds locally) |
| Full suite command | `pnpm build && pnpm preview` (verifies build + local serve) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SITE-01 | Astro builds without errors | smoke | `pnpm build` | ❌ Wave 0 — package.json must exist |
| SITE-01 | GitHub Actions workflow triggers on push | manual-only | Push to main, observe Actions tab | n/a |
| SITE-01 | Live URL loads with no 404s | manual-only | Open `https://neoasaad.github.io` in browser | n/a |
| SITE-01 | No asset 404s in browser DevTools network tab | manual-only | Inspect network tab for 404 responses | n/a |

**Manual-only justification:** CI/CD and live URL verification require a real GitHub push and
live GitHub Pages environment — cannot be automated locally.

### Sampling Rate

- **Per task commit:** `pnpm build` (confirms scaffold compiles)
- **Per wave merge:** `pnpm build && pnpm preview` (confirms local serve works)
- **Phase gate:** Live URL `https://neoasaad.github.io` loads with no console errors before
  `/gsd-verify-work` is called

### Wave 0 Gaps

- [ ] `package.json` — created by `pnpm create astro@latest`; does not exist yet
- [ ] `astro.config.mjs` — must be created with correct `site` and `fonts` config
- [ ] `.github/workflows/deploy.yml` — does not exist yet
- [ ] `git remote add origin git@github.com:neoasaad/neoasaad.github.io.git` — not configured
- [ ] GitHub repo Settings → Pages → "GitHub Actions" source — manual step required before first deploy

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Fontsource catalog names "Inter" and "Playfair Display" exactly match the `name` field required by `fontProviders.fontsource()` | Standard Stack / Code Examples | Build warning or silent font fallback; fix is to look up exact name on fontsource.org |
| A2 | Adding `concurrency` block to prevent overlapping deploys is best practice | Common Pitfalls #2 | Without it, rapid pushes could cause overlapping deploys — low risk for solo dev project |
| A3 | The project will be pushed to `neoasaad/neoasaad.github.io` repo (user page) | Conflict Resolution | If a different repo is used, the `base` config decision changes completely |

---

## Open Questions

1. **GitHub remote not yet configured**
   - What we know: `git remote -v` returns empty; no remote has been added yet
   - What's unclear: Whether Asaad wants to push to `neoasaad/neoasaad.github.io` (confirmed exists)
     or create a new repo — the existing `neoasaad.github.io` repo may already have content
   - Recommendation: Check if `neoasaad/neoasaad.github.io` has existing content on the `main`
     branch. If yes, confirm with Asaad before force-pushing. If empty, proceed directly.

2. **Astro scaffold: create fresh vs manual setup**
   - What we know: `pnpm create astro@latest` produces a clean scaffold with `package.json`,
     `tsconfig.json`, and a minimal `src/pages/index.astro`
   - What's unclear: Whether to run the CLI wizard (interactive) or use `--template minimal --yes`
     flags to avoid prompts in an automated execution context
   - Recommendation: Use `pnpm create astro@latest . -- --template minimal --no-install` then
     run `pnpm install` separately for predictability

---

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` via Context7 — GitHub Pages deployment YAML, font API configuration, project structure, output: static reference
- `https://docs.astro.build/en/guides/deploy/github/` — GitHub Pages deployment guide (user page vs project page distinction confirmed)
- `https://docs.astro.build/en/guides/fonts/` — Font API with fontsource() provider, Font component usage
- `https://github.com/withastro/action` — withastro/action@v6.1.1 (released 2026-04-20), pnpm auto-detection confirmed
- `npm view astro version` — confirmed 6.1.10 is current as of 2026-04-29
- `curl https://api.github.com/repos/neoasaad/neoasaad.github.io` — user page repo confirmed exists
- `curl https://api.github.com/repos/neoasaad/Asaad_Webpage` — project page repo confirmed does NOT exist

### Secondary (MEDIUM confidence)
- `https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site` — GitHub Pages Actions source must be enabled before first deploy

### Tertiary (LOW confidence)
- Concurrency block pattern (Pitfall #2) — standard GitHub Actions convention, not from official withastro docs
- Fontsource exact catalog name matching requirement (Pitfall #5) — based on training knowledge

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry; astro 6.1.10 confirmed current
- Architecture: HIGH — workflow YAML sourced directly from official Astro docs; user page vs project page distinction confirmed via both official docs and live GitHub API check
- Pitfalls: HIGH for #1 (GitHub Pages source), #3 (lockfile), #4 (wrong repo); MEDIUM for #2 (concurrency); LOW for #5 (Fontsource name)

**Research date:** 2026-04-29
**Valid until:** 2026-05-30 (stable ecosystem; Astro 6.x minor versions won't break this)
