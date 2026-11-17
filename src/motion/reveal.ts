// R1 rise (single element) and R2 card group. Hidden state lives in CSS (html.js [data-reveal]).
// Usage: data-reveal="rise" on one element; data-reveal-group on a container whose children carry data-reveal.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease, stagger, triggerStart } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa, show } from './dom';

export function initReveal(): () => void {
  if (isReduced()) return () => {};
  const rise = isMobile() ? 12 : 24;
  const triggers: ScrollTrigger[] = [];

  qsa('[data-reveal="rise"]').forEach((el) => {
    triggers.push(ScrollTrigger.create({ trigger: el, start: triggerStart, once: true,
      onEnter: () => gsap.fromTo(el, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out, clearProps: 'willChange' }) }));
  });

  // R2: one batch trigger per group, at most 5 per wave, 80ms stagger.
  qsa('[data-reveal-group]').forEach((group) => {
    const items = qsa('[data-reveal]', group);
    triggers.push(...ScrollTrigger.batch(items, { start: triggerStart, once: true, batchMax: stagger.maxItems,
      onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: 0.5, ease: ease.out, stagger: stagger.step, clearProps: 'willChange' }) }));
  });

  // Hidden content that receives focus or is targeted by an anchor shows immediately.
  const reveal = (el: Element | null) => { const h = el?.closest('[data-reveal]'); if (h) show(h); };
  const onFocus = (e: FocusEvent) => reveal(e.target as Element);
  const onHash = () => { const t = location.hash && document.getElementById(location.hash.slice(1)); if (t) { reveal(t); t.querySelectorAll('[data-reveal]').forEach((n) => show(n)); } };
  document.addEventListener('focusin', onFocus);
  window.addEventListener('hashchange', onHash);

  return () => {
    triggers.forEach((t) => t.kill());
    document.removeEventListener('focusin', onFocus);
    window.removeEventListener('hashchange', onHash);
    show(qsa('[data-reveal]'));
  };
}
