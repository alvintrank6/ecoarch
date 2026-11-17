# PROGRESS (overwrite, max 30 lines)
Current: S1 done. Next S2.
Done: S1 foundation (pinned deps, Tailwind4 tokens in src/styles/global.css, fonts.css, Base layout + Seo, i18n routes/t, all 44 routes built with h1 only via src/views/Generic.astro, 404, root meta-refresh, sitemap, robots).
Patterns (filled after S3): component props style, data-reveal usage, motion init/kill shape, i18n key naming
Decisions:
- Locale JSON: common.*, notFoundPage.*, pages.<id>.{title,description,h1} (ids in src/i18n/routes.ts, seeded from docs/04 tables incl. SEO). Add sections as nav.*, home.*, etc.
- Page views: register in src/views/index.ts? NOT used yet; [...slug].astro renders Generic. S2+ should switch it to render views[id] when present.
- t(lang,key) throws on missing key. scripts/check-i18n.mjs compares vi/en key sets (part of npm run verify).
- check-content REQUIRE_ON (3 prices on services) activates when src/views/Services.astro exists.
- Playwright 1.63.0 works with preinstalled chromium, no CHROME_PATH needed.
- Site URL defaults to https://eco-arch.example (override PUBLIC_SITE_URL); robots.txt Sitemap line hardcodes it, fix at deploy.
- Reveal CSS: html.js [data-reveal] hidden; reduced motion/no-JS show. Prefs in src/motion/prefs.ts. Utilities: .btn .btn-primary .btn-secondary .link .nav-link .illus-label .section .container-eco .on-dark
Next: S2
Gotchas: 404 is vi-only with EN link.
