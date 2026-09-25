#!/usr/bin/env python3
"""
Find, normalize and curate producer gallery photo candidates from official websites.

Discovers authentic photos of the producer's workshop, farm, people, and products.
Generates an HTML contact sheet and candidate bundle for visual human review.
Applies reviewed photos to `public/productores/<country>/content/<producer_id>/<sha256>.webp`
and updates `data/content/<country>/<producer_id>.json`.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
import unicodedata
from dataclasses import asdict, dataclass
from html import escape
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

try:
    from PIL import Image, ImageOps
    import requests
    from bs4 import BeautifulSoup
except ModuleNotFoundError as exc:
    missing = exc.name or "a required Python package"
    print(
        f"Missing dependency: {missing}. Install image tooling with "
        "`python3 -m pip install -r scripts/requirements-image-tools.txt`.",
        file=sys.stderr,
    )
    sys.exit(2)

# Dynamically import pure network, CSV and URL helpers from enrich-producer-images.py
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
ENRICH_IMAGES_SCRIPT = SCRIPT_DIR / "enrich-producer-images.py"

_spec = importlib.util.spec_from_file_location("enrich_producer_images", ENRICH_IMAGES_SCRIPT)
_enrich = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = _enrich
_spec.loader.exec_module(_enrich)

# Constants & Policy
MAX_LONG_EDGE = 1600
MIN_DIMENSION = 300
WEBP_QUALITY = 90
MAX_SUBPAGES_PER_SITE = 5
MAX_IMAGE_DOWNLOADS_PER_PRODUCER = 30
MAX_RETAINED_PER_PRODUCER = 15
MAX_GALLERY_PHOTOS_PER_PRODUCER = 5

SUBPAGE_KEYWORDS = (
    # About / story
    "nosotros", "qui-som", "quisom", "quienes-somos", "sobre-nosotros", "historia",
    "nostra-historia", "conoce-nuestra-historia", "empresa", "projecte", "el-nostre-projecte",
    # Production / workshop
    "obrador", "l-obrador", "lobrador", "obradors", "fabrica", "la-fabrica", "instalaciones",
    "instalacions", "elaboracio", "com-ho-fem", "como-lo-hacemos",
    # Specific artisanal facilities
    "formatgeria", "queseria", "bodega", "celler", "vinya", "vinedos", "almendros",
    "almazara", "lagar", "forn", "panaderia", "molino", "hort", "huerto", "granja",
    # Photos / products
    "galeria", "fotos", "galeria-de-fotos", "galeria-fotos", "media", "press", "prensa", "premsa",
    "productos", "productes", "cervesa", "cervezas", "embutidos", "quesos", "carta", "tienda",
)

JUNK_HINTS = (
    "logo", "icon", "banner-cookie", "cookie", "avatar", "flag", "bandera",
    "payment", "visa", "mastercard", "paypal", "cart", "carrito", "whatsapp",
    "instagram", "facebook", "twitter", "tripadvisor", "kitdigital", "kit-digital",
    "loading", "placeholder", "pixel", "blank", "spacer", "badge", "rating",
    "star-", "stars-", "separator", "divider", "arrow", "bullet",
    "medalla", "medal", "fotolia", "shutterstock", "istock", "gettyimages", "adobestock"
)


@dataclass
class CandidatePhoto:
    candidate_id: str
    url: str
    source_page: str
    alt: str
    width: int
    height: int
    ratio: float
    sha256: str
    raw_webp: bytes


def is_junk_asset(url: str, alt: str = "", primary_imagen: str = "") -> bool:
    u = unquote(urlparse(url).path).lower()
    a = alt.lower()
    if u.endswith(".svg") or urlparse(url).scheme not in {"http", "https"}:
        return True
    if primary_imagen and Path(u).name.split("?")[0] in primary_imagen:
        return True
    for j in JUNK_HINTS:
        if j in u or j in a:
            return True
    return False


def discover_subpages(soup: BeautifulSoup, base_url: str) -> list[str]:
    parsed_base = urlparse(base_url)
    subpages = []
    seen = {base_url.rstrip("/")}
    for a in soup.find_all("a", href=True):
        href = a["href"].split("#")[0].split("?")[0].rstrip("/")
        full = urljoin(base_url, href).rstrip("/")
        parsed = urlparse(full)
        if parsed.netloc != parsed_base.netloc:
            continue
        path_lower = parsed.path.lower()
        text_lower = a.get_text(strip=True).lower()
        if full in seen:
            continue
        if any(k in path_lower or k in text_lower for k in SUBPAGE_KEYWORDS):
            seen.add(full)
            subpages.append(full)
    # Prefer context and press photographs before large product menus.
    subpages.sort(key=lambda u: any(k in urlparse(u).path.lower() for k in ("producto", "producte", "tienda", "shop")))
    return subpages[:MAX_SUBPAGES_PER_SITE]


def normalize_photo(image_bytes: bytes) -> tuple[int, int, bytes] | None:
    try:
        with Image.open(BytesIO(image_bytes)) as img:
            # Correct EXIF orientation and convert to RGB
            img = ImageOps.exif_transpose(img)
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                rgb = Image.new("RGB", img.size, (255, 255, 255))
                rgba = img.convert("RGBA")
                rgb.paste(rgba, mask=rgba.getchannel("A"))
                img = rgb
            elif img.mode != "RGB":
                img = img.convert("RGB")

            w, h = img.size
            if w < MIN_DIMENSION or h < MIN_DIMENSION:
                return None
            ratio = w / h
            if ratio < 0.25 or ratio > 4.0:
                return None

            # Downscale if long edge exceeds MAX_LONG_EDGE (maintaining honest aspect ratio)
            long_edge = max(w, h)
            if long_edge > MAX_LONG_EDGE:
                scale = MAX_LONG_EDGE / long_edge
                new_w = int(round(w * scale))
                new_h = int(round(h * scale))
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                w, h = new_w, new_h

            buf = BytesIO()
            img.save(buf, "WEBP", quality=WEBP_QUALITY)
            return w, h, buf.getvalue()
    except Exception:
        return None


def clean_alt_text(alt: str, url: str) -> str:
    cleaned = alt.strip()
    if not cleaned or cleaned.lower() in ("og:image", "imagen", "foto", "image", "banner", "photo"):
        # Derive from filename stem
        stem = Path(urlparse(url).path).stem
        # Strip resizer, camera and CMS suffixes
        stem = re.sub(r"-(?:scaled|enhanced|min|crop|\d+x\d+|e\d+).*", "", stem, flags=re.I)
        stem = re.sub(r"\.(?:remini|jpg|jpeg|png|webp|avif).*", "", stem, flags=re.I)
        stem = re.sub(r"[-_]+", " ", stem).strip()
        stem = re.sub(r"^(?:img|dsc|foto|image|banner|\d+)\s*", "", stem, flags=re.I).strip()
        stem = re.sub(r"[-_\s]+\d+$", "", stem).strip()
        if len(stem) > 3 and not stem.isdigit():
            cleaned = stem.capitalize()
        else:
            cleaned = ""
    # Strip HTML tags or extra whitespace
    cleaned = re.sub(r"<[^>]+>", "", cleaned).strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned[:160]


def make_item_id(prefix: str, existing_ids: set[str]) -> str:
    normalized = unicodedata.normalize("NFKD", prefix.lower()).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    slug = slug[:40]
    if not slug or not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", slug):
        slug = "foto"
    cand_id = slug
    counter = 1
    while cand_id in existing_ids:
        counter += 1
        cand_id = f"{slug}-{counter}"
    existing_ids.add(cand_id)
    return cand_id


def extract_images_from_soup(
    soup: BeautifulSoup,
    page_url: str,
    primary_imagen: str = "",
) -> list[tuple[str, str, str]]:
    results: list[tuple[str, str, str]] = []
    seen: set[str] = set()

    def add(u: str, alt_text: str):
        full = urljoin(page_url, u).split("#")[0]
        if full not in seen and not is_junk_asset(full, alt_text, primary_imagen):
            seen.add(full)
            results.append((full, alt_text, page_url))

    # 1. OpenGraph image
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        add(og["content"], "og:image")

    # 2. Picture tags with source elements
    for picture in soup.find_all("picture"):
        for source in picture.find_all("source"):
            srcset = source.get("srcset") or source.get("data-srcset")
            cand = _enrich.pick_largest_srcset_url(srcset)
            if cand:
                img_child = picture.find("img")
                alt_text = (img_child.get("alt") if img_child else "") or ""
                add(cand, alt_text)

    # 3. Standard images with lazy-loading attributes
    for img in soup.find_all("img"):
        src = (
            img.get("data-large_image")
            or img.get("data-full-url")
            or img.get("data-orig-file")
            or _enrich.pick_largest_srcset_url(img.get("data-srcset") or img.get("srcset"))
            or img.get("data-src")
            or img.get("data-lazy-src")
            or img.get("data-original")
            or img.get("src")
        )
        if src:
            add(src, img.get("alt", "").strip())

    # 4. Background images in CSS style
    for tag in soup.find_all(style=re.compile(r"background(?:-image)?\s*:", re.I)):
        style = tag.get("style", "")
        for match in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", style, re.I):
            bg_url = match.group(1).strip()
            if bg_url and not bg_url.startswith("data:"):
                add(bg_url, "")

    return results


def sweep_producer_gallery(
    row: dict[str, str],
    session: requests.Session,
    timeout: float = 6.0,
) -> list[CandidatePhoto]:
    web = (row.get("web") or "").strip()
    if not web:
        return []

    primary_imagen = (row.get("imagen") or "").strip()
    home_resp, error = _enrich.fetch_home(session, web, timeout)
    if home_resp is None:
        print(f"  Homepage unavailable: {error}", file=sys.stderr)
        return []
    resolved_home = home_resp.url

    home_soup = BeautifulSoup(home_resp.text, "html.parser")
    subpages = [resolved_home] + discover_subpages(home_soup, resolved_home)

    page_images: list[list[tuple[str, str, str]]] = []
    seen_urls: set[str] = set()

    for page_url in subpages:
        try:
            if page_url != resolved_home:
                pr, error = _enrich.bounded_get(session, page_url, _enrich.DEFAULT_HEADERS, timeout, _enrich.MAX_HTML_BYTES)
                if pr is None or pr.status_code != 200:
                    continue
                page_url = pr.url
                soup = BeautifulSoup(pr.text, "html.parser")
            else:
                soup = home_soup
        except Exception:
            continue

        fresh = []
        for u, alt, src_page in extract_images_from_soup(soup, page_url, primary_imagen):
            if u not in seen_urls:
                seen_urls.add(u)
                fresh.append((u, alt, src_page))
        page_images.append(fresh)

    # Round-robin pages so a homepage shop cannot consume the entire budget.
    all_raw_images = [items[i] for i in range(max(map(len, page_images), default=0))
                      for items in page_images if i < len(items)]
    candidates: list[CandidatePhoto] = []
    idx = 1
    for u, alt, page_url in all_raw_images[:MAX_IMAGE_DOWNLOADS_PER_PRODUCER]:
        try:
            raw, _, error = _enrich.fetch_bytes(u, timeout, _enrich.PageContext(session, page_url))
            if raw is None:
                continue
            normalized = normalize_photo(raw)
            if not normalized:
                continue

            w, h, webp_bytes = normalized
            ratio = round(w / h, 2)
            sha = hashlib.sha256(webp_bytes).hexdigest()

            # Skip duplicates within the same sweep
            if any(c.sha256 == sha for c in candidates):
                continue

            cand = CandidatePhoto(
                candidate_id=f"cand-{idx:02d}",
                url=u,
                source_page=page_url,
                alt=clean_alt_text(alt, u),
                width=w,
                height=h,
                ratio=ratio,
                sha256=sha,
                raw_webp=webp_bytes,
            )
            candidates.append(cand)
            idx += 1
        except Exception:
            continue

    # Resolution is only a review order, never evidence of identity or rights.
    candidates.sort(key=lambda c: c.width * c.height, reverse=True)
    for i, c in enumerate(candidates, start=1):
        c.candidate_id = f"cand-{i:02d}"

    return candidates[:MAX_RETAINED_PER_PRODUCER]


def render_html_contact_sheet(sweeps: list[dict], output_path: Path) -> None:
    html = ["""<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gallery review</title><style>
body{font:16px system-ui;max-width:1400px;margin:auto;padding:16px;background:#fbf9f5}
section{margin-bottom:40px} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px}
figure{margin:0;padding:12px;background:white;min-width:0}img{width:100%;height:220px;object-fit:contain}
code, a, figcaption{overflow-wrap:anywhere}textarea{box-sizing:border-box;width:100%;height:7em}
</style><h1>Gallery review</h1><p>Review identity, image rights, visible content and credit.
Suggestions are unreviewed; select up to five photographs. Decisions use the full digest.</p>"""]
    for entry in sweeps:
        p = entry["producer"]
        html.append(f'<section><h2>{p["producer_id"]} · {escape(p["name"])}</h2>'
                    f'<a href="{escape(p["web"], quote=True)}">Official source</a><div class="grid">')
        for c in entry["candidates"]:
            relative = f'{p["producer_id"]}/{c["sha256"]}.webp'
            decision = f'{p["producer_id"]} {c["sha256"]} {json.dumps(c["alt"], ensure_ascii=False)}'
            html.append(f'<figure><img src="{relative}" alt="{escape(c["alt"], quote=True)}" loading="lazy">'
                        f'<figcaption>{escape(c["candidate_id"])} · {c["width"]} × {c["height"]}<br>'
                        f'<a href="{escape(c["source_page"], quote=True)}">Source page</a> · '
                        f'<a href="{escape(c["url"], quote=True)}">Original image</a>'
                        f'<textarea readonly>{escape(decision)}</textarea></figcaption></figure>')
        html.append('</div>' + ('' if entry['candidates'] else '<p>No usable candidates; inspect the source manually.</p>') + '</section>')
    output_path.write_text("\n".join(html) + "</html>\n", encoding="utf-8")


def read_content_json(content_path: Path) -> dict[str, object] | None:
    if not content_path.exists():
        return None
    return json.loads(content_path.read_text(encoding="utf-8"))


def parse_decision_line(line: str) -> tuple[str, str, str] | None:
    if not line.strip() or line.lstrip().startswith("#"):
        return None
    parts = line.split(maxsplit=2)
    if len(parts) != 3 or not re.fullmatch(r"[1-9]\d*", parts[0]) or not re.fullmatch(r"[a-f0-9]{64}", parts[1]):
        raise ValueError('Use: <producer_id> <full sha256> "Reviewed alt text"')
    alt = json.loads(parts[2])
    if not isinstance(alt, str) or not alt.strip():
        raise ValueError("Every selection needs reviewed alt text.")
    return parts[0], parts[1], alt.strip()


def catalog_rows(root: Path, country: str, area: str | None = None) -> list[dict[str, str]]:
    rows = []
    for path in _enrich.list_csv_paths(root):
        if path.parts[-3] == country and (not area or path.stem == area):
            rows.extend(_enrich.read_csv(path)[1])
    return rows


def producer_binding(row: dict[str, str]) -> dict:
    return {"country": row["country"], "producer_id": int(row["producer_id"]),
            "name": row["nombre"], "slug": row["slug"], "region": row["region"],
            "area": row["area"], "municipality": row["municipio"], "web": row["web"]}


def content_revision(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else "absent"


def apply_decisions(decisions_path: Path, bundle_dir: Path, country: str = "es", locale: str = "es") -> None:
    manifest = json.loads((bundle_dir / "candidates.json").read_text(encoding="utf-8"))
    if not isinstance(manifest, dict) or manifest.get("version") != 1 or manifest.get("country") != country:
        raise ValueError("Incompatible bundle or country; run a fresh sweep.")
    entries = {str(e["producer"]["producer_id"]): e for e in manifest["producers"]}
    canonical = {r["producer_id"]: r for r in catalog_rows(REPO_ROOT, country)}
    decisions: dict[str, list[tuple[str, str]]] = {}
    for line in decisions_path.read_text(encoding="utf-8").splitlines():
        parsed = parse_decision_line(line)
        if parsed:
            pid, digest, alt = parsed
            decisions.setdefault(pid, []).append((digest, alt))
    prepared = []
    # Preflight every selection before writing any public file. Do not silently skip or truncate.
    for pid, selections in decisions.items():
        entry = entries.get(pid)
        if not entry or pid not in canonical or entry["producer"] != producer_binding(canonical[pid]):
            raise ValueError(f"Producer {pid} or its official source changed; run a fresh sweep.")
        content_path = REPO_ROOT / "data" / "content" / country / f"{pid}.json"
        revision = content_revision(content_path)
        if revision != entry["content_revision"]:
            raise ValueError(f"Content for {pid} changed since discovery; review a fresh bundle.")
        if len(selections) > MAX_GALLERY_PHOTOS_PER_PRODUCER or len({s[0] for s in selections}) != len(selections):
            raise ValueError(f"Select at most five distinct photos for {pid}.")
        existing = read_content_json(content_path)
        package = existing if existing is not None else {
            "version": 1, "country": country, "producer_id": int(pid),
            "products": [], "gallery": [], "links": [], "translations": [],
        }
        existing_ids = {item["id"] for item in package["gallery"]}
        existing_srcs = {item["src"] for item in package["gallery"]}
        candidates = {c["sha256"]: c for c in entry["candidates"]}
        assets = []
        for digest, alt in selections:
            c = candidates.get(digest)
            if not c:
                raise ValueError(f"Unknown reviewed digest for {pid}: {digest}")
            source = bundle_dir / pid / f"{digest}.webp"
            if not source.resolve().is_relative_to(bundle_dir.resolve()):
                raise ValueError("Candidate escapes the bundle.")
            raw = source.read_bytes()
            if hashlib.sha256(raw).hexdigest() != digest:
                raise ValueError(f"Reviewed bytes changed for {pid}: {digest}")
            with Image.open(BytesIO(raw)) as img:
                if img.format != "WEBP" or img.size != (c["width"], c["height"]):
                    raise ValueError(f"Candidate dimensions or format changed for {pid}.")
            src = f"/productores/{country}/content/{pid}/{digest}.webp"
            dest = REPO_ROOT / "public" / src.lstrip("/")
            if not dest.resolve().is_relative_to((REPO_ROOT / "public").resolve()):
                raise ValueError("Asset escapes public/.")
            if dest.exists() and dest.read_bytes() != raw:
                raise ValueError(f"Conflicting existing asset: {dest}")
            if src in existing_srcs:
                continue
            assets.append((dest, raw))
            package["gallery"].append({
                "id": make_item_id(alt, existing_ids), "src": src, "alt": alt,
                "caption": "", "locale": locale, "width": c["width"], "height": c["height"],
                "credit": f"Web oficial de {entry['producer']['name']}",
            })
        if assets:
            prepared.append((pid, package, revision, assets))
    for pid, package, revision, assets in prepared:
        created = []
        try:
            for dest, raw in assets:
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not dest.exists():
                    with dest.open("xb") as handle:
                        handle.write(raw)
                    created.append((dest, raw))
            draft = bundle_dir / pid / "reviewed.json"
            draft.write_text(json.dumps(package, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            # Reuse the owner: schema, identity, references, assets, dirty-path and revision checks, lock and atomic write.
            subprocess.run(["pnpm", "producer:content", "apply", str(draft.resolve()), "--expect", revision],
                           check=True, cwd=REPO_ROOT)
        except Exception:
            for dest, raw in created:
                if dest.exists() and dest.read_bytes() == raw:
                    dest.unlink()
            raise
        print(f"Applied {len(assets)} reviewed photos to {pid}; existing content retained.")


def country_gallery_inventory(root: Path, country: str, area_filter: str | None = None) -> dict[str, object]:
    csv_paths = _enrich.list_csv_paths(root)
    if country:
        csv_paths = [p for p in csv_paths if p.parts[-3] == country]
    if area_filter:
        csv_paths = [p for p in csv_paths if p.stem == area_filter]

    total_producers = 0
    with_web = 0
    with_gallery = 0
    gallery_photos = 0
    distribution = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "6+": 0}

    for p in csv_paths:
        c_code = p.parts[-3]
        _, rows, _, _ = _enrich.read_csv(p)
        for r in rows:
            pid = r.get("producer_id", "").strip()
            if not pid:
                continue
            total_producers += 1
            if r.get("web", "").strip():
                with_web += 1
            content_path = root / "data" / "content" / c_code / f"{pid}.json"
            content = read_content_json(content_path)
            count = len(content.get("gallery", [])) if content else 0
            if count > 0:
                with_gallery += 1
                gallery_photos += count
            if count in distribution:
                distribution[count] += 1
            elif count > 5:
                distribution["6+"] += 1

    return {
        "country": country,
        "area": area_filter or "all",
        "total_producers": total_producers,
        "with_website": with_web,
        "with_gallery": with_gallery,
        "coverage_percent": round((with_gallery / total_producers * 100), 2) if total_producers else 0.0,
        "total_gallery_photos": gallery_photos,
        "distribution_by_photo_count": distribution,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Discover gallery photographs for review; append explicit reviewed selections.")
    parser.add_argument("--country", default="es")
    parser.add_argument("--area", help="Optional area; required for sweeps without producer IDs")
    parser.add_argument("--municipality")
    parser.add_argument("--producer-id", type=int, action="append", help="Repeat for a cross-area selection")
    parser.add_argument("--slug")
    parser.add_argument("--contact-sheet", help="New, empty directory for the review bundle")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--decisions")
    parser.add_argument("--from", dest="from_dir")
    parser.add_argument("--locale", default="es", help="Language of reviewed alt text (apply only)")
    parser.add_argument("--inventory", action="store_true")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z]{2}", args.country):
        parser.error("--country must be a two-letter catalog country.")
    if args.inventory:
        print(json.dumps(country_gallery_inventory(REPO_ROOT, args.country, args.area), indent=2, ensure_ascii=False))
        return 0
    if args.apply:
        if not args.decisions or not args.from_dir:
            parser.error("--apply requires --decisions and --from.")
        apply_decisions(Path(args.decisions), Path(args.from_dir), args.country, args.locale)
        return 0
    if not args.contact_sheet or not (args.area or args.producer_id):
        parser.error("A sweep requires --contact-sheet and --area or --producer-id.")
    rows = catalog_rows(REPO_ROOT, args.country, args.area)
    if args.producer_id:
        wanted = {str(pid) for pid in args.producer_id}
        rows = [r for r in rows if r["producer_id"] in wanted]
        if wanted != {r["producer_id"] for r in rows}:
            parser.error("Some producer IDs were not found in the selected country/area.")
    rows = [r for r in rows if (not args.slug or r["slug"] == args.slug)
            and (not args.municipality or r["municipio"].casefold() == args.municipality.casefold())]
    if not rows:
        parser.error("No producers match the selection.")
    sheet_dir = Path(args.contact_sheet)
    if sheet_dir.exists() and any(sheet_dir.iterdir()):
        parser.error("Use a new empty bundle directory so previous review decisions cannot change meaning.")
    sheet_dir.mkdir(parents=True, exist_ok=True)
    sweeps = []
    template = ['# Review identity, rights, alt text and credit before applying.', '# <producer_id> <full sha256> "Alt text"']
    for row in rows:
        p = producer_binding(row)
        pid = str(p["producer_id"])
        print(f"Scanning [{pid}] {p['name']} ({p['web'] or 'no website'})...", flush=True)
        with requests.Session() as session:
            session.trust_env = False
            candidates = sweep_producer_gallery(row, session)
        print(f"  {len(candidates)} candidates.", flush=True)
        directory = sheet_dir / pid
        directory.mkdir()
        data = []
        for c in candidates:
            (directory / f"{c.sha256}.webp").write_bytes(c.raw_webp)
            metadata = asdict(c)
            metadata.pop("raw_webp")
            data.append(metadata)
            template.append(f'# {pid} {c.sha256} {json.dumps(c.alt, ensure_ascii=False)}')
        sweeps.append({"producer": p, "content_revision": content_revision(REPO_ROOT / "data/content" / args.country / f"{pid}.json"),
                       "candidates": data})
        # Retain completed work even if a later website is interrupted.
        (sheet_dir / "candidates.json").write_text(json.dumps({"version": 1, "country": args.country, "producers": sweeps}, indent=2, ensure_ascii=False) + "\n")
    (sheet_dir / "decisions.template.txt").write_text("\n".join(template) + "\n", encoding="utf-8")
    render_html_contact_sheet(sweeps, sheet_dir / "index.html")
    print(f"Review bundle: {sheet_dir.resolve()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
