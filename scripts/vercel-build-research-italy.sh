#!/usr/bin/env bash
set -euo pipefail

PY_DEPS="${PWD}/.research-python"
rm -rf "${PY_DEPS}" research-output public/research/italia-500
mkdir -p "${PY_DEPS}" public/research/italia-500

python3 -m pip install --disable-pip-version-check --no-cache-dir --target "${PY_DEPS}" requests shapely
export PYTHONPATH="${PY_DEPS}${PYTHONPATH:+:${PYTHONPATH}}"

# Shapely 2 devuelve índices numpy.int64 desde STRtree.query().
python3 - <<'PY'
from pathlib import Path
path = Path('scripts/research_italy_osm.py')
text = path.read_text(encoding='utf-8')
old = 'if isinstance(hit, (int,)):\n            idx = int(hit)'
new = 'if hasattr(hit, "__index__"):\n            idx = int(hit)'
if old in text:
    path.write_text(text.replace(old, new), encoding='utf-8')
elif new not in text:
    raise SystemExit('No se encontró el bloque de compatibilidad de Shapely')
PY

python3 scripts/research_italy_osm.py

cp research-output/italia_km0_500_master.csv public/research/italia-500/
cp research-output/italia_km0_500_summary.json public/research/italia-500/
cp research-output/italia_km0_500_import.zip public/research/italia-500/
cp research-output/README_ITALIA_500.md public/research/italia-500/

cat > public/research/italia-500/index.html <<'HTML'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Italia KM0 — 500 productores candidatos</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 880px; margin: 48px auto; padding: 0 24px; line-height: 1.55; }
    a { display: block; margin: 12px 0; font-weight: 650; }
    code { background: #f3f3f3; padding: 2px 6px; border-radius: 4px; }
    .note { padding: 16px; border: 1px solid #ddd; border-radius: 10px; background: #fafafa; }
  </style>
</head>
<body>
  <h1>Italia KM0 — 500 candidatos</h1>
  <p class="note"><strong>Estado:</strong> todos los registros están marcados como <code>parcial</code>. Deben revisarse antes de publicarlos como productores verificados.</p>
  <a href="italia_km0_500_master.csv">Descargar CSV maestro (500 filas)</a>
  <a href="italia_km0_500_summary.json">Descargar resumen JSON</a>
  <a href="italia_km0_500_import.zip">Descargar ZIP de importación KM0</a>
  <a href="README_ITALIA_500.md">Leer metodología y licencias</a>
  <p>Fuentes: OpenStreetMap y límites municipales Openpolis/ISTAT.</p>
</body>
</html>
HTML
