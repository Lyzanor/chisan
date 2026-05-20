#!/usr/bin/env python3
import csv

CSV_PATH = "data/csv/extremadura/caceres.csv"

# Actual boundaries of Cáceres province
CACERES_LAT_MIN = 39.0
CACERES_LAT_MAX = 40.55
CACERES_LON_MIN = -7.6
CACERES_LON_MAX = -4.8

def check_strict_boundaries():
    print("Checking strict province boundaries...")
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            slug = row.get('slug', '')
            municipio = row.get('municipio', '')
            lat_str = row.get('lat', '')
            lon_str = row.get('lon', '')
            
            if lat_str and lon_str:
                try:
                    lat = float(lat_str.replace(',', '.'))
                    lon = float(lon_str.replace(',', '.'))
                    
                    if not (CACERES_LAT_MIN <= lat <= CACERES_LAT_MAX) or not (CACERES_LON_MIN <= lon <= CACERES_LON_MAX):
                        print(f"Line {i} | {slug} ({municipio}) | Outside Cáceres: lat={lat}, lon={lon}")
                except ValueError:
                    print(f"Line {i} | {slug} ({municipio}) | Invalid coords: lat={lat_str}, lon={lon_str}")

if __name__ == "__main__":
    check_strict_boundaries()
