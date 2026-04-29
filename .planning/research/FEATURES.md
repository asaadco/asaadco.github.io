# Features Research: Personal Professional Site

**Domain:** Personal professional website — Data & AI professional, speaker, career coach
**Audience:** Primary = employers & recruiters; Secondary = speaking organizers, coaching clients
**Researched:** 2026-04-29
**Confidence note:** WebSearch and WebFetch were unavailable during this session. All findings draw
from training data (knowledge cutoff August 2025), which is well-suited to this domain — personal
website patterns, WCAG standards, and form service offerings are mature and stable. Confidence
levels are assigned per finding below.

---

## Table Stakes

Features that every credible professional site must have. Missing any of these signals neglect
and undermines the primary goal (recruiter/employer trust).

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear name + role above the fold | Visitors must know who this is in < 2 sec | Low | Never hide identity below hero imagery |
| Professional headshot | Humanizes the page; recruiters expect a face | Low | High-contrast, natural light; not a crop from a group photo |
| One-line professional tagline | Distills identity; hooks the right audience | Low | Should answer "who for and what value" — e.g. "Data & AI leader who builds teams and speaks on human-centered technology" |
| Navigation or scroll anchors | Allows non-linear browsing; recruiters skim | Low | Even on a single-page site, anchor links in a sticky nav prevent disorientation |
| Mobile responsiveness | 50–60% of professional site visits arrive on mobile (HIGH confidence — consistent across analytics industry reports) | Medium | Not optional; broken mobile = immediate credibility loss |
| Page load under 3 seconds | Google's threshold; recruiters on corporate networks may have restrictions | Medium | Static Astro site with optimized images should exceed this easily |
| LinkedIn link (visible) | Recruiters will cross-reference; no LinkedIn raises suspicion | Low | Prominent in hero or nav, not buried in footer only |
| Contact mechanism | Reason for the site to exist from the recruiter's perspective | Low | Form, email, or both |
| Legible typography | Professionalism baseline; small or low-contrast text signals carelessness | Low | Minimum 16px body, 4.5:1 contrast ratio for WCAG AA |
| HTTPS | Browsers now flag HTTP as "Not Secure"; breaks trust instantly | Low | GitHub Pages provides this automatically |
| No broken links or placeholder content | Signals that the site is maintained and professional | Low | Pre-launch audit is mandatory |

**Confidence:** HIGH — these are industry-standard expectations, well-documented in UX literature
and recruiter behavior research through 2024.

---

## Differentiators

What separates sites that get remembered (and generate replies) from the ones that get closed.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Story-first hero copy | "I help X do Y" outperforms "Senior Data Scientist at Z" — speaks to the visitor's need | Low | Asaad's tagline should lead with impact, not title |
| Progressive disclosure via clickable cards | Layers depth — at-a-glance overview for skimmers, full story for engaged visitors | Medium | The Values section with click-to-expand stories is genuinely differentiating; most sites just list bullet points |
| Visual career timeline | Transforms a resume bullet list into a narrative arc; signals intentionality | Medium | Works best when milestones have brief "why it mattered" annotations, not just dates and titles |
| Values with personal anecdotes | Rare on professional sites; makes the person concrete rather than abstract | Medium | A 2–3 sentence story per value is the right length; longer becomes a blog post |
| Consistent, opinionated visual identity | A single accent color + one headline font applied consistently reads as "designed" not "templated" | Low | Avoid default Bootstrap/Tailwind looks — they signal low investment |
| Micro-interactions on scroll | Subtle fade-in or slide-in on section entry creates polish without distraction | Medium | Must be interruptible (prefers-reduced-motion media query is required) |
| Contextual CTAs per audience segment | Hero CTA = "Let's work together" (recruiter); Speaking section CTA = "Book a talk" | Low | A single generic "Contact me" loses specificity that drives action |
| Social proof without self-praise | Quotes from colleagues, conference organizers, or coaching clients add credibility | Low | Even 1–2 short testimonials change the reading experience significantly |
| Visible "last updated" or recent activity signal | Shows the site is alive; a stale site signals an inactive or checked-out professional | Low | A footer date or a "currently" line ("Currently: Leading AI adoption at...") works well |

**Confidence:** HIGH for the copy/story patterns (well-established conversion research). MEDIUM for
specific UX pattern claims (micro-interactions, progressive disclosure polish) — backed by NNG
and similar UX research but interpretation of "differentiating" is contextual.

---

## Anti-Features / Common Mistakes

Patterns that actively harm credibility or user experience. These are common enough to warrant
explicit callouts.

| Anti-Feature | Why It Hurts | What to Do Instead |
|--------------|-------------|-------------------|
| Splash/loading screen | Adds friction before the visitor sees any value; feels 2012 | Remove entirely; static sites load fast enough |
| Generic hero stock photography | Signals low investment; creates dissonance between "personal" and "impersonal" imagery | Use a real, professional headshot; no stock people |
| Resume dump | A wall of job titles and bullet points is what LinkedIn is for; the personal site should add human context | Curate to 4–6 career highlights on the timeline; link to LinkedIn for full history |
| Skills keyword soup | "Python, SQL, Tableau, TensorFlow..." as a list is noise to most recruiters and junior signal to technical ones | Replace with demonstrated capability (timeline milestones, project outcomes) |
| Autoplaying sound or video | Disruptive; often muted by browsers anyway; accessibility failure | If video exists, use a poster frame + play-on-click |
| Over-animated hero text | Typewriter effects, letter-by-letter reveals, and scramble animations delay comprehension | Deliver the headline immediately; animation should enhance, not gate, content |
| "Under construction" sections | Signals incompleteness; even a placeholder reads as "I haven't finished caring" | Only publish sections that are complete; hide incomplete ones |
| Inline mailto: as the only contact option | mailto: opens the visitor's email client — a context switch many avoid | Provide an embedded form as the primary mechanism; mailto as fallback only |
| No call-to-action | Visitors who are impressed have nowhere to go | Every section should have a logical next step |
| Centered walls of text | Paragraph alignment and line length affect readability | Max content width ~680px; left-align paragraphs; centered text only for headlines |
| Dark mode default without system preference detection | Assumes preference; some recruiters on corporate monitors find dark sites harder to print or screenshot | Default to light; respect `prefers-color-scheme` if implementing theme toggle |
| Too many fonts | Using 3+ font families signals design inexperience | One display font + one body font is the professional ceiling |

**Confidence:** HIGH — these anti-patterns are consistently cited across UX research, hiring manager
surveys, and web performance literature.

---

## Values Section Best Practices

The Values section (4 clickable cards: Integrity, Empathy, Growth, Excellence) is the most
differentiating element of this site. Getting the interaction pattern right is important.

### Card Design

- **Card state (closed):** Show value name + a 1-line subtitle or evocative phrase, not a dictionary definition. Example: "Integrity — I say the hard thing." The subtitle should tease the story, not summarize it.
- **Card state (open):** Reveal a 2–4 sentence personal anecdote. This is the "earned" layer of progressive disclosure — the visitor leaned in by clicking, so the story can be more intimate than surface-level copy.
- **Visual cue for interactivity:** An arrow, chevron, or "Read the story" micro-label signals that the card is clickable. Without this, many visitors will never discover the stories.
- **Only one card open at a time (accordion behavior):** When the visitor opens card B, card A closes. This prevents the page from becoming a wall of text and maintains the clean aesthetic.
- **Keyboard navigable:** Cards must be `<button>` elements or have `role="button"` + `tabindex="0"` + Enter/Space handlers. Divs-with-onclick are an accessibility failure.

### Animation / Reveal

- **Expand/collapse with a max-height or height transition:** `transition: max-height 0.3s ease` is the standard CSS pattern for accordion reveals. Pure CSS without JavaScript is possible but requires the "checkbox hack" — use a small JS toggle for cleaner markup.
- **Don't use `display: none` → `display: block` transitions:** These cannot be CSS-transitioned. Use `max-height: 0` → `max-height: [story height]` or `opacity + transform` with `visibility`.
- **Transition duration:** 250–350ms feels instant but polished. Under 150ms is imperceptible; over 400ms feels sluggish.
- **Respect `prefers-reduced-motion`:** When this media query is true, skip the animation — just toggle visibility. This is a WCAG 2.1 requirement (Level AA in some interpretations, broadly considered best practice).

### Aria Patterns (MEDIUM-HIGH confidence — WCAG documented)

```html
<button
  aria-expanded="false"
  aria-controls="value-integrity-story"
  class="value-card"
>
  Integrity
</button>
<div id="value-integrity-story" hidden>
  <!-- story content -->
</div>
```

Use `aria-expanded` to reflect state. Toggle the `hidden` attribute via JS. Screen readers will announce "Integrity, collapsed, button" and "Integrity, expanded, button" on toggle — this is the correct pattern per WAI-ARIA authoring practices.

### Content Length

- Value name: 1 word (as planned)
- Subtitle/hook: 6–12 words
- Story: 50–100 words. Long enough to be meaningful; short enough to respect that the visitor is still evaluating, not reading an essay.

---

## Timeline Best Practices

The Professional Journey timeline converts a resume into a narrative. Done well it communicates
intentionality and progression. Done poorly it is just a vertical list.

### Structure

- **Chronological vs. reverse-chronological:** For career stories told as "journey," chronological (oldest first) reinforces the narrative arc — "here is where I started, here is where I arrived." Reverse-chronological (most recent first) is standard on resumes because hiring managers want current role immediately. For a personal site with a "journey" framing, chronological is more compelling. Choose based on whether the narrative emphasizes destination (reverse-chron) or the journey itself (chron).
- **4–7 milestones is the right density:** Too few and it looks sparse; too many and it becomes a resume dump. For Asaad's context (Data & AI + speaking + coaching), curate to turning points, not every job change.
- **Each milestone needs:** Role/title + Organization + Year/period + 1–2 sentence "what this meant" annotation. The annotation is what transforms a timeline into a story.

### Visual Design

- **Vertical line with nodes:** The canonical timeline pattern. A thin vertical line (2px, accent color or neutral) with circular or diamond nodes at each milestone. This is immediately readable.
- **Alternating left/right layout on desktop:** Milestones alternate sides of the centerline — creates visual rhythm and allows more text per entry without crowding. On mobile, collapse to a single-column left-aligned list.
- **Date on the node, not in the text:** Positioning the year/period at the node (or just above it) separates temporal metadata from narrative content — cleaner reading experience.
- **Active/current role styling:** The most recent (or current) milestone should be visually distinguished — filled node vs. outline, or accent color treatment — to signal "this is where I am now."

### Progressive Disclosure on Timeline

- For a minimalist aesthetic, consider showing role + year on load, with a brief "what this meant" annotation revealed on hover/focus (desktop) and always visible on mobile. This keeps the timeline scannable at a glance for skimmers.
- **Alternatively:** Show everything on load if the annotations are short (1–2 sentences). Progressive disclosure on timeline entries adds interaction cost for questionable benefit unless entries are long.

### Accessibility

- Use `<ol>` or `<ul>` as the semantic base for the timeline entries. A visual timeline implemented as `<div>` soup is navigable visually but opaque to screen readers.
- Each milestone `<li>` should have a logical text order: date, role, organization, annotation.

**Confidence:** HIGH for structural recommendations (well-established UX pattern). MEDIUM for
"alternating layout" — this is common but not universal; some excellent timelines use single-column.

---

## Contact Form Recommendations

This is a static site (Astro + GitHub Pages — no server-side code). All form handling must use a
third-party service.

### Service Comparison

| Service | Free Tier | Spam Protection | Anonymous Friendly | Setup Complexity | Notes |
|---------|-----------|-----------------|-------------------|-----------------|-------|
| **Formspree** | 50 submissions/month; 1 form | reCAPTCHA or hCaptcha | Yes — no email required from sender | Low — HTML `action` attribute only | Most widely documented for Astro; reliable; free tier usually sufficient for personal sites |
| **Web3Forms** | 250 submissions/month; unlimited forms | hCaptcha or Turnstile | Yes | Very low — public access key in HTML | More generous free tier than Formspree; no account required to test; Cloudflare Turnstile is less privacy-invasive than reCAPTCHA |
| **EmailJS** | 200 emails/month | Basic | Yes | Medium — requires JS SDK | Sends directly from browser via JS; email template required; no server involved |
| **Netlify Forms** | 100 submissions/month | Akismet | Yes | Very low if hosted on Netlify | Not applicable here — site is on GitHub Pages, not Netlify |
| **Basin** | 100 submissions/month | Honeypot + reCAPTCHA | Yes | Low | Less well-known; has file upload support |
| **Getform** | 50 submissions/month | reCAPTCHA optional | Yes | Low | Similar to Formspree; dashboard is clean |

### Recommendation: Web3Forms

**Use Web3Forms** for this project.

Rationale:
1. 250 free submissions/month is 5x Formspree's free tier — a personal site will never hit this ceiling.
2. Unlimited forms on the free tier (Formspree limits to 1).
3. Uses Cloudflare Turnstile for spam protection — less tracking and privacy-invasive than Google reCAPTCHA; aligns with "anonymous-friendly" requirement.
4. Setup is a single hidden `<input type="hidden" name="access_key" value="...">` in the form — no JavaScript required, works with plain HTML form submission.
5. Integrates cleanly with Astro static output.

Formspree is the safe fallback — more tutorials exist for it, and if documentation is a priority during development, Formspree's docs are excellent. The free tier limitation (50/month) is unlikely to matter for a personal site.

### Form Design Best Practices

- **Minimum fields:** Name (optional), Message (required). Email should be optional for true "anonymous-friendly" experience, but include it as optional with a clear label ("If you'd like a reply, leave your email").
- **No required email field:** Making email required defeats "anonymous-friendly." Some visitors (e.g. internal referrals, speaking organizers who want to stay informal) will abandon a form that forces PII.
- **Honeypot field:** A hidden `<input>` that humans never fill but bots do — simple bot protection that requires no CAPTCHA UX friction. Most form services support this via a `_honey` or `botcheck` field name.
- **Success state:** On submission, replace the form with a confirmation message in place — do not navigate away (SPA-like behavior). "Thanks — I'll be in touch." is sufficient.
- **Error state:** If submission fails, show an inline error — do not just silently fail. "Something went wrong — try emailing me directly at [address]" is a graceful fallback.
- **Character limit on message:** A `maxlength` of 1000–2000 characters prevents extremely long submissions while being generous for real inquiries.
- **Subject line field:** Optional but useful — allows the visitor to self-categorize ("Recruiting inquiry", "Speaking opportunity", "Coaching"). This helps Asaad triage. Keep it as a text input, not a dropdown — dropdowns add friction.

### GDPR / Privacy Consideration (MEDIUM confidence)

If any EU visitors are plausible, include a one-line notice: "Your message and email (if provided) are used only to respond to your inquiry." This is not legal advice — but it is standard practice for personal sites handling form data and reduces friction with privacy-conscious visitors.

---

## Accessibility Baseline

Professional sites have a minimum accessibility obligation — both ethical and practical (recruiters
at large companies often use assistive technology or have accessibility-related policies when
evaluating vendors or candidates).

**Standards target:** WCAG 2.1 Level AA — the professional and legal baseline in most jurisdictions.

### Critical Requirements (HIGH confidence — WCAG 2.1 documented)

| Requirement | Minimum Standard | Implementation Notes |
|-------------|-----------------|---------------------|
| Color contrast — body text | 4.5:1 ratio against background | Check with a contrast checker; pure black on white is 21:1; common mistake is light gray on white |
| Color contrast — large text (18px+ or 14px+ bold) | 3:1 ratio | Headlines can use slightly lower contrast |
| Keyboard navigation | All interactive elements reachable and operable via Tab + Enter/Space | Test by unplugging your mouse; every link, button, and card must be focusable |
| Focus indicators | Visible focus outline on all interactive elements | Do NOT do `outline: none` without replacing the focus style — this is an WCAG 2.1 AA failure |
| Images have alt text | All `<img>` elements have `alt` attribute | Headshot: descriptive alt ("Asaad, smiling in a professional setting"); decorative images: `alt=""` |
| Form labels | Every `<input>` has an associated `<label>` or `aria-label` | Placeholder text is not a substitute for a label — it disappears on focus |
| Heading hierarchy | `<h1>` through `<h6>` used in logical order | Only one `<h1>` per page (the name/hero); sections use `<h2>`; sub-content uses `<h3>` |
| Link text is descriptive | No "click here" or "read more" without context | "Read Asaad's story on Integrity" not "Read more" |
| Skip navigation link | A "Skip to main content" link as the first focusable element | Hidden visually until focused; allows keyboard users to bypass repeated navigation |
| Language attribute | `<html lang="en">` | Required for screen readers to use the correct pronunciation engine |

### Motion / Animation

- Implement `@media (prefers-reduced-motion: reduce)` for all CSS transitions and animations. This is WCAG 2.1 Success Criterion 2.3.3 (Level AAA) but is broadly expected and simple to implement.
- Pattern:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Landmarks

Use semantic HTML5 landmarks so screen readers can jump to sections:

- `<header>` — Hero/nav
- `<main>` — All primary content
- `<section aria-labelledby="section-heading-id">` — Each section (Timeline, Values, Contact)
- `<footer>` — Links, copyright

### ARIA for Interactive Elements

- Values cards: `aria-expanded` + `aria-controls` pattern (see Values Section above)
- Timeline: If any entries have hover-reveal annotations, provide the full text in the DOM (not only on hover) — CSS `visibility: hidden` hides from sighted users but leaves content in the accessibility tree

### Testing Recommendations

1. **axe DevTools** (browser extension) — free automated checker; catches ~30–40% of WCAG failures
2. **Manual keyboard test** — Tab through the entire page; every element should be reachable and operable
3. **Browser zoom to 200%** — Text and layout must remain functional; no horizontal scrolling
4. **VoiceOver (macOS)** or **NVDA (Windows, free)** — Read through the hero and values section at minimum

**Confidence:** HIGH for WCAG requirements (authoritative standard, version 2.1 final since 2018).
MEDIUM for testing tool recommendations (tools evolve; axe and VoiceOver are stable choices as of
August 2025).

---

## Progressive Disclosure — What "Done Well" Looks Like

Progressive disclosure for a single-page site means: **show the minimum needed for a decision, reveal depth on intent.**

### Layers for This Site

| Layer | Trigger | Content |
|-------|---------|---------|
| Layer 0 (passive) | Page load | Hero: name + tagline + headshot. Nav anchors visible. Nothing else required. |
| Layer 1 (scroll) | Scrolling to section | Section headline + summary becomes visible. Timeline shows roles + dates. Values shows card faces only. |
| Layer 2 (click/interact) | Deliberate click | Values card stories expand. (Optional) Timeline annotations expand on click. |
| Layer 3 (intent) | Following a CTA | Contact form visible; LinkedIn opens in new tab. |

### Patterns That Work

- **Intersection Observer for scroll reveal:** Elements enter the viewport and fade/slide in. This is the standard mechanism for Layer 1 disclosure. Keep entrance animations subtle — a 20px upward translate + opacity 0→1 over 350ms is the canonical "polished" pattern.
- **Accordion for Values cards:** Single-open accordion with ARIA. This is the correct progressive disclosure tool for "overview + story" content.
- **No scroll-jacking:** Do not override the browser's native scroll behavior. Parallax and scroll-locked animations consistently damage usability and accessibility.
- **No gated content:** Don't require the visitor to complete an action (e.g. "enter your email") to see any part of the site. This is a portfolio, not a lead magnet.

### What "Feels Polished" Specifically

- Entrance animations trigger at ~20% element visibility (not 0%) — elements don't flash in the instant they enter the viewport edge
- One animation family used consistently (fade + translate only; no mix of rotate, scale, and slide)
- The page is fully functional without JavaScript (animations are enhancement only)
- Mobile: all Layer 2 content (expanded card stories) is accessible via tap — hover-only reveals are an anti-pattern on touch devices

---

## Sources

**Note:** WebSearch and WebFetch were unavailable during this research session. All findings are
drawn from training data (knowledge cutoff August 2025).

- WCAG 2.1 specification: https://www.w3.org/TR/WCAG21/ — HIGH confidence; authoritative standard
- WAI-ARIA Authoring Practices 1.2 (Disclosure patterns, Accordion): https://www.w3.org/WAI/ARIA/apg/ — HIGH confidence
- Web3Forms documentation (last verified pre-cutoff): https://web3forms.com/
- Formspree documentation: https://help.formspree.io/
- Nielsen Norman Group research on personal sites and progressive disclosure: https://www.nngroup.com/ — MEDIUM confidence (specific articles not verified in this session)
- General UX and conversion research on hero copy, CTAs, and social proof — MEDIUM confidence (composite of multiple sources from training data)
