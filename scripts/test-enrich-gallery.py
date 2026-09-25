#!/usr/bin/env python3
"""Network-free regression tests for pure helpers in enrich:gallery."""

from __future__ import annotations

import importlib.util
import sys
from io import BytesIO
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "enrich-producer-gallery.py"

try:
    from PIL import Image
except ModuleNotFoundError:
    print("Skipping enrich:gallery tests: PIL not installed.")
    sys.exit(0)

spec = importlib.util.spec_from_file_location("enrich_producer_gallery", SCRIPT)
enrich_gallery = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = enrich_gallery
spec.loader.exec_module(enrich_gallery)

failures: list[str] = []


def check(label: str, actual, expected) -> None:
    if actual != expected:
        failures.append(f"{label}\n    expected: {expected!r}\n    actual:   {actual!r}")


# --- clean_alt_text -----------------------------------------------------------
check("keeps informative alt", enrich_gallery.clean_alt_text("Obrador de pa", "http://x/1.jpg"), "Obrador de pa")
check("discards generic og:image", enrich_gallery.clean_alt_text("og:image", "http://x/el-obrador.jpg"), "El obrador")
check("discards generic foto", enrich_gallery.clean_alt_text("foto", "http://x/queso-curado.png"), "Queso curado")
check("trims long alt to 160", len(enrich_gallery.clean_alt_text("A" * 200, "http://x/img.jpg")), 160)

# --- make_item_id -------------------------------------------------------------
seen_ids: set[str] = set()
id1 = enrich_gallery.make_item_id("Portada", seen_ids)
check("make_item_id slugifies", id1, "portada")
id2 = enrich_gallery.make_item_id("Portada", seen_ids)
check("make_item_id handles collision", id2, "portada-2")
id3 = enrich_gallery.make_item_id("Café con leche!", seen_ids)
check("make_item_id removes non-ascii/punctuation", id3, "cafe-con-leche")
id4 = enrich_gallery.make_item_id("???", seen_ids)
check("make_item_id fallback on empty", id4, "foto")

# --- is_junk_asset ------------------------------------------------------------
check("rejects svg", enrich_gallery.is_junk_asset("https://site.org/icon.svg"), True)
check("rejects payment", enrich_gallery.is_junk_asset("https://site.org/visa-mastercard.png"), True)
check("rejects primary logo", enrich_gallery.is_junk_asset("https://site.org/logo.png", primary_imagen="/productores/es/area/logo.webp"), True)
check("accepts obrador photo", enrich_gallery.is_junk_asset("https://site.org/obrador.jpg"), False)

# --- normalize_photo ----------------------------------------------------------
# Test normal 400x300 image
img = Image.new("RGB", (400, 300), color=(100, 150, 200))
buf = BytesIO()
img.save(buf, format="JPEG")
res = enrich_gallery.normalize_photo(buf.getvalue())
check("normalize_photo accepts valid size", res is not None, True)
if res:
    w, h, raw_webp = res
    check("width matches", w, 400)
    check("height matches", h, 300)
    check("webp signature", raw_webp[:4], b"RIFF")

# Test too small image (<300px)
small_img = Image.new("RGB", (250, 250), color=(100, 150, 200))
buf_small = BytesIO()
small_img.save(buf_small, format="JPEG")
res_small = enrich_gallery.normalize_photo(buf_small.getvalue())
check("normalize_photo rejects small image", res_small, None)

# Test downscaling image > 1600px
large_img = Image.new("RGB", (3200, 1600), color=(100, 150, 200))
buf_large = BytesIO()
large_img.save(buf_large, format="JPEG")
res_large = enrich_gallery.normalize_photo(buf_large.getvalue())
check("normalize_photo downscales long edge to 1600", res_large[0] if res_large else 0, 1600)
check("normalize_photo preserves ratio on downscale", res_large[1] if res_large else 0, 800)

if failures:
    print(f"enrich:gallery unit tests FAILED ({len(failures)} errors):", file=sys.stderr)
    for f in failures:
        print(f"\n{f}", file=sys.stderr)
    sys.exit(1)

print("enrich:gallery unit tests passed.")
