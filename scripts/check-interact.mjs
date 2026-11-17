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
  const range = p.locator('[data-compare] input[type=range]').first();
  await range.scrollIntoViewIfNeeded();
  await p.waitForTimeout(2500); // let louver/hint finish
  await range.focus();
  const v0 = Number(await range.inputValue());
  await p.keyboard.press('ArrowRight');
  ok(Number(await range.inputValue()) === v0 + 1, `${lang}: ArrowRight did not move slider`);
  await p.keyboard.press('Home');
  ok((await range.inputValue()) === '0', `${lang}: Home did not go to 0`);
  ok(/\d+%/.test((await range.getAttribute('aria-valuetext')) || ''), `${lang}: aria-valuetext missing`);
  const text = await p.locator('[data-compare]').first().innerText();
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

{ // FAQ accordion + process plan
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/hoi-dap/`);
  await p.waitForTimeout(500);
  const q = p.locator('[data-faq-btn]').first();
  ok((await q.getAttribute('aria-expanded')) === 'false', 'faq: should start collapsed');
  await q.click();
  await p.waitForTimeout(500);
  ok((await q.getAttribute('aria-expanded')) === 'true', 'faq: did not expand');
  ok(await p.locator('#faq-P17-2-a0').evaluate((e) => getComputedStyle(e).visibility === 'visible'), 'faq: answer not visible');
  await p.goto(`${BASE}/vi/quy-trinh/`);
  await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollTo(0, 1500));
  await p.waitForTimeout(1200);
  ok(await p.locator('[data-step-item][aria-current=step]').count() === 1, 'process: no current step while scrolling');
  await ctx.close();
}

{ // booking form: validation, aria-live errors, data kept on network error, success redirect, no-JS POST
  const fill = async (p) => {
    await p.fill('#book-plot', 'Cầu Giấy');
    await p.selectOption('#book-type', 't2').catch(() => {});
    await p.fill('#book-name', 'Test');
    await p.fill('#book-contact', 'test@example.com');
    await p.check('#book-consent');
  };
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/dat-lich/`);
  await p.waitForTimeout(400);
  await p.click('[data-form-submit]');
  ok(await p.locator('.err').count() >= 4, 'form: empty submit should show field errors');
  ok((await p.locator('#book-plot').getAttribute('aria-invalid')) === 'true', 'form: aria-invalid missing');
  ok(await p.evaluate(() => document.activeElement?.id === 'book-name'), 'form: first invalid field not focused');
  ok((await p.locator('[data-form-status]').getAttribute('data-state')) === 'error', 'form: status not in error state');
  await fill(p);
  await p.fill('#book-contact', 'abc');
  await p.click('[data-form-submit]');
  ok(await p.locator('#book-contact-err').count() === 1, 'form: invalid contact not flagged');
  await p.fill('#book-contact', 'test@example.com');
  // network error keeps data
  await p.evaluate(() => document.querySelector('form[data-form]').setAttribute('data-endpoint', 'http://localhost:9/nope'));
  await p.route('http://localhost:9/**', (r) => r.abort());
  await p.click('[data-form-submit]');
  await p.waitForTimeout(600);
  ok((await p.locator('[data-form-status]').getAttribute('data-state')) === 'error', 'form: network error state missing');
  ok((await p.inputValue('#book-plot')) === 'Cầu Giấy', 'form: data lost after network error');
  // success path (no endpoint configured here): redirect to thank-you
  await p.evaluate(() => document.querySelector('form[data-form]').setAttribute('data-endpoint', ''));
  await p.click('[data-form-submit]');
  await p.waitForURL(/\/vi\/cam-on\//, { timeout: 4000 }).catch(() => {});
  ok(/\/vi\/cam-on\//.test(p.url()), 'form: did not redirect to thank-you');
  await ctx.close();
  const nj = await browser.newContext({ javaScriptEnabled: false });
  const q = await nj.newPage();
  await q.goto(`${BASE}/vi/dat-lich/`);
  await fill(q).catch(() => {});
  ok(await q.locator('form[data-form]').getAttribute('method') === 'post' && !!(await q.locator('form[data-form]').getAttribute('action')), 'form: no real POST action for no-JS');
  await nj.close();
}

{ // page transitions: wipe into booking, back/forward leave no overlay
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/`);
  await p.waitForTimeout(800);
  await p.click('.cta[data-wipe]');
  await p.waitForURL(/dat-lich/, { timeout: 5000 }).catch(() => {});
  ok(/dat-lich/.test(p.url()), 'wipe: did not reach booking page');
  await p.waitForTimeout(1500);
  ok(await p.locator('[data-wipe-plate]').count() === 0, 'wipe: plate left in DOM after arrival');
  ok(!(await p.evaluate(() => document.documentElement.classList.contains('wipe-in'))), 'wipe: placeholder cover not cleared');
  await p.goBack(); await p.waitForTimeout(1200);
  ok(await p.locator('[data-wipe-plate]').count() === 0, 'wipe: overlay after back');
  ok(!(await p.evaluate(() => document.documentElement.classList.contains('wipe-in'))), 'wipe: cover after back');
  await p.goForward(); await p.waitForTimeout(1500);
  ok(await p.locator('[data-wipe-plate]').count() === 0, 'wipe: overlay after forward');
  ok(await p.locator('h1').first().isVisible(), 'wipe: h1 not visible after forward');
  await ctx.close();
}

{ // reduced-motion toggle: sets html[data-motion], persists across reload, keeps every [data-reveal] visible
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/`);
  await p.waitForTimeout(500);
  const btn = p.locator('[data-motion-toggle]');
  await btn.scrollIntoViewIfNeeded();
  ok((await btn.getAttribute('aria-pressed')) === 'false', 'toggle: should start unpressed');
  await btn.click();
  ok((await p.evaluate(() => document.documentElement.dataset.motion)) === 'reduced', 'toggle: html[data-motion] not set');
  ok((await btn.getAttribute('aria-pressed')) === 'true', 'toggle: aria-pressed not updated');
  await p.reload(); await p.waitForTimeout(600);
  ok((await p.evaluate(() => document.documentElement.dataset.motion)) === 'reduced', 'toggle: choice not persisted');
  const hidden = await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity < 0.99).length);
  ok(hidden === 0, `toggle: ${hidden} [data-reveal] hidden under reduced motion`);
  await ctx.close();
}

{ // T1 louver curtain between top-level nav items: reaches the page, leaves no overlay, back works
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/vi/`);
  await p.waitForTimeout(600);
  await p.click('.desktop-nav a[data-curtain]');
  await p.waitForURL(/dich-vu/, { timeout: 5000 }).catch(() => {});
  ok(/dich-vu/.test(p.url()), 'curtain: did not reach the page');
  await p.waitForTimeout(1500);
  ok(await p.locator('[data-wipe-plate]').count() === 0, 'curtain: overlay left after arrival');
  ok(!(await p.evaluate(() => document.documentElement.classList.contains('curtain-in'))), 'curtain: placeholder not cleared');
  await p.goBack(); await p.waitForTimeout(1200);
  ok(await p.locator('[data-wipe-plate]').count() === 0, 'curtain: overlay after back');
  await ctx.close();
}

await browser.close();
server?.kill();
report('interact', fails, n);
