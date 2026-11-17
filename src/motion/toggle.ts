// Footer "Reduce motion" switch. Persists to localStorage (try/catch in prefs.ts); reflects OS preference on load.
import { isReduced, setReduced } from './prefs';
import { qsa } from './dom';

export function initToggle(): () => void {
  const cleanups: Array<() => void> = [];
  qsa<HTMLButtonElement>('[data-motion-toggle]').forEach((btn) => {
    const paint = () => {
      const on = isReduced();
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? btn.dataset.labelOn ?? '' : btn.dataset.labelOff ?? '';
    };
    paint();
    const click = () => setReduced(!isReduced());
    btn.addEventListener('click', click);
    document.addEventListener('eco:motion-change', paint);
    cleanups.push(() => { btn.removeEventListener('click', click); document.removeEventListener('eco:motion-change', paint); });
  });
  return () => cleanups.forEach((c) => c());
}
