#!/usr/bin/env python3
"""Remove social URLs that do not point to the declared network."""

from __future__ import annotations

import csv
from pathlib import Path
from urllib.parse import urlparse


def valid_host(value: str, expected: str) -> bool:
    if not value:
        return True
    try:
        host = (urlparse(value).hostname or "").lower()
    except ValueError:
        return False
    return host == expected or host.endswith(f".{expected}")


def sanitize(path: Path, fields: dict[str, str]) -> int:
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            return 0
        rows = list(reader)
        headers = reader.fieldnames

    changes = 0
    for row in rows:
        for field, expected_host in fields.items():
            value = (row.get(field) or "").strip()
            if value and not valid_host(value, expected_host):
                row[field] = ""
                changes += 1

    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    return changes


def main() -> None:
    changes = 0
    for path in Path("data/csv/de").rglob("*.csv"):
        changes += sanitize(path, {"Facebook": "facebook.com", "Instagram": "instagram.com"})

    master = Path("exports/productores_km0_alemania_500.csv")
    if master.exists():
        changes += sanitize(master, {"facebook": "facebook.com", "instagram": "instagram.com"})

    print(f"Sanitized {changes} invalid social URL(s).")


if __name__ == "__main__":
    main()
