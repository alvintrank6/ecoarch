# QA report

## Passed (run on the final build, Chromium)
- `npm run verify`: astro check 0 errors; i18n 542 keys equal in VI and EN; SEO table equal to docs/04 (20 pages); content gate; SEO gate (title <= 60, description <= 155, canonical, hreflang vi/en/x-default, noindex only on thank-you and 404, one h1, html lang) on 44 pages; images gate (lazy except hero, WebP only, label on every concept image).
- `npm run verify:ui`: 222 checks, 5 viewports (360, 390, 768, 1024, 1440): no horizontal overflow, no console or HTTP errors, one visible h1; JS off and reduced motion show every `[data-reveal]`.
- `npm run verify:interact`: 42 checks: slider by keyboard (VI and EN labels TRƯỚC/SAU, BEFORE/AFTER), mobile menu focus trap, Esc and focus return, lightbox (open, arrows, Esc, focus return), FAQ, process steps, booking form (field errors, aria-invalid, focus on first error, data kept on network error, success redirect, plain POST markup), back/forward leaves no overlay, reduced-motion switch persists.
- `npm run verify:a11y` (axe, wcag2a/2aa/21aa/22aa): 0 serious or critical on 42 pages x 2 viewports.
- Contrast (computed): text 13.64, muted 5.83, brand 9.85, accent 5.37, success 4.86 on cream; walnut on rose 9.83. Terracotta is not used for text. Brick links on rose are avoided.
- Motion budgets by code reading: hero H1 1200 ms is the only cinematic moment (compare hint C2 uses 1000 ms); one loop (H5, 6 cycles, stops on scroll or hidden tab); parallax only in the home hero (4%); louver on 1 image per viewport (limiter allows 2); transform and opacity only (plus clip-path for C1 as specified); no easing with overshoot. Main JS bundle 53 KB gzip (GSAP core, ScrollTrigger, SplitText, CustomEase) plus modules under 2 KB each.
- Tab order follows DOM order; skip link first; hidden mobile panel is not focusable; focus ring Brick on cream and cream on indigo (cream cards inside indigo use Brick).

## Fixed during QA
- Brick links on the rose "Gói phù hợp" block failed contrast (3.6:1): now walnut.
- Focus ring invisible on the cream form card inside the indigo CTA section: now Brick.
- Touch targets: consent row 44 px, package table links 44 px, short footer links 44 px wide.
- SVG stroke-dashoffset CSS transitions did not run in Chromium: the process plan is drawn with GSAP.
- A forbidden phrase ("giảm điện") appeared in a disclaimer: reworded.

## Remaining
- Not tested: Safari/WebKit and Firefox (Playwright browsers not installed here), real devices, Lighthouse and Web Vitals, 4x CPU throttling.
- Consent checkbox is 28 px (above the 24 px WCAG 2.2 minimum, below 44 px); its label row is 44 px.
- Home page uses more than 8 effect types because docs/07 lists them for P01; budgets for cinematic, loop, parallax, concurrency are met.
- Booking form sends nothing until `PUBLIC_FORM_ENDPOINT` is set.

## Needs human review
- Privacy policy text and the cited law numbers (legal review, A16).
- Process steps 1 to 10, package "does not include" lists, FAQ answers: written from docs defaults, owner to confirm (see OPEN-ITEMS OI-03, OI-11 to OI-18).
- Interim imagery: hero is `ex-04-after`; package art is SVG; no About or article photos.
- Domain, hosting, form provider and recipient, contact details, person in charge (title, bio, photo).
- Visual review of the five breakpoints by a designer, and a Vietnamese and English copy read-through.
