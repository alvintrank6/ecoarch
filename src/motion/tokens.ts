// Motion tokens (docs/07). Single source for JS; CSS mirrors them as custom properties in global.css.
export const dur = {
  instant: 0.12,
  fast: 0.22,
  base: 0.45,
  slow: 0.8,
  draw: 1.0,
  cine: 1.2,
  pageOut: 0.16,
  pageIn: 0.32,
} as const;

// GSAP ease names; 'eco-out' and 'eco-inout' are registered with CustomEase in index.ts from `bezier`.
export const ease = { out: 'eco-out', inOut: 'eco-inout', emphasis: 'power3.out' } as const;
export const bezier = { out: '.22,1,.36,1', inOut: '.65,0,.35,1' } as const;

export const dist = { rise: 24, riseMobile: 12, lift: -4, liftScale: 1.01 } as const;
export const stagger = { step: 0.08, maxItems: 5, maxTotal: 0.7 } as const;
export const parallaxMax = 4; // percent, hero only
export const slats = { desktop: 5, mobile: 3 } as const;
export const triggerStart = 'top 85%';

// docs/12 (v3) values
export const v3 = {
  a1: { line: 0.8, stagger: 0.08, rule: 0.45 },
  scene: { rule: 0, eyebrow: 0.08, title: 0.16, body: 0.28, cta: 0.32, media: 0.36 }, // T4 order, seconds
  parallaxFrame: 0.06, magnetic: 6, footmark: 1.0, tick: 0.45, numeral: 0.1, curtain: { out: 0.16, in: 0.36, slats: 5 },
} as const;
