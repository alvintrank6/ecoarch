#!/usr/bin/env python3
"""Split the exported design doc into docs/NN-*.md. Zero LLM tokens.
Usage: python3 scripts/split-design-doc.py docs/DESIGN.md docs"""
import re, sys, pathlib
src, out = sys.argv[1], pathlib.Path(sys.argv[2])
names = {"00":"CONTROL","01":"BRIEF","02":"CONTENT-SOURCE","03":"ASSETS","04":"CONTENT",
         "05":"SITEMAP-UX","06":"DESIGN-SYSTEM","07":"MOTION-SPEC","08":"TECH-SPEC",
         "09":"ACCEPTANCE","10":"CLAUDE-HANDOVER"}
text = pathlib.Path(src).read_text(encoding="utf-8").replace("\\[", "[").replace("\\]", "]")
parts = re.split(r"(?m)^## (?=\d\d )", text)
out.mkdir(parents=True, exist_ok=True)
for p in parts[1:]:
    num = p[:2]
    name = names.get(num, "X")
    f = out / f"{num}-{name}.md"
    f.write_text("## " + p.rstrip() + "\n", encoding="utf-8")
    print(f"{f}  {len(p):>7} chars")
