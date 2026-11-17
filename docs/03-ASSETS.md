## 03 Asset Manifest và Image Prompts

31 hạng mục ảnh: 9 nhóm đã có (EX-01 đến EX-09, 15 file) và 22 hạng mục mới. Tất cả ảnh có sẵn do chủ dự án tự tạo, dùng làm concept. Bộ file đã đóng gói trong eco-arch-images.zip (45 dòng trong asset-manifest.csv, gồm cả ảnh tham khảo); file gốc không bị chỉnh, đã kiểm bằng hash. Ảnh đã có: cặp trước và sau

| Mã | File (trong concept/) | Pixel | Dùng cho | Alt text VI (rút gọn) |
|---|---|---|---|---|
| EX-01 | ex-01-before.jpg, ex-01-after.jpg | 940x1673 | Nhà ống A, trang /phuong-an nhà ống | Hành lang có vòm và cầu thang cong; sau: giữ vòm, trần gỗ ấm |
| EX-02 | ex-02-before.jpg, ex-02-after.jpg | 1085x1450 | Nhà ống B | Tường ố, gạch đỏ; sau: sảnh dài, đèn hắt trần, giếng trời |
| EX-03 | ex-03-before.png, ex-03-after.png | 1122x1402 | Nhà phố (mặt tiền) | Mặt tiền vàng cũ; sau: lam đứng màu gạch, cổng xanh chàm |
| EX-04 | ex-04-before.png, ex-04-after.png | 1536x1024 | Biệt thự (phòng khách) | Cột, tủ gỗ tối, đèn chùm; sau: nội thất sáng, sàn terrazzo |
| EX-05 | ex-05-before.png, ex-05-after.png | 1536x1024 | Căn hộ | Bếp gỗ cũ; sau: ghế dài có ngăn chứa, bàn ăn gấp, vách trượt |
| EX-06 | ex-06-before.png, ex-06-after.png | 1536x1024 | Nhà ống C | Tủ lạnh sát cầu thang; sau: vòm gạch đỏ, ghế dài, đèn hắt |
| EX-07 | ex-07-composite.jpg | 960x960 | Mặt tiền nhà cấp 4, ảnh ghép | Có nhãn TRƯỚC/SAU in sẵn bằng tiếng Việt: tạo lại cặp riêng cho EN |
| EX-08 | ex-08-composite.jpg | 1774x887 | Phòng khách nhà ống, ảnh ghép | Cắt đôi theo trục dọc cho slider trước/sau |
| EX-09 | ex-09-before.png | 1536x1024 | Nhà cấp 4 mái ngói có sân | Thiếu ảnh sau: tạo bằng cách chỉnh ảnh này, giữ góc máy |

Mỗi cặp cùng pixel nên dùng được cho slider trước/sau (motif M3). Alt text VI đầy đủ và bản EN nằm trong CSV. Ảnh chỉ để tham khảo (reference/, không đưa lên website): 3 ảnh có watermark SDC studio, 1 ảnh có watermark MOCAN, mockup website cũ tông xanh ô liễu, sơ đồ trang cũ, bảng concept thương hiệu (3 hướng logo), ảnh chụp 3 thẻ gói. Logo chưa chốt: [CẦN BỔ SUNG]. Hạng mục mới (22)

| Mã | File đích | Tỷ lệ và kích thước sinh | Vai trò | Trạng thái |
|---|---|---|---|---|
| HERO-01 | hero-main.webp | Sinh 3:2 1536x1024, cắt 16:9 = 1536x864 | Hero desktop, chừa vùng trống bên trái cho H1 | Cần tạo |
| HERO-01m | hero-main-m.webp | Sinh 2:3 1024x1536, cắt 4:5 = 1024x1280 | Hero mobile | Cần tạo |
| NEW-01 | new-01-before.webp | 3:2 | Xây mới: lô đất trống, làm trước | Cần tạo |
| NEW-02 | new-02-after.webp | 3:2 | Chỉnh từ NEW-01 để khóa góc máy | Cần tạo |
| NEW-03 | new-03-living.webp | 3:2 | Phòng khách nhà HB-01 | Cần tạo |
| NEW-04 | new-04-kitchen.webp | 3:2 | Bếp và phòng ăn nhà HB-01 | Cần tạo |
| BR-01, BR-02 | br-01-before.webp, br-02-after.webp | 3:2 | Dãy trọ trước và sau [GIẢ ĐỊNH: BR là dãy trọ] | Cần tạo |
| OF-01, OF-02 | of-01-before.webp, of-02-after.webp | 3:2 | Văn phòng nhỏ trước và sau | Cần tạo |
| SVC-01 đến 03 | svc-01-2d-plan, svc-02-3d-cutaway, svc-03-interior (.webp) | 1:1 hoặc 4:3, cùng một kiểu crop | Thẻ 3 gói | Dùng ảnh gốc của chủ dự án; hiện chỉ có bản cắt 200x150 trong placeholders/ |
| ABOUT-01 | about-01.webp | Sinh 2:3, cắt 4:5 = 1024x1280 | Trang Giới thiệu, không có người | Cần tạo |
| ART1-01 | art1-01.webp | 3:2 | Bài 1 (nắng, gió) | Cần tạo |
| ART2-01 | art2-01.webp | 3:2 | Bài 2 (chuẩn bị trước buổi trao đổi) | Cần tạo |
| BOOK-01 | book-01.webp | 3:2 | Trang Đặt lịch | Cần tạo |
| TEX-01, TEX-02 | tex-01-terrazzo, tex-02-plaster (.webp) | 1:1 | Nền trang trí, aria-hidden | Cần tạo |
| OG-01 | og-default.jpg | 1200x630 | Ảnh chia sẻ mạng xã hội | Cắt từ HERO-01, không sinh mới |
| DIAG-01 | diag-sun-wind.svg | vector | Sơ đồ nắng gió, chữ thật VI và EN | Vẽ bằng SVG, không dùng AI |
| DOC-01 | doc-sample.webp | theo nguồn | Ví dụ hồ sơ bàn giao | Chỉ dùng tài liệu thật, [CẦN BỔ SUNG] |

### Quy tắc ảnh

Tên file {mã}-{vai trò}.{đuôi}, chữ thường, không dấu. Không để chủ thể sát mép ở hero. Mọi ảnh concept phải có chú thích cố định: "Hình minh họa, chưa phải công trình thực tế của ECO ARCH." Ảnh 3 gói dùng dòng: "Hình tham khảo minh họa mức độ chi tiết của sản phẩm, không phải thiết kế đã hoàn thành của ECO ARCH." Quy trình tạo cặp: làm ảnh "trước" trước, rồi chỉnh chính ảnh đó thành "sau" để khóa góc máy. Pipeline: WebP (và AVIF nếu đủ thời gian) bằng sharp; chiều rộng 480, 768, 1200, 1600; có width và height; chỉ hero được preload. Những PNG 2 đến 3 MB trong concept/ phải nén trước khi lên. Ghi chú "tạo bằng AI" trong chú thích ảnh: [CẦN XÁC NHẬN]. Prompt ảnh (tiếng Anh). Dán MASTER STYLE BLOCK ở đầu, STD-NEG ở cuối mỗi prompt. Bản đầy đủ nằm trong image-prompts.md của gói zip.

```
MASTER STYLE BLOCK
Photorealistic architectural photograph of a Hanoi, Vietnam residential
space, shot with a 24 to 35 mm lens at eye height, straight vertical lines,
natural daylight with a soft warm colour grade. Palette: cream lime plaster,
walnut timber, terracotta brick accents, indigo painted metal, pale terrazzo.
Calm, uncluttered, lived-in but tidy. Realistic materials and plausible
proportions. No people, no text, no logos.
STD-NEG
Avoid: text, letters, numbers, logos, watermarks, signatures, people, faces,
hands, fisheye distortion, warped or leaning verticals, extra or floating
windows, impossible stairs, plastic CGI look, oversaturated colours, HDR
halos, heavy vignette, clutter, brand names, neon colours.
HB-01 HOUSE BIBLE (NEW-01 to NEW-04)
The same house in every image: a narrow three-storey Hanoi row house on a
deep plot. Cream lime-plaster facade, a vertical terracotta fin screen on the
upper floors, an indigo painted steel gate, a timber front door, a small
balcony with planters, a roof light above the stair, pale terrazzo floors,
walnut joinery. [concept parameters only, not a real project]
```

| Mã | Phần chủ đề của prompt |
|---|---|
| HERO-01 | A Hanoi street-side facade of a renovated row house in early morning light, terracotta vertical fins with climbing plants, indigo gate, a leafy street tree at the frame edge. Subject away from left and right edges. Calm sky or wall on the left third for the headline. |
| HERO-01m | The same facade as HERO-01, portrait framing, subject centred, sky above for the headline. |
| NEW-01 | HB-01 context: a narrow empty plot between two older row houses in a Hanoi alley, bare ground, temporary fence, overcast soft light. |
| NEW-02 | Edit NEW-01: keep camera, neighbours and street. Build the HB-01 house on the plot, finished and clean. |
| NEW-03 | HB-01: ground-floor living space looking toward the stair, light from the roof light above the stair, pale terrazzo floor, walnut joinery, one sofa, one low table. |
| NEW-04 | HB-01: kitchen and dining at the back of the house with a small courtyard window, walnut cabinets, cream walls, a long dining table. |
| BR-01 | A plain row of rented rooms with a shared corridor, painted concrete, mismatched doors, dim fluorescent light. |
| BR-02 | Edit BR-01: keep the corridor geometry. Doors made uniform in timber, cross-ventilation openings, warm light, plants at the end, clean floor. |
| OF-01 | A small office in a ground-floor shophouse, dull ceiling lights, cluttered desks, closed shutters. |
| OF-02 | Edit OF-01: keep room and window wall. Daylight through opened glazing, timber desks, a plant, soft indirect lighting, tidy. |
| SVC-01 | Only if the owner's original is missing: a clean black-line floor plan of a small apartment on white paper, furniture outlines, thin dimension lines, no readable text. |
| SVC-02 | Only if missing: an isometric cutaway 3D model of a two-level home on light grey ground, thick black wall outline, pale timber floor, no readable text. |
| SVC-03 | Only if missing: a finished interior render of a living and dining space, curved sofa, timber stools at a counter, sheer curtains, warm daylight. |
| ABOUT-01 | A desk seen from above: a hand-drawn plan on tracing paper, a scale ruler, a pencil, a small board of timber and terrazzo samples, soft window light. No face, no hands, no text. |
| ART1-01 | Low morning sun entering a room through a vertical timber louver wall, long soft light bands on a pale floor, a window open on the opposite wall, a curtain moving slightly. |
| ART2-01 | A flat lay on a wooden table: a printed plot photo, a measuring tape, a notebook, a phone with a blank map screen, a pencil. No readable text. |
| BOOK-01 | A quiet empty plot in a Hanoi residential street at golden hour, a low wall, a street tree, no vehicles. |
| TEX-01 | Pale terrazzo with fine warm chips, flat top view, even light. |
| TEX-02 | Cream lime plaster with soft hand-trowel variation, flat front view, even light. |

OG-01 cắt từ HERO-01; DIAG-01 vẽ SVG; DOC-01 chỉ dùng tài liệu thật, không có prompt.
