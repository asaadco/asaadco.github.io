# Pitfalls Research: Asaad Personal Website

**Domain:** Astro static personal site on GitHub Pages
**Researched:** 2026-04-29
**Overall confidence:** HIGH (all critical claims verified against official Astro docs via Context7)

---

## Deployment Pitfalls (Astro + GitHub Pages)

### CRITICAL: Missing or Wrong `base` in `astro.config.mjs`

**What goes wrong:** When the repository is named anything other than `<username>.github.io`, GitHub Pages hosts the site at `https://<username>.github.io/<repo-name>/`. Without setting `base: '/<repo-name>'` in `astro.config.mjs`, every asset path (`/_astro/...`, `/favicon.svg`, etc.) resolves to the root and returns 404. The site appears to load but is visually broken — no styles, no images, broken fonts.

**Why it happens:** Developers test locally at `localhost:4321` where there is no subpath, then deploy without matching the production URL structure.

**Consequences:** Blank or unstyled page on first deploy. All scripts, styles, and images fail to load.

**Prevention:** Set both `site` and `base` before the first deploy:
```js
// astro.config.mjs
export default defineConfig({
  site: 'https://neoasaad.github.io',
  base: '/Asaad_Webpage',  // exact repo name, case-sensitive
});
```
Exception: If the repo is renamed to `neoasaad.github.io`, omit `base` entirely — GitHub Pages serves it from root.

**Warning signs:** All `/_astro/` paths return 404 in browser DevTools Network tab after deploy.

**Phase to address:** Phase 1 (project setup), before any deploy attempt.

---

### CRITICAL: Internal Links Not Updated for Base Path

**What goes wrong:** After setting `base`, hardcoded internal links like `<a href="/about">` or `<img src="/images/photo.jpg">` still point to the root and 404 on GitHub Pages. Only Astro's own bundled asset paths are automatically rewritten by the `base` config — your explicit `href` and `src` attributes are not.

**Why it happens:** The `base` config rewrites Astro-processed references but cannot rewrite arbitrary strings in templates.

**Prevention:** Use `import.meta.env.BASE_URL` for internal links, or prefix all explicit paths with the base:
```astro
<a href={`${import.meta.env.BASE_URL}about`}>About</a>
<img src={`${import.meta.env.BASE_URL}images/photo.jpg`} />
```
For same-page anchor links (`#contact`, `#values`), no prefix is needed — they are fragment-only and are unaffected.

**Warning signs:** Broken links/images in production but not in local dev.

**Phase to address:** Phase 1 (initial setup), verify in Phase 2 (first deploy checkpoint).

---

### CRITICAL: GitHub Pages Source Set to Wrong Branch/Folder

**What goes wrong:** GitHub Pages repository settings default to deploying from a branch (e.g., `main` root or `gh-pages`), not from GitHub Actions. If you use the `withastro/action` workflow but forget to change the Pages source to "GitHub Actions" in the repository settings, the live site is either empty or shows a different commit.

**Why it happens:** Two deployment methods exist (branch deploy and Actions deploy). The UI default is the legacy branch method.

**Prevention:** In the GitHub repo: Settings → Pages → Source → select "GitHub Actions". Do this once before the first workflow run.

**Warning signs:** GitHub Actions workflow runs successfully but the deployed URL shows either a blank page or an older version of the site.

**Phase to address:** Phase 1, documented in the deploy checklist.

---

### MODERATE: Missing `.nojekyll` File

**What goes wrong:** GitHub Pages historically uses Jekyll to process sites. Any directory or file beginning with an underscore (like Astro's `_astro/` output folder) is ignored by Jekyll by default. Without a `.nojekyll` marker file, the entire `_astro/` directory — which contains all bundled JS and CSS — is invisible to GitHub Pages and returns 404.

**Why it happens:** The `withastro/action` GitHub Actions workflow automatically adds `.nojekyll` to the output. But if deploying manually (e.g., copying `dist/` to a `gh-pages` branch), the file must be added manually.

**Prevention:** If using the official `withastro/action@v3` workflow, this is handled automatically. If deploying manually, add an empty `.nojekyll` file to the root of the deployed directory.

**Warning signs:** Styles load locally but all `_astro/` requests 404 in production.

**Phase to address:** Phase 1 (deploy setup). Non-issue if using the official Astro GitHub Actions workflow.

---

### MODERATE: Workflow Permissions Missing

**What goes wrong:** The GitHub Actions workflow needs explicit permissions to write to GitHub Pages. Without the correct permissions block, the deploy step fails with an authorization error.

**Prevention:** The workflow must include:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```
The official `withastro/action` template includes these. Do not strip them.

**Warning signs:** Workflow fails at the "Deploy to GitHub Pages" step with a 403 or permissions error.

**Phase to address:** Phase 1 (workflow setup).

---

### MINOR: Pushing to Non-`main` Branch Does Not Deploy

**What goes wrong:** The workflow trigger defaults to `push: branches: [main]`. Feature branch pushes do not trigger a deploy, which is correct behavior — but developers are sometimes surprised when a branch push does not update the live site.

**Prevention:** Understand this is expected. Use `workflow_dispatch` in the workflow to allow manual deploys from any branch during testing.

**Phase to address:** Phase 1. Document in the team workflow notes.

---

## Performance Pitfalls

### CRITICAL: Using `client:load` for Non-Essential Interactive Components

**What goes wrong:** Every component with `client:load` has its JavaScript fetched, parsed, and executed immediately on page load, regardless of whether the user ever sees or interacts with it. Applying `client:load` to things like value cards (which could be below the fold) or a contact form means shipping unnecessary JS on initial load, directly hurting Time to Interactive and Lighthouse score.

**Why it happens:** `client:load` is the most obvious directive — developers use it by default without understanding the alternatives.

**Consequences:** Larger JS bundle, slower TTI, lower Lighthouse performance score. For a personal site targeting employers, a poor Lighthouse score is a credibility liability.

**Prevention:** Match the hydration directive to the actual need:
- `client:visible` — components below the fold (value cards, timeline, contact form). JavaScript is not even fetched until the user scrolls near the element.
- `client:idle` — components that need interactivity but are not urgent (non-critical UI).
- `client:load` — only for components the user will interact with immediately above the fold.
- **No directive (static)** — if the "interactivity" can be achieved with CSS alone (hover effects, focus styles, `:has()` selectors), do not add a client directive at all.

**Warning signs:** Lighthouse TTI score above 3 seconds. Network tab shows multiple JS chunks loading on initial page load.

**Phase to address:** Phase 2 (component build). Re-audit in performance review phase.

---

### CRITICAL: Reaching for a JS Framework When CSS Is Sufficient

**What goes wrong:** For a personal site, the value card "click to reveal story" interaction, smooth scroll, and hover states on timeline items are all achievable with CSS (`:checked` + sibling selectors, `details`/`summary`, CSS `@keyframes`, `scroll-behavior: smooth`). Adding React or Vue just for these interactions brings a 40-100KB framework runtime to a site that needs none of it.

**Why it happens:** Familiarity with framework components leads developers to default to them even when the use case does not require a reactive runtime.

**Prevention:** Default to zero-framework Astro components with vanilla `<script>` tags. Only reach for a framework component when you genuinely need client-side state that CSS cannot express. For the values cards specifically: use `<details>`/`<summary>` or a vanilla JS toggle — no framework required.

**Warning signs:** `node_modules` contains React/Vue/Svelte. `<script>` tags include full framework bundles.

**Phase to address:** Phase 2 (architecture decision). The stack should be confirmed as CSS + vanilla JS only before building interactive sections.

---

### MODERATE: Hero Image Not Marked as `priority`

**What goes wrong:** Astro's `<Image>` component defaults to `loading="lazy"` and `decoding="async"`. For above-the-fold images (like a hero profile photo), lazy loading causes a blank space while the image loads, directly harming Largest Contentful Paint (LCP).

**Prevention:** Any image visible without scrolling must use the `priority` prop:
```astro
<Image src={profilePhoto} alt="Asaad" priority />
```
This sets `loading="eager"`, `decoding="sync"`, and `fetchpriority="high"`.

**Warning signs:** LCP element in Lighthouse is an image with a long load time. DevTools shows the hero image loading late in the waterfall.

**Phase to address:** Phase 2 (hero section build).

---

### MODERATE: Loading Too Many Font Variants

**What goes wrong:** Each font weight and style (Regular, Medium, SemiBold, Italic, etc.) is a separate HTTP request and payload. Importing a font family with 6+ weights on a personal site that uses 2-3 weights adds unnecessary bytes and render-blocking requests.

**Prevention:** Limit to 2-3 font variants maximum (e.g., 400 for body, 600 for headings, optionally 300 for light accent text). Use Astro's built-in font optimization with `preload` only for the variants actually used:
```astro
<Font cssVariable="--font-inter" preload={[{ weight: "400" }, { weight: "600" }]} />
```
Alternatively use a variable font (single file covers all weights).

**Warning signs:** Network tab shows 4+ font files loading. Google Fonts `@import` with multiple weights in the query string.

**Phase to address:** Phase 1 (design system / typography choices).

---

### MINOR: Unused CSS in Global Stylesheet

**What goes wrong:** A large global CSS file with utility classes or reset styles that are not used bloats the stylesheet. Astro scopes component styles automatically, but any `is:global` styles or imported `.css` files bypass scoping and are included in full.

**Prevention:** Keep global styles to a minimal reset + CSS custom properties (design tokens). All component-specific styles go inside the component's `<style>` block where Astro automatically tree-shakes them.

**Phase to address:** Phase 1 (design system setup), maintain throughout.

---

## Design / UX Pitfalls

### CRITICAL: No Clear Value Proposition Above the Fold

**What goes wrong:** The hero section shows a name and photo but the tagline is vague ("Data professional"), buried, or missing. A recruiter landing on the page cannot immediately answer "what does this person do and why should I care?" without scrolling.

**Why it happens:** Designers focus on aesthetics (nice photo, clean layout) and treat the tagline as an afterthought.

**Prevention:** The hero section must answer three questions in one glance: Who (name + role), What (specific expertise — "Data & AI | Speaker | Career Coach"), Why reach out (a single sharp value proposition sentence). This content must be above the fold at 1280px viewport.

**Warning signs:** User testing shows visitors scroll past the hero without reading the tagline. Recruiter feedback is "I had to look around to understand what you do."

**Phase to address:** Phase 2 (hero section), content must be finalized before build.

---

### CRITICAL: Timeline That Reads as a Resume Dump

**What goes wrong:** A visual timeline with 8-12 bullet-point entries becomes a wall of text. The "visual" element (connecting lines, dots) draws attention but the content is just a formatted LinkedIn. It adds no insight.

**Prevention:** Each timeline entry should answer "so what?" — not just job title and dates, but one-sentence impact or notable achievement. Limit to 5-7 milestone entries maximum. If all entries look the same (same visual weight, same text length), the timeline has no hierarchy and recruiters read none of it.

**Warning signs:** More than 7 timeline entries. Each entry is longer than 3 lines. No visual differentiation between major milestones and minor ones.

**Phase to address:** Phase 3 (timeline build), enforce in content review.

---

### MODERATE: Values Cards That Feel Generic

**What goes wrong:** Four cards labeled "Integrity, Empathy, Growth, Excellence" with one-sentence definitions read as corporate cliche. Every professional website uses the same four values. Without specific personal stories, the section has zero differentiation value.

**Prevention:** The story revealed on click must be concrete, specific, and anecdotal — not a paragraph of abstract principles. "The time I [specific situation] and chose [specific action] because I believe [value]" is the structure to aim for. Verify content is ready before building the toggle mechanism.

**Warning signs:** Stories use words like "strive," "leverage," or "synergy." Stories are under 3 sentences. Stories could apply to any professional in any industry.

**Phase to address:** Content review before Phase 3 (values section build).

---

### MODERATE: Overuse of Animation Causing Cognitive Noise

**What goes wrong:** Scroll-triggered animations on every section, combined with card hover animations, transition effects, and a parallax hero, create constant visual motion. The eye never settles. Professional sites for a senior professional audience need restraint.

**Prevention:** Animation budget: one entrance animation per section (simple fade-in or slide-up, 200-300ms), hover states for interactive elements only, no parallax. If the reduced motion media query is not respected (`@media (prefers-reduced-motion: reduce)`), the site is inaccessible to users with vestibular disorders.

**Warning signs:** More than two distinct animation types on any screen. Motion playing on elements the user is not interacting with. No `prefers-reduced-motion` handling.

**Phase to address:** Phase 3-4 (polish / animation pass).

---

### MODERATE: Light Text on Light Background (Contrast Failure)

**What goes wrong:** A clean, minimal aesthetic often leads to very light gray text on white — or white text on a barely-off-white card. This fails WCAG AA contrast requirements (minimum 4.5:1 for normal text) and is hard to read in bright environments.

**Prevention:** Test every text/background combination with a contrast checker before the design is locked. For body text, `#374151` on white is safe (9.7:1). Avoid text lighter than `#6B7280` on white backgrounds. Decorative text (labels, metadata) can be lighter but should still meet 3:1.

**Warning signs:** Any text that "looks fine on my calibrated monitor" but fails a contrast checker. Color palette tokens set once and never tested against each other.

**Phase to address:** Phase 1 (design system), enforce throughout.

---

### MINOR: No Active State on the Sticky Navigation

**What goes wrong:** Single-page scroll sites often have a sticky navigation. If the nav links do not update to show which section the user is currently in, the navigation feels disconnected from the page content.

**Prevention:** Use `IntersectionObserver` to add an `active` class to the nav link corresponding to the visible section. This is a small amount of vanilla JS — no framework needed.

**Phase to address:** Phase 4 (navigation polish).

---

## Interactive Component Pitfalls

### CRITICAL: Importing a React/Vue Component for a Simple Toggle

**What goes wrong:** The values cards need to show/hide a story on click. Using a React component with `useState` for this — and adding `client:load` or `client:visible` — ships an entire React runtime (45KB+ gzipped) for what is a 10-line JavaScript problem.

**Prevention:** Use one of these zero-framework approaches:
1. Native HTML `<details>` and `<summary>` — zero JS, accessible by default, styleable with CSS.
2. A vanilla JS toggle in an Astro `<script>` tag — Astro bundles this as a native ES module, no framework overhead.
3. CSS `:has()` + hidden checkbox hack — zero JS, but harder to style consistently.

Only reach for a framework component if you need cross-component state sharing, complex derived state, or real-time data — none of which apply to a toggle card.

**Warning signs:** `import { useState } from 'react'` anywhere in the project. A framework package in `dependencies`.

**Phase to address:** Phase 2 (architecture), before any component is built.

---

### CRITICAL: `client:only` on Components That Can Be Server-Rendered

**What goes wrong:** `client:only` tells Astro to skip server rendering entirely. This means the component produces no HTML during the build — the page has an empty hole until JavaScript executes. For a personal site, this eliminates the SEO content of whatever section uses `client:only`, and makes the page visually incomplete until JS loads.

**Prevention:** Never use `client:only` for content that should be indexed (hero text, timeline, values). Use it only for components that are genuinely browser-environment-dependent (components using `window`, `localStorage`, third-party widgets). Most interactive components can use `client:visible` instead, which still server-renders HTML and hydrates when visible.

**Warning signs:** A section is invisible until JS loads on slow connections. Lighthouse SEO audit shows missing indexable content.

**Phase to address:** Phase 2 (component build).

---

### MODERATE: Vanilla Script Running Before DOM Is Ready

**What goes wrong:** Astro bundles `<script>` tags as ES modules and injects them with `type="module"`, which defers execution by default. However, code in an inline `<script is:inline>` tag runs immediately and can fail if it queries DOM elements that haven't rendered yet.

**Prevention:** For Astro component scripts (without `is:inline`), DOM is always ready when the script runs. For `is:inline` scripts, wrap in `document.addEventListener('DOMContentLoaded', ...)`. Prefer the standard Astro `<script>` (no `is:inline`) — it is processed, deduplicated, and runs after the DOM is ready.

**Warning signs:** `Cannot read properties of null` errors in the console for `document.querySelector` calls.

**Phase to address:** Phase 2-3 (any section with vanilla JS interaction).

---

### MODERATE: Multiple Component Instances Running the Same Global Script

**What goes wrong:** In Astro, a regular `<script>` tag is bundled once and shared across instances. But `<script is:inline>` is duplicated for every instance of the component. If a values card component uses `is:inline` for its toggle script, four cards on the page means the same event listener is registered four times, causing bugs.

**Prevention:** Use standard Astro `<script>` (not `is:inline`) for component interactivity. Astro deduplicates and bundles these. If you need per-instance script behavior, use `document.querySelectorAll` or custom elements.

**Phase to address:** Phase 3 (values cards section).

---

## Contact Form Pitfalls

### CRITICAL: Embedding Formspree/Web3Forms Endpoint URL Directly in HTML

**What goes wrong:** Contact form endpoints (e.g., `https://formspree.io/f/xabcdef`) are visible in the page source. Bots crawl and harvest these endpoints for spam. Formspree's free tier allows 50 submissions/month — a single spam campaign can exhaust this quota in minutes.

**Why it happens:** All tutorials show the endpoint URL directly in the `action` attribute.

**Consequences:** Free tier quota exhausted by spam. Inbox flooded with garbage submissions.

**Prevention (layered approach):**
1. Enable Formspree's built-in spam filtering (reCAPTCHA or honeypot) — free tier supports both.
2. Add a honeypot field (a visually hidden input that humans leave blank but bots fill):
```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
```
Formspree ignores submissions where `_gotcha` is filled. This is zero-cost spam protection.
3. Optionally use a JavaScript fetch POST so the endpoint is not in a visible HTML `action` attribute — though determined bots can still find it in the JS bundle.

**Warning signs:** Receiving submissions with no message content or gibberish content within days of launch.

**Phase to address:** Phase 4 (contact form implementation).

---

### CRITICAL: No User Feedback on Form Submit

**What goes wrong:** The form submits, the page either does nothing or reloads, and the user has no confirmation their message was sent. They submit again. Duplicate messages arrive. Or they assume it is broken and give up.

**Prevention:** Use a `fetch`-based submission (not a plain HTML `action` form submit) so you can intercept the response and show inline success/error states without page reload. Minimum UX:
- Disable submit button during submission to prevent double-sends.
- Show a success message ("Message sent — I'll get back to you shortly.") on 200 response.
- Show an error message with guidance on non-200 response.
- Reset the form fields on success.

**Warning signs:** Form submits with a full page navigation. No visible state change after clicking submit.

**Phase to address:** Phase 4 (contact form implementation).

---

### MODERATE: Form Validation Only on the Frontend

**What goes wrong:** HTML5 `required` attributes and `type="email"` validation are bypassed by bots. Without server-side validation (handled by Formspree/Web3Forms) and without client-side UX-level validation messages, users can accidentally submit partial forms.

**Prevention:** Add explicit `required` to all fields. Validate email format client-side (`type="email"` plus a JS check before fetch). Rely on Formspree for server-side enforcement. Show inline field-level error messages, not just a generic "please fill all fields" alert.

**Phase to address:** Phase 4 (contact form).

---

### MODERATE: Formspree Free Tier Limits Not Anticipated

**What goes wrong:** Formspree free tier: 50 submissions/month, 1 form, no file uploads, no integrations beyond email. If the contact form is successful (high traffic speaking engagement, viral post), this limit can be hit in a few days. No submissions are queued — they are silently dropped once the limit is reached.

**Prevention:** Document the limit in the project. For a personal site, 50/month is usually sufficient. But plan the upgrade path: Formspree Gold is $8/month for 1000 submissions. Web3Forms free tier is more generous (250 submissions/month). Decide which service to use based on realistic expected volume.

**Warning signs:** Formspree dashboard shows approaching the monthly limit. Contacts reporting they "sent a message but got no reply."

**Phase to address:** Phase 4 (service selection). Monitor post-launch.

---

### MINOR: CORS Errors When Testing Locally

**What goes wrong:** Formspree and Web3Forms accept CORS requests from any origin in production, but some configurations block localhost. Developers see CORS errors during local testing and incorrectly conclude the service is broken.

**Prevention:** Formspree's `fetch`-based submission works from localhost without CORS issues. If testing a Formspree form with `action` attribute (redirect-based), the redirect goes to formspree.io after submission — this is normal. Use the Formspree `fetch` API method for full local testability.

**Warning signs:** CORS error in console during local dev. Production works fine.

**Phase to address:** Phase 4. Document expected local dev behavior.

---

## Responsive Design Pitfalls

### CRITICAL: Desktop-Only Design Tested at Last Minute

**What goes wrong:** The timeline section and values cards are designed and built at desktop width. On mobile (375px), the horizontal timeline becomes unreadable, cards overflow their containers, and font sizes set in `px` do not scale. Mobile is treated as an afterthought and requires a near-complete rebuild of the layout CSS.

**Prevention:** Design and test at 375px and 1280px simultaneously. Adopt mobile-first CSS: write base styles for mobile, then use `@media (min-width: Xpx)` to expand for larger screens. The timeline component in particular needs a different layout direction at mobile (vertical stacked vs. horizontal alternating).

**Warning signs:** All development is done at 1280px. First mobile test is after the section is "done."

**Phase to address:** Each phase, on every component. Never finish a section without testing at 375px.

---

### MODERATE: Fixed Pixel Font Sizes

**What goes wrong:** Using `font-size: 16px` on body text (instead of `1rem`) ignores the user's browser font size preferences. Users who set their browser to "Large" for accessibility reasons see no difference. Typography built entirely in `px` fails accessibility audits.

**Prevention:** Use `rem` for font sizes (relative to the root `html` font size, which respects browser settings). Use `em` for spacing that should scale with the element's font size. Set type scale using CSS custom properties in `rem`:
```css
:root {
  --text-sm: 0.875rem;   /* 14px at default */
  --text-base: 1rem;     /* 16px at default */
  --text-lg: 1.125rem;   /* 18px at default */
  --text-xl: 1.25rem;    /* 20px at default */
  --text-2xl: 1.5rem;    /* 24px at default */
  --text-4xl: 2.25rem;   /* 36px at default */
}
```

**Warning signs:** Any `font-size` value in `px` in a component stylesheet. Lighthouse accessibility score penalizes small fixed text.

**Phase to address:** Phase 1 (design system tokens), enforce throughout.

---

### MODERATE: Touch Target Sizes Too Small

**What goes wrong:** Interactive elements (values card buttons, navigation links, contact form submit button) styled at 24px height or less are hard to tap accurately on mobile. This is a usability failure for the primary recruiter audience who may review the site on a phone.

**Prevention:** Minimum touch target: 44x44px (Apple HIG), ideally 48x48px (Material). For inline text links, add padding rather than changing the text size. The contact form submit button should be full-width on mobile and at least 48px tall.

**Warning signs:** Buttons that look good on desktop but are too small to tap comfortably on an iPhone.

**Phase to address:** Phase 3-4 (components with interactive elements).

---

### MINOR: Viewport Meta Tag Missing or Wrong

**What goes wrong:** Without `<meta name="viewport" content="width=device-width, initial-scale=1">` in the `<head>`, mobile browsers render the page at 980px (desktop width) and scale it down. The site looks like a shrunken desktop page.

**Prevention:** Astro's default `<html>` template does not automatically include this — it must be in your layout component's `<head>`. Verify it is present.

**Warning signs:** Mobile browser shows the full desktop layout zoomed out instead of a responsive layout.

**Phase to address:** Phase 1 (layout component setup).

---

## Typography Pitfalls

### CRITICAL: Font Loading That Causes Layout Shift (CLS)

**What goes wrong:** Loading Google Fonts via a standard `<link>` in `<head>` without explicit font-display control causes Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT). Text reflows when the font loads, causing Cumulative Layout Shift — a Core Web Vital that hurts both SEO and perception.

**Prevention:** 
1. Use Astro's native font system (`astro:fonts`) which adds `font-display: swap` and preload hints automatically.
2. If using Google Fonts via `<link>`, always add `&display=swap` to the URL and preconnect:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```
3. Self-host fonts using `@font-face` with `font-display: swap` for maximum control and no external dependency.

**Warning signs:** Text visibly changes size/weight after the page loads. Lighthouse CLS score above 0.1. Network tab shows font loading after First Contentful Paint.

**Phase to address:** Phase 1 (design system), before any typography is implemented.

---

### MODERATE: Too Many Typefaces

**What goes wrong:** Using one font for headings, another for body, a third for the timeline labels, and a fourth for the contact form creates visual incoherence. Personal sites frequently fall into this trap when trying to be "distinctive."

**Prevention:** One typeface family covers a professional personal site. A high-quality variable font (Inter, Plus Jakarta Sans, DM Sans) handles all weights. If a display font is used for headings, it must be clearly differentiated and used sparingly (H1 only). Two typefaces maximum.

**Warning signs:** More than two `@font-face` or Google Fonts families loaded. Any font that requires justification beyond "I liked it."

**Phase to address:** Phase 1 (typography decision).

---

### MODERATE: Line Length Too Wide or Too Narrow

**What goes wrong:** Body text spanning the full width of a 1440px viewport (no max-width constraint) produces 120+ character lines. The eye loses its place when returning to the start of the next line. Conversely, forcing text into a very narrow column (under 45 characters) requires too many line breaks and feels choppy.

**Prevention:** Limit readable text blocks to 60-75 characters per line (`max-width: 65ch` is a reliable CSS rule). The hero tagline can span wider. The values stories and about text should be constrained.

**Warning signs:** Body text that spans nearly the full browser width at 1440px. Measuring character count manually or with a browser extension shows above 90 characters per line.

**Phase to address:** Phase 2 (layout), applied to any text-heavy section.

---

### MODERATE: Heading Hierarchy Used for Visual Styling, Not Semantics

**What goes wrong:** Using `<h3>` for timeline entry titles because the font size "looks right" but structurally it should be `<h2>`, or using multiple `<h1>` tags on the page (one for the site name, one for the hero tagline). This breaks screen reader navigation and SEO.

**Prevention:** One `<h1>` per page (the hero tagline or name). Section headings use `<h2>`. Sub-elements within sections use `<h3>`. If a heading level needs different visual sizing, use a CSS class — do not change the semantic heading level to match a visual design. Validate with a screen reader or the Accessibility tab in browser DevTools.

**Warning signs:** Two `<h1>` tags on the page. `<h4>` or `<h5>` used anywhere when an `<h3>` was skipped. Heading levels chosen to match design mockup sizes rather than content hierarchy.

**Phase to address:** Phase 2 (HTML structure), audit in each phase.

---

### MINOR: Insufficient Line Height in Body Text

**What goes wrong:** Default browser `line-height` (1.2) is appropriate for headings but too tight for body paragraphs. Dense body text is harder to read and feels heavy.

**Prevention:** Set `line-height: 1.6` to `1.75` for body text. Headings should be `line-height: 1.1` to `1.3`. Apply via CSS custom properties:
```css
:root {
  --leading-tight: 1.25;   /* headings */
  --leading-normal: 1.5;   /* subheadings, UI labels */
  --leading-relaxed: 1.75; /* body text, descriptions */
}
```

**Phase to address:** Phase 1 (design system tokens).

---

## Phase-Specific Warning Summary

| Phase | Component / Topic | Likely Pitfall | Mitigation |
|-------|------------------|---------------|------------|
| Phase 1 | Project init | Missing `base` config | Set `site` + `base` in `astro.config.mjs` immediately |
| Phase 1 | GitHub Pages setup | Pages source not set to GitHub Actions | Change in repo Settings → Pages before first push |
| Phase 1 | Typography tokens | `px` font sizes | Use `rem` exclusively, define as CSS custom properties |
| Phase 1 | Font loading | FOUT / CLS | Use Astro font system or `display=swap` + preconnect |
| Phase 2 | Hero section | Hero image lazy-loaded | Add `priority` prop to hero `<Image>` |
| Phase 2 | Hero content | Vague value proposition | Content must be finalized before build |
| Phase 2 | Architecture | Reaching for a JS framework | Decide vanilla JS + CSS only before building |
| Phase 3 | Values cards | React/Vue for toggle | Use `<details>` or vanilla JS toggle |
| Phase 3 | Values cards | `is:inline` script duplication | Use standard Astro `<script>` (deduplicated) |
| Phase 3 | Timeline | Resume dump | Enforce 5-7 entries, one impact statement each |
| Phase 4 | Contact form | Spam on free tier endpoint | Honeypot field + Formspree spam filter |
| Phase 4 | Contact form | No submit feedback | Implement fetch-based submission with success/error states |
| Every phase | Responsive | Desktop-only testing | Test at 375px before marking any section done |

## Sources

- Astro GitHub Pages Deployment Guide (official): https://docs.astro.build/en/guides/deploy/github/ — verified via Context7 `/withastro/docs`
- Astro Configuration Reference (base, site, output): https://docs.astro.build/en/reference/configuration-reference/ — verified via Context7
- Astro Islands / Client Directives: https://docs.astro.build/en/concepts/islands/ — verified via Context7
- Astro Directives Reference (client:*, is:inline, is:global): https://docs.astro.build/en/reference/directives-reference/ — verified via Context7
- Astro Styling Guide (scoped styles, global): https://docs.astro.build/en/guides/styling/ — verified via Context7
- Astro Image Optimization (`priority`, responsive): https://docs.astro.build/en/reference/modules/astro-assets/ — verified via Context7
- Astro Font Optimization: https://docs.astro.build/en/reference/font-provider-reference/ — verified via Context7
- Astro Environment Variables: https://docs.astro.build/en/guides/environment-variables/ — verified via Context7
- Astro Client-Side Scripts: https://docs.astro.build/en/guides/client-side-scripts/ — verified via Context7
- Formspree documentation (honeypot, spam filtering): https://help.formspree.io — MEDIUM confidence (training knowledge, not verified via current docs fetch due to tool restrictions)
- WCAG 2.1 contrast requirements (4.5:1 AA): https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum — HIGH confidence (stable specification)
- Apple HIG touch target guidance (44x44pt): https://developer.apple.com/design/human-interface-guidelines/accessibility — HIGH confidence (stable specification)
