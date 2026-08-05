#!/usr/bin/env python3
from __future__ import annotations

import requests
from shapely.geometry import Point, shape
from shapely.strtree import STRtree

URL = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_municipalities.geojson"
payload = requests.get(URL, timeout=300).json()
features = payload["features"]
print("features", len(features))
print("property keys", sorted((features[0].get("properties") or {}).keys()))
print("first properties", features[0].get("properties"))
first = shape(features[0]["geometry"])
print("first bounds", first.bounds)
geometries = [shape(feature["geometry"]) for feature in features]
print(
    "global bounds",
    min(g.bounds[0] for g in geometries),
    min(g.bounds[1] for g in geometries),
    max(g.bounds[2] for g in geometries),
    max(g.bounds[3] for g in geometries),
)
tree = STRtree(geometries)
for label, point in [
    ("rome_lon_lat", Point(12.4964, 41.9028)),
    ("rome_lat_lon", Point(41.9028, 12.4964)),
]:
    hits = tree.query(point, predicate="intersects")
    print(label, "hits", list(map(int, hits[:10])))
    for hit in hits[:1]:
        print(label, "properties", features[int(hit)].get("properties"))
