// R5 rule draws from the left; R6 draws SVG strokes (pathLength=1) in order. Text is never hidden.
// Desktop only for R6; mobile and reduced show everything (CSS keeps them visible there).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';

export function initDraw(): () => void {
  if (isReduced()) return () => {};
  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Animation[] = [];

  qsa('[data-rule]').filter((el) => !el.closest('[data-scene]')).forEach((el) => { // rules inside sections belong to scene()
    triggers.push(ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
      onEnter: () => tweens.push(gsap.to(el, { scaleX: 1, duration: 0.6, ease: ease.out, clearProps: 'willChange' })) }));
  });

  if (!isMobile()) {
    qsa('[data-draw]').forEach((box) => {
      const paths = qsa<SVGGeometryElement>('[pathLength]', box);
      triggers.push(ScrollTrigger.create({ trigger: box, start: 'top 78%', once: true,
        onEnter: () => tweens.push(gsap.to(paths, { strokeDashoffset: 0, duration: dur.draw, ease: ease.inOut, stagger: 0.08 })) }));
    });
  }
  return () => {
    triggers.forEach((t) => t.kill());
    tweens.forEach((t) => t.kill());
    gsap.set([...qsa('[data-rule]').filter((el) => !el.closest('[data-scene]')), ...qsa('[data-draw] [pathLength]')], { clearProps: 'all' });
  };
}
