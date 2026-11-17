## 10 CLAUDE.md, thi công và bàn giao

Mục này là bộ file để chép thẳng vào repo: CLAUDE.md ở gốc, các prompt thực thi, và gói bàn giao. Lệnh khởi động (SOP 4.1)

```
cd /duong-dan/den/website-project
claude doctor
claude --permission-mode plan
# Trong phiên Claude Code:
/init
/context
```

Plan Mode dùng cho giai đoạn phân tích; sau khi duyệt mới cho phép chỉnh sửa. /context để xác nhận CLAUDE.md đã tải. CLAUDE.md (bản cho ECO ARCH, dựa trên mẫu SOP 4.2)

```
# Vai trò
Bạn là Senior Frontend Developer kêm Lead UX/UI Designer tập trung vào CRO,
accessibility,
responsive, SEO kỹ thuật và motion có chủ đích, làm website ECO ARCH (tư vấn
thiết kế
kiến trúc và cải tạo nhà ̉ơ tại Hà Nội; ECO ARCH không thi công).
# Nguồn sự thật
- Luôn đọc docs/01-BRIEF.md và docs/09-ACCEPTANCE-CRITERIA.md trước khi lập
kế hoạch.
- Nội dung chính thức: docs/02-CONTENT-SOURCE.md và docs/04-CONTENT-
```

|  | BLUEPRINT.md. - Không tự bịa địa chı̉, giá, review, chứng nhận, số liệu kinh doanh, tên miền, điện thoại. - Nếu thiếu dữ liệu, ghi [CẦN XÁC NHẬN] hoặc [CẦN BÔ ̉SUNG] vào tài liệu phù hợp. - Thứ tự ưu tiên khi mâu thuẫn: SOP, hồ sơ công ty, prompt, sáng tạo. # Quy tắc riêng của dự án - Đúng 3 gói (xem mục 01). Chı̉ công bố giá theo m² của 3 gói như bảng giá ̉ơ mục 01; không công bố số vòng sửa, tỷ lệ thanh toán. Không nhắc căn nhà trình diễn hay công trình đã làm cho đến khi có thật. - Ảnh trong public/assets/concept là hình minh họa: luôn có nhãn "Hình minh họa". - Không dùng ảnh trong thư mục reference. Không dùng chức danh "Kiến trúc sư" khi chưa xác nhận. - Không dùng dấu gạch ngang dài trong văn bản hiên̉ thị. - CTA chính: "Đặt lịch trao đôỉ về khu đất" / "Book a call about your plot". # Quy trình bắt buộc 1. Đọc file liên quan và kiêm̉ tra code hiện có. 2. Nêu giả định, rủi ro và các file dự kiến sửa. 3. Thay đổi lớn: trình bày plan trước khi edit. 4. Thi công theo vertical slice nhỏ (docs/08-TECH-SPEC.md), chạy được và kiêm̉ thử được. 5. Sau mỗi slice: chạy lint, test, build và kiêm̉ tra responsive liên quan. 6. Không kết luận hoàn tất khi chưa kiêm̉ tra acceptance criteria. 7. Git: commit sau Foundation và sau mỗi slice đã qua build, không trộn refactor vào commit UI, lưu checkpoint trước thay đôỉ motion lớn, không push hay deploy nếu chưa được yêu cầu. # Kiến trúc và responsive - Stack: Astro, Tailwind qua npm, GSAP qua npm (docs/08-TECH-SPEC.md). Không CDN, không inline khôn̉g lồ. - Mobile-first: mobile, tablet, desktop, màn hình rất lớn. - Kiêm̉ 360, 390, 768, 1024, 1440 px. Không horizontal overflow; vùng bấm tối thiểu 44x44 px. # Motion - Tuân thủ docs/07-MOTION-SPEC.md, token và ngân sách trang. Không thêm hiệu ứng ngoài thư viện. - CSS cho micro-interaction; GSAP cho timeline và ScrollTrigger. - Ưu tiên transform và opacity; không scroll-jacking; hỗ trợ reduced motion. |  |
|---|---|---|

```
# i18n, accessibility, SEO, hiệu năng
- i18n là kiến trúc từ đầu (/vi, /en); không hard-code text thuộc locale.
- Semantic HTML, bàn phím, focus-visible, alt text, label cho form.
- Ảnh có width và height; lazy-load ngoài hero; không đê ̉animation che nội
dung khi JS lỗi.
# Kiêm̉ thử và an toàn
- Báo lệnh đã chạy và kết quả thực tế; không nói "đã kiêm̉ tra" nếu chưa chạy.
- Không xóa hay ghi đè tài nguyên người dùng ngoài phạm vi nhiệm vụ.
```

Giữ CLAUDE.md ngắn và không mâu thuẫn; quy trình dài hoặc quy tắc cho một nhóm file chuyển sang docs/ hoặc .claude/rules/ (SOP 4.2). Hook tùy chọn (SOP 4.3): tự format file sau mỗi lần Claude sửa.

```
{
"hooks": {
"PostToolUse": [{
"matcher": "Edit|Write",
"hooks": [{
"type": "command",
"command": "jq -r '.tool_input.file_path' | xargs npx prettier --
write"
}]
}]
}
}
```

### PROMPT E: thi công một lát cắt (SOP 9.2)

```
Thực thi Slice [SỐ/TÊN] theo implementation plan đã duyệt.
Trước khi sửa:
- Đọc CLAUDE.md và tài liệu liên quan trong docs/.
- Kiêm̉ tra code hiện tại, git diff và thay đôỉ của người dùng.
- Liệt kê ngắn các file sẽ sửa và acceptance checks của slice.
Trong khi thực thi:
- Viết code production-ready, không placeholder và không bỏ text.
- Không ghi đè thay đôỉ ngoài phạm vi.
- Semantic HTML, mobile-first và token đã chốt.
- Đúng MOTION-SPEC, gồm reduced-motion và cleanup.
- i18n không hard-code text thuộc locale.
- Dùng ảnh thật từ Asset Manifest; nếu thiếu, tạo fallback rõ và ghi TODO.
Sau khi sửa:
- Chạy formatter, lint, test và production build.
- Chạy smoke/visual check ̉ơ breakpoint liên quan.
- Sửa lỗi tìm thấy, không chı̉ báo lỗi.
- Tóm tắt file đã đổi, lệnh đã chạy, kết quả và điểm cần con người duyệt.
Không chuyển sang slice tiếp theo.
```

### PROMPT F: QA độc lập (SOP 10.3)

```
Đóng vai QA Engineer và CRO reviewer. Không tin vào mô tả trước đó;
hãy kiểm tra repository và chạy lệnh thực tế.
1. Đọc docs/09-ACCEPTANCE-CRITERIA.md và lập traceability checklist.
2. Chạy formatter/lint/typecheck/test/build.
3. Kiểm tra 360x800, 390x844, 768x1024, 1024x768, 1440x900.
4. Kiểm tra VI/EN, navigation, CTA, form, keyboard, focus, reduced motion.
5. Test motion khi reload, resize, back/forward, tab hidden, route change.
6. Tìm overflow, CLS, ảnh sai crop, text bị cắt và trigger trùng.
7. Chạy performance/accessibility audit phù hợp stack.
8. Sưả lỗi an toàn, chạy lại và tạo docs/QA-REPORT.md.
Báo cáo tách: Passed, Fixed, Remaining, Needs human review.
Không tuyên bố đạt nếu không có kết quả test hỗ trợ.
```

### PROMPT G: release và bàn giao (SOP 11.2)

| Chuẩn bị release candidate từ trạng thái hiện tại. - Chạy toàn bộ verification trong README và Acceptance Criteria. - Kiêm̉ tra production build trên preview environment. - Không đổi content/visual ngoài lỗi cần thiết. - Tạo hoặc cập nhật README và HANDOVER.md. - Liệt kê environment variables nhưng không ghi secret. - Ghi release note: thay đôỉ, test, known issues, rollback. - Chı̉ deploy/push khi tôi yêu cầu rõ. Nếu chưa, dừng ̉ơ trạng thái release-ready. PROMPT A đến D (content, UX, motion, tech) đã được thực hiện trong tài liệu này; chỉ chạy lại khi nội dung thay đổi lớn. Bộ prompt rút gọn hàng ngày (audit trước khi bắt đầu, sửa một vấn đề, tinh chỉnh animation, review git diff) lấy nguyên từ SOP mục 12. Gói bàn giao (SOP 11.2) Hạng mục Nội dung bàn giao cho ECO ARCH README Cài đặt, chạy dev, build, test, deploy Content src/content/vi.json, en.json, cách thêm trang và ánh xạ slug trong routes.ts Assets Quy tắc tên, kích thước, crop, nén (mục 03), asset-manifest.csv Motion Token, vị trí từng module, cách tắt bằng data-motion (mục 07) Integrations Form, analytics (nếu có), biến môi trường Known limits View Transitions phụ thuộc trình duyệt; form phụ thuộc bên thứ ba; ảnh minh họa cần thay bằng ảnh công trình thật khi có Release Commit, tag, URL, ngày deploy, ghi chú rollback |
|---|
|  |

| Hạng mục | Nội dung bàn giao cho ECO ARCH |
|---|---|
| README | Cài đặt, chạy dev, build, test, deploy |
| Content | src/content/vi.json, en.json, cách thêm trang và ánh xạ slug trong routes.ts |
| Assets | Quy tắc tên, kích thước, crop, nén (mục 03), asset-manifest.csv |
| Motion | Token, vị trí từng module, cách tắt bằng data-motion (mục 07) |
| Integrations | Form, analytics (nếu có), biến môi trường |
| Known limits | View Transitions phụ thuộc trình duyệt; form phụ thuộc bên thứ ba; ảnh minh họa cần thay bằng ảnh công trình thật khi có |
| Release | Commit, tag, URL, ngày deploy, ghi chú rollback |
