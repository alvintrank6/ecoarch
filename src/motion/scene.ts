// T4 scene(): the default choreography of every section. One timeline per section, fixed order:
// rule 0, eyebrow 80, heading 160 (A1: masked lines), body 280, button 320, media 360 (ms).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { dur, ease, v3, triggerStart } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qs, qsa, show } from './dom';

export function initScenes(): () => void {
  const secs = qsa('[data-scene]').filter((s) => !s.classList.contains('hero-home'));
  if (isReduced() || !secs.length) return () => {};
  const mobile = isMobile();
  const rise = mobile ? 12 : 24;
  const sts: ScrollTrigger[] = [];
  const tls: gsap.core.Animation[] = [];
  const splits: SplitText[] = [];
  let dead = false;

  secs.forEach((sec) => {
    const rule = qs('.s-rule', sec), eyebrow = qs('[data-s=eyebrow]', sec), title = qs('[data-s=title]', sec);
    const body = qs('[data-s=body]', sec), chips = qs('[data-s=chips]', sec), cta = qs('[data-s=cta]', sec), media = qsa('[data-s=media]', sec);
    const play = async () => {
      await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 600))]);
      if (dead) return;
      const tl = gsap.timeline({ onComplete: () => { splits.forEach((s) => s.revert()); } });
      tls.push(tl);
      const T = v3.scene;
      if (rule) tl.to(rule, { scaleX: 1, duration: v3.a1.rule, ease: ease.out }, T.rule);
      if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out }, T.eyebrow);
      if (title) {
        if (mobile) tl.fromTo(title, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.emphasis }, T.title);
        else {
          // A1: split into masked lines while the heading is still hidden, then reveal the wrapper and slide the lines.
          const sp = SplitText.create(title, { type: 'lines', mask: 'lines' });
          splits.push(sp);
          gsap.set(sp.lines, { yPercent: 100 });
          gsap.set(title, { opacity: 1, y: 0 });
          tl.to(sp.lines, { yPercent: 0, duration: v3.a1.line, stagger: v3.a1.stagger, ease: ease.emphasis }, T.title);
        }
      }
      if (body) tl.fromTo(body, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out }, T.body);
      if (chips) tl.fromTo(chips, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out }, T.body + 0.04);
      if (cta) tl.fromTo(cta, { opacity: 0, y: rise }, { opacity: 1, y: 0, duration: dur.base, ease: ease.out }, T.cta);
      media.forEach((m) => tl.fromTo(m, { opacity: 0, y: 0 }, { opacity: 1, y: 0, duration: 0.45, ease: ease.out, clearProps: 'willChange' }, T.media));
    };
    sts.push(ScrollTrigger.create({ trigger: sec, start: triggerStart, once: true, onEnter: () => { void play(); } }));
  });

  return () => {
    dead = true;
    sts.forEach((s) => s.kill());
    tls.forEach((t) => t.kill());
    splits.forEach((s) => s.revert());
    secs.forEach((sec) => { gsap.set(qsa('.s-rule', sec), { clearProps: 'all' }); show(qsa('[data-s]', sec)); });
  };
}
