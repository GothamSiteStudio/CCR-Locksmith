from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = {
    "/blog/index.html": "/blog.html",

    "/service-areas/chesterfield-township.html": "/service-areas/chesterfield.html",
    "../service-areas/chesterfield-township.html": "../service-areas/chesterfield.html",
    "/service-areas/harrison-township.html": "/service-areas/clinton-township.html",
    "../service-areas/harrison-township.html": "../service-areas/clinton-township.html",

    "/car-key-replacement.html": "/automotive/car-key-replacement.html",
    "/transponder-key-programming.html": "/automotive/transponder-key-programming.html",
    "/key-fob-remote-programming.html": "/automotive/key-fob-remote-programming.html",
    "/smart-key-proximity-key-programming.html": "/automotive/smart-key-proximity-key-programming.html",
    "/ignition-switch-repair.html": "/automotive/ignition-switch-repair.html",
    "/laser-cut-high-security-key-cutting.html": "/automotive/laser-cut-high-security-key-cutting.html",
    "/car-key-duplication-cutting.html": "/automotive/car-key-duplication-cutting.html",
    "/ecu-immobilizer-reflashing.html": "/automotive/ecu-immobilizer-reflashing.html",
    "/ignition-switch-replacement.html": "/automotive/ignition-switch-replacement.html",
    "/key-shell-replacement.html": "/automotive/key-shell-replacement.html",
    "/motorcycle-key-replacement.html": "/automotive/motorcycle-key-replacement.html",

    "/emergency/emergency-house-lockout.html": "/emergency-house-lockout.html",
    "/emergency/apartment-condo-lockout.html": "/apartment-condo-lockout.html",
    "/emergency/burglary-breakin-damage-repair.html": "/burglary-breakin-damage-repair.html",

    "images/banner.jpg": "images/pic07.jpg",
    "images/logo.jpg": "images/Logo.png",
    "images/commercial-rekey.jpg": "images/pic07.jpg",
    "images/broken-key.jpg": "images/pic07.jpg",
    "images/burglary-repair.jpg": "images/pic07.jpg",
    "images/emergency-office.jpg": "images/pic07.jpg",
    "images/office-lockout.jpg": "images/pic07.jpg",
    "images/commercial-locks.jpg": "images/pic07.jpg",
    "images/commercial-safe.jpg": "images/pic07.jpg",
    "images/house-lockout.jpg": "images/pic07.jpg",
    "images/ignition-repair.jpg": "images/pic07.jpg",
    "images/rekeying.jpg": "images/pic07.jpg",
    "images/lock-repair.jpg": "images/pic07.jpg",
    "images/home-security-consultation.jpg": "images/pic07.jpg",
    "images/keyless-entry.jpg": "images/pic07.jpg",
    "images/safe-repair.jpg": "images/pic07.jpg",
    "images/safe-installation.jpg": "images/pic07.jpg",
    "images/safe-opening.jpg": "images/pic07.jpg",
    "images/safe-vault.jpg": "images/pic07.jpg",
    "images/smart-home-security.jpg": "images/pic07.jpg",

    "../images/transponder-key-programming-detroit.webp": "../images/pic07.jpg",
    "../images/car-key-replacement-detroit.webp": "../images/pic07.jpg",
    "../images/hero-broken-key-extraction-detroit.webp": "../images/pic07.jpg",
    "../images/ignition-repair-detroit.webp": "../images/pic07.jpg",
    "../images/hero-car-key-duplication-detroit.webp": "../images/pic07.jpg",
    "../images/laser-key-cutting-detroit.webp": "../images/pic07.jpg",
    "../images/hero-key-fob-programming-detroit.webp": "../images/pic07.jpg",
    "../images/smart-key-programming-detroit.webp": "../images/pic07.jpg",
}

HOURS_REPLACEMENTS = {
    '"openingHours":["Mo-Su 00:00-23:59"],': '"openingHours": ["Su-Th 06:30-23:30", "Fr 06:30-13:00"],',
    '"openingHours": ["Mo-Su 00:00-23:59"],': '"openingHours": ["Su-Th 06:30-23:30", "Fr 06:30-13:00"],',
}

changed_files = []
replacement_totals = {k: 0 for k in REPLACEMENTS}
hours_totals = {k: 0 for k in HOURS_REPLACEMENTS}

for file_path in ROOT.rglob("*.html"):
    original = file_path.read_text(encoding="utf-8", errors="ignore")
    updated = original

    for old, new in REPLACEMENTS.items():
        count = updated.count(old)
        if count:
            replacement_totals[old] += count
            updated = updated.replace(old, new)

    for old, new in HOURS_REPLACEMENTS.items():
        count = updated.count(old)
        if count:
            hours_totals[old] += count
            updated = updated.replace(old, new)

    if updated != original:
        file_path.write_text(updated, encoding="utf-8", newline="")
        changed_files.append(file_path.relative_to(ROOT).as_posix())

print(f"Changed files: {len(changed_files)}")
print("\nTop replacement counts:")
for key, count in sorted(replacement_totals.items(), key=lambda item: item[1], reverse=True):
    if count:
        print(f"{count:4d}  {key}")

print("\nOpening-hours replacement counts:")
for key, count in hours_totals.items():
    if count:
        print(f"{count:4d}  {key}")

print("\nSample changed files:")
for path in changed_files[:20]:
    print(path)
