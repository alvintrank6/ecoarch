// Zero-token gate: titles and descriptions in vi.json/en.json must equal the SEO table in docs/04 (copy, never retype).
import { readFileSync } from 'node:fs';
import { report } from './lib.mjs';
const ids = { P01: 'home', P02: 'services', P03: 'prelim', P04: 'ideas', P05: 'complete', P06: 'concepts', P07: 'tubeHouse', P08: 'townhouse', P09: 'villa', P10: 'apartment',
  P11: 'about', P12: 'process', P13: 'scope', P14: 'insights', P15: 'readSunWind', P16: 'prepareCall', P17: 'faq', P18: 'book', P19: 'contact', P20: 'privacy' };
const norm = (s) => s.normalize('NFC').trim();
const vi = JSON.parse(readFileSync('src/content/vi.json', 'utf8')).pages, en = JSON.parse(readFileSync('src/content/en.json', 'utf8')).pages;
const fails = []; let n = 0;
for (const line of readFileSync('docs/04-CONTENT.md', 'utf8').split('\n')) {
  const m = line.match(/^\| (P\d\d) \|(.*)\|\s*$/);
  if (!m || !ids[m[1]]) continue;
  const cells = m[2].split(/(?<!\\)\|/).map((c) => norm(c.replace(/\\\|/g, '|')));
  if (cells.length !== 4) continue; // SEO rows have 5 columns including the id
  const [tv, dv, te, de] = cells; const id = ids[m[1]]; n++;
  if (vi[id].title !== tv) fails.push(`${id} vi title differs from docs/04`);
  if (vi[id].description !== dv) fails.push(`${id} vi description differs`);
  if (en[id].title !== te) fails.push(`${id} en title differs`);
  if (en[id].description !== de) fails.push(`${id} en description differs`);
}
if (n !== 20) fails.push(`expected 20 SEO rows, parsed ${n}`);
report('seo-table', fails, n);
