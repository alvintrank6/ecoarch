// One-off: OG image (1200x630) and touch icon from existing files. Usage: node scripts/make-og.mjs
// OG-01 should be cut from HERO-01; HERO-01 does not exist yet, so the interim hero image (ex-04-after) is used.
import sharp from 'sharp';
await sharp('src/assets/concept/ex-04-after.png').resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile('public/og-default.jpg');
await sharp('public/favicon.svg', { density: 512 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('og-default.jpg and apple-touch-icon.png written');
