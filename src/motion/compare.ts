// C1 slider logic, C2 one-time hint (desktop), C3 "Kéo/Drag" cursor label (fine pointer).
// The native range input owns pointer and keyboard; JS only mirrors its value into --pos.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';

export function initCompare(): () => void {
  const cleanups: Array<() => void> = [];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

    // C3: cursor label following the mouse (lerped by quickTo), fine pointer only. Native cursor stays.
    if (finePointer && !isReduced()) {
      const label = document.createElement('span');
      label.textContent = root.dataset.dragLabel ?? '';
      label.setAttribute('aria-hidden', 'true');
      Object.assign(label.style, { position: 'absolute', left: '0', top: '0', zIndex: '7', pointerEvents: 'none', opacity: '0', padding: '4px 10px',
        borderRadius: '999px', background: 'var(--color-bg)', color: 'var(--color-brand)', fontSize: '0.75rem', fontWeight: '600' });
      stage.appendChild(label);
      const qx = gsap.quickTo(label, 'x', { duration: 0.25, ease: 'power3.out' });
      const qy = gsap.quickTo(label, 'y', { duration: 0.25, ease: 'power3.out' });
      const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; const r = stage.getBoundingClientRect(); qx(e.clientX - r.left + 16); qy(e.clientY - r.top + 16); };
      const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') gsap.to(label, { opacity: 1, duration: 0.15 }); };
      const leave = () => gsap.to(label, { opacity: 0, duration: 0.15 });
      stage.addEventListener('pointermove', move); stage.addEventListener('pointerenter', enter); stage.addEventListener('pointerleave', leave);
      cleanups.push(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerenter', enter); stage.removeEventListener('pointerleave', leave); label.remove(); });
    }
    cleanups.push(cancelHint);
  });

  return () => cleanups.forEach((c) => c());
}
