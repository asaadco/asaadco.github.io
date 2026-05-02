---
phase: 2
slug: static-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-01
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pnpm build (Astro static build) + manual browser/responsive check |
| **Config file** | astro.config.mjs |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm preview` |
| **Estimated runtime** | ~15 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm preview` and manually verify in browser at 375px
- **Before `/gsd-verify-work`:** Full build must be green; manual responsive check at 375px completed
- **Max feedback latency:** ~15 seconds (build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | SITE-04, SITE-05 | — | N/A | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | HERO-01, HERO-02 | — | N/A | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | HERO-01 | — | N/A | manual | Verify 100vh hero at 375px | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | JOUR-01, JOUR-02, JOUR-03 | — | N/A | build | `pnpm build` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | JOUR-03 | — | N/A | manual | Verify timeline responsive at 375px vs 768px+ | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework install needed — Astro build and manual browser verification are the validation strategy for this static frontend phase.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero renders at 100vh with no horizontal overflow at 375px | HERO-01 | CSS visual check — no automated renderer in this stack | Open http://localhost:4321 at 375px width in DevTools; hero must fill viewport, no scrollbar |
| About narrative readable in hero section | HERO-02 | Content layout check | Verify 2 paragraphs visible in hero below tagline |
| Timeline center-stem desktop layout (≥768px) | JOUR-01, JOUR-03 | Visual layout — CSS grid alternating sides | At 768px+, verify alternating left/right entries with center vertical line |
| Timeline collapses to single-column at <768px | JOUR-03 | CSS responsive breakpoint | At 375px, verify all entries stack left-aligned with left-edge vertical line |
| Sticky nav remains visible while scrolling | SITE-05 | Browser scroll behavior | Scroll full page; nav must stay at top viewport |
| Smooth scroll on anchor click | SITE-04 | Browser scroll behavior | Click "Journey" nav link; verify smooth scroll (no instant jump) |
| No horizontal overflow at 375px (all sections) | JOUR-03, HERO-01 | Visual check | At 375px, verify no horizontal scrollbar on any section |
| scroll-padding-top prevents nav overlap on anchor jump | SITE-04, SITE-05 | Browser anchor behavior | Click "#journey"; section heading must not be hidden behind nav |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
