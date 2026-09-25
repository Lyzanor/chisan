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
import os
import re
import subprocess
import sys
import unicodedata
from dataclasses import asdict, dataclass
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
MIN_SCHEMA_DIMENSION = 200
WEBP_QUALITY = 90
MAX_SUBPAGES_PER_SITE = 5
MAX_IMAGE_CANDIDATES_PER_PAGE = 30
MAX_RETAINED_PER_PRODUCER = 15
MAX_GALLERY_PHOTOS_PER_PRODUCER = 5

SUBPAGE_KEYWORDS = (
    # About / story
    "nosotros", "qui-som", "quisom", "quienes-somos", "sobre-nosotros", "historia",
    "nostra-historia", "conoce-nuestra-historia", "projecte", "el-nostre-projecte",
    # Production / workshop
    "obrador", "l-obrador", "lobrador", "obradors", "fabrica", "la-fabrica", "instalaciones",
    "instalacions", "elaboracion", "com-ho-fem", "como-lo-hacemos",
    # Specific artisanal facilities
    "formatgeria", "queseria", "bodega", "celler", "vinya", "vinedos", "almendros",
    "almazara", "lagar", "forn", "panaderia", "molino", "hort", "huerto", "granja",
    # Photos / products
    "galeria", "fotos", "galeria-de-fotos", "galeria-fotos",
    "productos", "productes", "cervesa", "cervezas", "embutidos", "quesos", "carta", "tienda",
)

JUNK_HINTS = (
    "logo", "icon", "banner-cookie", "cookie", "avatar", "flag", "bandera",
    "payment", "visa", "mastercard", "paypal", "cart", "carrito", "whatsapp",
    "instagram", "facebook", "twitter", "tripadvisor", "kitdigital", "kit-digital",
    "loading", "placeholder", "pixel", "blank", "spacer", "badge", "rating",
    "star-", "stars-", "separator", "divider", "arrow", "bullet"
)


@dataclass
class CandidatePhoto:
    candidate_id: str
    url: str
    source_page: str
    alt: str
    original_width: int
    original_height: int
    width: int
    height: int
    ratio: float
    sha256: str
    raw_webp: bytes


def is_junk_asset(url: str, alt: str = "", primary_imagen: str = "") -> bool:
    u = url.lower()
    a = alt.lower()
    if u.endswith(".svg") or u.startswith("data:"):
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
        full = urljoin(base_url, href)
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
            if len(subpages) >= MAX_SUBPAGES_PER_SITE:
                break
    return subpages


def normalize_photo(image_bytes: bytes) -> tuple[int, int, bytes] | None:
    try:
        with Image.open(BytesIO(image_bytes)) as img:
            # Correct EXIF orientation and convert to RGB
            img = ImageOps.exif_transpose(img)
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                rgb = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "RGBA":
                    rgb.paste(img, mask=img.split()[3])
                else:
                    rgb.paste(img.convert("RGBA"))
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
            or img.get("src")
            or img.get("data-src")
            or img.get("data-lazy-src")
            or img.get("data-original")
        )
        if not src:
            srcset = img.get("srcset") or img.get("data-srcset")
            src = _enrich.pick_largest_srcset_url(srcset)
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
    home_urls = _enrich.home_variants(web)

    home_resp = None
    resolved_home = None
    for target in home_urls:
        try:
            err = _enrich.public_url_error(target)
            if err:
                continue
            r = session.get(target, timeout=timeout, headers=_enrich.DEFAULT_HEADERS)
            if r.status_code == 200:
                home_resp = r
                resolved_home = target
                break
        except Exception:
            continue

    if not home_resp or not resolved_home:
        return []

    home_soup = BeautifulSoup(home_resp.text, "html.parser")
    subpages = [resolved_home] + discover_subpages(home_soup, resolved_home)

    all_raw_images: list[tuple[str, str, str]] = []
    seen_urls: set[str] = set()

    for page_url in subpages:
        try:
            if page_url != resolved_home:
                pr = session.get(page_url, timeout=timeout, headers=_enrich.DEFAULT_HEADERS)
                if pr.status_code != 200:
                    continue
                soup = BeautifulSoup(pr.text, "html.parser")
            else:
                soup = home_soup
        except Exception:
            continue

        for u, alt, src_page in extract_images_from_soup(soup, page_url, primary_imagen):
            if u not in seen_urls:
                seen_urls.add(u)
                all_raw_images.append((u, alt, src_page))

    candidates: list[CandidatePhoto] = []
    idx = 1
    for u, alt, page_url in all_raw_images[:MAX_IMAGE_CANDIDATES_PER_PAGE]:
        try:
            err = _enrich.public_url_error(u)
            if err:
                continue
            ir = session.get(u, timeout=timeout, headers=_enrich.IMAGE_HEADERS)
            if ir.status_code != 200:
                continue

            normalized = normalize_photo(ir.content)
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
                original_width=w,
                original_height=h,
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

    # Sort by pixel count (highest resolution and clearest photos first)
    candidates.sort(key=lambda c: c.width * c.height, reverse=True)
    for i, c in enumerate(candidates, start=1):
        c.candidate_id = f"cand-{i:02d}"

    return candidates[:MAX_RETAINED_PER_PRODUCER]


def render_html_contact_sheet(
    sweeps: list[dict[str, object]],
    output_path: Path,
) -> None:
    html = [
        "<!DOCTYPE html>",
        '<html lang="es">',
        "<head>",
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        "  <title>Chisan · Hojas de contacto para galería</title>",
        "  <style>",
        "    :root {",
        "      --bg: #FBF9F5;",
        "      --card-bg: #FFFFFF;",
        "      --text: #21201C;",
        "      --text-muted: #6E6B65;",
        "      --border: #E8E5DF;",
        "      --primary: #C85A32;",
        "    }",
        "    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; line-height: 1.4; }",
        "    .container { max-width: 1400px; margin: 0 auto; }",
        "    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }",
        "    .lead { color: var(--text-muted); margin-bottom: 2rem; }",
        "    .producer-block { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 2.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }",
        "    .producer-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.25rem; }",
        "    .producer-title { font-size: 1.35rem; font-weight: 700; margin: 0; }",
        "    .producer-meta { font-size: 0.875rem; color: var(--text-muted); }",
        "    .producer-meta a { color: var(--primary); text-decoration: none; }",
        "    .producer-meta a:hover { text-decoration: underline; }",
        "    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }",
        "    .photo-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #FAFAFA; display: flex; flex-direction: column; }",
        "    .photo-frame { aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center; background: #ECEAE4; overflow: hidden; position: relative; }",
        "    .photo-frame img { max-width: 100%; max-height: 100%; object-fit: contain; }",
        "    .photo-info { padding: 0.85rem; font-size: 0.825rem; display: flex; flex-direction: column; gap: 0.35rem; flex-grow: 1; }",
        "    .cand-id { font-weight: 700; font-size: 0.9rem; color: var(--text); }",
        "    .cand-dims { color: var(--text-muted); font-size: 0.775rem; font-family: monospace; }",
        "    .cand-alt { font-style: italic; color: #4A4843; margin-top: auto; }",
        "    .cand-url { color: #8C8880; font-size: 0.72rem; word-break: break-all; }",
        "    .decisions-section { margin-top: 1.5rem; background: #F3F1EC; border-radius: 8px; padding: 1rem; }",
        "    .decisions-section summary { font-weight: 600; cursor: pointer; }",
        "    .decisions-box { width: 100%; height: 90px; margin-top: 0.75rem; font-family: monospace; font-size: 0.8rem; background: #FFF; border: 1px solid var(--border); border-radius: 6px; padding: 0.5rem; box-sizing: border-box; }",
        "  </style>",
        "</head>",
        "<body>",
        '  <div class="container">',
        "    <h1>Chisan · Hojas de contacto para galería fotográfica</h1>",
        '    <p class="lead">Candidatas extraídas de la web oficial de los productores. Revisa visualmente las fotos para seleccionar hasta 5 fotografías honestas (obrador, campo, personas y producto).</p>',
    ]

    for item in sweeps:
        p = item["producer"]
        candidates = item["candidates"]
        html.append('    <article class="producer-block">')
        html.append('      <div class="producer-header">')
        html.append(f'        <div><h2 class="producer-title">[{p["producer_id"]}] {p["name"]}</h2><span class="producer-meta">{p["municipality"]} · slug: <code>{p["slug"]}</code></span></div>')
        html.append(f'        <div class="producer-meta"><a href="{p["web"]}" target="_blank" rel="noopener">Abrir web oficial &nearr;</a></div>')
        html.append("      </div>")

        if not candidates:
            html.append('      <p style="color: var(--text-muted); font-style: italic;">No se han encontrado candidatos de foto con dimensiones suficientes en este sitio.</p>')
        else:
            html.append('      <div class="gallery-grid">')
            for c in candidates:
                local_rel_path = f"{p['slug']}/{c['candidate_id']}_{c['sha256'][:10]}.webp"
                alt_display = c["alt"] if c["alt"] else '<span style="color:#A09D96;">(sin texto alternativo)</span>'
                html.append('        <div class="photo-card">')
                html.append(f'          <div class="photo-frame"><img src="{local_rel_path}" alt="{c["alt"]}" loading="lazy"></div>')
                html.append('          <div class="photo-info">')
                html.append(f'            <div class="cand-id">{c["candidate_id"]}</div>')
                html.append(f'            <div class="cand-dims">{c["width"]}&times;{c["height"]} px &middot; r={c["ratio"]} &middot; {c["sha256"][:12]}…</div>')
                html.append(f'            <div class="cand-alt">Alt: {alt_display}</div>')
                html.append(f'            <div class="cand-url">{c["url"]}</div>')
                html.append("          </div>")
                html.append("        </div>")
            html.append("      </div>")

            # Decisions helper box
            lines = []
            for c in candidates:
                alt = c["alt"] or f"Foto de {p['name']}"
                lines.append(f'{p["producer_id"]} {c["candidate_id"]} "{alt}"')
            lines_str = "\n".join(lines)
            html.append('      <details class="decisions-section">')
            html.append("        <summary>Plantilla de decisiones para este productor (copiar a decisions.txt)</summary>")
            html.append(f'        <textarea class="decisions-box" readonly onclick="this.select()">{lines_str}</textarea>')
            html.append("      </details>")

        html.append("    </article>")

    html.extend([
        "  </div>",
        "</body>",
        "</html>",
    ])
    output_path.write_text("\n".join(html), encoding="utf-8")


def read_content_json(content_path: Path) -> dict[str, object] | None:
    if not content_path.exists():
        return None
    try:
        return json.loads(content_path.read_text(encoding="utf-8"))
    except Exception:
        return None


def parse_decision_line(line: str) -> tuple[str, str, str] | None:
    """Parse one decision line into (producer_id, candidate_id_or_sha, alt_text)."""
    stripped = line.strip()
    if not stripped or stripped.startswith("#"):
        return None
    # Format: <producer_id> <candidate_id_or_sha> [optional role] "<alt>"
    m = re.match(r"^(\d+)\s+([a-zA-Z0-9_\-]+)(?:\s+(?:cover|gallery))?\s*\"([^\"]*)\"", stripped)
    if m:
        return m.group(1), m.group(2), m.group(3).strip()
    parts = stripped.split(maxsplit=2)
    if len(parts) < 2:
        return None
    pid = parts[0]
    cid = parts[1]
    alt = parts[2].strip("\"' ") if len(parts) > 2 else ""
    return pid, cid, alt


def apply_decisions(
    decisions_path: Path,
    bundle_dir: Path,
    country: str = "es",
    replace: bool = False,
) -> None:
    manifest_path = bundle_dir / "candidates.json"
    if not manifest_path.exists():
        raise ValueError(f"Manifest not found in {bundle_dir}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    # Map: (str(producer_id), cand_id_or_sha) -> candidate info
    cand_lookup = {}
    producer_lookup = {}
    for entry in manifest:
        p = entry["producer"]
        pid = str(p["producer_id"])
        producer_lookup[pid] = p
        for c in entry["candidates"]:
            cand_lookup[(pid, c["candidate_id"])] = (p, c)
            cand_lookup[(pid, c["sha256"])] = (p, c)
            cand_lookup[(pid, c["sha256"][:10])] = (p, c)

    lines = [
        line.strip() for line in decisions_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    if not lines:
        print("No active decision lines found in file.")
        return

    producer_decisions: dict[str, list[tuple[str, str]]] = {}
    for line in lines:
        parsed = parse_decision_line(line)
        if not parsed:
            continue
        pid, cid, alt = parsed
        if (pid, cid) not in cand_lookup:
            print(f"Warning: candidate {cid} for producer {pid} not found in bundle. Skipping.")
            continue
        producer_decisions.setdefault(pid, []).append((cid, alt))

    public_root = REPO_ROOT / "public" / "productores" / country / "content"

    for pid, raw_selections in producer_decisions.items():
        # Select at most MAX_GALLERY_PHOTOS_PER_PRODUCER
        selections = raw_selections[:MAX_GALLERY_PHOTOS_PER_PRODUCER]
        p = producer_lookup[pid]
        producer_id_int = int(pid)
        dest_asset_dir = public_root / pid
        dest_asset_dir.mkdir(parents=True, exist_ok=True)

        content_path = REPO_ROOT / "data" / "content" / country / f"{pid}.json"
        content_path.parent.mkdir(parents=True, exist_ok=True)
        existing = read_content_json(content_path)
        if not existing:
            package = {
                "version": 1,
                "country": country,
                "producer_id": producer_id_int,
                "products": [],
                "gallery": [],
                "links": [],
                "translations": [],
            }
        else:
            package = existing

        gallery_items = [] if replace else list(package.get("gallery", []))
        existing_srcs = {item["src"] for item in gallery_items}
        existing_ids = {item["id"] for item in gallery_items}

        added_photos = []

        for cid, custom_alt in selections:
            _, c = cand_lookup[(pid, cid)]
            sha = c["sha256"]
            asset_filename = f"{sha}.webp"
            public_src = f"/productores/{country}/content/{pid}/{asset_filename}"

            # Copy asset if not already in public/
            dest_file = dest_asset_dir / asset_filename
            src_file = bundle_dir / p["slug"] / f"{c['candidate_id']}_{sha[:10]}.webp"
            if not dest_file.exists():
                if src_file.exists():
                    dest_file.write_bytes(src_file.read_bytes())
                else:
                    raise FileNotFoundError(f"Source file {src_file} missing from bundle")

            if public_src in existing_srcs:
                continue

            alt = custom_alt.strip() or c["alt"] or f"Foto de {p['name']}"
            base_id = c["alt"] or "foto"
            item_id = make_item_id(base_id, existing_ids)
            gallery_item = {
                "id": item_id,
                "src": public_src,
                "alt": alt,
                "caption": "",
                "locale": "es",
                "width": c["width"],
                "height": c["height"],
                "credit": f"Web oficial de {p['name']}",
            }
            added_photos.append(gallery_item)

        if replace:
            new_gallery = added_photos[:MAX_GALLERY_PHOTOS_PER_PRODUCER]
        else:
            new_gallery = (added_photos + [item for item in gallery_items if item["src"] not in {p["src"] for p in added_photos}])[:MAX_GALLERY_PHOTOS_PER_PRODUCER]

        package["gallery"] = new_gallery
        content_path.write_text(json.dumps(package, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Updated content for [{pid}] {p['name']} with {len(new_gallery)} gallery items.")

    # Run global content check once after all items are applied
    subprocess.run(["pnpm", "check:content"], check=True, cwd=REPO_ROOT)


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
    parser = argparse.ArgumentParser(description="Discover and curate producer gallery images from official websites.")
    parser.add_argument("--country", default="es", help="Country code (default: es)")
    parser.add_argument("--area", default=None, help="Catalog area name (default: all for inventory, barcelona for sweep)")
    parser.add_argument("--municipality", help="Optional municipality filter (e.g. 'Santa Coloma de Gramenet')")
    parser.add_argument("--producer-id", type=int, help="Optional specific producer ID")
    parser.add_argument("--slug", help="Optional specific producer slug")
    parser.add_argument("--contact-sheet", help="Directory path to write candidate contact sheet and bundle")
    parser.add_argument("--apply", action="store_true", help="Apply reviewed choices from --decisions")
    parser.add_argument("--decisions", help="Path to decisions file for --apply")
    parser.add_argument("--from", dest="from_dir", help="Path to contact sheet bundle directory for --apply")
    parser.add_argument("--replace", action="store_true", help="Replace existing gallery instead of merging")
    parser.add_argument("--auto-draft", action="store_true", help="Pre-generate draft.json for each swept producer")
    parser.add_argument("--inventory", action="store_true", help="Report inventory of gallery coverage")
    args = parser.parse_args()

    if args.inventory:
        inv = country_gallery_inventory(REPO_ROOT, args.country, args.area if args.area != "all" else None)
        print(json.dumps(inv, indent=2, ensure_ascii=False))
        return 0

    if args.apply:
        if not args.decisions or not args.from_dir:
            print("Error: --apply requires both --decisions <file> and --from <bundle_dir>.", file=sys.stderr)
            return 2
        apply_decisions(Path(args.decisions), Path(args.from_dir), args.country, replace=args.replace)
        return 0

    target_area = args.area or "barcelona"
    csv_path = _enrich.find_csv_path(REPO_ROOT, target_area, args.country)
    _, rows, _, _ = _enrich.read_csv(csv_path)

    filtered_rows = []
    for r in rows:
        if args.municipality and r.get("municipio", "").strip().lower() != args.municipality.strip().lower():
            continue
        if args.producer_id and r.get("producer_id", "").strip() != str(args.producer_id):
            continue
        if args.slug and r.get("slug", "").strip() != args.slug.strip():
            continue
        filtered_rows.append(r)

    print(f"Found {len(filtered_rows)} producers in {target_area}" + (f" ({args.municipality})" if args.municipality else ""))

    session = requests.Session()
    sweeps = []

    sheet_dir = Path(args.contact_sheet) if args.contact_sheet else None
    if sheet_dir:
        sheet_dir.mkdir(parents=True, exist_ok=True)

    decisions_template_lines = [
        "# Chisan Gallery Decisions Template",
        "#",
        "# Format: <producer_id> <candidate_id> \"Alt text description\"",
        f"# Maximum {MAX_GALLERY_PHOTOS_PER_PRODUCER} photos per producer.",
        "# Copy or rename this file to decisions.txt, uncomment your selections, and run:",
        f"#   pnpm enrich:gallery --apply --decisions {sheet_dir}/decisions.txt --from {sheet_dir}",
        "#",
    ]

    for r in filtered_rows:
        pid = r.get("producer_id", "")
        name = r.get("nombre", "")
        slug = r.get("slug", "")
        mun = r.get("municipio", "")
        web = r.get("web", "")

        if not web:
            print(f"Skipping [{pid}] {name}: no website.")
            continue

        print(f"\nScanning [{pid}] {name} ({web})...")
        candidates = sweep_producer_gallery(r, session)
        print(f"  Found {len(candidates)} high-res candidate photos.")

        cand_data = []
        prod_dir = sheet_dir / slug if sheet_dir else None
        if prod_dir:
            prod_dir.mkdir(parents=True, exist_ok=True)

        decisions_template_lines.append(f"\n# [{pid}] {name} ({web})")
        for c in candidates:
            if prod_dir:
                dest = prod_dir / f"{c.candidate_id}_{c.sha256[:10]}.webp"
                dest.write_bytes(c.raw_webp)

            cand_dict = asdict(c)
            cand_dict.pop("raw_webp", None)
            cand_data.append(cand_dict)
            alt_str = c.alt or f"Foto de {name}"
            decisions_template_lines.append(f'# {pid} {c.candidate_id} "{alt_str}"')

        sweep_item = {
            "producer": {
                "producer_id": int(pid),
                "name": name,
                "slug": slug,
                "municipality": mun,
                "web": web,
            },
            "candidates": cand_data,
        }
        sweeps.append(sweep_item)

        if args.auto_draft and candidates and prod_dir:
            # Generate a draft package with up to MAX_GALLERY_PHOTOS_PER_PRODUCER photos
            existing_ids = set()
            draft_items = []
            for c in candidates[:MAX_GALLERY_PHOTOS_PER_PRODUCER]:
                base_id = c.alt or "foto"
                item_id = make_item_id(base_id, existing_ids)
                draft_items.append({
                    "id": item_id,
                    "src": f"/productores/{args.country}/content/{pid}/{c.sha256}.webp",
                    "alt": c.alt or f"Foto de {name}",
                    "caption": "",
                    "locale": "es",
                    "width": c.width,
                    "height": c.height,
                    "credit": f"Web oficial de {name}",
                })
            draft_pkg = {
                "version": 1,
                "country": args.country,
                "producer_id": int(pid),
                "products": [],
                "gallery": draft_items,
                "links": [],
                "translations": [],
            }
            (prod_dir / "draft.json").write_text(json.dumps(draft_pkg, indent=2, ensure_ascii=False) + "\n")

    if sheet_dir:
        (sheet_dir / "candidates.json").write_text(json.dumps(sweeps, indent=2, ensure_ascii=False) + "\n")
        (sheet_dir / "decisions.template.txt").write_text("\n".join(decisions_template_lines) + "\n", encoding="utf-8")
        render_html_contact_sheet(sweeps, sheet_dir / "index.html")
        print(f"\n==========================================")
        print(f"Sweep complete! Contact sheet generated at:")
        print(f"  {sheet_dir / 'index.html'}")
        print(f"Decisions template generated at:")
        print(f"  {sheet_dir / 'decisions.template.txt'}")
        print(f"Candidates manifest at:")
        print(f"  {sheet_dir / 'candidates.json'}")
        print(f"==========================================")

    return 0


if __name__ == "__main__":
    sys.exit(main())
