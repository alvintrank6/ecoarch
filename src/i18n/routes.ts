// Page id -> slug per locale. Slugs other than the 3 package slugs are [GIẢ ĐỊNH] (docs/04).
export const locales = ['vi', 'en'] as const;
export type Lang = (typeof locales)[number];

export const routes = {
  home: { vi: '', en: '' },
  services: { vi: 'dich-vu', en: 'services' },
  prelim: { vi: 'dich-vu/thiet-ke-so-bo-2d', en: 'services/preliminary-design-2d' },
  architectural: { vi: 'dich-vu/thiet-ke-kien-truc', en: 'services/architectural-design' },
  integrated: { vi: 'dich-vu/thiet-ke-kien-truc-noi-that', en: 'services/integrated-design' },
  concepts: { vi: 'phuong-an', en: 'concepts' },
  tubeHouse: { vi: 'phuong-an/nha-ong', en: 'concepts/tube-house' },
  townhouse: { vi: 'phuong-an/nha-pho', en: 'concepts/townhouse' },
  villa: { vi: 'phuong-an/biet-thu', en: 'concepts/villa' },
  apartment: { vi: 'phuong-an/can-ho', en: 'concepts/apartment' },
  about: { vi: 'gioi-thieu', en: 'about' },
  process: { vi: 'quy-trinh', en: 'process' },
  scope: { vi: 'pham-vi-ban-giao', en: 'scope' },
  insights: { vi: 'kien-thuc', en: 'insights' },
  readSunWind: { vi: 'kien-thuc/doc-huong-nang-gio', en: 'insights/read-sun-and-wind' },
  prepareCall: { vi: 'kien-thuc/chuan-bi-buoi-trao-doi', en: 'insights/prepare-first-call' },
  faq: { vi: 'hoi-dap', en: 'faq' },
  book: { vi: 'dat-lich', en: 'book' },
  contact: { vi: 'lien-he', en: 'contact' },
  privacy: { vi: 'chinh-sach-bao-mat', en: 'privacy' },
  thanks: { vi: 'cam-on', en: 'thank-you' },
} as const;

export type PageId = keyof typeof routes;
export const pageIds = Object.keys(routes) as PageId[];
/** Pages that must not be indexed (docs/04 P21, 404). */
export const noindexPages: PageId[] = ['thanks'];

export function path(lang: Lang, id: PageId): string {
  const slug = routes[id][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

/** Find the page id for a locale slug ('' for home). */
export function idFromSlug(lang: Lang, slug: string): PageId | undefined {
  return pageIds.find((id) => routes[id][lang] === slug);
}

/** Path of the same page in the other locale, used by the language switch. */
export function altPath(lang: Lang, id: PageId): string {
  return path(lang === 'vi' ? 'en' : 'vi', id);
}

/** Page id -> id used in docs/11-PAGES and src/content/pages.json. */
export const pidOf: Record<Exclude<PageId, 'thanks'>, string> = {
  home: 'P01', services: 'P02', prelim: 'P03', architectural: 'P04', integrated: 'P05', concepts: 'P06', tubeHouse: 'P07', townhouse: 'P08',
  villa: 'P09', apartment: 'P10', about: 'P11', process: 'P12', scope: 'P13', insights: 'P14', readSunWind: 'P15', prepareCall: 'P16',
  faq: 'P17', book: 'P18', contact: 'P19', privacy: 'P20',
};
