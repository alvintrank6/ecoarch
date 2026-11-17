// A8: horizontal scroll-snap galleries with a thin progress bar. Native scrolling; vertical page scroll is never captured.
import { gsap } from 'gsap';
import { qs, qsa } from './dom';

export function initRails(): () => void {
  const cleanups: Array<() => void> = [];
  qsa('[data-rail]').forEach((root) => {
    const track = qs('[data-rail-track]', root); const bar = qs('[data-rail-bar]', root);
    if (!track || !bar) return;
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      const visible = track.clientWidth / Math.max(track.scrollWidth, 1);
      const p = max > 1 ? track.scrollLeft / max : 0;
      gsap.set(bar, { scaleX: visible + (1 - visible) * p });
    };
    upd();
    track.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    cleanups.push(() => { track.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); });
  });
  return () => cleanups.forEach((c) => c());
}
