// Zero-token content gate: forbidden claims, price whitelist, dashes, banned images.
import { htmlFiles, read, walk, report } from './lib.mjs';
import { existsSync } from 'node:fs';

const FORBIDDEN = [
  [/giảm điện|mát hơn|cam kết mát/i, 'unsupported energy/cooling claim'],
  [/đẳng cấp|độc nhất/i, 'banned brand word'],
  [/(Kiến trúc sư|KTS|Architect)\s+(Nguyễn|Nguyen)/, 'credential title on Nguyễn Thị Thu not confirmed'],
  [/căn nhà trình diễn|nhà mẫu|demonstration (renovation|property|visit)|show ?home/i, 'demonstration renovation does not exist yet'],
  [/Vĩnh Hưng/, 'unverified past project'],
  [/Gói 4|Package 4/i, 'only 3 packages'],
  [/lorem|placehold\.co|\[CẦN|\[GIẢ ĐỊNH|TODO/i, 'placeholder or open-item marker shipped'],
  [/vòng (sửa|chỉnh)|revision rounds?|50\/50|40\/30\/30/i, 'revision rounds / payment split must stay unpublished'],
  [/SDC|MOCAN|ICCO/, 'watermark or competitor name'],
  [/[\u2014\u2013]/, 'em/en dash in copy'],
  [/\d+\s*(triệu|tỷ)\b/i, 'only per-m2 prices may be published'],
  [/src="[^"]*(\/reference\/|watermark)[^"]*"/i, 'reference image used on site'],
];
const ALLOWED_PRICES = new Set(['100000', '220000', '340000']);
const PRICE = /(\d{1,3}(?:[.,]\d{3})+)\s*(?:đ|₫|VND|VNĐ|vnd)/g;
// Price requirement activates once the services view exists (slice S5).
const REQUIRE_ON = !existsSync('src/views/Services.astro') ? {} : { 'vi/dich-vu/index.html': 3, 'en/services/index.html': 3 };

const files = [...htmlFiles(), ...walk('src/content', (p) => p.endsWith('.json'))];
const fails = [];
for (const f of files) {
  let t = read(f);
  if (f.endsWith('.html'))
    t = t.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/&nbsp;/g, ' ');
  for (const [re, why] of FORBIDDEN) {
    const m = t.match(re);
    if (m) fails.push(`${f}: "${m[0].slice(0, 40)}" ${why}`);
  }
  for (const m of t.matchAll(PRICE)) {
    const n = m[1].replace(/[.,]/g, '');
    if (!ALLOWED_PRICES.has(n)) fails.push(`${f}: price ${m[0]} not in price table`);
  }
  for (const [suffix, need] of Object.entries(REQUIRE_ON)) {
    if (f.replace(/\\/g, '/').endsWith(suffix)) {
      const found = [...ALLOWED_PRICES].filter((p) => t.replace(/[.,]/g, '').includes(p)).length;
      if (found < need) fails.push(`${f}: expected all 3 prices, found ${found}`);
    }
  }
}
report('content', fails, files.length);
