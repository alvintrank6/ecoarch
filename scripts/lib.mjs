import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const DIST = process.env.DIST || 'dist';

export function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, test, out);
    else if (test(p)) out.push(p);
  }
  return out;
}
export const htmlFiles = () => walk(DIST, (p) => p.endsWith('.html'));
export const read = (p) => readFileSync(p, 'utf8');
export const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
   .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
export const len = (s) => [...decode(s).normalize('NFC')].length;

export function report(name, fails, checked) {
  if (!fails.length) { console.log(`${name} OK (${checked} checked)`); return; }
  console.log(`${name} FAIL ${fails.length}/${checked}`);
  for (const f of fails.slice(0, 20)) console.log('  ' + f);
  if (fails.length > 20) console.log(`  ...and ${fails.length - 20} more`);
  process.exitCode = 1;
}
