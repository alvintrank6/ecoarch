# PROGRESS (overwrite, max 30 lines)
Current: P0 done (repo prepared, plan approved pending). S1 not started.
Done: repo scaffold of docs/scripts/CLAUDE.md; docs split to 11 files (NFC); concept images in src/assets/concept; manifest in docs/.
Patterns (filled after S3): component props style, data-reveal usage, motion init/kill shape, i18n key naming
Decisions:
- Slices S1..S11 as in docs/08 table (dependencies OK, no change).
- Files named per Prompt (03-ASSETS, 04-CONTENT, 09-ACCEPTANCE, 10-CLAUDE-HANDOVER), not per docs/00 table.
- CLAUDE.md here supersedes docs/10 (docs/10 has broken combining diacritics from the PDF; use only its "Gói bàn giao" table).
- Images live in src/assets (astro:assets); docs/08 mentions public/assets, ignore.
- typescript pinned to 6.x (@astrojs/check 0.9.12 peer is ^5||^6; latest is 7.0.2).
- Playwright: global 1.63.0 + chromium at /opt/pw-browsers. Install playwright@1.63.0 and run with CHROME_PATH=/opt/pw-browsers/chromium/chrome-linux/chrome (verify path); do not run `playwright install`.
Next: S1
Gotchas: check-ui expects routes cam-on, thank-you, dich-vu, services; scripts untested on real Astro dist.
