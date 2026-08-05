#!/usr/bin/env python3
"""Run the static Geofabrik fallback against the current Centro extract."""
from __future__ import annotations

import importlib.util
from pathlib import Path

module_path = Path(__file__).with_name("research_italy_geofabrik.py")
spec = importlib.util.spec_from_file_location("research_italy_geofabrik", module_path)
if spec is None or spec.loader is None:
    raise RuntimeError(f"No se pudo cargar {module_path}")
research = importlib.util.module_from_spec(spec)
spec.loader.exec_module(research)

research.SHAPEFILE_URL = (
    "https://download.geofabrik.de/europe/italy/centro-latest-free.shp.zip"
)
research.DOWNLOAD = research.OUT_DIR / "centro-latest-free.shp.zip"
research.main()
