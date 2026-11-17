#!/usr/bin/env python3
"""Turn docs/11-PAGES/Pxx.md tables into src/content/pages.json. Zero LLM tokens.
Usage: python3 scripts/extract-copy.py docs/11-PAGES src/content/pages.json
Cell grammar: *eyebrow* **title** body [Mục:|Items: a; b; c] [Nút:|Button: label]. Items split on ';'."""
import re, sys, json, pathlib
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])

def cell(t, lang):
    t = t.strip()
    m = re.match(r"\*(.+?)\*\s+\*\*(.+?)\*\*\s*(.*)$", t, re.S)
    if not m: raise SystemExit(f"bad cell: {t[:80]}")
    eyebrow, title, rest = m.groups()
    ik, bk = ("Mục:", "Nút:") if lang == "vi" else ("Items:", "Button:")
    button = None; items = []
    if bk in rest: rest, button = rest.rsplit(bk, 1); button = button.strip()
    if ik in rest: rest, it = rest.split(ik, 1); items = [x.strip() for x in it.strip().split(";") if x.strip()]
    return dict(eyebrow=eyebrow.strip(), title=title.strip(), body=rest.strip(), items=items, button=button)

pages = {}
for f in sorted(src.glob("P*.md")):
    txt = f.read_text(encoding="utf-8")
    pid = f.stem
    paths = re.search(r"VI: `(.+?)` · EN: `(.+?)` · Hạng hiệu ứng: (\w)", txt)
    rows = [l for l in txt.splitlines() if re.match(r"\| \d \|", l)]
    secs = []
    for l in rows:
        c = [x.strip() for x in re.split(r"(?<!\\)\|", l)[1:-1]]
        n, typ, vi, en, fx = c
        secs.append(dict(n=int(n), type=typ, vi=cell(vi, "vi"), en=cell(en, "en"),
                         imagesNote=re.sub(r"\s*Hiệu ứng:.*$", "", fx).replace("Ảnh:", "").strip(),
                         effects=re.findall(r"\b[A-Z]\d{1,2}\b", fx.split("Hiệu ứng:")[-1])))
    want = 5 if pid == "P01" else 4
    if len(secs) != want: raise SystemExit(f"{pid}: {len(secs)} sections, expected {want}")
    pages[pid] = dict(vi=paths.group(1), en=paths.group(2), tier=paths.group(3), sections=secs)
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(json.dumps(pages, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{len(pages)} pages, {sum(len(p['sections']) for p in pages.values())} sections -> {dst}")
