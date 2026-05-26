import os
import sys
import csv
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from io import BytesIO
from PIL import Image, ImageFilter

try:
    import cairosvg
    HAS_CAIROSVG = True
except ImportError:
    HAS_CAIROSVG = False

CSV_PATH = 'data/csv/pais-vasco/alava.csv'
OUTPUT_DIR = 'public/productores/alava'
PUBLIC_PREFIX = '/productores/alava'

os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
}

def get_image_candidates(web_url):
    candidates = []
    try:
        response = requests.get(web_url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.text, 'html.parser')

        og_img = soup.find('meta', attrs={'property': 'og:image'})
        if og_img and og_img.get('content'):
            candidates.append(('og:image', urljoin(web_url, og_img['content'])))

        tw_img = soup.find('meta', attrs={'name': 'twitter:image'})
        if tw_img and tw_img.get('content'):
            candidates.append(('twitter:image', urljoin(web_url, tw_img['content'])))

        for link in soup.find_all('link'):
            rel = [r.lower() for r in (link.get('rel') or [])]
            if any('icon' in r for r in rel) or any('apple-touch' in r for r in rel):
                if link.get('href'):
                    candidates.append(('icon', urljoin(web_url, link['href'])))

        for img in soup.find_all('img'):
            src = img.get('src')
            if not src:
                continue

            src_lower = src.lower()
            class_lower = ' '.join(img.get('class') or []).lower()
            id_lower = (img.get('id') or '').lower()
            alt_lower = (img.get('alt') or '').lower()

            if 'logo' in src_lower or 'logo' in class_lower or 'logo' in id_lower or 'logo' in alt_lower:
                candidates.append(('logo-img', urljoin(web_url, src)))

        parsed = urlparse(web_url)
        base_url = f"{parsed.scheme}://{parsed.netloc}/"
        candidates.append(('fallback-favicon', urljoin(base_url, 'favicon.ico')))

    except Exception as e:
        print(f"    Error scraping {web_url}: {e}")

    seen = set()
    unique_candidates = []
    for source, url in candidates:
        if url.startswith('//'):
            url = 'http:' + url
        if url not in seen and url.startswith('http'):
            seen.add(url)
            unique_candidates.append((source, url))

    return unique_candidates

def score_candidate(source, url):
    url_lower = url.lower()
    score = 0

    is_svg = url_lower.endswith('.svg')
    is_png = url_lower.endswith('.png')
    is_webp = url_lower.endswith('.webp')
    is_ico = url_lower.endswith('.ico')

    if source == 'logo-img':
        if is_svg:
            score = 100
        elif is_png or is_webp:
            score = 90
        else:
            score = 70
    elif source == 'icon':
        if 'apple-touch' in url_lower or 'touch-icon' in url_lower:
            score = 85
        elif is_svg:
            score = 80
        elif is_png or is_webp:
            score = 75
        else:
            score = 50
    elif source == 'og:image' or source == 'twitter:image':
        score = 60
    elif source == 'fallback-favicon':
        score = 10 if is_ico else 20

    filename = url_lower.split('/')[-1]
    if 'logo' in filename:
        score += 5

    return score

def download_and_process_image(url, output_path):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return False

        content_type = response.headers.get('Content-Type', '').lower()
        img_data = response.content

        is_svg = url.lower().endswith('.svg') or 'image/svg' in content_type

        if is_svg:
            if not HAS_CAIROSVG:
                print("    Skipping SVG: cairosvg not available")
                return False
            try:
                img_data = cairosvg.svg2png(bytestring=img_data)
            except Exception as e:
                print(f"    Failed to convert SVG to PNG: {e}")
                return False

        logo = Image.open(BytesIO(img_data))
        logo = logo.convert("RGBA")

        has_transparency = False
        alpha_extrema = logo.getchannel('A').getextrema()
        if alpha_extrema[0] < 255:
            has_transparency = True

        if not has_transparency:
            datas = logo.getdata()
            new_data = []
            for item in datas:
                r, g, b, a = item
                if r >= 240 and g >= 240 and b >= 240:
                    new_data.append((243, 240, 232, 0))
                else:
                    new_data.append(item)
            logo.putdata(new_data)

        bbox = logo.getbbox()
        if bbox:
            logo = logo.crop(bbox)

        orig_w, orig_h = logo.size
        if orig_w == 0 or orig_h == 0:
            return False

        scale = 960.0 / max(orig_w, orig_h)

        if scale > 3.0:
            scale = 3.0

        new_w = int(orig_w * scale)
        new_h = int(orig_h * scale)

        try:
            resample_filter = Image.Resampling.LANCZOS
        except AttributeError:
            resample_filter = Image.ANTIALIAS

        logo_resized = logo.resize((new_w, new_h), resample=resample_filter)

        if scale > 1.2:
            logo_resized = logo_resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))

        canvas = Image.new("RGBA", (1600, 1200), (243, 240, 232, 255))

        paste_x = (1600 - new_w) // 2
        paste_y = (1200 - new_h) // 2

        canvas.paste(logo_resized, (paste_x, paste_y), logo_resized)

        final_img = canvas.convert("RGB")
        final_img.save(output_path, "WEBP", quality=90)
        return True

    except Exception as e:
        print(f"    Failed to download/process {url}: {e}")
        return False

def main():
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    print(f"Processing {len(rows)} producers in Álava...")

    updated_count = 0

    for i, row in enumerate(rows):
        nombre = row['nombre']
        slug = row['slug']
        web = row['web']
        imagen = row.get('imagen')

        if imagen:
            continue

        if not web or not web.startswith('http'):
            continue

        print(f"[{i+1}/{len(rows)}] Scouring web for {nombre}...")

        candidates = get_image_candidates(web)
        if not candidates:
            print("  No image candidates found.")
            time.sleep(0.5)
            continue

        scored_candidates = []
        for src, url in candidates:
            score = score_candidate(src, url)
            scored_candidates.append((score, src, url))

        scored_candidates.sort(key=lambda x: x[0], reverse=True)

        success = False
        for score, src, url in scored_candidates:
            if score < 15:
                continue

            output_filename = f"{slug}.webp"
            output_path = os.path.join(OUTPUT_DIR, output_filename)

            print(f"  Trying candidate (score={score}, type={src}): {url}")
            if download_and_process_image(url, output_path):
                row['imagen'] = f"{PUBLIC_PREFIX}/{output_filename}"
                success = True
                updated_count += 1
                print(f"  -> SUCCESS! Saved image to {row['imagen']}")
                break

        if not success:
            print("  Failed to obtain a logo from all candidates.")

        with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

        time.sleep(1.0)

    print(f"\nDone! Successfully updated {updated_count} producers with logo images.")

if __name__ == '__main__':
    main()
