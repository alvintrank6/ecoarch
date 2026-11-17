// axe-core accessibility gate (serious and critical violations must be 0). Usage: node scripts/check-a11y.mjs [--quick]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { htmlFiles, report, DIST } from './lib.mjs';

const quick = process.argv.includes('--quick');
const PORT = 4399, BASE = process.env.UI_BASE || `http://localhost:${PORT}`;
let routes = htmlFiles().map((f) => f.replace(/\\/g, '/').replace(DIST + '/', '').replace(/index\.html$/, '')).filter((r) => r && !r.endsWith('404.html')).map((r) => '/' + r);
if (quick) routes = routes.filter((_, i) => i % 4 === 0);
let server;
if (!process.env.UI_BASE) {
  server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).status) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
}
const browser = await chromium.launch();
const fails = []; let n = 0;
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  for (const r of routes) {
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    n++;
    for (const v of res.violations.filter((x) => ['serious', 'critical'].includes(x.impact)))
      fails.push(`${r} [${w}] ${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0].target.join(' ').slice(0, 70)}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close(); server?.kill();
report('a11y', fails, n);
