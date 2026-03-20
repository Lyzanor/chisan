#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
import urllib.parse
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from tempfile import NamedTemporaryFile


FIND_PLACE_URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Populate the CSV 'Google Maps' column with query_place_id URLs."
    )
    parser.add_argument(
        "csv_path",
        nargs="?",
        default="Km0-productores.csv",
        help="Path to the CSV file to update.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Only process the first N rows that need updates.",
    )
    parser.add_argument(
        "--sleep-ms",
        type=int,
        default=0,
        help="Delay between API calls in milliseconds.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Rewrite rows even if they already contain query_place_id.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=8,
        help="Number of concurrent workers to use.",
    )
    return parser.parse_args()


def api_key() -> str:
    key = os.environ.get("GOOGLE_MAPS_API_KEY", "").strip()
    if not key:
        print("Error: GOOGLE_MAPS_API_KEY is required.", file=sys.stderr)
        sys.exit(1)
    return key


def clean(value: str | None) -> str:
    return " ".join(str(value or "").split())


def has_place_id(url: str) -> bool:
    return "query_place_id=" in clean(url)


def build_query_terms(row: dict[str, str]) -> list[str]:
    nombre = clean(row.get("nombre"))
    direccion = clean(row.get("direccion"))
    municipio = clean(row.get("municipio"))

    queries: list[str] = []

    for candidate in (
        ", ".join(part for part in (nombre, direccion, municipio) if part),
        ", ".join(part for part in (direccion, municipio) if part),
        ", ".join(part for part in (nombre, municipio) if part),
        nombre,
        direccion,
    ):
        candidate = clean(candidate)
        if candidate and candidate not in queries:
            queries.append(candidate)

    return queries


def build_location_bias(row: dict[str, str]) -> str | None:
    lat = clean(row.get("lat"))
    lon = clean(row.get("lon"))

    if not lat or not lon:
        return None

    return f"circle:5000@{lat},{lon}"


def fetch_json(base_url: str, params: dict[str, str], key: str) -> dict:
    query = urllib.parse.urlencode({**params, "key": key})
    url = f"{base_url}?{query}"
    request = urllib.request.Request(url, headers={"Accept": "application/json"})

    last_error: Exception | None = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code not in {429, 500, 502, 503, 504}:
                raise
            last_error = error
        except urllib.error.URLError as error:
            last_error = error

        time.sleep(1.5 * (attempt + 1))

    raise RuntimeError(f"HTTP error while calling Google Maps API: {last_error}")


def find_place_id(row: dict[str, str], key: str, sleep_s: float) -> tuple[str | None, str | None]:
    bias = build_location_bias(row)

    for query in build_query_terms(row):
        params = {
            "input": query,
            "inputtype": "textquery",
            "fields": "place_id,name,formatted_address",
            "language": "es",
        }
        if bias:
            params["locationbias"] = bias

        payload = fetch_json(FIND_PLACE_URL, params, key)
        status = payload.get("status")
        if status == "OK" and payload.get("candidates"):
            candidate = payload["candidates"][0]
            return candidate.get("place_id"), query
        if status == "OVER_QUERY_LIMIT":
            time.sleep(2)
            payload = fetch_json(FIND_PLACE_URL, params, key)
            status = payload.get("status")
            if status == "OK" and payload.get("candidates"):
                candidate = payload["candidates"][0]
                return candidate.get("place_id"), query
        if status not in {"ZERO_RESULTS", "OK"}:
            raise RuntimeError(f"Places API error for '{query}': {status}")

        if sleep_s:
            time.sleep(sleep_s)

    lat = clean(row.get("lat"))
    lon = clean(row.get("lon"))
    if lat and lon:
        payload = fetch_json(
            GEOCODE_URL,
            {
                "latlng": f"{lat},{lon}",
                "language": "es",
            },
            key,
        )
        status = payload.get("status")
        if status == "OK" and payload.get("results"):
            fallback_query = clean(row.get("direccion")) or clean(row.get("nombre")) or f"{lat},{lon}"
            return payload["results"][0].get("place_id"), fallback_query
        if status == "OVER_QUERY_LIMIT":
            time.sleep(2)
            payload = fetch_json(
                GEOCODE_URL,
                {
                    "latlng": f"{lat},{lon}",
                    "language": "es",
                },
                key,
            )
            status = payload.get("status")
            if status == "OK" and payload.get("results"):
                fallback_query = clean(row.get("direccion")) or clean(row.get("nombre")) or f"{lat},{lon}"
                return payload["results"][0].get("place_id"), fallback_query
        if status not in {"ZERO_RESULTS", "OK"}:
            raise RuntimeError(f"Geocoding API error for '{lat},{lon}': {status}")

    return None, None


def build_maps_url(query: str, place_id: str) -> str:
    encoded_query = urllib.parse.quote(query, safe="")
    encoded_place_id = urllib.parse.quote(place_id, safe="")
    return (
        "https://www.google.com/maps/search/?api=1"
        f"&query={encoded_query}&query_place_id={encoded_place_id}"
    )


def write_rows(csv_path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    with NamedTemporaryFile(
        "w",
        encoding="utf-8",
        newline="",
        delete=False,
        dir=str(csv_path.parent),
    ) as tmp:
        writer = csv.DictWriter(tmp, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
        temp_path = Path(tmp.name)

    temp_path.replace(csv_path)


def main() -> int:
    args = parse_args()
    key = api_key()
    csv_path = Path(args.csv_path)
    sleep_s = max(args.sleep_ms, 0) / 1000

    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None:
            print("Error: CSV header is required.", file=sys.stderr)
            return 1
        rows = list(reader)
        fieldnames = reader.fieldnames

    updated = 0
    skipped = 0
    failed: list[tuple[int, str]] = []
    pending: list[tuple[int, dict[str, str]]] = []

    for index, row in enumerate(rows, start=1):
        current = clean(row.get("Google Maps"))
        if not args.overwrite and has_place_id(current):
            skipped += 1
            continue
        pending.append((index, row))

    if args.limit is not None:
        pending = pending[: args.limit]

    print(f"Rows to resolve: {len(pending)}")

    def resolve_row(item: tuple[int, dict[str, str]]) -> tuple[int, str | None, str | None, str]:
        index, row = item
        place_id, query = find_place_id(row, key, sleep_s)
        return index, place_id, query, clean(row.get("nombre"))

    processed = 0
    with ThreadPoolExecutor(max_workers=max(args.workers, 1)) as executor:
        future_map = {executor.submit(resolve_row, item): item[0] for item in pending}
        for future in as_completed(future_map):
            index = future_map[future]
            row = rows[index - 1]
            processed += 1
            try:
                _, place_id, query, nombre = future.result()
            except Exception as error:
                failed.append((index, f"{clean(row.get('nombre'))} [{error}]"))
            else:
                if not place_id or not query:
                    failed.append((index, nombre))
                else:
                    row["Google Maps"] = build_maps_url(query, place_id)
                    updated += 1

            if processed % 250 == 0:
                print(f"Processed {processed}/{len(pending)} rows...")

    write_rows(csv_path, rows, fieldnames)

    print(f"Updated rows: {updated}")
    print(f"Skipped rows: {skipped}")
    print(f"Failed rows: {len(failed)}")

    if failed:
        for line, nombre in failed[:20]:
            print(f"- row {line}: {nombre or '(sin nombre)'}")
        if len(failed) > 20:
            print(f"- ...and {len(failed) - 20} more")

    return 0 if not failed else 2


if __name__ == "__main__":
    raise SystemExit(main())
