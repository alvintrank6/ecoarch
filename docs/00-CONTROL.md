## 00 Kiểm soát tài liệu

Đây là nguồn sự thật duy nhất để dựng website ECO ARCH bằng Claude Code: mỗi mục dưới đây tương ứng một file trong docs/ theo quy trình 10 giai đoạn, chia ra file khi bắt đầu thi công.

| Mục trong tài liệu | File trong repo | Giai đoạn SOP |
|---|---|---|
| 01 Project Brief | docs/01-BRIEF.md | 1 Chuẩn bị |
| 02 Content Source | docs/02-CONTENT-SOURCE.md | 1 Chuẩn bị |
| 03 Asset Manifest, Image Prompts | docs/03-ASSET-MANIFEST.md | 1 Chuẩn bị |
| 04 Content Blueprint | docs/04-CONTENT- BLUEPRINT.md | 3 Content và sitemap |
| 05 Sitemap và UX | docs/05-SITEMAP-UX.md | 3 và 4 |
| 06 Design System | docs/06-DESIGN-SYSTEM.md | 4 UX và design |
| 07 Motion Spec v2 | docs/07-MOTION-SPEC.md | 5 Motion |
| 08 Tech Spec | docs/08-TECH-SPEC.md | 6 Technical |
| 09 Acceptance Criteria | docs/09-ACCEPTANCE- CRITERIA.md | 8 QA |
| 10 CLAUDE.md, bàn giao, tự kiểm tra | CLAUDE.md, docs/HANDOVER.md | 2, 7, 9 |

Thứ tự ưu tiên khi các nguồn mâu thuẫn: file quy trình (SOP) trước, rồi hồ sơ công ty ECO ARCH, rồi prompt vai trò, rồi sáng tạo. Mọi dữ liệu chưa có nguồn đều gắn nhãn, không điền giả.

| Nhãn | Nghĩa |
|---|---|
| [CẦN BỔ SUNG] | Dữ kiện chưa có (tên miền, địa chỉ, điện thoại, chứng chỉ, ảnh thật) |
| [CẦN XÁC NHẬN] | Đã có đề xuất, chờ chủ dự án quyết |
| [GIẢ ĐỊNH] | Điều tôi giả định để đi tiếp, có thể sai |

Chế độ dự án: Production Mode, không dùng Prototype (SOP 2.2). Người duyệt nội dung và người quyết định cuối: chủ dự án ECO ARCH, [CẦN XÁC NHẬN] tên cụ thể nếu có hơn một người. Cách dùng với Claude Code: chép mục 10 vào CLAUDE.md, tách các mục 01 đến 09 thành file như bảng trên, chạy claude --permission-mode plan, rồi thi công từng vertical slice (mục 08, bảng lát cắt). Không yêu cầu Claude dùng lịch sử chat; chỉ đọc file trong docs/.
