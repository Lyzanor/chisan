#!/usr/bin/env python3
"""Build a 500-candidate KM0 Italy dataset from named OSM farm shops/producers.

The output is intentionally marked `parcial`: OSM is a discovery/localisation
source, not proof of current productive activity or online sales.
"""
from __future__ import annotations

import csv
import io
import json
import math
import os
import re
import sys
import time
import unicodedata
import zipfile
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from typing import Any, Iterable

import requests
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

TARGET = 500
REVIEW_DATE = "2026-08-04"
OUT_DIR = Path("research-output")
RAW_DIR = OUT_DIR / "raw"
APP_ROOT = OUT_DIR / "km0-italia-500"
CSV_ROOT = APP_ROOT / "data" / "csv" / "it"
EVIDENCE_ROOT = APP_ROOT / "data" / "evidence" / "it"

CANONICAL_HEADER = [
    "slug", "nombre", "municipio", "categoria", "productos estrella",
    "direccion", "descripcion", "horario", "telefono", "correo", "web",
    "Facebook", "Instagram", "Google Maps", "lat", "lon", "imagen",
    "verificacion", "Venta online", "Canal de venta",
]

MASTER_HEADER = [
    "numero", "nombre", "municipio", "provincia", "region", "categoria",
    "productos_estrella", "direccion", "horario", "telefono_publico",
    "correo_publico", "web_publica", "facebook", "instagram", "lat", "lon",
    "tipo_osm", "id_osm", "fuente_osm", "etiquetas_osm_relevantes",
    "puntuacion_seleccion", "estado_editorial", "venta_online",
    "requiere_revision_manual", "ruta_csv_importacion",
]

OVERPASS_ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
]

OVERPASS_QUERY = r"""
[out:json][timeout:240][maxsize:1073741824];
(
  nwr["shop"="farm"]["name"](35.20,6.35,47.25,18.75);
  nwr["craft"~"^(winery|brewery|cheese|oil_mill|distillery|beekeeper|confectionery|pasta|bakery|coffee_roaster)$"]["name"](35.20,6.35,47.25,18.75);
  nwr["industrial"~"^(winery|brewery|dairy|slaughterhouse|food)$"]["name"](35.20,6.35,47.25,18.75);
  nwr["man_made"="winery"]["name"](35.20,6.35,47.25,18.75);
  nwr["produce"]["name"](35.20,6.35,47.25,18.75);
);
out center tags qt;
"""

MUNICIPALITY_GEOJSON_URLS = [
    "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson",
    "https://github.com/openpolis/geojson-italy/raw/master/geojson/limits_IT_municipalities.geojson",
]

REGION_ORDER = [
    "Valle d'Aosta/Vallée d'Aoste", "Piemonte", "Liguria", "Lombardia",
    "Trentino-Alto Adige/Südtirol", "Veneto", "Friuli-Venezia Giulia",
    "Emilia-Romagna", "Toscana", "Umbria", "Marche", "Lazio", "Abruzzo",
    "Molise", "Campania", "Puglia", "Basilicata", "Calabria", "Sicilia",
    "Sardegna",
]
REGION_RANK = {name: i for i, name in enumerate(REGION_ORDER)}


def http_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "User-Agent": "KM0-Italy-Research/1.0 (+https://github.com/Lyzanor/km0)",
        "Accept": "application/json,text/plain,*/*",
    })
    return s


def fetch_overpass(session: requests.Session) -> dict[str, Any]:
    errors: list[str] = []
    for endpoint in OVERPASS_ENDPOINTS:
        for attempt in range(1, 4):
            try:
                print(f"Overpass: {endpoint}, intento {attempt}", flush=True)
                response = session.post(endpoint, data={"data": OVERPASS_QUERY}, timeout=330)
                response.raise_for_status()
                payload = response.json()
                if len(payload.get("elements", [])) < TARGET:
                    raise RuntimeError(
                        f"respuesta insuficiente: {len(payload.get('elements', []))} elementos"
                    )
                return payload
            except Exception as exc:  # noqa: BLE001
                errors.append(f"{endpoint} intento {attempt}: {exc}")
                time.sleep(8 * attempt)
    raise RuntimeError("No se pudo consultar Overpass:\n" + "\n".join(errors))


def fetch_municipalities(session: requests.Session) -> dict[str, Any]:
    errors: list[str] = []
    for url in MUNICIPALITY_GEOJSON_URLS:
        try:
            print(f"Municipios: descargando {url}", flush=True)
            response = session.get(url, timeout=330)
            response.raise_for_status()
            payload = response.json()
            if len(payload.get("features", [])) < 7000:
                raise RuntimeError("GeoJSON municipal incompleto")
            return payload
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    raise RuntimeError("No se pudo descargar el GeoJSON municipal:\n" + "\n".join(errors))


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "senza-nome"


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def first_tag(tags: dict[str, str], *keys: str) -> str:
    for key in keys:
        value = clean_text(tags.get(key))
        if value:
            return value
    return ""


def normalize_url(value: str) -> str:
    value = clean_text(value)
    if not value:
        return ""
    value = value.split(";")[0].strip()
    if value.startswith("//"):
        value = "https:" + value
    if not re.match(r"^https?://", value, flags=re.I):
        value = "https://" + value
    return value if re.match(r"^https?://[^\s]+$", value, flags=re.I) else ""


def social_url(value: str, network: str) -> str:
    value = clean_text(value)
    if not value:
        return ""
    value = value.split(";")[0].strip()
    if re.match(r"^https?://", value, flags=re.I):
        return value
    value = value.lstrip("@")
    if network == "facebook":
        return f"https://www.facebook.com/{value}"
    return f"https://www.instagram.com/{value}/"


def normalize_email(value: str) -> str:
    value = clean_text(value).split(";")[0].strip()
    return value if re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", value) else ""


def normalize_phone(value: str) -> str:
    value = clean_text(value).split(";")[0].strip()
    value = re.sub(r"[^0-9+() ./-]", "", value)
    digits = re.sub(r"\D", "", value)
    return value if 6 <= len(digits) <= 16 else ""


def build_address(tags: dict[str, str]) -> str:
    full = first_tag(tags, "addr:full")
    if full:
        return full
    street = first_tag(tags, "addr:street", "addr:place")
    number = first_tag(tags, "addr:housenumber")
    postcode = first_tag(tags, "addr:postcode")
    city = first_tag(tags, "addr:city", "addr:municipality")
    parts = []
    if street:
        parts.append(f"{street} {number}".strip())
    if postcode or city:
        parts.append(" ".join(p for p in [postcode, city] if p))
    return ", ".join(parts)


def category_for(tags: dict[str, str], name: str) -> str:
    craft = tags.get("craft", "").lower()
    industrial = tags.get("industrial", "").lower()
    produce = tags.get("produce", "").lower()
    product = tags.get("product", "").lower()
    hay = " ".join([craft, industrial, produce, product, name.lower()])

    rules = [
        ("Vino", ["winery", "wine", "vino", "cantina", "vitivinic", "vigneto"]),
        ("Aceite", ["oil_mill", "olive_oil", "olio", "oleificio", "frantoio"]),
        ("Cerveza", ["brewery", "beer", "birra", "birrificio"]),
        ("Lácteos y quesos", ["cheese", "dairy", "milk", "caseificio", "formagg", "latteria"]),
        ("Miel", ["beekeeper", "honey", "miele", "apicolt", "apiario"]),
        ("Destilados y licores", ["distillery", "spirits", "liquor", "grappa", "distilleria"]),
        ("Café", ["coffee_roaster", "torrefazione", "caffe", "caffè"]),
        ("Pan y cereal", ["bakery", "pasta", "panificio", "pastificio", "forno", "farina", "cereali"]),
        ("Dulces y repostería", ["confectionery", "pasticceria", "dolci", "confett"]),
        ("Carne", ["meat", "salumificio", "salumi", "allevamento", "carne"]),
        ("Huevos", ["eggs", "uova"]),
        ("Pescado", ["fish", "pesce", "ittic"]),
        ("Frutos secos", ["nuts", "nocciole", "mandorle", "pistacchio"]),
        ("Setas", ["mushroom", "truffle", "funghi", "tartufo"]),
        ("Fruta y verdura", ["fruit", "vegetable", "ortofrutta", "ortaggi", "frutta", "verdura"]),
    ]
    for category, needles in rules:
        if any(needle in hay for needle in needles):
            return category
    return "Otros"


def star_products(tags: dict[str, str]) -> str:
    values: list[str] = []
    for key in ("produce", "product", "crop", "description"):
        raw = clean_text(tags.get(key))
        if not raw:
            continue
        if key == "description" and len(raw) > 120:
            continue
        for token in re.split(r"[;,|]", raw):
            token = clean_text(token.replace("_", " "))
            if token and token.lower() not in {"yes", "no", "farm", "local"}:
                values.append(token)
    unique: list[str] = []
    seen: set[str] = set()
    for value in values:
        key = value.casefold()
        if key not in seen:
            seen.add(key)
            unique.append(value)
    return ", ".join(unique[:5])


def relevant_tags(tags: dict[str, str]) -> str:
    keys = [
        "shop", "craft", "industrial", "man_made", "produce", "product",
        "organic", "diet:vegan", "diet:vegetarian", "opening_hours",
    ]
    return " | ".join(f"{key}={tags[key]}" for key in keys if clean_text(tags.get(key)))


def quality_score(tags: dict[str, str], category: str, address: str, name: str) -> int:
    score = 0
    if category != "Otros":
        score += 5
    if first_tag(tags, "website", "contact:website", "url"):
        score += 4
    if first_tag(tags, "phone", "contact:phone"):
        score += 2
    if first_tag(tags, "email", "contact:email"):
        score += 2
    if first_tag(tags, "produce", "product"):
        score += 4
    if address:
        score += 3
    if tags.get("opening_hours"):
        score += 1
    if tags.get("organic") in {"yes", "only"}:
        score += 1
    generic = slugify(name) in {
        "azienda-agricola", "fattoria", "farm", "agriturismo", "cantina",
        "caseificio", "frantoio", "azienda-vinicola",
    }
    if generic:
        score -= 8
    return score


def element_point(element: dict[str, Any]) -> tuple[float, float] | None:
    if "lat" in element and "lon" in element:
        return float(element["lat"]), float(element["lon"])
    center = element.get("center") or {}
    if "lat" in center and "lon" in center:
        return float(center["lat"]), float(center["lon"])
    return None


def osm_url(element: dict[str, Any]) -> str:
    osm_type = element.get("type", "node")
    return f"https://www.openstreetmap.org/{osm_type}/{element['id']}"


def build_spatial_index(geojson: dict[str, Any]):
    geometries = []
    properties = []
    for feature in geojson.get("features", []):
        try:
            geom = shape(feature["geometry"])
            props = feature.get("properties") or {}
            if geom.is_empty:
                continue
            geometries.append(geom)
            properties.append(props)
        except Exception:  # noqa: BLE001
            continue
    if len(geometries) < 7000:
        raise RuntimeError(f"Índice municipal incompleto: {len(geometries)} geometrías")
    return STRtree(geometries), geometries, properties


def locate_point(tree: STRtree, geometries, properties, lat: float, lon: float):
    point = Point(lon, lat)
    hits = tree.query(point, predicate="intersects")
    for hit in hits:
        if isinstance(hit, (int,)):
            idx = int(hit)
        else:
            # Shapely 1.x fallback.
            try:
                idx = geometries.index(hit)
            except ValueError:
                continue
        props = properties[idx]
        region = clean_text(props.get("reg_name") or props.get("region_name"))
        province = clean_text(props.get("prov_name") or props.get("province_name"))
        municipality = clean_text(props.get("com_name") or props.get("municipality_name"))
        if region and province and municipality:
            return region, province, municipality
    return None


def select_balanced(candidates: list[dict[str, Any]], target: int) -> list[dict[str, Any]]:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in candidates:
        groups[row["region"]].append(row)
    for rows in groups.values():
        rows.sort(key=lambda row: (-row["score"], row["name"].casefold(), row["osm_id"]))

    selected: list[dict[str, Any]] = []
    selected_keys: set[tuple[str, int]] = set()
    # First ensure meaningful national coverage.
    for region in sorted(groups, key=lambda x: (REGION_RANK.get(x, 999), x)):
        for row in groups[region][: min(10, len(groups[region]))]:
            selected.append(row)
            selected_keys.add((row["osm_type"], row["osm_id"]))

    # Then choose strongest remaining candidates, with a soft per-region cap.
    counts = Counter(row["region"] for row in selected)
    remaining = [
        row for row in candidates
        if (row["osm_type"], row["osm_id"]) not in selected_keys
    ]
    remaining.sort(key=lambda row: (-row["score"], REGION_RANK.get(row["region"], 999), row["name"].casefold()))
    for cap in (35, 50, 10_000):
        for row in remaining:
            key = (row["osm_type"], row["osm_id"])
            if key in selected_keys or counts[row["region"]] >= cap:
                continue
            selected.append(row)
            selected_keys.add(key)
            counts[row["region"]] += 1
            if len(selected) >= target:
                return selected[:target]
    return selected[:target]


def write_csv(path: Path, header: list[str], rows: Iterable[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=header, lineterminator="\n", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    session = http_session()

    overpass = fetch_overpass(session)
    municipalities = fetch_municipalities(session)
    (RAW_DIR / "overpass.json").write_text(json.dumps(overpass, ensure_ascii=False), encoding="utf-8")

    print("Construyendo índice espacial municipal…", flush=True)
    tree, geometries, properties = build_spatial_index(municipalities)

    candidates: list[dict[str, Any]] = []
    dedupe: set[tuple[str, str]] = set()
    for element in overpass.get("elements", []):
        tags = element.get("tags") or {}
        name = clean_text(tags.get("name"))
        coords = element_point(element)
        if not name or not coords:
            continue
        lat, lon = coords
        located = locate_point(tree, geometries, properties, lat, lon)
        if not located:
            continue
        region, province, municipality = located
        identity_key = (slugify(name), slugify(municipality))
        if identity_key in dedupe:
            continue
        dedupe.add(identity_key)

        address = build_address(tags)
        category = category_for(tags, name)
        website = normalize_url(first_tag(tags, "website", "contact:website", "url"))
        facebook = social_url(first_tag(tags, "contact:facebook", "facebook"), "facebook")
        instagram = social_url(first_tag(tags, "contact:instagram", "instagram"), "instagram")
        phone = normalize_phone(first_tag(tags, "phone", "contact:phone"))
        email = normalize_email(first_tag(tags, "email", "contact:email"))
        score = quality_score(tags, category, address, name)
        candidates.append({
            "name": name,
            "municipality": municipality,
            "province": province,
            "region": region,
            "category": category,
            "star_products": star_products(tags),
            "address": address,
            "opening_hours": clean_text(tags.get("opening_hours")),
            "phone": phone,
            "email": email,
            "website": website,
            "facebook": facebook,
            "instagram": instagram,
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "osm_type": element.get("type", "node"),
            "osm_id": int(element["id"]),
            "source": osm_url(element),
            "relevant_tags": relevant_tags(tags),
            "score": score,
        })

    print(f"Candidatos italianos localizados y deduplicados: {len(candidates)}", flush=True)
    if len(candidates) < TARGET:
        raise RuntimeError(f"Solo se obtuvieron {len(candidates)} candidatos; se requieren {TARGET}")

    selected = select_balanced(candidates, TARGET)
    if len(selected) != TARGET:
        raise RuntimeError(f"Selección final incompleta: {len(selected)}")

    # Stable order by region/province/municipality/name.
    selected.sort(key=lambda row: (
        REGION_RANK.get(row["region"], 999), row["region"], row["province"],
        row["municipality"], row["name"].casefold(),
    ))

    # Build app rows and evidence grouped by region/province.
    grouped: dict[tuple[str, str, str, str], list[dict[str, Any]]] = defaultdict(list)
    master_rows: list[dict[str, Any]] = []
    slug_counts: dict[tuple[str, str], Counter] = defaultdict(Counter)

    for index, row in enumerate(selected, start=1):
        region_slug = slugify(row["region"])
        province_slug = slugify(row["province"])
        group_key = (region_slug, row["region"], province_slug, row["province"])
        base_slug = slugify(row["name"])
        counter = slug_counts[(region_slug, province_slug)]
        counter[base_slug] += 1
        producer_slug = base_slug if counter[base_slug] == 1 else f"{base_slug}-{row['osm_type']}-{row['osm_id']}"
        maps_url = f"https://www.google.com/maps?q={row['lat']},{row['lon']}"
        app_row = {
            "slug": producer_slug,
            "nombre": row["name"],
            "municipio": row["municipality"],
            "categoria": row["category"],
            "productos estrella": row["star_products"],
            "direccion": row["address"],
            "descripcion": "",
            "horario": row["opening_hours"],
            "telefono": row["phone"],
            "correo": row["email"],
            "web": row["website"],
            "Facebook": row["facebook"],
            "Instagram": row["instagram"],
            "Google Maps": maps_url,
            "lat": row["lat"],
            "lon": row["lon"],
            "imagen": "",
            "verificacion": "parcial",
            "Venta online": "no comprobado",
            "Canal de venta": "",
        }
        row["producer_slug"] = producer_slug
        grouped[group_key].append({"app": app_row, "research": row})
        master_rows.append({
            "numero": index,
            "nombre": row["name"],
            "municipio": row["municipality"],
            "provincia": row["province"],
            "region": row["region"],
            "categoria": row["category"],
            "productos_estrella": row["star_products"],
            "direccion": row["address"],
            "horario": row["opening_hours"],
            "telefono_publico": row["phone"],
            "correo_publico": row["email"],
            "web_publica": row["website"],
            "facebook": row["facebook"],
            "instagram": row["instagram"],
            "lat": row["lat"],
            "lon": row["lon"],
            "tipo_osm": row["osm_type"],
            "id_osm": row["osm_id"],
            "fuente_osm": row["source"],
            "etiquetas_osm_relevantes": row["relevant_tags"],
            "puntuacion_seleccion": row["score"],
            "estado_editorial": "parcial",
            "venta_online": "no comprobado",
            "requiere_revision_manual": "sí",
            "ruta_csv_importacion": f"data/csv/it/{region_slug}/{province_slug}.csv",
        })

    # Write master research CSV.
    master_path = OUT_DIR / "italia_km0_500_master.csv"
    write_csv(master_path, MASTER_HEADER, master_rows)

    # Write area CSVs and evidence ledgers.
    manifest_regions: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for (region_slug, region_label, province_slug, province_label), entries in grouped.items():
        entries.sort(key=lambda item: (item["app"]["municipio"], item["app"]["nombre"].casefold()))
        csv_path = CSV_ROOT / region_slug / f"{province_slug}.csv"
        write_csv(csv_path, CANONICAL_HEADER, (item["app"] for item in entries))
        evidence_path = EVIDENCE_ROOT / region_slug / f"{province_slug}.jsonl"
        evidence_path.parent.mkdir(parents=True, exist_ok=True)
        with evidence_path.open("w", encoding="utf-8", newline="") as handle:
            for item in entries:
                research = item["research"]
                evidence = {
                    "slug": item["app"]["slug"],
                    "reviewedAt": REVIEW_DATE,
                    "reviewedBy": "openai-research",
                    "action": "keep",
                    "decision": {
                        "verification": "parcial",
                        "onlineSales": "no comprobado",
                        "salesChannels": [],
                    },
                    "sources": [{
                        "url": research["source"],
                        "type": "other",
                        "checkedAt": REVIEW_DATE,
                        "claims": ["identity", "municipality", "location"],
                    }],
                    "notes": "Candidato de descubrimiento OSM; requiere verificación editorial de actividad productiva y contacto.",
                }
                handle.write(json.dumps(evidence, ensure_ascii=False, separators=(",", ":")) + "\n")
        manifest_regions[(region_slug, region_label)].append({
            "slug": province_slug,
            "label": province_label,
        })

    country = {
        "label": "Italia",
        "unit": {"one": "provincia", "many": "province"},
        "regionUnit": {"one": "regione", "many": "regioni"},
        "aliases": {},
        "regions": [],
    }
    for (region_slug, region_label), areas in sorted(
        manifest_regions.items(), key=lambda item: (REGION_RANK.get(item[0][1], 999), item[0][1])
    ):
        country["regions"].append({
            "slug": region_slug,
            "label": region_label,
            "areas": sorted(areas, key=lambda item: item["label"]),
        })
    CSV_ROOT.mkdir(parents=True, exist_ok=True)
    (CSV_ROOT / "country.json").write_text(
        json.dumps(country, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    agents = """# Italia — guida editoriale

## Struttura amministrativa
- country: Italia (`it`)
- region: regione italiana
- area: provincia o città metropolitana

## Fonti iniziali
- OpenStreetMap è usato solo per scoperta, nome, coordinate e localizzazione.
- Un record derivato soltanto da OSM resta `parcial` e `Venta online=no comprobado`.
- Prima di promuovere a `verificado`, controllare sito ufficiale, profilo sociale ufficiale,
  registro istituzionale o altra fonte verificante secondo `docs/EDITORIAL_POLICY.md`.

## Regole di revisione
- Confermare che l'entità produca o trasformi alimenti, non sia soltanto rivenditore,
  ristorante, agriturismo o luogo turistico.
- Confermare il comune della sede produttiva, non soltanto del punto vendita.
- Non dedurre vendita online dalla sola presenza di un sito web.
- Mantenere i nomi e i testi editoriali in italiano.
"""
    (CSV_ROOT / "AGENTS.md").write_text(agents, encoding="utf-8")

    region_counts = Counter(row["region"] for row in selected)
    province_counts = Counter(row["province"] for row in selected)
    category_counts = Counter(row["category"] for row in selected)
    summary = {
        "generatedAt": REVIEW_DATE,
        "target": TARGET,
        "selected": len(selected),
        "discoveredCandidates": len(candidates),
        "regions": dict(sorted(region_counts.items(), key=lambda x: (REGION_RANK.get(x[0], 999), x[0]))),
        "provinces": dict(sorted(province_counts.items())),
        "categories": dict(sorted(category_counts.items())),
        "method": "OSM named farm shops/producers + Openpolis municipality polygons; partial verification only",
        "licenses": {
            "OpenStreetMap": "ODbL 1.0 — © OpenStreetMap contributors",
            "Openpolis geojson-italy": "see upstream repository license/attribution",
        },
    }
    (OUT_DIR / "italia_km0_500_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    readme = f"""# Italia KM0 — 500 candidati locali

Generato il {REVIEW_DATE}. Il pacchetto contiene **{len(selected)} candidati** distribuiti
nelle regioni e province italiane, già strutturati secondo il contratto CSV di KM0.

## Contenuto
- `italia_km0_500_master.csv`: tabella di ricerca con fonte OSM e campi di revisione.
- `italia_km0_500_summary.json`: conteggi per regione, provincia e categoria.
- `italia_km0_500_import.zip`: albero pronto da copiare nel repository (`data/csv/it/**`
  e `data/evidence/it/**`).

## Stato editoriale
Tutte le righe sono deliberatamente `parcial` e `Venta online=no comprobado`.
OpenStreetMap è una fonte di scoperta/localizzazione, non prova sufficiente di attività
produttiva corrente. Ogni riga deve essere controllata prima della pubblicazione definitiva.

## Attribuzione
Dati produttori e coordinate: © OpenStreetMap contributors, ODbL 1.0.
Confini amministrativi usati per l'associazione territoriale: progetto Openpolis
`geojson-italy`; verificare e conservare la relativa attribuzione/licenza a monte.
"""
    (OUT_DIR / "README_ITALIA_500.md").write_text(readme, encoding="utf-8")
    (APP_ROOT / "README_ITALIA_500.md").write_text(readme, encoding="utf-8")

    zip_path = OUT_DIR / "italia_km0_500_import.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(APP_ROOT.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(APP_ROOT))

    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    print(f"Archivos generados en {OUT_DIR.resolve()}", flush=True)


if __name__ == "__main__":
    main()
