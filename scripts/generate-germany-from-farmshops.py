#!/usr/bin/env python3
"""Generate a balanced 500-row Germany producer export from farmshops.eu OSM data."""

from __future__ import annotations

import csv
import json
import re
import subprocess
import sys
import unicodedata
import urllib.request
from collections import Counter
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

TARGET_COUNT = 500
CANONICAL_HEADER = [
    "slug", "nombre", "municipio", "categoria", "productos estrella", "direccion",
    "descripcion", "horario", "telefono", "correo", "web", "Facebook", "Instagram",
    "Google Maps", "lat", "lon", "imagen", "verificacion", "Venta online", "Canal de venta",
]
USER_HEADERS = [
    "nombre", "pais", "pais_codigo", "region", "region_codigo", "municipio", "categoria",
    "productos", "direccion", "horario", "telefono", "correo", "web", "facebook",
    "instagram", "google_maps", "lat", "lon", "osm_id", "fuente_url", "fecha_extraccion",
    "verificacion", "venta_online",
]
STATES = [
    ("DE-BW", "baden-wuerttemberg", "Baden-Württemberg", 45),
    ("DE-BY", "bayern", "Bayern", 70),
    ("DE-BE", "berlin", "Berlin", 8),
    ("DE-BB", "brandenburg", "Brandenburg", 25),
    ("DE-HB", "bremen", "Bremen", 5),
    ("DE-HH", "hamburg", "Hamburg", 6),
    ("DE-HE", "hessen", "Hessen", 35),
    ("DE-MV", "mecklenburg-vorpommern", "Mecklenburg-Vorpommern", 20),
    ("DE-NI", "niedersachsen", "Niedersachsen", 45),
    ("DE-NW", "nordrhein-westfalen", "Nordrhein-Westfalen", 65),
    ("DE-RP", "rheinland-pfalz", "Rheinland-Pfalz", 40),
    ("DE-SL", "saarland", "Saarland", 8),
    ("DE-SN", "sachsen", "Sachsen", 35),
    ("DE-ST", "sachsen-anhalt", "Sachsen-Anhalt", 25),
    ("DE-SH", "schleswig-holstein", "Schleswig-Holstein", 35),
    ("DE-TH", "thueringen", "Thüringen", 33),
]
STATE_BY_CODE = {code: {"code": code, "slug": slug, "label": label, "quota": quota} for code, slug, label, quota in STATES}
ALLOWED_CRAFTS = {"beekeeper", "winery", "brewery", "cheese", "dairy", "oil_mill", "distillery", "bakery", "confectionery", "butcher"}
BOUNDARY_URLS = [
    "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json",
    "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/master/2_bundeslaender/4_niedrig.geo.json",
]
CATEGORY_RULES = [
    ("Miel", "Honig", r"\b(beekeeper|apiary|bienen?|imker|honig|met)\b"),
    ("Vino", "Wein", r"\b(winery|weingut|weinbau|winzer|wein|sekt|vinothek)\b"),
    ("Cerveza", "Bier", r"\b(brewery|brauerei|brauhaus|bier|hopfen)\b"),
    ("Lácteos y quesos", "Käse und Milchprodukte", r"\b(cheese|dairy|käse|kaese|milch|molkerei|joghurt|quark|ziegenkäse|schafskäse)\b"),
    ("Aceite", "Öl", r"\b(oil_mill|ölmühle|oelmuehle|speiseöl|rapsöl|leinöl|öl)\b"),
    ("Destilados y licores", "Spirituosen und Liköre", r"\b(distillery|brennerei|destillerie|schnaps|likör|likoer|spirituosen|obstbrand)\b"),
    ("Pan y cereal", "Brot und Getreide", r"\b(bakery|bäckerei|baeckerei|backstube|brot|mehl|mühle|muehle|getreide|nudel|pasta)\b"),
    ("Chocolate", "Schokolade", r"\b(chocolate|schokolade|chocolatier|kakao)\b"),
    ("Dulces y repostería", "Süßwaren und Gebäck", r"\b(confectionery|konditorei|praline|bonbon|kuchen|torte|gebäck|gebaeck|süß|suess)\b"),
    ("Carne", "Fleisch und Wurst", r"\b(butcher|metzgerei|hofmetzgerei|fleisch|wurst|rind|schwein|lamm|wild|geflügel|gefluegel|pute)\b"),
    ("Huevos", "Eier", r"\b(egg|eggs|eier|hühner|huehner|freilandei)\b"),
    ("Pescado", "Fisch", r"\b(fisch|forelle|karpfen|aal|lachs|fish)\b"),
    ("Setas", "Pilze", r"\b(pilz|pilze|champignon|trüffel|trueffel|mushroom)\b"),
    ("Frutos secos", "Nüsse", r"\b(nuss|nüsse|nuesse|haselnuss|walnuss|mandel)\b"),
    ("Condimentos", "Kräuter und Gewürze", r"\b(kräuter|kraeuter|gewürz|gewuerz|salz|senf|sauce|chili)\b"),
    ("Té e infusiones", "Tee und Kräuteraufgüsse", r"\b(tee|teegarten|kräutertee|kraeutertee)\b"),
    ("Sidra", "Apfelwein und Cider", r"\b(cider|cidre|apfelwein|mosterei|most)\b"),
    ("Bebidas sin alcohol", "Säfte", r"\b(saftpresse|saft|fruchtsaft|limonade)\b"),
    ("Fruta y verdura", "Obst und Gemüse", r"\b(obst|gemüse|gemuese|spargel|erdbeer|beere|apfel|äpfel|aepfel|kirsche|kartoffel|hofgarten|gärtnerei|gaertnerei|landgemüse)\b"),
    ("Legumbres y cereales", "Hülsenfrüchte und Getreide", r"\b(hülsenfrucht|huelsenfrucht|linse|bohne|erbse|kichererbse|getreide)\b"),
    ("Conservas", "Konfitüren und Eingemachtes", r"\b(marmelade|konfitüre|konfituere|eingemacht|chutney|konserve)\b"),
    ("Helados", "Eis", r"\b(eismanufaktur|ice_cream)\b"),
]
COMPILED_RULES = [(category, products, re.compile(pattern, re.I)) for category, products, pattern in CATEGORY_RULES]


def collapse(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def ascii_german(value: str) -> str:
    value = collapse(value).translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "Ae", "Ö": "Oe", "Ü": "Ue"}))
    return "".join(ch for ch in unicodedata.normalize("NFKD", value) if not unicodedata.combining(ch))


def slugify(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", ascii_german(value).lower())).strip("-")


def identity_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", ascii_german(value).lower()).strip()


def first(tags: dict[str, Any], *keys: str) -> str:
    for key in keys:
        value = collapse(tags.get(key))
        if value:
            return value
    return ""


def normalize_url(value: str) -> str:
    raw = collapse(value).split(";")[0].strip()
    if not raw:
        return ""
    if raw.lower().startswith("www."):
        raw = "https://" + raw
    if not re.match(r"^https?://", raw, re.I):
        return ""
    try:
        parsed = urlparse(raw)
    except ValueError:
        return ""
    return raw if parsed.scheme in {"http", "https"} and parsed.hostname else ""


def social_url(value: str, host: str) -> str:
    raw = collapse(value).split(";")[0].strip()
    if not raw:
        return ""
    url = normalize_url(raw)
    if url:
        actual = (urlparse(url).hostname or "").lower()
        return url if actual == host or actual.endswith("." + host) else ""
    handle = raw.removeprefix("@").strip("/")
    if not handle or re.search(r"\s", handle):
        return ""
    return f"https://www.{host}/{handle}"


def normalize_email(value: str) -> str:
    raw = re.split(r"[;,|]", collapse(value).lower())[0].strip()
    return raw if re.match(r"^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$", raw) else ""


def normalize_phone(value: str) -> str:
    raw = re.split(r"[;|]", collapse(value))[0].strip().replace("00", "+", 1)
    if not raw:
        return ""
    if raw.startswith("+"):
        digits = re.sub(r"\D", "", raw[1:])
    else:
        digits = re.sub(r"\D", "", raw)
        digits = "49" + digits[1:] if digits.startswith("0") else (digits if digits.startswith("49") else "49" + digits)
    result = "+" + digits
    return result if re.match(r"^\+\d{7,15}$", result) else ""


def point_in_ring(point: tuple[float, float], ring: list[list[float]]) -> bool:
    x, y = point
    inside = False
    j = len(ring) - 1
    for i, (xi, yi) in enumerate(ring):
        xj, yj = ring[j]
        if (yi > y) != (yj > y):
            crossing = (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi
            if x < crossing:
                inside = not inside
        j = i
    return inside


def point_in_polygon(point: tuple[float, float], polygon: list[list[list[float]]]) -> bool:
    return bool(polygon and point_in_ring(point, polygon[0]) and not any(point_in_ring(point, hole) for hole in polygon[1:]))


def in_geometry(point: tuple[float, float], geometry: dict[str, Any]) -> bool:
    if geometry.get("type") == "Polygon":
        return point_in_polygon(point, geometry.get("coordinates", []))
    if geometry.get("type") == "MultiPolygon":
        return any(point_in_polygon(point, polygon) for polygon in geometry.get("coordinates", []))
    return False


def fetch_json(urls: list[str]) -> tuple[dict[str, Any], str]:
    errors = []
    for url in urls:
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "km0-germany-export/1.0"})
            with urllib.request.urlopen(request, timeout=120) as response:
                return json.load(response), url
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{url}: {exc}")
    raise RuntimeError(" | ".join(errors))


def category_for(tags: dict[str, Any], name: str) -> tuple[str, str]:
    haystack = " ".join(collapse(tags.get(key)) for key in ("craft", "shop", "product", "produce", "shop:product", "vending", "description", "operator") if tags.get(key)) + " " + name
    for category, products, pattern in COMPILED_RULES:
        if pattern.search(haystack):
            return category, products
    return "Otros", ""


def municipality_for(tags: dict[str, Any]) -> str:
    value = first(tags, "addr:city", "contact:city", "addr:place", "addr:municipality", "is_in:city", "is_in:town", "is_in:village", "is_in")
    return value.split(",")[0].strip()


def address_for(tags: dict[str, Any], municipality: str) -> str:
    full = first(tags, "addr:full", "contact:address")
    if full:
        return full
    street = first(tags, "addr:street", "addr:place")
    number = first(tags, "addr:housenumber")
    postcode = first(tags, "addr:postcode")
    parts = []
    if street:
        parts.append(collapse(f"{street} {number}"))
    if postcode or municipality:
        parts.append(collapse(f"{postcode} {municipality}"))
    return ", ".join(part for part in parts if part)


def state_for(point: tuple[float, float], boundaries: dict[str, Any]) -> dict[str, Any] | None:
    for feature in boundaries.get("features", []):
        code = feature.get("properties", {}).get("id")
        if code in STATE_BY_CODE and in_geometry(point, feature.get("geometry", {})):
            return STATE_BY_CODE[code]
    return None


def osm_source(osm_id: str) -> str:
    kind, _, number = osm_id.partition("/")
    return f"https://www.openstreetmap.org/{kind}/{number}" if kind in {"node", "way", "relation"} and number else ""


def read_feature(path: Path) -> dict[str, Any] | None:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if data.get("type") != "Feature" or data.get("geometry", {}).get("type") != "Point":
        return None
    coordinates = data.get("geometry", {}).get("coordinates", [])
    if len(coordinates) < 2:
        return None
    try:
        lon, lat = float(coordinates[0]), float(coordinates[1])
    except (TypeError, ValueError):
        return None
    properties = data.get("properties") or {}
    return {"tags": properties, "lon": lon, "lat": lat, "id": collapse(data.get("id") or properties.get("id"))}


def candidate_from(feature: dict[str, Any], boundaries: dict[str, Any]) -> dict[str, Any] | None:
    tags = feature["tags"]
    if tags.get("shop") != "farm" and tags.get("craft") not in ALLOWED_CRAFTS:
        return None
    name = first(tags, "name", "operator")
    website = normalize_url(first(tags, "website", "contact:website", "url"))
    municipality = municipality_for(tags)
    if not name or not website or not municipality:
        return None
    point = (feature["lon"], feature["lat"])
    state = state_for(point, boundaries)
    if not state:
        return None
    category, products = category_for(tags, name)
    address = address_for(tags, municipality)
    facebook = social_url(first(tags, "contact:facebook", "facebook"), "facebook.com")
    instagram = social_url(first(tags, "contact:instagram", "instagram"), "instagram.com")
    osm_id = feature["id"]
    if not osm_id:
        return None
    phone = normalize_phone(first(tags, "phone", "contact:phone", "mobile", "contact:mobile"))
    email = normalize_email(first(tags, "email", "contact:email"))
    score = 20 + (8 if address else 0) + (4 if phone else 0) + (4 if email else 0) + (3 if category != "Otros" else 0) + (2 if tags.get("opening_hours") else 0) + (2 if tags.get("organic") in {"yes", "only"} else 0)
    return {
        "nombre": name,
        "municipio": municipality,
        "categoria": category,
        "productos estrella": products,
        "direccion": address,
        "descripcion": collapse(tags.get("description")),
        "horario": collapse(tags.get("opening_hours")),
        "telefono": phone,
        "correo": email,
        "web": website,
        "Facebook": facebook,
        "Instagram": instagram,
        "Google Maps": f"https://www.google.com/maps?q={feature['lat']:.6f},{feature['lon']:.6f}",
        "lat": f"{feature['lat']:.6f}",
        "lon": f"{feature['lon']:.6f}",
        "imagen": "",
        "verificacion": "parcial",
        "Venta online": "no comprobado",
        "Canal de venta": "",
        "region": state["label"],
        "region_codigo": state["code"],
        "region_slug": state["slug"],
        "pais": "Alemania",
        "pais_codigo": "DE",
        "osm_id": osm_id,
        "fuente_url": osm_source(osm_id),
        "score": score,
    }


def select_records(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique_osm = {candidate["osm_id"]: candidate for candidate in candidates}
    unique_identity: dict[str, dict[str, Any]] = {}
    for candidate in unique_osm.values():
        key = "|".join((identity_key(candidate["nombre"]), identity_key(candidate["municipio"]), candidate["region_codigo"]))
        current = unique_identity.get(key)
        if current is None or candidate["score"] > current["score"]:
            unique_identity[key] = candidate
    groups: dict[str, list[dict[str, Any]]] = {code: [] for code, *_ in STATES}
    for candidate in unique_identity.values():
        groups[candidate["region_codigo"]].append(candidate)
    selected: list[dict[str, Any]] = []
    for code, _slug, label, quota in STATES:
        rows = sorted(groups[code], key=lambda row: (-row["score"], row["municipio"].casefold(), row["nombre"].casefold(), row["osm_id"]))
        if len(rows) < quota:
            raise RuntimeError(f"Only {len(rows)} eligible records for {label}; need {quota}")
        selected.extend(rows[:quota])
    if len(selected) != TARGET_COUNT:
        raise RuntimeError(f"Selected {len(selected)} rows instead of {TARGET_COUNT}")
    used: dict[str, set[str]] = {}
    for record in selected:
        area = record["region_slug"]
        used.setdefault(area, set())
        base = slugify(f"{record['nombre']}-{record['municipio']}") or "producer-" + re.sub(r"\D", "", record["osm_id"])
        slug = base
        suffix = re.sub(r"\D", "", record["osm_id"])[-6:]
        if slug in used[area]:
            slug = f"{base}-{suffix}"
        counter = 2
        while slug in used[area]:
            slug = f"{base}-{counter}"
            counter += 1
        record["slug"] = slug
        used[area].add(slug)
    return selected


def write_csv(path: Path, rows: list[dict[str, Any]], headers: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def source_commit(source_dir: Path) -> str:
    try:
        return subprocess.check_output(["git", "-C", str(source_dir), "rev-parse", "HEAD"], text=True).strip()
    except (OSError, subprocess.CalledProcessError):
        return ""


def main() -> None:
    source_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/farmshops")
    data_dir = source_dir / "data"
    if not data_dir.exists():
        raise SystemExit(f"Farmshops data directory not found: {data_dir}")
    boundaries, boundary_url = fetch_json(BOUNDARY_URLS)
    candidates = []
    for path in data_dir.rglob("details.json"):
        feature = read_feature(path)
        if feature:
            candidate = candidate_from(feature, boundaries)
            if candidate:
                candidates.append(candidate)
    records = select_records(candidates)
    extraction_date = date.today().isoformat()

    manifest = {
        "label": "Germany",
        "unit": {"one": "federal state", "many": "federal states"},
        "regionUnit": {"one": "federal state", "many": "federal states"},
        "aliases": {"baden-wurttemberg": "baden-wuerttemberg", "thuringen": "thueringen"},
        "regions": [
            {"slug": slug, "label": label, "areas": [{"slug": slug, "label": label}]}
            for _code, slug, label, _quota in STATES
        ],
    }
    root = Path("data/csv/de")
    root.mkdir(parents=True, exist_ok=True)
    (root / "country.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "AGENTS.md").write_text(
        "# Germany data guide\n\n"
        "- Hierarchy: country → Bundesland → Bundesland.\n"
        "- Initial discovery source: farmshops.eu's OpenStreetMap direct-marketer extract.\n"
        "- Rows start as `parcial`; OSM is a discovery source, not formal km0 certification.\n"
        "- OpenStreetMap data is ODbL 1.0 and requires attribution.\n",
        encoding="utf-8",
    )
    for code, slug, _label, _quota in STATES:
        area_rows = sorted((record for record in records if record["region_codigo"] == code), key=lambda row: (row["municipio"].casefold(), row["nombre"].casefold()))
        write_csv(root / slug / f"{slug}.csv", area_rows, CANONICAL_HEADER)

    master_rows = []
    for record in sorted(records, key=lambda row: (row["region"].casefold(), row["municipio"].casefold(), row["nombre"].casefold())):
        master_rows.append({
            "nombre": record["nombre"], "pais": "Alemania", "pais_codigo": "DE",
            "region": record["region"], "region_codigo": record["region_codigo"],
            "municipio": record["municipio"], "categoria": record["categoria"],
            "productos": record["productos estrella"], "direccion": record["direccion"],
            "horario": record["horario"], "telefono": record["telefono"], "correo": record["correo"],
            "web": record["web"], "facebook": record["Facebook"], "instagram": record["Instagram"],
            "google_maps": record["Google Maps"], "lat": record["lat"], "lon": record["lon"],
            "osm_id": record["osm_id"], "fuente_url": record["fuente_url"],
            "fecha_extraccion": extraction_date, "verificacion": "parcial", "venta_online": "no comprobado",
        })
    exports = Path("exports")
    exports.mkdir(exist_ok=True)
    write_csv(exports / "productores_km0_alemania_500.csv", master_rows, USER_HEADERS)
    quality = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "OpenStreetMap via the farmshops.eu structured extract",
        "source_repository": "https://github.com/CodeforKarlsruhe/farmshops.eu",
        "source_commit": source_commit(source_dir),
        "state_boundaries": boundary_url,
        "license": "OpenStreetMap data © OpenStreetMap contributors, ODbL 1.0",
        "total": len(records),
        "unique_osm_ids": len({row["osm_id"] for row in records}),
        "unique_area_slugs": len({(row["region_slug"], row["slug"]) for row in records}),
        "rows_with_municipality": sum(bool(row["municipio"]) for row in records),
        "rows_with_coordinates": sum(bool(row["lat"] and row["lon"]) for row in records),
        "rows_with_official_web": sum(bool(row["web"]) for row in records),
        "rows_with_any_public_link": sum(bool(row["web"] or row["Facebook"] or row["Instagram"] or row["Google Maps"]) for row in records),
        "rows_with_address": sum(bool(row["direccion"]) for row in records),
        "regions": dict(sorted(Counter(row["region"] for row in records).items())),
        "categories": dict(sorted(Counter(row["categoria"] for row in records).items())),
        "notes": [
            "Discovery/import dataset, not a formal km0 certification register.",
            "Every accepted row is a named OSM farm shop or producer craft with municipality, coordinates and website.",
            "Editorial spot-checking is recommended before production publication.",
        ],
    }
    (exports / "calidad_productores_km0_alemania_500.json").write_text(json.dumps(quality, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (exports / "README_productores_km0_alemania_500.md").write_text(
        "# Productores locales de Alemania — 500 registros\n\n"
        "CSV maestro para importación y 16 CSV regionales compatibles con KM0. "
        "Fuente de descubrimiento: OpenStreetMap mediante el extracto estructurado de farmshops.eu. "
        "No constituye una certificación oficial de proximidad; revisar editorialmente antes de publicar.\n\n"
        "Licencia de datos: Open Database License 1.0; conservar atribución a OpenStreetMap contributors.\n",
        encoding="utf-8",
    )
    print(json.dumps(quality, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
