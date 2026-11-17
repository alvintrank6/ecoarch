## 01 Project Brief

Website giúp chủ nhà ở Hà Nội hiểu ECO ARCH làm gì, nhận gì và dừng ở đâu, rồi **đặt lịch trao đổi về khu đất**. ECO ARCH là đơn vị tư vấn thiết kế kiến trúc và cải tạo nhà ở, không thi công.

| Nhóm (SOP 3.1) | Nội dung |
| --- | --- |
| Doanh nghiệp | ECO ARCH. Tư vấn thiết kế kiến trúc, nội thất, cải tạo theo hướng sinh thái. Địa bàn Hà Nội. Dự kiến hoạt động từ 06/2027 (hồ sơ công ty, dự thảo). Phạm vi: nhà phố, nhà ống, nhà mặt đất, biệt thự, căn hộ chung cư, dãy trọ, văn phòng nhỏ. Không thi công. Giờ mở cửa, địa chỉ, điện thoại, email: [CẦN BỔ SUNG] |
| Điểm khác biệt | Phân tích nắng gió, thông gió, chiếu sáng tự nhiên, chống nóng, vật liệu bền, và bảng giải thích vì sao chọn phương án. Không hứa "giảm điện" hay "mát hơn" khi chưa có số đo |
| Khách hàng | Chủ nhà sắp xây mới hoặc cải tạo ở Hà Nội. Nỗi đau: nhà nóng, bí, thiếu sáng; sợ hồ sơ không đủ để thi công; sợ phát sinh. Rào cản: chưa biết phạm vi từng gói, chưa tin đơn vị mới. Ngôn ngữ: tiếng Việt chính, tiếng Anh phụ |
| Mục tiêu | CTA chính: **Đặt lịch trao đổi về khu đất**. CTA phụ: **Xem 3 gói dịch vụ**. KPI: số form gửi đi, tỷ lệ hoàn thành form, lượt xem trang gói. Hành động mong muốn: gửi địa điểm, loại công trình, thời điểm dự kiến |
| Thương hiệu | Ấm, mộc, rõ ràng, trang trọng vừa phải. Nên dùng: phạm vi, hồ sơ, nắng gió, giải thích, bàn giao. Tránh: "đẳng cấp", "độc nhất", "giảm X% điện", "cam kết mát" |
| Nội dung | 3 gói dịch vụ, quy trình 10 bước, phạm vi bàn giao, 2 bài viết, FAQ, đặt lịch, liên hệ, chính sách bảo mật. Chưa có review khách hàng, chưa có công trình đã nghiệm thu |
| Ràng buộc | Deadline: [CẦN XÁC NHẬN]. Stack: Astro (mục 08). Hosting: [CẦN XÁC NHẬN]. Pháp lý: chưa có giấy đăng ký, mã số thuế, địa chỉ trụ sở trong nguồn. Ảnh: toàn bộ ảnh do chủ dự án tự tạo, dùng làm concept |

**Một câu mục tiêu:** Website tồn tại để một chủ nhà ở Hà Nội gửi được yêu cầu đặt lịch trao đổi về khu đất trong dưới 2 phút, sau khi đã hiểu ba gói và phạm vi hồ sơ.

**Ba gói dịch vụ (đã chốt theo ảnh người dùng gửi):**

| Gói | Tên VI | Tên EN | Slug VI | Slug EN |
| --- | --- | --- | --- | --- |
| 1 | Thiết kế sơ bộ (2D) | Preliminary Design (2D) | /vi/dich-vu/thiet-ke-so-bo-2d | /en/services/preliminary-design-2d |
| 2 | Thiết kế kiến trúc | Architectural Design | /vi/dich-vu/thiet-ke-kien-truc | /en/services/architectural-design |
| 3 | Thiết kế kiến trúc và nội thất đồng bộ | Integrated Architectural and Interior Design | /vi/dich-vu/thiet-ke-kien-truc-noi-that | /en/services/integrated-design |

Đã xác nhận: phân tích nắng gió có trong cả ba gói; Gói 3 gồm trọn Gói 1 và Gói 2; kết cấu, điện, cấp thoát nước nằm trong hồ sơ chi tiết Gói 3 (theo cách tôi hiểu câu trả lời "1. có"); nội thất thuộc Gói 3; MEP chuyên sâu nhận theo yêu cầu riêng; ba ảnh gói do chủ dự án tạo. Giá theo m² của ba gói được công bố theo bảng giá ngay dưới; không công bố số vòng sửa, tỷ lệ thanh toán, tổng phí dự án.

**Bảng giá công bố (từ ảnh "Bảng giá thiết kế cải tạo nhà ở", gửi ngày 17/11/2026):**

| Gói | Giá | Nhận gì (theo bảng giá) |
| --- | --- | --- |
| 1 | 100.000 đ/m² | Một phương án mặt bằng 2D; ghi chú công năng, nắng và thông gió |
| 2 | 220.000 đ/m² | Mặt bằng, mặt đứng, mặt cắt; phối cảnh kiến trúc |
| 3 | 340.000 đ/m² | Kiến trúc và nội thất đồng bộ; bố trí, vật liệu, ánh sáng và phối cảnh |

Tư vấn ban đầu miễn phí. Phí tính theo diện tích thiết kế trong hợp đồng. Thi công, vật tư và đồ nội thất báo giá riêng. Bảng giá ghi "cải tạo nhà ở": phạm vi xây mới chưa được nêu [CẦN XÁC NHẬN]. Điều kiện áp dụng chưa có: đã hay chưa gồm VAT, diện tích tối thiểu, cách tính nhà nhiều tầng, phí khảo sát và đi lại [CẦN XÁC NHẬN]. Tên Gói 2 và Gói 3 trong ảnh khác báo cáo kinh doanh: xem mục 02.

**Definition of Ready (SOP 3.4):**

- [x] CTA chính và mục tiêu viết thành một câu.
- [x] Nội dung gốc phân loại; mâu thuẫn lớn còn lại nằm ở mục 02.
- [x] Asset Manifest cho biết ảnh có thật và ảnh còn thiếu (mục 03).
- [x] Ngôn ngữ (VI, EN), routing (/vi, /en), form, hosting đã nêu; hosting còn [CẦN XÁC NHẬN].
- [x] Website tham khảo kèm lý do (icco.com.vn: học nhịp bố cục và độ thoáng, không sao chép; tạm bỏ qua ICCO Studio theo yêu cầu).
- [ ] Người duyệt nội dung và người quyết định cuối: [CẦN XÁC NHẬN] tên.
