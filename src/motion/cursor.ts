// A7: the mouse pointer gets a context label ("Kéo", "Xem", "Mở") over [data-cursor] elements. Mouse only; the native cursor stays.
import { gsap } from 'gsap';
import { isReduced } from './prefs';
import { qsa } from './dom';

export function initCursor(): () => void {
  const targets = qsa('[data-cursor]');
  if (!targets.length || isReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const label = document.createElement('span');
  label.className = 'cursor-label'; label.setAttribute('aria-hidden', 'true');
  document.body.appendChild(label);
  const qx = gsap.quickTo(label, 'x', { duration: 0.25, ease: 'power3.out' });
  const qy = gsap.quickTo(label, 'y', { duration: 0.25, ease: 'power3.out' });
  const cleanups: Array<() => void> = [];
  targets.forEach((el) => {
    const move = (e: PointerEvent) => { if (e.pointerType === 'mouse') { qx(e.clientX + 16); qy(e.clientY + 16); } };
    const enter = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; label.textContent = (el as HTMLElement).dataset.cursor ?? ''; gsap.to(label, { opacity: 1, duration: 0.15 }); };
    const leave = () => gsap.to(label, { opacity: 0, duration: 0.15 });
    el.addEventListener('pointermove', move as EventListener); el.addEventListener('pointerenter', enter as EventListener); el.addEventListener('pointerleave', leave);
    cleanups.push(() => { el.removeEventListener('pointermove', move as EventListener); el.removeEventListener('pointerenter', enter as EventListener); el.removeEventListener('pointerleave', leave); });
  });
  return () => { cleanups.forEach((c) => c()); label.remove(); };
}
