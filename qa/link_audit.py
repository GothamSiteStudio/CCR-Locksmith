from __future__ import annotations

import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "qa" / "link_audit_report.txt"
SUMMARY_PATH = ROOT / "qa" / "link_audit_summary.txt"

ATTR_PATTERN = re.compile(r"(?:href|src|action)=[\"']([^\"']+)[\"']", re.IGNORECASE)


def normalize_reference(reference: str) -> str:
    reference = reference.split("#", 1)[0].split("?", 1)[0].strip()
    return reference


def is_ignored(reference: str) -> bool:
    if not reference:
        return True
    lowered = reference.lower()
    return (
        lowered.startswith("http://")
        or lowered.startswith("https://")
        or lowered.startswith("mailto:")
        or lowered.startswith("tel:")
        or lowered.startswith("javascript:")
        or lowered.startswith("data:")
        or lowered == "/"
    )


def resolve_target(source_file: Path, reference: str) -> Path:
    if reference.startswith("/"):
        return (ROOT / reference.lstrip("/")).resolve()
    return (source_file.parent / reference).resolve()


missing_pairs: Counter[tuple[str, str]] = Counter()
missing_hrefs: Counter[str] = Counter()

for html_file in ROOT.rglob("*.html"):
    text = html_file.read_text(encoding="utf-8", errors="ignore")
    rel_source = html_file.relative_to(ROOT).as_posix()

    for match in ATTR_PATTERN.finditer(text):
        raw_ref = match.group(1)
        ref = normalize_reference(raw_ref)
        if is_ignored(ref):
            continue

        target = resolve_target(html_file, ref)
        if not target.exists():
            missing_pairs[(rel_source, ref)] += 1
            missing_hrefs[ref] += 1

sorted_pairs = sorted(missing_pairs.items(), key=lambda item: (item[0][0], item[0][1]))
sorted_hrefs = sorted(missing_hrefs.items(), key=lambda item: (-item[1], item[0]))

with REPORT_PATH.open("w", encoding="utf-8", newline="\n") as report:
    report.write(f"TOTAL_MISSING_PAIRS={sum(missing_pairs.values())}\n")
    report.write(f"TOTAL_MISSING_UNIQUE_PAIRS={len(missing_pairs)}\n\n")
    for (source, href), count in sorted_pairs:
        report.write(f"{source}\t{href}\tcount={count}\n")

with SUMMARY_PATH.open("w", encoding="utf-8", newline="\n") as summary:
    summary.write(f"TOTAL_MISSING_OCCURRENCES={sum(missing_hrefs.values())}\n")
    summary.write(f"TOTAL_MISSING_UNIQUE_HREFS={len(missing_hrefs)}\n\n")
    for href, count in sorted_hrefs:
        summary.write(f"{count:4d}  {href}\n")

print(f"REPORT {REPORT_PATH}")
print(f"SUMMARY {SUMMARY_PATH}")
print(f"TOTAL_MISSING_OCCURRENCES {sum(missing_hrefs.values())}")
print(f"TOTAL_MISSING_UNIQUE_HREFS {len(missing_hrefs)}")
