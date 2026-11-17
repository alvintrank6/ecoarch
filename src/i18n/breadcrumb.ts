import type { PageId } from './routes';
/** Ancestors of a page for BreadcrumbList (home is added by the caller). */
export const parents: Partial<Record<PageId, PageId[]>> = {
  prelim: ['services'], ideas: ['services'], complete: ['services'],
  tubeHouse: ['concepts'], townhouse: ['concepts'], villa: ['concepts'], apartment: ['concepts'],
  readSunWind: ['insights'], prepareCall: ['insights'],
};
