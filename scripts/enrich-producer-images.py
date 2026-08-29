#!/usr/bin/env python3
"""
Find and normalize producer logo assets from official producer websites.

Default mode is a dry run: it reports candidates and writes no CSV/assets.
Use --apply only with producer-specific candidate digests reviewed from a sweep.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import ipaddress
import json
import math
import mimetypes
import os
import re
import socket
import sys
import threading
import time
import unicodedata
from collections import deque
from contextlib import contextmanager
from dataclasses import asdict, dataclass
from io import BytesIO, StringIO
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urljoin, urlparse

try:
    import idna
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
    from defusedxml import ElementTree as DefusedElementTree

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
COMPOSITION_DIRNAME = "compositions"
REVIEWED_ASSET_DIRNAME = "assets"
SWEEP_MANIFEST_FILENAME = "candidates.json"
SWEEP_MANIFEST_VERSION = 3
SUPPORTED_SWEEP_MANIFEST_VERSIONS = frozenset({1, 2, SWEEP_MANIFEST_VERSION})
CANONICAL_SLUG_RE = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")

# --max-candidates budgets compositions that can actually reach review. Broken
# icon families use this separate ceiling so they cannot hide a later real logo
# or trigger an unbounded sequence of failed requests.
MAX_UNREADABLE_CANDIDATES = 24
MAX_REDIRECTS = 5
MAX_HTML_BYTES = 2 * 1024 * 1024
MAX_IMAGE_BYTES = 16 * 1024 * 1024
MAX_SOURCE_PIXELS = 24_000_000
MAX_SVG_ASPECT_RATIO = 32.0
STREAM_CHUNK_SIZE = 64 * 1024
MAX_URL_CHARS = 4096
MAX_EVIDENCE_CHARS = 1000
MAX_ERROR_CHARS = 1000

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

DNS_PIN_LOCK = threading.Lock()

LOGO_HINTS = ("logo", "logotipo", "imagotipo", "isotipo", "wordmark")
LOGO_CONTAINER_HINTS = (
    "brand-logo",
    "custom-logo",
    "header-logo",
    "marca-principal",
    "navbar-brand",
    "site-branding",
    "site-logo",
)
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


def bounded_text(value: object, limit: int) -> str:
    text = str(value or "")
    return text if len(text) <= limit else f"{text[: limit - 1]}…"


def error_text(value: object) -> str:
    return bounded_text(value, MAX_ERROR_CHARS)


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def normalize_url(base_url: str, raw_url: str | None) -> str | None:
    if not raw_url:
        return None

    raw_url = raw_url.strip()
    if not raw_url or len(raw_url) > MAX_URL_CHARS or raw_url.startswith("data:"):
        return None

    if raw_url.startswith("//"):
        raw_url = f"https:{raw_url}"

    url = urljoin(base_url, raw_url)
    parsed = urlparse(url)
    if len(url) > MAX_URL_CHARS or parsed.scheme not in {"http", "https"} or not parsed.netloc:
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


def contains_logo_hint(text: str) -> bool:
    """Recognize explicit identity words without treating `catalogo` as `logo`."""
    folded = fold_accents(text)
    pattern = r"(?<![a-z0-9])(?:" + "|".join(map(re.escape, LOGO_HINTS)) + r")(?![a-z0-9])"
    return re.search(pattern, folded) is not None


def image_is_logo_candidate(
    img,
    evidence: str,
    producer_name: str = "",
    asset_url: str = "",
) -> bool:
    """Separate identity evidence from generic `brand` or `marca` wording.

    A named image inside the page header/navigation is useful evidence even
    when the author called it `img_01`; a product image elsewhere is not made a
    logo merely because its class contains `brand` or `marca`.
    """
    folded = fold_accents(f"{parsed_url_path(asset_url)} {evidence}")
    if contains_logo_hint(folded) or any(hint in folded for hint in LOGO_CONTAINER_HINTS):
        return True
    return False


def image_is_ambiguous_identity_candidate(
    img,
    evidence: str,
    producer_name: str = "",
    asset_url: str = "",
) -> bool:
    """Surface weak header/name evidence without silently declaring it a logo."""
    folded = fold_accents(f"{parsed_url_path(asset_url)} {evidence}")
    if any(hint in folded for hint in PHOTO_HINTS):
        return False
    in_identity_container = img.find_parent(["header", "nav"]) is not None
    return in_identity_container and matches_producer_name("", evidence, name_tokens(producer_name))


def infer_subject(source: str, url: str, evidence: str = "") -> str:
    text = f"{parsed_url_path(url)} {evidence}".lower()
    if source in {"icon", "fallback-favicon", "json-ld"}:
        return "logo"
    if source == "logo-img":
        return "logo"
    if source == "identity-img":
        return "unknown"
    if any(hint in text for hint in PHOTO_HINTS):
        return "photo"
    if contains_logo_hint(text):
        return "logo"
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
    elif source == "identity-img":
        score = 70
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
    if contains_logo_hint(parsed_url_path(url)):
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

    evidence = bounded_text(evidence, MAX_EVIDENCE_CHARS)
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


def public_url_resolution(
    url: str,
    resolver=None,
) -> tuple[str | None, int | None, list[tuple], str | None]:
    """Resolve one HTTP URL once and retain the public addresses for its connection."""
    resolver = resolver or socket.getaddrinfo
    try:
        parsed = urlparse(url)
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
    except ValueError as exc:
        return None, None, [], f"invalid URL: {exc}"
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return None, None, [], "only absolute HTTP(S) URLs are allowed"
    if parsed.username is not None or parsed.password is not None:
        return None, None, [], "URLs with credentials are not allowed"

    try:
        # Match Requests' own URL preparation exactly. Python's builtin IDNA
        # codec implements the older IDNA 2003 mapping (for example,
        # ``faß.de`` becomes ``fass.de``), while Requests uses the third-party
        # ``idna`` package with UTS 46 (``xn--fa-hia.de``). The DNS pin must use
        # the same hostname that the HTTP stack will resolve.
        hostname = idna.encode(parsed.hostname.rstrip("."), uts46=True).decode("ascii").lower()
    except (idna.IDNAError, UnicodeError) as exc:
        return None, None, [], f"hostname is not valid IDNA: {exc}"
    if hostname == "localhost" or hostname.endswith((".localhost", ".local", ".internal", ".home.arpa")):
        return None, None, [], f"local hostname is not allowed: {hostname}"

    try:
        infos = list(resolver(hostname, port, type=socket.SOCK_STREAM))
    except OSError as exc:
        return None, None, [], f"DNS lookup failed for {hostname}: {exc}"
    addresses = set()
    for info in infos:
        try:
            addresses.add(ipaddress.ip_address(info[4][0].split("%", 1)[0]))
        except (IndexError, ValueError):
            return None, None, [], f"DNS returned an invalid address for {hostname}"

    if not addresses:
        return None, None, [], f"DNS returned no addresses for {hostname}"
    blocked = sorted(str(address) for address in addresses if not address.is_global)
    if blocked:
        return None, None, [], f"non-public destination is not allowed: {', '.join(blocked)}"
    return hostname, port, infos, None


def public_url_error(url: str, resolver=None) -> str | None:
    """Reject HTTP destinations that can reach the local machine or network."""
    return public_url_resolution(url, resolver)[3]


@contextmanager
def pinned_dns(hostname: str, port: int, infos: list[tuple]):
    """Make the synchronous request connect only to the addresses just validated."""
    original_getaddrinfo = socket.getaddrinfo

    def pinned_getaddrinfo(host, requested_port, family=0, type=0, proto=0, flags=0):
        host_text = host.decode("ascii") if isinstance(host, bytes) else str(host)
        try:
            canonical_host = idna.encode(host_text.rstrip("."), uts46=True).decode("ascii").lower()
        except (idna.IDNAError, UnicodeError):
            canonical_host = ""
        same_host = canonical_host == hostname
        same_port = str(requested_port) == str(port)
        if same_host and same_port:
            matches = [
                info
                for info in infos
                if family in (0, socket.AF_UNSPEC, info[0])
                and type in (0, info[1])
                and proto in (0, info[2])
            ]
            return matches or infos
        return original_getaddrinfo(host, requested_port, family, type, proto, flags)

    with DNS_PIN_LOCK:
        socket.getaddrinfo = pinned_getaddrinfo
        try:
            yield
        finally:
            socket.getaddrinfo = original_getaddrinfo


def bounded_get(getter, url: str, headers: dict[str, str], timeout: float, max_bytes: int):
    """Fetch a public URL with bounded redirects and a decompressed byte cap."""
    current = url
    redirect_codes = {301, 302, 303, 307, 308}
    for redirect_index in range(MAX_REDIRECTS + 1):
        hostname, port, infos, unsafe = public_url_resolution(current)
        if unsafe:
            return None, f"unsafe URL {current!r}: {unsafe}"
        try:
            with pinned_dns(hostname, port, infos):
                response = getter.get(
                    current,
                    headers=headers,
                    timeout=timeout,
                    allow_redirects=False,
                    stream=True,
                )
        except requests.RequestException as exc:
            return None, error_text(exc)

        resolved_url = clean_cell(getattr(response, "url", "")) or current
        unsafe = public_url_error(resolved_url) if resolved_url != current else None
        if unsafe:
            response.close()
            return None, f"unsafe resolved URL {resolved_url!r}: {unsafe}"

        if response.status_code in redirect_codes:
            location = response.headers.get("Location")
            response.close()
            if redirect_index >= MAX_REDIRECTS:
                return None, f"too many redirects (maximum {MAX_REDIRECTS})"
            next_url = normalize_url(resolved_url, location)
            if not next_url:
                return None, "redirect has no valid HTTP(S) Location"
            current = next_url
            continue

        if response.status_code != 200:
            response.close()
            return response, None

        length = response.headers.get("Content-Length")
        if length:
            try:
                if int(length) > max_bytes:
                    response.close()
                    return None, f"response exceeds {max_bytes} byte limit"
            except ValueError:
                pass

        body = bytearray()
        try:
            for chunk in response.iter_content(chunk_size=STREAM_CHUNK_SIZE):
                if not chunk:
                    continue
                body.extend(chunk)
                if len(body) > max_bytes:
                    response.close()
                    return None, f"response exceeds {max_bytes} byte limit"
        except requests.RequestException as exc:
            response.close()
            return None, error_text(exc)
        response.close()
        response._content = bytes(body)
        response._content_consumed = True
        response.url = resolved_url
        return response, None
    return None, f"too many redirects (maximum {MAX_REDIRECTS})"


def fetch_home(session: requests.Session, web_url: str, timeout: float):
    last_error = None
    for url in home_variants(web_url):
        response, error = bounded_get(session, url, DEFAULT_HEADERS, timeout, MAX_HTML_BYTES)
        if error:
            last_error = error
            continue
        if response is not None and response.status_code == 200 and response.content:
            return response, None
        last_error = f"HTTP {response.status_code}" if response is not None else "no response"
    return None, last_error or "no response"


def get_image_candidates(
    web_url: str, timeout: float, producer_name: str = ""
) -> tuple[list[Candidate], str | None, PageContext | None]:
    candidates: list[Candidate] = []
    seen: set[str] = set()

    session = requests.Session()
    session.trust_env = False
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

    # Inspect every <img>, but promote only explicit identity attributes to
    # `logo-img`. A producer-named header image is useful but ambiguous: keep
    # logo-style composition while requiring --allow-photos for the decision.
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
        if image_is_logo_candidate(img, evidence, producer_name, src or ""):
            source = "logo-img"
        elif image_is_ambiguous_identity_candidate(img, evidence, producer_name, src or ""):
            source = "identity-img"
        else:
            source = "page-img"
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
            r"\.(?:logo|logotipo|imagotipo|isotipo|wordmark|brand-logo|custom-logo|header__?logo|navbar-brand|site-logo)[^{]*\{[^}]*url\((['\"]?)(.*?)\1\)",
            style.string or "",
            re.I,
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
    temporary_session = None
    if page:
        getter = page.session
    else:
        temporary_session = requests.Session()
        temporary_session.trust_env = False
        getter = temporary_session
    headers = dict(IMAGE_HEADERS)
    if page:
        headers["Referer"] = page.referer
    try:
        response, error = bounded_get(getter, url, headers, timeout, MAX_IMAGE_BYTES)
    finally:
        if temporary_session is not None:
            temporary_session.close()
    if error:
        return None, "", error
    if response is None:
        return None, "", "no response"
    if response.status_code != 200:
        return None, "", f"HTTP {response.status_code}"
    return response.content, response.headers.get("Content-Type", "").lower(), None


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
            if best is not None:
                best.image.close()
            best = Asset(image=image, data=data, content_type=content_type, url=url)
        else:
            image.close()
    if best is None:
        return None, last_error or "no usable variant"
    return best, None


def deny_svg_resource(url: str, resource_type: str) -> dict[str, object]:
    parsed = urlparse(url)
    if parsed.scheme == "data":
        label = "data:[embedded content]"
    else:
        label = bounded_text(url, 200)
    raise ValueError(f"external SVG resource is not allowed: {resource_type} {label}")


def svg_intrinsic_size(data: bytes) -> tuple[float, float]:
    """Read a bounded SVG viewport before Cairo allocates its output surface."""
    try:
        root = DefusedElementTree.fromstring(data)
    except Exception as exc:  # noqa: BLE001
        raise ValueError(f"SVG XML is not safe and readable: {error_text(exc)}") from exc
    if root.tag.rsplit("}", 1)[-1].lower() != "svg":
        raise ValueError("SVG has no readable root element")
    attributes = {name.rsplit("}", 1)[-1].lower(): value for name, value in root.attrib.items()}

    viewbox: tuple[float, float, float, float] | None = None
    raw_viewbox = attributes.get("viewbox")
    if raw_viewbox:
        try:
            values = [float(value) for value in re.split(r"[\s,]+", raw_viewbox.strip()) if value]
        except ValueError as exc:
            raise ValueError("SVG has an invalid viewBox") from exc
        if len(values) != 4:
            raise ValueError("SVG viewBox must contain four numbers")
        viewbox = (values[0], values[1], values[2], values[3])

    units = {
        "": 1.0,
        "px": 1.0,
        "pt": 96 / 72,
        "pc": 16.0,
        "mm": 96 / 25.4,
        "cm": 96 / 2.54,
        "in": 96.0,
    }

    def absolute_length(name: str) -> float:
        value = attributes.get(name, "")
        match = re.fullmatch(
            r"\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*(px|pt|pc|mm|cm|in)?\s*",
            value,
            re.I,
        )
        if match is None:
            return 0
        return float(match.group(1)) * units[(match.group(2) or "").lower()]

    # Match CairoSVG's node_format: absolute root dimensions win; a viewBox
    # supplies only a missing/percentage dimension when there is no parent size.
    width = absolute_length("width") or (viewbox[2] if viewbox else 0)
    height = absolute_length("height") or (viewbox[3] if viewbox else 0)

    if not all(math.isfinite(value) and value > 0 for value in (width, height)):
        raise ValueError("SVG viewport dimensions must be finite and positive")
    aspect_ratio = max(width, height) / min(width, height)
    if aspect_ratio > MAX_SVG_ASPECT_RATIO:
        raise ValueError(
            f"SVG aspect ratio {aspect_ratio:.1f}:1 exceeds {MAX_SVG_ASPECT_RATIO:.0f}:1"
        )
    return width, height


def open_candidate_image(url: str, data: bytes, content_type: str) -> tuple[Image.Image | None, str | None]:
    is_svg = parsed_url_path(url).endswith(".svg") or "image/svg" in content_type
    if is_svg:
        if not HAS_CAIROSVG:
            return None, "SVG candidate skipped because cairosvg is not installed"
        try:
            svg_width, svg_height = svg_intrinsic_size(data)
            scale = 1600 / max(svg_width, svg_height)
            output_width = max(1, round(svg_width * scale))
            output_height = max(1, round(svg_height * scale))
            data = cairosvg.surface.PNGSurface.convert(
                bytestring=data,
                unsafe=False,
                url_fetcher=deny_svg_resource,
                output_width=output_width,
                output_height=output_height,
            )
        except Exception as exc:  # noqa: BLE001
            return None, f"SVG conversion failed: {error_text(exc)}"

    try:
        with Image.open(BytesIO(data)) as image:
            if image.width * image.height > MAX_SOURCE_PIXELS:
                return None, f"image has too many pixels: {image.width}x{image.height}"
            image.load()
            return image.convert("RGBA"), None
    except Exception as exc:  # noqa: BLE001
        return None, f"image open failed: {error_text(exc)}"


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


def compose_candidate_asset(
    candidate: Candidate,
    asset: Asset,
) -> tuple[dict[str, object], Image.Image | None]:
    """Compose one already-loaded source according to its reviewed subject."""
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
            "error": error_text(exc),
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


def inspect_candidate(
    candidate: Candidate, timeout: float, page: PageContext | None = None
) -> tuple[dict[str, object], Image.Image | None]:
    asset, error = fetch_best_asset(candidate, timeout, page)
    if asset is None:
        return {**asdict(candidate), "ok": False, "error": error}, None
    try:
        return compose_candidate_asset(candidate, asset)
    finally:
        asset.image.close()


def inspect_local_candidate(
    candidate: Candidate,
    source_path: Path,
) -> tuple[dict[str, object], Image.Image | None]:
    """Compose a reviewer-supplied local file without fetching its reference URL."""
    try:
        size = source_path.stat().st_size
    except OSError as exc:
        return {**asdict(candidate), "ok": False, "error": error_text(exc)}, None
    if size > MAX_IMAGE_BYTES:
        return {
            **asdict(candidate),
            "ok": False,
            "error": f"local source exceeds {MAX_IMAGE_BYTES} byte limit",
        }, None
    try:
        data = source_path.read_bytes()
    except OSError as exc:
        return {**asdict(candidate), "ok": False, "error": error_text(exc)}, None
    content_type = mimetypes.guess_type(source_path.name)[0] or "application/octet-stream"
    image, error = open_candidate_image(source_path.name, data, content_type)
    if image is None:
        return {**asdict(candidate), "ok": False, "error": error}, None
    asset = Asset(image=image, data=data, content_type=content_type, url=candidate.url)
    try:
        return compose_candidate_asset(candidate, asset)
    finally:
        asset.image.close()


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


def _render_contact_sheet(
    entries: list[tuple[str, str, Image.Image]],
    path: Path,
) -> None:
    """Render one bounded page of already-composed review candidates."""
    label_font, meta_font = _sheet_font(14), _sheet_font(12)
    columns, cell, pad, label_height = 5, 310, 14, 44
    rows = (len(entries) + columns - 1) // columns
    thumb_height = int(cell * 0.75)
    sheet = Image.new(
        "RGB",
        (columns * (cell + pad) + pad, rows * (thumb_height + label_height + pad) + pad),
        (255, 255, 255),
    )
    try:
        draw = ImageDraw.Draw(sheet)
        for position, (label, meta, image) in enumerate(entries):
            column, row = position % columns, position // columns
            x = pad + column * (cell + pad)
            y = pad + row * (thumb_height + label_height + pad)
            thumb = image.copy()
            try:
                thumb.thumbnail((cell, thumb_height))
                draw.rectangle(
                    [x - 1, y - 1, x + cell + 1, y + thumb_height + 1],
                    outline=(205, 205, 205),
                )
                sheet.paste(thumb, (x + (cell - thumb.width) // 2, y))
            finally:
                thumb.close()
            draw.text((x, y + thumb_height + 5), _ellipsize(label, 36), fill=(0, 0, 0), font=label_font)
            draw.text((x, y + thumb_height + 24), _ellipsize(meta, 48), fill=(120, 95, 55), font=meta_font)
        sheet.save(path)
    finally:
        sheet.close()


def write_contact_sheets(
    entries: list[tuple[str, str, Image.Image]],
    out_dir: Path,
    per_sheet: int = 15,
) -> list[Path]:
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
    written: list[Path] = []

    for start in range(0, len(entries), per_sheet):
        path = out_dir / f"contact-sheet-{start // per_sheet + 1:02d}.png"
        _render_contact_sheet(entries[start : start + per_sheet], path)
        written.append(path)
    return written


def list_csv_paths(root: Path) -> list[Path]:
    # data/csv/<country>/<region>/<area>.csv
    return sorted((root / "data" / "csv").glob("*/*/*.csv"))


def country_image_inventory(root: Path, country: str) -> dict[str, object]:
    """Return a deterministic country closure report for the four source lanes."""
    country_slug = slugify_segment(country)
    if country_slug != country:
        raise ValueError(f"Country must be its canonical slug, got {country!r}.")
    country_root = root / "data" / "csv" / country_slug
    paths = sorted(country_root.glob("*/*.csv"))
    if not paths:
        raise ValueError(f"No catalog CSVs found for country '{country_slug}'.")

    totals = {
        "producers": 0,
        "with_image": 0,
        "missing": 0,
        "web_and_social": 0,
        "web_only": 0,
        "social_only": 0,
        "no_attributable_link": 0,
    }
    areas: list[dict[str, object]] = []
    for path in paths:
        _, rows, _, _ = read_csv(path)
        area = {key: 0 for key in totals}
        for row in rows:
            area["producers"] += 1
            if clean_cell(row.get("imagen")):
                area["with_image"] += 1
                continue
            area["missing"] += 1
            has_web = clean_cell(row.get("web")).startswith(("http://", "https://"))
            has_social = any(
                clean_cell(row.get(field)).startswith(("http://", "https://"))
                for field in ("Facebook", "Instagram")
            )
            if has_web and has_social:
                area["web_and_social"] += 1
            elif has_web:
                area["web_only"] += 1
            elif has_social:
                area["social_only"] += 1
            else:
                area["no_attributable_link"] += 1
        for key in totals:
            totals[key] += area[key]
        relative = path.relative_to(country_root)
        areas.append(
            {
                "region": relative.parts[0],
                "area": path.stem,
                **area,
            }
        )

    return {
        "country": country_slug,
        "area_count": len(areas),
        **totals,
        "areas": areas,
    }


def slugify_segment(value: str) -> str:
    """Mirror the catalog's slug rule so a typed name resolves like a URL does."""
    text = fold_accents(value)
    for source, target in (("\u00df", "ss"), ("\u00e6", "ae"), ("\u00f8", "o"), ("\u0142", "l"), ("\u00f0", "d"), ("\u00fe", "th")):
        text = text.replace(source, target)
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def require_canonical_slug(value: str, context: str = "slug") -> str:
    if not isinstance(value, str) or CANONICAL_SLUG_RE.fullmatch(value) is None:
        raise ValueError(f"{context} {value!r} is not a canonical kebab-case slug")
    return value


def area_aliases(root: Path, country: str | None = None) -> dict[str, list[tuple[str, str]]]:
    """Read the alias registry the site already uses: data/csv/<country>/country.json."""
    aliases: dict[str, list[tuple[str, str]]] = {}
    for manifest_path in sorted((root / "data" / "csv").glob("*/country.json")):
        manifest_country = manifest_path.parent.name
        if country and manifest_country != country:
            continue
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        for alias, target in (manifest.get("aliases") or {}).items():
            aliases.setdefault(slugify_segment(str(alias)), []).append((manifest_country, str(target)))
    return aliases


def find_csv_path(root: Path, area: str | None, country: str | None = None) -> Path:
    """Resolve an area the way it gets asked for: 'Girona', 'Berlin', 'Milan'."""
    if not area:
        raise ValueError("Provide --area.")

    country_slug = slugify_segment(country) if country else None
    if country and country_slug != country:
        raise ValueError(f"Country must be its canonical slug, got {country!r}.")
    paths = [
        path
        for path in list_csv_paths(root)
        if country_slug is None or path.relative_to(root / "data" / "csv").parts[0] == country_slug
    ]
    if country_slug and not paths:
        raise ValueError(f"No catalog CSVs found for country '{country_slug}'.")

    by_stem: dict[str, list[Path]] = {}
    for path in paths:
        by_stem.setdefault(path.stem, []).append(path)
    wanted = slugify_segment(area)
    if not wanted:
        raise ValueError(f"'{area}' is not a usable area name.")

    matches = list(by_stem.get(wanted, []))
    # Resolve aliases even when an exact stem exists elsewhere. Otherwise a
    # spoken name such as Milan could silently choose that exact area while
    # hiding the reviewed `milan -> milano` alias in Italy.
    targets = {
        (alias_country, target)
        for alias_country, target in area_aliases(root, country_slug).get(wanted, [])
        if target in by_stem
    }
    matches.extend(
        path
        for alias_country, target in sorted(targets)
        for path in by_stem[target]
        if path.relative_to(root / "data" / "csv").parts[0] == alias_country
    )
    matches = sorted(set(matches))

    if not matches:
        near = [stem for stem in sorted(by_stem) if wanted in stem or stem in wanted][:6]
        hint = f" Closest area slugs: {', '.join(near)}." if near else ""
        raise ValueError(f"No CSV found for area '{area}' (read as '{wanted}').{hint}")
    if len(matches) > 1:
        joined = ", ".join(str(path.relative_to(root)) for path in matches)
        raise ValueError(f"Area '{area}' is not globally unique: {joined}. Pass --country.")
    return matches[0]


def row_categories(row: dict[str, str]) -> list[str]:
    extra = clean_cell(row.get("categorias adicionales")).split("|")
    values = [clean_cell(row.get("categoria")), *(clean_cell(part) for part in extra)]
    return [value for value in values if value]


def category_matches(row: dict[str, str], needle: str) -> bool:
    return any(needle in fold_accents(category) for category in row_categories(row))


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


def encode_webp(image: Image.Image) -> bytes:
    buffer = BytesIO()
    image.save(buffer, "WEBP", quality=WEBP_QUALITY)
    return buffer.getvalue()


def replace_file(source: Path, target: Path) -> None:
    """Small seam for testing replacement failures and best-effort rollback."""
    source.replace(target)


def install_staged_file(source: Path, target: Path, replace_existing: bool) -> None:
    """Install a staged asset without clobbering a path that was initially absent."""
    if replace_existing:
        replace_file(source, target)
        return
    os.link(source, target)
    source.unlink()


def reviewed_output_bytes(output: Image.Image | bytes) -> bytes:
    return output if isinstance(output, bytes) else encode_webp(output)


def write_selected_images(
    csv_path: Path,
    original_csv_bytes: bytes,
    updated_csv: str,
    outputs: list[tuple[Path, Image.Image | bytes]],
    replace_existing: bool = False,
) -> None:
    """Stage every reviewed output and roll back detected replacement failures.

    Filesystems cannot make several assets plus a CSV crash-atomic as one unit.
    We stage first, replace the CSV last, and restore asset bytes when a replace
    call reports failure. A hard process or machine crash still requires the
    normal catalog/image checks before resuming.
    """
    if csv_path.read_bytes() != original_csv_bytes:
        raise RuntimeError("CSV changed while candidates were being inspected; nothing was written")

    output_paths = [output_path for output_path, _ in outputs]
    if len(output_paths) != len(set(output_paths)):
        raise ValueError("a reviewed batch cannot target the same asset path twice")
    original_assets: dict[Path, bytes | None] = {}
    for output_path in output_paths:
        if output_path.exists() and not output_path.is_file():
            raise ValueError(f"asset destination is not a regular file: {output_path}")
        original = output_path.read_bytes() if output_path.is_file() else None
        if original is not None and not replace_existing:
            raise ValueError(f"asset already exists: {output_path}; pass --replace to overwrite it")
        original_assets[output_path] = original

    suffix = f".{os.getpid()}.tmp"
    csv_temp = csv_path.with_name(f".{csv_path.name}{suffix}")
    staged: list[tuple[Path, Path]] = []
    staged_bytes: dict[Path, bytes] = {}
    backups: dict[Path, Path] = {}
    installed: list[Path] = []
    try:
        for output_path, output in outputs:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            image_temp = output_path.with_name(f".{output_path.name}{suffix}")
            frozen_bytes = reviewed_output_bytes(output)
            image_temp.write_bytes(frozen_bytes)
            staged.append((image_temp, output_path))
            staged_bytes[output_path] = frozen_bytes
        csv_temp.write_text(updated_csv, encoding="utf-8", newline="")
        if csv_path.read_bytes() != original_csv_bytes:
            raise RuntimeError("CSV changed while outputs were staged; nothing was written")
        for _, output_path in staged:
            original = original_assets[output_path]
            current = output_path.read_bytes() if output_path.is_file() else None
            if current != original:
                raise RuntimeError(f"asset changed while outputs were staged: {output_path}; nothing was written")
            if original is not None:
                backup = output_path.with_name(f".{output_path.name}{suffix}.bak")
                backup.write_bytes(original)
                backups[output_path] = backup
        for image_temp, output_path in staged:
            original = original_assets[output_path]
            current = output_path.read_bytes() if output_path.is_file() else None
            if current != original:
                raise RuntimeError(f"asset changed before its final swap: {output_path}")
            install_staged_file(image_temp, output_path, original is not None)
            installed.append(output_path)
        if csv_path.read_bytes() != original_csv_bytes:
            raise RuntimeError("CSV changed before its final swap; reviewed assets were rolled back")
        replace_file(csv_temp, csv_path)
    except Exception as exc:
        rollback_errors: list[str] = []
        for output_path in reversed(installed):
            try:
                current = output_path.read_bytes() if output_path.is_file() else None
                if current != staged_bytes[output_path]:
                    rollback_errors.append(f"{output_path}: changed after installation; left intact")
                    continue
                backup = backups.get(output_path)
                if backup is not None and backup.is_file():
                    replace_file(backup, output_path)
                else:
                    output_path.unlink(missing_ok=True)
            except OSError as rollback_exc:
                rollback_errors.append(f"{output_path}: {rollback_exc}")
        if rollback_errors:
            raise RuntimeError(
                f"batch write failed ({exc}); rollback also failed: {'; '.join(rollback_errors)}"
            ) from exc
        raise
    finally:
        for image_temp, _ in staged:
            image_temp.unlink(missing_ok=True)
        for backup in backups.values():
            backup.unlink(missing_ok=True)
        csv_temp.unlink(missing_ok=True)


def write_selected_image(
    csv_path: Path,
    original_csv_bytes: bytes,
    updated_csv: str,
    output_path: Path,
    image: Image.Image,
    replace_existing: bool = False,
) -> None:
    write_selected_images(
        csv_path,
        original_csv_bytes,
        updated_csv,
        [(output_path, image)],
        replace_existing=replace_existing,
    )


def composition_cache_dir(sheet_dir: Path) -> Path:
    return sheet_dir / COMPOSITION_DIRNAME


def reviewed_asset_cache_dir(sheet_dir: Path) -> Path:
    return sheet_dir / REVIEWED_ASSET_DIRNAME


def sweep_manifest_path(sheet_dir: Path) -> Path:
    return sheet_dir / SWEEP_MANIFEST_FILENAME


def csv_digest(raw_bytes: bytes) -> str:
    return hashlib.sha256(raw_bytes).hexdigest()


def write_sweep_manifest(
    sheet_dir: Path,
    catalog_path: str,
    asset_dir: str,
    original_csv_bytes: bytes,
    rows: dict[str, dict[str, object]],
    report: list[dict[str, object]] | None = None,
) -> Path:
    """Bind cached compositions to the catalog rows that produced them."""
    manifest = {
        "version": SWEEP_MANIFEST_VERSION,
        "catalog_path": catalog_path,
        "asset_dir": asset_dir,
        "csv_sha256": csv_digest(original_csv_bytes),
        "rows": rows,
        "report": report or [],
    }
    path = sweep_manifest_path(sheet_dir)
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def load_sweep_manifest(sheet_dir: Path, catalog_path: str, asset_dir: str) -> dict[str, object]:
    """Load and validate the identity boundary for an offline apply."""
    path = sweep_manifest_path(sheet_dir)
    if not path.is_file():
        raise ValueError(
            f"{sheet_dir} has no {SWEEP_MANIFEST_FILENAME}; sweep the area again before offline apply"
        )
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{path} is not valid JSON: {exc}") from exc
    if not isinstance(manifest, dict):
        raise ValueError(f"{path} must contain a JSON object")
    manifest_version = manifest.get("version")
    if manifest_version not in SUPPORTED_SWEEP_MANIFEST_VERSIONS:
        raise ValueError(
            f"{path} has unsupported version {manifest_version!r}; sweep the area again"
        )
    if manifest.get("catalog_path") != catalog_path or manifest.get("asset_dir") != asset_dir:
        raise ValueError(
            f"{path} belongs to {manifest.get('catalog_path')!r} / {manifest.get('asset_dir')!r}, "
            f"not {catalog_path!r} / {asset_dir!r}"
        )
    manifest_csv_digest = manifest.get("csv_sha256")
    if not isinstance(manifest_csv_digest, str) or not re.fullmatch(r"[a-f0-9]{64}", manifest_csv_digest):
        raise ValueError(f"{path} has an invalid csv_sha256")
    rows = manifest.get("rows")
    if not isinstance(rows, dict):
        raise ValueError(f"{path} has no row manifest")
    for slug, row in rows.items():
        if not isinstance(slug, str) or not isinstance(row, dict):
            raise ValueError(f"{path} has an invalid row entry")
        require_canonical_slug(slug, f"{path} row slug")
        if not isinstance(row.get("producer_id"), str) or not isinstance(row.get("web"), str):
            raise ValueError(f"{path} row {slug!r} has invalid producer_id/web identity")
        candidates = row.get("candidates")
        if not isinstance(candidates, list):
            raise ValueError(f"{path} row {slug!r} has no candidate list")
        seen: set[str] = set()
        for candidate in candidates:
            if not isinstance(candidate, dict):
                raise ValueError(f"{path} row {slug!r} has an invalid candidate")
            digest = candidate.get("digest")
            subject = candidate.get("subject")
            asset_sha256 = candidate.get("asset_sha256")
            if not isinstance(digest, str) or not re.fullmatch(r"[a-f0-9]{64}", digest):
                raise ValueError(f"{path} row {slug!r} has an invalid candidate digest")
            if subject not in {"logo", "photo", "unknown"}:
                raise ValueError(f"{path} row {slug!r} candidate {digest[:12]} has invalid subject")
            if manifest_version >= 2 and (
                not isinstance(asset_sha256, str) or not re.fullmatch(r"[a-f0-9]{64}", asset_sha256)
            ):
                raise ValueError(f"{path} row {slug!r} candidate {digest[:12]} has invalid asset_sha256")
            if digest in seen:
                raise ValueError(f"{path} row {slug!r} lists candidate {digest[:12]} twice")
            seen.add(digest)
    return manifest


def resolve_manifest_candidate(
    manifest: dict[str, object], slug: str, digest_prefix: str
) -> dict[str, str]:
    """Resolve a decision only among candidates reviewed for this producer."""
    rows = manifest["rows"]
    if slug not in rows:
        raise ValueError(f"{slug!r} was not part of this sweep")
    candidates = rows[slug]["candidates"]
    matches = [candidate for candidate in candidates if candidate["digest"].startswith(digest_prefix.lower())]
    if not matches:
        raise ValueError(f"candidate {digest_prefix} was not reviewed for {slug!r}")
    if len(matches) > 1:
        raise ValueError(
            f"candidate prefix {digest_prefix} is ambiguous for {slug!r}; use the full digest from candidates.json"
        )
    return matches[0]


def save_composition(
    sheet_dir: Path,
    digest: str,
    image: Image.Image,
    asset_bytes: bytes | None = None,
) -> Path:
    """Persist one reviewed composition immediately instead of retaining a sweep in RAM."""
    cache = composition_cache_dir(sheet_dir)
    asset_cache = reviewed_asset_cache_dir(sheet_dir)
    cache.mkdir(parents=True, exist_ok=True)
    asset_cache.mkdir(parents=True, exist_ok=True)
    if composed_digest(image) != digest:
        raise ValueError(f"composition does not match digest {digest}")
    path = cache / f"{digest}.png"
    if not path.exists():
        image.save(path, "PNG")
    frozen_bytes = asset_bytes if asset_bytes is not None else encode_webp(image)
    asset_path = asset_cache / f"{digest}.webp"
    if not asset_path.exists():
        asset_path.write_bytes(frozen_bytes)
    return cache


def save_compositions(
    sheet_dir: Path,
    compositions: dict[str, Image.Image],
    assets: dict[str, bytes] | None = None,
) -> Path:
    """Compatibility helper for callers that already hold a small in-memory batch."""
    cache = composition_cache_dir(sheet_dir)
    cache.mkdir(parents=True, exist_ok=True)
    reviewed_asset_cache_dir(sheet_dir).mkdir(parents=True, exist_ok=True)
    for digest, image in compositions.items():
        save_composition(
            sheet_dir,
            digest,
            image,
            assets[digest] if assets is not None else None,
        )
    return cache


def load_composition(sheet_dir: Path, digest: str) -> Image.Image:
    """Resolve a reviewed digest to the exact composition the sheet displayed."""
    cache = composition_cache_dir(sheet_dir)
    if not cache.is_dir():
        raise ValueError(f"{sheet_dir} holds no reviewed compositions; sweep it with --contact-sheet first")
    wanted = digest.lower()
    matches = sorted(path for path in cache.glob("*.png") if path.stem.startswith(wanted))
    if not matches:
        raise ValueError(f"no reviewed composition matching {digest} in {cache}")
    if len(matches) > 1:
        raise ValueError(f"candidate {digest} is ambiguous; use the full digest from candidates.json")
    with Image.open(matches[0]) as cached:
        cached.load()
        image = cached.convert("RGB")
    if composed_digest(image) != matches[0].stem:
        image.close()
        raise ValueError(f"{matches[0].name} no longer matches its digest; sweep the area again")
    return image


def write_cached_contact_sheets(
    entries: list[tuple[str, str, str]],
    out_dir: Path,
    shared: set[str],
    shared_owners: dict[str, set[str]],
    per_sheet: int = 15,
) -> list[Path]:
    """Render sheets from disk, holding at most one page of full compositions."""
    existing = sorted(out_dir.glob("contact-sheet-*.png")) if out_dir.exists() else []
    if existing:
        raise ValueError(f"contact sheets already exist in {out_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for start in range(0, len(entries), per_sheet):
        loaded: list[tuple[str, str, Image.Image]] = []
        try:
            for digest, label, meta in entries[start : start + per_sheet]:
                if digest in shared:
                    meta = f"SHARED x{len(shared_owners[digest])} {meta}"
                loaded.append((label, meta, load_composition(out_dir, digest)))
            path = out_dir / f"contact-sheet-{start // per_sheet + 1:02d}.png"
            _render_contact_sheet(loaded, path)
            written.append(path)
        finally:
            for _, _, image in loaded:
                image.close()
    return written


def load_reviewed_asset(
    sheet_dir: Path,
    candidate: dict[str, str],
    manifest_version: int,
) -> tuple[Image.Image, bytes]:
    """Load the reviewed composition and the exact WebP frozen by a v2+ sweep."""
    digest = candidate["digest"]
    image = load_composition(sheet_dir, digest)
    if manifest_version < 2:
        return image, encode_webp(image)

    asset_path = reviewed_asset_cache_dir(sheet_dir) / f"{digest}.webp"
    if not asset_path.is_file():
        raise ValueError(f"reviewed asset {asset_path.name} is missing; sweep the area again")
    asset_bytes = asset_path.read_bytes()
    actual_sha256 = hashlib.sha256(asset_bytes).hexdigest()
    if actual_sha256 != candidate["asset_sha256"]:
        raise ValueError(f"{asset_path.name} no longer matches its asset_sha256; sweep the area again")
    try:
        with Image.open(BytesIO(asset_bytes)) as rendered:
            rendered.load()
            if rendered.format != "WEBP" or rendered.size != CANVAS_SIZE:
                raise ValueError(f"{asset_path.name} is not a {CANVAS_SIZE[0]}x{CANVAS_SIZE[1]} WebP")
    except OSError as exc:
        raise ValueError(f"{asset_path.name} is not a readable WebP") from exc
    return image, asset_bytes


def read_decisions(path: Path) -> list[tuple[str, str]]:
    """Read reviewed `<slug> <sha256>` lines, ignoring blanks and comments.

    One reviewed digest per row is the same guarantee one --apply per row gave.
    Batching removes the process launch, never the review.
    """
    decisions: list[tuple[str, str]] = []
    seen: set[str] = set()
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        entry = line.split("#", 1)[0].strip()
        if not entry:
            continue
        parts = entry.split()
        if len(parts) != 2:
            raise ValueError(f"{path.name}:{number}: expected '<slug> <sha256>', got {line.strip()!r}")
        slug, digest = parts
        require_canonical_slug(slug, f"{path.name}:{number} slug")
        if not re.fullmatch(r"[a-fA-F0-9]{12,64}", digest):
            raise ValueError(f"{path.name}:{number}: {digest!r} is not 12 to 64 hexadecimal SHA-256 characters")
        if slug in seen:
            raise ValueError(f"{path.name}:{number}: {slug!r} is decided twice")
        seen.add(slug)
        decisions.append((slug, digest.lower()))
    if not decisions:
        raise ValueError(f"{path} contains no decisions")
    return decisions


def public_image_path(asset_dir: str, slug: str) -> str:
    require_canonical_slug(slug)
    return f"/productores/{asset_dir}/{slug}.webp"


def output_path_for_slug(output_dir: Path, slug: str) -> Path:
    require_canonical_slug(slug)
    base = output_dir.resolve()
    target = (output_dir / f"{slug}.webp").resolve()
    if not target.is_relative_to(base):
        raise ValueError(f"output for slug {slug!r} escapes {output_dir}")
    return target


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


def apply_reviewed(
    csv_path: Path,
    catalog_path: str,
    asset_dir: str,
    output_dir: Path,
    original_csv: str,
    original_csv_bytes: bytes,
    current_rows: list[dict[str, str]],
    sheet_dir: Path,
    decisions: list[tuple[str, str]],
    published: dict[str, str],
    replace: bool,
    allow_photos: bool,
) -> int:
    """Write reviewed compositions straight from a sweep, with no network.

    The digest fingerprints the composed pixels, so checking it against the
    cached composition proves exactly what re-fetching proved: that the bytes
    being written are the bytes that were approved. It no longer depends on the
    producer's site still serving that file today, which is what makes a pass
    safe to pause and resume days later.
    """
    try:
        manifest = load_sweep_manifest(sheet_dir, catalog_path, asset_dir)
    except (OSError, ValueError) as exc:
        print(f"apply failed: {exc}")
        return 1

    current_by_slug: dict[str, dict[str, str]] = {}
    for row in current_rows:
        slug = clean_cell(row.get("slug"))
        try:
            require_canonical_slug(slug, "current CSV slug")
        except ValueError as exc:
            print(f"apply failed: {exc}")
            return 1
        if slug in current_by_slug:
            print(f"apply failed: current CSV contains duplicate slug {slug!r}")
            return 1
        current_by_slug[slug] = row

    updated_csv = original_csv
    outputs: list[tuple[Path, bytes]] = []
    unresolved = 0
    settled = 0
    csv_changed_since_sweep = manifest["csv_sha256"] != csv_digest(original_csv_bytes)

    for slug, digest_prefix in decisions:
        try:
            output_path = output_path_for_slug(output_dir, slug)
            current_row = current_by_slug.get(slug)
            if current_row is None:
                raise ValueError(f"{slug!r} no longer exists in the current CSV")
            manifest_row = manifest["rows"].get(slug)
            if manifest_row is None:
                raise ValueError(f"{slug!r} was not part of this sweep")
            for field in ("producer_id", "web"):
                before = manifest_row[field]
                now = clean_cell(current_row.get(field))
                if before != now:
                    raise ValueError(
                        f"{slug!r} changed {field} since the sweep ({before!r} -> {now!r}); sweep it again"
                    )
            candidate = resolve_manifest_candidate(manifest, slug, digest_prefix)
            digest = candidate["digest"]
            _, asset_bytes = load_reviewed_asset(sheet_dir, candidate, int(manifest["version"]))
            image_path = public_image_path(asset_dir, slug)
        except (OSError, ValueError) as exc:
            print(f"  {slug}: {exc}")
            unresolved += 1
            continue

        # A decisions file is a ledger for an area, appended to over several
        # sittings and re-run each time. A line that already landed with these
        # exact reviewed asset and canonical CSV path is done, not a conflict.
        if (
            published.get(slug) == image_path
            and output_path.is_file()
            and output_path.read_bytes() == asset_bytes
        ):
            settled += 1
            continue
        if int(manifest["version"]) < 3 and not allow_photos:
            print(
                f"  {slug}: candidate {digest[:12]} uses a legacy v{manifest['version']} "
                "visual classification; re-sweep it or pass --allow-photos explicitly"
            )
            unresolved += 1
            continue
        if candidate["subject"] != "logo" and not allow_photos:
            print(
                f"  {slug}: candidate {digest[:12]} is {candidate['subject']}; "
                "pass --allow-photos explicitly"
            )
            unresolved += 1
            continue
        if published.get(slug) and not replace:
            print(f"  {slug}: already published a different image; pass --replace to overwrite")
            unresolved += 1
            continue

        try:
            updated_csv = update_csv_image(updated_csv, slug, image_path)
        except (OSError, ValueError) as exc:
            print(f"  {slug}: {exc}")
            unresolved += 1
            continue
        outputs.append((output_path, asset_bytes))
        print(f"  {slug} <- {digest[:12]} -> {image_path}")

    # A batch is one editorial decision. Half of it is worse than none, because
    # the half that landed is invisible next time you look at the area.
    if unresolved:
        print(f"\n{unresolved} reviewed row(s) could not be resolved; nothing was written.")
        return 1

    if csv_changed_since_sweep:
        print("CSV changed since the sweep; target producer_id/web values are unchanged, continuing.")

    if not outputs:
        print(f"Done. applied=0 already-published={settled}")
        return 0

    try:
        write_selected_images(
            csv_path,
            original_csv_bytes,
            updated_csv,
            outputs,
            replace_existing=replace,
        )
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"apply failed: {exc}")
        return 1

    print(f"Done. applied={len(outputs)} already-published={settled}")
    return 0


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Find and normalize producer image assets.")
    parser.add_argument(
        "--area",
        help="Area name, slug, or country.json alias, e.g. Girona, cuenca, or Berlín; it must resolve uniquely.",
    )
    parser.add_argument(
        "--country",
        help="Canonical country slug used to disambiguate repeated area names, e.g. --country es.",
    )
    parser.add_argument(
        "--inventory",
        action="store_true",
        help="Print a deterministic JSON coverage/source-lane inventory for --country; no --area needed.",
    )
    parser.add_argument(
        "--source-file",
        metavar="FILE",
        help="Build a normal review bundle from one local image instead of fetching the CSV web URL.",
    )
    parser.add_argument(
        "--source-reference",
        metavar="URL",
        help="Official social or institutional page that attributes --source-file to the producer.",
    )
    parser.add_argument(
        "--subject",
        choices=("logo", "photo"),
        help="Visual subject of --source-file; photos also require --allow-photos.",
    )
    parser.add_argument("--apply", action="store_true", help="Write reviewed WebP assets and update their CSV cells.")
    parser.add_argument(
        "--candidate",
        help="Reviewed candidate SHA-256 (or a unique prefix of at least 12 characters); "
        "required with --apply unless --decisions carries the digests.",
    )
    parser.add_argument(
        "--from",
        dest="from_dir",
        metavar="DIR",
        help="Apply the compositions a --contact-sheet run already saved in DIR, without fetching "
        "anything. What you approved on the sheet is exactly what gets written.",
    )
    parser.add_argument(
        "--decisions",
        metavar="FILE",
        help="Apply many reviewed rows in one pass: lines of '<slug> <sha256>'. Requires --from.",
    )
    parser.add_argument("--replace", action="store_true", help="Replace the existing image for the selected slug.")
    parser.add_argument(
        "--allow-photos",
        action="store_true",
        help="Allow photos, ambiguous header identity images, or legacy visual classifications.",
    )
    parser.add_argument("--slug", action="append", default=[], help="Limit work to a producer slug. Repeatable.")
    parser.add_argument(
        "--categoria",
        "--category",
        dest="categoria",
        help="Limit the sweep to producers in a category, matched loosely: 'quesos' selects "
        "'Lacteos y quesos'. Reads both categoria and categorias adicionales.",
    )
    parser.add_argument("--limit", type=int, help="Maximum number of eligible producers to inspect.")
    parser.add_argument("--threshold", type=int, default=15, help="Minimum candidate score to try.")
    parser.add_argument(
        "--max-candidates",
        type=int,
        default=3,
        help="Maximum distinct reviewable candidates per producer (default: 3).",
    )
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between producer websites.")
    parser.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout in seconds.")
    parser.add_argument("--report", help="Optional JSON report path.")
    parser.add_argument(
        "--contact-sheet",
        metavar="DIR",
        help="Dry-run only: render each distinct composition as it would be saved, lay them out "
        "in review sheets, and keep them in DIR for --apply --from. Look at these before "
        "--apply; a scorer cannot tell a producer's brand from its parent company's logo, a "
        "subsidy banner or an award seal.",
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
    if (args.from_dir or args.decisions) and not args.apply:
        parser.error("--from and --decisions only apply reviewed work; pass --apply.")
    if args.decisions and not args.from_dir:
        parser.error("--decisions needs the --from directory holding the reviewed compositions.")
    if args.decisions and (args.slug or args.candidate):
        parser.error("--decisions carries its own slugs and digests; drop --slug and --candidate.")
    if args.apply and not args.decisions:
        if len(args.slug) != 1:
            parser.error("--apply requires exactly one --slug, or --decisions for a reviewed batch.")
        if not args.candidate:
            parser.error("--apply requires the reviewed --candidate digest from candidates.json.")
    if not args.apply and args.candidate:
        parser.error("--candidate is only meaningful with --apply.")
    if args.categoria and args.apply:
        parser.error("--categoria selects producers to sweep; --apply writes the rows you reviewed.")
    if args.candidate and not re.fullmatch(r"[a-fA-F0-9]{12,64}", args.candidate):
        parser.error("--candidate must be 12 to 64 hexadecimal SHA-256 characters.")
    if args.max_candidates < 1:
        parser.error("--max-candidates must be at least 1.")
    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be at least 1.")
    if args.timeout <= 0 or args.delay < 0:
        parser.error("--timeout must be positive and --delay cannot be negative.")

    manual_values = (args.source_file, args.source_reference, args.subject)
    if any(manual_values) and not all(manual_values):
        parser.error("--source-file, --source-reference, and --subject must be provided together.")
    if args.source_file:
        if args.apply or args.from_dir or args.decisions or args.candidate:
            parser.error("--source-file creates a review bundle first; apply it later with --from and --decisions.")
        if len(args.slug) != 1 or not args.contact_sheet:
            parser.error("--source-file requires exactly one --slug and --contact-sheet.")
        if args.categoria or args.limit or args.replace:
            parser.error("--source-file is one unpublished producer at a time; drop category, limit, and replace options.")
        if args.subject == "photo" and not args.allow_photos:
            parser.error("--subject photo requires --allow-photos.")
        parsed_reference = urlparse(args.source_reference)
        if (
            len(args.source_reference) > MAX_URL_CHARS
            or parsed_reference.scheme not in {"http", "https"}
            or not parsed_reference.hostname
            or parsed_reference.username is not None
            or parsed_reference.password is not None
        ):
            parser.error("--source-reference must be an absolute credential-free HTTP(S) URL.")

    if args.inventory:
        if not args.country:
            parser.error("--inventory requires --country.")
        if any(
            (
                args.area,
                args.apply,
                args.replace,
                args.allow_photos,
                args.slug,
                args.candidate,
                args.categoria,
                args.from_dir,
                args.decisions,
                args.report,
                args.contact_sheet,
                args.source_file,
                args.source_reference,
                args.subject,
            )
        ):
            parser.error("--inventory is a read-only country report and cannot be combined with sweep/apply options.")
        try:
            inventory = country_image_inventory(root, args.country)
        except (OSError, ValueError) as exc:
            parser.error(str(exc))
        print(json.dumps(inventory, ensure_ascii=False, indent=2))
        return 0

    try:
        csv_path = find_csv_path(root, args.area, args.country)
    except ValueError as exc:
        parser.error(str(exc))

    # The destination is always canonical and derived from the registry path.
    catalog_path = csv_path.relative_to(root).as_posix()
    asset_dir = csv_path.relative_to(root / "data" / "csv").with_suffix("").as_posix()
    output_dir = root / "public" / "productores" / asset_dir
    try:
        _, rows, original_csv_bytes, original_csv = read_csv(csv_path)
    except ValueError as exc:
        parser.error(str(exc))
    try:
        for row in rows:
            require_canonical_slug(clean_cell(row.get("slug")), "current CSV slug")
    except ValueError as exc:
        parser.error(str(exc))
    category_needle = fold_accents(clean_cell(args.categoria)) if args.categoria else ""
    if category_needle:
        selected = sorted(
            {
                category
                for row in rows
                for category in row_categories(row)
                if category_needle in fold_accents(category)
            }
        )
        if not selected:
            available = sorted({category for row in rows for category in row_categories(row)})
            parser.error(
                f"no category in {csv_path.stem} matches '{args.categoria}'. "
                f"This area has: {', '.join(available)}"
            )

    decisions: list[tuple[str, str]] = []
    if args.decisions:
        try:
            decisions = read_decisions(Path(args.decisions))
        except (OSError, ValueError) as exc:
            parser.error(str(exc))
    elif args.apply:
        decisions = [(args.slug[0], args.candidate.lower())]

    wanted_slugs = set(args.slug) | {slug for slug, _ in decisions}
    known_slugs = {clean_cell(row.get("slug")) for row in rows}
    unknown_slugs = wanted_slugs - known_slugs
    if unknown_slugs:
        parser.error(f"unknown slug(s) in {args.area}: {', '.join(sorted(unknown_slugs))}")

    if wanted_slugs and not args.replace and not args.decisions:
        already_filled = [
            clean_cell(row.get("slug"))
            for row in rows
            if clean_cell(row.get("slug")) in wanted_slugs and clean_cell(row.get("imagen"))
        ]
        if already_filled:
            parser.error(
                f"slug(s) already have imagen: {', '.join(already_filled)}; inspect first and pass --replace explicitly"
            )

    if args.from_dir:
        sheet_source = Path(args.from_dir)
        if not sheet_source.is_absolute():
            sheet_source = root / sheet_source
        published = {
            clean_cell(row.get("slug")): clean_cell(row.get("imagen"))
            for row in rows
            if clean_cell(row.get("imagen"))
        }
        print(f"APPLY (offline): {csv_path.relative_to(root)} -> /productores/{asset_dir}/")
        return apply_reviewed(
            csv_path,
            catalog_path,
            asset_dir,
            output_dir,
            original_csv,
            original_csv_bytes,
            rows,
            sheet_source,
            decisions,
            published,
            args.replace,
            args.allow_photos,
        )

    sheet_dir: Path | None = None
    if args.contact_sheet:
        sheet_dir = Path(args.contact_sheet)
        if not sheet_dir.is_absolute():
            sheet_dir = root / sheet_dir
        if sheet_dir.resolve().is_relative_to((root / "public").resolve()):
            parser.error("contact sheets are review artifacts and cannot be written under public/.")
        if sheet_dir.exists() and any(sheet_dir.iterdir()):
            parser.error(
                f"contact-sheet directory must be empty: {sheet_dir}. "
                "To apply an area you already swept, run --apply --from that directory instead."
            )

    report_path: Path | None = None
    if args.report:
        report_path = Path(args.report)
        if not report_path.is_absolute():
            report_path = root / report_path
        if report_path.resolve().is_relative_to((root / "public").resolve()):
            parser.error("reports are review artifacts and cannot be written under public/.")
        if sheet_dir is not None and report_path.resolve().is_relative_to(sheet_dir.resolve()):
            parser.error("--report must be outside --contact-sheet; candidates.json already contains the report.")

    manual_source_path: Path | None = None
    if args.source_file:
        manual_source_path = Path(args.source_file)
        if not manual_source_path.is_absolute():
            manual_source_path = root / manual_source_path
        manual_source_path = manual_source_path.resolve()
        if manual_source_path.is_relative_to((root / "public").resolve()):
            parser.error("--source-file must be a review input outside public/.")
        if not manual_source_path.is_file():
            parser.error(f"--source-file is not a regular file: {manual_source_path}")
        if manual_source_path.stat().st_size > MAX_IMAGE_BYTES:
            parser.error(f"--source-file exceeds the {MAX_IMAGE_BYTES} byte limit.")

    report: list[dict[str, object]] = []
    digest_owners: dict[str, list[str]] = {}
    composed_owners: dict[str, set[str]] = {}
    manifest_rows: dict[str, dict[str, object]] = {}
    sheet_entries: list[tuple[str, str, str]] = []
    updated = 0
    inspected = 0

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"{mode}: {csv_path.relative_to(root)} -> /productores/{asset_dir}/")
    if category_needle:
        eligible = len(
            [
                row
                for row in rows
                if category_matches(row, category_needle)
                and (not wanted_slugs or clean_cell(row.get("slug")) in wanted_slugs)
                and (args.replace or not clean_cell(row.get("imagen")))
                and clean_cell(row.get("web")).startswith(("http://", "https://"))
            ]
        )
        if args.limit is not None:
            eligible = min(eligible, args.limit)
        print(f"Category {args.categoria!r} -> {', '.join(selected)}: {eligible} row(s) to sweep")
    if not args.apply:
        print("No CSV or public assets will be written. Apply only explicit, reviewed candidate digests.")

    for index, row in enumerate(rows, start=1):
        slug = clean_cell(row.get("slug"))
        name = clean_cell(row.get("nombre"))
        web_url = clean_cell(row.get("web"))
        current_image = clean_cell(row.get("imagen"))

        if wanted_slugs and slug not in wanted_slugs:
            continue
        if category_needle and not category_matches(row, category_needle):
            continue
        if current_image and not args.replace:
            continue
        if manual_source_path is None and not web_url.startswith(("http://", "https://")):
            manifest_rows[slug] = {
                "producer_id": clean_cell(row.get("producer_id")),
                "web": web_url,
                "candidates": [],
            }
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

        manifest_rows[slug] = {
            "producer_id": clean_cell(row.get("producer_id")),
            "web": web_url,
            "candidates": [],
        }
        inspected += 1
        print(f"[{index}/{len(rows)}] {name} ({slug})")
        if manual_source_path is not None:
            candidates = [
                Candidate(
                    source="manual-file",
                    url=args.source_reference,
                    subject=args.subject,
                    evidence="reviewer-supplied local file",
                    score=200,
                )
            ]
            candidate_error = None
            page = None
        else:
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
        row_digests: dict[str, list[str]] = {}
        reviewable_count = 0
        unreadable_count = 0
        for candidate in candidates:
            if candidate.score < args.threshold:
                continue
            if candidate.subject != "logo" and not args.allow_photos:
                continue

            if reviewable_count >= args.max_candidates:
                break
            if unreadable_count >= MAX_UNREADABLE_CANDIDATES:
                print(f"  stopped after {unreadable_count} unreadable candidates")
                break

            if manual_source_path is not None:
                candidate_info, preview = inspect_local_candidate(candidate, manual_source_path)
            else:
                candidate_info, preview = inspect_candidate(candidate, args.timeout, page)
            digest = clean_cell(candidate_info.get("digest"))

            # A favicon at three sizes and a CDN width parameter normalize to
            # the same composition. Showing those pixels twice spends the one
            # resource that does not scale: the reviewer looking at the sheet.
            if digest and digest in row_digests:
                row_digests[digest].append(candidate_info["url"])
                print_candidate_summary(candidate_info, prefix="  = same composition,")
                continue

            row_report["candidates"].append(candidate_info)
            print_candidate_summary(candidate_info)

            if preview is None:
                unreadable_count += 1
                continue

            reviewable_count += 1

            if digest:
                asset_bytes = encode_webp(preview)
                row_digests[digest] = []
                candidate_info["same_composition_urls"] = row_digests[digest]
                composed_owners.setdefault(digest, set()).add(f"{name} ({slug})")
                if sheet_dir is not None:
                    save_composition(sheet_dir, digest, preview, asset_bytes)
                manifest_rows[slug]["candidates"].append(
                    {
                        "digest": digest,
                        "asset_sha256": hashlib.sha256(asset_bytes).hexdigest(),
                        "subject": candidate.subject,
                        "source": candidate_info["source"],
                        "url": candidate_info["url"],
                        "resolved_url": candidate_info.get("resolved_url"),
                        "score": candidate_info["score"],
                        "source_width": candidate_info["source_width"],
                        "source_height": candidate_info["source_height"],
                    }
                )

            if args.contact_sheet:
                sheet_entries.append(
                    (
                        digest,
                        f"{name} ({slug})",
                        f"id={digest[:12]} {candidate.source} {candidate.subject} "
                        f"{candidate_info['source_width']}x{candidate_info['source_height']} score={candidate.score}",
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
                try:
                    output_path = output_path_for_slug(output_dir, slug)
                    updated_csv = update_csv_image(original_csv, slug, image_path)
                    write_selected_image(
                        csv_path,
                        original_csv_bytes,
                        updated_csv,
                        output_path,
                        selected_image,
                        replace_existing=args.replace,
                    )
                except (OSError, RuntimeError, ValueError) as exc:
                    print(f"  apply failed: {exc}")
                    row_report["status"] = "failed"
                    row_report["error"] = error_text(exc)
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
        if page is not None:
            page.session.close()
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

    # One composition offered to several producers is a useful review signal.
    # It can reveal a collective site, template asset or parent brand, but a
    # group or multi-site producer may also share identity legitimately.
    shared = {digest for digest, owners in composed_owners.items() if len(owners) > 1}

    if sheet_dir is not None:
        sheet_dir.mkdir(parents=True, exist_ok=True)
        cache = composition_cache_dir(sheet_dir)
        cache.mkdir(parents=True, exist_ok=True)
        reviewed_asset_cache_dir(sheet_dir).mkdir(parents=True, exist_ok=True)
        written = (
            write_cached_contact_sheets(sheet_entries, sheet_dir, shared, composed_owners)
            if sheet_entries
            else []
        )
        candidate_report = write_sweep_manifest(
            sheet_dir,
            catalog_path,
            asset_dir,
            original_csv_bytes,
            manifest_rows,
            report,
        )
        print(f"\n{len(sheet_entries)} composition(s) rendered to {len(written)} sheet(s) in {sheet_dir}")
        print(f"Candidate digests and source URLs: {candidate_report}")
        print(f"Reviewed compositions kept in {cache} for --apply --from {sheet_dir}")
        if shared:
            print(
                f"{len(shared)} composition(s) marked SHARED: review the source URL and exact producer identity."
            )
        print("Review the sheets before --apply.")

    if report_path is not None:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Report written to {report_path}")

    print(f"Done. inspected={inspected} updated={updated}")
    return 1 if args.apply and updated != 1 else 0


if __name__ == "__main__":
    raise SystemExit(main())
