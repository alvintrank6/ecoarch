## 12 Motion Spec v3: hiệu ứng, transition và animation ở mức tối đa dễ chịu

Mục này nâng mục 07 (v2). Giữ nguyên token, đường cong, ID v2 (H, N, R, C, K, F, M, P) và các quy tắc dễ chịu cho mắt. Những gì v3 thay: ngân sách theo hạng trang (bảng dưới thay bảng “Ngân sách cứng mỗi trang” của mục 07), thêm ba nhóm hiệu ứng mới, gói hiệu ứng mặc định cho từng kiểu section, và bản đồ hiệu ứng theo từng section nằm trong cột cuối của mục 11.

**“Tối đa” nghĩa là gì.** Mật độ hiệu ứng cao nhất mà vẫn nằm trong giới hạn dễ chịu: không nhấp nháy quá 3 lần mỗi giây, không đảo sáng tối, luôn có khoảng nghỉ ít nhất 300 ms giữa hai nhóm chuyển động, không chiếm quyền cuộn, chỉ dùng transform, opacity và clip-path, và luôn tắt được bằng `data-motion="reduced"` hoặc prefers-reduced-motion. Tăng mật độ bằng nhiều hiệu ứng nhỏ, có ý nghĩa kiến trúc, thay vì một hiệu ứng lớn và gắt.

**Ba motif giữ nguyên.** Lam đứng (louver), nét vẽ mặt bằng (line draw), ánh nắng (sun path). Mọi hiệu ứng mới phải thuộc một trong ba motif này hoặc là vi tương tác; không có hiệu ứng trang trí ngẫu nhiên.

### 12.1 Nhóm A: chữ ký kiến trúc (15 hiệu ứng mới)

| ID | Hiệu ứng | Thông số | Ghi chú |
| --- | --- | --- | --- |
| A1 | H2 dạng mặt nạ theo dòng kèm nét kẻ chân | SplitText theo dòng, mỗi dòng trượt y 100% → 0 trong 800 ms, so le 80 ms; nét kẻ vẽ 0 → 100% trong 450 ms | Chỉ H2 và H3 lớn. Không áp cho đoạn văn. |
| A2 | Sản khóa đường ánh nắng | Cung SVG vẽ theo cuộn; điểm mặt trời di chuyển dọc cung; lớp ánh sáng chuyển mềm giữa hai trạng thái sáng và chiều (crossfade, không đổi nền) | Dùng cho SUNWIND. Không đưa góc nắng hay nhiệt độ cụ thể. |
| A3 | Dòng gió | 3 nét cong stroke-dashoffset, chạy 2 lượt rồi dừng | Không lặp vô hạn; không dùng chung với H5 trên cùng khung hình. |
| A4 | Mặt bằng sang phối cảnh theo cuộn | Pin 3 ảnh gói; SVC-01 → SVC-02 → SVC-03 chuyển bằng clip-path trượt dọc, mỗi bước ≈ 40% chiều cao viewport | Chỉ trên P02 (storytelling của trang). Mobile: chuyển thành 3 thẻ xếp dọc. |
| A5 | Parallax trong khung ảnh | Ảnh lớn hơn khung 8%; dịch y tối đa 6% theo cuộn | Chỉ desktop, hạng S và A. Không áp cho ảnh LCP. |
| A6 | Nút từ tính | Nút CTA chính bám con trỏ tối đa 6 px, trở về trong 220 ms | Chỉ thiết bị có chuột; tắt khi focus bàn phím. |
| A7 | Nhãn con trỏ theo ngữ cảnh | Con trỏ đổi thành nhãn “Kéo”, “Xem”, “Mở” trên slider, thẻ, ảnh | Mở rộng C3 của v2. Chỉ chuột; nhãn là đối tượng HTML, có aria riêng. |
| A8 | Thư viện cuộn ngang có bám điểm | scroll-snap-type x, thanh tiến độ mảnh dưới thư viện | Không dùng cuộn ngang bị chiếm quyền; người dùng vẫn cuộn đứng bình thường. |
| A9 | Vạch tiến độ đọc | Đường 2 px trên đỉnh, scaleX theo tiến độ cuộn | Mọi trang. Màu Brick. |
| A10 | Mục lục trong trang động | Danh sách bước cố định bên trái, mục đang đọc được làm đậm và có gạch chân | P12 (desktop). Mobile ẩn. |
| A11 | Thẻ gói xếp chồng | Thẻ sticky, thẻ sau trượt đè lên thẻ trước với scale 0.97 cho thẻ dưới | P02, desktop ≥ 1024. Mobile: thẻ xếp dọc thường. |
| A12 | Số bước cuộn | Số thứ tự “01 → 02” đổi bằng mặt nạ y 100 ms, không đếm số liệu | Chỉ đánh số bước, không dùng cho số tiền. |
| A13 | Menu hiện so le lần đầu | Mỗi liên kết nav hiện so le 40 ms; chỉ chạy một lần mỗi phiên (sessionStorage, bọc try/catch) | Không chạy lại khi đổi trang. |
| A14 | Chú thích ảnh trượt | Chú thích ảnh trượt lên 8 px và hiện trong 220 ms khi ảnh vào khung | Áp cho chú thích “Hình minh họa…”. Chú thích luôn có trong DOM. |
| A15 | Chân trang: chữ ECO ARCH lộ dần | Mặt nạ clip-path lộ từ trái sang phải trong 1000 ms khi chân trang vào khung | Mỗi trang, một lần; không dùng cho logo chính thức khi chưa có. |

### 12.2 Nhóm T: transition giữa trang và section (6 hiệu ứng)

| ID | Hiệu ứng | Thông số | Điều kiện |
| --- | --- | --- | --- |
| T1 | Màn lam khi đổi trang cấp trên | 5 lam đứng màu kem đậm, quét qua trong tổng ≤ 520 ms (ra 160, vào 360); tương phản thấp, không đảo sáng tối | Chỉ desktop và chỉ khi đi giữa các mục nav cấp trên. Không chạy khi back/forward. Không che ảnh LCP của trang đích quá 160 ms. |
| T2 | Morph phần tử dùng chung | Thẻ ảnh và tiêu đề chuyển thành hero của trang đích (View Transitions, view-transition-name theo ID) | Từ thẻ gói, thẻ phương án, thẻ bài viết. Mở rộng K2 của v2. Dự phòng: fade P1. |
| T3 | Chỉ báo nav trượt | Gạch chân mục nav trượt sang mục mới trong 450 ms | Desktop. Mobile: gạch chân đổi tức thì. |
| T4 | scene(): đạo diễn mặc định của section | Nét kẻ 0 ms, eyebrow 80, H2 160, đoạn 280, phương tiện ảnh 360 (ms); một timeline mỗi section | Thứ tự cố định để mọi section trông như cùng một bộ. |
| T5 | Cuộn tới neo | ScrollTo 700 ms, đường cong ease-inout | Mọi liên kết #neo. Tôn trọng reduced: nhảy tức thì. |
| T6 | Đổi ngôn ngữ | Crossfade nội dung 220 ms, vị trí cuộn được giữ | Mở rộng P3 của v2. |

### 12.3 Nhóm B: vi tương tác (4 hiệu ứng)

| ID | Hiệu ứng | Thông số |
| --- | --- | --- |
| B1 | Nút nhấn | scale 0.98 trong 120 ms khi nhấn, trở lại 220 ms |
| B2 | Gạch đầu mục tự vẽ | Dấu tích SVG vẽ stroke 450 ms khi mục vào khung |
| B3 | Số giá hiện theo mặt nạ | Mức giá hiện bằng mặt nạ y 100%, không đếm lên (để không gây hiểu nhầm về giá) |
| B4 | Mũi tên nhích | Mũi tên trong liên kết dịch 4 px khi hover/focus |

### 12.4 Gói hiệu ứng mặc định theo kiểu section

| Kiểu section | Gói hiệu ứng |
| --- | --- |
| HERO-HOME | H1 H2 H3 H4 H5 H6, N1, A9, B1 |
| HERO-PAGE | A1, R3 hoặc R4 cho ảnh, A5, R5, A9 |
| SUNWIND | A1, A2, A3, R6, R5 |
| CARDS | A1, R2, K1, T2, B1 |
| LADDER | A4, A11, K1, T2 |
| FEE | R5, R9, B3, A1 |
| COMPARE | R3, C1, C2, C3, A7 (và A8 nếu có nhiều cặp) |
| RAIL | A8, A7, K1, T2, R2 |
| SPLIT | A1, R3, A5, R9, B2 |
| TRIO | A1, R2, A12, R5 |
| STEPS | R7, A12, A10, R6, R1 |
| LIST | A1, R9, B2 |
| FAQ | F1, R9 |
| FORM | F2, F3, B1 |
| CONTACT, NOTE, LEGAL | A1, R9 hoặc R5 |
| CTA, CTA-FORM | A1, A6, R4, T4 |

### 12.5 Ngân sách theo hạng trang (thay bảng ngân sách cứng của mục 07)

| Hạng | Trang | Cinematic | Storytelling | Nhóm chạy đồng thời | Tween | Loại hiệu ứng | Ảnh lam trong 1 viewport |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S | P01, P02, P06, P12 | ≤ 2 | ≤ 2 | ≤ 4 | ≤ 24 | ≤ 16 | ≤ 3 |
| A | P03 đến P05, P07 đến P11, P13 đến P16, P18 | ≤ 1 | ≤ 1 | ≤ 3 | ≤ 16 | ≤ 12 | ≤ 2 |
| B | P17, P19, P20, P21, P22 | 0 | 0 | ≤ 2 | ≤ 8 | ≤ 6 | ≤ 1 |

Cách đếm loại hiệu ứng: mỗi ID khác nhau tính một, không tính nhóm mặc định toàn trang (H1 đến H6, N1, A1, A9, B1, B4, T4, P2). Trên mọi trang: JS chuyển động ≤ 80 KB gzip [GIẢ ĐỊNH]; ScrollTrigger ≤ 30 (dùng batch); `will-change` chỉ bật trong lúc tween; chỉ transform, opacity, clip-path; hero LCP không bao giờ bị ẩn hay phủ; không parallax chữ; chỉ một vòng lặp vô hạn (H5) và phải dừng khi tab ẩn.

### 12.6 Mobile, truy cập và dự phòng

- Mobile ở khoảng 60% cường độ: y 12 px thay vì 24, 3 lam thay vì 5, bỏ A5, A6, A7, A10, A11, bỏ T1; A4 thành thẻ xếp dọc.
- `prefers-reduced-motion` và nút `data-motion="reduced"`: mọi nội dung hiện ngay, không morph, không parallax, không vẽ nét; chuyển trang dùng fade 160 ms hoặc không chuyển.
- Không JS: mọi nội dung `[data-reveal]` vẫn đọc được; chỉ ẩn khi `html.js` đã có.
- T1 và T2 phải có dự phòng khi trình duyệt không hỗ trợ View Transitions: dùng P1.
- Quy tắc cấm từ v2 vẫn hiệu lực: không đổi màu nền bằng tween, không nhấp nháy, không scroll-jacking, không thứ gì tự chạy lại khi người dùng đang đọc.

### 12.7 Kiểm thử hiệu ứng

- Mỗi trang đúng số section (trang chủ 5, các trang nội dung 4) và mỗi section có đúng gói hiệu ứng mặc định của kiểu của nó.
- Đếm tween, ScrollTrigger, loại hiệu ứng theo hạng trang ở trên; fail nếu vượt.
- Chạy với JS tắt, với reduced motion, và với CPU throttle 4x: không thấy nội dung bị ẩn, không tràn ngang, LCP không tăng so với bản không hiệu ứng quá 200 ms.
- Quay video kiểm tra bằng tay: không có hiệu ứng nào lặp quá 3 lần/giây, không có đổi sáng tối toàn khung.
