// R7 + A10 + A12 on the ten-step process (P12). One ScrollTrigger follows reading progress through the steps (CSS `sticky` holds the plan, no pin).
// Strokes of the line plan are drawn as their step is reached (R7); the in-page step list marks the current step (A10).
// Below 1024px or under reduced motion the whole plan is shown and nothing is tracked.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease } from './tokens';
import { isReduced } from './prefs';
import { qs, qsa } from './dom';

export function initProcess(): () => void {
  const root = qs('[data-process]');
  if (!root) return () => {};
  const list = qs('[data-steps]', root)!;
  const items = qsa('[data-step-item]', root);
  const toc = qsa('[data-toc]', root);
  const strokes = qsa<SVGGeometryElement>('[data-plan] .draw', root);
  const mq = window.matchMedia('(min-width: 1024px)');
  let st: ScrollTrigger | null = null;
  let cur = 0;

  const showAll = () => { gsap.killTweensOf(strokes); gsap.set(strokes, { strokeDasharray: 'none', strokeDashoffset: 0 }); };
  const mark = (n: number) => {
    cur = n;
    items.forEach((li, i) => (i + 1 === n ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current')));
    toc.forEach((li, i) => li.classList.toggle('on', i + 1 === n));
    strokes.forEach((el) => {
      const on = Number((el as unknown as HTMLElement).dataset.stepFrom) <= n;
      if ((el as unknown as HTMLElement).dataset.on === String(on)) return;
      (el as unknown as HTMLElement).dataset.on = String(on);
      gsap.killTweensOf(el);
      gsap.to(el, { strokeDashoffset: on ? 0 : 1, duration: on ? dur.slow : 0.3, ease: on ? ease.inOut : ease.out });
    });
  };
  const apply = () => {
    st?.kill(); st = null; cur = 0;
    items.forEach((li) => li.removeAttribute('aria-current')); toc.forEach((li) => li.classList.remove('on'));
    if (isReduced() || !mq.matches) { showAll(); return; }
    strokes.forEach((el) => { delete (el as unknown as HTMLElement).dataset.on; gsap.set(el, { strokeDasharray: 1, strokeDashoffset: 1 }); });
    st = ScrollTrigger.create({ trigger: list, start: 'top 55%', end: 'bottom 55%',
      onUpdate: (self) => { const n = Math.min(items.length, Math.floor(self.progress * items.length) + 1); if (n !== cur) mark(n); },
      onEnter: () => mark(1), onLeaveBack: () => { cur = 0; strokes.forEach((el) => { delete (el as unknown as HTMLElement).dataset.on; gsap.to(el, { strokeDashoffset: 1, duration: 0.3 }); }); items.forEach((li) => li.removeAttribute('aria-current')); toc.forEach((li) => li.classList.remove('on')); } });
  };
  apply();
  mq.addEventListener('change', apply);
  return () => { mq.removeEventListener('change', apply); st?.kill(); showAll(); };
}
