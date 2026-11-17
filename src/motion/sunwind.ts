// A2 sun path and A3 wind, on the sun and wind diagram. A2: the sun arrow draws and the sun dot travels along it.
// A3: three wind strokes draw, then pulse for two passes and stop (never an endless loop). Desktop, non-reduced only; otherwise the diagram is static.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qs, qsa } from './dom';

export function initSunWind(): () => void {
  if (isReduced() || isMobile()) return () => {};
  const figs = qsa('[data-sunwind]');
  const sts: ScrollTrigger[] = [];
  const tw: gsap.core.Animation[] = [];
  figs.forEach((fig) => {
    const focus = (fig as HTMLElement).dataset.focus ?? 'both';
    const sun = qs<SVGGeometryElement>('.sun-line', fig), dot = qs<SVGCircleElement>('.sun-dot', fig), winds = qsa<SVGGeometryElement>('.wind', fig);
    sts.push(ScrollTrigger.create({ trigger: fig, start: 'top 75%', once: true, onEnter: () => {
      const tl = gsap.timeline(); tw.push(tl);
      if (sun && focus !== 'wind') {
        tl.to(sun, { strokeDashoffset: 0, duration: dur.draw, ease: ease.inOut }, 0);
        if (dot) { const len = sun.getTotalLength(); const o = { p: 0 };
          tl.to(o, { p: 1, duration: dur.draw, ease: ease.inOut, onUpdate: () => { const pt = sun.getPointAtLength(len * o.p); dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y)); } }, 0); }
      }
      if (winds.length && focus !== 'sun') {
        const at = focus === 'both' ? dur.draw + 0.3 : 0;
        tl.to(winds, { strokeDashoffset: 0, duration: 0.9, stagger: 0.15, ease: ease.inOut }, at);
        tl.to(winds, { opacity: 0.55, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at + 1.2); // two passes, then rest
        tl.set(winds, { clearProps: 'opacity' });
      }
    } }));
  });
  return () => { sts.forEach((s) => s.kill()); tw.forEach((t) => t.kill()); gsap.set(qsa('[data-sunwind] [pathLength], [data-sunwind] .wind'), { clearProps: 'all' }); };
}
