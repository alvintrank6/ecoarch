// R1 rise, R2 card group, R9 list items, B2 self-drawing ticks, B3 masked prices, A12 rolling numerals.
// Hidden initial states live in CSS (html.js [data-reveal], [data-price], [data-numeral], [data-tick]); reduced motion and no-JS show everything.
// One IntersectionObserver per kind keeps ScrollTrigger count low (docs/12: at most 30 per page).
import { gsap } from 'gsap';
import { dur, ease, stagger } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa, show, onEnter } from './dom';

export function initReveal(): () => void {
  if (isReduced()) return () => {};
  const rise = isMobile() ? 12 : 24;
  const offs: Array<() => void> = [];
  const tweens: gsap.core.Animation[] = [];
  const nth = (i: number) => Math.min(i, stagger.maxItems - 1) * stagger.step;

  // R1 single elements and R2/R9 groups: opacity and y, 80 ms stagger, at most 5 per wave.
  const rises = qsa('[data-reveal="rise"]');
  const items = qsa('[data-reveal-group] > [data-reveal]');
  offs.push(onEnter([...rises, ...items], (batch) => {
    batch.forEach((el, i) => tweens.push(gsap.fromTo(el, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: 0.5, delay: nth(i), ease: ease.out, clearProps: 'willChange' })));
  }));

  // B2: tick strokes draw in 450 ms when their item enters.
  offs.push(onEnter(qsa('[data-tick]'), (batch) => {
    batch.forEach((svg, i) => { const p = svg.querySelector('path'); if (p) tweens.push(gsap.to(p, { strokeDashoffset: 0, duration: 0.45, delay: nth(i), ease: ease.out })); });
  }, '0px 0px -8% 0px'));

  // B3: prices appear through a mask, never counted up.
  // (observe the mask, not the translated child: IntersectionObserver ignores content clipped by overflow)
  offs.push(onEnter(qsa('[data-price]'), (batch) => {
    batch.forEach((mask, i) => tweens.push(gsap.fromTo(mask.firstElementChild, { yPercent: 110 }, { yPercent: 0, duration: dur.base, delay: nth(i), ease: ease.emphasis })));
  }));

  // A12: step numerals roll in through a mask (digits only, never money).
  offs.push(onEnter(qsa('[data-numeral]').map((n) => n.parentElement!), (batch) => {
    batch.forEach((mask, i) => tweens.push(gsap.fromTo(mask.firstElementChild, { yPercent: 110 }, { yPercent: 0, duration: 0.45, delay: nth(i) * 0.5, ease: ease.emphasis })));
  }));

  // Hidden content that receives focus or is targeted by an anchor shows immediately.
  const reveal = (el: Element | null) => { const h = el?.closest('[data-reveal]'); if (h) show(h); };
  const onFocus = (e: FocusEvent) => reveal(e.target as Element);
  const onHash = () => { const t = location.hash && document.getElementById(location.hash.slice(1)); if (t) { reveal(t); t.querySelectorAll('[data-reveal]').forEach((n) => show(n)); } };
  document.addEventListener('focusin', onFocus);
  window.addEventListener('hashchange', onHash);

  return () => {
    offs.forEach((o) => o());
    tweens.forEach((t) => t.kill());
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('hashchange', onHash);
    show(qsa('[data-reveal]'));
    gsap.set([...qsa('[data-price] > strong'), ...qsa('[data-numeral]')], { clearProps: 'all' });
    gsap.set(qsa('[data-tick] path'), { strokeDashoffset: 0 });
  };
}
