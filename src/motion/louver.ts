// R3 louver reveal: vertical slats in the page colour open (scaleX 1 -> 0, origin left), image settles 1.03 -> 1.
// Slats are inserted by JS and removed when done; without JS there are none. At most 2 louvers play at once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease, slats } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';

export function initLouver(): () => void {
  if (isReduced()) return () => {};
  const n = isMobile() ? slats.mobile : slats.desktop;
  const triggers: ScrollTrigger[] = [];
  const created: HTMLElement[] = [];
  const tweens: gsap.core.Animation[] = [];
  let playing = 0;

  qsa('[data-louver]').forEach((el) => {
    const img = el.querySelector('img');
    const wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    Object.assign(wrap.style, { position: 'absolute', inset: '0', display: 'flex', zIndex: '6', pointerEvents: 'none' });
    const bars = Array.from({ length: n }, () => {
      const i = document.createElement('i');
      // 1px overlap on the right edge avoids hairline seams between slats.
      Object.assign(i.style, { display: 'block', flex: '1 0 0', marginRight: '-1px', background: 'var(--color-bg)', transformOrigin: 'left center' });
      wrap.appendChild(i);
      return i;
    });
    el.appendChild(wrap); created.push(wrap);

    triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => {
      const done = () => { wrap.remove(); playing = Math.max(0, playing - 1); };
      playing++;
      if (playing > 2) { // viewport budget: extra louvers just fade
        tweens.push(gsap.to(wrap, { opacity: 0, duration: 0.35, onComplete: done }));
        return;
      }
      const tl = gsap.timeline({ onComplete: done });
      tl.to(bars, { scaleX: 0, duration: dur.slow - 0.1, ease: ease.inOut, stagger: 0.06 }, 0);
      if (img) tl.fromTo(img, { scale: 1.03 }, { scale: 1, duration: 1.1, ease: ease.out, clearProps: 'willChange' }, 0);
      tweens.push(tl);
    } }));
  });

  return () => { triggers.forEach((t) => t.kill()); tweens.forEach((t) => t.kill()); created.forEach((w) => w.remove()); };
}
