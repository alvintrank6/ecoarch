// Zero-token gate on the build: lazy images except the hero, one fetchpriority=high at most, optimized formats only.
import { htmlFiles, read, report } from './lib.mjs';
const fails = []; let n = 0;
for (const f of htmlFiles()) {
  const p = f.replace(/\\/g, '/'); const h = read(f);
  const imgs = h.match(/<img\b[^>]*>/g) || []; n += imgs.length;
  const eager = imgs.filter((i) => !/loading="lazy"/.test(i));
  const high = imgs.filter((i) => /fetchpriority="high"/.test(i));
  const isHome = /\/(vi|en)\/index\.html$/.test(p);
  if (high.length > 1) fails.push(`${p}: ${high.length} fetchpriority=high images`);
  if (high.length && !isHome) fails.push(`${p}: fetchpriority=high outside home hero`);
  for (const i of eager) if (!/fetchpriority="high"/.test(i) && !/data-lb-img/.test(i)) fails.push(`${p}: non-lazy image that is not the hero`);
  for (const i of imgs) {
    const src = (i.match(/\bsrc="([^"]+)"/) || [])[1] || '';
    if (/\.(png|jpe?g)(\?|$)/i.test(src)) fails.push(`${p}: unoptimized image ${src.slice(-40)}`);
  }
}
report('images', fails, n);
