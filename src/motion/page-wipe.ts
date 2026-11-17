// P2: indigo-free plate wipe INTO the booking page (a[data-wipe]) and T1: louver curtain between top-level nav items (a[data-curtain]).
// Both are desktop-only, skipped under reduced motion, never run on back/forward, and fall back to a plain navigation on any failure.
// Arrival state is handed over through sessionStorage ('plate' | 'curtain') and a first-paint placeholder class on <html>.
import { gsap } from 'gsap';
import { isReduced, isMobile } from './prefs';
import { qsa } from './dom';
import { v3 } from './tokens';

const FLAG = 'eco-wipe';
const el = (css: Record<string, string>) => { const d = document.createElement('div'); d.setAttribute('data-wipe-plate', ''); d.setAttribute('aria-hidden', 'true'); Object.assign(d.style, { position: 'fixed', zIndex: '100', pointerEvents: 'none', ...css }); return d; };
const clearFlag = () => { try { sessionStorage.removeItem(FLAG); } catch { /* ignore */ } document.documentElement.classList.remove('wipe-in', 'curtain-in'); };
const curtain = () => { const wrap = el({ inset: '0', display: 'flex' }); const bars = Array.from({ length: v3.curtain.slats }, () => { const i = document.createElement('i'); Object.assign(i.style, { display: 'block', flex: '1 0 0', marginRight: '-1px', background: 'var(--color-sand)' }); wrap.appendChild(i); return i; }); return { wrap, bars }; };

export function initPageWipe(): () => void {
  const cleanups: Array<() => void> = [];
  let overlay: HTMLElement | null = null;
  const tweens: gsap.core.Animation[] = [];
  const off = isReduced() || isMobile();

  // Arrival.
  const html = document.documentElement;
  if (html.classList.contains('wipe-in') || html.classList.contains('curtain-in')) {
    const isCurtain = html.classList.contains('curtain-in');
    if (off) clearFlag();
    else if (isCurtain) {
      const { wrap, bars } = curtain(); overlay = wrap; document.body.appendChild(wrap); clearFlag();
      tweens.push(gsap.fromTo(bars, { scaleX: 1, transformOrigin: 'right center' }, { scaleX: 0, duration: v3.curtain.in, stagger: 0.04, ease: 'eco-inout', onComplete: () => { overlay?.remove(); overlay = null; } }));
    } else {
      overlay = el({ inset: '0', background: 'var(--color-ink)' }); document.body.appendChild(overlay); clearFlag();
      tweens.push(gsap.fromTo(overlay, { scaleY: 1, transformOrigin: 'top center' }, { scaleY: 0, duration: 0.55, ease: 'eco-inout', onComplete: () => { overlay?.remove(); overlay = null; } }));
    }
  }

  const bind = (sel: string, run: (href: string) => void) => qsa<HTMLAnchorElement>(sel).forEach((a) => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || isReduced() || isMobile() || overlay) return;
      if (a.pathname === location.pathname) return;
      try { e.preventDefault(); run(a.href); } catch { window.location.assign(a.href); }
    };
    a.addEventListener('click', onClick);
    cleanups.push(() => a.removeEventListener('click', onClick));
  });
  const go = (href: string, flag: string) => { try { sessionStorage.setItem(FLAG, flag); } catch { /* ignore */ } const t = window.setTimeout(() => window.location.assign(href), 900); return () => { clearTimeout(t); window.location.assign(href); }; };

  // P2: plate wipe into the booking page.
  bind('a[data-wipe]', (href) => {
    overlay = el({ inset: '0', background: 'var(--color-ink)' }); document.body.appendChild(overlay);
    const done = go(href, 'plate');
    tweens.push(gsap.fromTo(overlay, { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.45, ease: 'eco-inout', onComplete: done }));
  });
  // T1: louver curtain between top-level sections (out 160 ms, in 360 ms).
  bind('a[data-curtain]', (href) => {
    const { wrap, bars } = curtain(); overlay = wrap; document.body.appendChild(wrap);
    const done = go(href, 'curtain');
    tweens.push(gsap.fromTo(bars, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: v3.curtain.out, stagger: 0.02, ease: 'eco-inout', onComplete: done }));
  });

  // Back/forward from the bfcache: never leave an overlay behind.
  const onShow = (e: PageTransitionEvent) => { if (e.persisted) { tweens.forEach((t) => t.kill()); overlay?.remove(); overlay = null; clearFlag(); } };
  window.addEventListener('pageshow', onShow);
  cleanups.push(() => { window.removeEventListener('pageshow', onShow); tweens.forEach((t) => t.kill()); overlay?.remove(); overlay = null; });
  return () => cleanups.forEach((c) => c());
}
