// Page id -> slug per locale. Slugs other than the 3 package slugs are [GIẢ ĐỊNH] (docs/04).
export const locales = ['vi', 'en'] as const;
export type Lang = (typeof locales)[number];

export const routes = {
  home: { vi: '', en: '' },
  services: { vi: 'dich-vu', en: 'services' },
  prelim: { vi: 'dich-vu/thiet-ke-so-bo-2d', en: 'services/preliminary-design-2d' },
  ideas: { vi: 'dich-vu/thiet-ke-y-tuong-3d', en: 'services/concept-design-3d' },
  complete: { vi: 'dich-vu/thiet-ke-hoan-chinh', en: 'services/complete-design' },
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
