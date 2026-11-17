// F1 accordion: toggles aria-expanded; the 220ms open/close is CSS (grid-template-rows), instant under reduced motion.
import { qsa } from './dom';

export function initFaq(): () => void {
  const cleanups: Array<() => void> = [];
  qsa('[data-faq-btn]').forEach((btn) => {
    const on = () => btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    btn.addEventListener('click', on);
    cleanups.push(() => btn.removeEventListener('click', on));
  });
  return () => cleanups.forEach((c) => c());
}
