// Zero-token structure gate: home has 5 sections, every other content page has 4.
// Convention: each section is an element with data-section (one per section, direct content blocks, not nested).
import { htmlFiles, read, report, DIST } from './lib.mjs';

const EXEMPT = /(cam-on|thank-you|404)/;
const fails = [];
let checked = 0;
for (const f of htmlFiles()) {
  const p = f.replace(/\\/g, '/').replace(DIST + '/', '');
  if (EXEMPT.test(p) || p === 'index.html') continue; // utility pages and the root redirect
  const html = read(f);
  if (/http-equiv="refresh"/i.test(html) && !/<h1/.test(html)) continue; // root redirect
  const n = (html.match(/<[a-z0-9]+[^>]*\sdata-section(=|\s|>)/g) || []).length;
  const isHome = /^(vi|en)\/index\.html$/.test(p);
  const want = isHome ? 5 : 4;
  checked++;
  if (n !== want) fails.push(`${p}: ${n} [data-section], expected ${want}`);
}
report('structure', fails, checked);
