import vi from '../content/vi.json';
import en from '../content/en.json';
import type { Lang } from './routes';

const dict = { vi, en } as const;

/** Dotted-key lookup. A missing key throws, so the build fails on i18n gaps. */
export function t(lang: Lang, key: string): string {
  let cur: unknown = dict[lang];
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as object)) cur = (cur as Record<string, unknown>)[part];
    else throw new Error(`i18n: missing key "${key}" for locale "${lang}"`);
  }
  if (typeof cur !== 'string') throw new Error(`i18n: key "${key}" is not a string (${lang})`);
  return cur;
}

export const has = (lang: Lang, key: string): boolean => {
  try { t(lang, key); return true; } catch { return false; }
};
