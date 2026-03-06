from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

ARRAY_PATTERN = re.compile(
    r'(?P<indent>^[ \t]*)"openingHoursSpecification"\s*:\s*\[\s*\{(?P<body>.*?)\}\s*\](?P<trailing>\s*,?)',
    re.MULTILINE | re.DOTALL,
)

OBJECT_PATTERN = re.compile(
    r'(?P<indent>^[ \t]*)"openingHoursSpecification"\s*:\s*\{(?P<body>.*?)\}(?P<trailing>\s*,?)',
    re.MULTILINE | re.DOTALL,
)

OPEN_24H_PATTERN = re.compile(r'"opens"\s*:\s*"00:00"')
CLOSE_24H_PATTERN = re.compile(r'"closes"\s*:\s*"23:59"')


def replace_block(match: re.Match[str]) -> str:
    body = match.group("body")
    if not (OPEN_24H_PATTERN.search(body) and CLOSE_24H_PATTERN.search(body)):
        return match.group(0)

    indent = match.group("indent")
    trailing = "," if "," in match.group("trailing") else ""
    return f'{indent}"openingHours": ["Su-Th 06:30-23:30", "Fr 06:30-13:00"]{trailing}'


changed_files = 0
array_replacements = 0
object_replacements = 0

for html_file in ROOT.rglob("*.html"):
    original = html_file.read_text(encoding="utf-8", errors="ignore")

    updated, a_count = ARRAY_PATTERN.subn(replace_block, original)
    updated, o_count = OBJECT_PATTERN.subn(replace_block, updated)

    if updated != original:
        html_file.write_text(updated, encoding="utf-8", newline="")
        changed_files += 1

    array_replacements += a_count
    object_replacements += o_count

print(f"Changed files: {changed_files}")
print(f"Array-form replacements: {array_replacements}")
print(f"Object-form replacements: {object_replacements}")
