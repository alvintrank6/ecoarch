## 06 Design System

## Brand update (supersedes the colour and type tables below)

Source: the owner's "Brand concept board" (olive palette, logo directions, Montserrat and Inter). Roles and checked contrast on Warm White #F7F4EE:

| Token | Colour | HEX | Use | Contrast |
|---|---|---|---|---|
| --bg | Warm White | #F7F4EE | page background | n/a |
| --text | Charcoal | #2F2F2F | body text | 12.2:1 |
| --muted | derived neutral | #5C5C57 | captions | 6.1:1 |
| --olive | Olive Green | #6E7F52 | logo, large type, graphics | 4.0:1 (large and graphics only) |
| --brand, --accent | Deep Olive (derived) | #4E5E37 | headings, buttons, links, focus | 6.4:1; Warm White on it 6.4:1 |
| --ink | dark olive (derived) | #36432A | CTA band, footer | Warm White on it 9.6:1 |
| --sand | Sand Beige | #D8C3A5 | labels, panels (Charcoal text only) | Charcoal 7.8:1 |
| --sage | Muted Sage | #A8B39E | accents on dark | 4.8:1 on ink |
| --terracotta | Terracotta | #B88A68 | illustrations only | 2.8:1, never text |
| --error | terracotta-derived | #8F4A2C | errors with icon and text | 6.0:1 |
| --gray | Soft Gray | #D9D9D9 | decorative | n/a |

Type: Montserrat variable for headings (600 and 700), Inter variable for body (400, 500). Logo: direction 02, mark (house, leaf, airflow) plus ECO ARCH wordmark. Deep Olive on Sand is 4.1:1, so headings on Sand panels use Charcoal.


Hướng thiết kế đã chọn là Phương án B: nền kem ấm, chữ nâu óc chó, xanh chàm làm màu thương hiệu, gạch nâu đỏ làm màu hành động. Phong cách lấy cảm hứng từ nhịp bố cục và độ thoáng của icco.com.vn, không sao chép. Mọi tỷ lệ tương phản dưới đây đã tính bằng code (WCAG 2.x). Token màu theo vai trò

| Token | Màu | HEX | Dùng cho | Tương phản |
|---|---|---|---|---|
| --bg | Kem | #F4EBDD | Nền trang | nền |
| --text | Nâu óc chó | #2E1D15 | Chữ chính | 13,64:1 trên kem |
| --muted | Nâu nhạt | #6B5648 | Chú thích, phụ đề | 5,83:1 trên kem |
| --brand | Xanh chàm | #22395B | Mảng nền tối, tiêu đề nhấn | 9,85:1 với chữ kem |
| --accent | Gạch nâu đỏ (Brick) | #9C4530 | Nút chính, liên kết, focus ring, lỗi | 5,37:1 trên kem; chữ kem trên Brick 5,37:1 |
| --accent-large | Terracotta | #B4533A | Chỉ chữ lớn (từ 24px) và đồ họa | 4,19:1 trên kem, không dùng cho chữ nhỏ |
| --success | Rêu (Moss) | #5D6B45 | Thành công | 4,86:1 trên kem, luôn kèm biểu tượng và chữ |
| --rose | Hồng terrazzo | #E6C3B1 | Nền trang trí, khung nhắc; không làm chữ | nâu óc chó trên rose 9,83:1; kem trên rose chỉ 1,39:1 |
| --border | Nâu óc chó độ mờ 18% | rgba(46,29,21,.18) | Đường kẻ, viền thẻ | trang trí |
| --error | Brick cộng biểu tượng cộng chữ | #9C4530 | Lỗi form | không chỉ dựa vào màu |
| --warning | Nâu óc chó trên nền rose | #2E1D15 trên #E6C3B1 | Lưu ý (ví dụ chú thích concept) | 9,83:1 |

Xanh chàm có chữ kem 9,85:1 dùng cho các mảng nền tối (CTA cuối, chân trang); khi đó focus ring đổi sang kem. Terracotta trên xanh chàm chỉ 2,35:1: không đặt chữ hoặc icon cần đọc lên nền đó. Chữ

|  |  |  | Vai trò | Font | Ghi chú |
|---|---|---|---|---|---|
|  |  |  | Tiêu | Fraunces Variable (@fontsource- | Trọng lượng 500 đến 600; in nghiêng dùng cho từ nhấn |
|  |  |  |  |  | Trọng lượn |
|  |  |  | đề | variable/fraunces 5.3.0: wght.css, wght-italic.css) |  |
|  |  |  |  |  |  |
|  |  |  | Thân | Be Vietnam Pro (@fontsource/be-vietnam-pro 5.3.0: 400, 500, 600) | Hỗ trợ dấu tiếng Việt; self-host, font-display: swap, chỉ tải subset vietnamese và latin |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

|  | Hỗ t |
|---|---|
|  |  |

|  |  |
|---|---|

| Cấp | clamp() trên 360 đến 1440px | Line-height |
|---|---|---|
| H1 | clamp(2.5rem, 2rem + 2.222vw, 4rem) | 1,1 |
| H2 | clamp(1.875rem, 1.583rem + 1.296vw, 2.75rem) | 1,15 |
| H3 | clamp(1.5rem, 1.375rem + 0.5556vw, 1.875rem) | 1,25 |
| H4 | clamp(1.25rem, 1.208rem + 0.1852vw, 1.375rem) | 1,3 |
| Thân lớn | clamp(1.125rem, 1.083rem + 0.1852vw, 1.25rem) | 1,6 |
| Thân | clamp(1rem, 0.9792rem + 0.09259vw, 1.062rem) | 1,6 |

Giới hạn độ dài dòng 60 đến 70 ký tự (max-width: 68ch). Chữ thân tối thiểu 16px trên mobile. Không cắt chữ khi bản dịch dài hơn; điều chỉnh cỡ chữ thay vì ép chiều cao. Khoảng cách, khung, đường nét Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96 (px). Padding dọc section: 64 trên mobile, 96 trên desktop (clamp). Container tối đa 1280px [GIẢ ĐỊNH]; lề ngang 16 (mobile), 24 (tablet), 32 (desktop). Lưới 4, 8, 12 cột theo breakpoint. Radius: 4 (ảnh, ô nhập), 8 (thẻ), 999 (nhãn dạng viên). Border 1px --border. Bóng: mặc định không; chỉ thẻ có thể bấm dùng một bóng nhẹ và không animate bóng. z-index: nền 0, sticky 20, thanh điều hướng 30, overlay 40, modal 50, toast 60. Focus ring: 2px Brick, offset 2px (kem trên mảng xanh chàm). Không bao giờ outline: none mà không thay thế. Motion: mọi thời lượng, easing, stagger lấy từ token mục 07, không tự đặt trong component. Component và trạng thái

| Component | Trạng thái bắt buộc | Ghi chú |
|---|---|---|
| Nút chính (Brick) | default, hover, focus-visible, active, disabled, loading | Cao tối thiểu 48px; loading giữ độ rộng; chữ kem |
| Nút phụ (viền) và liên kết chữ | default, hover (gạch chân 220ms), focus-visible, active | Liên kết có gạch chân, không chỉ dùng màu |
| Link điều hướng | default, hover, focus-visible, current (aria-current) | Gạch chân scaleX |
| Thẻ gói dịch vụ | default, hover (chỉ pointer fine), focus-within | Toàn thẻ là một link, tên gói là nhãn |
| Thẻ phương án | default, hover, focus-visible | Luôn kèm nhãn "Hình minh họa" |
| Slider trước/sau | default, focus-visible, dragging | input type=range có nhãn, phím mũi chỉnh được, 2 nhãn TRƯỚC và SAU là chữ thật |
| Accordion hỏi đáp | collapsed, expanded, focus-visible | button + aria-expanded, không animate chiều cao bằng layout nặng |
| Trường form | default, focus-visible, error, disabled | Nhãn luôn hiện; lỗi dùng Brick, biểu tượng, chữ, aria-describedby |

|  |  |
|---|---|

| Component | Trạng thái bắt buộc | Ghi chú |
|---|---|---|
| Thông báo form | loading, success, error | aria-live="polite", thành công dùng Moss cộng biểu tượng cộng chữ |
| Chuyển ngôn ngữ VI và EN | default, hover, focus-visible, current, disabled (chưa có bản dịch) | lang và hreflang trên link |
| Nhãn "Hình minh họa" | một trạng thái | Nền rose, chữ nâu óc chó (9,83:1), đặt dưới hoặc góc ảnh |
| Quy trình một bước | default, current, done | Trạng thái dùng số và chữ, không chỉ màu |
| Breadcrumb, chân trang, thanh CTA mobile | default, focus-visible | Thanh CTA mobile [CẦN XÁC NHẬN] |

Hướng ảnh: ánh sáng tự nhiên ấm, hạt màu kem, nâu óc chó, gạch, xanh chàm điểm; góc máy ngang tầm mắt, đường đứng thẳng. Hero chừa vùng trống 1/3 bên trái cho H1. Crop: 16:9 hero desktop, 4:5 hero và ảnh giới thiệu trên mobile, 3:2 ảnh phương án, 1:1 hay 4:3 thẻ gói (một kiểu duy nhất). Không đặt chữ lên vùng ảnh nhiều chi tiết; nếu cần, dùng lớp mờ nâu óc chó để đạt tối thiểu 4,5:1. Accessibility: một h1 mỗi trang, thứ tự heading theo nội dung chứ không theo kích thước; skip link đầu trang; vùng bấm 44x44; prefers-reduced-motion theo mục 07; màu không phải kênh duy nhất mang thông tin.
