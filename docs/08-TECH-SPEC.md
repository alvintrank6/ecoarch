## 08 Tech Spec

Website đa trang, ưu tiên SEO, hai ngôn ngữ theo route, nên dùng **Astro (xuất tĩnh) + Tailwind + GSAP**, đúng gợi ý SOP 2.2 cho portfolio nhiều trang. Không React: không cần trạng thái phức tạp. Phiên bản dưới đây đã kiểm bằng `npm view` ngày 17/11/2026; Claude Code phải chạy lại `npm view` trước khi cài và ghim phiên bản trong `package-lock.json`.

| Gói | Phiên bản | Vai trò |
| --- | --- | --- |
| astro | 7.4.12 | Khung chính, SSG, routing, i18n, ảnh |
| tailwindcss, @tailwindcss/vite | 4.3.5 | Style theo token, qua pipeline npm (không CDN) |
| gsap | 3.15.1 | ScrollTrigger, DrawSVG, SplitText; giấy phép Standard no charge |
| @astrojs/sitemap | 3.7.5 | sitemap.xml có hreflang |
| sharp | 0.35.5 | Nén và đổi ảnh WebP, AVIF |
| @fontsource-variable/fraunces | 5.3.0 | Tiêu đề (wght.css, wght-italic.css) |
| @fontsource/be-vietnam-pro | 5.3.0 | Chữ thân (400, 500, 600) |

Node tối thiểu 22.23.4. Package manager: npm [GIẢ ĐỊNH]. Playwright, `@axe-core/playwright`, Lighthouse CI, ESLint, Prettier, `@astrojs/check`: cài bản mới nhất và ghi phiên bản thật vào README (chưa kiểm trong phiên này). Phương án đơn giản hơn nếu Astro gây vướng: Vite cộng HTML trực tiếp, mất routing và ảnh tự động.

**Cấu trúc thư mục**

```
website-project/
├─ CLAUDE.md
├─ docs/                 01-BRIEF.md ... 09-ACCEPTANCE-CRITERIA.md, HANDOVER.md, QA-REPORT.md
├─ public/assets/        ảnh đã đổi tên (concept/), favicon, og-default.jpg
├─ src/
│  ├─ content/           vi.json, en.json (văn bản theo locale)
│  ├─ i18n/              routes.ts, t.ts, hreflang.ts
│  ├─ components/        Nav, Hero, PackageCard, ConceptCard, Compare, Faq, Form, Footer, Seo
│  ├─ layouts/           Base.astro
│  ├─ pages/             [lang]/index.astro, [lang]/[...slug].astro, 404.astro, index.astro
│  ├─ styles/            tokens.css, global.css
│  └─ motion/            tokens.ts, hero.ts, nav.ts, reveal.ts, louver.ts, draw.ts, compare.ts, page-wipe.ts
└─ tests/                e2e/*.spec.ts, visual/, a11y/
```

**i18n và routing**

- Route `/vi` và `/en`; `routes.ts` ánh xạ slug VI và EN theo `id` trang (bảng ở mục 04). Mỗi trang đều có canonical tự trỏ, `hreflang` vi, en, x-default (về /vi).
- Không hard-code chữ: mọi chuỗi nằm trong `vi.json` và `en.json`; không ghép câu từ nhiều chuỗi. Thiếu key EN thì build báo lỗi (test kiểm đủ key hai phía).
- Trang gốc `/` chuyển sang `/vi` ở lớp hosting (301) và có trang dự phòng meta refresh. Không tự đổi ngôn ngữ theo trình duyệt; ghi nhớ lựa chọn bằng `localStorage` trong `try/catch` chỉ để gợi ý liên kết.
- Cập nhật `<html lang>` theo locale.

```
// src/i18n/routes.ts (ví dụ cấu trúc)
export const routes = {
  services: { vi: 'dich-vu', en: 'services' },
  prelim:   { vi: 'dich-vu/thiet-ke-so-bo-2d', en: 'services/preliminary-design-2d' },
  architectural: { vi: 'dich-vu/thiet-ke-kien-truc', en: 'services/architectural-design' },
  integrated: { vi: 'dich-vu/thiet-ke-kien-truc-noi-that', en: 'services/integrated-design' },
  // ... các trang còn lại theo bảng mục 04
} as const;
```

**SEO**

- Mỗi trang: title, meta description (chuỗi ở mục 04), canonical, Open Graph (OG-01), Twitter card, `hreflang`. JSON-LD: Organization (chỉ các trường có dữ liệu thật) và BreadcrumbList. FAQPage tùy chọn.
- `sitemap.xml` từ `@astrojs/sitemap` với `i18n`; loại P21 và 404. `robots.txt` cho phép tất cả và trỏ tới sitemap; trang cảm ơn và 404 dùng meta `noindex`.
- Tên miền, thông tin Organization (tên pháp lý, địa chỉ, điện thoại): [CẦN BỔ SUNG]. Không đặt `LocalBusiness` khi chưa có địa chỉ thật.

**Ảnh**

- Dùng `astro:assets` với sharp; WebP làm mặc định, AVIF nếu đủ thời gian; `srcset` 480, 768, 1200, 1600; luôn có `width` và `height`.
- Hero: một `<img>` với `fetchpriority="high"`, không lazy; mọi ảnh khác `loading="lazy"` và `decoding="async"`. Không preload toàn bộ ảnh.
- Nguồn ảnh lấy từ gói `eco-arch-images.zip` theo `asset-manifest.csv`; chữ nhãn "Hình minh họa" là text trong component.

**Form và tích hợp**

- Form HTML thật với `action` và `method="post"`; JS chỉ nâng cấp bằng `fetch` và thông báo `aria-live`. Endpoint đặt qua biến môi trường `PUBLIC_FORM_ENDPOINT`; nhà cung cấp, nơi nhận, thời gian lưu: [CẦN BỔ SUNG].
- Chống spam: trường honeypot và giới hạn tốc độ phía máy chủ; không CAPTCHA. Không ghi dữ liệu cá nhân vào URL.
- Analytics, pixel, bản đồ, booking: chưa dùng cho đến khi chủ dự án chốt [CẦN XÁC NHẬN]; nếu dùng cookie không thiết yếu thì cần banner đồng ý, chọn phương án ít riêng tư hơn trước.

**GSAP và chuyển động**

- Module nhập động theo trang (`draw.ts` và `compare.ts` chỉ tải ở trang cần). Mỗi module `init()` khi DOM sẵn sàng, trả `kill()`. Dùng `gsap.matchMedia()` cho mobile và reduced motion. Lớp `js` gắn lên `<html>` bằng script inline nhỏ trong `<head>`. Quy tắc chi tiết nằm ở mục 07.

**Kiểm thử và lệnh**

| Việc | Lệnh (npm scripts) | Điều kiện đạt |
| --- | --- | --- |
| Chạy dev | `npm run dev` | Mở được /vi và /en |
| Lint, format | `npm run lint`, `npm run format` | Exit code 0 |
| Kiểm kiểu | `npm run check` (astro check) | Không lỗi |
| Build | `npm run build` | Exit code 0, không cảnh báo nghiêm trọng |
| Xem thử bản build | `npm run preview` | Kiểm trên bản build, không chỉ dev |
| Smoke, visual | `npm run test` (Playwright) | 5 viewport: 360x800, 390x844, 768x1024, 1024x768, 1440x900 |
| A11y | `npm run test:a11y` (axe) | Lỗi nghiêm trọng = 0 |
| Hiệu năng | `npm run lighthouse` | Đạt ngân sách thống nhất [CẦN XÁC NHẬN: ngân sách] |

Trình duyệt: Chromium (Chrome, Edge), WebKit (Safari), Firefox thông qua Playwright. View Transitions xuyên trang là nâng cấp dần: trình duyệt không hỗ trợ vẫn điều hướng đúng.

**Lát cắt triển khai (SOP 9.1, mỗi lát cắt chạy được, kiểm được, rồi commit)**

| Lát | Nội dung | File dự kiến | Kiểm tra đạt |
| --- | --- | --- | --- |
| S1 | Foundation: scaffold, token, CSS toàn cục, routing, i18n, layout | package.json, astro.config, tokens.css, routes.ts, Base.astro, vi.json, en.json | Build sạch; /vi và /en; hreflang đúng; commit |
| S2 | Nav và Hero | Nav.astro, Hero.astro, nav.ts, hero.ts | 5 viewport; focus trap menu; H1 và CTA đọc được khi tắt JS; LCP không bị ẩn |
| S3 | Section chuẩn: H-05 trước và sau (nội dung, hình, chuyển động, test) | Compare.astro, compare.ts, louver.ts | Slider dùng phím; reduced motion; không trùng trigger khi resize |
| S4 | Các section còn lại của trang chủ | PackageCard, Faq, Footer, reveal.ts, draw.ts | Mọi section có vai trò; không overflow |
| S5 | Ba trang gói và trang Dịch vụ | pages/services | Nội dung đúng ảnh gói; chú thích concept |
| S6 | Phương án (4 trang), lightbox | pages/concepts, Lightbox | Ảnh trước và sau đúng cặp; nhãn minh họa |
| S7 | Giới thiệu, Quy trình (R7), Phạm vi, Kiến thức, Hỏi đáp | pages/\* | Sticky R7 có fallback mobile |
| S8 | Form, cảm ơn, 404, trạng thái lỗi | Form.astro, thank-you, 404 | Gửi được khi tắt JS; lỗi hiển rõ |
| S9 | Chuyển trang P1, P2, K2; tiến bộ nâng cấp | transitions.css, page-wipe.ts | Back và forward không kẹt; reduced tắt |
| S10 | SEO, JSON-LD, sitemap, tối ưu ảnh | Seo.astro, astro.config | Độ dài title và meta đúng; sitemap có hreflang |
| S11 | QA hồi quy, so sánh hình ảnh, build production | tests/\* | `docs/QA-REPORT.md` với Passed, Fixed, Remaining, Needs human review |

**Triển khai**

- Hosting: [CẦN XÁC NHẬN]. Xuất tĩnh nên chạy được trên mọi nơi làm hosting tĩnh. Miền: [CẦN BỔ SUNG].
- Biến môi trường (không ghi secret vào repo): `PUBLIC_SITE_URL`, `PUBLIC_FORM_ENDPOINT`.
- Cache: `/_astro/*` immutable; HTML ngắn hạn. Redirect: `/` sang `/vi`. Môi trường preview cho mỗi nhánh. Rollback: quay về bản deploy trước hoặc tag git trước.
- Không push hay deploy khi chưa được yêu cầu rõ.

**Rủi ro kỹ thuật:** (1) Astro 7 là phiên bản rất mới, API có thể khác ví dụ cũ; đọc tài liệu chính thức trước khi viết config. (2) PNG 2 đến 3 MB trong concept/ cần nén. (3) SplitText/DrawSVG chỉ dùng ở nơi cần để giữ bundle nhỏ. (4) Form phụ thuộc nhà cung cấp bên thứ ba.
