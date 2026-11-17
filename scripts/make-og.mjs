// One-off: OG image (1200x630) and touch icon from existing files. Usage: node scripts/make-og.mjs
// OG-01 should be cut from HERO-01; HERO-01 does not exist yet, so the interim hero image (ex-04-after) is used.
import sharp from 'sharp';
const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" rx="20" fill="#F7F4EE"/><g transform="translate(14 30) scale(1.25)"><path d="M6 8h46v13H19v13h22v11H19v13h33v13H6z" fill="#6E7F52"/><path d="M40 8h12l40 29v37H79V43L52 23z" fill="#6E7F52"/><path d="M42 72C41 56 52 46 70 44c0 17-11 28-28 28z" fill="#A8B39E"/><path d="M45 69c6-9 13-16 21-21" fill="none" stroke="#F7F4EE" stroke-width="1.6" stroke-linecap="round"/></g></svg>`;
await sharp('src/assets/concept/ex-04-after.png').resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(mark), left: 48, top: 432 }]).jpeg({ quality: 82 }).toFile('public/og-default.jpg');
await sharp('public/favicon.svg', { density: 512 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('og-default.jpg and apple-touch-icon.png written');
