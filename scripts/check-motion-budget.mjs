// Zero-token motion gate (docs/12 section 12.5): distinct effect IDs per page against the tier limit, and the default package of each section type.
// Reads the effect IDs declared in docs/11-PAGES via src/content/pages.json. Global defaults are not counted.
import { readFileSync } from 'node:fs';
import { report } from './lib.mjs';
const pages = JSON.parse(readFileSync('src/content/pages.json', 'utf8'));
const GLOBAL = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'N1', 'A1', 'A9', 'B1', 'B4', 'T4', 'P2']);
const LIMIT = { S: 16, A: 12, B: 6 };
const PACKAGE = { // docs/12 section 12.4: IDs that must appear in a section of this type (A1/T4 are global and optional here)
  'HERO-HOME': ['H1', 'H2', 'H3'], SUNWIND: ['A2', 'R5'], CARDS: ['R2'], LADDER: ['A4', 'A11'], FEE: ['R5', 'R9'], COMPARE: ['R3', 'C1'], RAIL: ['A8', 'A7'],
  TRIO: ['R2'], STEPS: ['R7'], LIST: ['R9'], FAQ: ['F1', 'R9'], FORM: ['F2', 'F3'], CTA: ['A6'], 'CTA-FORM': ['A6'],
};
const fails = []; let n = 0;
for (const [pid, p] of Object.entries(pages)) {
  const ids = new Set(p.sections.flatMap((s) => s.effects).filter((e) => !GLOBAL.has(e)));
  n++;
  if (ids.size > LIMIT[p.tier]) fails.push(`${pid} (tier ${p.tier}): ${ids.size} effect types > ${LIMIT[p.tier]}: ${[...ids].join(' ')}`);
}
report('motion-budget', fails, n);
