// Zero-image-token motion gate: scroll every page top to bottom with motion ON and assert that nothing stays hidden,
// nothing throws, and no [data-wipe-plate] overlay is left behind. Usage: node scripts/check-motion.mjs [--quick]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { htmlFiles, report, DIST } from './lib.mjs';

const quick = process.argv.includes('--quick');
const PORT = 4399, BASE = process.env.UI_BASE || `http://localhost:${PORT}`;
let routes = htmlFiles().map((f) => f.replace(/\\/g, '/').replace(DIST + '/', '').replace(/index\.html$/, '')).filter((r) => r && !r.endsWith('404.html')).map((r) => '/' + r);
if (quick) routes = routes.filter((_, i) => i % 3 === 0);
let server;
if (!process.env.UI_BASE) {
  server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).status) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
}
const browser = await chromium.launch();
const fails = []; let n = 0;
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const r of routes) {
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));
    p.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text().slice(0, 90)));
    await p.goto(BASE + r, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(h * 0.7)) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); }
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(1800);
    const left = await p.evaluate(() => ({
      hidden: [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity < 0.99 && getComputedStyle(e).visibility !== 'hidden').map((e) => (e.dataset.s || e.tagName) + ':' + (e.textContent || '').trim().slice(0, 20)),
      plate: document.querySelectorAll('[data-wipe-plate]').length,
      over: document.documentElement.scrollWidth - window.innerWidth,
    }));
    n++;
    if (left.hidden.length) fails.push(`${r} [${w}] ${left.hidden.length} hidden after scroll: ${left.hidden.slice(0, 2).join(' | ')}`);
    if (left.plate) fails.push(`${r} [${w}] overlay left in DOM`);
    if (left.over > 1) fails.push(`${r} [${w}] horizontal overflow ${left.over}px`);
    for (const e of errs.slice(0, 2)) fails.push(`${r} [${w}] ${e}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close(); server?.kill();
report('motion', fails, n);
