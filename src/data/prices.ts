// Published prices per m2 of design area (docs/01). Only these three values may appear on the site.
export const prices = { prelim: '100.000', ideas: '220.000', complete: '340.000' } as const;
export const priceLabel = (id: keyof typeof prices) => `${prices[id]} đ/m²`;
