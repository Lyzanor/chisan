#!/usr/bin/env python3
"""Network-free regression tests for the pure parts of enrich:images."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
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

# --- an unusable asset is not an asset ---------------------------------------
check("64px sources are rejected", enrich.MIN_ACCEPTED_LONG_EDGE >= 200, True)

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
shared_asset = enrich.Asset(
    image=Image.new("RGB", (640, 480), (120, 60, 30)),
    data=b"same downloaded bytes",
    content_type="image/png",
    url="https://example.com/shared.png",
)
original_fetch_best_asset = enrich.fetch_best_asset
enrich.fetch_best_asset = lambda *_args, **_kwargs: (shared_asset, None)
try:
    logo_info, _ = enrich.inspect_candidate(
        enrich.Candidate("logo-img", shared_asset.url, "logo", "", 100), 1
    )
    photo_info, _ = enrich.inspect_candidate(
        enrich.Candidate("og:image", shared_asset.url, "photo", "", 50), 1
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
    check("atomic writer keeps surgical CSV output", csv_path.read_text(encoding="utf-8"), updated_csv)
    check("atomic writer creates the reviewed image", image_path.exists(), True)

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

if failures:
    print(f"enrich:images tests FAILED ({len(failures)}):\n")
    for failure in failures:
        print(f"  - {failure}")
    raise SystemExit(1)

print("enrich:images tests OK")
