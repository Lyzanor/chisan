#!/usr/bin/env python3
"""Run the Italy candidate exporter with small, resilient Overpass grid queries."""
from __future__ import annotations

import importlib.util
import json
import time
from pathlib import Path
from typing import Any

import requests

MODULE_PATH = Path(__file__).with_name("research_italy_osm.py")
spec = importlib.util.spec_from_file_location("research_italy_osm", MODULE_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"No se pudo cargar {MODULE_PATH}")
research = importlib.util.module_from_spec(spec)
spec.loader.exec_module(research)

ENDPOINTS = [
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Small overlapping cells cover mainland Italy, Sicily and Sardinia while keeping
# each public Overpass query inexpensive.
CELLS = [
    (45.0, 6.30, 47.30, 9.50),
    (45.0, 9.25, 47.30, 12.50),
    (45.0, 12.25, 47.30, 15.80),
    (42.7, 6.30, 45.20, 9.70),
    (42.7, 9.45, 45.20, 12.70),
    (42.7, 12.45, 45.20, 16.00),
    (40.4, 7.70, 42.90, 11.20),
    (40.4, 10.95, 42.90, 14.20),
    (40.4, 13.95, 42.90, 18.90),
    (38.1, 7.70, 40.60, 11.30),
    (38.1, 11.05, 40.60, 14.80),
    (38.1, 14.55, 40.60, 18.90),
    (35.20, 8.00, 38.30, 12.20),
    (35.20, 11.95, 38.30, 15.50),
    (35.20, 15.25, 38.30, 18.90),
]


def cell_query(cell: tuple[float, float, float, float], *, expanded: bool = False) -> str:
    south, west, north, east = cell
    bbox = f"({south},{west},{north},{east})"
    extra = f'nwr["produce"]["name"]{bbox};' if expanded else ""
    return f'''[out:json][timeout:55][maxsize:134217728];
(
  nwr["shop"="farm"]["name"]{bbox};
  nwr["craft"~"^(winery|brewery|cheese|oil_mill|distillery|beekeeper|confectionery|pasta|bakery|coffee_roaster)$"]["name"]{bbox};
  nwr["industrial"~"^(winery|brewery|dairy|slaughterhouse|food)$"]["name"]{bbox};
  nwr["man_made"="winery"]["name"]{bbox};
  {extra}
);
out center tags qt 900;
'''


def fetch_cell(cell: tuple[float, float, float, float], expanded: bool) -> list[dict[str, Any]]:
    query = cell_query(cell, expanded=expanded)
    errors: list[str] = []
    for endpoint in ENDPOINTS:
        try:
            response = requests.post(
                endpoint,
                data={"data": query},
                headers={
                    "User-Agent": "KM0-Italy-Research/1.1 (+https://github.com/Lyzanor/km0)",
                    "Accept": "application/json",
                },
                timeout=75,
            )
            response.raise_for_status()
            payload = response.json()
            elements = payload.get("elements", [])
            print(
                f"Celda {cell} vía {endpoint}: {len(elements)} elementos",
                flush=True,
            )
            return elements
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{endpoint}: {exc}")
            time.sleep(2)
    print(f"Celda omitida {cell}: {' | '.join(errors)}", flush=True)
    return []


def fetch_overpass_grid(_session: requests.Session) -> dict[str, Any]:
    by_id: dict[tuple[str, int], dict[str, Any]] = {}
    for cell in CELLS:
        for element in fetch_cell(cell, expanded=False):
            by_id[(str(element.get("type")), int(element["id"]))] = element

    # A second, broader discovery pass is only used when the producer-specific
    # tags did not yield enough material after de-duplication.
    if len(by_id) < 900:
        print(f"Solo {len(by_id)} elementos primarios; activando pase ampliado", flush=True)
        for cell in CELLS:
            for element in fetch_cell(cell, expanded=True):
                by_id[(str(element.get("type")), int(element["id"]))] = element
            if len(by_id) >= 1800:
                break

    if len(by_id) < research.TARGET:
        raise RuntimeError(
            f"Las consultas Overpass por celdas solo devolvieron {len(by_id)} elementos"
        )
    print(f"Elementos OSM únicos obtenidos: {len(by_id)}", flush=True)
    return {
        "version": 0.6,
        "generator": "KM0 Italy grid Overpass runner",
        "elements": list(by_id.values()),
    }


research.fetch_overpass = fetch_overpass_grid
research.main()
