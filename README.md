# ECO ARCH website

Astro 7 static site (VI and EN), Tailwind 4, GSAP 3. ECO ARCH is a Hanoi architecture and home renovation design consultancy; it does not build.
Source of truth for decisions: `docs/*.md` (the design document split into files). Rules for Claude Code sessions: `CLAUDE.md`.

## Requirements
Node >= 22.23.4, npm. Pinned versions: astro 7.4.12, tailwindcss and @tailwindcss/vite 4.3.5, gsap 3.15.1, @astrojs/sitemap 3.7.5, sharp 0.35.5,
@fontsource-variable/fraunces 5.3.0, @fontsource/be-vietnam-pro 5.3.0. Dev tools: @astrojs/check 0.9.12, typescript 6.x, playwright 1.63.0, @axe-core/playwright.

## Commands
```bash
npm install
npm run dev            # http://localhost:4321/vi/
npm run build          # static site in dist/
npm run preview        # serve dist/ (astro 7 runs it as a daemon, default http://localhost:4399 when started by the scripts)
npm run check          # astro check (types)
npm run verify         # check + build + i18n + SEO table + content + SEO + images gates
npm run verify:ui      # overflow, console errors, one h1, no-JS and reduced-motion visibility (add -- --quick for 2 viewports)
npm run verify:interact  # slider keyboard, menu trap, lightbox, FAQ, process, booking form, page wipe, motion toggle
npm run verify:a11y    # axe-core, 0 serious or critical
```
Playwright uses the preinstalled Chromium; if none is present run `npx playwright install chromium`.

## Environment variables
| Name | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Production origin, used for canonical, hreflang, sitemap, robots. Default `https://eco-arch.example` is a placeholder. |
| `PUBLIC_FORM_ENDPOINT` | URL that receives the booking form POST (FormData, `Accept: application/json`). Without it the form does NOT send data. |

## Structure
`src/content/vi.json, en.json` all text by key · `src/i18n/routes.ts` slug map · `src/views` page views (registered in `src/pages/[lang]/[...slug].astro`) ·
`src/components` sections · `src/motion` GSAP modules (each `initX()` returns `kill()`) · `src/scripts/form.ts` form enhancement ·
`src/assets/concept` illustration images (processed by astro:assets) · `scripts/` zero-token gates.

See `HANDOVER.md` for content, assets, motion, integrations, known limits and release steps. QA status: `docs/QA-REPORT.md`. Open decisions: `docs/OPEN-ITEMS.md`.
