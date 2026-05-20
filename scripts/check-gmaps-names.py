#!/usr/bin/env python3
import csv
import urllib.parse
import re

CSV_PATH = "data/csv/extremadura/caceres.csv"

def check_gmaps_link_matches_producer():
    print("Checking Google Maps link alignment with producer names...")
    issues = []
    
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            slug = row.get('slug', '')
            name = row.get('nombre', '').strip()
            gmaps = row.get('Google Maps', '').strip()
            
            if not gmaps:
                continue
                
            parsed = urllib.parse.urlparse(gmaps)
            query_params = urllib.parse.parse_qs(parsed.query)
            query = query_params.get('query', [''])[0].strip()
            
            if not query:
                # Some maps links might be direct maps.app.goo.gl or standard /maps/place/...
                # Let's inspect the pathname if query is empty
                pathname = parsed.pathname
                query = urllib.parse.unquote(pathname)
                
            # Normalize strings for comparison (lowercase, alphanumeric only)
            def normalize(s):
                s = s.lower()
                s = s.replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
                return re.sub(r'[^a-z0-9]', '', s)
                
            norm_name = normalize(name)
            norm_query = normalize(query)
            
            # Check if name is in the query, or query contains name words
            # Ignore very short names or common words
            words = [w for w in name.lower().split() if len(w) > 3 and w not in ['queseria', 'cooperativa', 'embutidos', 'jamones', 'panaderia', 'pasteleria', 'bodegas', 'bodega']]
            
            match_found = False
            if norm_name in norm_query or norm_query in norm_name:
                match_found = True
            elif any(normalize(w) in norm_query for w in words):
                match_found = True
                
            if not match_found and words:
                issues.append({
                    'line': i,
                    'slug': slug,
                    'name': name,
                    'query': query,
                    'gmaps': gmaps
                })
                
    print(f"\nFound {len(issues)} suspicious Google Maps links:")
    for issue in issues:
        print(f"Line {issue['line']} | Slug: {issue['slug']} | Name: {issue['name']} | Query: {issue['query']}")

if __name__ == "__main__":
    check_gmaps_link_matches_producer()
