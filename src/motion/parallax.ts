// A5: the image inside a frame is 16% taller than the frame and moves at most 6% of the frame height while scrolling.
// Desktop only, never for the LCP image, never for text.
import { gsap } from 'gsap';
import { v3 } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qs, qsa } from './dom';

export function initParallax(): () => void {
  if (isReduced() || isMobile()) return () => {};
  const frames = qsa('[data-parallax]').filter((f) => !f.querySelector('img[fetchpriority="high"]'));
  const tw: gsap.core.Tween[] = [];
  frames.forEach((f) => {
    const fig = qs('.concept-figure, .art, svg', f) ?? f.firstElementChild;
    if (!fig) return;
    tw.push(gsap.fromTo(fig, { y: () => -f.clientHeight * v3.parallaxFrame }, { y: () => f.clientHeight * v3.parallaxFrame, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } }));
  });
  return () => { tw.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); gsap.set(frames.map((f) => qs('.concept-figure', f)).filter(Boolean) as Element[], { clearProps: 'transform' }); };
}
