#!/usr/bin/env python3
"""Network-free regression tests for pure helpers in enrich:gallery."""

from __future__ import annotations

import importlib.util
import sys
import hashlib
import json
import subprocess
import tempfile
from unittest.mock import patch
from io import BytesIO
from pathlib import Path
from bs4 import BeautifulSoup

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
check(
    "cleans CMS resizer and scale suffixes",
    enrich_gallery.clean_alt_text("", "http://x/esdeveniments_barri_sud_54.remini-enhanced-2-scaled.jpg"),
    "Esdeveniments barri sud",
)
check(
    "cleans WordPress dimension suffixes",
    enrich_gallery.clean_alt_text("", "http://x/obrador-pan-1024x768.webp"),
    "Obrador pan",
)
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

check("official host does not make a stock photo usable", enrich_gallery.is_junk_asset("https://official.org/fotolia-123.jpg"), True)
check("award graphics are not gallery photos", enrich_gallery.is_junk_asset("https://official.org/group.png", "Imatge MEDALLA DOR"), True)

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

# --- extract_images_from_soup -------------------------------------------------
html_snippet = """
<html>
  <head><meta property="og:image" content="/images/og.jpg"></head>
  <body>
    <picture>
      <source srcset="/images/pic-small.jpg 400w, /images/pic-large.jpg 1200w">
      <img src="/images/pic-fallback.jpg" alt="Foto en picture">
    </picture>
    <img data-lazy-src="/images/lazy-field.jpg" alt="Campo de trigo">
    <div style="background-image: url('/images/hero-bg.jpg'); height: 300px;"></div>
    <img src="/icons/visa.png" alt="Visa">
  </body>
</html>
"""
soup = BeautifulSoup(html_snippet, "html.parser")
extracted = enrich_gallery.extract_images_from_soup(soup, "https://artesa.cat/sobre-nosaltres")
urls = [u for u, alt, src in extracted]
check("extracts og:image", "https://artesa.cat/images/og.jpg" in urls, True)
check("extracts largest picture source", "https://artesa.cat/images/pic-large.jpg" in urls, True)
check("extracts lazy image", "https://artesa.cat/images/lazy-field.jpg" in urls, True)
check("extracts background-image", "https://artesa.cat/images/hero-bg.jpg" in urls, True)
check("filters out payment junk", any("visa.png" in u for u in urls), False)

# --- Review/apply boundary ----------------------------------------------------
def rejects(label, call, error=ValueError):
    try:
        call()
    except error:
        return
    failures.append(f"{label}: expected {error.__name__}")

sha = "a" * 64
check("quoted alt supports embedded quotes", enrich_gallery.parse_decision_line(f'123 {sha} "Bodega \\"del valle\\""'),
      ("123", sha, 'Bodega "del valle"'))
check("ignores comments", enrich_gallery.parse_decision_line("# review"), None)
rejects("ordinal decisions cannot silently select a different image", lambda: enrich_gallery.parse_decision_line('123 cand-01 "Bodega"'))
rejects("requires reviewed alt", lambda: enrich_gallery.parse_decision_line(f'123 {sha} ""'))
rejects("trailing garbage is rejected", lambda: enrich_gallery.parse_decision_line(f'123 {sha} "Bodega" trailing'))

lazy = BeautifulSoup('<img src="data:image/gif;base64,abc" data-src="/real.jpg"><img src="/thumb.jpg" srcset="/full.jpg 1600w">', 'html.parser')
urls = [x[0] for x in enrich_gallery.extract_images_from_soup(lazy, 'https://example.org/')]
check("lazy placeholder does not hide photo", 'https://example.org/real.jpg' in urls, True)
check("responsive full size wins over thumbnail", 'https://example.org/full.jpg' in urls, True)
check("SVG query does not bypass filter", enrich_gallery.is_junk_asset('https://example.org/asset.svg?v=1'), True)

with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    bundle = root / 'bundle'
    (bundle / '123').mkdir(parents=True)
    content = root / 'data/content/es/123.json'
    content.parent.mkdir(parents=True)
    raw = res[2]
    digest = hashlib.sha256(raw).hexdigest()
    photo = bundle / '123' / f'{digest}.webp'
    photo.write_bytes(raw)
    row = dict(country='es', producer_id='123', nombre='Bodega', slug='bodega', region='region', area='area', municipio='Villa', web='https://example.org')
    # Five existing gallery items, including a product reference and a translation.
    existing = dict(version=1, country='es', producer_id=123,
                    products=[dict(id='vino', media_ids=['old-0'])],
                    gallery=[dict(id=f'old-{i}', src=f'/old-{i}.webp') for i in range(5)],
                    links=[dict(id='shop')], people=[dict(id='owner')],
                    translations=[dict(collection='gallery', item_id='old-0')])
    content.write_text(json.dumps(existing))
    entry = dict(producer=enrich_gallery.producer_binding(row), content_revision=enrich_gallery.content_revision(content),
                 candidates=[dict(sha256=digest, width=res[0], height=res[1], candidate_id='cand-01', alt='unreviewed',
                                  url='https://example.org/a.jpg', source_page='https://example.org/')])
    manifest = dict(version=1, country='es', producers=[entry])
    def save_manifest():
        (bundle / 'candidates.json').write_text(json.dumps(manifest))
    save_manifest()
    decisions = bundle / 'decisions.txt'
    decisions.write_text(f'123 {digest} "Nave de elaboración"\n')
    dest = root / 'public/productores/es/content/123' / f'{digest}.webp'
    with patch.object(enrich_gallery, 'REPO_ROOT', root), patch.object(enrich_gallery, 'catalog_rows', return_value=[row]), patch.object(enrich_gallery.subprocess, 'run') as run:
        enrich_gallery.apply_decisions(decisions, bundle, locale='ca')
        draft = json.loads((bundle / '123/reviewed.json').read_text())
        check("append never truncates previous photos", draft['gallery'][:5], existing['gallery'])
        check("append retains all six photos", len(draft['gallery']), 6)
        for field in ('products', 'people', 'links', 'translations'):
            check(f"preserves {field}", draft[field], existing[field])
        check("explicit alt locale", draft['gallery'][-1]['locale'], 'ca')
        check("delegates to existing content owner", run.call_args.args[0][1:3], ['producer:content', 'apply'])
        check("delegation passes reviewed revision", run.call_args.args[0][-1], entry['content_revision'])
        dest.unlink()
        run.reset_mock()
        decisions.write_text(f'123 {digest} "Valid"\n999 {sha} "Missing"\n')
        rejects("all selections preflight before first write", lambda: enrich_gallery.apply_decisions(decisions, bundle))
        check("invalid later producer writes no assets", dest.exists(), False)
        check("invalid later producer invokes no apply", run.called, False)
        decisions.write_text(f'123 {digest} "Valid"\n123 {digest} "Duplicate"\n')
        rejects("duplicate selections rejected", lambda: enrich_gallery.apply_decisions(decisions, bundle))
        decisions.write_text(f'123 {digest} "Valid"\n')
        photo.write_bytes(b'tampered')
        rejects("tampered review bytes rejected", lambda: enrich_gallery.apply_decisions(decisions, bundle))
        photo.write_bytes(raw)
        entry['producer']['web'] = 'https://changed.org'
        save_manifest()
        rejects("changed official source rejected", lambda: enrich_gallery.apply_decisions(decisions, bundle))
        entry['producer']['web'] = row['web']
        entry['content_revision'] = 'absent'
        save_manifest()
        rejects("stale content rejected", lambda: enrich_gallery.apply_decisions(decisions, bundle))
        entry['content_revision'] = enrich_gallery.content_revision(content)
        save_manifest()
        run.side_effect = subprocess.CalledProcessError(1, 'apply')
        rejects("owner validation failure surfaced", lambda: enrich_gallery.apply_decisions(decisions, bundle), subprocess.CalledProcessError)
        check("failed apply cleans only new asset", dest.exists(), False)
        check("failed apply leaves content intact", json.loads(content.read_text()), existing)
    content.write_text('{broken')
    rejects("corrupt existing content never treated as absent", lambda: enrich_gallery.read_content_json(content))
    entry['producer']['name'] = '<script>alert(1)</script>'
    entry['candidates'][0]['alt'] = '</textarea><script>alert(1)</script>'
    enrich_gallery.render_html_contact_sheet([entry], bundle / 'index.html')
    check("source text escaped in review HTML", '<script>' in (bundle / 'index.html').read_text(), False)


if failures:
    print(f"enrich:gallery unit tests FAILED ({len(failures)} errors):", file=sys.stderr)
    for f in failures:
        print(f"\n{f}", file=sys.stderr)
    sys.exit(1)

print("enrich:gallery unit tests passed.")
