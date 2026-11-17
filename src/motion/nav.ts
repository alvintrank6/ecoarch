// N1 scrolled state, N3 mobile panel (focus trap, Esc, scroll lock, restore focus).
import { gsap } from 'gsap';
import { isReduced } from './prefs';
import { qs, qsa } from './dom';

export function initNav(): () => void {
  const header = qs('[data-nav]');
  const btn = qs<HTMLButtonElement>('[data-menu-btn]');
  const panel = qs('[data-menu-panel]');
  if (!header) return () => {};
  const cleanups: Array<() => void> = [];

  // N1: state flips at scrollY > 40; the fade itself is CSS (opacity only, 260ms).
  const onScroll = () => { header.toggleAttribute('data-scrolled', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));

  if (btn && panel) {
    const closeBtn = qs<HTMLButtonElement>('[data-menu-close]', panel)!;
    const items = qsa('[data-menu-item]', panel);
    const outside = qsa('main, footer, [data-nav]');
    let isOpen = false;
    let tl: gsap.core.Timeline | null = null;

    const focusables = () => qsa<HTMLElement>('a[href], button:not([disabled])', panel).filter((e) => e.offsetParent !== null);

    function open() {
      if (isOpen) return;
      isOpen = true;
      panel!.setAttribute('data-open', '');
      btn!.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-open');
      outside.forEach((e) => e.setAttribute('inert', ''));
      tl?.kill();
      if (isReduced()) {
        tl = gsap.timeline().fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.18 });
      } else {
        tl = gsap.timeline()
          .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.36, ease: 'power3.out' })
          .fromTo(items, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.06 }, 0.12);
      }
      closeBtn.focus();
    }

    function close(restore = true) {
      if (!isOpen) return;
      isOpen = false;
      btn!.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
      outside.forEach((e) => e.removeAttribute('inert'));
      tl?.kill();
      const done = () => { panel!.removeAttribute('data-open'); gsap.set([panel, ...items], { clearProps: 'all' }); };
      if (isReduced()) tl = gsap.timeline({ onComplete: done }).to(panel, { opacity: 0, duration: 0.18 });
      else tl = gsap.timeline({ onComplete: done }).to(panel, { xPercent: 100, duration: 0.26, ease: 'power3.in' });
      if (restore) btn!.focus();
    }

    const onBtn = () => (isOpen ? close() : open());
    const onClose = () => close();
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const onPanelClick = (e: Event) => { if ((e.target as HTMLElement).closest('a')) close(false); };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => { if (mq.matches) close(false); };

    btn.addEventListener('click', onBtn);
    closeBtn.addEventListener('click', onClose);
    panel.addEventListener('click', onPanelClick);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    cleanups.push(() => {
      btn.removeEventListener('click', onBtn);
      closeBtn.removeEventListener('click', onClose);
      panel.removeEventListener('click', onPanelClick);
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      tl?.kill();
      isOpen = false;
      document.documentElement.classList.remove('menu-open');
      outside.forEach((e) => e.removeAttribute('inert'));
      panel.removeAttribute('data-open');
      gsap.set([panel, ...items], { clearProps: 'all' });
    });
  }
  return () => cleanups.forEach((c) => c());
}
