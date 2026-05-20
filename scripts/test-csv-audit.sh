#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

run_expect_failure() {
  local output_file="$1"
  shift

  if "$@" >"$output_file" 2>&1; then
    echo "Error: command was expected to fail: $*" >&2
    exit 1
  fi
}

run_expect_success() {
  local output_file="$1"
  shift

  "$@" >"$output_file" 2>&1
}

cat >"$TMP_DIR/missing-column.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1
CSV

cat >"$TMP_DIR/invalid-links.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,fecha_revision
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://example.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,2026-01-10
CSV

cat >"$TMP_DIR/invalid-date.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,fecha_revision
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,2026/01/10
CSV

cat >"$TMP_DIR/invalid-lat.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,fecha_revision
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,123,2.1,2026-01-10
CSV

cat >"$TMP_DIR/quality-warnings.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,fecha_revision
fila-repetida,,Abrera,Bodega,Vino,,Corta,, , ,https://example.com,,,,41.1,2.1,
fila-repetida,Masia Uno,Abrera,Carnicería,Vino,Venta online,Descripcion suficientemente larga para validar,,600000000,masia@example.com,https://example.com,,,,41.2,2.2,2025-12-01
otra-fila,Masia Uno,Abrera,Carniceria,Vino,Carrer Major 4,Descripcion suficientemente larga para validar,,600000001,masia2@example.com,https://example.com,https://facebook.com/masia,,https://www.google.com/maps/place/Masia%20Uno,41.3,2.3,2025-10-01
CSV

run_expect_failure "$TMP_DIR/out-missing.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/missing-column.csv"
grep -q "missing required CSV column 'fecha_revision'" "$TMP_DIR/out-missing.txt"

run_expect_failure "$TMP_DIR/out-links.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-links.csv"
grep -q "Facebook: must point to facebook.com" "$TMP_DIR/out-links.txt"

run_expect_failure "$TMP_DIR/out-date.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-date.csv"
grep -q "fecha_revision must use YYYY-MM-DD" "$TMP_DIR/out-date.txt"

run_expect_failure "$TMP_DIR/out-lat.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-lat.csv"
grep -q "lat must be between -90 and 90" "$TMP_DIR/out-lat.txt"

run_expect_success "$TMP_DIR/out-quality.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/quality-warnings.csv"
grep -q "WARNING line 2 .* nombre is empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* telefono and correo are both empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* Google Maps is empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* fecha_revision is empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* slug is duplicated" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* coordinates are present but direccion is not useful for location review" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* nombre + municipio looks duplicated" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* categoria has near-duplicate variants" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 4 .* fecha_revision is expired" "$TMP_DIR/out-quality.txt"

echo "CSV audit tests OK."
