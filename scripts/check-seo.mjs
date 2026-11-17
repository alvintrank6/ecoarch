// Zero-token SEO/structure gate on the production build.
import { htmlFiles, read, len, report, DIST } from './lib.mjs';
import { existsSync } from 'node:fs';

const NOINDEX = /(\/cam-on\/|\/thank-you\/|\/404\.html$)/;
const fails = [];
const files = htmlFiles();
for (const f of files) {
  const p = f.replace(/\\/g, '/');
  const h = read(f);
  const noindexPage = NOINDEX.test(p);
  const title = (h.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1];
  const desc = (h.match(/<meta[^>]+name="description"[^>]*>/) || [''])[0].match(/content="([^"]*)"/)?.[1];
  if (!title) fails.push(`${p}: no <title>`);
  else if (len(title) > 60) fails.push(`${p}: title ${len(title)} > 60`);
  if (!noindexPage) {
    if (!desc) fails.push(`${p}: no meta description`);
    else if (len(desc) > 155) fails.push(`${p}: description ${len(desc)} > 155`);
    if (!/<link[^>]+rel="canonical"[^>]+href="https?:\/\//.test(h)) fails.push(`${p}: canonical missing or not absolute`);
    for (const l of ['vi', 'en', 'x-default'])
      if (!new RegExp(`hreflang="${l}"`).test(h)) fails.push(`${p}: hreflang ${l} missing`);
  }
  if (noindexPage !== /<meta[^>]+name="robots"[^>]+noindex/.test(h))
    fails.push(`${p}: noindex should be ${noindexPage}`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fails.push(`${p}: ${h1} h1 (need 1)`);
  const lang = (h.match(/<html[^>]+lang="([^"]+)"/) || [])[1];
  const want = p.includes('/en/') ? 'en' : 'vi';
  if (lang !== want && !p.endsWith('404.html')) fails.push(`${p}: html lang ${lang}, want ${want}`);
  for (const img of h.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt=/.test(img)) fails.push(`${p}: img without alt`);
    if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) fails.push(`${p}: img without width/height`);
  }
}
if (!existsSync(`${DIST}/robots.txt`)) fails.push('robots.txt missing');
if (!existsSync(`${DIST}/sitemap-index.xml`) && !existsSync(`${DIST}/sitemap-0.xml`)) fails.push('sitemap missing');
report('seo', fails, files.length);
