import { gsap } from 'gsap';

/** Final "shown" state for a [data-reveal] element. Inline opacity/transform beat the CSS hidden state. */
export function show(el: Element | Element[] | NodeListOf<Element>) {
  gsap.set(el, { opacity: 1, y: 0, clearProps: 'willChange' });
}
export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

/** One shared IntersectionObserver helper (cheaper than a ScrollTrigger per element). Callback gets the batch that entered together. */
export function onEnter(els: Element[], cb: (batch: Element[]) => void, margin = '0px 0px -12% 0px'): () => void {
  if (!els.length) return () => {};
  const io = new IntersectionObserver((entries) => {
    const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target);
    hit.forEach((t) => io.unobserve(t));
    if (hit.length) cb(hit);
  }, { rootMargin: margin, threshold: 0.01 });
  els.forEach((e) => io.observe(e));
  return () => io.disconnect();
}
