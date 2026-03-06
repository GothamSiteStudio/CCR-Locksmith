from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATTERN = re.compile(
    r'<script\s+type="application/ld\+json">\s*(.*?)\s*</script>',
    re.IGNORECASE | re.DOTALL,
)

errors = []
blocks_checked = 0

for html_file in ROOT.rglob("*.html"):
    text = html_file.read_text(encoding="utf-8", errors="ignore")
    matches = SCRIPT_PATTERN.findall(text)
    for index, block in enumerate(matches, start=1):
        blocks_checked += 1
        try:
            json.loads(block)
        except Exception as exc:
            rel = html_file.relative_to(ROOT).as_posix()
            errors.append((rel, index, str(exc)))

print(f"JSONLD_BLOCKS_CHECKED={blocks_checked}")
print(f"JSONLD_PARSE_ERRORS={len(errors)}")
for rel, idx, err in errors[:50]:
    print(f"{rel}\tblock={idx}\terror={err}")
