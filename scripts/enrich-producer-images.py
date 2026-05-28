#!/usr/bin/env python3
"""
Find and normalize producer logo assets from official producer websites.

Default mode is a dry run: it reports candidates and writes no CSV/assets.
Use --apply to save the first acceptable candidate and update the CSV.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
from dataclasses import asdict, dataclass
from io import BytesIO
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
    from PIL import Image, ImageFilter
except ModuleNotFoundError as exc:
    missing = exc.name or "a required Python package"
    print(
        f"Missing dependency: {missing}. Install image tooling with "
        "`python3 -m pip install -r scripts/requirements-image-tools.txt`.",
        file=sys.stderr,
    )
    sys.exit(2)

try:
    import cairosvg

    HAS_CAIROSVG = True
except ModuleNotFoundError:
    HAS_CAIROSVG = False


CANVAS_SIZE = (1600, 1200)
BACKGROUND_RGBA = (243, 240, 232, 255)
TARGET_LOGO_LONG_EDGE = 960
MAX_LOGO_UPSCALE = 3.0
MIN_SOURCE_LONG_EDGE = 200
MIN_ACCEPTED_LONG_EDGE = 64
WEBP_QUALITY = 90

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
}

BLOCKED_DOMAINS = {
    "alimentosdesegovia.es",
    "alimentosdezamora.info",
    "blogspot.com",
    "burgosalimenta.com",
    "burgosalimenta.es",
    "dotoro.com",
    "exquisiteza.es",
    "facebook.com",
    "gff.co.uk",
    "instagram.com",
    "linktr.ee",
    "quesozamorano.com",
    "sayago.com",
    "sites.google.com",
    "tiktok.com",
    "twitter.com",
    "wixsite.com",
    "wordpress.com",
    "x.com",
    "youtube.com",
}

LOGO_HINTS = ("logo", "brand", "marca", "logotipo", "imagotipo", "isotipo")
PHOTO_HINTS = ("hero", "banner", "slider", "background", "bg-", "cabecera", "portada")
BAD_ASSET_HINTS = ("sprite", "placeholder", "blank", "loader", "loading", "pixel")


@dataclass(frozen=True)
class Candidate:
    source: str
    url: str
    subject: str
    evidence: str
    score: int


def clean_cell(value: object) -> str:
    return str(value or "").strip()


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def normalize_url(base_url: str, raw_url: str | None) -> str | None:
    if not raw_url:
        return None

    raw_url = raw_url.strip()
    if not raw_url or raw_url.startswith("data:"):
        return None

    if raw_url.startswith("//"):
        raw_url = f"https:{raw_url}"

    url = urljoin(base_url, raw_url)
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return None
    return url


def host_matches(hostname: str, domain: str) -> bool:
    host = hostname.lower()
    return host == domain or host.endswith(f".{domain}")


def is_blocked_domain(url: str) -> bool:
    hostname = (urlparse(url).hostname or "").lower()
    return any(host_matches(hostname, domain) for domain in BLOCKED_DOMAINS)


def parsed_url_path(url: str) -> str:
    return unquote(urlparse(url).path).lower()


def path_contains_any(url: str, hints: Iterable[str]) -> bool:
    path = parsed_url_path(url)
    return any(hint in path for hint in hints)


def infer_subject(source: str, url: str, evidence: str = "") -> str:
    text = f"{parsed_url_path(url)} {evidence}".lower()
    if source in {"icon", "fallback-favicon", "logo-img"}:
        return "logo"
    if any(hint in text for hint in LOGO_HINTS):
        return "logo"
    if any(hint in text for hint in PHOTO_HINTS):
        return "photo"
    if source in {"og:image", "twitter:image"}:
        return "photo"
    return "unknown"


def score_candidate(source: str, url: str, subject: str) -> int:
    path = parsed_url_path(url)
    extension = Path(path).suffix
    score = 0

    if source == "logo-img":
        score = 105 if extension == ".svg" else 95 if extension in {".png", ".webp"} else 75
    elif source == "icon":
        score = 85 if "apple-touch" in path or "touch-icon" in path else 75
        if extension == ".svg":
            score += 5
    elif source == "og:image":
        score = 65 if subject == "logo" else 45
    elif source == "twitter:image":
        score = 60 if subject == "logo" else 40
    elif source == "fallback-favicon":
        score = 20 if extension != ".ico" else 10

    if subject == "logo":
        score += 10
    if path_contains_any(url, LOGO_HINTS):
        score += 5
    if path_contains_any(url, BAD_ASSET_HINTS):
        score -= 30
    if extension in {".ico", ".gif"}:
        score -= 5

    return score


def make_candidate(source: str, base_url: str, raw_url: str | None, evidence: str = "") -> Candidate | None:
    url = normalize_url(base_url, raw_url)
    if not url:
        return None

    subject = infer_subject(source, url, evidence)
    return Candidate(
        source=source,
        url=url,
        subject=subject,
        evidence=evidence,
        score=score_candidate(source, url, subject),
    )


def pick_largest_srcset_url(srcset: str | None) -> str | None:
    if not srcset:
        return None

    best_url = None
    best_score = -1.0
    for part in srcset.split(","):
        bits = part.strip().split()
        if not bits:
            continue
        url = bits[0]
        descriptor = bits[1] if len(bits) > 1 else ""
        score = 1.0
        if descriptor.endswith("w"):
            try:
                score = float(descriptor[:-1])
            except ValueError:
                score = 1.0
        elif descriptor.endswith("x"):
            try:
                score = float(descriptor[:-1]) * 1000
            except ValueError:
                score = 1.0
        if score > best_score:
            best_url = url
            best_score = score
    return best_url


def add_candidate(candidates: list[Candidate], seen: set[str], candidate: Candidate | None) -> None:
    if not candidate or candidate.url in seen:
        return
    seen.add(candidate.url)
    candidates.append(candidate)


def get_image_candidates(web_url: str, timeout: float) -> tuple[list[Candidate], str | None]:
    candidates: list[Candidate] = []
    seen: set[str] = set()

    try:
        response = requests.get(web_url, headers=DEFAULT_HEADERS, timeout=timeout)
        if response.status_code != 200:
            return [], f"HTTP {response.status_code}"
    except requests.RequestException as exc:
        return [], str(exc)

    soup = BeautifulSoup(response.text, "html.parser")
    base_url = response.url or web_url

    for attrs, source in (
        ({"property": "og:image"}, "og:image"),
        ({"property": "og:image:secure_url"}, "og:image"),
        ({"name": "twitter:image"}, "twitter:image"),
        ({"name": "twitter:image:src"}, "twitter:image"),
    ):
        tag = soup.find("meta", attrs=attrs)
        if tag and tag.get("content"):
            add_candidate(candidates, seen, make_candidate(source, base_url, tag["content"], str(attrs)))

    for link in soup.find_all("link"):
        rel = " ".join(link.get("rel") or []).lower()
        if "icon" not in rel and "apple-touch" not in rel:
            continue
        evidence = " ".join(filter(None, [rel, clean_cell(link.get("sizes"))]))
        add_candidate(candidates, seen, make_candidate("icon", base_url, link.get("href"), evidence))

    for img in soup.find_all("img"):
        image_bits = " ".join(
            clean_cell(img.get(attr))
            for attr in ("src", "class", "id", "alt", "title", "data-src", "data-lazy-src", "data-original")
        ).lower()
        if not any(hint in image_bits for hint in LOGO_HINTS):
            continue

        src = (
            pick_largest_srcset_url(img.get("srcset"))
            or img.get("src")
            or img.get("data-src")
            or img.get("data-lazy-src")
            or img.get("data-original")
        )
        evidence = " ".join(
            filter(
                None,
                [
                    clean_cell(img.get("class")),
                    clean_cell(img.get("id")),
                    clean_cell(img.get("alt")),
                    clean_cell(img.get("title")),
                ],
            )
        )
        add_candidate(candidates, seen, make_candidate("logo-img", base_url, src, evidence))

    parsed = urlparse(base_url)
    if parsed.scheme and parsed.netloc:
        add_candidate(
            candidates,
            seen,
            make_candidate("fallback-favicon", f"{parsed.scheme}://{parsed.netloc}/", "/favicon.ico", "default"),
        )

    candidates.sort(key=lambda candidate: candidate.score, reverse=True)
    return candidates, None


def fetch_bytes(url: str, timeout: float) -> tuple[bytes | None, str, str | None]:
    try:
        response = requests.get(url, headers=DEFAULT_HEADERS, timeout=timeout)
        if response.status_code != 200:
            return None, "", f"HTTP {response.status_code}"
        return response.content, response.headers.get("Content-Type", "").lower(), None
    except requests.RequestException as exc:
        return None, "", str(exc)


def open_candidate_image(candidate: Candidate, data: bytes, content_type: str) -> tuple[Image.Image | None, str | None]:
    is_svg = parsed_url_path(candidate.url).endswith(".svg") or "image/svg" in content_type
    if is_svg:
        if not HAS_CAIROSVG:
            return None, "SVG candidate skipped because cairosvg is not installed"
        try:
            data = cairosvg.svg2png(bytestring=data, output_width=1600)
        except Exception as exc:  # noqa: BLE001
            return None, f"SVG conversion failed: {exc}"

    try:
        image = Image.open(BytesIO(data))
        image.load()
        return image.convert("RGBA"), None
    except Exception as exc:  # noqa: BLE001
        return None, f"image open failed: {exc}"


def has_alpha(image: Image.Image) -> bool:
    if "A" not in image.getbands():
        return False
    return image.getchannel("A").getextrema()[0] < 255


def chromakey_near_white(image: Image.Image) -> Image.Image:
    pixels = []
    for red, green, blue, alpha in image.getdata():
        if red >= 240 and green >= 240 and blue >= 240:
            pixels.append((BACKGROUND_RGBA[0], BACKGROUND_RGBA[1], BACKGROUND_RGBA[2], 0))
        else:
            pixels.append((red, green, blue, alpha))
    image.putdata(pixels)
    return image


def contain_logo(candidate: Candidate, image: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    original_width, original_height = image.size
    had_alpha = has_alpha(image)
    if candidate.subject == "logo" and not had_alpha:
        image = chromakey_near_white(image)

    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)

    logo_width, logo_height = image.size
    source_long_edge = max(original_width, original_height)
    if source_long_edge < MIN_ACCEPTED_LONG_EDGE:
        raise ValueError(f"source too small: {original_width}x{original_height}")

    scale = TARGET_LOGO_LONG_EDGE / max(logo_width, logo_height)
    if source_long_edge < MIN_SOURCE_LONG_EDGE:
        scale = min(scale, 1.0)
    else:
        scale = min(scale, MAX_LOGO_UPSCALE)

    new_width = max(1, round(logo_width * scale))
    new_height = max(1, round(logo_height * scale))
    resized = image.resize((new_width, new_height), resample=Image.Resampling.LANCZOS)

    if scale > 1.2:
        resized = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))

    canvas = Image.new("RGBA", CANVAS_SIZE, BACKGROUND_RGBA)
    paste_x = (CANVAS_SIZE[0] - new_width) // 2
    paste_y = (CANVAS_SIZE[1] - new_height) // 2
    canvas.paste(resized, (paste_x, paste_y), resized)

    return canvas, {
        "source_width": original_width,
        "source_height": original_height,
        "source_below_floor": source_long_edge < MIN_SOURCE_LONG_EDGE,
        "scale": round(scale, 3),
        "rendered_width": new_width,
        "rendered_height": new_height,
        "chromakey_applied": candidate.subject == "logo" and not had_alpha,
    }


def cover_photo(image: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    original_width, original_height = image.size
    source_long_edge = max(original_width, original_height)
    if source_long_edge < MIN_SOURCE_LONG_EDGE:
        raise ValueError(f"photo source too small: {original_width}x{original_height}")

    scale = max(CANVAS_SIZE[0] / original_width, CANVAS_SIZE[1] / original_height)
    resized_width = round(original_width * scale)
    resized_height = round(original_height * scale)
    resized = image.resize((resized_width, resized_height), resample=Image.Resampling.LANCZOS)
    left = max(0, (resized_width - CANVAS_SIZE[0]) // 2)
    top = max(0, (resized_height - CANVAS_SIZE[1]) // 2)
    covered = resized.crop((left, top, left + CANVAS_SIZE[0], top + CANVAS_SIZE[1]))

    return covered, {
        "source_width": original_width,
        "source_height": original_height,
        "source_below_floor": False,
        "scale": round(scale, 3),
        "rendered_width": CANVAS_SIZE[0],
        "rendered_height": CANVAS_SIZE[1],
        "chromakey_applied": False,
    }


def inspect_candidate(candidate: Candidate, timeout: float) -> dict[str, object]:
    data, content_type, fetch_error = fetch_bytes(candidate.url, timeout)
    if fetch_error or data is None:
        return {**asdict(candidate), "ok": False, "error": fetch_error}

    image, open_error = open_candidate_image(candidate, data, content_type)
    if open_error or image is None:
        return {**asdict(candidate), "ok": False, "error": open_error}

    width, height = image.size
    return {
        **asdict(candidate),
        "ok": True,
        "content_type": content_type,
        "source_width": width,
        "source_height": height,
        "source_below_floor": max(width, height) < MIN_SOURCE_LONG_EDGE,
    }


def process_candidate(candidate: Candidate, output_path: Path, timeout: float) -> tuple[bool, dict[str, object]]:
    data, content_type, fetch_error = fetch_bytes(candidate.url, timeout)
    if fetch_error or data is None:
        return False, {"error": fetch_error}

    image, open_error = open_candidate_image(candidate, data, content_type)
    if open_error or image is None:
        return False, {"error": open_error}

    try:
        if candidate.subject == "photo":
            final_image, info = cover_photo(image)
        else:
            final_image, info = contain_logo(candidate, image)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        final_image.convert("RGB").save(output_path, "WEBP", quality=WEBP_QUALITY)
        return True, {**info, "content_type": content_type}
    except Exception as exc:  # noqa: BLE001
        return False, {"error": str(exc), "content_type": content_type}


def list_csv_paths(root: Path) -> list[Path]:
    return sorted((root / "data" / "csv").glob("*/*.csv"))


def find_csv_path(root: Path, province: str | None, csv_path: str | None) -> Path:
    if csv_path:
        path = Path(csv_path)
        return path if path.is_absolute() else root / path

    if not province:
        raise ValueError("Provide --provincia or --csv.")

    matches = [path for path in list_csv_paths(root) if path.stem == province]
    if not matches:
        known = ", ".join(path.stem for path in list_csv_paths(root))
        raise ValueError(f"No CSV found for province '{province}'. Known provinces: {known}")
    if len(matches) > 1:
        joined = ", ".join(str(path.relative_to(root)) for path in matches)
        raise ValueError(f"Province '{province}' is ambiguous. Use --csv. Matches: {joined}")
    return matches[0]


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    temp_path = path.with_suffix(f"{path.suffix}.tmp")
    with temp_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    temp_path.replace(path)


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    if not fieldnames:
        raise ValueError(f"CSV has no header: {path}")
    if "imagen" not in fieldnames:
        fieldnames.append("imagen")
        for row in rows:
            row["imagen"] = ""
    return fieldnames, rows


def public_image_path(asset_province: str, slug: str) -> str:
    return f"/productores/{asset_province}/{slug}.webp"


def print_candidate_summary(candidate_info: dict[str, object], prefix: str = "  -") -> None:
    size = ""
    if candidate_info.get("source_width") and candidate_info.get("source_height"):
        size = f" {candidate_info['source_width']}x{candidate_info['source_height']}"
    status = "ok" if candidate_info.get("ok") else f"skip: {candidate_info.get('error')}"
    print(
        f"{prefix} score={candidate_info['score']} {candidate_info['source']} "
        f"{candidate_info['subject']}{size} [{status}] {candidate_info['url']}"
    )


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Find and normalize producer image assets.")
    parser.add_argument("--provincia", help="Province CSV slug, e.g. cuenca or la-rioja.")
    parser.add_argument("--csv", dest="csv_path", help="Explicit CSV path when province lookup is not enough.")
    parser.add_argument("--asset-provincia", help="Asset folder slug under public/productores/. Defaults to CSV stem.")
    parser.add_argument("--apply", action="store_true", help="Write WebP assets and update the CSV.")
    parser.add_argument("--replace", action="store_true", help="Process rows that already have imagen.")
    parser.add_argument("--allow-photos", action="store_true", help="Allow non-logo OG/Twitter photos as fallbacks.")
    parser.add_argument("--allow-blocked-domains", action="store_true", help="Inspect social/aggregator domains.")
    parser.add_argument("--slug", action="append", default=[], help="Limit work to a producer slug. Repeatable.")
    parser.add_argument("--limit", type=int, help="Maximum number of eligible producers to inspect.")
    parser.add_argument("--threshold", type=int, default=15, help="Minimum candidate score to try.")
    parser.add_argument("--max-candidates", type=int, default=5, help="Candidates inspected per producer in dry-run.")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between producer websites.")
    parser.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout in seconds.")
    parser.add_argument("--report", help="Optional JSON report path.")
    parser.add_argument("--list-provinces", action="store_true", help="List province CSV slugs and exit.")
    return parser


def main() -> int:
    parser = build_arg_parser()
    argv = sys.argv[1:]
    if argv and argv[0] == "--":
        argv = argv[1:]
    args = parser.parse_args(argv)
    root = repo_root()

    if args.list_provinces:
        for path in list_csv_paths(root):
            print(path.stem)
        return 0

    try:
        csv_path = find_csv_path(root, args.provincia, args.csv_path)
    except ValueError as exc:
        parser.error(str(exc))

    asset_province = args.asset_provincia or csv_path.stem
    output_dir = root / "public" / "productores" / asset_province
    fieldnames, rows = read_csv(csv_path)
    wanted_slugs = set(args.slug)
    report: list[dict[str, object]] = []
    updated = 0
    inspected = 0

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: {csv_path.relative_to(root)} -> /productores/{asset_province}/")
    if not args.apply:
        print("No files will be written. Re-run with --apply to save selected images.")

    for index, row in enumerate(rows, start=1):
        slug = clean_cell(row.get("slug"))
        name = clean_cell(row.get("nombre"))
        web_url = clean_cell(row.get("web"))
        current_image = clean_cell(row.get("imagen"))

        if wanted_slugs and slug not in wanted_slugs:
            continue
        if current_image and not args.replace:
            continue
        if not web_url.startswith(("http://", "https://")):
            continue
        if is_blocked_domain(web_url) and not args.allow_blocked_domains:
            report.append({"slug": slug, "name": name, "status": "skipped-blocked-domain", "web": web_url})
            continue
        if args.limit is not None and inspected >= args.limit:
            break

        inspected += 1
        print(f"[{index}/{len(rows)}] {name} ({slug})")
        candidates, candidate_error = get_image_candidates(web_url, args.timeout)
        row_report: dict[str, object] = {
            "slug": slug,
            "name": name,
            "web": web_url,
            "status": "no-candidates" if not candidates else "candidates",
            "candidates": [],
        }

        if candidate_error:
            row_report["error"] = candidate_error
            print(f"  no candidates: {candidate_error}")
            report.append(row_report)
            time.sleep(args.delay)
            continue

        selected = None
        candidate_count = 0
        for candidate in candidates:
            if candidate.score < args.threshold:
                continue
            if candidate.subject == "photo" and not args.allow_photos:
                continue

            candidate_count += 1
            if not args.apply and candidate_count > args.max_candidates:
                break

            if args.apply:
                output_path = output_dir / f"{slug}.webp"
                ok, info = process_candidate(candidate, output_path, args.timeout)
                candidate_info = {**asdict(candidate), "ok": ok, **info}
                row_report["candidates"].append(candidate_info)
                print_candidate_summary(candidate_info)
                if ok:
                    row["imagen"] = public_image_path(asset_province, slug)
                    selected = candidate_info
                    updated += 1
                    row_report["status"] = "updated"
                    row_report["selected"] = candidate_info
                    print(f"  selected -> {row['imagen']}")
                    break
            else:
                candidate_info = inspect_candidate(candidate, args.timeout)
                row_report["candidates"].append(candidate_info)
                print_candidate_summary(candidate_info)

        if not row_report["candidates"]:
            print("  no acceptable candidates after filtering")
            row_report["status"] = "no-acceptable-candidates"

        if args.apply and selected is None and row_report["candidates"]:
            row_report["status"] = "failed"

        report.append(row_report)
        time.sleep(args.delay)

    if args.apply and updated:
        write_csv(csv_path, fieldnames, rows)

    if args.report:
        report_path = Path(args.report)
        if not report_path.is_absolute():
            report_path = root / report_path
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Report written to {report_path.relative_to(root)}")

    print(f"Done. inspected={inspected} updated={updated}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
