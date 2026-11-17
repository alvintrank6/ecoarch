## 09 Acceptance Criteria

Website được xem là xong khi đủ bảy điều kiện Definition of Done (SOP 11.3) có bằng chứng kiểm thử thật; điểm chưa xong ghi rõ trong `docs/QA-REPORT.md`, không dùng cụm "gần xong".

- [ ] 100% nội dung bắt buộc có mặt và đúng ngôn ngữ (VI, EN); không còn số liệu hay địa chỉ giả.
- [ ] Mọi route, CTA, link, form và trạng thái lỗi hoạt động; trang cảm ơn và 404 đúng.
- [ ] Responsive qua 5 viewport; không horizontal overflow; không cắt chữ.
- [ ] Chuyển động đúng mục 07 và mục 12 (v3), có reduced-motion, không kẹt giao diện, đúng ngân sách theo hạng trang. Trang chủ có đúng 5 section, mỗi trang nội dung P02 đến P20 có đúng 4 section, nội dung đúng mục 11.
- [ ] Accessibility, SEO, hiệu năng đạt ngân sách đã thống nhất (ngân sách số: [CẦN XÁC NHẬN]).
- [ ] Production build đã kiểm trên preview; tài liệu bàn giao đầy đủ.
- [ ] Điểm chưa hoàn tất được ghi rõ.

**Ma trận kiểm thử (SOP 10.1)**

| Nhóm | Kiểm tra tối thiểu | Điều kiện đạt |
| --- | --- | --- |
| Build | install, lint, typecheck, test, production build | Exit code 0, không cảnh báo nghiêm trọng |
| Responsive | 360x800, 390x844, 768x1024, 1024x768, 1440x900 | Không overflow, không cắt chữ, đúng blueprint mục 05 |
| Trình duyệt | Chrome và Edge, Safari (WebKit), Firefox | Điều hướng, form, chuyển động cốt lõi hoạt động |
| Accessibility | Bàn phím, focus, nhãn, tương phản, reduced motion | Không chặn thao tác; lỗi nghiêm trọng bằng 0 |
| Nội dung | VI và EN, dấu tiếng Việt, văn bản dài, link, liên hệ | Không thiếu, không cắt; khớp nguồn mục 02 |
| Chuyển động | Tải lần đầu, cuộn, resize, back và forward, tab ẩn | Không nháy, kẹt overlay, trùng trigger |
| Hiệu năng | Lighthouse, Web Vitals, throttling | Không tài nguyên vô lý; đạt ngân sách |
| CRO | CTA, ma sát form, bằng chứng, liên hệ trên mobile | Hành động chính rõ và đo được |

**Tiêu chí riêng của ECO ARCH**

| Mã | Tiêu chí | Cách kiểm |
| --- | --- | --- |
| A1 | Đúng 3 gói, đúng tên VI và EN, đúng slug; không nhắc Gói 4 | Tìm kiếm văn bản trên build |
| A2 | Giá chỉ công bố đúng 3 mức theo bảng giá (100.000, 220.000, 340.000 đ/m²), giống nhau ở mọi trang; không công bố số vòng sửa, tỷ lệ thanh toán, tổng phí | Tìm "đ/m²", "triệu", "vòng sửa" trên build: chỉ có 3 mức giá, không có số khác; không có "căn nhà trình diễn" |
| A3 | Mọi ảnh concept có nhãn "Hình minh họa"; ảnh 3 gói có dòng chú thích chung | Test e2e theo component |
| A4 | Không dùng ảnh có watermark SDC studio hay MOCAN | Quét thư mục public/assets so với manifest |
| A5 | Không dùng chức danh "Kiến trúc sư" cho Nguyễn Thị Thu khi chưa xác nhận | Tìm kiếm văn bản |
| A6 | Không hứa "giảm điện", "mát hơn" khi chưa có số đo | Tìm kiếm văn bản |
| A7 | Nói rõ ECO ARCH không thi công ở trang chủ, Phạm vi, FAQ | Kiểm nội dung |
| A8 | Form gửi được khi tắt JS; lỗi hiển bằng chữ và biểu tượng; có `aria-live` | Playwright |
| A9 | CTA chính đúng một câu trên mọi trang: "Đặt lịch trao đổi về khu đất" | Kiểm bản dịch EN: "Book a call about your plot" |
| A10 | Mỗi trang có đúng một `h1`; thứ tự heading hợp lý | axe và test e2e |
| A11 | Title tối đa 60 ký tự, meta tối đa 155 ký tự; không có gạch ngang dài trong văn bản | Script đếm trên build |
| A12 | canonical, hreflang vi, en, x-default đúng; P21 và 404 có noindex | Kiểm HTML |
| A13 | Chữ tương phản ≥ 4,5:1 (chữ lớn ≥ 3:1); focus ring thấy được trên nền kem và nền xanh chàm | axe và kiểm tay |
| A14 | Slider trước và sau dùng được bằng phím; nhãn TRƯỚC và SAU là chữ thật, có bản EN | Playwright |
| A15 | Mỗi trang đúng ngân sách chuyển động mục 07; không có hiệu ứng nằm trong danh sách cấm | Review chuyển động |
| A16 | Chính sách bảo mật đã được người có chuyên môn pháp lý rà soát trước khi đăng | Biên bản rà soát |

**Cổng trước khi đưa lên (SOP 11.1)**

- [ ] Production build chạy sạch và đã kiểm bản preview, không chỉ dev server.
- [ ] Biến môi trường có tài liệu; không commit secret.
- [ ] Miền, HTTPS, redirect www và không www, 404, canonical đúng.
- [ ] Form gửi đúng nơi; lỗi mạng và chống spam đã kiểm.
- [ ] Analytics, pixel chỉ cài khi được yêu cầu; privacy và cookie đã xử lý.
- [ ] Open Graph, favicon, sitemap, robots, dữ liệu cấu trúc đã xác nhận.
- [ ] Có cách rollback về bản trước.

QA độc lập: dùng PROMPT F (mục 10) ở phiên mới; chuyển động kiểm thêm theo danh sách ở cuối mục 07.
