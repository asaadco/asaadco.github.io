---
phase: 1
slug: foundation-and-deployment-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-29
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 1 is infrastructure only; validation is observational |
| **Config file** | n/a |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm preview` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm preview`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | SITE-01 | — | N/A | smoke | `pnpm build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | SITE-01 | — | N/A | smoke | `pnpm build` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | SITE-01 | — | N/A | manual | Push to main, observe Actions tab | n/a | ⬜ pending |
| 1-01-04 | 01 | 1 | SITE-01 | — | N/A | manual | Open `https://asaad101.sa` in browser | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` with pnpm + Astro 6 — Wave 0 creates this via `pnpm create astro`
- [ ] `astro.config.mjs` — Wave 0 creates this with correct site/output settings

*Existing infrastructure does not exist yet — this is a greenfield scaffold.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GitHub Actions workflow triggers on push | SITE-01 | Requires live GitHub push + Actions tab inspection | Push to main, open GitHub Actions tab, confirm deploy step completes green |
| Live URL loads with no 404s | SITE-01 | Requires live GitHub Pages deployment | Open `https://asaad101.sa` in browser, confirm placeholder page loads |
| No asset 404s in browser DevTools | SITE-01 | Requires live deployment + browser inspection | Open DevTools Network tab, reload page, confirm no 404 responses |
| GitHub Pages source set to GitHub Actions | SITE-01 | Requires manual repo settings change | Go to asaadco.github.io repo → Settings → Pages → Source → GitHub Actions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
