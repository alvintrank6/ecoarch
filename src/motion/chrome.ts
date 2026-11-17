// Page-level chrome: A9 read progress, A13 nav intro (once per session), T3 sliding nav indicator, A15 footer wordmark,
// T5 anchor scroll, A6 magnetic primary buttons (mouse only).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ease, v3 } from './tokens';
import { isReduced, isMobile } from './prefs';
import { qs, qsa } from './dom';

gsap.registerPlugin(ScrollToPlugin);

export function initChrome(): () => void {
  const cleanups: Array<() => void> = [];
  const reduced = isReduced();

  // A9: 2 px bar at the top, scaleX follows scroll progress. Transform only.
  const bar = qs('[data-progress]');
  if (bar && !reduced) {
    const set = gsap.quickSetter(bar, 'scaleX');
    const upd = () => set(Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    cleanups.push(() => { window.removeEventListener('scroll', upd); gsap.set(bar, { scaleX: 0 }); });
  }

  // A13: nav links appear in a 40 ms stagger the first time in a session. Later pages show them at once.
  const html = document.documentElement;
  if (html.classList.contains('nav-intro')) {
    const targets = qsa('.desktop-nav li, .site-header .lang, .site-header .cta');
    try { sessionStorage.setItem('eco-nav-intro', '1'); } catch { /* ignore */ }
    html.classList.remove('nav-intro');
    if (!reduced && targets.length) {
      const tw = gsap.fromTo(targets, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: ease.out, clearProps: 'all' });
      cleanups.push(() => tw.kill());
    }
  }

  // T3: one underline that slides between nav items (450 ms). It rests under the current page or section.
  const indicator = qs('[data-nav-indicator]');
  const links = qsa<HTMLAnchorElement>('.desktop-nav .nav-link');
  if (indicator && links.length && window.matchMedia('(min-width: 1024px)').matches) {
    const host = indicator.parentElement!;
    const place = (el: HTMLElement | null, animate: boolean) => {
      if (!el) { gsap.to(indicator, { opacity: 0, duration: animate ? 0.2 : 0 }); return; }
      const hr = host.getBoundingClientRect(), r = el.getBoundingClientRect();
      gsap.to(indicator, { x: r.left - hr.left, width: r.width, opacity: 1, duration: animate && !reduced ? 0.45 : 0, ease: ease.inOut });
    };
    const current = () => links.find((l) => l.getAttribute('aria-current') === 'page') ?? links.find((l) => l.dataset.parent === 'true') ?? null;
    place(current(), false);
    const over = (e: Event) => place(e.currentTarget as HTMLElement, true);
    const out = () => place(current(), true);
    links.forEach((l) => { l.addEventListener('pointerenter', over); l.addEventListener('focus', over); l.addEventListener('pointerleave', out); l.addEventListener('blur', out); });
    const onResize = () => place(current(), false);
    window.addEventListener('resize', onResize);
    cleanups.push(() => { links.forEach((l) => { l.removeEventListener('pointerenter', over); l.removeEventListener('focus', over); l.removeEventListener('pointerleave', out); l.removeEventListener('blur', out); }); window.removeEventListener('resize', onResize); });
  }

  // A15: the ECO ARCH wordmark in the footer is revealed from the left, once per page.
  const mark = qs('[data-footmark]');
  if (mark && !reduced) {
    const st = ScrollTrigger.create({ trigger: mark, start: 'top 96%', once: true,
      onEnter: () => gsap.to(mark, { clipPath: 'inset(0 0% 0 0)', duration: v3.footmark, ease: ease.inOut }) });
    cleanups.push(() => { st.kill(); gsap.set(mark, { clearProps: 'clipPath' }); });
  }

  // T5: in-page anchors scroll in 700 ms (instant under reduced motion). Keyboard focus follows the target.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const target = a.hash.length > 1 ? document.getElementById(a.hash.slice(1)) : null;
    if (!target) return;
    e.preventDefault();
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    if (isReduced()) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - nav - 8);
    else gsap.to(window, { scrollTo: { y: target, offsetY: nav + 8, autoKill: true }, duration: 0.7, ease: ease.inOut });
    history.replaceState(null, '', a.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  document.addEventListener('click', onClick);
  cleanups.push(() => document.removeEventListener('click', onClick));

  // A6: primary buttons follow the mouse by at most 6 px and return in 220 ms. Not on touch, not on keyboard focus.
  if (!reduced && !isMobile() && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    qsa('[data-magnetic]').forEach((btn) => {
      const qx = gsap.quickTo(btn, 'x', { duration: 0.22, ease: 'power3.out' });
      const qy = gsap.quickTo(btn, 'y', { duration: 0.22, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        qx(Math.max(-1, Math.min(1, dx)) * v3.magnetic); qy(Math.max(-1, Math.min(1, dy)) * v3.magnetic);
      };
      const leave = () => { qx(0); qy(0); };
      btn.addEventListener('pointermove', move); btn.addEventListener('pointerleave', leave);
      cleanups.push(() => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); gsap.set(btn, { clearProps: 'x,y' }); });
    });
  }
  return () => cleanups.forEach((c) => c());
}
