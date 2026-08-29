#!/usr/bin/env python3
"""Network-free regression tests for the pure parts of enrich:images."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
from contextlib import redirect_stdout
from io import BytesIO, StringIO
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "enrich-producer-images.py"

try:
    from PIL import Image
except ModuleNotFoundError:
    print(
        "Skipping enrich:images tests: image tooling not installed "
        "(python3 -m pip install -r scripts/requirements-image-tools.txt).",
    )
    raise SystemExit(0)

spec = importlib.util.spec_from_file_location("enrich_producer_images", SCRIPT)
enrich = importlib.util.module_from_spec(spec)
sys.modules["enrich_producer_images"] = enrich
try:
    spec.loader.exec_module(enrich)
except SystemExit:
    print("Skipping enrich:images tests: image tooling not installed.")
    raise SystemExit(0)

failures: list[str] = []


def check(label: str, actual, expected) -> None:
    if actual != expected:
        failures.append(f"{label}\n    expected: {expected!r}\n    actual:   {actual!r}")


def visible_pixels(image: Image.Image) -> list[tuple[int, int, int, int]]:
    return [px for px in image.getdata() if px[3] > 32]


# --- stale URLs in the `web` column are not dead sites -----------------------
variants = enrich.home_variants("http://example.com/")
check("home_variants tries https", "https://example.com/" in variants, True)
check("home_variants tries www", "https://www.example.com/" in variants, True)
check("home_variants keeps the original first", variants[0], "http://example.com/")

# --- network fetches stay public and bounded --------------------------------
for unsafe_url in (
    "http://127.0.0.1/",
    "http://[::1]/",
    "http://10.0.0.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://localhost/",
    "http://service.internal/",
    "http://user:secret@8.8.8.8/",
):
    check(f"blocks non-public URL {unsafe_url}", enrich.public_url_error(unsafe_url) is not None, True)
check("a global IP is eligible for a bounded fetch", enrich.public_url_error("https://8.8.8.8/"), None)


class FakeResponse:
    def __init__(self, status_code=200, *, url="https://8.8.8.8/", headers=None, chunks=()):
        self.status_code = status_code
        self.url = url
        self.headers = headers or {}
        self._chunks = list(chunks)
        self._content = b""
        self.closed = False

    @property
    def content(self):
        return self._content

    @property
    def text(self):
        return self._content.decode("utf-8", errors="replace")

    def iter_content(self, chunk_size):
        del chunk_size
        yield from self._chunks

    def close(self):
        self.closed = True


class FakeGetter:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def get(self, url, **kwargs):
        self.calls.append((url, kwargs))
        return self.responses.pop(0)


public_info = (
    enrich.socket.AF_INET,
    enrich.socket.SOCK_STREAM,
    6,
    "",
    ("93.184.216.34", 443),
)
private_info = (
    enrich.socket.AF_INET,
    enrich.socket.SOCK_STREAM,
    6,
    "",
    ("127.0.0.1", 443),
)
dns_calls = 0


def rebinding_resolver(host, port, *args, **kwargs):
    del host, port, args, kwargs
    global dns_calls
    dns_calls += 1
    return [public_info if dns_calls == 1 else private_info]


class ResolvingGetter:
    def __init__(self):
        self.connected_addresses = []

    def get(self, url, **kwargs):
        del kwargs
        self.connected_addresses = enrich.socket.getaddrinfo(
            "rebind.example",
            443,
            type=enrich.socket.SOCK_STREAM,
        )
        return FakeResponse(url=url, chunks=[b"safe"])


original_getaddrinfo = enrich.socket.getaddrinfo
enrich.socket.getaddrinfo = rebinding_resolver
rebind_getter = ResolvingGetter()
try:
    response, error = enrich.bounded_get(
        rebind_getter,
        "https://rebind.example/",
        {},
        1,
        1024,
    )
finally:
    enrich.socket.getaddrinfo = original_getaddrinfo
check("DNS rebinding cannot change the address used for the connection", error, None)
check("the request uses the public preflight address", rebind_getter.connected_addresses, [public_info])
check("the hostname is resolved only once before the connection", dns_calls, 1)


idn_dns_calls = 0
idn_resolver_hosts: list[str] = []


def idn_rebinding_resolver(host, port, *args, **kwargs):
    del port, args, kwargs
    global idn_dns_calls
    idn_dns_calls += 1
    idn_resolver_hosts.append(host)
    return [public_info if idn_dns_calls == 1 else private_info]


class IdnResolvingGetter:
    def __init__(self):
        self.connected_addresses = []

    def get(self, url, **kwargs):
        del kwargs
        # Requests prepares faß.de as xn--fa-hia.de. The DNS pin must compare
        # against that same IDNA 2008/UTS 46 form, not Python's IDNA 2003
        # mapping (fass.de), or this lookup would escape to the second result.
        self.connected_addresses = enrich.socket.getaddrinfo(
            "xn--fa-hia.de",
            443,
            type=enrich.socket.SOCK_STREAM,
        )
        return FakeResponse(url=url, chunks=[b"safe"])


enrich.socket.getaddrinfo = idn_rebinding_resolver
idn_getter = IdnResolvingGetter()
try:
    response, error = enrich.bounded_get(
        idn_getter,
        "https://faß.de/",
        {},
        1,
        1024,
    )
finally:
    enrich.socket.getaddrinfo = original_getaddrinfo
check("IDN DNS rebinding cannot escape the pinned address", error, None)
check("the IDN request uses the public preflight address", idn_getter.connected_addresses, [public_info])
check("the Unicode hostname is resolved in Requests' UTS 46 form", idn_resolver_hosts, ["xn--fa-hia.de"])
check("the IDN hostname is resolved only once before the connection", idn_dns_calls, 1)


redirect_getter = FakeGetter(
    [FakeResponse(302, headers={"Location": "http://127.0.0.1/private"})]
)
response, error = enrich.bounded_get(
    redirect_getter,
    "https://8.8.8.8/",
    {},
    1,
    1024,
)
check("a redirect to loopback is refused", response, None)
check("a redirect is validated before the second request", "non-public destination" in error, True)
check("an unsafe redirect triggers only one request", len(redirect_getter.calls), 1)

length_getter = FakeGetter(
    [FakeResponse(headers={"Content-Length": "5"}, chunks=[b"12345"])]
)
response, error = enrich.bounded_get(length_getter, "https://8.8.8.8/", {}, 1, 4)
check("Content-Length over the cap is refused", response, None)
check("Content-Length refusal explains the byte limit", "byte limit" in error, True)

stream_getter = FakeGetter([FakeResponse(chunks=[b"123", b"45"])])
response, error = enrich.bounded_get(stream_getter, "https://8.8.8.8/", {}, 1, 4)
check("streamed bodies cannot exceed the cap", response, None)
check("stream cap refusal explains the byte limit", "byte limit" in error, True)

html = b'<html><header><img src="/logo.png" alt="Bodegas Gormaz"></header></html>'
html_session = FakeGetter([FakeResponse(chunks=[html])])
original_session_factory = enrich.requests.Session
enrich.requests.Session = lambda: html_session
try:
    extracted, extraction_error, _ = enrich.get_image_candidates(
        "https://8.8.8.8/",
        1,
        "Bodegas Gormaz",
    )
finally:
    enrich.requests.Session = original_session_factory
check("bounded HTML still reaches candidate extraction", extraction_error, None)
check(
    "HTML extraction retains the producer header logo",
    any(
        candidate.url == "https://8.8.8.8/logo.png"
        and candidate.source == "logo-img"
        and candidate.subject == "logo"
        for candidate in extracted
    ),
    True,
)

# --- thumbnail -> original ---------------------------------------------------
check(
    "WordPress size suffix is stripped",
    "https://x.es/logo-olivo.png" in enrich.upstream_variants("https://x.es/logo-olivo-150x150.png"),
    True,
)
wix = enrich.upstream_variants("https://static.wixstatic.com/media/a~mv2.jpeg/v1/fill/w_568,h_192,al_c/L.jpeg")
check("Wix transform is enlarged, not removed", any("w_1600,h_541" in url for url in wix), True)
check("Wix transform is never stripped", any("/v1/fill/" not in url for url in wix), False)
check(
    "Shopify size suffix is stripped",
    "https://cdn.shopify.com/logo.png" in enrich.upstream_variants("https://cdn.shopify.com/logo_300x300.png"),
    True,
)

# --- the parent-company trap -------------------------------------------------
# Real case: viñedosybodegasgormaz's site is the group's, and its top-scoring
# asset was logo-Hispano.png (HispanoBodegas). Same shape for Cárnicas Villar /
# Costa Food, Monte Pinos / Vichy Catalan, Atalaya / Viñas Familia Gil.
gormaz = enrich.name_tokens("Viñedos y Bodegas Gormaz")
check("generic words are not identity", gormaz, {"gormaz"})
check(
    "parent company logo does not match the producer",
    enrich.matches_producer_name("https://h.com/logo-Hispano.png", "", gormaz),
    False,
)
check(
    "the producer's own logo matches",
    enrich.matches_producer_name("https://h.com/gormaz-logo.png", "", gormaz),
    True,
)
check("accents fold", enrich.matches_producer_name("https://x/anavieja.png", "", enrich.name_tokens("Añavieja")), True)
check(
    "alt text counts as evidence",
    enrich.matches_producer_name("https://x/header-2.png", "Quesería Tierras Altas", enrich.name_tokens("Tierras Altas")),
    True,
)
own = enrich.score_candidate("logo-img", "https://x/gormaz-logo.png", "logo", "Bodegas Gormaz")
parent = enrich.score_candidate("logo-img", "https://x/logo-Hispano.png", "logo", "Bodegas Gormaz")
check("the producer's logo outranks the parent's", own > parent, True)

# Generic brand/product wording is not visual-subject evidence. A named image
# in the site's header is, even when its filename and class say nothing useful.
check(
    "a product path containing brand stays a photo",
    enrich.infer_subject("page-img", "https://x/product-brand-reserva.jpg", "marca destacada"),
    "photo",
)
check(
    "catalogo does not contain the logo identity token",
    enrich.contains_logo_hint("/catalogo/quesos.jpg"),
    False,
)
header_soup = enrich.BeautifulSoup(
    '<header><img src="img-01.png" alt="Bodegas Gormaz"></header>',
    "html.parser",
)
product_soup = enrich.BeautifulSoup(
    '<main><img src="reserva.jpg" class="product-brand" alt="Bodegas Gormaz Reserva"></main>',
    "html.parser",
)
check(
    "a producer-named header image is not silently declared a logo",
    enrich.image_is_logo_candidate(header_soup.img, "Bodegas Gormaz", "Bodegas Gormaz"),
    False,
)
check(
    "a producer-named header image remains an ambiguous review candidate",
    enrich.image_is_ambiguous_identity_candidate(
        header_soup.img,
        "Bodegas Gormaz",
        "Bodegas Gormaz",
        "https://x/img-01.png",
    ),
    True,
)
check(
    "a producer-named product image is not automatically a logo",
    enrich.image_is_logo_candidate(product_soup.img, "product-brand Bodegas Gormaz Reserva", "Bodegas Gormaz"),
    False,
)
hero_soup = enrich.BeautifulSoup(
    '<header><img src="hero-banner.jpg" alt="Bodegas Gormaz"></header>',
    "html.parser",
)
check(
    "a producer-named header hero still requires photo permission",
    enrich.image_is_logo_candidate(
        hero_soup.img,
        "Bodegas Gormaz",
        "Bodegas Gormaz",
        "https://x/hero-banner.jpg",
    ),
    False,
)
check(
    "a header hero is not promoted even as ambiguous identity",
    enrich.image_is_ambiguous_identity_candidate(
        hero_soup.img,
        "Bodegas Gormaz",
        "Bodegas Gormaz",
        "https://x/hero-banner.jpg",
    ),
    False,
)
check(
    "an explicitly classified logo keeps precedence over generic photo tokens",
    enrich.infer_subject("logo-img", "https://x/hero-banner.jpg", "Bodegas Gormaz"),
    "logo",
)
check(
    "weak header identity remains unknown until explicit review",
    enrich.infer_subject("identity-img", "https://x/family-cellar.jpg", "Bodegas Gormaz"),
    "unknown",
)
hostname_logo_soup = enrich.BeautifulSoup(
    '<main><img src="https://logo.example/family-cellar.jpg" alt="Family at cellar"></main>',
    "html.parser",
)
check(
    "a hostname containing logo is not identity evidence",
    enrich.image_is_logo_candidate(
        hostname_logo_soup.img,
        "Family at cellar",
        "Bodegas Gormaz",
        "https://logo.example/family-cellar.jpg",
    ),
    False,
)

# --- an unusable asset is not an asset ---------------------------------------
check("64px sources are rejected", enrich.MIN_ACCEPTED_LONG_EDGE >= 200, True)

pixel_buffer = BytesIO()
Image.new("RGB", (3, 2), (10, 20, 30)).save(pixel_buffer, "PNG")
original_pixel_limit = enrich.MAX_SOURCE_PIXELS
enrich.MAX_SOURCE_PIXELS = 5
try:
    oversized, oversized_error = enrich.open_candidate_image(
        "https://8.8.8.8/source.png",
        pixel_buffer.getvalue(),
        "image/png",
    )
finally:
    enrich.MAX_SOURCE_PIXELS = original_pixel_limit
check("decoded source dimensions are bounded before load", oversized, None)
check("pixel-limit refusal identifies the dimensions", "too many pixels" in oversized_error, True)

if enrich.HAS_CAIROSVG:
    external_svg = (
        b'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">'
        b'<image href="http://127.0.0.1/private.png" width="400" height="300"/>'
        b"</svg>"
    )
    external_image, external_error = enrich.open_candidate_image(
        "https://8.8.8.8/logo.svg",
        external_svg,
        "image/svg+xml",
    )
    check("SVG rendering cannot fetch external resources", external_image, None)
    check("SVG external-resource refusal is explicit", "external SVG resource" in external_error, True)

    extreme_svg = (
        b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1000000">'
        b'<rect width="1" height="1000000" fill="black"/></svg>'
    )
    extreme_image, extreme_error = enrich.open_candidate_image(
        "https://8.8.8.8/extreme.svg",
        extreme_svg,
        "image/svg+xml",
    )
    check("an extreme SVG is refused before rendering", extreme_image, None)
    check("an extreme SVG refusal identifies its aspect ratio", "aspect ratio" in extreme_error, True)

    misleading_viewbox_svg = (
        b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1000000" viewBox="0 0 100 100">'
        b'<rect width="100" height="100" fill="black"/></svg>'
    )
    misleading_image, misleading_error = enrich.open_candidate_image(
        "https://8.8.8.8/misleading.svg",
        misleading_viewbox_svg,
        "image/svg+xml",
    )
    check("explicit SVG dimensions cannot hide behind a safe viewBox", misleading_image, None)
    check("explicit SVG dimensions are checked before Cairo", "aspect ratio" in misleading_error, True)

    commented_root_svg = (
        b'<!-- <svg width="100" height="100"></svg> -->'
        b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1000000"></svg>'
    )
    commented_image, commented_error = enrich.open_candidate_image(
        "https://8.8.8.8/commented-root.svg",
        commented_root_svg,
        "image/svg+xml",
    )
    check("a commented fake root cannot bypass SVG dimensions", commented_image, None)
    check("the parsed SVG root controls the preflight", "aspect ratio" in commented_error, True)

    portrait_svg = (
        b'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">'
        b'<rect width="300" height="400" fill="black"/></svg>'
    )
    portrait_image, portrait_error = enrich.open_candidate_image(
        "https://8.8.8.8/portrait.svg",
        portrait_svg,
        "image/svg+xml",
    )
    check("a bounded portrait SVG remains usable", portrait_error, None)
    check("SVG rendering caps the long edge before allocation", max(portrait_image.size), 1600)
    portrait_image.close()

# --- background removal must not eat the lettering ---------------------------
# White logotype on a white plate: the plate reaches the border, the lettering
# does not. A global threshold cannot tell them apart.
plate = Image.new("RGBA", (40, 40), (255, 255, 255, 255))
for x in range(15, 25):
    for y in range(15, 25):
        plate.putpixel((x, y), (255, 255, 255, 255))
for x in range(10, 30):  # dark ring enclosing the white centre
    plate.putpixel((x, 12), (10, 10, 10, 255))
    plate.putpixel((x, 28), (10, 10, 10, 255))
for y in range(12, 29):
    plate.putpixel((10, y), (10, 10, 10, 255))
    plate.putpixel((29, y), (10, 10, 10, 255))
keyed = enrich.chromakey_near_white(plate)
check("border-connected background is dropped", keyed.getpixel((0, 0))[3], 0)
check("white enclosed by dark ink survives", keyed.getpixel((20, 20))[3], 255)

# --- low-contrast tint must be topological, not proportional -----------------
# Measured on Soria: La Loba is 48% near-white and must NOT be tinted (counters
# inside the grapes); El Beato is 27% and must be (its lettering). No global
# proportion separates them.
lettering = Image.new("RGBA", (30, 30), (0, 0, 0, 0))
for x in range(10, 20):
    for y in range(10, 20):
        lettering.putpixel((x, y), (255, 255, 255, 255))  # free-standing white ink
tinted = enrich.tint_low_contrast_logo(lettering.copy())
check(
    "white ink sitting on the canvas is darkened",
    enrich.luminance(*tinted.getpixel((15, 15))[:3]) < enrich.PALE_LUMINANCE,
    True,
)

counter = Image.new("RGBA", (30, 30), (0, 0, 0, 0))
for x in range(5, 25):
    for y in range(5, 25):
        counter.putpixel((x, y), (10, 10, 10, 255))  # dark body
for x in range(12, 18):
    for y in range(12, 18):
        counter.putpixel((x, y), (255, 255, 255, 255))  # enclosed white counter
untouched = enrich.tint_low_contrast_logo(counter.copy())
check(
    "white enclosed by dark ink is left as designed",
    untouched.getpixel((15, 15))[:3],
    (255, 255, 255),
)

# --- a photo is never chromakeyed or tinted ----------------------------------
photo = Image.new("RGBA", (640, 480), (250, 250, 250, 255))
covered, info = enrich.cover_photo(photo)
check("cover_photo fills the canvas", covered.size, enrich.CANVAS_SIZE)
check("cover_photo reports no chromakey", info["chromakey_applied"], False)

try:
    enrich.cover_photo(Image.new("RGBA", (400, 300), (250, 250, 250, 255)))
except ValueError as exc:
    check("photos are never upscaled beyond 3x", "maximum 3x" in str(exc), True)
else:
    failures.append("photos are never upscaled beyond 3x\n    expected ValueError")

# The approved ID belongs to the rendered result. The same downloaded bytes
# classified as a logo and as a photo produce different candidates.
shared_asset_url = "https://example.com/shared.png"


def fresh_shared_asset(*_args, **_kwargs):
    return (
        enrich.Asset(
            image=Image.new("RGB", (640, 480), (120, 60, 30)),
            data=b"same downloaded bytes",
            content_type="image/png",
            url=shared_asset_url,
        ),
        None,
    )


original_fetch_best_asset = enrich.fetch_best_asset
enrich.fetch_best_asset = fresh_shared_asset
try:
    logo_info, _ = enrich.inspect_candidate(
        enrich.Candidate("logo-img", shared_asset_url, "logo", "", 100), 1
    )
    photo_info, _ = enrich.inspect_candidate(
        enrich.Candidate("og:image", shared_asset_url, "photo", "", 50), 1
    )
finally:
    enrich.fetch_best_asset = original_fetch_best_asset
check("the same source keeps one source digest", logo_info["source_digest"], photo_info["source_digest"])
check("different reviewed compositions have different IDs", logo_info["digest"] != photo_info["digest"], True)

# --- updating imagen preserves unrelated and future columns byte-for-byte ----
raw_csv = (
    "slug,nombre,imagen,nota\n"
    'uno,"Nombre, con coma",,"texto, citado"\n'
    "dos,Otro,,sin cambios\n"
)
updated_csv = enrich.update_csv_image(raw_csv, "uno", "/productores/xx/region/area/uno.webp")
check(
    "only the imagen cell changes",
    updated_csv,
    raw_csv.replace(",,\"texto, citado\"", ",/productores/xx/region/area/uno.webp,\"texto, citado\""),
)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    image_path = temp / "uno.webp"
    csv_path.write_text(raw_csv, encoding="utf-8", newline="")
    enrich.write_selected_image(
        csv_path,
        raw_csv.encode("utf-8"),
        updated_csv,
        image_path,
        Image.new("RGB", enrich.CANVAS_SIZE, (243, 240, 232)),
    )
    check("staged writer keeps surgical CSV output", csv_path.read_text(encoding="utf-8"), updated_csv)
    check("staged writer creates the reviewed image", image_path.exists(), True)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-concurrent-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    image_path = temp / "uno.webp"
    csv_path.write_text(raw_csv + "tres,Nuevo,,\n", encoding="utf-8", newline="")
    try:
        enrich.write_selected_image(
            csv_path,
            raw_csv.encode("utf-8"),
            updated_csv,
            image_path,
            Image.new("RGB", enrich.CANVAS_SIZE, (243, 240, 232)),
        )
    except RuntimeError as exc:
        check("concurrent CSV changes abort the write", "nothing was written" in str(exc), True)
    else:
        failures.append("concurrent CSV changes abort the write\n    expected RuntimeError")
    check("concurrent abort leaves no image", image_path.exists(), False)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-rollback-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    first_path = temp / "uno.webp"
    second_path = temp / "dos.webp"
    csv_path.write_text(raw_csv, encoding="utf-8", newline="")
    first_path.write_bytes(b"existing-one")
    second_path.write_bytes(b"existing-two")
    original_replace_file = enrich.replace_file
    replace_calls = 0

    def fail_second_replace(source, target):
        global replace_calls
        replace_calls += 1
        if replace_calls == 2:
            raise OSError("injected second replace failure")
        original_replace_file(source, target)

    enrich.replace_file = fail_second_replace
    try:
        enrich.write_selected_images(
            csv_path,
            raw_csv.encode("utf-8"),
            updated_csv,
            [
                (first_path, Image.new("RGB", enrich.CANVAS_SIZE, (10, 20, 30))),
                (second_path, Image.new("RGB", enrich.CANVAS_SIZE, (40, 50, 60))),
            ],
            replace_existing=True,
        )
    except OSError as exc:
        check("a reported replacement failure propagates", "injected second replace" in str(exc), True)
    else:
        failures.append("a reported replacement failure propagates\n    expected OSError")
    finally:
        enrich.replace_file = original_replace_file
    check("rollback leaves the CSV unchanged", csv_path.read_text(encoding="utf-8"), raw_csv)
    check("rollback restores the first replaced asset", first_path.read_bytes(), b"existing-one")
    check("rollback preserves the second asset", second_path.read_bytes(), b"existing-two")
    check("rollback cleans staging files", list(temp.glob(".*.tmp*")), [])

with tempfile.TemporaryDirectory(prefix="chisan-enrich-late-concurrent-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    image_path = temp / "uno.webp"
    concurrent_csv = raw_csv.replace("sin cambios", "edición concurrente")
    csv_path.write_text(raw_csv, encoding="utf-8", newline="")
    image_path.write_bytes(b"existing-image")
    original_replace_file = enrich.replace_file

    def edit_csv_after_asset_swap(source, target):
        original_replace_file(source, target)
        if target == image_path:
            csv_path.write_text(concurrent_csv, encoding="utf-8", newline="")

    enrich.replace_file = edit_csv_after_asset_swap
    try:
        enrich.write_selected_images(
            csv_path,
            raw_csv.encode("utf-8"),
            updated_csv,
            [(image_path, Image.new("RGB", enrich.CANVAS_SIZE, (70, 80, 90)))],
            replace_existing=True,
        )
    except RuntimeError as exc:
        check("a late concurrent CSV edit aborts before the final swap", "final swap" in str(exc), True)
    else:
        failures.append("a late concurrent CSV edit aborts before the final swap\n    expected RuntimeError")
    finally:
        enrich.replace_file = original_replace_file
    check("a late concurrent CSV edit is preserved", csv_path.read_text(encoding="utf-8"), concurrent_csv)
    check("a late concurrent CSV edit rolls back the asset", image_path.read_bytes(), b"existing-image")

with tempfile.TemporaryDirectory(prefix="chisan-enrich-existing-asset-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    image_path = temp / "uno.webp"
    csv_path.write_text(raw_csv, encoding="utf-8", newline="")
    image_path.write_bytes(b"orphan-or-concurrent-asset")
    try:
        enrich.write_selected_image(
            csv_path,
            raw_csv.encode("utf-8"),
            updated_csv,
            image_path,
            Image.new("RGB", enrich.CANVAS_SIZE, (20, 30, 40)),
        )
    except ValueError as exc:
        check("an existing asset requires explicit replacement", "--replace" in str(exc), True)
    else:
        failures.append("an existing asset requires explicit replacement\n    expected ValueError")
    check("an unapproved existing asset is preserved", image_path.read_bytes(), b"orphan-or-concurrent-asset")
    check("an existing-asset refusal leaves the CSV unchanged", csv_path.read_text(encoding="utf-8"), raw_csv)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-concurrent-asset-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    image_path = temp / "uno.webp"
    csv_path.write_text(raw_csv, encoding="utf-8", newline="")
    original_install_staged_file = enrich.install_staged_file

    def create_asset_before_install(source, target, replace_existing):
        if target == image_path:
            target.write_bytes(b"concurrent-asset")
        original_install_staged_file(source, target, replace_existing)

    enrich.install_staged_file = create_asset_before_install
    try:
        enrich.write_selected_image(
            csv_path,
            raw_csv.encode("utf-8"),
            updated_csv,
            image_path,
            Image.new("RGB", enrich.CANVAS_SIZE, (50, 60, 70)),
        )
    except FileExistsError:
        pass
    else:
        failures.append("a concurrently created asset cannot be overwritten\n    expected FileExistsError")
    finally:
        enrich.install_staged_file = original_install_staged_file
    check("a concurrently created asset is preserved", image_path.read_bytes(), b"concurrent-asset")
    check("a concurrent-asset refusal leaves the CSV unchanged", csv_path.read_text(encoding="utf-8"), raw_csv)

# --- dead icon families do not spend the review budget ----------------------
def run_candidate_budget_sweep(candidates: list[enrich.Candidate]) -> tuple[dict, list[str]]:
    """Exercise the real discovery loop without touching the network."""
    with tempfile.TemporaryDirectory(prefix="chisan-enrich-budget-") as temp_dir:
        temp = Path(temp_dir)
        csv_path = temp / "data" / "csv" / "zz" / "region" / "area.csv"
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        csv_path.write_text(
            "slug,nombre,web,imagen,producer_id\nuno,Uno,https://example.invalid/,,101\n",
            encoding="utf-8",
            newline="",
        )
        report_path = temp / "report.json"
        sheet_dir = temp / "sheet"
        inspected: list[str] = []

        original_repo_root = enrich.repo_root
        original_get_image_candidates = enrich.get_image_candidates
        original_inspect_candidate = enrich.inspect_candidate
        original_argv = sys.argv

        def inspect_without_network(candidate, _timeout, _page):
            inspected.append(candidate.url)
            info = {
                "score": candidate.score,
                "source": candidate.source,
                "subject": candidate.subject,
                "url": candidate.url,
                "resolved_url": candidate.url,
            }
            if candidate.url.endswith("/logo.png"):
                preview = Image.new("RGB", enrich.CANVAS_SIZE, (40, 80, 60))
                info.update(
                    {
                        "ok": True,
                        "error": None,
                        "source_width": 900,
                        "source_height": 900,
                        "source_digest": "a" * 64,
                        "digest": enrich.composed_digest(preview),
                    }
                )
                return info, preview
            info.update(
                {
                    "ok": False,
                    "error": "HTTP 404",
                    "source_width": None,
                    "source_height": None,
                    "source_digest": None,
                    "digest": None,
                }
            )
            return info, None

        enrich.repo_root = lambda: temp
        enrich.get_image_candidates = lambda *_args, **_kwargs: (candidates, None, None)
        enrich.inspect_candidate = inspect_without_network
        sys.argv = [
            "enrich-producer-images.py",
            "--area",
            "area",
            "--delay",
            "0",
            "--max-candidates",
            "1",
            "--report",
            str(report_path),
            "--contact-sheet",
            str(sheet_dir),
        ]
        try:
            with redirect_stdout(StringIO()):
                result = enrich.main()
        finally:
            enrich.repo_root = original_repo_root
            enrich.get_image_candidates = original_get_image_candidates
            enrich.inspect_candidate = original_inspect_candidate
            sys.argv = original_argv

        check("budget sweep exits successfully", result, 0)
        manifest = json.loads((sheet_dir / enrich.SWEEP_MANIFEST_FILENAME).read_text(encoding="utf-8"))
        report_row = json.loads(report_path.read_text(encoding="utf-8"))[0]
        check("a sweep writes a versioned manifest", manifest["version"], enrich.SWEEP_MANIFEST_VERSION)
        check("a sweep binds the producer identity", manifest["rows"]["uno"]["producer_id"], "101")
        check("a sweep binds the producer source", manifest["rows"]["uno"]["web"], "https://example.invalid/")
        check("the versioned manifest embeds the discovery report", manifest["report"], [report_row])
        check(
            "a sweep authorizes exactly its reviewable candidates",
            [
                (candidate["digest"], candidate["subject"])
                for candidate in manifest["rows"]["uno"]["candidates"]
            ],
            [
                (candidate["digest"], candidate["subject"])
                for candidate in report_row["candidates"]
                if candidate.get("ok")
            ],
        )
        reviewed_candidates = manifest["rows"]["uno"]["candidates"]
        if reviewed_candidates:
            reviewed_digest = reviewed_candidates[0]["digest"]
            check(
                "a sweep persists each reviewed composition before sheet rendering",
                (enrich.composition_cache_dir(sheet_dir) / f"{reviewed_digest}.png").is_file(),
                True,
            )
            check(
                "a sweep freezes each reviewed WebP before sheet rendering",
                (enrich.reviewed_asset_cache_dir(sheet_dir) / f"{reviewed_digest}.webp").is_file(),
                True,
            )
            check(
                "cached compositions can render a contact sheet in the same directory",
                (sheet_dir / "contact-sheet-01.png").is_file(),
                True,
            )
        return report_row, inspected


dead_icons = [
    enrich.Candidate("icon", f"https://example.invalid/icon-{index}.png", "logo", "", 100)
    for index in range(14)
]
real_logo = enrich.Candidate("page-img", "https://example.invalid/logo.png", "logo", "", 35)
report, inspected = run_candidate_budget_sweep([*dead_icons, real_logo])
check(
    "dead icons do not hide a later real logo",
    [candidate["url"] for candidate in report["candidates"] if candidate.get("ok")],
    [real_logo.url],
)
check("the real logo is inspected after the dead family", inspected[-1], real_logo.url)

too_many_dead_icons = [
    enrich.Candidate("icon", f"https://example.invalid/dead-{index}.png", "logo", "", 100)
    for index in range(enrich.MAX_UNREADABLE_CANDIDATES + 1)
]
bounded_report, bounded_inspected = run_candidate_budget_sweep([*too_many_dead_icons, real_logo])
check("failed requests stop at their own ceiling", len(bounded_inspected), enrich.MAX_UNREADABLE_CANDIDATES)
check("a fully unreadable run has no reviewable candidate", bounded_report["status"], "no-acceptable-candidates")

# --- apply is impossible without an explicit slug and candidate -------------
missing_slug = subprocess.run(
    [sys.executable, str(SCRIPT), "--area", "does-not-matter", "--apply", "--candidate", "a" * 12],
    capture_output=True,
    text=True,
    check=False,
)
check("apply requires exactly one slug", "--apply requires exactly one --slug" in missing_slug.stderr, True)

missing_candidate = subprocess.run(
    [sys.executable, str(SCRIPT), "--area", "does-not-matter", "--apply", "--slug", "one"],
    capture_output=True,
    text=True,
    check=False,
)
check("apply requires a reviewed candidate", "--apply requires the reviewed --candidate" in missing_candidate.stderr, True)

for flags, expected in (
    (["--from", "somewhere"], "--from and --decisions only apply reviewed work"),
    (["--apply", "--decisions", "d.txt"], "--decisions needs the --from directory"),
    (
        ["--apply", "--from", "d", "--decisions", "d.txt", "--slug", "one"],
        "--decisions carries its own slugs",
    ),
):
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--area", "does-not-matter", *flags],
        capture_output=True,
        text=True,
        check=False,
    )
    check(f"rejects {' '.join(flags)}", expected in result.stderr, True)

# --- an area resolves the way it gets asked for ----------------------------
check("accents fold to the slug", enrich.slugify_segment("Berlín"), "berlin")
check("case and spacing fold", enrich.slugify_segment("  Milano  "), "milano")
check("german sharp s expands", enrich.slugify_segment("Weißenfels"), "weissenfels")
check("punctuation collapses", enrich.slugify_segment("Valle d'Aosta"), "valle-d-aosta")
for unsafe_slug in ("../escape", "/absolute", "two/parts", "two\\parts", "Uppercase", "-leading"):
    try:
        enrich.require_canonical_slug(unsafe_slug)
    except ValueError:
        pass
    else:
        failures.append(f"rejects unsafe slug {unsafe_slug!r}\n    expected ValueError")

with tempfile.TemporaryDirectory(prefix="chisan-enrich-output-path-") as temp_dir:
    output_root = Path(temp_dir) / "area"
    check(
        "a canonical slug stays under the area output directory",
        enrich.output_path_for_slug(output_root, "safe-producer"),
        (output_root / "safe-producer.webp").resolve(),
    )

with tempfile.TemporaryDirectory(prefix="chisan-enrich-area-") as temp_dir:
    fake_root = Path(temp_dir)
    csv_root = fake_root / "data" / "csv"
    for country, region, area in (
        ("it", "lombardia", "milano"),
        ("de", "ost", "berlin"),
        ("us", "new-hampshire", "berlin"),
        ("us", "ohio", "milan"),
    ):
        (csv_root / country / region).mkdir(parents=True, exist_ok=True)
        (csv_root / country / region / f"{area}.csv").write_text("slug,imagen\n", encoding="utf-8")
    (csv_root / "it" / "country.json").write_text(
        '{"aliases": {"milan": "milano", "milano-citta": "milano"}}', encoding="utf-8"
    )

    check("an exact slug resolves", enrich.find_csv_path(fake_root, "milano").stem, "milano")
    check("country disambiguates a repeated area", enrich.find_csv_path(fake_root, "Berlín", "de").parts[-3], "de")
    check("country.json aliases resolve", enrich.find_csv_path(fake_root, "Milán", "it").stem, "milano")
    check("an alias resolves regardless of case", enrich.find_csv_path(fake_root, "MILAN", "it").stem, "milano")
    check("country can select the exact homonym", enrich.find_csv_path(fake_root, "Milan", "us").stem, "milan")

    try:
        enrich.find_csv_path(fake_root, "Milan")
    except ValueError as exc:
        check("an exact area cannot hide an alias in another country", "not globally unique" in str(exc), True)
        check("the exact-plus-alias ambiguity lists Italy", "data/csv/it/lombardia/milano.csv" in str(exc), True)
        check("the exact-plus-alias ambiguity lists the United States", "data/csv/us/ohio/milan.csv" in str(exc), True)
    else:
        failures.append("an exact area cannot hide an alias in another country\n    expected ValueError")

    try:
        enrich.find_csv_path(fake_root, "Berlín")
    except ValueError as exc:
        check("a repeated area is never silently dropped", "not globally unique" in str(exc), True)
        check("a repeated area tells the caller how to disambiguate", "--country" in str(exc), True)
        check("the ambiguity lists Germany", "data/csv/de/ost/berlin.csv" in str(exc), True)
        check("the ambiguity lists the United States", "data/csv/us/new-hampshire/berlin.csv" in str(exc), True)
    else:
        failures.append("a repeated area is never silently dropped\n    expected ValueError")

    try:
        enrich.find_csv_path(fake_root, "milanoo")
    except ValueError as exc:
        check("an unknown area suggests near slugs", "milano" in str(exc), True)
    else:
        failures.append("an unknown area suggests near slugs\n    expected ValueError")

# --- a category is matched the way it gets asked for -----------------------
cheese_row = {"categoria": "Lácteos y quesos", "categorias adicionales": "Miel|Conservas"}
check("the extra column counts", enrich.row_categories(cheese_row), ["Lácteos y quesos", "Miel", "Conservas"])
check("a loose word matches", enrich.category_matches(cheese_row, enrich.fold_accents("quesos")), True)
check("an accented query matches", enrich.category_matches(cheese_row, enrich.fold_accents("lácteos")), True)
check("an additional category matches", enrich.category_matches(cheese_row, enrich.fold_accents("miel")), True)
check("an absent category does not match", enrich.category_matches(cheese_row, enrich.fold_accents("vino")), False)

# --- country inventory closes every missing-image source lane ---------------
with tempfile.TemporaryDirectory(prefix="chisan-enrich-inventory-") as temp_dir:
    inventory_root = Path(temp_dir)
    first_area = inventory_root / "data" / "csv" / "zz" / "north" / "alpha.csv"
    second_area = inventory_root / "data" / "csv" / "zz" / "south" / "beta.csv"
    first_area.parent.mkdir(parents=True, exist_ok=True)
    second_area.parent.mkdir(parents=True, exist_ok=True)
    header = "slug,nombre,web,Facebook,Instagram,imagen\n"
    first_area.write_text(
        header
        + "has-image,Has Image,,,,/productores/zz/north/alpha/has-image.webp\n"
        + "web-social,Web Social,https://one.example/,https://facebook.example/one,,\n"
        + "web-only,Web Only,https://two.example/,,,\n",
        encoding="utf-8",
        newline="",
    )
    second_area.write_text(
        header
        + "social-only,Social Only,,https://facebook.example/two,,\n"
        + "no-links,No Links,,,,\n",
        encoding="utf-8",
        newline="",
    )
    inventory = enrich.country_image_inventory(inventory_root, "zz")
    check("country inventory counts every area", inventory["area_count"], 2)
    check("country inventory counts every producer", inventory["producers"], 5)
    check("country inventory separates published images", inventory["with_image"], 1)
    check("country inventory counts every missing image", inventory["missing"], 4)
    check("country inventory classifies web plus social", inventory["web_and_social"], 1)
    check("country inventory classifies web only", inventory["web_only"], 1)
    check("country inventory classifies social only", inventory["social_only"], 1)
    check("country inventory classifies rows with no attributable link", inventory["no_attributable_link"], 1)
    check(
        "country inventory keeps a deterministic region/area queue",
        [(area["region"], area["area"]) for area in inventory["areas"]],
        [("north", "alpha"), ("south", "beta")],
    )

missing_inventory_country = subprocess.run(
    [sys.executable, str(SCRIPT), "--inventory"],
    capture_output=True,
    text=True,
    check=False,
)
check("country inventory requires an explicit country", "--inventory requires --country" in missing_inventory_country.stderr, True)

# --- social/institutional files enter the same frozen review workflow -------
with tempfile.TemporaryDirectory(prefix="chisan-enrich-manual-source-") as temp_dir:
    manual_root = Path(temp_dir)
    manual_csv = manual_root / "data" / "csv" / "zz" / "region" / "area.csv"
    manual_csv.parent.mkdir(parents=True, exist_ok=True)
    manual_csv.write_text(
        "slug,nombre,web,Facebook,Instagram,imagen,producer_id\n"
        "uno,Uno,,https://facebook.example/uno,,,101\n",
        encoding="utf-8",
        newline="",
    )
    manual_input = manual_root / "downloaded-logo.png"
    Image.new("RGB", (400, 300), (20, 70, 40)).save(manual_input, "PNG")
    manual_sheet = manual_root / "review"
    original_repo_root = enrich.repo_root
    original_get_image_candidates = enrich.get_image_candidates
    original_argv = sys.argv
    enrich.repo_root = lambda: manual_root
    enrich.get_image_candidates = lambda *_args, **_kwargs: (_ for _ in ()).throw(
        AssertionError("manual source unexpectedly used the network extractor")
    )
    sys.argv = [
        "enrich-producer-images.py",
        "--country",
        "zz",
        "--area",
        "area",
        "--slug",
        "uno",
        "--source-file",
        str(manual_input),
        "--source-reference",
        "https://facebook.example/uno",
        "--subject",
        "logo",
        "--contact-sheet",
        str(manual_sheet),
        "--delay",
        "0",
    ]
    try:
        with redirect_stdout(StringIO()):
            manual_result = enrich.main()
    finally:
        enrich.repo_root = original_repo_root
        enrich.get_image_candidates = original_get_image_candidates
        sys.argv = original_argv
    check("a local official source builds a review bundle", manual_result, 0)
    manual_manifest = enrich.load_sweep_manifest(
        manual_sheet,
        "data/csv/zz/region/area.csv",
        "zz/region/area",
    )
    manual_candidate = manual_manifest["rows"]["uno"]["candidates"][0]
    check("manual review records its explicit source type", manual_candidate["source"], "manual-file")
    check("manual review records its attributable official page", manual_candidate["url"], "https://facebook.example/uno")
    check("manual review freezes the same v3 asset bundle", manual_manifest["version"], enrich.SWEEP_MANIFEST_VERSION)
    check("manual review renders a contact sheet", (manual_sheet / "contact-sheet-01.png").is_file(), True)

# --- a reviewed composition survives the cache round trip unchanged ---------
with tempfile.TemporaryDirectory(prefix="chisan-enrich-cache-") as temp_dir:
    sheet_dir = Path(temp_dir)
    composition = Image.new("RGB", enrich.CANVAS_SIZE, (243, 240, 232))
    composition.paste(Image.new("RGB", (400, 300), (10, 90, 60)), (200, 200))
    digest = enrich.composed_digest(composition)
    enrich.save_compositions(sheet_dir, {digest: composition})

    restored = enrich.load_composition(sheet_dir, digest)
    check("the cache returns the reviewed pixels", enrich.composed_digest(restored), digest)
    check("a 12-character prefix resolves", enrich.composed_digest(enrich.load_composition(sheet_dir, digest[:12])), digest)
    check(
        "the cached composition encodes to the same asset the network path writes",
        enrich.encode_webp(restored),
        enrich.encode_webp(composition),
    )
    frozen_path = enrich.reviewed_asset_cache_dir(sheet_dir) / f"{digest}.webp"
    frozen_bytes = frozen_path.read_bytes()
    _, loaded_frozen_bytes = enrich.load_reviewed_asset(
        sheet_dir,
        {"digest": digest, "asset_sha256": enrich.hashlib.sha256(frozen_bytes).hexdigest()},
        2,
    )
    check("a sweep freezes the exact WebP bytes", loaded_frozen_bytes, frozen_bytes)

    try:
        enrich.load_composition(sheet_dir, "f" * 12)
    except ValueError as exc:
        check("an unreviewed digest is refused", "no reviewed composition" in str(exc), True)
    else:
        failures.append("an unreviewed digest is refused\n    expected ValueError")

    tampered = enrich.composition_cache_dir(sheet_dir) / f"{digest}.png"
    Image.new("RGB", enrich.CANVAS_SIZE, (255, 255, 255)).save(tampered, "PNG")
    try:
        enrich.load_composition(sheet_dir, digest)
    except ValueError as exc:
        check("a composition that no longer matches its digest is refused", "no longer matches" in str(exc), True)
    else:
        failures.append("a composition that no longer matches its digest is refused\n    expected ValueError")

# --- a decisions file is a reviewed ledger, not a script -------------------
with tempfile.TemporaryDirectory(prefix="chisan-enrich-decisions-") as temp_dir:
    decisions_path = Path(temp_dir) / "decisions.txt"
    decisions_path.write_text(
        "# reviewed on sheet 01\n\nuno  aaaaaaaaaaaa\ndos\tBBBBBBBBBBBB  # second look\n",
        encoding="utf-8",
    )
    check(
        "comments and blank lines are ignored and digests fold to lower case",
        enrich.read_decisions(decisions_path),
        [("uno", "a" * 12), ("dos", "b" * 12)],
    )

    for content, expected in (
        ("uno\n", "expected '<slug> <sha256>'"),
        ("uno zzzz\n", "is not 12 to 64 hexadecimal"),
        ("../escape aaaaaaaaaaaa\n", "is not a canonical kebab-case slug"),
        ("uno aaaaaaaaaaaa\nuno bbbbbbbbbbbb\n", "is decided twice"),
        ("# nothing here\n", "contains no decisions"),
    ):
        decisions_path.write_text(content, encoding="utf-8")
        try:
            enrich.read_decisions(decisions_path)
        except ValueError as exc:
            check(f"rejects {content.strip()!r}", expected in str(exc), True)
        else:
            failures.append(f"rejects {content.strip()!r}\n    expected ValueError")

# --- offline apply is authorized by the sweep manifest, not the cache alone -
check(
    "the documented review cap is the actual default",
    enrich.build_arg_parser().parse_args(["--area", "area"]).max_candidates,
    3,
)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-manifest-") as temp_dir:
    temp = Path(temp_dir)
    csv_path = temp / "area.csv"
    sheet_dir = temp / "sheet"
    output_dir = temp / "public" / "productores" / "zz" / "region" / "area"
    catalog_path = "data/csv/zz/region/area.csv"
    asset_dir = "zz/region/area"
    original_csv = (
        "slug,nombre,web,imagen,producer_id,nota\n"
        "uno,Uno,https://uno.example/,,1,original\n"
        "dos,Dos,https://dos.example/,,2,original\n"
    )
    original_bytes = original_csv.encode("utf-8")
    csv_path.write_bytes(original_bytes)

    logo = Image.new("RGB", enrich.CANVAS_SIZE, (20, 70, 40))
    photo = Image.new("RGB", enrich.CANVAS_SIZE, (110, 80, 45))
    logo_digest = enrich.composed_digest(logo)
    photo_digest = enrich.composed_digest(photo)
    enrich.save_compositions(sheet_dir, {logo_digest: logo, photo_digest: photo})
    logo_asset_sha256 = enrich.hashlib.sha256(
        (enrich.reviewed_asset_cache_dir(sheet_dir) / f"{logo_digest}.webp").read_bytes()
    ).hexdigest()
    photo_asset_sha256 = enrich.hashlib.sha256(
        (enrich.reviewed_asset_cache_dir(sheet_dir) / f"{photo_digest}.webp").read_bytes()
    ).hexdigest()
    manifest_rows = {
        "uno": {
            "producer_id": "1",
            "web": "https://uno.example/",
            "candidates": [
                {"digest": logo_digest, "asset_sha256": logo_asset_sha256, "subject": "logo"}
            ],
        },
        "dos": {
            "producer_id": "2",
            "web": "https://dos.example/",
            "candidates": [
                {"digest": photo_digest, "asset_sha256": photo_asset_sha256, "subject": "photo"}
            ],
        },
    }
    manifest_path = enrich.write_sweep_manifest(
        sheet_dir,
        catalog_path,
        asset_dir,
        original_bytes,
        manifest_rows,
    )
    manifest = enrich.load_sweep_manifest(sheet_dir, catalog_path, asset_dir)
    check("manifest records the catalog path", manifest["catalog_path"], catalog_path)
    check("manifest records the canonical asset directory", manifest["asset_dir"], asset_dir)
    check("manifest records the swept CSV hash", manifest["csv_sha256"], enrich.csv_digest(original_bytes))
    check("manifest is written beside the sheets", manifest_path, sheet_dir / enrich.SWEEP_MANIFEST_FILENAME)

    unsafe_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    unsafe_manifest["rows"]["../escape"] = unsafe_manifest["rows"].pop("uno")
    manifest_path.write_text(json.dumps(unsafe_manifest), encoding="utf-8")
    try:
        enrich.load_sweep_manifest(sheet_dir, catalog_path, asset_dir)
    except ValueError as exc:
        check("a manifest cannot introduce path-traversal slugs", "canonical kebab-case" in str(exc), True)
    else:
        failures.append("a manifest cannot introduce path-traversal slugs\n    expected ValueError")
    enrich.write_sweep_manifest(sheet_dir, catalog_path, asset_dir, original_bytes, manifest_rows)

    legacy_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    legacy_manifest["version"] = 1
    for legacy_row in legacy_manifest["rows"].values():
        for legacy_candidate in legacy_row["candidates"]:
            legacy_candidate.pop("asset_sha256", None)
    manifest_path.write_text(json.dumps(legacy_manifest), encoding="utf-8")
    check(
        "existing v1 sweep bundles remain applicable",
        enrich.load_sweep_manifest(sheet_dir, catalog_path, asset_dir)["version"],
        1,
    )
    enrich.write_sweep_manifest(sheet_dir, catalog_path, asset_dir, original_bytes, manifest_rows)

    try:
        enrich.load_sweep_manifest(sheet_dir, "data/csv/zz/region/other.csv", asset_dir)
    except ValueError as exc:
        check("a manifest from another area is refused", "belongs to" in str(exc), True)
    else:
        failures.append("a manifest from another area is refused\n    expected ValueError")

    ambiguous_manifest = {
        "rows": {
            "uno": {
                "candidates": [
                    {"digest": "a" * 63 + "0", "subject": "logo"},
                    {"digest": "a" * 63 + "1", "subject": "logo"},
                ]
            }
        }
    }
    try:
        enrich.resolve_manifest_candidate(ambiguous_manifest, "uno", "a" * 12)
    except ValueError as exc:
        check("candidate prefixes resolve only when unambiguous per slug", "ambiguous" in str(exc), True)
    else:
        failures.append("candidate prefixes resolve only when unambiguous per slug\n    expected ValueError")

    def run_offline(decisions, *, allow_photos=False):
        _, current_rows, current_bytes, current_csv = enrich.read_csv(csv_path)
        published = {
            str(row.get("slug") or "").strip(): str(row.get("imagen") or "").strip()
            for row in current_rows
            if str(row.get("imagen") or "").strip()
        }
        stdout = StringIO()
        with redirect_stdout(stdout):
            result = enrich.apply_reviewed(
                csv_path,
                catalog_path,
                asset_dir,
                output_dir,
                current_csv,
                current_bytes,
                current_rows,
                sheet_dir,
                decisions,
                published,
                False,
                allow_photos,
            )
        return result, stdout.getvalue()

    for legacy_version in (1, 2):
        legacy_apply_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        legacy_apply_manifest["version"] = legacy_version
        if legacy_version == 1:
            for legacy_row in legacy_apply_manifest["rows"].values():
                for legacy_candidate in legacy_row["candidates"]:
                    legacy_candidate.pop("asset_sha256", None)
        manifest_path.write_text(json.dumps(legacy_apply_manifest), encoding="utf-8")
        result, output = run_offline([("uno", logo_digest[:12])])
        check(f"an unpublished v{legacy_version} decision needs explicit legacy permission", result, 1)
        check(
            f"a v{legacy_version} refusal explains the legacy classification",
            f"legacy v{legacy_version}" in output,
            True,
        )
        check(
            f"a refused v{legacy_version} decision writes no asset",
            (output_dir / "uno.webp").exists(),
            False,
        )
        enrich.write_sweep_manifest(sheet_dir, catalog_path, asset_dir, original_bytes, manifest_rows)

    result, output = run_offline([("dos", logo_digest[:12])])
    check("a digest reviewed for another slug is refused", result, 1)
    check("cross-slug refusal explains the boundary", "was not reviewed for 'dos'" in output, True)
    check("cross-slug refusal writes no asset", (output_dir / "dos.webp").exists(), False)
    check("cross-slug refusal leaves the CSV untouched", csv_path.read_bytes(), original_bytes)

    csv_path.write_text(original_csv.replace(",,1,original", ",,99,original", 1), encoding="utf-8", newline="")
    result, output = run_offline([("uno", logo_digest[:12])])
    check("a changed producer_id is refused", result, 1)
    check("producer_id refusal identifies the changed field", "changed producer_id" in output, True)
    check("producer_id refusal writes no asset", (output_dir / "uno.webp").exists(), False)

    csv_path.write_text(
        original_csv.replace("https://uno.example/", "https://changed.example/", 1),
        encoding="utf-8",
        newline="",
    )
    result, output = run_offline([("uno", logo_digest[:12])])
    check("a changed web source is refused", result, 1)
    check("web refusal identifies the changed field", "changed web" in output, True)
    check("web refusal writes no asset", (output_dir / "uno.webp").exists(), False)

    csv_path.write_text(original_csv.replace("original", "edited elsewhere", 1), encoding="utf-8", newline="")
    result, output = run_offline([("uno", logo_digest[:12])])
    check("an unrelated CSV change is allowed", result, 0)
    check("an unrelated change emits the hash warning", "CSV changed since the sweep" in output, True)
    applied_once = csv_path.read_text(encoding="utf-8")
    check("unrelated CSV content survives apply", "edited elsewhere" in applied_once, True)
    check("the reviewed logo is assigned to its own slug", f"/productores/{asset_dir}/uno.webp" in applied_once, True)

    settled_legacy_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    settled_legacy_manifest["version"] = 2
    manifest_path.write_text(json.dumps(settled_legacy_manifest), encoding="utf-8")
    result, output = run_offline([("uno", logo_digest[:12])])
    check("an exact already-published v2 decision stays idempotent", result, 0)
    check("an exact already-published v2 decision needs no legacy flag", "already-published=1" in output, True)
    enrich.write_sweep_manifest(sheet_dir, catalog_path, asset_dir, original_bytes, manifest_rows)

    canonical_uno = f"/productores/{asset_dir}/uno.webp"
    csv_path.write_text(applied_once.replace(canonical_uno, "/legacy/uno.webp"), encoding="utf-8", newline="")
    result, output = run_offline([("uno", logo_digest[:12])])
    check("matching bytes at a noncanonical CSV path are not settled", result, 1)
    check("a noncanonical published path needs an explicit replacement", "already published a different image" in output, True)
    csv_path.write_text(applied_once, encoding="utf-8", newline="")

    result, output = run_offline([("dos", photo_digest[:12])])
    check("offline photos require explicit permission", result, 1)
    check("photo refusal asks for the flag", "pass --allow-photos explicitly" in output, True)
    check("photo refusal writes no asset", (output_dir / "dos.webp").exists(), False)

    original_encode_webp = enrich.encode_webp
    enrich.encode_webp = lambda image: b"different encoder output"
    try:
        result, output = run_offline(
            [("uno", logo_digest[:12]), ("dos", photo_digest[:12])],
            allow_photos=True,
        )
    finally:
        enrich.encode_webp = original_encode_webp
    check("a manifest resumes after an earlier partial apply", result, 0)
    check("resume recognizes the frozen asset across encoder changes", "already-published=1" in output, True)
    check("resume applies the remaining reviewed photo", (output_dir / "dos.webp").exists(), True)

with tempfile.TemporaryDirectory(prefix="chisan-enrich-no-manifest-") as temp_dir:
    try:
        enrich.load_sweep_manifest(
            Path(temp_dir),
            "data/csv/zz/region/area.csv",
            "zz/region/area",
        )
    except ValueError as exc:
        check("offline apply requires a sweep manifest", "has no candidates.json" in str(exc), True)
    else:
        failures.append("offline apply requires a sweep manifest\n    expected ValueError")

if failures:
    print(f"enrich:images tests FAILED ({len(failures)}):\n")
    for failure in failures:
        print(f"  - {failure}")
    raise SystemExit(1)

print("enrich:images tests OK")
