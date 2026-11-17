// Reduced-motion plumbing: OS preference OR user toggle (html[data-motion="reduced"]).
const KEY = 'eco-motion';

export const isReduced = (): boolean =>
  document.documentElement.dataset.motion === 'reduced' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isMobile = (): boolean =>
  window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

export function setReduced(on: boolean): void {
  document.documentElement.dataset.motion = on ? 'reduced' : 'full';
  try { localStorage.setItem(KEY, on ? 'reduced' : 'full'); } catch { /* storage may be blocked */ }
  document.dispatchEvent(new CustomEvent('eco:motion-change', { detail: { reduced: on } }));
}
