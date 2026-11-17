import { gsap } from 'gsap';

/** Final "shown" state for a [data-reveal] element. Inline opacity/transform beat the CSS hidden state. */
export function show(el: Element | Element[] | NodeListOf<Element>) {
  gsap.set(el, { opacity: 1, y: 0, clearProps: 'willChange' });
}
export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
