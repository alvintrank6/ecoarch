import type { ImageMetadata } from 'astro';
const mods = import.meta.glob<{ default: ImageMetadata }>('./concept/*.{png,jpg}', { eager: true });

/** Concept image metadata by file stem, e.g. 'ex-04-after'. Throws if missing so the build fails. */
export function conceptImage(stem: string): ImageMetadata {
  const m = mods[`./concept/${stem}.png`] ?? mods[`./concept/${stem}.jpg`];
  if (!m) throw new Error(`concept image not found: ${stem}`);
  return m.default;
}
/** 'ex-04-after' -> 'ex04After' (key under `alt.*` in the locale files). */
export const altKey = (stem: string): string => {
  const [a, b, c] = stem.split('-');
  return a + b + c.charAt(0).toUpperCase() + c.slice(1);
};
