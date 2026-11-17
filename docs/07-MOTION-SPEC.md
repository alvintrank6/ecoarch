## 07 Motion Spec v2

Bản nâng cấp: website có nhiều hiệu ứng, chuyển trang và chuyển động hơn bản 1 (khoảng 30 hiệu ứng có tên thay vì 3), nhưng mọi hiệu ứng đều là biến thể của ba motif, đều có lý do kiến trúc, và bị chặn bởi ngân sách, quy tắc dễ chịu cho mắt và danh sách cấm. Ý tưởng chủ đạo: chuyển động lấy từ ngôn ngữ bản vẽ, gồm lam đứng mở ra, nét mảnh vẽ dần thành mặt bằng, ánh nắng sớm lướt qua một lần, ảnh trước và sau trượt theo đường cắt. Ưu tiên theo SOP: hỗ trợ prefers-reduced-motion, không scroll-jacking, không ẩn nội dung khi JS lỗi. Ba motif và các biến thể

| Motif | Ý nghĩa | Biến thể (mã hiệu ứng) |
|---|---|---|
| M1 Rise | Nội dung đọc được nổi lên theo thứ tự đọc | H2, H3, R1, R2, R5, R8, R9, K1, F1, N3 |
| M2 Unmask | Mở ra hình ảnh như mở lam và cửa | H1, H4, R3, R4, M1 |
| M3 Wipe (cắt đôi) | So sánh và nối hai trạng thái, vẽ đường nét | C1, C2, R6, R7, P1, P2 |

### Token chuyển động (dùng chung, đặt trong src/motion/tokens.ts và CSS variables)

| Token | Giá trị | Cách dùng |
|---|---|---|
| --dur-instant | 120ms | Phản hồi nhấn |
| --dur-fast | 220ms | Hover, focus, icon, gạch chân |
| --dur-base | 450ms | Hiện thẻ, chữ ngắn |
| --dur-slow | 800ms | Ảnh lớn, mở lam |
| --dur-draw | 1000ms | Vẽ nét SVG (tính là slow mở rộng, tối đa 2 lần mỗi trang) |
| --dur-cine | 1200ms | Chỉ 1 khoảnh khắc cinematic mỗi trang (SOP 1100 đến 1300ms) |
| --dur-page-out, -- dur-page-in | 160ms, 320ms | Chuyển trang |
| --ease-out | cubic-bezier(.22,1,.36,1) | Hầu hết hiệu ứng vào |
| --ease-inout | cubic-bezier(.65,0,.35,1) | Overlay, chuyển trang, lam |
| --ease-emphasis | power3.out | H1 và tiêu đề section |
| --rise | 24px (mobile 12px) | Quãng đường Rise; không dùng 48px |
| --stagger | 80ms, tối đa 5 phần tử, tổng dưới 700ms | Nhóm phần tử |
| --parallax | tối đa 4% (SOP 3 đến 6%), chỉ hero | Không dùng ở nơi khác |
| --lift | -4px, scale 1,01 | Chỉ thẻ bấm được, pointer fine |
| --slats | 5 lam desktop, 3 lam mobile | Hiệu ứng mở lam R3 |

### Quy tắc chung cho mọi hiệu ứng (SOP 7.2)

Chỉ animate transform và opacity. Không animate width, height, top, left, blur, filter hoặc bóng lớn. will-change chỉ bật trong lúc chạy và gỡ sau đó. Nội dung chỉ bị ẩn khi <html> có lớp js và phần tử chưa vào vùng quan sát. Không có JS thì mọi thứ hiện sẵn. Ảnh hero LCP không bao giờ bị ẩn; chỉ scale 1,04 về 1. ScrollTrigger mặc định start: "top 85%", once: true cho nội dung đọc. Chỉ dùng scrub ở R7 và hero parallax. Phần tử đang ẩn mà nhận focus hoặc được nhảy tới bằng anchor thì hiện ngay (focusin, hashchange). Thứ tự DOM luôn đúng thứ tự đọc. Nút vẫn nhận click trong và sau animation. Cleanup: mỗi module trả về kill(); gọi khi rời trang, khi matchMedia đổi, và trên

```
pagehide. Resize chỉ ScrollTrigger.refresh(), không tạo lại trigger. pageshow với
```

persisted phải gỡ overlay và khôi phục trạng thái. Tab ẩn: dừng mọi vòng lặp (visibilitychange). Trở lại không chạy dồn. prefers-reduced-motion: reduce: bỏ parallax, scrub, ánh sáng lướt, mở lam, vẽ nét, plate wipe, auto-demo slider và cursor tùy chỉnh; thẻ và chữ chỉ fade 150 đến 200ms hoặc hiện tức thì. Mobile (dưới 768px hoặc pointer coarse): bỏ parallax, ánh sáng lướt, cursor, magnetic; 3 lam thay 5 lam. Hover không bao giờ là nơi duy nhất chứa thông tin. GSAP 3.15.1 và toàn bộ plugin (ScrollTrigger, DrawSVG, SplitText, Flip) nằm trong gói npm gsap, giấy phép "Standard no charge" (đã kiểm bằng npm view và npm pack -- dry-run ngày 17/11/2026). Vẫn đọc điều khoản trên gsap.com/standard-license trước khi đưa lên production. Không dùng Lenis, Framer và ScrollSmoother (SOP cấm scroll-jacking). Thư viện hiệu ứng, nhóm 1: mở đầu trang, điều hướng, hero

| ID | Hiệu ứng và lý do | Phần tử, trạng thái đầu → cuối | Trigger, lặp |  |  | Thời lượng, easing |  |  | Mobile và reduced |  | Rủi ro, cleanup |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H0 | Không preloader. Giữ LCP nhanh, không loading giả | Skeleton cùng layout chỉ khi mạng chậm | Tự động |  |  | Không |  |  | Như desktop |  | Không |  |  |
| H1 | Ảnh hero hạ xuống: cho cảm giác ngôi nhà "được nhìn lại" | .hero-media, scale 1,04 → 1, không đổi opacity | Khi js sẵn sàng, một lần |  |  | 1200ms -- |  |  | Giữ; reduced: không scale |  | Chỉ transform; gỡ will-change khi xong |  |  |
|  |  |  |  |  |  |  |  | -- | Giữ; |  |  |  |  |
|  |  |  |  |  |  | ease-out |  |  |  |  |  |  |  |
| H2 | Chữ hero nhô lên theo dòng. Giữ H1 đọc được ngay | Eyebrow và dòng H1 trong mask overflow:hidden, yPercent 105 → 0 | Sau H1, một lần |  |  | 450ms -- |  |  | Mobile: fade và y tối đa 12px, 450ms; reduced: hiện sẵn |  | Chỉ tách dòng cho H1 hero (SplitText hoặc tách thủ công); revert() khi resize đổi dòng |  |  |
|  |  |  |  |  |  |  | -- |  | Mobile: |  |  |  |  |
|  |  |  |  |  |  | ease- |  |  |  |  |  |  |  |
|  |  |  |  |  |  | emphasis, |  |  |  |  |  |  |  |
| H3 | Phần mô tả và CTA hiện sát sau H1. CTA không bị chậm | .hero-body, .hero-cta, y 16 → 0, opacity 0 → 1 | Cùng timeline H2 |  |  | Body 400ms, CTA 400ms, CTA trễ dưới hoặc bằng 120ms |  |  | Reduced: hiện sẵn |  | CTA luôn nhận focus, pointer- |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | pointer- |  |
|  |  |  |  |  |  |  |  |  |  |  | events không tắt |  |  |
| H4 | Ánh nắng sớm lướt qua ảnh hero một lần (ý: ánh sáng đi vào nhà). Không lặp | .hero-light góc 105 độ, kem độ mờ tối đa 0,18, translateX -120% → 120% | Sau H2, một lần |  |  | 1400ms -- |  |  | Mobile và reduced: bỏ |  | Gỡ phần tử sau khi xong. Nếu xem lại thấy giống hiệu ứng "shimmer" rẻ tiền thì bỏ |  |  |
|  |  |  |  |  |  |  |  | -- | Mobile |  |  |  |  |
|  |  |  |  |  |  | ease-inout |  |  |  |  |  |  |  |
| H5 | Gợi ý cuộn: mũi tên nhún nhẹ, dừng sau khi cuộn | .scroll-cue, y 0 ↔ 6px | Sau H3; dừng khi cuộn hoặc sau 6 vòng |  |  | 1800ms yoyo |  |  | Bỏ trên mobile; reduced: tĩnh |  | Duy nhất hiệu ứng lặp; dừng khi tab ẩn |  |  |
| H6 | Parallax rất nhẹ cho chiều sâu | .hero-media yPercent 0 → 4, chữ 0 → -2 | Scrub 0,8 khi cuộn qua hero |  |  | Theo cuộn |  |  | Chỉ desktop và không reduced |  | Wrapper overflow:hidden, ảnh dư crop 6% |  |  |

| ID | Hiệu ứng và lý do | Phần tử, trạng thái đầu → cuối |  | Trigger, lặp |  | Thời lượng, easing |  | Mobile và reduced | Rủi ro, cleanup |
|---|---|---|---|---|---|---|---|---|---|
| N1 | Thanh điều hướng đổi trạng thái khi cuộn | Nền kem độ mờ 0 → 92%, viền opacity 0 → 1 |  | scrollY |  | 260ms |  | Giữ | Không animate backdrop-filter |
|  |  |  |  |  |  | 26 |  |  |  |
|  |  |  | city 0 | > 40, |  |  |  |  |  |
| N2 | Gạch chân link | ::after scaleX 0 → 1, gốc trái |  | Hover, focus-visible |  | 220ms -- |  | Reduced: hiện tức thì | Chỉ transform |
|  |  |  |  |  |  |  | -- | Red |  |
|  |  |  |  |  |  | ease-out |  |  |  |
| N3 | Panel menu mobile trượt vào | Panel x 100% → 0; link y 16 → 0, opacity 0 → 1 |  | Bấm nút menu |  | 360ms power3.out, stagger 60ms; đóng 260ms |  | Reduced: hiện 180ms | Focus trap, ESC, đóng khi chọn link, trả focus về nút, khóa cuộn nền |

### Thư viện hiệu ứng, nhóm 2: hiện khi cuộn

| ID |  | Hiệu ứng và lý do |  | Phần tử, trạng thái đầu → cuối |  |  |  | Trigger, lặp |  |  |  | Thời lượng, easing | Mobile và reduced | Rủi ro, cleanup |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 |  | Tiêu đề và đoạn nổi lên theo thứ tự đọc |  | [data- |  |  |  |  |  |  |  | Tiêu đề 600ms, đoạn 450ms, đoạn kế tiếp trễ 70ms | y 12; reduced: fade 150ms | Chỉ transform và opacity; kill sau khi chạy |
|  |  |  |  |  | [data- |  |  |  | st | tart: |  | Tiêu |  |  |
|  |  |  | n nổi | reveal="rise" |  | "] | , y | top 85%, |  |  |  |  |  |  |
|  |  |  |  | 24, opacity 0 → y 0, opacity 1 |  |  |  |  |  |  |  |  |  |  |
| R2 |  | Nhóm thẻ |  | .card-group > |  |  |  | Một trigger cho cả nhóm, once |  |  |  | 500ms, stagger 80ms, tối đa 5 thẻ mỗi đợt; trên 8 thẻ dùng ScrollTrigger.batch | y 12; reduced: hiện sẵn | Không tạo trigger cho từng thẻ |
|  |  |  |  |  | .card-group > |  |  | M |  |  |  |  |  |  |
|  |  | hiện lần |  | .card, |  |  |  |  |  |  |  |  |  |  |
|  |  | lượt để mắt quét nhanh |  |  |  |  |  |  |  |  |  |  |  |  |
| R3 |  | Mở lam: ảnh hiện như lam đứng mở ra. Dấu ấn riêng của ECO ARCH |  | 5 dải lam <i aria-hidden> màu nền phủ ảnh, scaleX 1 → 0, gốc trái; ảnh scale 1,03 → 1 |  |  |  | top 86%, |  |  |  | Mỗi dải 700ms --ease-inout, stagger 60ms (tổng khoảng 940ms); ảnh 1100ms | 3 dải; reduced: không dải, fade 350ms | Dải do JS chèn vào và gỡ bỏ khi xong. Không có JS thì không có dải. Tối đa 2 ảnh mỗi màn hình |
|  |  |  |  |  |  |  |  |  | top 8 |  | 86% |  |  |  |
|  |  |  |  |  |  |  |  | once; chỉ ảnh KHÔNG phải LCP | on | nce; | ; chỉ | inout, |  |  |

| --ease- | 3 dả |
|---|---|

|  |  |  | ID | Hiệu ứng và lý do |  |  |  | Phần tử, trạng thái đầu → cuối |  |  | Trigger, lặp | Thời lượng, easing | Mobile và reduced | Rủi ro, cleanup |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  | R4 | Mở khung |  |  |  | clip-path: |  |  | top 86%, once | 800ms power3.out; scale 1000ms | Mobile: fade 350ms; reduced: hiện sẵn | clip-path chỉ dùng ở ảnh nhỏ; không kết hợp rotate hay blur |
|  |  |  |  |  |  |  |  |  | clip-path: |  | top 86%, |  |  |  |
|  |  |  |  |  | khung |  |  | inset(0 0 100% |  |  |  |  |  |  |
|  |  |  |  | (clip) cho |  |  |  | 0) |  |  |  |  |  |  |
|  |  |  |  | ảnh phụ, ít nặng hơn R3 |  |  |  |  |  |  |  |  |  |  |
|  |  |  | R5 | Đường kẻ ngang vẽ từ trái, ngăn cách section nhẹ |  |  |  | .rule scaleX 0 → 1, gốc trái |  |  | top 90%, once | 600ms --ease-out | Reduced: hiện sẵn | Rất rẻ |
|  |  |  | R6 | Vẽ nét mảnh SVG: sơ đồ nắng gió, đường nối quy trình |  |  |  | path có pathLength=1, stroke- |  |  | top 78%, once | 1000ms --ease-inout, các nét stagger 80ms | Reduced và mobile: hiện sẵn; không JS: nét hiện đủ | CSS thuần hoặc DrawSVG; chữ luôn là text thật, không bị ẩn |
|  |  |  |  |  |  |  |  |  | path |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  | pathLength=1, |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  | stroke- |  |  |  |  |  |
|  |  |  |  |  |  |  | nắng | dashoffset |  |  |  |  |  |  |
|  |  |  | R7 | Quy trình kể theo |  |  |  | Cột trái position: |  |  |  | Theo cuộn; đánh dấu bước đang đọc 180ms | Mobile và reduced: một cột, mặt bằng hiện đủ, dùng số thứ tự | Không pin. Một trigger duy nhất; kill khi rời trang |
|  |  |  |  |  |  |  |  |  |  | position: | Scrub 0,6 | Theo |  |  |
|  |  |  |  |  |  | kể theo |  | sticky; top: |  |  | theo tiến độ bước; không khóa cuộn |  |  |  |
|  |  |  |  | bước: mặt |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | bằng vẽ dần khi đọc tới từng bước (sticky, không pin) |  |  |  |  |  |  |  |  |  |  |

| ID | Hiệu ứng và lý do | Phần tử, trạng thái đầu → cuối | Trigger, lặp | Thời lượng, easing | Mobile và reduced | Rủi ro, cleanup |
|---|---|---|---|---|---|---|
| R8 | Thả nhẹ nền trang trí (rose) khi vào section | Chỉ dải nền trang trí aria-hidden, scaleY 0 → 1, gốc dưới | top 85%, once | 600ms --ease-inout | Reduced: hiện sẵn | Không tween màu chữ hay nền dùng chung. Lý do: giữa chừng chuyển kem sang xanh chàm, cả chữ và nền đều xám, tương phản rơi xuống gần 1:1 và gây mỏi mắt. Mảng nền tối là màu tĩnh của riêng section |
| R9 | Danh sách "bạn nhận gì" hiện từng mục | li, y 12, opacity 0 → y 0, opacity 1 | top 85%, once | 400ms, stagger 60ms, tối đa 5 mục | Reduced: hiện sẵn | Không animate danh sách dài hơn 8 mục |

### Thư viện hiệu ứng, nhóm 3: so sánh, thẻ, biểu mẫu, chuyển trang

|  | ID | Hiệu ứng và lý do |  |  | Phần tử, trạng thái đầu → cuối |  | Trigger, lặp | Thời lượng, easing | Mobile và reduced |  | Rủi ro, cleanup |  |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | C1 | Slider trước và sau: kéo đường cắt để so sánh hai |  |  | Lớp ảnh "sau" phủ lên "trước", clip-path: |  | Kéo, phím mũi, nhấn; không tự chạy | Cập nhật theo con trỏ, không tween | Giữ; swipe là bổ sung, luôn có nút. Reduced: giữ |  | Nhãn TRƯỚC và SAU là chữ thật, aria- |  |  |  |
|  |  |  |  |  |  | clip-path: | không tự |  |  |  |  | aria- |  |  |
|  |  |  | sánh hai |  | inset(0 X% 0 |  |  |  |  | d: | valuetext |  |  |  |
|  |  | ảnh cùng góc |  |  | 0); tay cầm là |  |  |  |  |  |  |  |  |  |
|  |  | máy |  |  |  | input |  |  |  |  |  |  |  |  |
|  |  |  |  |  | type=range |  |  |  |  |  |  |  |  |  |

|  |  | ID |  |  | Hiệu ứng và lý do |  | Phần tử, trạng thái đầu → cuối |  |  |  |  | Trigger, lặp |  |  |  | Thời lượng, easing |  |  | Mobile và reduced |  | Rủi ro, cleanup |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | C2 |  |  | Gợi ý tự chạy một lần: tay cầm đi 50 → 38 → 50 |  | Giá trị range |  |  |  |  | Vào khung nhìn lần đầu; hủy nếu người dùng chạm |  |  |  | 1200ms --ease-inout |  |  | Tắt trên mobile và reduced |  | Khoảnh khắc cinematic duy nhất của trang chủ (cùng R3 ở H-05) |  |
|  |  | C3 |  |  | Nhãn con trỏ "Kéo" chỉ trên slider |  | Phần tử .cursor-label theo chuột, lerp 0,15 |  |  |  |  | pointer: |  |  |  | rAF |  |  | Tắt trên touch và reduced; con trỏ gốc luôn hoạt động |  | Không đọc layout mỗi frame; tắt trên input và form |  |
|  |  |  |  |  |  |  |  | .cursor- | -label |  |  | fine | và |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | hover: |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  | hover, không reduced |  |  |  |  |  |  |  |  |  |  |
|  |  | K1 |  |  | Thẻ bấm được nâng nhẹ, ảnh phóng nhẹ: báo hiệu có thể nhấn |  | .card--link, y -4, scale 1,01; ảnh scale 1 → 1,025 |  |  |  |  | Hover (pointer fine), focus-within |  |  |  | 220ms thẻ, 450ms ảnh |  |  | Không phụ thuộc hover; reduced: chỉ đổi viền |  | Không nâng thẻ không nhấn được |  |
|  |  | K2 |  |  | Thẻ phương án "bay" sang |  | view- |  |  |  |  | Click link từ |  |  |  | 420ms |  | --ease- | Trìn |  | Nâng cấp tùy chọn; không đặt tên trùng |  |
|  |  |  |  |  |  | sang | transition- |  |  |  |  | P02 san |  | ng |  | ino | out |  |  |  |  |  |
|  |  |  |  |  | ảnh đầu |  | name: concept- |  |  |  |  | P03 đ |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | trang chi tiết |  | <slug> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | (shared element) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | F1 |  |  | Accordion hỏi đáp |  | grid- |  |  |  |  |  |  |  |  | 300ms --ease-out |  |  | Reduced: mở tức thì |  | aria- |  |
|  |  |  |  |  |  |  |  | grid- |  |  |  | Nhấn, Enter, |  |  |  |  |  |  |  |  |  | aria- |
|  |  |  |  |  |  |  | template-rows: |  |  |  |  | Space |  |  |  | out |  |  |  | hì | expanded |  |
|  |  |  |  |  |  |  | 0fr → 1fr trong details tuỳ biến; mũi tên xoay 90 độ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | F2 |  |  | Trường form nhận focus |  | Viền đổi Brick, nhãn giữ cố định |  |  |  |  | focus-visible |  |  |  | 160ms |  |  | Reduced: không đổi thời lượng |  | Không dùng placeholder thay nhãn |  |
|  |  | F3 |  |  | Gửi form |  | Nút giữ độ rộng, chữ Đang gửi; thông báo hiện |  |  |  |  | Submit hợp lệ |  |  |  | 200ms; aria- |  |  | Spinner có chữ, không xoay khi reduced |  | Không animate lại khi lỗi |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | aria- | Spinner có |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | live="polite" |  |  |  |  |  |  |

| n đầu; | inout |
|---|---|

| --ease- | R |
|---|---|

|  |  | ID |  | Hiệu ứng và lý do |  | Phần tử, trạng thái đầu → cuối |  |  | Trigger, lặp |  |  | Thời lượng, easing | Mobile và reduced |  | Rủi ro, cleanup |  |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | M1 |  | Lightbox ảnh phương án |  | Backdrop 220ms; ảnh scale 0,985 → 1 |  |  | Nhấn ảnh |  |  | 300ms --ease-out | Reduced: hiện tức thì; luôn có Prev và Next |  | Focus vào nút đóng, ESC, trả focus |  |  |  |
|  |  | P1 |  | Chuyển trang mặc định: trang cũ mờ đi và dịch lên 8px, trang |  | CSS cross-document View Transitions: @view- |  |  | Mọi điều hướng cùng origin |  |  | Ra 160ms, vào 320ms | Reduced: tắt bằng media query |  | Nâng cấp dần: trình duyệt không hỗ trợ thì điều hướng bình thường. Không overlay nên không thể kẹt màn hình khi back, forward |  |  |  |
|  |  |  |  |  |  |  | @view- |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | trang | transition { |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | mới hiện dần |  | navigation: |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | từ dưới 12px |  | auto; } |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | lên |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | P2 |  | Tấm che cuối dẫn vào trang đặt lịch: tín hiệu "bạn đang sang bước hành động". Chỉ một điểm đến, không dùng cho mọi trang |  | Tấm xanh chàm scaleY 0 → 1 gốc dưới, trang mới mở scaleY 1 → 0 gốc trên |  |  | Click a[data- |  |  | Ra 450ms, vào 550ms --ease-inout | Mobile và reduced: điều hướng thẳng. API hoặc GSAP lỗi: điều hướng thẳng |  | Một lần mỗi lượt, không nháy. pageshow |  |  |  |
|  |  |  |  |  |  |  |  |  |  | a[data- |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  | g mới | wipe] tới P18, không modifier, cùng origin |  | tới | inout |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | pageshow |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  | GSAP | persisted |  |  |  |
|  |  | P3 |  | Đổi ngôn ngữ VI và EN giữ nguyên trang |  | Dùng P1, không wipe |  |  | Chọn ngôn ngữ |  |  | 160 + 320ms | Giữ |  | lang, hreflang, ánh xạ slug |  |  |  |

| --ease- | R |
|---|---|

|  | out |
|---|---|

| --ease- | red |
|---|---|

### Bản đồ hiệu ứng theo trang và ngân sách (SOP 7.4: một khoảnh khắc cinematic chính và

### tối đa một đoạn storytelling nổi bật mỗi trang)

| Trang | Hiệu ứng dùng | Cinematic | Storytelling |
|---|---|---|---|
| P01 Trang chủ | H1 đến H6, N1 đến N3, R1, R2, R3 (tối đa 2 ảnh), R5, R6, C1 đến C3, K1, F1 đến F3, P1, P2 | H-05: mở lam cộng tự chạy slider C2 | H-02: sơ đồ nắng gió vẽ nét (R6) |
| P02 Dịch vụ | H2, H3, R1, R2, R9, K1, K2, P1 | Không | Không |
| P03 đến P05 Trang gói | H2, H3, R1, R3 (1 ảnh), R9, F1, K2 (đích) | Không | Không |
| P06 Phương án | R2, R4, K1, K2 | Không | Không |
| P07 đến P10 Trang phương án | K2 (đích), C1 đến C3, M1, R1 | Slider và hiệu ứng C2 | Không |
| P11 Giới thiệu | H2, H3, R1, R3 (ABOUT-01), R5 | Không | Không |
| P12 Quy trình | R1, R6, R7 | Không | R7: mặt bằng vẽ dần theo 10 bước |
| P13 Phạm vi | R1, R9, R5 | Không | Không |
| P14 đến P16 Kiến thức | R1, R3 (ảnh đầu bài), R6 (P15) | Không | R6 ở P15 |
| P17 Hỏi đáp | F1, R1 | Không | Không |
| P18 Đặt lịch | F2, F3, P2 (đi vào) | Không | Không |
| P19, P20, P21, P22 | R1 (P19); P1 | Không | Không |

### Ngân sách cứng mỗi trang

| Giới hạn | Giá trị |
|---|---|
| Khoảnh khắc cinematic (1100 đến 1300ms) | 1 |
| Đoạn storytelling nổi bật | 1 |
| Hiệu ứng lặp vô hạn | 1 (H5), dừng sau 6 vòng hoặc khi cuộn |
| Parallax | Chỉ hero trang chủ, tối đa 4% |
| Hiệu ứng chạy cùng lúc trong một khung nhìn | Tối đa 3 nhóm |
| Ảnh dùng mở lam trong một khung nhìn | Tối đa 2 |
| Loại hiệu ứng khác nhau trên một trang | Tối đa 8 |
| Tween GSAP đang chạy cùng lúc | Tối đa 12 |
| JS chuyển động sau nén | Không vượt 60 KB [GIẢ ĐỊNH, chốt khi đo thật]; R7 và C1 nhập động, chỉ tải ở trang cần |

### Quy tắc dễ chịu cho mắt

Biên độ nhỏ: rise tối đa 24px, scale tối đa 1,04, parallax tối đa 4%. Không xoay, không blur, không đổi độ sáng toàn khung hình. Không có nhấp nháy quá 3 lần mỗi giây (WCAG 2.3.1). Không có cặp chuyển động ngược chiều cùng lúc trên một khung nhìn. Hiệu ứng di chuyển vùng lớn không ngắn hơn 220ms; hiệu ứng lớn không dài quá 1200ms. Hiệu ứng nội dung đọc chạy một lần. Chỉ lặp lại khi là trạng thái tương tác (hover, mở, đóng). Tương phản chữ luôn ổn định: không tween màu nền dùng chung, không đặt chữ lên nền đang đổi màu. Người dùng có công tắc "Giảm chuyển động" ở chân trang (gặp lại html[data-motion="reduced"]), mặc định theo hệ điều hành, lưu bằng localStorage trong

```
try/catch.
```

Mỗi hiệu ứng phải trả lời được: nó cho thấy thứ bậc, trạng thái hay quan hệ nào? Không trả lời được thì bỏ. Danh sách cấm (chống "AI slop") Bounce, elastic, spring quá đà; mọi easing có overshoot. Chữ scramble, gõ chữ, tách từng chữ cho tiêu đề (chỉ tách theo dòng ở H1 hero). Quầng sáng, lưới gradient, khối màu trôi nổi, glassmorphism có blur động. Marquee chạy vô hạn, logo xoay, hạt, confetti, đuôi con trỏ. Tilt 3D cho tất cả thẻ; magnetic button; đổi màu nền toàn trang theo cuộn. Bộ đếm số liệu (không có số liệu thật để đếm). Skeleton lấp lánh "shimmer" khi không phải đang tải thật; preloader giả. Scroll-jacking, pin khóa cuộn, tự phát âm thanh hoặc video nền. Cùng một hiệu ứng áp lên mọi thứ; trễ ngẫu nhiên; hiệu ứng không có cột "lý do" trong bảng. Cách điều chỉnh và tắt

```
Thuộc tính data-reveal="rise|louver|clip|rule|draw", data-motion="off" để
```

tắt từng phần tử; html[data-motion="reduced"] tắt toàn bộ.

```
Mọi thời lượng và độ trễ sửa ở src/motion/tokens.ts và src/styles/tokens.css;
```

không sửa trong component. Tệp: reveal.ts (R1, R2, R5, R9), louver.ts (R3), draw.ts (R6, R7), compare.ts (C1 đến C3), hero.ts (H1 đến H6), nav.ts (N1 đến N3), page-wipe.ts (P2),

```
transitions.css (P1, K2).
```

### Kiểm thử chuyển động (SOP 10.2 cộng các mục riêng của ECO ARCH)

Tải lại giữa trang không để nội dung opacity:0 vĩnh viễn; tắt JS vẫn đọc được toàn trang. Back và forward không để tấm che; resize và xoay màn hình không tạo ScrollTrigger trùng. Focus không nhảy vào phần tử ẩn; Tab đến phần tử chưa hiện thì phần tử hiện ngay. Reduced motion (emulate) tắt scrub, ánh sáng lướt, mở lam, vẽ nét, wipe, auto-demo, cursor. Tab ẩn dừng vòng lặp; quay lại không tăng tốc. Hero: LCP chỉ bị scale, H1 và CTA không trễ quá 120ms; không CLS do animation. Hiệu năng: throttle CPU 4x trên mô phỏng mobile vẫn mượt; nếu giật, giảm số lớp trước. Quay màn hình một lượt cuộn P01 và xem lại từng giây: không có nhấp nháy, không có hai hiệu ứng lớn cùng lúc.
