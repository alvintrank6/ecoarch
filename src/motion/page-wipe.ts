// P2: indigo plate wipe for navigation INTO the booking page only (a[data-wipe]).
// Out: plate scaleY 0 -> 1 from the bottom (450ms). In: new page opens scaleY 1 -> 0 from the top (550ms).
// Skipped on mobile, coarse pointers and reduced motion; any failure navigates straight. State lives in sessionStorage.
import { gsap } from 'gsap';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';

const FLAG = 'eco-wipe';
const makePlate = () => {
  const el = document.createElement('div');
  el.setAttribute('data-wipe-plate', ''); el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, { position: 'fixed', inset: '0', zIndex: '100', background: 'var(--color-brand)', pointerEvents: 'none' });
  return el;
};
const clearFlag = () => { try { sessionStorage.removeItem(FLAG); } catch { /* ignore */ } document.documentElement.classList.remove('wipe-in'); };

export function initPageWipe(): () => void {
  const cleanups: Array<() => void> = [];
  let plate: HTMLElement | null = null;
  const tweens: gsap.core.Animation[] = [];

  // Arrival: open the plate (or just clear the placeholder when motion is off).
  const arrived = document.documentElement.classList.contains('wipe-in');
  if (arrived) {
    if (isReduced() || isMobile()) { clearFlag(); }
    else {
      plate = makePlate(); document.body.appendChild(plate);
      clearFlag(); // removes the CSS placeholder now that the real plate covers the page
      tweens.push(gsap.fromTo(plate, { scaleY: 1, transformOrigin: 'top center' }, { scaleY: 0, duration: 0.55, ease: 'eco-inout',
        onComplete: () => { plate?.remove(); plate = null; } }));
    }
  }

  // Departure: intercept plain left-clicks on a[data-wipe].
  qsa<HTMLAnchorElement>('a[data-wipe]').forEach((a) => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (isReduced() || isMobile() || plate) return;
      try {
        e.preventDefault();
        const href = a.href;
        plate = makePlate(); document.body.appendChild(plate);
        try { sessionStorage.setItem(FLAG, '1'); } catch { /* ignore */ }
        const go = () => window.location.assign(href);
        const t = window.setTimeout(go, 900); // never block navigation
        tweens.push(gsap.fromTo(plate, { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.45, ease: 'eco-inout', onComplete: () => { clearTimeout(t); go(); } }));
      } catch { window.location.assign(a.href); }
    };
    a.addEventListener('click', onClick);
    cleanups.push(() => a.removeEventListener('click', onClick));
  });

  // Back/forward from the bfcache: never leave an overlay behind.
  const onShow = (e: PageTransitionEvent) => { if (e.persisted) { tweens.forEach((t) => t.kill()); plate?.remove(); plate = null; clearFlag(); } };
  window.addEventListener('pageshow', onShow);
  cleanups.push(() => { window.removeEventListener('pageshow', onShow); tweens.forEach((t) => t.kill()); plate?.remove(); plate = null; });
  return () => cleanups.forEach((c) => c());
}
