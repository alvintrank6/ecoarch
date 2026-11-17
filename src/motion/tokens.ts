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
