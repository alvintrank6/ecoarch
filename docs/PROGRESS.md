# PROGRESS (overwrite, max 30 lines)
Current: REBUILD to design doc v2 (18/11/2026) done and verified. Olive brand kept (OI-22).
Done: docs/11-PAGES + docs/12 imported; pages.json from scripts/extract-copy.py; every page renders from it (home 5 sections, others 4).
Architecture: src/content/pages.ts (typed JSON), src/views/Page.astro (type -> component), src/components/sections/*.astro (one per section type), src/data/images.ts (image ID -> asset or null), src/data/links.ts (button label -> page).
i18n: vi.json/en.json hold only shared UI (common, nav, form, compare, alt, thanks, pages.<id>.{title,description,h1}); copy of the 20 pages lives ONLY in docs/11-PAGES -> pages.json. Change copy: edit docs/11-PAGES/Pxx.md, run `python3 scripts/extract-copy.py docs/11-PAGES src/content/pages.json`.
Routes: Gói 2 = architectural (dich-vu/thiet-ke-kien-truc), Gói 3 = integrated (dich-vu/thiet-ke-kien-truc-noi-that); ids in src/i18n/routes.ts (pidOf maps to P01-P20).
Motion (src/motion): scene.ts (T4+A1 per section, data-s markers), reveal.ts (R1 R2 R9 B2 B3 A12 via IntersectionObserver), chrome.ts (A9 A13 T3 A15 T5 A6), cursor.ts (A7), rail.ts (A8), parallax.ts (A5), ladder.ts (A4 A11), process.ts (R7 A10), sunwind.ts (A2 A3), louver.ts (R3 R4), page-wipe.ts (P2 + T1 curtain), compare.ts, hero.ts, nav.ts, faq.ts, lightbox.ts.
Gates: npm run verify (adds check-structure, check-motion-budget), verify:ui, verify:interact, verify:motion (scroll-through, nothing stays hidden), verify:a11y. All green.
Gotchas: IntersectionObserver ignores content clipped by overflow (observe the mask, not the translated child). CSS transitions on SVG stroke-dashoffset do not run in Chromium: use GSAP. `astro preview` daemon persists on :4399.
Next: owner decisions in OPEN-ITEMS; set PUBLIC_SITE_URL and PUBLIC_FORM_ENDPOINT; real images; Safari/Firefox test; deploy.
