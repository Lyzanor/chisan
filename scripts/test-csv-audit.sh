#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

# The audit scopes the centroid lookup to the country and region it reads off
# the path, so a fixture has to sit where a real area CSV sits or it gets no
# geography check at all. Abrera, the municipio these fixtures use, is Catalan.
TMP_DIR="$TMP_ROOT/data/csv/es/catalunya"
JP_DIR="$TMP_ROOT/data/csv/jp/kanto"
mkdir -p "$TMP_DIR" "$JP_DIR"

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

REGISTRY_OK="$TMP_ROOT/registry-ok"
REGISTRY_DUPLICATE="$TMP_ROOT/registry-duplicate"
REGISTRY_MISSING_GUIDE="$TMP_ROOT/registry-missing-guide"
REGISTRY_BAD_GUIDE="$TMP_ROOT/registry-bad-guide"
mkdir -p "$REGISTRY_OK/es/centro" "$REGISTRY_OK/pt/norte"
mkdir -p "$REGISTRY_DUPLICATE/es/centro" "$REGISTRY_DUPLICATE/pt/norte"
mkdir -p "$REGISTRY_MISSING_GUIDE/es/centro" "$REGISTRY_BAD_GUIDE/es/centro"
touch "$REGISTRY_OK/es/centro/madrid.csv" "$REGISTRY_OK/pt/norte/porto.csv"
touch "$REGISTRY_DUPLICATE/es/centro/ribera.csv" "$REGISTRY_DUPLICATE/pt/norte/ribera.csv"
touch "$REGISTRY_MISSING_GUIDE/es/centro/madrid.csv" "$REGISTRY_BAD_GUIDE/es/centro/madrid.csv"

for guide in "$REGISTRY_OK/es/AGENTS.md" "$REGISTRY_OK/pt/AGENTS.md" \
  "$REGISTRY_DUPLICATE/es/AGENTS.md" "$REGISTRY_DUPLICATE/pt/AGENTS.md"; do
  cat >"$guide" <<'GUIDE'
# Country
## Operating state
## Country rules
## Source ceilings
GUIDE
done

cat >"$REGISTRY_BAD_GUIDE/es/AGENTS.md" <<'GUIDE'
# Country
## Notes
GUIDE

run_expect_success "$TMP_ROOT/out-registry-ok.txt" \
  node "$ROOT_DIR/scripts/check-area-registry.mjs" "$REGISTRY_OK"
grep -q "Area registry contract OK (2 areas)" "$TMP_ROOT/out-registry-ok.txt"

run_expect_failure "$TMP_ROOT/out-registry-duplicate.txt" \
  node "$ROOT_DIR/scripts/check-area-registry.mjs" "$REGISTRY_DUPLICATE"
grep -q "area slug 'ribera' is global and duplicated" "$TMP_ROOT/out-registry-duplicate.txt"

run_expect_failure "$TMP_ROOT/out-registry-missing-guide.txt" \
  node "$ROOT_DIR/scripts/check-area-registry.mjs" "$REGISTRY_MISSING_GUIDE"
grep -q "country 'es' must contain AGENTS.md" "$TMP_ROOT/out-registry-missing-guide.txt"

run_expect_failure "$TMP_ROOT/out-registry-bad-guide.txt" \
  node "$ROOT_DIR/scripts/check-area-registry.mjs" "$REGISTRY_BAD_GUIDE"
grep -q "country guide 'es/AGENTS.md' must use exactly" "$TMP_ROOT/out-registry-bad-guide.txt"

cat >"$TMP_DIR/missing-column.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/duplicate-header.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com,https://old.example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/invalid-links.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://example.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/invalid-lat.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,123,2.1,pendiente
CSV

cat >"$TMP_DIR/duplicate-slug.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-repetida,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
fila-repetida,Dos,Abrera,Vino,Vino,Carrer 2,Descripcion suficientemente larga para validar,,600000001,dos@example.com,https://example.com,no comprobado,https://facebook.com/dos,https://instagram.com/dos,https://www.google.com/maps/search/?api=1&query=Dos&query_place_id=def,41.2,2.2,pendiente
CSV

cat >"$TMP_DIR/invalid-verification.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,segura
CSV

cat >"$TMP_DIR/verificado-without-evidence.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,,no comprobado,,,,,,verificado
CSV

cat >"$TMP_DIR/invalid-online-sales.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,tal vez,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/quality-warnings.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-repetida,,Abrera,Vino,Vino,,Corta,, , ,,no comprobado,,,,41.1,2.1,pendiente
fila-repetida-dos,Masia Uno,Abrera,Carnicería,Vino,Venta online,Descripcion suficientemente larga para validar,,600000000,masia@example.com,https://example.com,no comprobado,,,,41.2,2.2,parcial
otra-fila,Masia Uno,Abrera,Carniceria,Vino,Carrer Major 4,Descripcion suficientemente larga para validar,,600000001,masia2@example.com,https://example.com,no comprobado,https://facebook.com/masia,,https://www.google.com/maps/place/Masia%20Uno,41.3,2.3,pendiente
CSV

cat >"$TMP_DIR/sales-channel.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
canal-ok,Masia Ok,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,sí,ecommerce|whatsapp,
canal-bad,Masia Bad,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,bad@example.com,https://example.com,https://facebook.com/bad,https://instagram.com/bad,https://www.google.com/maps/place/Bad,41.52,1.91,,verificado,sí,ecommerce|tienda,
canal-estado,Masia Estado,Abrera,Vino,Vino,Carrer Major 3,Descripcion suficientemente larga para validar,,+34600000002,est@example.com,https://example.com,https://facebook.com/est,https://instagram.com/est,https://www.google.com/maps/place/Est,41.53,1.92,,verificado,no,whatsapp,
CSV

cat >"$TMP_DIR/canonical-ok.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
canal-ok,Masia Ok,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,sí,ecommerce|whatsapp,Cerveza
CSV

cat >"$TMP_DIR/additional-categories.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
multi-ok,Kura Ok,Abrera,Sake,"Sake, cerveza",Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,,,,41.51,1.90,,pendiente,no,,Cerveza
multi-primary,Kura Primary,Abrera,Sake,Sake,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,primary@example.com,https://example.com,,,,41.52,1.91,,pendiente,no,,Sake
multi-duplicate,Kura Duplicate,Abrera,Sake,Sake,Carrer Major 3,Descripcion suficientemente larga para validar,,+34600000002,duplicate@example.com,https://example.com,,,,41.53,1.92,,pendiente,no,,Cerveza|Cerveza
multi-empty,Kura Empty,Abrera,Sake,Sake,Carrer Major 4,Descripcion suficientemente larga para validar,,+34600000003,empty@example.com,https://example.com,,,,41.54,1.93,,pendiente,no,,Cerveza||Vino
multi-invalid,Kura Invalid,Abrera,Sake,Sake,Carrer Major 5,Descripcion suficientemente larga para validar,,+34600000004,invalid@example.com,https://example.com,,,,41.55,1.94,,pendiente,no,,Cerveza artesana
CSV

# Controlled values are matched exactly: folded case and a missing accent are drift.
cat >"$TMP_DIR/inexact-values.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
valor-acento,Masia Acento,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,verificado,si,,
valor-mayus,Masia Mayus,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.52,1.91,,Verificado,no,,
CSV

cat >"$TMP_DIR/identity-required.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
sin-identidad,,Abrera,,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV

cat >"$TMP_DIR/multi-email.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
dos-correos,Masia Correos,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com; dos@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV

cat >"$TMP_DIR/junk-social.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
social-basura,Masia Social,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/,https://www.instagram.com/explore/tags/queso/,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
social-pagina,Masia Pagina,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://www.facebook.com/p/Masia-Pagina-100063712593417,https://www.instagram.com/masiapagina,https://www.google.com/maps/place/Ok2,41.52,1.91,,pendiente,no,,
CSV

cat >"$TMP_DIR/google-maps-quality.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
maps-place-id,Masia Place ID,Abrera,Vino,Vino,Carrer Major 1,Productor con una ficha concreta y revisada,,+34600000000,place@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=41.51%2C1.90&query_place_id=abc,41.51,1.90,,pendiente,no,,
maps-coordinates,Masia Coordenadas,Abrera,Vino,Vino,Carrer Major 2,Productor con un pin exacto sin ficha propia,,+34600000001,coords@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=41.52%2C1.91,41.52,1.91,,pendiente,no,,
maps-text,Masia Textual,Abrera,Vino,Vino,Carrer Major 3,Productor enlazado mediante una busqueda textual,,+34600000002,text@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=Masia+Textual+Abrera,41.53,1.92,,pendiente,no,,
maps-no-api,Masia Sin API,Abrera,Vino,Vino,Carrer Major 4,Productor con una URL universal incompleta,,+34600000003,api@example.com,https://example.com,,,https://www.google.com/maps/search/?query=41.54%2C1.93&query_place_id=def,41.54,1.93,,pendiente,no,,
maps-short,Masia Corta,Abrera,Vino,Vino,Carrer Major 5,Productor enlazado mediante una URL acortada,,+34600000004,short@example.com,https://example.com,,,https://maps.app.goo.gl/opaque,41.55,1.94,,pendiente,no,,
maps-interface,Masia Interfaz,Abrera,Vino,Vino,Carrer Major 6,Productor enlazado mediante una URL de interfaz,,+34600000005,interface@example.com,https://example.com,,,https://www.google.com/maps/place/Masia+Interfaz,41.56,1.95,,pendiente,no,,
CSV

# A UTF-8 BOM (typical of spreadsheet exports) is a blocking error.
printf '\xEF\xBB\xBF' >"$TMP_DIR/bom.csv"
cat "$TMP_DIR/canonical-ok.csv" >>"$TMP_DIR/bom.csv"

# Same canonical content as sales-channel.csv but with CRLF line endings.
sed 's/$/\r/' "$TMP_DIR/sales-channel.csv" >"$TMP_DIR/crlf.csv"

cat >"$TMP_DIR/wrong-order-header.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Instagram,Facebook,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com,https://example.com,https://instagram.com/uno,https://facebook.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,,pendiente,no comprobado,
CSV

cat >"$TMP_DIR/category-preferences.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
lacteos-uno,La Formatgeria,Abrera,Quesos y lácteos,Queso,Carrer Major 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,no comprobado,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/place/La%20Formatgeria,41.1,2.1,pendiente
bodega-uno,Celler Uno,Abrera,Vinos y bebidas,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,600000001,dos@example.com,https://example.com,no comprobado,https://facebook.com/dos,https://instagram.com/dos,https://www.google.com/maps/place/Celler%20Uno,41.2,2.2,pendiente
pan-uno,Forn Uno,Abrera,Panadería y repostería,Pan,Carrer Major 3,Descripcion suficientemente larga para validar,,600000002,tres@example.com,https://example.com,no comprobado,https://facebook.com/tres,https://instagram.com/tres,https://www.google.com/maps/place/Forn%20Uno,41.3,2.3,pendiente
CSV

# The retired-label cases read their labels off the live registry instead of
# freezing one. G-CAT-2 keeps moving labels from "retired but still valid"
# (warns, rows left to migrate) to "retired and rejected" (blocking error), so a
# hardcoded fixture would break exactly when the migration it supports lands.
# Labels with a comma are skipped: they would need quoting inside the fixture.
# One value per line, not tab-separated: bash counts a tab as IFS whitespace
# even when IFS is set to one, so consecutive or leading empty fields collapse —
# and "empty" is the normal state here once a migration finishes.
{
  read -r RETIRED_VALID
  read -r RETIRED_VALID_TARGET
  read -r RETIRED_GONE
  read -r RETIRED_GONE_TARGET
} < <(
  node -e '
    const config = require(process.argv[1]);
    const valid = new Set(config.categories);
    const usable = Object.entries(config.retiredCategories).filter(
      ([label, target]) => !label.includes(",") && !target.includes(","),
    );
    const stillValid = usable.find(([label]) => valid.has(label)) ?? ["", ""];
    const rejected = usable.find(([label]) => !valid.has(label)) ?? ["", ""];
    // Trailing newline on purpose: `read` returns non-zero on EOF without one.
    process.stdout.write(`${[...stillValid, ...rejected].join("\n")}\n`);
  ' "$ROOT_DIR/data/reference/categories.json"
)

cat >"$TMP_DIR/verificado-suppression.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
verif-sin-contacto,Masia Verif,Abrera,Vino,Vino,Carrer Major 10,Descripcion suficientemente larga para validar,,,,https://example.com,,,https://www.google.com/maps/place/Verif,41.51,1.90,,verificado,no comprobado,,
verif-geo-malo,Masia Lejos,Abrera,Vino,Vino,Carrer Major 11,Descripcion suficientemente larga para validar,,+34600000000,lejos@example.com,https://example.com,https://facebook.com/lejos,https://instagram.com/lejos,https://www.google.com/maps/place/Lejos,41.0,2.3,,verificado,no comprobado,,
CSV

cat >"$TMP_DIR/geo-blocking.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
geo-lejisimos,Masia Lejisimos,Abrera,Vino,Vino,Carrer Major 12,Descripcion suficientemente larga para validar,,+34600000000,lejisimos@example.com,https://example.com,no comprobado,https://facebook.com/lejisimos,https://instagram.com/lejisimos,https://www.google.com/maps/place/Lejisimos,40.0,-3.7,pendiente
CSV

# A missing column and a duplicated column are both caught by the positional
# canonical-header comparison, which names the offending position.
run_expect_failure "$TMP_DIR/out-missing.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/missing-column.csv"
grep -q "header is not the canonical 21-column header (column 17 is 'verificacion' instead of 'imagen')" "$TMP_DIR/out-missing.txt"

run_expect_failure "$TMP_DIR/out-duplicate-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/duplicate-header.csv"
grep -q "header is not the canonical 21-column header (column 12 is 'web' instead of 'Facebook')" "$TMP_DIR/out-duplicate-header.txt"

# The exact canonical 21-column header passes contract mode.
run_expect_success "$TMP_DIR/out-canonical-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/canonical-ok.csv"

# A category filter matches an additional category and accepts the documented
# Spanish command aliases.
run_expect_success "$TMP_DIR/out-list-additional.txt" \
  node "$ROOT_DIR/scripts/list-area.js" "$TMP_DIR/canonical-ok.csv" --categoria Cerveza
grep -q "canal-ok .* Vino .* Cerveza" "$TMP_DIR/out-list-additional.txt"

# All legacy columns present but out of order is a blocking error.
run_expect_failure "$TMP_DIR/out-wrong-order-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/wrong-order-header.csv"
grep -q "header is not the canonical 21-column header (column 12 is 'Instagram' instead of 'Facebook')" "$TMP_DIR/out-wrong-order-header.txt"

# Additional categories use exact registry tokens separated by one `|`, may not
# repeat the primary category and may not contain duplicates or empty tokens.
run_expect_failure "$TMP_DIR/out-additional-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/additional-categories.csv"
grep -q "ERROR line 3 .* categorias adicionales repeats primary categoria 'Sake'" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 4 .* categorias adicionales repeats 'Cerveza'" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 5 .* categorias adicionales contains an empty token" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 6 .* categorias adicionales 'Cerveza artesana' was retired; use 'Cerveza'" "$TMP_DIR/out-additional-categories.txt"
if grep -q "ERROR line 2 .* categorias adicionales" "$TMP_DIR/out-additional-categories.txt"; then
  echo "Error: valid additional categories must pass the contract" >&2
  exit 1
fi

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
# Optional-field gaps are suppressed, never warnings.
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

# `municipio` written as two names. Either half may be the one the lookup knows
# and the order is not stable, so the check tries them all — but only trusts the
# answer when the halves agree on where the town is.
cat >"$TMP_DIR/municipio-bilingue.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
bilingue-ok,Masia Bilingue,Ujué / Uxue,Vino,Vino,Carrer Major 1,Descripcion de la primera masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,42.47981,-1.49709,,pendiente,no,,
paren-ok,Masia Parentesis,Granollers (Palou),Vino,Vino,Carrer Major 2,Descripcion de la segunda masia con datos propios,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.60833,2.28889,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-bilingue.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/municipio-bilingue.csv"
# The summary only prints the skipped line when something was skipped, so its
# absence is what says both rows reached the geo-check.
if grep -q "geo-check skipped" "$TMP_DIR/out-municipio-bilingue.txt"; then
  echo "Error: both municipio spellings should resolve, nothing to skip" >&2
  exit 1
fi
if grep -q "km from" "$TMP_DIR/out-municipio-bilingue.txt"; then
  echo "Error: a bilingual municipio sitting on its own centroid must not warn" >&2
  exit 1
fi

# The halves resolving is not the same as the row being right: with the same
# spelling and coordinates 30 km away, the check has to fire. This is what
# proves the geo-check runs on these rows instead of silently skipping them.
cat >"$TMP_DIR/municipio-bilingue-lejos.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
bilingue-lejos,Masia Lejos,Puente la Reina / Gares,Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,42.90,-1.60,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-bilingue-lejos.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/municipio-bilingue-lejos.csv"
grep -q "WARNING line 2 .* km from Puente la Reina centroid" "$TMP_DIR/out-municipio-bilingue-lejos.txt"

# Territorial homonym: `La Floresta` is a municipality in Lleida and also a
# district of Sant Cugat, 96 km apart. Taking the first half would invent that
# gap on a correct row, so a disagreement means the lookup says nothing.
cat >"$TMP_DIR/municipio-homonimo.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
homonimo,Masia Homonima,La Floresta (Sant Cugat del Vallès),Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.47354,2.08524,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-homonimo.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/municipio-homonimo.csv"
grep -q "geo-check skipped .*: 1 rows" "$TMP_DIR/out-municipio-homonimo.txt"
if grep -q "km from" "$TMP_DIR/out-municipio-homonimo.txt"; then
  echo "Error: an ambiguous municipio must be skipped, not resolved to one half" >&2
  exit 1
fi

# A real pedanía the lookup does not cover stays skipped and silent: it is a
# documented gap, not a defect to report.
cat >"$TMP_DIR/municipio-pedania.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
pedania,Masia Pedania,Aldea Sintetica de Arriba,Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-pedania.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/municipio-pedania.csv"
grep -q "geo-check skipped .*: 1 rows" "$TMP_DIR/out-municipio-pedania.txt"

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

# Canonical Place ID and exact-coordinate links pass. Text searches, missing
# api=1, short URLs and copied interface URLs remain non-blocking migration
# warnings so the inherited catalog can be repaired progressively.
run_expect_success "$TMP_DIR/out-google-maps-quality.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/google-maps-quality.csv"
grep -q "WARNING line 4 .* Google Maps: textual search has no query_place_id" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 5 .* Google Maps: search URL must include api=1" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 6 .* Google Maps: shortened maps.app.goo.gl URL is opaque" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 7 .* Google Maps: copied interface URL is not canonical" \
  "$TMP_DIR/out-google-maps-quality.txt"
if grep -q "WARNING line [23] .* Google Maps:" "$TMP_DIR/out-google-maps-quality.txt"; then
  echo "Error: canonical Place ID and exact-coordinate Maps URLs must not warn" >&2
  exit 1
fi

run_expect_failure "$TMP_DIR/out-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/category-preferences.csv"
grep -q "WARNING line 2 .* categoria should use preferred label 'Lácteos y quesos' instead of 'Quesos y lácteos'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 3 .* categoria should use preferred label 'Vino' instead of 'Vinos y bebidas'" "$TMP_DIR/out-categories.txt"
grep -q "WARNING line 4 .* categoria should use preferred label 'Pan y cereal' instead of 'Panadería y repostería'" "$TMP_DIR/out-categories.txt"

# A label that was never registered keeps the plain rejection.
cat >"$TMP_DIR/unknown-category.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
cat-inventada,Masia Inventada,Abrera,Categoria Inventada,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_failure "$TMP_DIR/out-unknown-category.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/unknown-category.csv"
grep -q "categoria 'Categoria Inventada' is not a valid category" "$TMP_DIR/out-unknown-category.txt"

# A retired label out of the valid list cannot come back, and the error names
# what replaced it: most of these are a retired label typed again.
if [[ -z "$RETIRED_GONE" ]]; then
  echo "Error: the registry has no retired-and-rejected label to test" >&2
  exit 1
fi
cat >"$TMP_DIR/retired-rejected.csv" <<CSV
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
cat-retirada,Masia Retirada,Abrera,$RETIRED_GONE,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_failure "$TMP_DIR/out-retired-rejected.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/retired-rejected.csv"
grep -qF "categoria '$RETIRED_GONE' was retired; use '$RETIRED_GONE_TARGET'" "$TMP_DIR/out-retired-rejected.txt"

# A retired label still in the valid list is the G-CAT-2 queue: it warns, so the
# rows stay visible, but it does not block anyone else's gate.
if [[ -n "$RETIRED_VALID" ]]; then
  cat >"$TMP_DIR/retired-pending.csv" <<CSV
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
cat-pendiente,Masia Pendiente,Abrera,$RETIRED_VALID,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
  run_expect_success "$TMP_DIR/out-retired-pending.txt" \
    node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/retired-pending.csv"
  grep -qF "WARNING line 2" "$TMP_DIR/out-retired-pending.txt"
  grep -qF "categoria '$RETIRED_VALID' was retired; reassign to '$RETIRED_VALID_TARGET'" \
    "$TMP_DIR/out-retired-pending.txt"
else
  echo "note: no retired label left in the valid list, G-CAT-2 is done"
fi

# Singular and plural of the same label in one CSV: `normalizeSearch` folded
# only case and accents, so this pair used to pass unnoticed inside a province.
# The labels are invented on purpose. The near-duplicate warning groups before
# validating, so this keeps testing the folding even though the catalog no
# longer has a real plural pair for it to catch.
cat >"$TMP_DIR/plural-variants.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
plural-uno,Masia Plural,Abrera,Sintetica,Vino,Carrer Major 1,Descripcion de la primera masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
plural-dos,Masia Singular,Abrera,Sinteticas,Vino,Carrer Major 2,Descripcion de la segunda masia con datos propios,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.52,1.91,,pendiente,no,,
CSV
run_expect_failure "$TMP_DIR/out-plural-variants.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/plural-variants.csv"
grep -q "WARNING line 2 .* categoria has near-duplicate variants: Sintetica \[2\]; Sinteticas \[3\]" \
  "$TMP_DIR/out-plural-variants.txt"
grep -q "WARNING line 3 .* categoria has near-duplicate variants" "$TMP_DIR/out-plural-variants.txt"

# Two genuinely different categories in one CSV must not be folded together.
cat >"$TMP_DIR/distinct-categories.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
distinta-uno,Masia Bodega,Abrera,Vino,Vino,Carrer Major 1,Descripcion de la bodega con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
distinta-dos,Masia Miel,Abrera,Miel,Miel,Carrer Major 2,Descripcion del colmenar con datos propios,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.52,1.91,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-distinct-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=quality "$TMP_DIR/distinct-categories.csv"
if grep -q "near-duplicate variants" "$TMP_DIR/out-distinct-categories.txt"; then
  echo "Error: unrelated categories must not fold into one stem" >&2
  exit 1
fi

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
grep -q "suppressed (absent optional fields; empty is a valid value)" "$TMP_DIR/out-verificado-suppression.txt"
# Correctness warnings still fire on verificado rows.
grep -q "WARNING line 3 .* lat/lon is .* km from Abrera centroid" "$TMP_DIR/out-verificado-suppression.txt"

# One municipio name, two countries: `chiba` is Chiba in Kantō and an alt label
# of Chiva in Valencia, 10.751 km apart. Each row is measured against its own
# country's catalog, so both pass without anyone curating the collision.
cat >"$JP_DIR/scoped-jp.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
kura-chiba,Kura Chiba,Chiba,Sake,Sake,1-1 Chuo,Bodega de sake con datos propios en la ciudad,,,,https://example.com,,,,35.60728,140.10636,,pendiente,no comprobado,,
CSV
cat >"$TMP_DIR/scoped-es.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
celler-chiva,Celler de Chiva,Chiva,Vino,Vino,Carrer Major 1,Bodega con datos propios en el municipio,,,,https://example.com,,,,39.47138,-0.71971,,pendiente,no comprobado,,
CSV
run_expect_success "$TMP_DIR/out-scoped-jp.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$JP_DIR/scoped-jp.csv"
run_expect_success "$TMP_DIR/out-scoped-es.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --mode=contract "$TMP_DIR/scoped-es.csv"
for scoped in jp es; do
  if grep -q "geo-check skipped (municipio not in data/reference/municipalities.json): [1-9]" "$TMP_DIR/out-scoped-$scoped.txt"; then
    echo "Error: scoped lookup should resolve Chiba/Chiva in its own country" >&2
    exit 1
  fi
  grep -qF -- "- centroid fallback coordinates: 1" "$TMP_DIR/out-scoped-$scoped.txt"
done

echo "CSV audit tests OK."
