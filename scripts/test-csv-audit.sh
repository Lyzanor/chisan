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
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/invalid-links.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://example.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/invalid-lat.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,123,2.1,pendiente
CSV

cat >"$TMP_DIR/duplicate-slug.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-repetida,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
fila-repetida,Dos,Abrera,Bodega,Vino,Carrer 2,Descripcion suficientemente larga para validar,,600000001,dos@example.com,https://example.com,no comprobado,https://facebook.com/dos,https://instagram.com/dos,https://www.google.com/maps/search/?api=1&query=Dos&query_place_id=def,41.2,2.2,pendiente
CSV

cat >"$TMP_DIR/invalid-verification.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,segura
CSV

cat >"$TMP_DIR/verificado-without-evidence.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,,no comprobado,,,,,,verificado
CSV

cat >"$TMP_DIR/invalid-online-sales.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,tal vez,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/quality-warnings.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-repetida,,Abrera,Bodega,Vino,,Corta,, , ,,no comprobado,,,,41.1,2.1,pendiente
fila-repetida-dos,Masia Uno,Abrera,Carnicería,Vino,Venta online,Descripcion suficientemente larga para validar,,600000000,masia@example.com,https://example.com,no comprobado,,,,41.2,2.2,parcial
otra-fila,Masia Uno,Abrera,Carniceria,Vino,Carrer Major 4,Descripcion suficientemente larga para validar,,600000001,masia2@example.com,https://example.com,no comprobado,https://facebook.com/masia,,https://www.google.com/maps/place/Masia%20Uno,41.3,2.3,pendiente
CSV

cat >"$TMP_DIR/category-preferences.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
lacteos-uno,La Formatgeria,Abrera,Quesos y lácteos,Queso,Carrer Major 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/place/La%20Formatgeria,41.1,2.1,pendiente
bodega-uno,Celler Uno,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,600000001,dos@example.com,https://example.com,no comprobado,https://facebook.com/dos,https://instagram.com/dos,https://www.google.com/maps/place/Celler%20Uno,41.2,2.2,pendiente
pan-uno,Forn Uno,Abrera,Panadería y repostería,Pan,Carrer Major 3,Descripcion suficientemente larga para validar,,600000002,tres@example.com,https://example.com,no comprobado,https://facebook.com/tres,https://instagram.com/tres,https://www.google.com/maps/place/Forn%20Uno,41.3,2.3,pendiente
CSV

run_expect_failure "$TMP_DIR/out-missing.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/missing-column.csv"
grep -q "missing required CSV column 'Venta online'" "$TMP_DIR/out-missing.txt"

run_expect_failure "$TMP_DIR/out-links.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-links.csv"
grep -q "Facebook: must point to facebook.com" "$TMP_DIR/out-links.txt"

run_expect_failure "$TMP_DIR/out-lat.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-lat.csv"
grep -q "lat must be between -90 and 90" "$TMP_DIR/out-lat.txt"

run_expect_failure "$TMP_DIR/out-duplicate-slug.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/duplicate-slug.csv"
grep -q "ERROR line 2 .* slug is duplicated" "$TMP_DIR/out-duplicate-slug.txt"

run_expect_failure "$TMP_DIR/out-invalid-verification.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-verification.csv"
grep -q "verificacion must be one of: pendiente, parcial, verificado" "$TMP_DIR/out-invalid-verification.txt"

run_expect_failure "$TMP_DIR/out-verificado-evidence.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/verificado-without-evidence.csv"
grep -q "verificacion verificado requires coordinates and at least one external link" "$TMP_DIR/out-verificado-evidence.txt"

run_expect_failure "$TMP_DIR/out-online-sales.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/invalid-online-sales.csv"
grep -q "Venta online must be one of: sí, no, no comprobado" "$TMP_DIR/out-online-sales.txt"

run_expect_failure "$TMP_DIR/out-quality.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/quality-warnings.csv"
grep -q "WARNING line 2 .* nombre is empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* telefono and correo are both empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* Google Maps is empty" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* lat/lon is .* km from Abrera centroid" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* coordinates are present but direccion is not useful for location review" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* nombre + municipio looks duplicated" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* categoria has near-duplicate variants" "$TMP_DIR/out-quality.txt"

run_expect_failure "$TMP_DIR/out-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/category-preferences.csv"
grep -q "WARNING line 2 .* categoria should use preferred label 'Lácteos y quesos' instead of 'Quesos y lácteos'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 3 .* categoria should use preferred label 'Bodega' instead of 'Vino'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 4 .* categoria should use preferred label 'Pan y pastelería' instead of 'Panadería y repostería'" "$TMP_DIR/out-categories.txt"

echo "CSV audit tests OK."
