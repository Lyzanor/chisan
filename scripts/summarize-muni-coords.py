#!/usr/bin/env python3
import csv
from collections import defaultdict

CSV_PATH = "data/csv/extremadura/caceres.csv"

def summarize_muni_coords():
    muni_data = defaultdict(list)
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            muni = row.get('municipio', '')
            lat_str = row.get('lat', '')
            lon_str = row.get('lon', '')
            slug = row.get('slug', '')
            if lat_str and lon_str:
                try:
                    lat = float(lat_str.replace(',', '.'))
                    lon = float(lon_str.replace(',', '.'))
                    muni_data[muni].append((lat, lon, slug, i))
                except ValueError:
                    pass
                    
    for muni, coords in sorted(muni_data.items()):
        lats = [c[0] for c in coords]
        lons = [c[1] for c in coords]
        min_lat, max_lat = min(lats), max(lats)
        min_lon, max_lon = min(lons), max(lons)
        diff_lat = max_lat - min_lat
        diff_lon = max_lon - min_lon
        print(f"Muni: {muni:<30} | Rows: {len(coords):<3} | Lat: [{min_lat:.4f}, {max_lat:.4f}] (diff {diff_lat:.4f}) | Lon: [{min_lon:.4f}, {max_lon:.4f}] (diff {diff_lon:.4f})")
        if diff_lat > 0.15 or diff_lon > 0.15:
            print("  --> WARNING: large coordinate spread!")
            for lat, lon, slug, line in coords:
                print(f"    Line {line} | {slug} | {lat}, {lon}")

if __name__ == "__main__":
    summarize_muni_coords()
