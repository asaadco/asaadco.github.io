# Asaad Personal Website

## What This Is

A minimalistic, single-page personal website for Asaad — a Data & AI professional, inspirational speaker, and technical career coach. The site showcases who he is, his professional journey, his core values (with personal stories), and provides a contact form. Built with Astro and hosted on GitHub Pages.

## Core Value

A recruiter or employer lands on the site and immediately understands who Asaad is, what he stands for, and why they should reach out — without having to dig.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Visitor sees a compelling hero section with Asaad's identity and professional tagline
- [ ] Visitor can scroll through a visual timeline of Asaad's career milestones
- [ ] Visitor can click each of the 4 values (Integrity, Empathy, Growth, Excellence) to read a personal story
- [ ] Visitor can send an anonymous message via a contact form (placeholder for 3rd party service)
- [ ] Site loads fast, looks professional, and is mobile-responsive

### Out of Scope

- Backend/server-side logic — static site only; contact form uses 3rd party placeholder
- Blog/writing section — not in v1 (user didn't select it)
- Projects/portfolio gallery — user focused on experience + values, not project showcase
- Authentication / user accounts — not applicable
- Multi-page routing — single-page scroll design

## Context

- Framework: Astro (chosen for modular content management and static output)
- Hosting: GitHub Pages (github.io, no server costs)
- Design: Light, clean, professional with elegant typography
- Interaction: Progressive disclosure — content abstracted, revealed on scroll/click
- Audience: Primary = employers & recruiters; secondary = speaking organizers, coaching clients

## Constraints

- **Tech Stack**: Astro + GitHub Pages — no dynamic backend
- **Content**: All written content (value stories, bio, timeline entries) provided by user
- **Contact form**: Placeholder integration only (e.g. Formspree action URL commented out)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page scroll | Progressive disclosure, minimal navigation friction | — Pending |
| Astro framework | Modular content management, static output, GitHub Pages compatible | — Pending |
| Light/clean aesthetic | Professional credibility for employer audience | — Pending |
| Values as clickable cards | Personal stories add human depth without cluttering the page | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-29 after initialization*
