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
- Exactly 3 packages, prices per m2 of design area: G1 Thiết kế sơ bộ (2D) 100.000 đ/m2; G2 Thiết kế kiến trúc (EN Architectural Design) 220.000 đ/m2; G3 Thiết kế kiến trúc và nội thất đồng bộ (EN Integrated Architectural and Interior Design) 340.000 đ/m2. Official English names follow the price-table image; Vietnamese names are translations [GIẢ ĐỊNH]. Package slugs: dich-vu/thiet-ke-so-bo-2d, dich-vu/thiet-ke-kien-truc, dich-vu/thiet-ke-kien-truc-noi-that (EN preliminary-design-2d, architectural-design, integrated-design). Free first consultation. Fee is by design area in contract. Construction, materials, furniture are quoted separately. Show prices as "100.000 đ/m²".
- Never publish revision rounds, payment split, total fees, discounts.
- No unverified claims: no energy/cooling numbers, reviews, awards, project counts, address, phone, email. Missing contact data: hide the element, log it.
- No demonstration/model home. No "Kiến trúc sư" title for Nguyễn Thị Thu. Hide section H-07 until real data exists.
- Every concept image carries caption "Hình minh họa" / "Illustration". Never use reference/ or watermarked images.
- No em dash or en dash in any copy. CTA primary VI "Đặt lịch trao đổi về khu đất", EN "Book a call about your plot". Secondary VI "Xem 3 gói dịch vụ", EN "See the 3 packages".
- Copy is final in docs/11-PAGES/Pxx.md and extracted to src/content/pages.json (scripts/extract-copy.py). Render copy from that JSON; never retype or rewrite it, never add claims. Shared UI strings (nav, footer, form, errors) go in src/content/vi.json and en.json. Routes /vi and /en use the slug map in docs/04.
- Page structure is fixed: home has exactly 5 sections, every other page exactly 4 (thank-you and 404 exempt). Each section is one element with a `data-section` attribute. Section type (HERO-HOME, CARDS, STEPS...) selects the effect package in docs/12 section 12.4.

## Design (the owner's brand concept board supersedes docs/06 colours and fonts; see docs/06 "Brand update")
Warm White #F7F4EE bg, Charcoal #2F2F2F text, muted #5C5C57, Olive Green #6E7F52 (logo, large type and graphics only), Deep Olive #4E5E37 brand/actions/links/buttons, ink #36432A dark sections, Sand Beige #D8C3A5 labels and panels (Charcoal text only), Muted Sage #A8B39E on dark, Terracotta #B88A68 illustrations only, error #8F4A2C. Playfair Display (Google Fonts, 600/700) for headings, Manrope (Google Fonts, 400-700) for body. Logo = direction 02 (mark + ECO ARCH wordmark) in src/components/Logo.astro. Focus ring 2px Deep Olive, offset 2px (Warm White on dark). Touch targets >=44px. Mobile-first; verify 360, 390, 768, 1024, 1440. Do not use the board's "Energy-Saving Spaces" value: no energy claims.

## Motion (details docs/07 and docs/12; docs/12 wins on conflict)
GSAP only in src/motion/*; CSS for micro-interactions. Effects are IDs from docs/07 (H, N, R, C, K, F, P) and docs/12 (A1-A15, T1-T6, B1-B4); use only those, with values from src/motion/tokens.ts. Each section gets the default package for its type (docs/12 section 12.4) plus the extra IDs in its row of docs/11-PAGES. Budgets are per page tier S/A/B (docs/12 section 12.5), counted by distinct effect IDs excluding the global defaults. Animate transform, opacity and clip-path only. No scroll-jacking, no smooth-scroll library, no flashing, quiet gap of at least 300 ms between effects. Hidden initial state only via CSS `html.js [data-reveal]` (never inline), so no-JS and reduced-motion show everything. Hero LCP image is never hidden. Louver curtain (T1) desktop only. Mobile runs at about 60% intensity (docs/12 section 12.6). Every init returns kill(); refresh ScrollTrigger after fonts and on resize. prefers-reduced-motion and `html[data-motion="reduced"]` disable all motion except opacity fades under 200 ms.

## Stack (exact pins)
astro 7.4.12, tailwindcss and @tailwindcss/vite 4.3.5, gsap 3.15.1, @astrojs/sitemap 3.7.5, sharp 0.35.5, fonts via Google Fonts (Playfair Display, Manrope). Node ≥22.23.4. Images in src/assets (astro:assets); public/ only for favicon, og image, robots.
Commands: npm run dev | build | check | verify | verify:ui | verify:interact | verify:motion | verify:a11y
