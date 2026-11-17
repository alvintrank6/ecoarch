// R7: one ScrollTrigger tracks reading progress through the ten steps; the sticky plan draws groups up to the
// current step. Position is CSS `sticky` (no pin). Mobile (<1024px) and reduced motion: whole plan shown, no trigger.
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
  const groups = qsa<SVGGElement>('g[data-step]', root);
  const mq = window.matchMedia('(min-width: 1024px)');
  let st: ScrollTrigger | null = null;
  let cur = 0;

  const paths = (g: SVGGElement) => qsa<SVGPathElement>('path', g);
  const setGroup = (g: SVGGElement, on: boolean) => {
    gsap.killTweensOf(paths(g));
    if (on) gsap.to(paths(g), { strokeDashoffset: 0, duration: dur.slow, ease: ease.inOut, overwrite: true });
    else gsap.to(paths(g), { strokeDashoffset: 1, duration: 0.3, ease: ease.out, overwrite: true });
  };
  const showAll = () => groups.forEach((g) => { gsap.killTweensOf(paths(g)); gsap.set(paths(g), { strokeDasharray: 'none', strokeDashoffset: 0 }); });
  const mark = (n: number) => {
    cur = n;
    items.forEach((li, i) => (i + 1 === n ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current')));
    groups.forEach((g) => { const on = Number(g.dataset.step) <= n; if (g.classList.contains('on') !== on) { g.classList.toggle('on', on); setGroup(g, on); } });
  };
  const apply = () => {
    st?.kill(); st = null;
    items.forEach((li) => li.removeAttribute('aria-current'));
    if (isReduced() || !mq.matches) { showAll(); return; }
    groups.forEach((g) => { g.classList.remove('on'); gsap.set(paths(g), { strokeDasharray: 1, strokeDashoffset: 1 }); });
    cur = 0;
    st = ScrollTrigger.create({ trigger: list, start: 'top 55%', end: 'bottom 55%',
      onUpdate: (self) => { const n = Math.min(items.length, Math.floor(self.progress * items.length) + 1); if (n !== cur) mark(n); },
      onEnter: () => mark(1), onLeaveBack: () => { cur = 0; groups.forEach((g) => { g.classList.remove('on'); setGroup(g, false); }); items.forEach((li) => li.removeAttribute('aria-current')); } });
  };
  apply();
  mq.addEventListener('change', apply);
  return () => { mq.removeEventListener('change', apply); st?.kill(); showAll(); };
}
