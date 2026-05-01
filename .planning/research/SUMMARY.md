# Project Research Summary

**Project:** Asaad Personal Website
**Domain:** Single-page personal/portfolio site — Data & AI professional, speaker, career coach
**Researched:** 2026-04-29
**Confidence:** HIGH

## Executive Summary

This is a single-page personal branding site whose primary job is converting recruiter and employer visits into contact. Research across all four dimensions converges on one clear architectural conclusion: build the simplest thing that ships fast, looks polished, and has zero runtime JavaScript except where strictly necessary. Astro 6 with static output is the correct framework choice — it delivers zero-JS-by-default, a native font API that eliminates Google Fonts CDN dependencies, and first-class GitHub Pages support via an official Actions workflow. The stack requires no component library, no CSS utility framework, and no content pipeline; the entire site is six components, two TypeScript data files, and one global stylesheet.

The most differentiating element of this site is the Values section — four clickable cards that reveal personal anecdotes. Done correctly (progressive disclosure with accordion behavior, proper ARIA, vanilla JS or details toggle), this is rare on professional sites and creates genuine human depth. Done incorrectly (generic corporate copy, no interaction affordance, or a React import that ships 45KB of runtime for a toggle), it actively hurts credibility. All research files agree: content quality and interaction correctness in this section have the highest return on investment.

The primary risks are all deployment and first-impression risks: a missing base config that breaks all assets on the first GitHub Pages push, a vague hero tagline that fails the "who is this person in 2 seconds" test, and a timeline that reads as a resume dump rather than a career narrative. These risks are easy to prevent if addressed in the correct phase — configuration before code, content finalized before component build, mobile tested at every step rather than at the end.

---

## Key Findings

### Recommended Stack

Astro 6 (specifically ^6.1.10, the latest stable) is the correct framework. It outputs static HTML by default (output: static), requires no adapter for GitHub Pages, and handles fonts natively via fontProviders.fontsource() — which self-hosts fonts at build time with no runtime CDN dependency. The package manager is pnpm; withastro/action@v6 auto-detects it from the lockfile, eliminating CI configuration overhead. Content lives in plain TypeScript arrays in src/data/ — content collections are for blogs and are inappropriate here.

**Core technologies:**
- **Astro 6** (^6.1.10): site framework — zero JS by default, static output, native font API, GitHub Pages workflow
- **pnpm 9+**: package manager — faster installs, CI auto-detected from pnpm-lock.yaml
- **Vanilla CSS + Astro scoped styles**: styling — co-located with components, no utility framework overhead at this scale
- **Inter Variable + Playfair Display** (via Astro Font API): typography — Inter for body (clean, modern), Playfair for headings (personality, contrast)
- **Web3Forms** (recommended over Formspree): contact form — 250 free submissions/month (5x Formspree), Cloudflare Turnstile spam protection, zero JS required
- **TypeScript data arrays** (src/data/timeline.ts, src/data/values.ts): content — typed, IDE-autocompleted, no content pipeline overhead

**Do not use:** Tailwind CSS, any React/Vue/Svelte island, content collections, @fontsource/* direct packages, Google Fonts link tags, or output: server mode.

### Expected Features

**Must have (table stakes) — missing any of these signals neglect to recruiters:**
- Clear name + role above the fold (visitor knows who this is in under 2 seconds)
- Professional headshot — humanizes the page; recruiters expect a face
- One-line value-proposition tagline (answers "who for and what value")
- Sticky navigation with anchor links (enables non-linear browsing/skimming)
- Mobile responsiveness (50-60% of professional site visits arrive on mobile)
- Sub-3-second page load (Astro static + optimized images makes this trivial)
- Visible LinkedIn link (recruiters cross-reference; absence raises suspicion)
- Contact form (primary reason for the site from a recruiter perspective)
- WCAG AA accessibility (4.5:1 contrast, keyboard nav, skip link, aria-expanded on cards)
- No broken links or placeholder content before launch

**Should have (differentiators — what gets remembered):**
- Story-first hero copy ("I help X do Y" not "Senior Data Scientist at Z")
- Progressive disclosure via clickable Values cards (overview layer plus story layer)
- Visual career timeline with "so what?" annotations per milestone (not a resume dump)
- Values with concrete personal anecdotes (50-100 words per story, specific to Asaad)
- Contextual CTAs per audience segment (hero CTA for recruiters, speaking section CTA for organizers)
- Scroll-triggered entrance animations with prefers-reduced-motion support
- Visible "last updated" or "currently" signal in footer

**Defer to v2+:**
- Blog / writing section
- Projects / portfolio gallery
- Dark mode toggle
- Social proof / testimonials section
- Content collections (relevant only when blog is added)

### Architecture Approach

The folder structure follows Astro single-page convention: one page at src/pages/index.astro, one layout at src/layouts/BaseLayout.astro, components at src/components/, data at src/data/, and a single src/styles/global.css for design tokens and reset. index.astro is purely a composition layer — it imports eight components and passes them through BaseLayout. No routing, no sub-pages, no content pipeline. Interactive behavior (Values card expand/collapse, mobile nav toggle, active nav link on scroll) is handled with either native details/summary HTML or short vanilla JS script blocks inside .astro components — Astro deduplicates bundled scripts automatically across instances.

**Major components:**
1. BaseLayout.astro — HTML shell, head metadata, global CSS import, font preloads
2. Header.astro — sticky nav with anchor links; vanilla JS for mobile hamburger and active state via IntersectionObserver
3. Hero.astro — name, tagline, headshot, primary CTA; static; no JS
4. Timeline.astro + TimelineItem.astro — iterates timeline.ts; semantic ol base; alternating desktop / stacked mobile layout
5. Values.astro + ValueCard.astro — iterates values.ts; details/summary or vanilla JS accordion; full ARIA (aria-expanded, aria-controls)
6. Contact.astro — HTML form with Web3Forms access key; fetch-based submission with inline success/error states; honeypot field
7. Footer.astro — static; copyright, social links, "last updated" signal

**CSS architecture:** Three layers — global.css (design tokens as CSS custom properties + reset), scoped style blocks per component (Astro auto-scopes; no BEM needed), and is:global only when genuinely necessary (sparingly).

### Critical Pitfalls

Research identified 8 CRITICAL pitfalls. The top 5 most likely to block deployment or hurt the primary audience:

1. **Missing or wrong base in astro.config.mjs** — When the repo is not named username.github.io, all /_astro/ paths 404 on deploy. Set site and base in the config before writing any code. The current repo name Asaad_Webpage requires base: /Asaad_Webpage (case-sensitive).

2. **GitHub Pages source not set to GitHub Actions** — The workflow runs successfully but the live URL shows nothing. Go to Settings -> Pages -> Source -> "GitHub Actions" before the first push.

3. **Vague hero value proposition** — A tagline that lists a title instead of communicating impact ("Senior Data Scientist" vs. "I help organizations navigate AI transformation") fails the primary conversion goal. Content must be finalized and reviewed before the hero component is built.

4. **Timeline reads as a resume dump** — More than 7 entries, no "so what?" annotation per milestone, no visual hierarchy between major and minor events equals a wall of text that recruiters skip. Enforce 5-7 curated milestones with one impact sentence each before building the component.

5. **React or Vue imported for the Values card toggle** — Shipping a 45KB+ framework runtime for a show/hide interaction is a performance and architectural failure. Use details/summary (zero JS) or a 10-line vanilla JS toggle. This decision must be locked before Phase 3 begins.

Additional critical pitfalls: no user feedback on form submit (double-sends, abandoned forms), desktop-only testing treated as an afterthought (mobile layout requires near-complete rebuild if not mobile-first), and font loading without font-display: swap (visible text reflow, CLS penalty).

---

## Implications for Roadmap

Based on the dependency graph in ARCHITECTURE.md and the phase-specific warnings in PITFALLS.md, four phases are the correct granularity for this project.

### Phase 1: Foundation and Deployment Pipeline

**Rationale:** PITFALLS.md is explicit — three of the five most critical pitfalls are Phase 1 configuration errors. If astro.config.mjs is wrong or GitHub Pages source is set incorrectly, no subsequent work matters. The deployment pipeline must be proven working before any UI is built.

**Delivers:**
- Verified GitHub repo with GitHub Pages source set to "GitHub Actions"
- astro.config.mjs with correct site, base: /Asaad_Webpage, and output: static
- Font configuration via Astro Font API (Inter Variable + Playfair Display)
- src/styles/global.css with full design token set (colors, typography scale in rem, spacing, max-width)
- BaseLayout.astro with head metadata, viewport meta tag, font preloads
- .github/workflows/deploy.yml using withastro/action@v6
- Empty index.astro that builds and deploys successfully to the live URL

**Addresses:** HTTPS (automatic on GitHub Pages), page load baseline, deployment pipeline
**Avoids:** Missing base config, wrong Pages source setting, px font sizes, missing viewport meta tag, font CLS

**Research flag:** No deeper research needed. ARCHITECTURE.md and STACK.md provide exact config snippets from official Astro docs.

---

### Phase 2: Static Sections (Hero, Timeline, Footer)

**Rationale:** Static sections with no interactivity should be built first. They establish the visual language, validate the data layer (src/data/timeline.ts), and ensure the hero content is locked before polish is added. PITFALLS.md warns that hero content must be finalized before building — this is a content-before-code phase gate.

**Delivers:**
- Finalized hero copy (tagline, value proposition, CTA text) — content review gate before component build
- Hero.astro — name, tagline, headshot with priority prop (eager load, prevents LCP penalty), CTA linking to #contact
- src/data/timeline.ts — 5-7 curated milestones with impact annotations
- Timeline.astro + TimelineItem.astro — semantic ol, alternating desktop layout, stacked mobile layout
- Footer.astro — copyright, LinkedIn link, "last updated" signal
- Mobile responsiveness verified at 375px for all sections in this phase

**Addresses:** Clear name + role above fold, LinkedIn visibility, career narrative (timeline), page load performance (hero image priority)
**Avoids:** Hero tagline vagueness (content gate), timeline resume dump (enforced 5-7 entries), hero image lazy loading, desktop-only testing

**Research flag:** No deeper research needed. Patterns are standard and well-documented.

---

### Phase 3: Interactive Layer (Values Cards, Header Nav)

**Rationale:** Interactivity built on a stable visual foundation. The Values section is the most complex and most differentiating — it needs the data (values.ts with final stories), the interaction mechanism decision (details vs. vanilla JS), and ARIA implementation all locked before starting. Header navigation is built last because it depends on section IDs that must already exist.

**Delivers:**
- Finalized values story content (50-100 words per value, concrete anecdote) — content review gate
- src/data/values.ts — 4 value objects with id, title, tagline (6-12 words), story
- ValueCard.astro — details/summary implementation (recommended) with CSS fade-in animation, prefers-reduced-motion respected, visual expand affordance (chevron/arrow)
- Values.astro — section wrapper, single-open accordion behavior enforced via vanilla JS if details multi-open behavior is insufficient
- Header.astro — sticky nav, mobile hamburger with aria-expanded, IntersectionObserver for active link state
- Keyboard navigation tested across all interactive elements (tab, enter, space)
- 44px minimum touch target size enforced on all interactive elements

**Addresses:** Values with personal anecdotes, progressive disclosure, mobile navigation, accessibility baseline (WCAG AA)
**Avoids:** React/Vue for a toggle (locked to vanilla JS/CSS), is:inline script duplication (standard Astro script used), generic values copy (content gate enforces specificity), hover-only reveals (tap-accessible on mobile)

**Research flag:** No deeper research needed. FEATURES.md and ARCHITECTURE.md provide the exact ARIA pattern and implementation options with tradeoffs.

---

### Phase 4: Contact Form, Polish, and Pre-Launch Audit

**Rationale:** Contact form implementation is isolated in Phase 4 because it has unique dependencies (Web3Forms account, access key, spam protection) and a distinct failure mode (form service pitfalls) that should not block earlier phases. Polish (scroll animations, active nav state, micro-interactions) is also deferred here — it is enhancement, not foundation. Pre-launch audit is the final gate.

**Delivers:**
- Web3Forms account setup, access key inline (public key model — safe to commit)
- Contact.astro — fetch-based form submission, inline success/error states, honeypot field, optional subject line field, email optional (anonymous-friendly)
- Scroll-triggered entrance animations (IntersectionObserver, opacity + translateY, 200-300ms) with prefers-reduced-motion kill switch
- Active nav link highlighting via IntersectionObserver
- Pre-launch audit: contrast checker on all text/background pairs, keyboard walkthrough, axe DevTools run, broken link check, mobile test at 375px and 414px, Lighthouse run (target 90+ all categories)
- og-image.png in public/ for social sharing previews

**Addresses:** Contact mechanism (primary recruiter requirement), scroll polish, social proof signal (OG image)
**Avoids:** No form submit feedback (fetch-based with explicit states), spam exhausting free tier (honeypot + Turnstile), contrast failures (pre-launch audit), animation overuse (one animation family, motion preference respected)

**Research flag:** Web3Forms integration is straightforward. If CORS issues arise during local dev, switch to Formspree (better-documented local testing behavior per PITFALLS.md). Decide at implementation time.

---

### Phase Ordering Rationale

- **Configuration before code** — three CRITICAL pitfalls are Phase 1 config errors that break everything built afterward. Proven deploy pipeline is the Phase 1 exit criterion.
- **Content before component** — hero copy and values stories must be written and approved before their components are built. PITFALLS.md identifies both as content failures that compound into design failures.
- **Static before interactive** — static sections validate the data layer and visual language; interactive sections build on that stable base.
- **Interactivity before polish** — the Values section interaction is a structural decision (component shape, ARIA pattern, data interface); animation is a polish layer that comes after.
- **Contact form isolated** — it has external service dependencies and its own failure modes; isolating it in Phase 4 prevents it from blocking Phases 2-3.
- **Mobile at every phase** — PITFALLS.md is explicit: mobile is not a Phase 4 concern. Each phase requires 375px verification before completion.

---

### Research Flags

**Phases with standard patterns — research-phase not needed:**
- **Phase 1:** Exact config and workflow snippets sourced directly from Astro official docs. No ambiguity.
- **Phase 2:** Static Astro components and TypeScript data arrays are entirely standard patterns.
- **Phase 3:** ARCHITECTURE.md provides both implementation options for ValueCard with complete code; FEATURES.md provides the exact ARIA pattern. No unknowns.

**Phases with a localized decision point — no full research-phase needed but flag the decision:**
- **Phase 4 (contact form):** Web3Forms vs. Formspree tradeoff is documented in FEATURES.md. Decision can be made at implementation time based on which service is simpler to set up from the live account. No research phase needed — just make the call and document it.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro version confirmed from npm registry; workflow and config sourced verbatim from official Astro docs via Context7. Font API, pnpm CI detection — all verified against live documentation. |
| Features | HIGH | Table stakes and anti-patterns draw from WCAG 2.1 (authoritative standard) and well-established UX research through 2024. Progressive disclosure and conversion copy patterns rated HIGH; micro-interaction specifics rated MEDIUM. |
| Architecture | HIGH | Folder structure, component breakdown, CSS layers, and data strategy sourced directly from Astro official documentation via Context7. Build sequence dependency graph is first-principles but unambiguous. |
| Pitfalls | HIGH | All CRITICAL deployment pitfalls verified against official Astro docs. Formspree/Web3Forms service behavior rated MEDIUM (training knowledge, not live docs fetch). WCAG contrast requirements HIGH (stable specification). |

**Overall confidence:** HIGH

### Gaps to Address

- **Exact repo URL and GitHub username for site config:** The config requires site: https://asaad101.sa and base: /Asaad_Webpage. Confirm the GitHub username and exact repo name are correct (they appear correct based on PITFALLS.md research which used neoasaad as the username).

- **Web3Forms vs. Formspree final selection:** Both are viable. FEATURES.md recommends Web3Forms for its higher free tier (250/month vs. 50/month) and Turnstile spam protection. Formspree is the safer fallback if documentation quality matters during Phase 4. Make this call at Phase 4 setup — no research phase needed.

- **Values stories content:** The Values section is the most differentiating element of the site, and research is unanimous that generic corporate copy destroys its value. The stories (Integrity, Empathy, Growth, Excellence) must be written by Asaad — concrete, anecdotal, specific — before Phase 3 begins. This is a content dependency, not a technical one.

- **Hero tagline final copy:** The tagline must be finalized before the Hero component is built in Phase 2. The copy decision has higher impact than any technical decision in this project.

- **Font pairing final approval:** Inter Variable + Playfair Display is rated MEDIUM confidence — a design judgment, not a technical constraint. If Asaad has a different preference, the swap is one config change in astro.config.mjs with no architectural impact.

---

## Sources

### Primary (HIGH confidence)
- Context7 /withastro/docs — Astro project structure, layouts, styling, font API, client directives, Islands, GitHub Pages deployment, configuration reference
- npm registry (live) — Astro 6.1.10 version confirmation
- WCAG 2.1 specification (https://www.w3.org/TR/WCAG21/) — contrast ratios, keyboard navigation, motion, heading hierarchy
- WAI-ARIA Authoring Practices 1.2 (https://www.w3.org/WAI/ARIA/apg/) — accordion and disclosure patterns, aria-expanded/aria-controls
- Apple Human Interface Guidelines — touch target sizes (44x44pt minimum)

### Secondary (MEDIUM confidence)
- Web3Forms documentation (https://web3forms.com/) — free tier limits, Turnstile integration
- Formspree documentation (https://help.formspree.io/) — free tier limits, honeypot field
- Nielsen Norman Group research — progressive disclosure, hero copy conversion patterns, personal site UX
- General UX and conversion research — story-first copy, contextual CTAs, social proof

---

*Research completed: 2026-04-29*
*Ready for roadmap: yes*
