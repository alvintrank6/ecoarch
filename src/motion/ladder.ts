// P02 LADDER. A4: three package images in one sticky frame; each step wipes the next one in with a vertical clip-path (about 40% of a viewport per step).
// A11: stacked sticky cards, the card underneath scales to 0.97 as the next one slides over it. Desktop 1024px and up only; below that the cards simply stack.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease } from './tokens';
import { isReduced } from './prefs';
import { qs, qsa } from './dom';

export function initLadder(): () => void {
  const root = qs('[data-ladder]');
  if (!root || isReduced()) return () => {};
  const mq = window.matchMedia('(min-width: 1024px)');
  const arts = qsa('[data-ladder-art]', root);
  const cards = qsa('[data-ladder-card]', root);
  const sts: ScrollTrigger[] = [];
  let shown = 0;
  const showArt = (i: number) => {
    if (i === shown) return;
    arts.forEach((a, k) => { const on = k <= i; gsap.to(a, { clipPath: on ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)', duration: 0.6, ease: ease.inOut, overwrite: true }); });
    shown = i;
  };
  const build = () => {
    sts.forEach((s) => s.kill()); sts.length = 0;
    gsap.set(cards, { clearProps: 'scale' });
    if (!mq.matches) { gsap.set(arts, { clearProps: 'clipPath' }); return; }
    cards.forEach((card, i) => {
      sts.push(ScrollTrigger.create({ trigger: card, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) showArt(i); } }));
      if (i < cards.length - 1) sts.push(ScrollTrigger.create({ trigger: cards[i + 1], start: 'top 85%', end: 'top 35%', scrub: 0.4, animation: gsap.to(card, { scale: 0.97, ease: 'none' }) }));
    });
  };
  build();
  mq.addEventListener('change', build);
  return () => { mq.removeEventListener('change', build); sts.forEach((s) => s.kill()); gsap.set([...cards, ...arts], { clearProps: 'all' }); };
}
