## 05 Sitemap và UX

Sitemap gồm 20 trang nội dung, mỗi trang có bản VI và EN, cộng trang cảm ơn và 404; trang đặt lịch là đích của mọi nhánh.

&#91;embedded content: sitemap · 20 trang nội dung, 1 đích chuyển đổi]

Các nhánh đều có nút Đặt lịch trên thanh điều hướng; đường ngắn nhất tới form là trang chủ rồi đặt lịch, hai lần chạm.

**Luồng chính:** vào trang chủ hoặc bài kiến thức → hiểu 3 gói và phạm vi → xem phương án minh họa → đặt lịch → trang cảm ơn nói rõ 24 giờ và nên chuẩn bị gì.

**Điều hướng**

- Thanh trên: logo, Dịch vụ, Phương án, Quy trình, Kiến thức, Giới thiệu, chuyển VI | EN, nút **Đặt lịch** nổi bật duy nhất. Chỉ một CTA chính trong thanh.
- Mobile: nút mở panel; focus trap, ESC, trả focus về nút. Thanh CTA cố định ở đáy màn hình [CẦN XÁC NHẬN]: chỉ bật trên trang dịch vụ và phương án, ẩn khi form đang trong khung nhìn.
- Chân trang: Liên hệ, Hỏi đáp, Phạm vi, Chính sách bảo mật, chuyển ngôn ngữ. Chuyển ngôn ngữ giữ nguyên trang hiện tại (ánh xạ slug), không về trang chủ.
- Breadcrumb trên trang con; `aria-current="page"` cho mục đang xem.

**Layout theo breakpoint (SOP 6.1)**

| Breakpoint | Nguyên tắc cho ECO ARCH | Điểm kiểm tra |
| --- | --- | --- |
| 360 đến 479 | Một cột; CTA trong hero; ảnh crop dọc 4:5; thẻ gói xếp dọc; slider trước/sau kéo bằng ngón tay và có nút | Không overflow; chữ tối thiểu 16px; vùng bấm tối thiểu 44x44 |
| 480 đến 767 | Một cột rộng; phương án dùng lưới 2 cột nhẹ | Khoảng trắng và tỷ lệ ổn định |
| 768 đến 1023 | Lưới 2 cột; thẻ gói 3 cột chỉ khi đủ chỗ, không thì 2 cột cộng 1; thanh điều hướng thu gọn | Không chỉ phóng to mobile |
| 1024 đến 1439 | Lưới 12 cột; hover là bổ sung; trang Quy trình dùng sticky | Max-width nội dung, độ dài dòng 60 đến 75 ký tự, focus rõ |
| 1440 trở lên | Tăng khoảng thở, giới hạn chiều rộng nội dung (container tối đa 1280px) [GIẢ ĐỊNH] | Không kéo dài dòng chữ |

**Trạng thái rỗng, lỗi và dự phòng**

- Không JavaScript: mọi nội dung hiện, menu là danh sách liên kết, form gửi được bằng POST thường.
- Trang chưa có bản dịch: không để lỗi; nút chuyển ngôn ngữ ở trạng thái disabled kèm chú thích.
- Section người phụ trách (H-07): ẩn cho đến khi có dữ liệu thật, không để khung trống.
- Slider trước/sau: nếu chỉ có một ảnh (EX-09), hiện ảnh đơn với nhãn "hiện trạng".
- Form lỗi mạng: giữ nguyên dữ liệu đã nhập, hiện lỗi bằng chữ và biểu tượng, không chỉ màu.

**Rủi ro CRO và cách xử lý:** (1) nhiều CTA cạnh tranh: chỉ dùng 1 chính và 1 phụ trên trang chủ; (2) hình đẹp bị hiểu nhầm là công trình thật: chú thích concept cố định; (3) giá theo m² công bố ở thẻ gói và trang Dịch vụ: FAQ giải thích cách tính theo diện tích thiết kế trong hợp đồng, phần báo giá riêng (thi công, vật tư, đồ nội thất) và điều kiện áp dụng [CẦN XÁC NHẬN]; (4) hiệu ứng làm chậm form: không animation trên trang đặt lịch ngoài phản hồi trạng thái.
