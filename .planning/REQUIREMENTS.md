# Requirements: Asaad Personal Website

**Defined:** 2026-04-29
**Core Value:** A recruiter or employer lands on the site and immediately understands who Asaad is, what he stands for, and why they should reach out — without having to dig.

## v1 Requirements

### Hero

- [ ] **HERO-01**: Visitor sees a full-viewport hero section with Asaad's name, professional title/tagline, and a clear sense of his identity
- [ ] **HERO-02**: Visitor can read a concise "About" narrative that conveys who Asaad is as a person and professional (not just credentials)

### Journey

- [ ] **JOUR-01**: Visitor can view a visual timeline of Asaad's career milestones in chronological order
- [ ] **JOUR-02**: Each timeline entry shows role, organization, and time period
- [ ] **JOUR-03**: Timeline is readable and well-laid-out on both mobile and desktop

### Values

- [ ] **VALS-01**: Visitor sees 4 value cards (Integrity, Empathy, Growth, Excellence) in an abstracted/collapsed view
- [ ] **VALS-02**: Clicking a value card reveals a short personal story written by Asaad
- [ ] **VALS-03**: The revealed story can be dismissed/collapsed to return to the card grid view

### Contact

- [ ] **CONT-01**: Visitor sees a contact section at the bottom of the page
- [ ] **CONT-02**: Visitor can fill in optional name, optional email, and a required message field
- [ ] **CONT-03**: Form has a submit button and is wired to a 3rd party service placeholder (e.g. Formspree action URL)
- [ ] **CONT-04**: Anonymous submission is supported (no personally-identifying field is required)

### Site (Global / Technical)

- [ ] **SITE-01**: Site is built with Astro and configured to deploy to GitHub Pages (github.io)
- [ ] **SITE-02**: Site loads in under 2 seconds on a typical broadband connection
- [ ] **SITE-03**: Site is fully mobile-responsive (works well on phones and tablets)
- [ ] **SITE-04**: Single-page scroll with smooth scrolling between sections
- [ ] **SITE-05**: Sticky/fixed navigation header with anchor links to each section

## v2 Requirements

Deferred to future release. Acknowledged but not in scope for v1.

### Content

- Blog/writing section — user did not select for v1; high effort, can be added later
- Projects/portfolio gallery — user focused on journey + values; can be phase 2

### Experience

- Dark mode toggle — nice to have, adds design complexity
- Analytics integration (e.g. Plausible or simple GA4) — useful post-launch

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend server / database | Static site only — no server infrastructure needed |
| Authentication / user accounts | Not applicable for a personal site |
| Multi-page routing | Deliberate single-page scroll design decision |
| Projects/portfolio gallery | User explicitly did not select for v1 |
| Blog/writing section | User did not select; adds significant content management scope |
| Real-time features | No backend — not applicable |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SITE-01 | Phase 1 | Pending |
| SITE-02 | Phase 1 | Pending |
| SITE-03 | — | Pending |
| SITE-04 | — | Pending |
| SITE-05 | — | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| JOUR-01 | Phase 3 | Pending |
| JOUR-02 | Phase 3 | Pending |
| JOUR-03 | Phase 3 | Pending |
| VALS-01 | Phase 4 | Pending |
| VALS-02 | Phase 4 | Pending |
| VALS-03 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| CONT-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-29*
*Last updated: 2026-04-29 after initial definition*
