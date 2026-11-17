# Handover (docs/10 "Gói bàn giao")

## README
Install, dev, build, verify, deploy: see README.md. Deploy is any static host serving `dist/`. Nothing has been pushed or deployed.

## Content
All copy lives in `src/content/vi.json` and `en.json` (identical key sets; `npm run verify` fails on any gap, an empty string, or a title/description that differs from the SEO table in `docs/04-CONTENT.md`).
- Edit text: change the key in both files, run `npm run verify`.
- Add a page: add an id and slugs to `src/i18n/routes.ts`, add `pages.<id>.{title,description,h1}` in both JSON files, create a view in `src/views`, register it in the `views` map in `src/pages/[lang]/[...slug].astro`.
- Rules enforced by `scripts/check-content.mjs`: exactly 3 prices (100.000, 220.000, 340.000 đ/m²), no revision rounds, payment split, totals, discounts, no unverified claims, no dashes in copy, no placeholder markers, no reference or watermarked images.
- Hidden until real data exists: H-07 person in charge (add `team.name`, `team.bio`, optional `team.title`, `team.h2`), contact details (add `contact.phone|email|address|hours`).

## Assets
Images are in `src/assets/concept` (names `ex-NN-before|after`), served as WebP at 480, 768, 1200 and 1600 px via `ConceptImage.astro` and `Compare.astro`. Before and after must have identical pixel size (the build fails otherwise).
Every concept image shows "Hình minh họa" / "Illustration" (checked by `check-images.mjs`). Not used: `ex-07` (Vietnamese labels baked in), `ex-09` (no after image), all `reference/` images (watermarks).
`ex-08` was split into halves by `scripts/derive-images.mjs`. OG image and touch icon come from `scripts/make-og.mjs`. Replace the interim hero (`ex-04-after`) and the SVG package art with owner originals when they exist (OPEN-ITEMS OI-07, OI-08).
Image manifest: `docs/asset-manifest.csv`.

## Motion
Tokens: `src/motion/tokens.ts` (JS) and `:root` in `src/styles/global.css` (CSS). Modules: `hero.ts, nav.ts, reveal.ts, draw.ts, louver.ts, compare.ts, process.ts, page-wipe.ts, toggle.ts, lightbox.ts, faq.ts`, entry `index.ts`.
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
