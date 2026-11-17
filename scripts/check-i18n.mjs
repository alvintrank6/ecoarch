// Zero-token gate: vi.json and en.json must have identical key sets and no empty strings.
import { readFileSync } from 'node:fs';
import { report } from './lib.mjs';
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => typeof v === 'object' && v ? flat(v, p + k + '.') : [[p + k, v]]);
const load = (l) => new Map(flat(JSON.parse(readFileSync(`src/content/${l}.json`, 'utf8'))));
const vi = load('vi'), en = load('en'), fails = [];
for (const [k, v] of vi) { if (!en.has(k)) fails.push(`en missing ${k}`); if (!String(v).trim()) fails.push(`vi empty ${k}`); }
for (const [k, v] of en) { if (!vi.has(k)) fails.push(`vi missing ${k}`); if (!String(v).trim()) fails.push(`en empty ${k}`); }
report('i18n', fails, vi.size);
