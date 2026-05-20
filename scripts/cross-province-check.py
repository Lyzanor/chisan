#!/usr/bin/env python3
import csv
import os
import glob
from collections import defaultdict

CACERES_CSV = "data/csv/extremadura/caceres.csv"

def find_cross_province_duplicates():
    print("Analyzing coordinates cross-province...")
    
    # Map from (lat, lon) -> list of (file_path, row_index, slug)
    all_coords = defaultdict(list)
    
    csv_files = glob.glob("data/csv/**/*.csv", recursive=True)
    for file_path in csv_files:
        # Skip checking duplicates between other files only, we care about matches with caceres
        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader, start=2):
                lat_str = row.get('lat', '')
                lon_str = row.get('lon', '')
                slug = row.get('slug', '')
                if lat_str and lon_str:
                    try:
                        lat = float(lat_str.replace(',', '.'))
                        lon = float(lon_str.replace(',', '.'))
                        coord = (lat, lon)
                        all_coords[coord].append((file_path, i, slug))
                    except ValueError:
                        pass
                        
    # Now read Cáceres specifically and check if its coordinates exist in other files
    with open(CACERES_CSV, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            lat_str = row.get('lat', '')
            lon_str = row.get('lon', '')
            slug = row.get('slug', '')
            if lat_str and lon_str:
                try:
                    lat = float(lat_str.replace(',', '.'))
                    lon = float(lon_str.replace(',', '.'))
                    coord = (lat, lon)
                    
                    matches = all_coords[coord]
                    # Filter out matches in Cáceres itself
                    other_matches = [m for m in matches if m[0] != CACERES_CSV]
                    if other_matches:
                        print(f"Cáceres Line {i} ({slug}) has coordinate {lat}, {lon} identical to:")
                        for path, line, other_slug in other_matches:
                            print(f"  -> {path} Line {line} ({other_slug})")
                except ValueError:
                    pass

if __name__ == "__main__":
    find_cross_province_duplicates()
