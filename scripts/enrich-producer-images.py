#!/usr/bin/env python3
"""
Find and normalize producer logo assets from official producer websites.

Default mode is a dry run: it reports candidates and writes no CSV/assets.
Use --apply with one slug and a reviewed candidate digest to update the CSV.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
from collections import deque
from dataclasses import asdict, dataclass
from io import BytesIO, StringIO
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
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
LOW_CONTRAST_LOGO_RGBA = (73, 68, 60, 255)
TARGET_LOGO_LONG_EDGE = 960
MAX_IMAGE_UPSCALE = 3.0
# A 64px source upscaled 3x is mush on the canvas: the Soria/Albacete passes
# found the right brand rendered unusably small more often than actual junk.
MIN_ACCEPTED_LONG_EDGE = 200
WEBP_QUALITY = 90

# --max-candidates budgets what the reviewer gets to look at, so a candidate
# that resolves to nothing must not spend it. Le Cave del Ceppo shipped the
# usual apple-touch/favicon family — fifteen <link rel="icon"> entries, every
# one a 404 — ahead of the page's own 3438px logo.png; counting the dead ones
# hid the logo behind a cap of five. Unreadable candidates draw on this budget
# instead, which only bounds the requests wasted on a broken icon directory.
MAX_UNREADABLE_CANDIDATES = 24

# Ink at or above this luminance is indistinguishable from the canvas.
PALE_LUMINANCE = 225
FLOOD_SENTINEL = (255, 0, 255)

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

DEFAULT_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
}

# Asset requests need to look like a browser fetching an image from the page it
# just loaded. Sending these on a session that already holds the site's cookies
# turns most Cloudflare 403s into 200s.
IMAGE_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
    "Sec-Fetch-Dest": "image",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
}

LOGO_HINTS = ("logo", "brand", "marca", "logotipo", "imagotipo", "isotipo")
PHOTO_HINTS = ("hero", "banner", "slider", "background", "bg-", "cabecera", "portada")
# Cheap prefilter only. It catches junk whose *filename* gives it away and
# nothing else: the Albacete pass hit two EU-funding banners and a web-agency
# credit whose filenames were innocuous, and produced two junk classes that had
# never appeared in Soria or in the 6d8c1fa purge. Treat this list as a
# shortcut, never as the reason to skip looking at the result.
BAD_ASSET_HINTS = (
    "accessibility",
    "cookieyes",
    "gdpr",
    "loader",
    "loading",
    "mastercard",
    "onetap",
    "placeholder",
    "pixel",
    "powered-by",
    "safari-pinned-tab",
    "sprite",
    "trustpilot",
    "whatsapp",
    "wp-content/plugins/",
    "wp-content/themes/",
)


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


def parsed_url_path(url: str) -> str:
    return unquote(urlparse(url).path).lower()


def path_contains_any(url: str, hints: Iterable[str]) -> bool:
    path = parsed_url_path(url)
    return any(hint in path for hint in hints)


def luminance(red: int, green: int, blue: int) -> float:
    return 0.299 * red + 0.587 * green + 0.114 * blue


def home_variants(web_url: str) -> list[str]:
    """A stale scheme or a missing `www.` is not a dead site.

    The CSV stores whatever URL the source gave us; plenty of rows say `http://`
    for a host that now only answers on `https://www.`. Trying the obvious
    variants before reporting a failure is what took the Soria open-rate from
    72% to 97%.
    """
    parsed = urlparse(web_url)
    host = parsed.netloc
    if not host:
        return [web_url]
    alt_host = host[4:] if host.startswith("www.") else f"www.{host}"
    variants = [web_url]
    for scheme in ("https", "http"):
        for candidate_host in (host, alt_host):
            url = f"{scheme}://{candidate_host}{parsed.path or '/'}"
            if url not in variants:
                variants.append(url)
    return variants[:5]


def upstream_variants(url: str) -> list[str]:
    """URLs that tend to serve the full-size original instead of a thumbnail.

    WordPress and Shopify encode the resized dimensions in the filename, so
    dropping the suffix recovers the original (`logo-olivo-150x150.png` ->
    `logo-olivo.png`, 150px -> 1148px). Wix is the opposite: the transform is
    the whole path, so it has to be rewritten to a larger size rather than
    stripped — removing it returns 403.
    """
    variants = [url]

    wordpress = re.sub(
        r"-\d{2,4}x\d{2,4}(\.(?:png|jpe?g|webp|gif))(\?|$)", r"\1\2", url, flags=re.I
    )
    if wordpress != url:
        variants.append(wordpress)

    wix = re.search(r"w_(\d+),h_(\d+)", url)
    if wix:
        width, height = int(wix.group(1)), int(wix.group(2))
        if 0 < width < CANVAS_SIZE[0]:
            scaled_height = max(1, round(height * CANVAS_SIZE[0] / width))
            variants.append(
                re.sub(r"w_\d+,h_\d+", f"w_{CANVAS_SIZE[0]},h_{scaled_height}", url)
            )

    shopify = re.sub(r"_\d{2,4}x\d{0,4}(\.(?:png|jpe?g|webp))", r"\1", url, flags=re.I)
    if shopify != url and shopify not in variants:
        variants.append(shopify)

    return variants


def jsonld_logo_urls(soup: BeautifulSoup) -> list[str]:
    """`Organization.logo` from JSON-LD: the site telling us which image is its
    brand, rather than us guessing from a filename."""
    found: list[str] = []
    for tag in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            data = json.loads(tag.string or "{}")
        except (ValueError, TypeError):
            continue
        stack = [data]
        while stack:
            node = stack.pop()
            if isinstance(node, list):
                stack.extend(node)
            elif isinstance(node, dict):
                stack.extend(v for v in node.values() if isinstance(v, (dict, list)))
                logo = node.get("logo")
                if isinstance(logo, str):
                    found.append(logo)
                elif isinstance(logo, dict) and isinstance(logo.get("url"), str):
                    found.append(logo["url"])
    return found


# Words that carry no identity: they appear in hundreds of producer names and
# would match almost any asset on almost any site.
NAME_STOPWORDS = frozenset(
    """
    aceite aceites agricola alimentacion artesanal artesano artesanos bodega bodegas
    casa cerveza cervezas coop cooperativa conservas explotacion finca ganaderia
    granja harinas hermanos hnos huerta lacteos mermeladas miel obrador panaderia
    productos queseria queso quesos sat sca scl sociedad vinedos vinos
    del las los una uno
    """.split()
)


def fold_accents(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text.lower())
    return "".join(char for char in normalized if not unicodedata.combining(char))


def name_tokens(producer_name: str) -> set[str]:
    words = re.split(r"[^a-z0-9]+", fold_accents(producer_name))
    return {word for word in words if len(word) >= 4 and word not in NAME_STOPWORDS}


def matches_producer_name(url: str, evidence: str, tokens: set[str]) -> bool:
    if not tokens:
        return False
    haystack = re.sub(r"[^a-z0-9]+", " ", fold_accents(f"{parsed_url_path(url)} {evidence}"))
    return any(token in haystack for token in tokens)


def infer_subject(source: str, url: str, evidence: str = "") -> str:
    text = f"{parsed_url_path(url)} {evidence}".lower()
    if source in {"icon", "fallback-favicon", "logo-img", "json-ld"}:
        return "logo"
    if any(hint in text for hint in LOGO_HINTS):
        return "logo"
    if any(hint in text for hint in PHOTO_HINTS):
        return "photo"
    if source in {"og:image", "twitter:image", "page-img", "css-bg"}:
        return "photo"
    return "unknown"


def score_candidate(source: str, url: str, subject: str, producer_name: str = "") -> int:
    path = parsed_url_path(url)
    extension = Path(path).suffix
    score = 0

    if source == "json-ld":
        score = 110
    elif source == "logo-img":
        score = 105 if extension == ".svg" else 95 if extension in {".png", ".webp"} else 75
    elif source == "icon":
        score = 85 if "apple-touch" in path or "touch-icon" in path else 75
        if extension == ".svg":
            score += 5
    elif source == "og:image":
        score = 65 if subject == "logo" else 45
    elif source == "twitter:image":
        score = 60 if subject == "logo" else 40
    elif source == "css-bg":
        score = 55
    elif source == "page-img":
        score = 40
    elif source == "fallback-favicon":
        score = 20 if extension != ".ico" else 10

    if subject == "logo":
        score += 10
    if path_contains_any(url, LOGO_HINTS):
        score += 5

    # The single most repeatable defect across the pilots: on a group-owned
    # site the top-scoring asset is the parent's logo, not the producer's
    # (HispanoBodegas for Gormaz, Costa Food for Villar, Vichy Catalan for
    # Monte Pinos, Viñas Familia Gil for Atalaya). No filename rule catches it,
    # because the parent's filename is a perfectly good logo filename. Matching
    # the producer's own name does.
    if producer_name:
        if matches_producer_name(url, "", name_tokens(producer_name)):
            score += 45
        else:
            score -= 20

    if path_contains_any(url, BAD_ASSET_HINTS):
        score -= 120
    if extension in {".ico", ".gif"}:
        score -= 5

    return score


def make_candidate(
    source: str, base_url: str, raw_url: str | None, evidence: str = "", producer_name: str = ""
) -> Candidate | None:
    url = normalize_url(base_url, raw_url)
    if not url:
        return None

    subject = infer_subject(source, url, evidence)
    score = score_candidate(source, url, subject, producer_name)
    # Evidence (alt/class/title) counts for the name match too: plenty of sites
    # ship `header-2.png` with `alt="Quesería Tierras Altas"`.
    if producer_name and matches_producer_name(url, evidence, name_tokens(producer_name)):
        score = max(score, score_candidate(source, url, subject, "") + 45)

    return Candidate(source=source, url=url, subject=subject, evidence=evidence, score=score)


def pick_largest_srcset_url(srcset: str | None) -> str | None:
    if not srcset:
        return None

    # Parse per the HTML srcset grammar: a candidate is a URL (a run of
    # non-whitespace, so commas inside the URL itself — e.g. Wix transform
    # paths like ".../w_640,h_480,al_c/x.jpg" — do not split it) optionally
    # followed by a "640w" / "2x" descriptor, terminated by a comma. Splitting
    # naively on "," shreds such URLs; splitting only on ", " loses candidates
    # separated by a bare comma. Tokenizing handles both.
    text = " ".join(srcset.split())
    best_url = None
    best_score = -1.0
    i, n = 0, len(text)
    while i < n:
        while i < n and (text[i].isspace() or text[i] == ","):
            i += 1
        if i >= n:
            break
        start = i
        while i < n and not text[i].isspace():
            i += 1
        url = text[start:i].rstrip(",")
        while i < n and text[i].isspace():
            i += 1
        desc_start = i
        while i < n and text[i] != ",":
            i += 1
        desc_tokens = text[desc_start:i].split()
        if i < n:
            i += 1  # consume the candidate-separating comma
        if not url:
            continue
        descriptor = desc_tokens[0] if desc_tokens else ""
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


def first_asset_url(*raw_urls: str | None) -> str | None:
    for raw_url in raw_urls:
        if raw_url and raw_url.strip() and not raw_url.strip().startswith("data:"):
            return raw_url
    return None


def add_candidate(candidates: list[Candidate], seen: set[str], candidate: Candidate | None) -> None:
    if not candidate or candidate.url in seen:
        return
    seen.add(candidate.url)
    candidates.append(candidate)


@dataclass
class PageContext:
    """The live session and resolved URL for one producer's site.

    Reusing the session that loaded the homepage is what makes the asset
    requests work: it carries the site's cookies, and paired with a `Referer`
    it gets past the hotlink protection that returns 403 to a bare GET.
    """

    session: requests.Session
    base_url: str

    @property
    def referer(self) -> str:
        parsed = urlparse(self.base_url)
        return f"{parsed.scheme}://{parsed.netloc}/"


def fetch_home(session: requests.Session, web_url: str, timeout: float):
    last_error = None
    for url in home_variants(web_url):
        try:
            response = session.get(url, headers=DEFAULT_HEADERS, timeout=timeout, allow_redirects=True)
            if response.status_code == 200 and response.text:
                return response, None
            last_error = f"HTTP {response.status_code}"
        except requests.RequestException as exc:
            last_error = type(exc).__name__
    return None, last_error or "no response"


def get_image_candidates(
    web_url: str, timeout: float, producer_name: str = ""
) -> tuple[list[Candidate], str | None, PageContext | None]:
    candidates: list[Candidate] = []
    seen: set[str] = set()

    session = requests.Session()
    response, error = fetch_home(session, web_url, timeout)
    if response is None:
        return [], error, None

    soup = BeautifulSoup(response.text, "html.parser")
    base_url = response.url or web_url
    page = PageContext(session=session, base_url=base_url)

    for logo_url in jsonld_logo_urls(soup):
        add_candidate(
            candidates, seen, make_candidate("json-ld", base_url, logo_url, "Organization.logo", producer_name)
        )

    for attrs, source in (
        ({"property": "og:image"}, "og:image"),
        ({"property": "og:image:secure_url"}, "og:image"),
        ({"name": "twitter:image"}, "twitter:image"),
        ({"name": "twitter:image:src"}, "twitter:image"),
        ({"name": "msapplication-TileImage"}, "icon"),
    ):
        tag = soup.find("meta", attrs=attrs)
        if tag and tag.get("content"):
            add_candidate(
                candidates, seen, make_candidate(source, base_url, tag["content"], str(attrs), producer_name)
            )

    for link in soup.find_all("link"):
        rel = " ".join(link.get("rel") or []).lower()
        if "icon" not in rel and "apple-touch" not in rel:
            continue
        evidence = " ".join(filter(None, [rel, clean_cell(link.get("sizes"))]))
        add_candidate(
            candidates, seen, make_candidate("icon", base_url, link.get("href"), evidence, producer_name)
        )

    # Every <img>, not only those with "logo" in an attribute. The old filter
    # was a crutch for a scorer that could not tell brand from junk, and it
    # silently dropped the correct logo whenever the markup called it
    # `cabecera`, `marca-principal` or just `img_01`. Ranking sorts them out.
    for img in soup.find_all("img"):
        src = first_asset_url(
            pick_largest_srcset_url(img.get("srcset")),
            pick_largest_srcset_url(img.get("data-srcset")),
            img.get("src"),
            img.get("data-src"),
            img.get("data-lazy-src"),
            img.get("data-original"),
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
        source = "logo-img" if any(hint in evidence.lower() for hint in LOGO_HINTS) else "page-img"
        add_candidate(candidates, seen, make_candidate(source, base_url, src, evidence, producer_name))

    for tag in soup.find_all(style=re.compile("background", re.I)):
        for match in re.finditer(r"url\((['\"]?)(.*?)\1\)", tag.get("style", "")):
            add_candidate(
                candidates,
                seen,
                make_candidate("css-bg", base_url, match.group(2), clean_cell(tag.get("class")), producer_name),
            )

    for style in soup.find_all("style"):
        for match in re.finditer(
            r"\.(?:logo|brand|marca|header__?logo)[^{]*\{[^}]*url\((['\"]?)(.*?)\1\)", style.string or "", re.I
        ):
            add_candidate(
                candidates, seen, make_candidate("css-bg", base_url, match.group(2), ".logo rule", producer_name)
            )

    parsed = urlparse(base_url)
    if parsed.scheme and parsed.netloc:
        add_candidate(
            candidates,
            seen,
            make_candidate(
                "fallback-favicon", f"{parsed.scheme}://{parsed.netloc}/", "/favicon.ico", "default", producer_name
            ),
        )

    candidates.sort(key=lambda candidate: candidate.score, reverse=True)
    return candidates, None, page


def fetch_bytes(
    url: str, timeout: float, page: PageContext | None = None
) -> tuple[bytes | None, str, str | None]:
    getter = page.session if page else requests
    headers = dict(IMAGE_HEADERS)
    if page:
        headers["Referer"] = page.referer
    try:
        response = getter.get(url, headers=headers, timeout=timeout)
        if response.status_code != 200:
            return None, "", f"HTTP {response.status_code}"
        return response.content, response.headers.get("Content-Type", "").lower(), None
    except requests.RequestException as exc:
        return None, "", str(exc)


@dataclass
class Asset:
    image: Image.Image
    data: bytes
    content_type: str
    url: str

    @property
    def digest(self) -> str:
        return hashlib.sha256(self.data).hexdigest()


def composed_digest(image: Image.Image) -> str:
    """Identify the reviewed pixels, not just the downloaded source bytes."""
    rgb = image.convert("RGB")
    payload = f"{rgb.mode}:{rgb.width}x{rgb.height}:".encode() + rgb.tobytes()
    return hashlib.sha256(payload).hexdigest()


def fetch_best_asset(
    candidate: Candidate, timeout: float, page: PageContext | None = None
) -> tuple[Asset | None, str | None]:
    """Fetch the candidate, preferring a full-size variant over a thumbnail."""
    best: Asset | None = None
    last_error: str | None = None
    for url in upstream_variants(candidate.url):
        data, content_type, error = fetch_bytes(url, timeout, page)
        if error or data is None:
            last_error = error
            continue
        image, open_error = open_candidate_image(url, data, content_type)
        if image is None:
            last_error = open_error
            continue
        if best is None or max(image.size) > max(best.image.size):
            best = Asset(image=image, data=data, content_type=content_type, url=url)
    if best is None:
        return None, last_error or "no usable variant"
    return best, None


def open_candidate_image(url: str, data: bytes, content_type: str) -> tuple[Image.Image | None, str | None]:
    is_svg = parsed_url_path(url).endswith(".svg") or "image/svg" in content_type
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


def chromakey_near_white(image: Image.Image) -> Image.Image:
    """Drop the light background without touching light ink.

    A global threshold cannot tell "white background" from "white lettering":
    raise it and the lettering disappears, lower it and a grey plate survives
    that the tint below then darkens into a visible block. Background differs
    from ink topologically — it reaches the edge of the image — so it is
    flood-filled from the corners and everything else is left alone.
    """
    rgb = image.convert("RGB")
    width, height = rgb.size
    rgb_pixels, rgba_pixels = rgb.load(), image.load()

    filled = False
    for corner in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)):
        red, green, blue = rgb_pixels[corner]
        if rgba_pixels[corner][3] > 16 and luminance(red, green, blue) > PALE_LUMINANCE:
            ImageDraw.floodfill(rgb, corner, FLOOD_SENTINEL, thresh=28)
            filled = True
    if not filled:
        return image

    out = image.copy()
    out_pixels = out.load()
    for y in range(height):
        for x in range(width):
            if rgb_pixels[x, y] == FLOOD_SENTINEL:
                out_pixels[x, y] = (BACKGROUND_RGBA[0], BACKGROUND_RGBA[1], BACKGROUND_RGBA[2], 0)
    return out


def tint_low_contrast_logo(image: Image.Image) -> Image.Image:
    """Darken near-white ink that sits directly on the canvas, and only that.

    No global proportion works as the trigger. Measured on the Soria pass:
    La Bodega de La Loba is 48% near-white pixels and must NOT be touched (they
    are the counters inside the grape outlines), while Dulces El Beato is 27%
    and must be (that is its lettering). What separates them is topology — the
    lettering borders the canvas, the counter is enclosed by dark ink. So the
    fill spreads from transparency through connected near-white pixels;
    whatever it cannot reach is left as designed.
    """
    width, height = image.size
    if width * height > 2_500_000:
        return image

    pixels = image.load()
    pale = [[False] * width for _ in range(height)]
    frontier: deque[tuple[int, int]] = deque()
    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha <= 32:
                frontier.append((x, y))
            elif luminance(red, green, blue) > PALE_LUMINANCE:
                pale[y][x] = True

    reached = [[False] * width for _ in range(height)]
    while frontier:
        x, y = frontier.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and pale[ny][nx] and not reached[ny][nx]:
                reached[ny][nx] = True
                frontier.append((nx, ny))

    for y in range(height):
        row = reached[y]
        for x in range(width):
            if row[x]:
                pixels[x, y] = (
                    LOW_CONTRAST_LOGO_RGBA[0],
                    LOW_CONTRAST_LOGO_RGBA[1],
                    LOW_CONTRAST_LOGO_RGBA[2],
                    pixels[x, y][3],
                )
    return image


def contain_logo(image: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    image = image.convert("RGBA")
    original_width, original_height = image.size

    # Both passes are safe on any logo now, with or without alpha: the chromakey
    # only removes background reachable from a corner, and the tint only darkens
    # near-white ink reachable from transparency. Gating them on `had_alpha`
    # used to let a near-white plate through on one path and swallow white
    # lettering on the other.
    before_chromakey = image.tobytes()
    image = chromakey_near_white(image)
    chromakey_applied = image.tobytes() != before_chromakey

    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)

    before_tint = image.tobytes()
    image = tint_low_contrast_logo(image)
    low_contrast_tint_applied = image.tobytes() != before_tint

    logo_width, logo_height = image.size
    source_long_edge = max(original_width, original_height)
    if source_long_edge < MIN_ACCEPTED_LONG_EDGE:
        raise ValueError(f"source too small: {original_width}x{original_height}")

    scale = TARGET_LOGO_LONG_EDGE / max(logo_width, logo_height)
    scale = min(scale, MAX_IMAGE_UPSCALE)

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
        "scale": round(scale, 3),
        "rendered_width": new_width,
        "rendered_height": new_height,
        "chromakey_applied": chromakey_applied,
        "low_contrast_tint_applied": low_contrast_tint_applied,
    }


def cover_photo(image: Image.Image) -> tuple[Image.Image, dict[str, object]]:
    original_width, original_height = image.size
    source_long_edge = max(original_width, original_height)
    if source_long_edge < MIN_ACCEPTED_LONG_EDGE:
        raise ValueError(f"photo source too small: {original_width}x{original_height}")

    scale = max(CANVAS_SIZE[0] / original_width, CANVAS_SIZE[1] / original_height)
    if scale > MAX_IMAGE_UPSCALE:
        raise ValueError(
            f"photo would require {scale:.1f}x upscale (maximum {MAX_IMAGE_UPSCALE:.0f}x)"
        )
    resized_width = round(original_width * scale)
    resized_height = round(original_height * scale)
    resized = image.resize((resized_width, resized_height), resample=Image.Resampling.LANCZOS)
    left = max(0, (resized_width - CANVAS_SIZE[0]) // 2)
    top = max(0, (resized_height - CANVAS_SIZE[1]) // 2)
    covered = resized.crop((left, top, left + CANVAS_SIZE[0], top + CANVAS_SIZE[1]))

    return covered, {
        "source_width": original_width,
        "source_height": original_height,
        "scale": round(scale, 3),
        "rendered_width": CANVAS_SIZE[0],
        "rendered_height": CANVAS_SIZE[1],
        "chromakey_applied": False,
    }


def inspect_candidate(
    candidate: Candidate, timeout: float, page: PageContext | None = None
) -> tuple[dict[str, object], Image.Image | None]:
    asset, error = fetch_best_asset(candidate, timeout, page)
    if asset is None:
        return {**asdict(candidate), "ok": False, "error": error}, None

    try:
        if candidate.subject == "photo":
            final_image, composition = cover_photo(asset.image)
        else:
            final_image, composition = contain_logo(asset.image)
    except Exception as exc:  # noqa: BLE001
        return {
            **asdict(candidate),
            "ok": False,
            "content_type": asset.content_type,
            "resolved_url": asset.url,
            "source_digest": asset.digest,
            "source_width": asset.image.width,
            "source_height": asset.image.height,
            "error": str(exc),
        }, None

    final_rgb = final_image.convert("RGB")
    return {
        **asdict(candidate),
        "ok": True,
        "content_type": asset.content_type,
        "resolved_url": asset.url,
        "source_digest": asset.digest,
        "digest": composed_digest(final_rgb),
        **composition,
    }, final_rgb


def _ellipsize(text: str, limit: int) -> str:
    return text if len(text) <= limit else f"{text[: limit - 1]}…"


def _sheet_font(size: int):
    for path in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def write_contact_sheets(entries: list[tuple[str, str, Image.Image]], out_dir: Path, per_sheet: int = 15) -> list[Path]:
    """Lay composed candidates out for visual review.

    This is the point of the whole tool. The scorer ranks; it does not know
    whether an image is the producer's brand. Reviewing the composed asset is
    the only step that catches a parent company's logo, a subsidy banner, a
    tourism seal or a web agency credit — all of which score perfectly well.
    Sheets are written from the same composition --apply uses, so what you
    approve is what gets saved.
    """
    if out_dir.exists() and any(out_dir.iterdir()):
        raise ValueError(f"contact-sheet directory must be empty: {out_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)
    label_font, meta_font = _sheet_font(14), _sheet_font(12)
    columns, cell, pad, label_height = 5, 310, 14, 44
    written: list[Path] = []

    for start in range(0, len(entries), per_sheet):
        chunk = entries[start : start + per_sheet]
        rows = (len(chunk) + columns - 1) // columns
        thumb_height = int(cell * 0.75)
        sheet = Image.new(
            "RGB",
            (columns * (cell + pad) + pad, rows * (thumb_height + label_height + pad) + pad),
            (255, 255, 255),
        )
        draw = ImageDraw.Draw(sheet)
        for position, (label, meta, image) in enumerate(chunk):
            column, row = position % columns, position // columns
            x = pad + column * (cell + pad)
            y = pad + row * (thumb_height + label_height + pad)
            thumb = image.copy()
            thumb.thumbnail((cell, thumb_height))
            draw.rectangle([x - 1, y - 1, x + cell + 1, y + thumb_height + 1], outline=(205, 205, 205))
            sheet.paste(thumb, (x + (cell - thumb.width) // 2, y))
            draw.text((x, y + thumb_height + 5), _ellipsize(label, 36), fill=(0, 0, 0), font=label_font)
            draw.text((x, y + thumb_height + 24), _ellipsize(meta, 48), fill=(120, 95, 55), font=meta_font)

        path = out_dir / f"contact-sheet-{start // per_sheet + 1:02d}.png"
        sheet.save(path)
        written.append(path)
    return written


def list_csv_paths(root: Path) -> list[Path]:
    # data/csv/<country>/<region>/<area>.csv
    return sorted((root / "data" / "csv").glob("*/*/*.csv"))


def find_csv_path(root: Path, area: str | None) -> Path:
    if not area:
        raise ValueError("Provide --area.")

    matches = [path for path in list_csv_paths(root) if path.stem == area]
    if not matches:
        raise ValueError(f"No CSV found for area '{area}'.")
    if len(matches) > 1:
        joined = ", ".join(str(path.relative_to(root)) for path in matches)
        raise ValueError(f"Area '{area}' is not globally unique: {joined}")
    return matches[0]


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]], bytes, str]:
    raw_bytes = path.read_bytes()
    raw = raw_bytes.decode("utf-8")
    reader = csv.DictReader(StringIO(raw, newline=""))
    fieldnames = list(reader.fieldnames or [])
    rows = list(reader)

    if not fieldnames:
        raise ValueError(f"CSV has no header: {path}")
    if "imagen" not in fieldnames:
        raise ValueError(f"CSV has no imagen column: {path}")
    return fieldnames, rows, raw_bytes, raw


def csv_record_spans(raw: str) -> list[tuple[int, int]]:
    """Return record spans without changing quoting or any unrelated byte."""
    spans: list[tuple[int, int]] = []
    start = 0
    in_quotes = False
    index = 0
    while index < len(raw):
        char = raw[index]
        if char == '"':
            if in_quotes and index + 1 < len(raw) and raw[index + 1] == '"':
                index += 2
                continue
            in_quotes = not in_quotes
        elif char == "\n" and not in_quotes:
            spans.append((start, index))
            start = index + 1
        index += 1
    if in_quotes:
        raise ValueError("CSV contains an unterminated quoted field")
    if start < len(raw):
        spans.append((start, len(raw)))
    return spans


def csv_field_spans(record: str) -> list[tuple[int, int]]:
    spans: list[tuple[int, int]] = []
    start = 0
    in_quotes = False
    index = 0
    while index < len(record):
        char = record[index]
        if char == '"':
            if in_quotes and index + 1 < len(record) and record[index + 1] == '"':
                index += 2
                continue
            in_quotes = not in_quotes
        elif char == "," and not in_quotes:
            spans.append((start, index))
            start = index + 1
        index += 1
    if in_quotes:
        raise ValueError("CSV record contains an unterminated quoted field")
    spans.append((start, len(record)))
    return spans


def parse_csv_record(record: str) -> list[str]:
    return next(csv.reader(StringIO(record, newline="")))


def update_csv_image(raw: str, slug: str, image_path: str) -> str:
    """Replace only the raw `imagen` cell for one slug.

    Re-serializing a complete CSV normalizes otherwise valid quoting in hundreds
    of files. Splicing the one field keeps every unrelated byte stable and makes
    a one-image change safe to review.
    """
    records = csv_record_spans(raw)
    if not records:
        raise ValueError("CSV is empty")
    header_start, header_end = records[0]
    header = parse_csv_record(raw[header_start:header_end])
    try:
        slug_index = header.index("slug")
        image_index = header.index("imagen")
    except ValueError as exc:
        raise ValueError("CSV requires slug and imagen columns") from exc

    matches: list[tuple[int, int]] = []
    for record_start, record_end in records[1:]:
        record = raw[record_start:record_end]
        values = parse_csv_record(record)
        if slug_index >= len(values) or values[slug_index].strip() != slug:
            continue
        fields = csv_field_spans(record)
        if image_index >= len(fields):
            raise ValueError(f"CSV row for '{slug}' has no imagen cell")
        field_start, field_end = fields[image_index]
        matches.append((record_start + field_start, record_start + field_end))

    if len(matches) != 1:
        raise ValueError(f"expected one CSV row for slug '{slug}', found {len(matches)}")
    start, end = matches[0]
    return f"{raw[:start]}{image_path}{raw[end:]}"


def write_selected_image(
    csv_path: Path,
    original_csv_bytes: bytes,
    updated_csv: str,
    output_path: Path,
    image: Image.Image,
) -> None:
    """Stage both outputs and abort if the CSV changed during network work."""
    if csv_path.read_bytes() != original_csv_bytes:
        raise RuntimeError("CSV changed while candidates were being inspected; nothing was written")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    suffix = f".{os.getpid()}.tmp"
    image_temp = output_path.with_name(f".{output_path.name}{suffix}")
    csv_temp = csv_path.with_name(f".{csv_path.name}{suffix}")
    try:
        image.save(image_temp, "WEBP", quality=WEBP_QUALITY)
        csv_temp.write_text(updated_csv, encoding="utf-8", newline="")
        if csv_path.read_bytes() != original_csv_bytes:
            raise RuntimeError("CSV changed while outputs were staged; nothing was written")
        image_temp.replace(output_path)
        csv_temp.replace(csv_path)
    finally:
        image_temp.unlink(missing_ok=True)
        csv_temp.unlink(missing_ok=True)


def public_image_path(asset_dir: str, slug: str) -> str:
    return f"/productores/{asset_dir}/{slug}.webp"


def print_candidate_summary(candidate_info: dict[str, object], prefix: str = "  -") -> None:
    size = ""
    if candidate_info.get("source_width") and candidate_info.get("source_height"):
        size = f" {candidate_info['source_width']}x{candidate_info['source_height']}"
    status = "ok" if candidate_info.get("ok") else f"skip: {candidate_info.get('error')}"
    digest = clean_cell(candidate_info.get("digest"))
    candidate_id = f" id={digest[:12]}" if digest else ""
    print(
        f"{prefix} score={candidate_info['score']} {candidate_info['source']} "
        f"{candidate_info['subject']}{size}{candidate_id} [{status}] {candidate_info['url']}"
    )


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Find and normalize producer image assets.")
    parser.add_argument("--area", help="Globally unique area CSV slug, e.g. cuenca or la-rioja.")
    parser.add_argument("--apply", action="store_true", help="Write one reviewed WebP asset and update its CSV cell.")
    parser.add_argument(
        "--candidate",
        help="Reviewed candidate SHA-256 (or a unique prefix of at least 12 characters); required with --apply.",
    )
    parser.add_argument("--replace", action="store_true", help="Replace the existing image for the selected slug.")
    parser.add_argument("--allow-photos", action="store_true", help="Allow non-logo OG/Twitter photos as fallbacks.")
    parser.add_argument("--slug", action="append", default=[], help="Limit work to a producer slug. Repeatable.")
    parser.add_argument("--limit", type=int, help="Maximum number of eligible producers to inspect.")
    parser.add_argument("--threshold", type=int, default=15, help="Minimum candidate score to try.")
    parser.add_argument(
        "--max-candidates",
        type=int,
        default=5,
        help="Maximum readable candidates rendered for review per producer. "
        "Candidates that fail to download or are below the minimum size are not counted.",
    )
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between producer websites.")
    parser.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout in seconds.")
    parser.add_argument("--report", help="Optional JSON report path.")
    parser.add_argument(
        "--contact-sheet",
        metavar="DIR",
        help="Dry-run only: render every inspected candidate as it would be saved and lay them "
        "out in review sheets. Look at these before --apply; a scorer cannot tell a producer's "
        "brand from its parent company's logo, a subsidy banner or an award seal.",
    )
    return parser


def main() -> int:
    parser = build_arg_parser()
    argv = sys.argv[1:]
    if argv and argv[0] == "--":
        argv = argv[1:]
    args = parser.parse_args(argv)
    root = repo_root()

    if args.contact_sheet and args.apply:
        parser.error("--contact-sheet is for reviewing before you apply; run it without --apply.")
    if args.apply and len(args.slug) != 1:
        parser.error("--apply requires exactly one --slug.")
    if args.apply and not args.candidate:
        parser.error("--apply requires the reviewed --candidate digest from candidates.json.")
    if not args.apply and args.candidate:
        parser.error("--candidate is only meaningful with --apply.")
    if args.candidate and not re.fullmatch(r"[a-fA-F0-9]{12,64}", args.candidate):
        parser.error("--candidate must be 12 to 64 hexadecimal SHA-256 characters.")
    if args.max_candidates < 1:
        parser.error("--max-candidates must be at least 1.")
    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be at least 1.")
    if args.timeout <= 0 or args.delay < 0:
        parser.error("--timeout must be positive and --delay cannot be negative.")

    try:
        csv_path = find_csv_path(root, args.area)
    except ValueError as exc:
        parser.error(str(exc))

    # The destination is always canonical and derived from the registry path.
    asset_dir = csv_path.relative_to(root / "data" / "csv").with_suffix("").as_posix()
    output_dir = root / "public" / "productores" / asset_dir
    try:
        _, rows, original_csv_bytes, original_csv = read_csv(csv_path)
    except ValueError as exc:
        parser.error(str(exc))
    wanted_slugs = set(args.slug)
    known_slugs = {clean_cell(row.get("slug")) for row in rows}
    unknown_slugs = wanted_slugs - known_slugs
    if unknown_slugs:
        parser.error(f"unknown slug(s) in {args.area}: {', '.join(sorted(unknown_slugs))}")

    if wanted_slugs and not args.replace:
        already_filled = [
            clean_cell(row.get("slug"))
            for row in rows
            if clean_cell(row.get("slug")) in wanted_slugs and clean_cell(row.get("imagen"))
        ]
        if already_filled:
            parser.error(
                f"slug(s) already have imagen: {', '.join(already_filled)}; inspect first and pass --replace explicitly"
            )

    sheet_dir: Path | None = None
    if args.contact_sheet:
        sheet_dir = Path(args.contact_sheet)
        if not sheet_dir.is_absolute():
            sheet_dir = root / sheet_dir
        if sheet_dir.resolve().is_relative_to((root / "public").resolve()):
            parser.error("contact sheets are review artifacts and cannot be written under public/.")
        if sheet_dir.exists() and any(sheet_dir.iterdir()):
            parser.error(f"contact-sheet directory must be empty: {sheet_dir}")

    report_path: Path | None = None
    if args.report:
        report_path = Path(args.report)
        if not report_path.is_absolute():
            report_path = root / report_path
        if report_path.resolve().is_relative_to((root / "public").resolve()):
            parser.error("reports are review artifacts and cannot be written under public/.")

    report: list[dict[str, object]] = []
    digest_owners: dict[str, list[str]] = {}
    sheet_entries: list[tuple[str, str, Image.Image]] = []
    updated = 0
    inspected = 0

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: {csv_path.relative_to(root)} -> /productores/{asset_dir}/")
    if not args.apply:
        print("No CSV or public assets will be written. Re-run with --apply to save one selected image.")

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
            if wanted_slugs:
                row_report = {
                    "slug": slug,
                    "name": name,
                    "web": web_url,
                    "status": "missing-web",
                }
                report.append(row_report)
                print(f"[{index}/{len(rows)}] {name} ({slug}): no usable web URL")
            continue
        if args.limit is not None and inspected >= args.limit:
            break

        inspected += 1
        print(f"[{index}/{len(rows)}] {name} ({slug})")
        candidates, candidate_error, page = get_image_candidates(web_url, args.timeout, name)
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

        matching_candidates: list[tuple[dict[str, object], Image.Image]] = []
        reviewable_count = 0
        unreadable_count = 0
        for candidate in candidates:
            if candidate.score < args.threshold:
                continue
            if candidate.subject == "photo" and not args.allow_photos:
                continue

            if reviewable_count >= args.max_candidates:
                break
            if unreadable_count >= MAX_UNREADABLE_CANDIDATES:
                print(f"  stopped after {unreadable_count} unreadable candidates")
                break

            candidate_info, preview = inspect_candidate(candidate, args.timeout, page)
            row_report["candidates"].append(candidate_info)
            print_candidate_summary(candidate_info)
            if preview is None:
                unreadable_count += 1
                continue

            reviewable_count += 1
            digest = clean_cell(candidate_info.get("digest"))

            if args.contact_sheet:
                sheet_entries.append(
                    (
                        f"{name} ({slug})",
                        f"id={digest[:12]} {candidate.source} {candidate.subject} "
                        f"{candidate_info['source_width']}x{candidate_info['source_height']} score={candidate.score}",
                        preview,
                    )
                )

            if args.apply and digest.startswith(args.candidate.lower()):
                matching_candidates.append((candidate_info, preview))

        selected = None
        if args.apply and matching_candidates:
            distinct_digests = {clean_cell(info.get("digest")) for info, _ in matching_candidates}
            if len(distinct_digests) > 1:
                print("  candidate prefix is ambiguous; use the full digest from candidates.json")
                row_report["status"] = "ambiguous-candidate"
            else:
                selected, selected_image = matching_candidates[0]
                image_path = public_image_path(asset_dir, slug)
                output_path = output_dir / f"{slug}.webp"
                try:
                    updated_csv = update_csv_image(original_csv, slug, image_path)
                    write_selected_image(
                        csv_path,
                        original_csv_bytes,
                        updated_csv,
                        output_path,
                        selected_image,
                    )
                except (OSError, RuntimeError, ValueError) as exc:
                    print(f"  apply failed: {exc}")
                    row_report["status"] = "failed"
                    row_report["error"] = str(exc)
                    selected = None
                else:
                    updated += 1
                    row_report["status"] = "updated"
                    row_report["selected"] = selected
                    print(f"  selected {selected['digest'][:12]} -> {image_path}")

        if not reviewable_count:
            print("  no acceptable candidates after filtering")
            row_report["status"] = "no-acceptable-candidates"

        if args.apply and selected is None and row_report["status"] == "candidates":
            print("  reviewed candidate was not found among the inspected candidates; nothing written")
            row_report["status"] = "failed"

        for candidate_info in row_report["candidates"]:
            digest = candidate_info.get("source_digest")
            if digest:
                digest_owners.setdefault(digest, []).append(f"{name} ({slug})")

        report.append(row_report)
        time.sleep(args.delay)

    # One binary served to unrelated producers is often a plugin, directory or
    # award asset. It remains a review signal because groups and multi-site
    # producers can legitimately share a brand.
    collisions = {digest: owners for digest, owners in digest_owners.items() if len(set(owners)) > 1}
    if collisions:
        print(f"\nWarning: {len(collisions)} image(s) served to more than one producer in this run.")
        print("Shared branding is legitimate; a plugin/award/directory asset is not. Check each:")
        for digest, owners in list(collisions.items())[:10]:
            print(f"  {digest[:10]} -> {', '.join(sorted(set(owners)))}")
        if len(collisions) > 10:
            print(f"  ... {len(collisions) - 10} more (see --report)")

    if sheet_dir is not None:
        written = write_contact_sheets(sheet_entries, sheet_dir) if sheet_entries else []
        sheet_dir.mkdir(parents=True, exist_ok=True)
        candidate_report = sheet_dir / "candidates.json"
        candidate_report.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"\n{len(sheet_entries)} candidate(s) rendered to {len(written)} sheet(s) in {sheet_dir}")
        print(f"Candidate digests and source URLs: {candidate_report}")
        print("Review them before --apply.")

    if report_path is not None:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Report written to {report_path}")

    print(f"Done. inspected={inspected} updated={updated}")
    return 1 if args.apply and updated != 1 else 0


if __name__ == "__main__":
    raise SystemExit(main())
