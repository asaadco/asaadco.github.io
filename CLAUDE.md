# Asaad Personal Website — Project Guide

## Project

A minimalistic, single-page personal website for Asaad — Data & AI professional, inspirational speaker, and technical career coach. Built with Astro 6, hosted on GitHub Pages.

**Core Value:** A recruiter or employer lands on the site and immediately understands who Asaad is, what he stands for, and why they should reach out — without having to dig.

## GSD Workflow

This project uses the Get Shit Done (GSD) planning system.

### Planning artifacts

| Artifact | Location |
|----------|----------|
| Project context | `.planning/PROJECT.md` |
| Configuration | `.planning/config.json` |
| Research | `.planning/research/` |
| Requirements | `.planning/REQUIREMENTS.md` |
| Roadmap | `.planning/ROADMAP.md` |
| Project state | `.planning/STATE.md` |

### Workflow commands

```
/gsd-discuss-phase [N]   — Gather context before planning a phase
/gsd-plan-phase [N]      — Create execution plan for a phase
/gsd-execute-phase [N]   — Execute a planned phase
/gsd-verify-work         — Verify phase deliverables
/gsd-progress            — Show current project status
```

### Mode: YOLO

Auto-approve plans and execute without confirmation gates.

### Workflow agents enabled

- Research before planning: **Yes**
- Plan check: **Yes**
- Verifier after execution: **Yes**

## Tech Stack

- **Framework:** Astro 6 (static output, `output: 'static'`)
- **Package manager:** pnpm
- **Styling:** Vanilla CSS with scoped component styles + `src/styles/global.css` for design tokens
- **Fonts:** Astro native Font API (`fontProviders.fontsource()`) — Inter Variable + Playfair Display
- **Hosting:** GitHub Pages via `withastro/action@v6` GitHub Actions workflow
- **Contact form:** Web3Forms (placeholder — add access key before launch)
- **No component framework** — vanilla Astro components + vanilla JS for interactions

## Site Structure

Single-page scroll. Sections in order:

1. **Hero** — Name, tagline, professional identity
2. **About** — Human narrative (who Asaad is beyond credentials)
3. **Journey** — Visual career timeline (5-7 milestones)
4. **Values** — 4 interactive cards: Integrity, Empathy, Growth, Excellence
5. **Contact** — Anonymous-friendly message form

## Key Configuration Notes

- `astro.config.mjs` must set `site: 'https://neoasaad.github.io'` — no `base` needed (user page repo)
- GitHub Pages source must be set to **GitHub Actions** in repo settings (not `gh-pages` branch)
- Internal `href` attributes do NOT need a base path prefix (root deployment)

## Phase Roadmap

| # | Phase | Goal |
|---|-------|------|
| 1 | Foundation & Deployment | Proven Astro scaffold deploys to live GitHub Pages URL |
| 2 | Static Sections | Hero, timeline, footer visible and responsive on live site |
| 3 | Interactive Layer | Values cards + sticky nav working with full accessibility |
| 4 | Contact, Polish & Launch | Form, performance, Lighthouse audit, launch |

## Content Dependencies

The following content must be provided by Asaad before the relevant phase begins:

- **Phase 2:** Hero tagline (1 sentence), About narrative (2-3 paragraphs), timeline entries (role, org, dates, 1-2 sentence impact statement each)
- **Phase 3:** Values stories (50-100 words each for Integrity, Empathy, Growth, Excellence), 6-12 word hook per value card

## Development Principles

- No component framework (React/Vue/Svelte) — vanilla Astro + CSS + vanilla JS only
- Progressive disclosure: content abstracted until scroll/click reveals it
- Mobile-first: test at 375px before marking any section complete
- Accessibility: `aria-expanded`, keyboard navigation, WCAG AA contrast minimum
- Zero client-side JS hydration for static content (no `client:load` on below-fold components)
