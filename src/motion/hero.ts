// H1 zoom-out, H2 masked line rise, H3 body + CTA, H4 light sweep, H5 scroll cue, H6 parallax.
// Hero LCP image is never hidden: H1 only scales 1.04 -> 1.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { dur, ease, parallaxMax } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qs, show } from './dom';

export function initHero(): () => void {
  const root = qs('[data-hero]');
  if (!root) return () => {};
  const eyebrow = qs('[data-hero-eyebrow]', root)!;
  const title = qs('[data-hero-title]', root)!;
  const body = qs('[data-hero-body]', root)!;
  const cta = qs('[data-hero-cta]', root)!;
  const media = qs('[data-hero-media]', root)!;
  const text = qs('[data-hero-text]', root)!;
  const cue = qs('[data-scroll-cue]', root);
  const frame = qs('.hero-frame', root)!;

  // Reduced motion (OS or toggle): CSS already shows everything; nothing to run.
  if (isReduced()) { show([eyebrow, title, body, cta]); return () => {}; }

  const mobile = isMobile();
  let killed = false;
  let split: SplitText[] = [];
  let light: HTMLElement | null = null;
  const tweens: gsap.core.Animation[] = [];
  const triggers: ScrollTrigger[] = [];
  const onVis = () => { cueTween && (document.hidden ? cueTween.pause() : cueTween.resume()); };
  let cueTween: gsap.core.Tween | null = null;

  const run = () => {
    if (killed) return;
    const tl = gsap.timeline();
    tweens.push(tl);

    // H1: image settles from 1.04 to 1 (the single cinematic moment of the page).
    tl.fromTo(media, { scale: 1.04 }, { scale: 1, duration: dur.cine, ease: ease.out, onComplete: () => { gsap.set(media, { clearProps: 'willChange' }); } }, 0);

    if (mobile) {
      // Mobile: fade and rise at most 12px, 450ms.
      tl.fromTo([eyebrow, title], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out, stagger: 0.06 }, 0.1);
    } else {
      // H2: lines rise inside overflow masks. Split while still hidden, then reveal the wrapper.
      split = [eyebrow, title].map((el) => SplitText.create(el, { type: 'lines', mask: 'lines' }));
      const lines = split.flatMap((s) => s.lines);
      gsap.set(lines, { yPercent: 105 });
      gsap.set([eyebrow, title], { opacity: 1, y: 0 });
      tl.to(lines, { yPercent: 0, duration: dur.base, ease: ease.emphasis, stagger: 0.08,
        onComplete: () => { split.forEach((s) => s.revert()); split = []; } }, 0.1);
    }

    // H3: body and CTA follow right behind the title; CTA lags at most 120ms. No pointer-events changes.
    tl.fromTo(body, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: ease.out }, 0.3);
    tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: ease.out }, 0.4);

    if (!mobile) {
      // H4: one soft light pass, once (opacity max .18). Element removed afterwards.
      light = document.createElement('div');
      light.setAttribute('aria-hidden', 'true');
      Object.assign(light.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '1',
        background: 'linear-gradient(105deg, transparent 35%, rgba(244,235,221,.18) 50%, transparent 65%)' });
      frame.appendChild(light);
      tl.fromTo(light, { xPercent: -120 }, { xPercent: 120, duration: 1.4, ease: ease.inOut, onComplete: () => { light?.remove(); light = null; } }, 0.7);

      // H5: scroll cue bob, 6 cycles, stops on scroll or hidden tab (the page's only loop).
      if (cue) {
        const stopOnScroll = () => { if (window.scrollY > 8) { cueTween?.kill(); gsap.set(cue, { clearProps: 'transform' }); window.removeEventListener('scroll', stopOnScroll); } };
        cueTween = gsap.to(cue, { y: 6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 11, delay: 1.2 });
        tweens.push(cueTween);
        window.addEventListener('scroll', stopOnScroll, { passive: true });
        document.addEventListener('visibilitychange', onVis);
      }

      // H6: very light parallax, desktop only (max 4%; text -2%).
      triggers.push(ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8,
        animation: gsap.timeline().to(media, { yPercent: parallaxMax, ease: 'none' }, 0).to(text, { yPercent: -2, ease: 'none' }, 0) }));
    }
  };

  // Split after fonts settle so line breaks are final; never wait longer than 600ms.
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 600))]).then(run);

  return () => {
    killed = true;
    document.removeEventListener('visibilitychange', onVis);
    tweens.forEach((t) => t.kill());
    triggers.forEach((t) => t.kill());
    split.forEach((s) => s.revert());
    light?.remove();
    gsap.set([media, text, eyebrow, title, body, cta, ...(cue ? [cue] : [])], { clearProps: 'all' });
    show([eyebrow, title, body, cta]);
  };
}
