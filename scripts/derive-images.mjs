// One-off: split the EX-08 composite (1774x887, no baked labels) into a before/after pair of 887x887 halves.
// Originals are never modified. Usage: node scripts/derive-images.mjs
import sharp from 'sharp';
const src = 'src/assets/concept/ex-08-composite.jpg';
const { width, height } = await sharp(src).metadata();
const half = Math.floor(width / 2);
await sharp(src).extract({ left: 0, top: 0, width: half, height }).jpeg({ quality: 90 }).toFile('src/assets/concept/ex-08-before.jpg');
await sharp(src).extract({ left: half, top: 0, width: half, height }).jpeg({ quality: 90 }).toFile('src/assets/concept/ex-08-after.jpg');
console.log('ex-08 halves written', half, 'x', height);
