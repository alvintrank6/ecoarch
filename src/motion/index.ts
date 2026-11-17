// Motion entry. GSAP only lives under src/motion. Every init returns kill().
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { bezier } from './tokens';
import { initNav } from './nav';
import { initReveal } from './reveal';
import { initScenes } from './scene';
import { initDraw } from './draw';
import { initFaq } from './faq';
import { initToggle } from './toggle';
import { initPageWipe } from './page-wipe';
import { initChrome } from './chrome';
import { initCursor } from './cursor';
import { initRails } from './rail';
import { initParallax } from './parallax';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('eco-out', bezier.out);
CustomEase.create('eco-inout', bezier.inOut);

let kills: Array<() => void> = [];

function killAll() {
  kills.forEach((k) => { try { k(); } catch { /* ignore */ } });
  kills = [];
}

const has = (sel: string) => !!document.querySelector(sel);

async function boot() {
  killAll();
  kills.push(initNav(), initChrome(), initScenes(), initReveal(), initDraw(), initFaq(), initToggle(), initPageWipe(), initRails(), initParallax(), initCursor());
  if (has('[data-hero]')) kills.push((await import('./hero')).initHero());
  if (has('[data-process]')) kills.push((await import('./process')).initProcess());
  if (has('[data-ladder]')) kills.push((await import('./ladder')).initLadder());
  if (has('[data-sunwind]')) kills.push((await import('./sunwind')).initSunWind());
  if (has('[data-louver],[data-frame-open]')) kills.push((await import('./louver')).initLouver());
  if (has('[data-compare]')) kills.push((await import('./compare')).initCompare());
  if (has('[data-lightbox]')) kills.push((await import('./lightbox')).initLightbox());
  document.documentElement.dataset.motionReady = '1';
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
window.addEventListener('pagehide', killAll);
// Toggling reduced motion re-runs boot: everything is killed and CSS shows all content.
document.addEventListener('eco:motion-change', () => { boot(); });
window.addEventListener('pageshow', (e) => { if (e.persisted) boot(); });
