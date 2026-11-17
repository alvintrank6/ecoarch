# ECO ARCH website. Astro 7 SSG + Tailwind 4 + GSAP 3. Hanoi architecture/interior design consultancy. It does NOT build.
Truth = docs/*.md (decided). Priority: SOP > company facts > docs > creativity. Do not re-debate or re-derive decisions.

## Protocol (token discipline)
1. One slice per session. Start: read docs/PROGRESS.md, then ONLY the files/IDs the slice prompt lists.
2. Read narrowly: `grep -n` then `sed -n 'a,bp'`. Never cat a docs file over 150 lines. Never open images, dist/, lockfile.
3. Plan ≤8 lines. Write whole new files in one Write; use Edit for changes; no read-back after Write/Edit.
4. Trim command output: `cmd 2>&1 | tail -n 25`. Fix from the first error only.
5. Verify cheap to costly: `npm run check` mid-slice; at slice end `npm run verify`, then `npm run verify:ui -- --quick` for UI slices. Screenshot only if a gate fails, one viewport, then re-run the gate.
6. Missing or ambiguous data: use the docs default, add one line to docs/OPEN-ITEMS.md (id | where | default used), continue. Never invent facts. Ask only if blocked or irreversible.
7. End of slice: git commit `feat(Sx): ...`; overwrite docs/PROGRESS.md (≤30 lines); final report ≤10 lines (done / gates / open items). No recap, no narration, no echoing file contents.
8. After 2 failed fixes of the same gate: stop, write the blocker to PROGRESS.md, report.

## Hard content rules (scripts/check-content.mjs enforces)
- Exactly 3 packages, prices per m2 of design area: G1 Thiết kế sơ bộ (2D) 100.000 đ/m2; G2 Thiết kế ý tưởng (3D) 220.000 đ/m2; G3 Thiết kế kiến trúc và nội thất hoàn chỉnh 340.000 đ/m2. Free first consultation. Fee is by design area in contract. Construction, materials, furniture are quoted separately. Show prices as "100.000 đ/m²".
- Never publish revision rounds, payment split, total fees, discounts.
- No unverified claims: no energy/cooling numbers, reviews, awards, project counts, address, phone, email. Missing contact data: hide the element, log it.
- No demonstration/model home. No "Kiến trúc sư" title for Nguyễn Thị Thu. Hide section H-07 until real data exists.
- Every concept image carries caption "Hình minh họa" / "Illustration". Never use reference/ or watermarked images.
- No em dash or en dash in any copy. CTA primary VI "Đặt lịch trao đổi về khu đất", EN "Book a call about your plot". Secondary VI "Xem 3 gói dịch vụ", EN "See the 3 packages".
- All text lives in src/content/vi.json and en.json by key; both locales complete; routes /vi and /en with the slug map in docs/04. Write body copy yourself from each section's stated intent: short, concrete, VI first, EN faithful not literal, nothing beyond docs.

## Design (details docs/06)
cream #F4EBDD bg, walnut #2E1D15 text, muted #6B5648, indigo #22395B brand, Brick #9C4530 accent/error/focus, terracotta #B4533A large text and graphics only and never on indigo, moss #5D6B45 success. Fraunces variable for headings, Be Vietnam Pro 400/500/600 for body. Fluid type by clamp as in docs/06. Focus ring 2px Brick, offset 2px. Touch targets ≥44px. Mobile-first; verify 360, 390, 768, 1024, 1440.

## Motion (details docs/07)
GSAP only in src/motion/*; CSS for micro-interactions. Motifs: Rise, Unmask, Wipe. Use only tokens from src/motion/tokens.ts. Per page: ≤1 cinematic moment, ≤1 loop, ≤3 concurrent effect groups, ≤12 tweens. Animate transform and opacity only. No scroll-jacking, no smooth-scroll library. Hidden initial state only via CSS `html.js [data-reveal]` (never inline), so no-JS and reduced-motion show everything. Hero LCP image is never hidden. Every init returns kill(); refresh ScrollTrigger after fonts and on resize. prefers-reduced-motion and `html[data-motion="reduced"]` disable all motion. No effect outside the docs/07 library.

## Stack (exact pins)
astro 7.4.12, tailwindcss and @tailwindcss/vite 4.3.5, gsap 3.15.1, @astrojs/sitemap 3.7.5, sharp 0.35.5, @fontsource-variable/fraunces 5.3.0, @fontsource/be-vietnam-pro 5.3.0. Node ≥22.23.4. Images in src/assets (astro:assets); public/ only for favicon, og image, robots.
Commands: npm run dev | build | check | verify | verify:ui
