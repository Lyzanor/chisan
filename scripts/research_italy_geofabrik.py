#!/usr/bin/env python3
"""Build a 500-row Italy KM0 candidate CSV from a Geofabrik OSM shapefile."""
from __future__ import annotations

import csv
import re
import unicodedata
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import requests
import shapefile
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

TARGET = 500
OUT_DIR = Path("geofabrik-output")
DOWNLOAD = OUT_DIR / "italy-latest-free.shp.zip"
CSV_PATH = OUT_DIR / "italia_km0_500_master.csv"

SHAPEFILE_URL = "https://download.geofabrik.de/europe/italy-latest-free.shp.zip"
MUNICIPALITY_URLS = [
    "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson",
    "https://github.com/openpolis/geojson-italy/raw/master/geojson/limits_IT_municipalities.geojson",
]

HEADER = [
    "numero", "nombre", "municipio", "provincia", "region", "categoria",
    "productos_estrella", "direccion", "horario", "telefono_publico",
    "correo_publico", "web_publica", "facebook", "instagram", "lat", "lon",
    "tipo_osm", "id_osm", "fuente_osm", "etiquetas_osm_relevantes",
    "puntuacion_seleccion", "estado_editorial", "venta_online",
    "requiere_revision_manual", "ruta_csv_importacion",
]

REGION_ORDER = [
    "Valle d'Aosta/Vallée d'Aoste", "Piemonte", "Liguria", "Lombardia",
    "Trentino-Alto Adige/Südtirol", "Veneto", "Friuli-Venezia Giulia",
    "Emilia-Romagna", "Toscana", "Umbria", "Marche", "Lazio", "Abruzzo",
    "Molise", "Campania", "Puglia", "Basilicata", "Calabria", "Sicilia",
    "Sardegna",
]
REGION_RANK = {name: index for index, name in enumerate(REGION_ORDER)}

STRICT_CLASSES = {
    "farm", "farm_shop", "winery", "vineyard", "brewery", "distillery",
    "dairy", "cheese", "beekeeping", "apiary", "oil_mill", "mill",
    "food_production", "food_processing", "orchard", "plant_nursery",
}
FOOD_CLASSES = {
    "bakery", "butcher", "greengrocer", "confectionery", "beverages",
    "alcohol", "seafood", "fishmonger", "deli", "organic", "marketplace",
    "supermarket", "convenience", "food", "coffee", "tea", "chocolate",
}


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-") or "senza-nome"


def clean(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def download(session: requests.Session, url: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 10_000_000:
        return
    print(f"Descargando {url}", flush=True)
    with session.get(url, stream=True, timeout=600) as response:
        response.raise_for_status()
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("wb") as handle:
            for chunk in response.iter_content(chunk_size=4 * 1024 * 1024):
                if chunk:
                    handle.write(chunk)
    if path.stat().st_size < 10_000_000:
        raise RuntimeError(f"Descarga demasiado pequeña: {path.stat().st_size} bytes")
    print(f"Descargado: {path.stat().st_size / 1_000_000:.1f} MB", flush=True)


def fetch_municipalities(session: requests.Session) -> dict[str, Any]:
    errors = []
    for url in MUNICIPALITY_URLS:
        try:
            response = session.get(url, timeout=600)
            response.raise_for_status()
            payload = response.json()
            if len(payload.get("features", [])) < 7000:
                raise RuntimeError("GeoJSON municipal incompleto")
            return payload
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    raise RuntimeError("No se pudo cargar el GeoJSON municipal: " + " | ".join(errors))


def build_spatial_index(payload: dict[str, Any]):
    geometries = []
    properties = []
    for feature in payload.get("features", []):
        try:
            geom = shape(feature["geometry"])
            if geom.is_empty:
                continue
            geometries.append(geom)
            properties.append(feature.get("properties") or {})
        except Exception:  # noqa: BLE001
            continue
    if len(geometries) < 7000:
        raise RuntimeError(f"Índice municipal incompleto: {len(geometries)}")
    return STRtree(geometries), geometries, properties


def locate(tree: STRtree, geometries, properties, lon: float, lat: float):
    point = Point(lon, lat)
    for hit in tree.query(point, predicate="intersects"):
        if hasattr(hit, "__index__"):
            index = int(hit)
        else:
            try:
                index = geometries.index(hit)
            except ValueError:
                continue
        props = properties[index]
        region = clean(props.get("reg_name") or props.get("region_name"))
        province = clean(props.get("prov_name") or props.get("province_name"))
        municipality = clean(
            props.get("com_name") or props.get("municipality_name") or props.get("name")
        )
        if region and province and municipality:
            return region, province, municipality
    return None


def category_for(fclass: str, name: str) -> str:
    hay = f"{fclass} {name}".lower()
    rules = [
        ("Vino", ["winery", "vineyard", "wine", "vino", "cantina"]),
        ("Aceite", ["oil", "olio", "frantoio"]),
        ("Cerveza", ["brewery", "beer", "birra"]),
        ("Lácteos y quesos", ["dairy", "cheese", "caseificio", "formagg"]),
        ("Miel", ["beek", "apiary", "miele", "apicol"]),
        ("Destilados y licores", ["distillery", "grappa", "liquor"]),
        ("Café", ["coffee", "caffe", "caffè", "torrefazione"]),
        ("Pan y cereal", ["bakery", "mill", "pasta", "panificio", "forno"]),
        ("Dulces y repostería", ["confectionery", "chocolate", "pasticceria", "dolci"]),
        ("Carne", ["butcher", "meat", "carne", "salumi"]),
        ("Pescado", ["seafood", "fish", "pesce"]),
        ("Fruta y verdura", ["farm", "orchard", "greengrocer", "fruit", "vegetable"]),
    ]
    for category, needles in rules:
        if any(needle in hay for needle in needles):
            return category
    return "Otros"


def score_for(fclass: str, name: str) -> int:
    score = 10 if fclass in STRICT_CLASSES else 3
    if any(token in name.lower() for token in (
        "azienda agricola", "fattoria", "cantina", "caseificio", "frantoio",
        "birrificio", "apicolt", "forno", "panificio", "pastificio",
    )):
        score += 6
    if fclass in {"supermarket", "convenience"}:
        score -= 8
    return score


def extract_pois(zip_path: Path, extract_dir: Path) -> Path:
    with zipfile.ZipFile(zip_path) as archive:
        members = archive.namelist()
        shp_candidates = [name for name in members if name.endswith("gis_osm_pois_free_1.shp")]
        if not shp_candidates:
            raise RuntimeError("No se encontró gis_osm_pois_free_1.shp en el ZIP")
        shp_member = shp_candidates[0]
        stem = shp_member[:-4]
        wanted = [name for name in members if name.startswith(stem + ".")]
        extract_dir.mkdir(parents=True, exist_ok=True)
        for member in wanted:
            archive.extract(member, extract_dir)
    return extract_dir / shp_member


def read_named_candidates(shp_path: Path) -> list[dict[str, Any]]:
    reader = shapefile.Reader(str(shp_path), encoding="utf-8")
    fields = [field[0] for field in reader.fields[1:]]
    candidates = []
    counts = Counter()
    for item in reader.iterShapeRecords():
        record = dict(zip(fields, item.record))
        fclass = clean(record.get("fclass")).lower()
        counts[fclass] += 1
        name = clean(record.get("name"))
        if not name or (fclass not in STRICT_CLASSES and fclass not in FOOD_CLASSES):
            continue
        if not item.shape.points:
            continue
        lon, lat = item.shape.points[0][:2]
        osm_id_raw = clean(record.get("osm_id"))
        try:
            osm_id = int(float(osm_id_raw))
        except ValueError:
            continue
        candidates.append({
            "name": name,
            "fclass": fclass,
            "lon": float(lon),
            "lat": float(lat),
            "osm_id": osm_id,
        })
    print("Clases POI más comunes:", counts.most_common(30), flush=True)
    print(f"POI alimentarios con nombre: {len(candidates)}", flush=True)
    return candidates


def balanced_select(rows: list[dict[str, Any]], target: int) -> list[dict[str, Any]]:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in rows:
        groups[row["region"]].append(row)
    for group in groups.values():
        group.sort(key=lambda row: (-row["score"], row["name"].casefold(), row["osm_id"]))

    selected = []
    seen = set()
    for region in sorted(groups, key=lambda value: (REGION_RANK.get(value, 999), value)):
        for row in groups[region][: min(10, len(groups[region]))]:
            selected.append(row)
            seen.add((row["osm_id"], row["name"].casefold()))

    counts = Counter(row["region"] for row in selected)
    remaining = [row for row in rows if (row["osm_id"], row["name"].casefold()) not in seen]
    remaining.sort(key=lambda row: (-row["score"], REGION_RANK.get(row["region"], 999), row["name"].casefold()))
    for cap in (35, 50, 10_000):
        for row in remaining:
            key = (row["osm_id"], row["name"].casefold())
            if key in seen or counts[row["region"]] >= cap:
                continue
            selected.append(row)
            seen.add(key)
            counts[row["region"]] += 1
            if len(selected) >= target:
                return selected[:target]
    return selected[:target]


def main() -> None:
    session = requests.Session()
    session.headers.update({"User-Agent": "KM0-Italy-Geofabrik/1.1 (+https://github.com/Lyzanor/km0)"})
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    download(session, SHAPEFILE_URL, DOWNLOAD)
    shp_path = extract_pois(DOWNLOAD, OUT_DIR / "shape")
    raw = read_named_candidates(shp_path)

    municipalities = fetch_municipalities(session)
    tree, geometries, properties = build_spatial_index(municipalities)

    located = []
    dedupe = set()
    for row in raw:
        place = locate(tree, geometries, properties, row["lon"], row["lat"])
        if not place:
            continue
        region, province, municipality = place
        key = (slugify(row["name"]), slugify(municipality))
        if key in dedupe:
            continue
        dedupe.add(key)
        row.update({
            "region": region,
            "province": province,
            "municipality": municipality,
            "score": score_for(row["fclass"], row["name"]),
            "category": category_for(row["fclass"], row["name"]),
        })
        located.append(row)

    print(f"Candidatos localizados y deduplicados: {len(located)}", flush=True)
    if len(located) < TARGET:
        raise RuntimeError(f"Solo se localizaron {len(located)} candidatos")
    selected = balanced_select(located, TARGET)
    if len(selected) != TARGET:
        raise RuntimeError(f"Selección incompleta: {len(selected)}")
    selected.sort(key=lambda row: (
        REGION_RANK.get(row["region"], 999), row["region"], row["province"],
        row["municipality"], row["name"].casefold(),
    ))

    with CSV_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADER, lineterminator="\n")
        writer.writeheader()
        for index, row in enumerate(selected, start=1):
            region_slug = slugify(row["region"])
            province_slug = slugify(row["province"])
            writer.writerow({
                "numero": index,
                "nombre": row["name"],
                "municipio": row["municipality"],
                "provincia": row["province"],
                "region": row["region"],
                "categoria": row["category"],
                "productos_estrella": "",
                "direccion": "",
                "horario": "",
                "telefono_publico": "",
                "correo_publico": "",
                "web_publica": "",
                "facebook": "",
                "instagram": "",
                "lat": f"{row['lat']:.6f}",
                "lon": f"{row['lon']:.6f}",
                "tipo_osm": "node",
                "id_osm": row["osm_id"],
                "fuente_osm": f"https://www.openstreetmap.org/node/{row['osm_id']}",
                "etiquetas_osm_relevantes": f"fclass={row['fclass']}",
                "puntuacion_seleccion": row["score"],
                "estado_editorial": "parcial",
                "venta_online": "no comprobado",
                "requiere_revision_manual": "sí",
                "ruta_csv_importacion": f"data/csv/it/{region_slug}/{province_slug}.csv",
            })

    with CSV_PATH.open(encoding="utf-8", newline="") as handle:
        count = sum(1 for _ in csv.DictReader(handle))
    if count != TARGET:
        raise RuntimeError(f"CSV final con {count} filas")
    print(f"CSV generado: {CSV_PATH} ({count} registros)", flush=True)


if __name__ == "__main__":
    main()
