// Zero-image-token interaction gate: slider by keyboard, mobile menu focus trap, labels in both locales.
// Usage: node scripts/check-interact.mjs   (env UI_BASE to reuse a running server)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { report } from './lib.mjs';

const PORT = 4399, BASE = process.env.UI_BASE || `http://localhost:${PORT}`;
let server;
if (!process.env.UI_BASE) {
  server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE)).status) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
}
const browser = await chromium.launch();
const fails = [];
let n = 0;
const ok = (c, m) => { n++; if (!c) fails.push(m); };

for (const [lang, before, after] of [['vi', 'TRƯỚC', 'SAU'], ['en', 'BEFORE', 'AFTER']]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/${lang}/`);
  const range = p.locator('[data-compare] input[type=range]');
  await range.scrollIntoViewIfNeeded();
  await p.waitForTimeout(2500); // let louver/hint finish
  await range.focus();
  const v0 = Number(await range.inputValue());
  await p.keyboard.press('ArrowRight');
  ok(Number(await range.inputValue()) === v0 + 1, `${lang}: ArrowRight did not move slider`);
  await p.keyboard.press('Home');
  ok((await range.inputValue()) === '0', `${lang}: Home did not go to 0`);
  ok(/\d+%/.test((await range.getAttribute('aria-valuetext')) || ''), `${lang}: aria-valuetext missing`);
  const text = await p.locator('[data-compare]').innerText();
  ok(text.includes(before) && text.includes(after), `${lang}: ${before}/${after} labels missing as real text`);
  ok(await p.locator('[data-compare] .illus-label').count() > 0, `${lang}: concept label missing on slider`);
  await ctx.close();
}

{ // mobile menu: open, focus inside, Esc closes and returns focus
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/`);
  await p.waitForTimeout(500);
  await p.click('[data-menu-btn]');
  await p.waitForTimeout(600);
  ok(await p.evaluate(() => !!document.activeElement?.closest('[data-menu-panel]')), 'menu: focus not inside panel');
  for (let i = 0; i < 12; i++) await p.keyboard.press('Tab');
  ok(await p.evaluate(() => !!document.activeElement?.closest('[data-menu-panel]')), 'menu: focus escaped the trap');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.activeElement?.hasAttribute('data-menu-btn')), 'menu: focus not restored to button');
  await ctx.close();
}

{ // lightbox: open, arrows, Esc, focus returns to the thumbnail
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/phuong-an/`);
  await p.waitForTimeout(800);
  const first = p.locator('[data-lb-item]').first();
  await first.scrollIntoViewIfNeeded();
  await first.focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  ok(await p.locator('dialog[open]').count() === 1, 'lightbox: did not open');
  const c0 = await p.locator('[data-lb-count]').innerText();
  await p.keyboard.press('ArrowRight');
  ok((await p.locator('[data-lb-count]').innerText()) !== c0, 'lightbox: ArrowRight did not advance');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  ok(await p.locator('dialog[open]').count() === 0, 'lightbox: Esc did not close');
  ok(await p.evaluate(() => document.activeElement?.hasAttribute('data-lb-item')), 'lightbox: focus not returned to thumbnail');
  await ctx.close();
}

await browser.close();
server?.kill();
report('interact', fails, n);
