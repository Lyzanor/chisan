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

cat >"$TMP_DIR/duplicate-header.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com,https://old.example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
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

cat >"$TMP_DIR/sales-channel.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
canal-ok,Masia Ok,Abrera,Bodega,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,sí,ecommerce|whatsapp
canal-bad,Masia Bad,Abrera,Bodega,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,bad@example.com,https://example.com,https://facebook.com/bad,https://instagram.com/bad,https://www.google.com/maps/place/Bad,41.52,1.91,,verificado,sí,ecommerce|tienda
canal-estado,Masia Estado,Abrera,Bodega,Vino,Carrer Major 3,Descripcion suficientemente larga para validar,,+34600000002,est@example.com,https://example.com,https://facebook.com/est,https://instagram.com/est,https://www.google.com/maps/place/Est,41.53,1.92,,verificado,no,whatsapp
CSV

cat >"$TMP_DIR/canonical-ok.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
canal-ok,Masia Ok,Abrera,Bodega,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,sí,ecommerce|whatsapp
CSV

# Controlled values are matched exactly: folded case and a missing accent are drift.
cat >"$TMP_DIR/inexact-values.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
valor-acento,Masia Acento,Abrera,Bodega,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,si,
valor-mayus,Masia Mayus,Abrera,Bodega,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.52,1.91,,Verificado,no,
CSV

cat >"$TMP_DIR/identity-required.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
sin-identidad,,Abrera,,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,
CSV

cat >"$TMP_DIR/multi-email.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
dos-correos,Masia Correos,Abrera,Bodega,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com; dos@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,
CSV

cat >"$TMP_DIR/junk-social.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
social-basura,Masia Social,Abrera,Bodega,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/,https://www.instagram.com/explore/tags/queso/,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,
social-pagina,Masia Pagina,Abrera,Bodega,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://www.facebook.com/p/Masia-Pagina-100063712593417,https://www.instagram.com/masiapagina,https://www.google.com/maps/place/Ok2,41.52,1.91,,pendiente,no,
CSV

# A UTF-8 BOM (typical of spreadsheet exports) is a blocking error.
printf '\xEF\xBB\xBF' >"$TMP_DIR/bom.csv"
cat "$TMP_DIR/canonical-ok.csv" >>"$TMP_DIR/bom.csv"

# Same canonical content as sales-channel.csv but with CRLF line endings.
sed 's/$/\r/' "$TMP_DIR/sales-channel.csv" >"$TMP_DIR/crlf.csv"

cat >"$TMP_DIR/wrong-order-header.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Instagram,Facebook,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
fila-1,Uno,Abrera,Bodega,Vino,Carrer 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com,https://example.com,https://instagram.com/uno,https://facebook.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,,pendiente,no comprobado,
CSV

cat >"$TMP_DIR/category-preferences.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
lacteos-uno,La Formatgeria,Abrera,Quesos y lácteos,Queso,Carrer Major 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/place/La%20Formatgeria,41.1,2.1,pendiente
bodega-uno,Celler Uno,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,600000001,dos@example.com,https://example.com,no comprobado,https://facebook.com/dos,https://instagram.com/dos,https://www.google.com/maps/place/Celler%20Uno,41.2,2.2,pendiente
pan-uno,Forn Uno,Abrera,Panadería y repostería,Pan,Carrer Major 3,Descripcion suficientemente larga para validar,,600000002,tres@example.com,https://example.com,no comprobado,https://facebook.com/tres,https://instagram.com/tres,https://www.google.com/maps/place/Forn%20Uno,41.3,2.3,pendiente
CSV

cat >"$TMP_DIR/verificado-suppression.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
verif-sin-contacto,Masia Verif,Abrera,Bodega,Vino,Carrer Major 10,Descripcion suficientemente larga para validar,,,,https://example.com,,,https://www.google.com/maps/place/Verif,41.51,1.90,,verificado,no comprobado,
verif-geo-malo,Masia Lejos,Abrera,Bodega,Vino,Carrer Major 11,Descripcion suficientemente larga para validar,,+34600000000,lejos@example.com,https://example.com,https://facebook.com/lejos,https://instagram.com/lejos,https://www.google.com/maps/place/Lejos,41.0,2.3,,verificado,no comprobado,
CSV

cat >"$TMP_DIR/geo-blocking.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
geo-lejisimos,Masia Lejisimos,Abrera,Bodega,Vino,Carrer Major 12,Descripcion suficientemente larga para validar,,+34600000000,lejisimos@example.com,https://example.com,no comprobado,https://facebook.com/lejisimos,https://instagram.com/lejisimos,https://www.google.com/maps/place/Lejisimos,40.0,-3.7,pendiente
CSV

# A missing column and a duplicated column are both caught by the positional
# canonical-header comparison, which names the offending position.
run_expect_failure "$TMP_DIR/out-missing.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/missing-column.csv"
grep -q "header is not the canonical 20-column header (column 17 is 'verificacion' instead of 'imagen')" "$TMP_DIR/out-missing.txt"

run_expect_failure "$TMP_DIR/out-duplicate-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/duplicate-header.csv"
grep -q "header is not the canonical 20-column header (column 12 is 'web' instead of 'Facebook')" "$TMP_DIR/out-duplicate-header.txt"

# The exact canonical 20-column header passes contract mode.
run_expect_success "$TMP_DIR/out-canonical-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/canonical-ok.csv"

# All 20 columns present but out of order is a blocking error.
run_expect_failure "$TMP_DIR/out-wrong-order-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/wrong-order-header.csv"
grep -q "header is not the canonical 20-column header (column 12 is 'Instagram' instead of 'Facebook')" "$TMP_DIR/out-wrong-order-header.txt"

run_expect_failure "$TMP_DIR/out-crlf.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/crlf.csv"
grep -q "line endings must be LF, found CR/CRLF" "$TMP_DIR/out-crlf.txt"

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
# A missing identity field is blocking; the rest stay as warnings.
grep -q "ERROR line 2 .* nombre is required" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 2 .* lat/lon is .* km from Abrera centroid" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* nombre + municipio looks duplicated" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 3 .* categoria has near-duplicate variants" "$TMP_DIR/out-quality.txt"
# Identical long descriptions across rows are flagged as template boilerplate.
grep -q "WARNING line 3 .* descripcion is duplicated on lines 3, 4" "$TMP_DIR/out-quality.txt"
grep -q "WARNING line 4 .* descripcion is duplicated on lines 3, 4" "$TMP_DIR/out-quality.txt"
# Short descriptions never join the duplicate-description check.
if grep -q "line 2 .* descripcion is duplicated" "$TMP_DIR/out-quality.txt"; then
  echo "Error: short description must not raise the duplicate-description warning" >&2
  exit 1
fi
# Optional-field gaps are suppressed (tracked by check:csv:completeness), never warnings.
for needle in "telefono and correo are both empty" "Google Maps is empty" "coordinates are present but direccion is not useful"; do
  if grep -q "WARNING .* ${needle}" "$TMP_DIR/out-quality.txt"; then
    echo "Error: optional-field gap '${needle}' must be suppressed, not a warning" >&2
    exit 1
  fi
done
grep -q "suppressed (absent optional fields" "$TMP_DIR/out-quality.txt"

# Coordinates far enough to belong to another municipio are a blocking error.
run_expect_failure "$TMP_DIR/out-geo-blocking.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/geo-blocking.csv"
grep -q "ERROR line 2 .* km from Abrera centroid (threshold 100 km)" "$TMP_DIR/out-geo-blocking.txt"

# Canal de venta is blocking: an unknown token, or a channel set without an
# actual online sale to describe, both fail the contract.
run_expect_failure "$TMP_DIR/out-sales-channel.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/sales-channel.csv"
grep -q "ERROR line 3 .* Canal de venta has invalid value.*'tienda'" "$TMP_DIR/out-sales-channel.txt"
grep -q "ERROR line 4 .* Canal de venta is set but Venta online is not" "$TMP_DIR/out-sales-channel.txt"
if grep -q "line 2 .* Canal de venta" "$TMP_DIR/out-sales-channel.txt"; then
  echo "Error: valid multichannel row should not raise a Canal de venta issue" >&2
  exit 1
fi

# Controlled values must match the canonical spelling exactly.
run_expect_failure "$TMP_DIR/out-inexact.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/inexact-values.csv"
grep -q "ERROR line 2 .* Venta online must be one of: sí, no, no comprobado" "$TMP_DIR/out-inexact.txt"
grep -q "ERROR line 3 .* verificacion must be one of: pendiente, parcial, verificado" "$TMP_DIR/out-inexact.txt"

# nombre, municipio and categoria are required, not merely advisable.
run_expect_failure "$TMP_DIR/out-identity.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/identity-required.csv"
grep -q "ERROR line 2 .* nombre is required" "$TMP_DIR/out-identity.txt"
grep -q "ERROR line 2 .* categoria is required" "$TMP_DIR/out-identity.txt"

# correo carries one address, not a list.
run_expect_failure "$TMP_DIR/out-email.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/multi-email.csv"
grep -q "ERROR line 2 .* correo: .* must be a single valid email address" "$TMP_DIR/out-email.txt"

run_expect_failure "$TMP_DIR/out-bom.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/bom.csv"
grep -q "must not start with a UTF-8 BOM" "$TMP_DIR/out-bom.txt"

# Social links must reach a profile; Facebook's /p/<name>-<id> form is a real page.
run_expect_success "$TMP_DIR/out-junk-social.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/junk-social.csv"
grep -q "WARNING line 2 .* Facebook: points to the network home page" "$TMP_DIR/out-junk-social.txt"
grep -q "WARNING line 2 .* Instagram: points to a feed or explore page" "$TMP_DIR/out-junk-social.txt"
if grep -q "line 3 .* \(Facebook\|Instagram\):" "$TMP_DIR/out-junk-social.txt"; then
  echo "Error: a real Facebook /p/ page and Instagram profile must not warn" >&2
  exit 1
fi

run_expect_failure "$TMP_DIR/out-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/category-preferences.csv"
grep -q "WARNING line 2 .* categoria should use preferred label 'Lácteos y quesos' instead of 'Quesos y lácteos'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 3 .* categoria should use preferred label 'Bodega' instead of 'Vino'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 4 .* categoria should use preferred label 'Pan y pastelería' instead of 'Panadería y repostería'" "$TMP_DIR/out-categories.txt"

run_expect_success "$TMP_DIR/out-verificado-suppression.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/verificado-suppression.csv"
# Optional-field gaps are suppressed, not listed (whatever the verification status).
if grep -q "Facebook and Instagram are both empty" "$TMP_DIR/out-verificado-suppression.txt"; then
  echo "Error: optional-field gap should be suppressed" >&2
  exit 1
fi
if grep -q "telefono and correo are both empty" "$TMP_DIR/out-verificado-suppression.txt"; then
  echo "Error: optional-field gap should be suppressed" >&2
  exit 1
fi
grep -q "suppressed (absent optional fields; tracked by check:csv:completeness)" "$TMP_DIR/out-verificado-suppression.txt"
# Correctness warnings still fire on verificado rows.
grep -q "WARNING line 3 .* lat/lon is .* km from Abrera centroid" "$TMP_DIR/out-verificado-suppression.txt"

# Province completeness uses fixed targets and does not expose a CSV baseline.
run_expect_success "$TMP_DIR/out-completeness.json" \
  node "$ROOT_DIR/scripts/audit-province-completeness.js" --json
node - "$TMP_DIR/out-completeness.json" <<'NODE'
const fs = require("node:fs");
const report = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

if ("baseline" in report) {
  throw new Error("completeness report must not expose a province baseline");
}
if (!report.targets || report.targets.verificacion !== 100) {
  throw new Error("completeness report must expose fixed editorial targets");
}
if (!Array.isArray(report.results) || report.results.length === 0) {
  throw new Error("completeness report must include province results");
}
if (
  report.results.some(
    (result) =>
      typeof result.progress !== "number" ||
      result.progress < 0 ||
      result.progress > 100 ||
      !Array.isArray(result.gaps),
  )
) {
  throw new Error("completeness results must include bounded progress and gaps");
}
NODE

echo "CSV audit tests OK."
