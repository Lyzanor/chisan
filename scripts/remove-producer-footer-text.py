#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "public" / "productores"


def is_beige_card(image: Image.Image) -> bool:
    rgb = image.convert("RGB")
    w, h = rgb.size
    corners = [
        rgb.getpixel((5, 5)),
        rgb.getpixel((w - 6, 5)),
        rgb.getpixel((5, h - 6)),
        rgb.getpixel((w - 6, h - 6)),
    ]
    matches = 0
    for r, g, b in corners:
        if abs(r - 244) <= 10 and abs(g - 240) <= 10 and abs(b - 231) <= 10:
            matches += 1
    return matches >= 3


def near_background(pixels: np.ndarray) -> np.ndarray:
    channel_max = pixels.max(axis=2)
    channel_min = pixels.min(axis=2)
    return (channel_min >= 195) & ((channel_max - channel_min) <= 28)


def detect_footer_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    rgb = np.asarray(image.convert("RGB"))
    h, w = rgb.shape[:2]
    y0 = int(h * 0.72)
    y1 = int(h * 0.94)
    band = rgb[y0:y1]
    if band.size == 0:
        return None

    mask = ~near_background(band)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return None

    x1 = xs.min()
    x2 = xs.max() + 1
    y1_local = ys.min()
    y2_local = ys.max() + 1

    width = x2 - x1
    height = y2_local - y1_local
    if width < w * 0.12 or height < h * 0.025:
        return None

    pad_x = int(w * 0.03)
    pad_y = int(h * 0.02)
    return (
        max(0, x1 - pad_x),
        max(0, y0 + y1_local - pad_y),
        min(w, x2 + pad_x),
        min(h, y0 + y2_local + pad_y),
    )


def sample_row_background(row: np.ndarray, x1: int, x2: int) -> np.ndarray:
    left = row[max(0, x1 - 24):x1]
    right = row[x2:min(row.shape[0], x2 + 24)]
    samples = []
    for side in (left, right):
        if side.size == 0:
            continue
        side = side.reshape(-1, 3)
        if side.size == 0:
            continue
        bg_side = side[((side.max(axis=1) - side.min(axis=1)) <= 28) & (side.min(axis=1) >= 195)]
        if len(bg_side) > 0:
            samples.append(bg_side)
        else:
            samples.append(side)
    if not samples:
        return np.array([244, 240, 231], dtype=np.uint8)
    merged = np.concatenate(samples, axis=0)
    return np.median(merged, axis=0).astype(np.uint8)


def clean_footer(image: Image.Image) -> tuple[Image.Image, tuple[int, int, int, int] | None]:
    bbox = detect_footer_bbox(image)
    if bbox is None:
        return image, None

    rgb = np.asarray(image.convert("RGB")).copy()
    x1, y1, x2, y2 = bbox
    for y in range(y1, y2):
        fill = sample_row_background(rgb[y], x1, x2)
        rgb[y, x1:x2] = fill
    return Image.fromarray(rgb, "RGB"), bbox


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    changed = []
    skipped = []

    for path in sorted(IMAGES_DIR.glob("*.webp")):
        if path.name == "generica.webp":
            continue
        image = Image.open(path)
        if not is_beige_card(image):
            skipped.append(path.name)
            continue
        cleaned, bbox = clean_footer(image)
        if bbox is None:
            skipped.append(path.name)
            continue
        changed.append((path.name, bbox))
        if not args.dry_run:
            cleaned.save(path, format="WEBP", quality=92, method=6)

    print(f"changed={len(changed)}")
    for name, bbox in changed:
        print(f"{name}\t{bbox}")
    print(f"skipped={len(skipped)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
