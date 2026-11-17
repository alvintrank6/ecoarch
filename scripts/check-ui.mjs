// Zero-image-token UI gate: overflow, console errors, h1, no-JS and reduced-motion visibility.
// Usage: node scripts/check-ui.mjs [--quick]    (env UI_BASE to reuse a running server)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { htmlFiles, report, DIST } from './lib.mjs';

const quick = process.argv.includes('--quick');
const VIEWPORTS = quick
  ? [[360, 800], [1440, 900]]
  : [[360, 800], [390, 844], [768, 1024], [1024, 768], [1440, 900]];
const PORT = 4399;
const BASE = process.env.UI_BASE || `http://localhost:${PORT}`;
const routes = htmlFiles()
  .map((f) => f.replace(/\\/g, '/').replace(DIST + '/', '').replace(/index\.html$/, ''))
  .filter((r) => !r.endsWith('404.html') && r !== '')
  .map((r) => '/' + r);

let server;
if (!process.env.UI_BASE) {
  server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).status) break; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const fails = [];
let checked = 0;

async function visit(ctx, route, tag, vw, assertVisible) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('js error: ' + e.message.slice(0, 80)));
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push('console: ' + m.text().slice(0, 80)));
  page.on('response', (r) => r.status() >= 400 && r.url().startsWith(BASE) && errs.push(`HTTP ${r.status()} ${r.url().replace(BASE, '')}`));
  const res = await page.goto(BASE + route, { waitUntil: 'load' });
  checked++;
  if (!res || res.status() >= 400) fails.push(`${route} [${tag}] HTTP ${res?.status()}`);
  if (vw) {
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 1) fails.push(`${route} [${tag}] horizontal overflow ${over}px`);
    const h1 = await page.locator('h1:visible').count();
    if (h1 !== 1) fails.push(`${route} [${tag}] ${h1} visible h1`);
  }
  if (assertVisible) {
    await page.waitForTimeout(300);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity < 0.99).length);
    if (hidden) fails.push(`${route} [${tag}] ${hidden} [data-reveal] still hidden`);
  }
  for (const e of errs.slice(0, 2)) fails.push(`${route} [${tag}] ${e}`);
  await page.close();
}

for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const r of routes) await visit(ctx, r, `${w}x${h}`, true, false);
  await ctx.close();
}
const sample = routes.slice(0, 6);
const noJs = await browser.newContext({ javaScriptEnabled: false });
for (const r of sample) await visit(noJs, r, 'no-js', false, true);
await noJs.close();
const reduced = await browser.newContext({ reducedMotion: 'reduce' });
for (const r of sample) await visit(reduced, r, 'reduced-motion', false, true);
await reduced.close();

await browser.close();
server?.kill();
report('ui', fails, checked);
