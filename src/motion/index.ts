// Motion entry. GSAP only lives under src/motion. Every init returns kill().
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { bezier } from './tokens';
import { initNav } from './nav';
import { initReveal } from './reveal';
import { initDraw } from './draw';
import { initFaq } from './faq';
import { initToggle } from './toggle';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('eco-out', bezier.out);
CustomEase.create('eco-inout', bezier.inOut);

let kills: Array<() => void> = [];

function killAll() {
  kills.forEach((k) => { try { k(); } catch { /* ignore */ } });
  kills = [];
}

async function boot() {
  killAll();
  kills.push(initNav());
  if (document.querySelector('[data-hero]')) {
    const { initHero } = await import('./hero');
    kills.push(initHero());
  }
  kills.push(initReveal(), initDraw(), initFaq(), initToggle());
  if (document.querySelector('[data-louver]')) kills.push((await import('./louver')).initLouver());
  if (document.querySelector('[data-compare]')) kills.push((await import('./compare')).initCompare());
  document.documentElement.dataset.motionReady = '1';
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
window.addEventListener('pagehide', killAll);
// Toggling reduced motion re-runs boot: everything is killed and CSS shows all content.
document.addEventListener('eco:motion-change', () => { boot(); });
window.addEventListener('pageshow', (e) => { if (e.persisted) boot(); });
