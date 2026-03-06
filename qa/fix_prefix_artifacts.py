from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

changed = 0
for html_file in ROOT.rglob("*.html"):
    original = html_file.read_text(encoding="utf-8", errors="ignore")
    updated = original

    updated = updated.replace("/automotive/automotive/", "/automotive/")
    updated = updated.replace("../automotive/automotive/", "../automotive/")

    updated = re.sub(r'(?<!\.html)/thank-you(?!\.html)', '/thank-you.html', updated)

    if updated != original:
        html_file.write_text(updated, encoding="utf-8", newline="")
        changed += 1

print(f"Changed files: {changed}")
