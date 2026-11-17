// One-off: OG image (1200x630) and touch icon from existing files. Usage: node scripts/make-og.mjs
// OG-01 should be cut from HERO-01; HERO-01 does not exist yet, so the interim hero image (ex-04-after) is used.
import sharp from 'sharp';
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" rx="20" fill="#F7F4EE"/>
<g transform="translate(14 22) scale(1.78)"><path d="M8 31 36 7l28 24" fill="none" stroke="#6E7F52" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 27v28" fill="none" stroke="#6E7F52" stroke-width="5" stroke-linecap="round"/><path d="M24 56C23 41 32 32 47 31c0 15-9 25-23 25z" fill="#6E7F52"/></g></svg>`;
await sharp('src/assets/concept/ex-04-after.png').resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(mark), left: 48, top: 432 }]).jpeg({ quality: 82 }).toFile('public/og-default.jpg');
await sharp('public/favicon.svg', { density: 512 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('og-default.jpg and apple-touch-icon.png written');
