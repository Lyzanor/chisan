#!/usr/bin/env python3
import csv
import re
import urllib.parse
from collections import defaultdict
import math

CSV_PATH = "data/csv/extremadura/caceres.csv"
BADAJOZ_CSV_PATH = "data/csv/extremadura/badajoz.csv"
BARCELONA_CSV_PATH = "data/csv/catalunya/barcelona.csv"

LAT_MIN, LAT_MAX = 38.5, 41.0
LON_MIN, LON_MAX = -8.0, -4.5

def haversine(lat1, lon1, lat2, lon2):
    # Radius of the Earth in km
    R = 6371.0
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def verify_caceres():
    print(f"Verifying {CSV_PATH}...")
    issues = []
    
    # Store coordinates to check for duplicates within the file
    coord_to_rows = defaultdict(list)
    
    # Store coordinates by municipality to check for outliers
    muni_coords = defaultdict(list)
    
    # Read Cáceres CSV
    caceres_rows = []
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            caceres_rows.append((i, row))
            
            lat_str = row.get('lat', '')
            lon_str = row.get('lon', '')
            municipio = row.get('municipio', '')
            slug = row.get('slug', '')
            
            if lat_str and lon_str:
                try:
                    lat = float(lat_str.replace(',', '.'))
                    lon = float(lon_str.replace(',', '.'))
                    coord_key = (lat, lon)
                    coord_to_rows[coord_key].append((i, slug))
                    muni_coords[municipio].append((lat, lon, i, slug))
                except ValueError:
                    pass

    # Read Badajoz coordinates for cross-referencing
    badajoz_coords = set()
    try:
        with open(BADAJOZ_CSV_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                lat_str = row.get('lat', '')
                lon_str = row.get('lon', '')
                if lat_str and lon_str:
                    try:
                        lat = float(lat_str.replace(',', '.'))
                        lon = float(lon_str.replace(',', '.'))
                        badajoz_coords.add((lat, lon))
                    except ValueError:
                        pass
    except FileNotFoundError:
        print("Badajoz CSV not found, skipping cross-reference.")

    # Read Barcelona coordinates for cross-referencing
    barcelona_coords = set()
    try:
        with open(BARCELONA_CSV_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                lat_str = row.get('lat', '')
                lon_str = row.get('lon', '')
                if lat_str and lon_str:
                    try:
                        lat = float(lat_str.replace(',', '.'))
                        lon = float(lon_str.replace(',', '.'))
                        barcelona_coords.add((lat, lon))
                    except ValueError:
                        pass
    except FileNotFoundError:
        print("Barcelona CSV not found, skipping cross-reference.")

    for i, row in caceres_rows:
        slug = row.get('slug', '')
        name = row.get('nombre', '')
        municipio = row.get('municipio', '')
        lat_str = row.get('lat', '')
        lon_str = row.get('lon', '')
        web = row.get('web', '')
        facebook = row.get('Facebook', '')
        instagram = row.get('Instagram', '')
        gmaps = row.get('Google Maps', '')
        
        # 1. Coordinates check
        if lat_str and lon_str:
            try:
                lat = float(lat_str.replace(',', '.'))
                lon = float(lon_str.replace(',', '.'))
                coord_key = (lat, lon)
                
                # Check bounding box
                if not (LAT_MIN <= lat <= LAT_MAX) or not (LON_MIN <= lon <= LON_MAX):
                    issues.append({
                        'line': i,
                        'slug': slug,
                        'type': 'coordinates_out_of_bounds',
                        'details': f"lat: {lat}, lon: {lon} (expected lat [{LAT_MIN}, {LAT_MAX}], lon [{LON_MIN}, {LON_MAX}])"
                    })
                
                # Check duplicate coordinates within the same file
                if len(coord_to_rows[coord_key]) > 1:
                    dupes = [f"line {line} ({s})" for line, s in coord_to_rows[coord_key] if line != i]
                    issues.append({
                        'line': i,
                        'slug': slug,
                        'type': 'coordinates_duplicate_internal',
                        'details': f"Coordinates {lat}, {lon} shared with: {', '.join(dupes)}"
                    })
                
                # Check if coordinates are copied from Badajoz
                if coord_key in badajoz_coords:
                    issues.append({
                        'line': i,
                        'slug': slug,
                        'type': 'coordinates_copied_from_badajoz',
                        'details': f"Coordinates {lat}, {lon} found in Badajoz CSV"
                    })
                
                # Check if coordinates are copied from Barcelona
                if coord_key in barcelona_coords:
                    issues.append({
                        'line': i,
                        'slug': slug,
                        'type': 'coordinates_copied_from_barcelona',
                        'details': f"Coordinates {lat}, {lon} found in Barcelona CSV"
                    })
                    
            except ValueError:
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'coordinates_invalid',
                    'details': f"lat: {lat_str}, lon: {lon_str}"
                })
        else:
            issues.append({
                'line': i,
                'slug': slug,
                'type': 'coordinates_missing',
                'details': f"lat: {lat_str}, lon: {lon_str}"
            })
        
        # 2. Web URL check
        if web:
            if 'facebook.com' in web.lower() or 'instagram.com' in web.lower():
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'web_is_social_media',
                    'details': f"web: {web}"
                })
            elif 'spaingiveslife.com' in web.lower():
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'web_is_directory',
                    'details': f"web: {web}"
                })
        
        # 3. Facebook URL check
        if facebook:
            if facebook.strip().lower() in ['https://www.facebook.com/share/', 'https://www.facebook.com/share', 'https://facebook.com/share']:
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'facebook_generic_share',
                    'details': f"Facebook: {facebook}"
                })
            elif facebook.strip().lower() in ['https://www.facebook.com/p/', 'https://www.facebook.com/p']:
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'facebook_generic_profile',
                    'details': f"Facebook: {facebook}"
                })
            elif 'themefusion' in facebook.lower():
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'facebook_themefusion_placeholder',
                    'details': f"Facebook: {facebook}"
                })
            elif facebook.strip().lower() in ['https://www.facebook.com/tr', 'https://www.facebook.com/tr/']:
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'facebook_pixel_tracking',
                    'details': f"Facebook: {facebook}"
                })
            elif not facebook.startswith('http'):
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'facebook_invalid_url',
                    'details': f"Facebook: {facebook}"
                })
                
        # 4. Instagram URL check
        if instagram:
            if 'spaingiveslife' in instagram.lower():
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'instagram_spaingiveslife_placeholder',
                    'details': f"Instagram: {instagram}"
                })
            elif 'themefusion' in instagram.lower():
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'instagram_themefusion_placeholder',
                    'details': f"Instagram: {instagram}"
                })
            elif not instagram.startswith('http'):
                issues.append({
                    'line': i,
                    'slug': slug,
                    'type': 'instagram_invalid_url',
                    'details': f"Instagram: {instagram}"
                })

        # 5. Compare coordinates in Google Maps query if present
        if gmaps and lat_str and lon_str:
            parsed = urllib.parse.urlparse(gmaps)
            query_params = urllib.parse.parse_qs(parsed.query)
            query = query_params.get('query', [''])[0]
            coord_match = re.search(r'(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)', query)
            if coord_match:
                g_lat = float(coord_match.group(1))
                g_lon = float(coord_match.group(2))
                lat = float(lat_str.replace(',', '.'))
                lon = float(lon_str.replace(',', '.'))
                if abs(g_lat - lat) > 0.05 or abs(g_lon - lon) > 0.05:
                    issues.append({
                        'line': i,
                        'slug': slug,
                        'type': 'gmaps_coords_mismatch',
                        'details': f"lat/lon: {lat},{lon} vs gmaps query: {g_lat},{g_lon}"
                    })

    # 6. Municipality Outlier Check (Distance from Municipality Median)
    for muni, coords in muni_coords.items():
        if len(coords) < 3:
            continue # Not enough data points to reliably find outliers
        
        # Find median lat/lon for the municipality
        lats = sorted([c[0] for c in coords])
        lons = sorted([c[1] for c in coords])
        median_lat = lats[len(lats)//2]
        median_lon = lons[len(lons)//2]
        
        for lat, lon, line, slug in coords:
            dist = haversine(lat, lon, median_lat, median_lon)
            # If distance is > 20 km from the median location of the municipality
            # (which is quite a lot for a single municipality), flag it as a potential outlier!
            if dist > 20.0:
                issues.append({
                    'line': line,
                    'slug': slug,
                    'type': 'municipality_outlier',
                    'details': f"Municipality: {muni}, distance to median: {dist:.1f} km (coords: {lat}, {lon}; median: {median_lat}, {median_lon})"
                })

    # Print summary
    print(f"\nFound {len(issues)} potential issues:")
    for issue in issues:
        print(f"Line {issue['line']} | Slug: {issue['slug']} | Type: {issue['type']} | {issue['details']}")

if __name__ == "__main__":
    verify_caceres()
