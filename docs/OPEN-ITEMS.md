# OPEN-ITEMS (one line each: id | where | default used)
OI-01 | docs/10-CLAUDE-HANDOVER.md | PDF export left broken combining marks in section 10 text; not used as source, CLAUDE.md governs
OI-02 | docs/04 and docs/08 | docs/08 shows public/assets path; CLAUDE.md says src/assets, used src/assets
OI-03 | docs/01 Brief | Gói 2 and 3 names differ between price image and business report (docs/02); use names in docs/01 table
OI-04 | docs/*.md | PDF-to-Markdown conversion: verify any suspicious diacritics against the PDF if a string looks odd
OI-05 | astro.config.mjs, robots.txt | domain unknown, placeholder https://eco-arch.example; set PUBLIC_SITE_URL and robots.txt Sitemap line at deploy
OI-06 | public/og-default.jpg | OG image not yet created (S10); Seo.astro already references /og-default.jpg
OI-07 | Hero.astro | HERO-01 and HERO-01m not generated; ex-04-after (villa living room) used as interim hero image with 'Hình minh họa' label
OI-08 | PackageArt.astro | SVC-01..03 owner originals missing (only 200x150 crops); original SVG line illustrations used instead
OI-09 | Responsible.astro | H-07 hidden: no real data for Nguyễn Thị Thu (title, bio, photo); activates when team.* keys exist
OI-10 | BookingForm.astro | form action falls back to thank-you page when PUBLIC_FORM_ENDPOINT unset (static host cannot accept POST); provider unknown
OI-11 | home.process.* | 10-step list not in docs (company docx not provided); steps grouped into 4 stages are assumptions, owner to confirm
OI-12 | home.faq.a4 | 24h reply counts weekends or office hours not confirmed; stated as "24 giờ" per docs
OI-13 | form.timing options | timing choices (3 months / 3-6 / after 6 / undecided) are assumed
OI-14 | pkg.ideas.ai | Package 2: "người có chuyên môn kiểm tra" kept without naming who (docs: ai kiểm tra [CẦN XÁC NHẬN]); AI mention default per docs/02
OI-15 | pkg.*, services.* | Package 3 "hồ sơ chi tiết cho chuẩn bị thi công" and Gói 1 "pham vi quy trình" kept per docs defaults; price table conditions (VAT, min area, multi-storey, survey fee) not published
OI-16 | concept images | EX-07 (baked Vietnamese TRƯỚC/SAU labels) and EX-09 (no after image) not used; EX-08 split into halves for slider
OI-17 | about page | no ABOUT-01/ART1-01/ART2-01 images (not generated); About and articles are text only, article 1 uses the SVG sun/wind diagram
OI-18 | faqPage.scope.a3 | new-build scope stated as "book a call"; price list says renovation only (docs/02 [CẦN XÁC NHẬN])
OI-19 | privacy page | legal review required before publishing (A16); text built from docs/04 note, cites 91/2025/QH15 and 356/2025/NĐ-CP as written there; data recipient, retention period, controller details unknown
OI-20 | contact page | phone, email, address, hours hidden (add contact.* keys in vi.json/en.json when known)
OI-21 | BookingForm | without PUBLIC_FORM_ENDPOINT the JS flow logs a warning and goes to thank-you WITHOUT sending data: must set endpoint before launch
