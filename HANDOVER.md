# Handover (docs/10 "Gói bàn giao")

## README
Install, dev, build, verify, deploy: see README.md. Deploy is any static host serving `dist/`. Nothing has been pushed or deployed.

## Content
Page copy (20 pages, 81 sections, VI and EN) lives in `docs/11-PAGES/Pxx.md` and is extracted to `src/content/pages.json` by `python3 scripts/extract-copy.py docs/11-PAGES src/content/pages.json`; the pages render from it (home 5 sections, every other page 4; `check-structure` enforces). Shared UI strings (nav, footer, form, errors, image alt text) and titles and descriptions live in `src/content/vi.json` and `en.json` (identical key sets; `npm run verify` fails on any gap or a title/description that differs from the SEO table in `docs/04-CONTENT.md`).
- Edit text: change the key in both files, run `npm run verify`.
- Add a page: add a `Pxx.md` in docs/11-PAGES, an id and slugs in `src/i18n/routes.ts` (and `pidOf`), `pages.<id>.{title,description,h1}` in both JSON files, and button targets in `src/data/links.ts`. Section types are rendered by `src/components/sections`.
- Rules enforced by `scripts/check-content.mjs`: exactly 3 prices (100.000, 220.000, 340.000 đ/m²), no revision rounds, payment split, totals, discounts, no unverified claims, no dashes in copy, no placeholder markers, no reference or watermarked images.
- Hidden until real data exists: contact details on P19 (the items are labels only; add the data to the P19 copy and extend `Plain.astro` to render it).

## Assets
Images are in `src/assets/concept` (names `ex-NN-before|after`), served as WebP at 480, 768, 1200 and 1600 px via `ConceptImage.astro` and `Compare.astro`. Before and after must have identical pixel size (the build fails otherwise).
Every concept image shows "Hình minh họa" / "Illustration" (checked by `check-images.mjs`). Not used: `ex-07` (Vietnamese labels baked in), `ex-09` (no after image), all `reference/` images (watermarks).
`ex-08` was split into halves by `scripts/derive-images.mjs`. OG image and touch icon come from `scripts/make-og.mjs`. Replace the interim hero (`ex-04-after`) and the SVG package art with owner originals when they exist (OPEN-ITEMS OI-07, OI-08).
Image manifest: `docs/asset-manifest.csv`.

## Brand
Palette, fonts and logo follow the owner's brand concept board (docs/06 "Brand update"). Tokens live in the `@theme` block of `src/styles/global.css`; the logo is `src/components/Logo.astro` and `LogoMark.astro` (direction 02), favicon `public/favicon.svg`. To switch to logo direction 01 (wordmark only) or 03 (EA monogram), change those two components and the favicon. Not used: the board's "Energy-Saving Spaces" value (no energy claims allowed).

## Motion
Tokens: `src/motion/tokens.ts` (JS) and `:root` in `src/styles/global.css` (CSS). Modules (docs/12 v3): `scene.ts` (T4, A1), `hero.ts`, `nav.ts`, `reveal.ts` (R1 R2 R9 B2 B3 A12), `chrome.ts` (A9 A13 T3 A15 T5 A6), `cursor.ts` (A7), `rail.ts` (A8), `parallax.ts` (A5), `ladder.ts` (A4 A11), `process.ts` (R7 A10), `sunwind.ts` (A2 A3), `louver.ts` (R3 R4), `draw.ts`, `compare.ts`, `page-wipe.ts` (P2, T1), `toggle.ts`, `lightbox.ts`, `faq.ts`; entry `index.ts`.
Hidden initial states exist only in CSS under `html.js`; no JS, reduced motion (OS) and the footer "Reduce motion" switch (`html[data-motion="reduced"]`) show everything. A 3 s failsafe (`html.reveal-failsafe`) shows content if the motion script never starts.
Rules: transform and opacity only, no scroll-jacking, one cinematic moment (hero), one loop (scroll cue, 6 cycles), parallax only in the home hero.

## Integrations
Booking form: real HTML POST form. Set `PUBLIC_FORM_ENDPOINT` to the provider URL before launch. Provider, recipient, retention period: not decided. Honeypot field `website`; rate limiting must be done by the provider or server. No analytics, pixels, maps or booking widgets. The privacy page needs legal review before launch.

## Known limits
- Cross-document View Transitions (page fade) are Chromium-only; other browsers navigate normally. The booking wipe is desktop and non-reduced only.
- The form depends on a third-party endpoint.
- Images are illustrations; replace with project photos when real projects exist.
- Tested in Chromium only (see docs/QA-REPORT.md).

## Release
Commit: `git log -1`. Tag, URL, deploy date, rollback: fill in at deploy. Rollback = redeploy the previous build or tag. Hosting should 301 `/` to `/vi/`; `index.html` at the root is only a meta-refresh fallback. Update the `Sitemap:` origin through `PUBLIC_SITE_URL` (robots.txt is generated from it).
