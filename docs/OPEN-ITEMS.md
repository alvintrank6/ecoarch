# OPEN-ITEMS (one line each: id | where | default used)
OI-01 | docs/10-CLAUDE-HANDOVER.md | PDF export left broken combining marks in section 10 text; not used as source, CLAUDE.md governs
OI-02 | docs/04 and docs/08 | docs/08 shows public/assets path; CLAUDE.md says src/assets, used src/assets
OI-03 | docs/01 Brief | Gói 2 and 3 names differ between price image and business report (docs/02); use names in docs/01 table
OI-04 | docs/*.md | PDF-to-Markdown conversion: verify any suspicious diacritics against the PDF if a string looks odd
OI-05 | astro.config.mjs, robots.txt | domain unknown, placeholder https://eco-arch.example; set PUBLIC_SITE_URL and robots.txt Sitemap line at deploy
OI-06 | public/og-default.jpg | OG image not yet created (S10); Seo.astro already references /og-default.jpg
