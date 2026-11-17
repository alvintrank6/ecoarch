// Page id -> view component. Later slices register real views here; others fall back to Generic.
import type { PageId } from '../i18n/routes';
export const views: Partial<Record<PageId, unknown>> = {};
