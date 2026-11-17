// C1 slider logic and C2 one-time hint (desktop). The "Kéo/Drag" cursor label (C3, A7) lives in cursor.ts via data-cursor.
// The native range input owns pointer and keyboard; JS only mirrors its value into --pos.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';

export function initCompare(): () => void {
  const cleanups: Array<() => void> = [];

  qsa('[data-compare]').forEach((root) => {
    const stage = root.querySelector<HTMLElement>('.stage')!;
    const range = root.querySelector<HTMLInputElement>('input[type=range]')!;
    const tpl = root.dataset.valueText ?? '{n}%';
    const apply = () => {
      const v = Number(range.value);
      stage.style.setProperty('--pos', v + '%');
      range.setAttribute('aria-valuetext', tpl.replace('{n}', String(Math.round(100 - v))));
    };
    apply();
    range.addEventListener('input', apply);
    cleanups.push(() => range.removeEventListener('input', apply));

    // Buttons: always available, tween 350ms (instant under reduced motion).
    root.querySelectorAll<HTMLButtonElement>('[data-compare-set]').forEach((b) => {
      const go = () => {
        cancelHint();
        const target = Number(b.dataset.compareSet);
        if (isReduced()) { range.value = String(target); apply(); return; }
        const o = { v: Number(range.value) };
        gsap.to(o, { v: target, duration: 0.35, ease: ease.out, onUpdate: () => { range.value = String(Math.round(o.v)); apply(); } });
      };
      b.addEventListener('click', go);
      cleanups.push(() => b.removeEventListener('click', go));
    });

    // C2: handle drifts 50 -> 38 -> 50 once when first in view. Off on mobile and reduced. Cancelled by any input.
    let hint: gsap.core.Tween | null = null;
    const cancelHint = () => { if (hint) { hint.kill(); hint = null; } };
    ['pointerdown', 'keydown', 'focusin', 'touchstart'].forEach((ev) => { root.addEventListener(ev, cancelHint, { passive: true }); cleanups.push(() => root.removeEventListener(ev, cancelHint)); });
    if (!isReduced() && !isMobile()) {
      const start = Number(range.value), o = { v: start };
      const st = ScrollTrigger.create({ trigger: stage, start: 'top 60%', once: true, onEnter: () => {
        hint = gsap.to(o, { keyframes: [{ v: 38 }, { v: start }], duration: dur.draw, ease: ease.inOut, onUpdate: () => { range.value = String(Math.round(o.v)); apply(); }, onComplete: () => { hint = null; } });
      } });
      cleanups.push(() => st.kill());
    }

    cleanups.push(cancelHint);
  });

  return () => cleanups.forEach((c) => c());
}
