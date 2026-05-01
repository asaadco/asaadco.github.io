# Roadmap: Asaad Personal Website

**Generated:** 2026-04-29
**Milestone:** v1 — Launch
**Phases:** 4
**Requirements:** 17 v1 requirements

---

## Phases

- [x] **Phase 1: Foundation and Deployment Pipeline** - Proven Astro scaffold deploys to GitHub Pages live URL
- [ ] **Phase 2: Static Sections** - Hero, timeline, and footer visible and responsive on the live site
- [ ] **Phase 3: Interactive Layer** - Values cards expand/collapse and sticky nav works across breakpoints
- [ ] **Phase 4: Contact, Polish, and Launch** - Contact form submits, site passes Lighthouse audit, and ships

---

## Phase Overview

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Foundation and Deployment Pipeline | 3/3 | Complete    | 01-01 ✓, 01-02 ✓, 01-03 ✓ |
| 2 | Static Sections | Hero, professional timeline, and footer rendered on the live URL, mobile-responsive at 375px, with navigation structure in place | HERO-01, HERO-02, JOUR-01, JOUR-02, JOUR-03, SITE-04, SITE-05 | TBD |
| 3 | Interactive Layer | Values cards expand and collapse with ARIA and keyboard support; sticky header nav operates correctly on all breakpoints | VALS-01, VALS-02, VALS-03 | TBD |
| 4 | Contact, Polish, and Launch | Contact form accepts and submits messages, site is fully responsive and performant, and passes pre-launch audit | CONT-01, CONT-02, CONT-03, CONT-04, SITE-02, SITE-03 | TBD |

---

## Phase Details

### Phase 1: Foundation and Deployment Pipeline

**Goal:** Astro 6 project scaffolded with correct GitHub Pages base config and CI/CD pipeline, proven by a successful deploy to the live URL before any UI is built.
**Depends on:** Nothing (first phase)
**Requirements:** SITE-01
**Success Criteria** (what must be TRUE):
  1. Running `pnpm build` locally produces a `dist/` directory with no errors
  2. Pushing to `main` triggers the GitHub Actions workflow and the deploy step completes successfully
  3. The live GitHub Pages URL (`https://asaad101.sa`) loads the placeholder page with no 404 asset errors
  4. `astro.config.mjs` has `site: "https://asaad101.sa"` and `output: "static"` set correctly (NO `base` property — user page repo)

> **Note (2026-04-29 plan):** Earlier drafts of criteria #3 and #4 referenced `base: /Asaad_Webpage` and the URL `https://asaad101.sa/Asaad_Webpage`. CLAUDE.md (authoritative) and the most recent commit `7cf0fe8` corrected this — the project deploys to a user page repo (`asaadco/asaadco.github.io`) at the root URL with NO `base`. Criteria above reflect the corrected, authoritative configuration.

**Plans:** 3/3 plans executed
- [x] 01-01-PLAN.md — Scaffold Astro 6 project with locked config (astro.config.mjs, Layout, placeholder index, global.css)
- [x] 01-02-PLAN.md — Create GitHub Actions workflow `.github/workflows/deploy.yml` (withastro/action@v6 + deploy-pages@v5)
- [x] 01-03-PLAN.md — Configure git remote, push to main, enable Pages source, verify live deploy

**UI hint**: no

---

### Phase 2: Static Sections

**Goal:** Visitor can see a compelling hero section, scroll through a visual career timeline, and reach the footer — all rendered on the live URL and verified responsive at 375px.
**Depends on:** Phase 1
**Requirements:** HERO-01, HERO-02, JOUR-01, JOUR-02, JOUR-03, SITE-04, SITE-05
**Success Criteria** (what must be TRUE):
  1. Visitor sees Asaad's name, professional tagline, and About narrative above the fold without scrolling past the hero
  2. Visitor can scroll through a timeline showing 5-7 career milestones, each with role, organization, time period, and one impact annotation
  3. Sticky navigation header is visible at the top of the viewport as the visitor scrolls, with anchor links to each section
  4. Smooth scrolling navigates to the correct section when a nav anchor is clicked
  5. All sections in this phase render correctly at 375px viewport width with no horizontal overflow
**Plans:** TBD
**UI hint**: yes

---

### Phase 3: Interactive Layer

**Goal:** Visitor can click any of the four value cards to read Asaad's personal story, collapse it, and navigate the site with a fully accessible sticky header — including on mobile.
**Depends on:** Phase 2
**Requirements:** VALS-01, VALS-02, VALS-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees four value cards (Integrity, Empathy, Growth, Excellence) in collapsed/abstracted form by default
  2. Clicking a value card expands it to reveal Asaad's personal story for that value
  3. The expanded story can be dismissed by clicking the card again, returning to the collapsed card grid
  4. All card interactions are keyboard-accessible (Tab to focus, Enter/Space to toggle) with correct `aria-expanded` state
  5. Mobile hamburger menu opens and closes the nav without page jump or layout shift
**Plans:** TBD
**UI hint**: yes

---

### Phase 4: Contact, Polish, and Launch

**Goal:** Visitor can send an anonymous message via the contact form, scroll animations are in place, and the site passes a Lighthouse and accessibility audit before the final push to production.
**Depends on:** Phase 3
**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04, SITE-02, SITE-03
**Success Criteria** (what must be TRUE):
  1. Visitor can fill in a message (required) with optional name and optional email, and submit it — seeing a success confirmation inline without a page reload
  2. Visitor can submit the form without providing any personally-identifying information (anonymous submission supported)
  3. Site loads in under 2 seconds on a broadband connection (verified via Lighthouse performance score 90+)
  4. Site displays correctly with no layout breakage on a 375px phone screen and a 768px tablet screen
  5. Lighthouse accessibility and best-practices scores each reach 90+ with no WCAG AA contrast failures
**Plans:** TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Deployment Pipeline | 3/3 | Complete | 2026-05-01 |
| 2. Static Sections | 0/? | Not started | - |
| 3. Interactive Layer | 0/? | Not started | - |
| 4. Contact, Polish, and Launch | 0/? | Not started | - |

---

*Roadmap created: 2026-04-29*
*Phase 1 planned: 2026-04-29*
