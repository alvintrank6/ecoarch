// Resolves the image IDs named in docs/11-PAGES (docs/03 manifest) to what exists in the repo.
// Missing originals (HERO-01, SVC-xx, NEW-xx, BR-xx, OF-xx, ABOUT-01, ART*, TEX-*, BOOK-01) resolve to a stand-in or null (logged in OPEN-ITEMS).
export type Media =
  | { kind: 'photo'; stem: string; pair?: string }   // concept image; `pair` = stem prefix of a before/after pair
  | { kind: 'art'; art: 'plan' | 'cutaway' | 'interior' }
  | { kind: 'diagram'; name: 'sun-wind' | 'handover' | 'plan-line' };

const ID = /\b(?:EX|NEW|BR|OF|SVC|HERO|DIAG|TEX|ART\d|ABOUT|BOOK)-\d+m?\b/g;
export const idsIn = (note: string): string[] => [...new Set(note.match(ID) ?? [])];

export function resolve(id: string): Media | null {
  const ex = id.match(/^EX-0([1-6,8])$/);
  if (ex) return { kind: 'photo', stem: `ex-0${ex[1]}-after`, pair: `ex-0${ex[1]}` };
  if (id === 'EX-09') return { kind: 'photo', stem: 'ex-09-before' };
  if (id === 'HERO-01' || id === 'HERO-01m') return { kind: 'photo', stem: 'ex-04-after' }; // interim hero
  if (id === 'SVC-01') return { kind: 'art', art: 'plan' };
  if (id === 'SVC-02') return { kind: 'art', art: 'cutaway' };
  if (id === 'SVC-03') return { kind: 'art', art: 'interior' };
  if (id === 'DIAG-01') return { kind: 'diagram', name: 'sun-wind' };
  if (id === 'DIAG-02') return { kind: 'diagram', name: 'handover' };
  if (id === 'DIAG-03') return { kind: 'diagram', name: 'plan-line' };
  return null; // EX-07 (Vietnamese labels baked in), NEW-*, BR-*, OF-*, ABOUT-01, ART*, TEX-*, BOOK-01
}
export const mediaOf = (note: string): Media[] => idsIn(note).map(resolve).filter((m): m is Media => !!m);
