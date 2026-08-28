#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

DOCUMENTED_HEADER="$(awk '
  /^## Canonical header$/ { in_header = 1; next }
  in_header && /^```text$/ { getline; print; exit }
' "$ROOT_DIR/docs/CSV_CONTRACT.md")"
MACHINE_HEADER="$(node -e '
process.stdout.write(require(process.argv[1]).CANONICAL_HEADER.join(","));
' "$ROOT_DIR/scripts/audit-csv.js")"

if [[ "$DOCUMENTED_HEADER" != "$MACHINE_HEADER" ]]; then
  echo "Error: docs/CSV_CONTRACT.md and scripts/audit-csv.js define different canonical headers" >&2
  exit 1
fi

# The audit scopes the centroid lookup to the country and region it reads off
# the path, so a fixture has to sit where a real area CSV sits or it gets no
# geography check at all. Abrera, the municipio these fixtures use, is Catalan.
TMP_DIR="$TMP_ROOT/data/csv/es/catalunya"
JP_DIR="$TMP_ROOT/data/csv/jp/kanto"
mkdir -p "$TMP_DIR" "$JP_DIR"

prepare_fixture_identity() {
  local candidate
  for candidate in "$@"; do
    if [[ "$candidate" != *.csv || ! -f "$candidate" ]]; then
      continue
    fi
    node - "$candidate" <<'NODE'
const crypto = require("node:crypto");
const fs = require("node:fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const file = process.argv[2];
const canonicalColumns = require(process.cwd() + "/scripts/audit-csv.js").CANONICAL_HEADER;
const canonical = canonicalColumns.join(",");
const producerIdIndex = canonicalColumns.indexOf("producer_id");
const descriptionLocaleIndex = canonicalColumns.indexOf("descripcion_locale");
const identityHeader = canonicalColumns.slice(0, producerIdIndex + 1).join(",");
const descriptionLocaleHeader = canonicalColumns.slice(0, descriptionLocaleIndex + 1).join(",");
const raw = fs.readFileSync(file, "utf8");
const firstLine = raw.split("\n", 1)[0];
if (
  raw.startsWith("\uFEFF") ||
  raw.includes("\r") ||
  ![canonical, identityHeader, descriptionLocaleHeader].includes(firstLine)
) {
  process.exit(0);
}

let records;
try {
  records = parse(raw, { relax_column_count: true });
} catch {
  // Leave intentionally malformed CSV untouched so audit-csv reports it.
  process.exit(0);
}

const base = Number.parseInt(
  crypto.createHash("sha256").update(file).digest("hex").slice(0, 10),
  16,
) * 1000;
let changed = firstLine !== canonical;
records[0] = [...canonicalColumns];
for (let index = 1; index < records.length; index += 1) {
  const cells = records[index];
  if (cells.length === producerIdIndex) {
    cells.push(String(base + index));
    changed = true;
  }
  if (cells.length === descriptionLocaleIndex) {
    const description = String(cells[canonicalColumns.indexOf("descripcion")] ?? "").trim();
    cells.push(description ? "es" : "");
    changed = true;
  }
  while (cells.length < canonicalColumns.length) {
    cells.push("");
    changed = true;
  }
}
if (changed) fs.writeFileSync(file, stringify(records));
NODE
  done
}

run_expect_failure() {
  local output_file="$1"
  shift

  prepare_fixture_identity "$@"

  if "$@" >"$output_file" 2>&1; then
    echo "Error: command was expected to fail: $*" >&2
    exit 1
  fi
}

run_expect_success() {
  local output_file="$1"
  shift

  prepare_fixture_identity "$@"
  "$@" >"$output_file" 2>&1
}

prepare_git_audit_repo() {
  local repo_root="$1"
  mkdir -p "$repo_root/scripts" "$repo_root/data/reference" \
    "$repo_root/data/csv/es/one" "$repo_root/data/csv/es/two"
  cp "$ROOT_DIR/scripts/audit-csv.js" "$repo_root/scripts/audit-csv.js"
  cp "$ROOT_DIR/data/reference/categories.json" "$repo_root/data/reference/categories.json"
  ln -s "$ROOT_DIR/node_modules" "$repo_root/node_modules"
  cat >"$repo_root/data/csv/es/AGENTS.md" <<'GUIDE'
# Country
## Operating state
## Country rules
## Source ceilings
GUIDE
  cat >"$repo_root/data/csv/es/country.json" <<'JSON'
{
  "label": "Spain",
  "unit": { "one": "area", "many": "areas" },
  "regionUnit": { "one": "region", "many": "regions" },
  "i18n": {
    "defaultLocale": "es",
    "publishedLocales": ["es"],
    "labels": { "es": "España", "en": "Spain" },
    "unitLabels": {
      "es": { "one": "área", "many": "áreas" },
      "en": { "one": "area", "many": "areas" }
    },
    "regionUnitLabels": {
      "es": { "one": "región", "many": "regiones" },
      "en": { "one": "region", "many": "regions" }
    }
  },
  "regions": [
    {
      "slug": "one",
      "label": "One",
      "labels": { "es": "Uno", "en": "One" },
      "areas": [{ "slug": "one", "label": "One", "labels": { "es": "Uno", "en": "One" } }]
    },
    {
      "slug": "two",
      "label": "Two",
      "labels": { "es": "Dos", "en": "Two" },
      "areas": [{ "slug": "two", "label": "Two", "labels": { "es": "Dos", "en": "Two" } }]
    }
  ]
}
JSON
  cat >"$repo_root/data/csv/es/two/two.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id,descripcion_locale
CSV
  (
    cd "$repo_root"
    git init -q
    git config user.email test@example.com
    git config user.name "Chisan Test"
  )
}

REGISTRY_OK="$TMP_ROOT/registry-ok"
REGISTRY_DUPLICATE="$TMP_ROOT/registry-duplicate"
REGISTRY_RESERVED="$TMP_ROOT/registry-reserved"
REGISTRY_BAD_ALIAS_TARGET="$TMP_ROOT/registry-bad-alias-target"
REGISTRY_PRODUCER_ALIAS_VALID="$TMP_ROOT/registry-producer-alias-valid"
REGISTRY_PRODUCER_ALIAS_INVALID="$TMP_ROOT/registry-producer-alias-invalid"
REGISTRY_MISSING_GUIDE="$TMP_ROOT/registry-missing-guide"
REGISTRY_BAD_GUIDE="$TMP_ROOT/registry-bad-guide"
REGISTRY_I18N_VALID="$TMP_ROOT/registry-i18n-valid"
REGISTRY_I18N_CATALUNYA="$TMP_ROOT/registry-i18n-catalunya"
REGISTRY_I18N_INHERITED="$TMP_ROOT/registry-i18n-inherited"
REGISTRY_I18N_MISSING_LABELS="$TMP_ROOT/registry-i18n-missing-labels"
REGISTRY_I18N_INVALID_PAIRS="$TMP_ROOT/registry-i18n-invalid-pairs"
REGISTRY_I18N_EXCLUDED_DEFAULT="$TMP_ROOT/registry-i18n-excluded-default"
REGISTRY_I18N_ORPHAN_REGION="$TMP_ROOT/registry-i18n-orphan-region"
REGISTRY_I18N_ORPHAN_AREA="$TMP_ROOT/registry-i18n-orphan-area"
mkdir -p "$REGISTRY_OK/es/centro" "$REGISTRY_OK/pt/norte"
mkdir -p "$REGISTRY_DUPLICATE/es/centro" "$REGISTRY_DUPLICATE/es/norte"
mkdir -p "$REGISTRY_RESERVED/es/centro"
mkdir -p "$REGISTRY_BAD_ALIAS_TARGET/es/centro"
mkdir -p "$REGISTRY_PRODUCER_ALIAS_VALID/es/centro"
mkdir -p "$REGISTRY_PRODUCER_ALIAS_INVALID/es/centro"
mkdir -p "$REGISTRY_MISSING_GUIDE/es/centro" "$REGISTRY_BAD_GUIDE/es/centro"
touch "$REGISTRY_OK/es/centro/ribera.csv" "$REGISTRY_OK/pt/norte/ribera.csv"
touch "$REGISTRY_DUPLICATE/es/centro/ribera.csv" "$REGISTRY_DUPLICATE/es/norte/ribera.csv"
touch "$REGISTRY_RESERVED/es/centro/events.csv" "$REGISTRY_RESERVED/es/centro/retail.csv"
touch "$REGISTRY_BAD_ALIAS_TARGET/es/centro/madrid.csv"
touch "$REGISTRY_MISSING_GUIDE/es/centro/madrid.csv" "$REGISTRY_BAD_GUIDE/es/centro/madrid.csv"

for guide in "$REGISTRY_OK/es/AGENTS.md" "$REGISTRY_OK/pt/AGENTS.md" \
  "$REGISTRY_DUPLICATE/es/AGENTS.md" "$REGISTRY_RESERVED/es/AGENTS.md" \
  "$REGISTRY_BAD_ALIAS_TARGET/es/AGENTS.md" \
  "$REGISTRY_PRODUCER_ALIAS_VALID/es/AGENTS.md" \
  "$REGISTRY_PRODUCER_ALIAS_INVALID/es/AGENTS.md"; do
  cat >"$guide" <<'GUIDE'
# Country
## Operating state
## Country rules
## Source ceilings
GUIDE
done

cat >"$REGISTRY_OK/es/country.json" <<'JSON'
{
  "label": "Spain",
  "unit": { "one": "province", "many": "provinces" },
  "regionUnit": { "one": "region", "many": "regions" },
  "i18n": {
    "defaultLocale": "es",
    "publishedLocales": ["es"],
    "labels": { "es": "España", "en": "Spain" },
    "unitLabels": {
      "es": { "one": "provincia", "many": "provincias" },
      "en": { "one": "province", "many": "provinces" }
    },
    "regionUnitLabels": {
      "es": { "one": "región", "many": "regiones" },
      "en": { "one": "region", "many": "regions" }
    }
  },
  "regions": [{
    "slug": "centro",
    "label": "Centro",
    "labels": { "es": "Centro", "en": "Central" },
    "areas": [{ "slug": "ribera", "label": "Ribera", "labels": { "es": "Ribera", "en": "Riverbank" } }]
  }]
}
JSON

cat >"$REGISTRY_OK/pt/country.json" <<'JSON'
{
  "label": "Portugal",
  "unit": { "one": "district", "many": "districts" },
  "regionUnit": { "one": "region", "many": "regions" },
  "i18n": {
    "defaultLocale": "pt",
    "publishedLocales": ["pt"],
    "labels": { "pt": "Portugal", "en": "Portugal" },
    "unitLabels": {
      "pt": { "one": "distrito", "many": "distritos" },
      "en": { "one": "district", "many": "districts" }
    },
    "regionUnitLabels": {
      "pt": { "one": "região", "many": "regiões" },
      "en": { "one": "region", "many": "regions" }
    }
  },
  "regions": [{
    "slug": "norte",
    "label": "Norte",
    "labels": { "pt": "Norte", "en": "North" },
    "areas": [{ "slug": "ribera", "label": "Ribera", "labels": { "pt": "Ribera", "en": "Riverbank" } }]
  }]
}
JSON

cat >"$REGISTRY_RESERVED/es/country.json" <<'JSON'
{"aliases":{"events":"events","retail":"retail"}}
JSON

cat >"$REGISTRY_BAD_ALIAS_TARGET/es/country.json" <<'JSON'
{"aliases":{"old-madrid":"missing-area"}}
JSON

cat >"$REGISTRY_PRODUCER_ALIAS_VALID/es/country.json" <<'JSON'
{
  "label": "Spain",
  "unit": { "one": "province", "many": "provinces" },
  "regionUnit": { "one": "region", "many": "regions" },
  "aliases": { "old-area": "current" },
  "producerRouteAliases": {
    "old-area/ø-former-producer": 1,
    "current/other-former-producer": 1
  },
  "i18n": {
    "defaultLocale": "es",
    "publishedLocales": ["es"],
    "labels": { "es": "España", "en": "Spain" },
    "unitLabels": {
      "es": { "one": "provincia", "many": "provincias" },
      "en": { "one": "province", "many": "provinces" }
    },
    "regionUnitLabels": {
      "es": { "one": "región", "many": "regiones" },
      "en": { "one": "region", "many": "regions" }
    }
  },
  "regions": [{
    "slug": "centro",
    "label": "Centro",
    "labels": { "es": "Centro", "en": "Central" },
    "areas": [{ "slug": "current", "label": "Current", "labels": { "es": "Actual", "en": "Current" } }]
  }]
}
JSON
cat >"$REGISTRY_PRODUCER_ALIAS_VALID/es/centro/current.csv" <<'CSV'
slug,producer_id
canonical-producer,1
CSV

cat >"$REGISTRY_PRODUCER_ALIAS_INVALID/es/country.json" <<'JSON'
{"producerRouteAliases":{"malformed":1,"old/%2F":2,"old/bad?slug":3,"old/bad#slug":4,"old/%00":5,"old/":6,"current/canonical-producer":1,"old/missing":99,"old/string-id":"1","old/unsafe":9007199254740992}}
JSON
cat >"$REGISTRY_PRODUCER_ALIAS_INVALID/es/centro/current.csv" <<'CSV'
slug,producer_id
canonical-producer,1
CSV

cat >"$REGISTRY_BAD_GUIDE/es/AGENTS.md" <<'GUIDE'
# Country
## Notes
GUIDE

run_expect_success "$TMP_ROOT/out-registry-ok.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_OK"
grep -q "Area registry contract OK (2 areas)" "$TMP_ROOT/out-registry-ok.txt"

run_expect_failure "$TMP_ROOT/out-registry-duplicate.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_DUPLICATE"
grep -q "area slug 'ribera' is duplicated within country 'es'" "$TMP_ROOT/out-registry-duplicate.txt"

run_expect_failure "$TMP_ROOT/out-registry-reserved.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_RESERVED"
grep -q "uses reserved route segment 'events'" "$TMP_ROOT/out-registry-reserved.txt"
grep -q "uses reserved route segment 'retail'" "$TMP_ROOT/out-registry-reserved.txt"
grep -q "area alias 'es/events' uses reserved route segment 'events'" "$TMP_ROOT/out-registry-reserved.txt"
grep -q "area alias 'es/retail' uses reserved route segment 'retail'" "$TMP_ROOT/out-registry-reserved.txt"

run_expect_failure "$TMP_ROOT/out-registry-bad-alias-target.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_BAD_ALIAS_TARGET"
grep -q "area alias 'es/old-madrid' targets 'missing-area', which is not an area" \
  "$TMP_ROOT/out-registry-bad-alias-target.txt"

run_expect_success "$TMP_ROOT/out-registry-producer-alias-valid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_PRODUCER_ALIAS_VALID"

run_expect_failure "$TMP_ROOT/out-registry-producer-alias-invalid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_PRODUCER_ALIAS_INVALID"
grep -q "producer route alias 'es/malformed' must store two non-empty decoded NFC segments" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/%2F' must store two non-empty decoded NFC segments" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/bad?slug' must store two non-empty decoded NFC segments" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/%00' must store two non-empty decoded NFC segments" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/current/canonical-producer' collides with current canonical producer_id '1'" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/missing' targets producer_id '99'" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/string-id' must target a positive safe-integer producer_id" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"
grep -q "producer route alias 'es/old/unsafe' must target a positive safe-integer producer_id" \
  "$TMP_ROOT/out-registry-producer-alias-invalid.txt"

run_expect_failure "$TMP_ROOT/out-registry-missing-guide.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_MISSING_GUIDE"
grep -q "country 'es' must contain AGENTS.md" "$TMP_ROOT/out-registry-missing-guide.txt"

run_expect_failure "$TMP_ROOT/out-registry-bad-guide.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_BAD_GUIDE"
grep -q "country guide 'es/AGENTS.md' must use exactly" "$TMP_ROOT/out-registry-bad-guide.txt"

prepare_i18n_registry() {
  local registry_root="$1"
  local fixture="$2"
  mkdir -p "$registry_root/es/catalunya"
  touch "$registry_root/es/catalunya/barcelona.csv"
  cp "$ROOT_DIR/scripts/fixtures/i18n-manifests/$fixture" "$registry_root/es/country.json"
  cat >"$registry_root/es/AGENTS.md" <<'GUIDE'
# Country
## Operating state
## Country rules
## Source ceilings
GUIDE
}

prepare_i18n_registry "$REGISTRY_I18N_VALID" "valid-defaults.json"
prepare_i18n_registry "$REGISTRY_I18N_CATALUNYA" "catalunya-overrides.json"
prepare_i18n_registry "$REGISTRY_I18N_INHERITED" "inherited-locales.json"
prepare_i18n_registry "$REGISTRY_I18N_MISSING_LABELS" "missing-labels.json"
prepare_i18n_registry "$REGISTRY_I18N_INVALID_PAIRS" "invalid-locale-pairs.json"
prepare_i18n_registry "$REGISTRY_I18N_EXCLUDED_DEFAULT" "excluded-default.json"
prepare_i18n_registry "$REGISTRY_I18N_ORPHAN_REGION" "orphan-region.json"
prepare_i18n_registry "$REGISTRY_I18N_ORPHAN_AREA" "orphan-area.json"

run_expect_success "$TMP_ROOT/out-registry-i18n-valid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_VALID"
run_expect_success "$TMP_ROOT/out-registry-i18n-catalunya.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_CATALUNYA"
run_expect_success "$TMP_ROOT/out-registry-i18n-inherited.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_INHERITED"

run_expect_failure "$TMP_ROOT/out-registry-i18n-missing-labels.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_MISSING_LABELS"
grep -q "area 'es/catalunya/barcelona' labels.en must be a non-empty string" \
  "$TMP_ROOT/out-registry-i18n-missing-labels.txt"

run_expect_failure "$TMP_ROOT/out-registry-i18n-invalid-pairs.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_INVALID_PAIRS"
grep -q "default locale 'es' must appear in i18n.publishedLocales" \
  "$TMP_ROOT/out-registry-i18n-invalid-pairs.txt"
grep -q "i18n.publishedLocales duplicates locale 'en'" \
  "$TMP_ROOT/out-registry-i18n-invalid-pairs.txt"
grep -q "preferred locale 'ca' must appear in its effective published locales" \
  "$TMP_ROOT/out-registry-i18n-invalid-pairs.txt"
grep -q "i18n.publishedLocales entry must be one of: en, es, ca, de, ja, fr, it, nl, pt, af" \
  "$TMP_ROOT/out-registry-i18n-invalid-pairs.txt"

run_expect_failure "$TMP_ROOT/out-registry-i18n-excluded-default.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_EXCLUDED_DEFAULT"
grep -q "effective published locales must include country default locale 'es'" \
  "$TMP_ROOT/out-registry-i18n-excluded-default.txt"

run_expect_failure "$TMP_ROOT/out-registry-i18n-orphan-region.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_ORPHAN_REGION"
grep -q "declares region 'invented-region' outside the CSV tree" \
  "$TMP_ROOT/out-registry-i18n-orphan-region.txt"

run_expect_failure "$TMP_ROOT/out-registry-i18n-orphan-area.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" --registry "$REGISTRY_I18N_ORPHAN_AREA"
grep -q "declares area 'invented-area' outside the CSV tree" \
  "$TMP_ROOT/out-registry-i18n-orphan-area.txt"

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

cat >"$TMP_DIR/legacy-verification.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,,no comprobado,,,,,,verificado
CSV

cat >"$TMP_DIR/invalid-online-sales.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
fila-1,Uno,Abrera,Vino,Vino,Carrer 1,Descripcion suficientemente larga para validar,,600000000,uno@example.com,https://example.com,tal vez,https://facebook.com/uno,https://instagram.com/uno,https://www.google.com/maps/search/?api=1&query=Uno&query_place_id=abc,41.1,2.1,pendiente
CSV

cat >"$TMP_DIR/sales-channel.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
canal-ok,Masia Ok,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,,sí,ecommerce|whatsapp,
canal-bad,Masia Bad,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,bad@example.com,https://example.com,https://facebook.com/bad,https://instagram.com/bad,https://www.google.com/maps/place/Bad,41.52,1.91,,,sí,ecommerce|tienda,
canal-estado,Masia Estado,Abrera,Vino,Vino,Carrer Major 3,Descripcion suficientemente larga para validar,,+34600000002,est@example.com,https://example.com,https://facebook.com/est,https://instagram.com/est,https://www.google.com/maps/place/Est,41.53,1.92,,,no,whatsapp,
CSV

cat >"$TMP_DIR/canonical-ok.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
canal-ok,Masia Ok,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,,sí,ecommerce|whatsapp,Cerveza
CSV

cat >"$TMP_DIR/identity-format.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
id-empty,ID Empty,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,
id-zero,ID Zero,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,0
id-leading,ID Leading,Abrera,Vino,Vino,Carrer 3,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,01
id-decimal,ID Decimal,Abrera,Vino,Vino,Carrer 4,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,1.5
id-unsafe,ID Unsafe,Abrera,Vino,Vino,Carrer 5,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,9007199254740992
CSV

cat >"$TMP_DIR/reserved-producer-route.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
vino,Reserved Category,Abrera,Vino,Vino,Carrer 8,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,108
CSV

ES_IDENTITY_A="$TMP_ROOT/data/csv/es/identity-a"
ES_IDENTITY_B="$TMP_ROOT/data/csv/es/identity-b"
PT_IDENTITY="$TMP_ROOT/data/csv/pt/identity"
mkdir -p "$ES_IDENTITY_A" "$ES_IDENTITY_B" "$PT_IDENTITY"
cat >"$ES_IDENTITY_A/a.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
country-shared,Country A,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,500
id-only-a,ID Only A,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,501
CSV
cat >"$ES_IDENTITY_B/b.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
country-shared,Country B,Abrera,Vino,Vino,Carrer 3,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,502
id-only-b,ID Only B,Abrera,Vino,Vino,Carrer 4,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,501
CSV
cat >"$PT_IDENTITY/pt.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
country-shared,Country PT,Abrera,Vino,Vino,Carrer 5,Productor de prueba,,,,https://example.com,,,,41.51,1.90,,pendiente,no,,,500
CSV

cat >"$TMP_DIR/additional-categories.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
multi-ok,Kura Ok,Abrera,Sake,"Sake, cerveza",Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,,,,41.51,1.90,,pendiente,no,,Cerveza
multi-primary,Kura Primary,Abrera,Sake,Sake,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,primary@example.com,https://example.com,,,,41.52,1.91,,pendiente,no,,Sake
multi-duplicate,Kura Duplicate,Abrera,Sake,Sake,Carrer Major 3,Descripcion suficientemente larga para validar,,+34600000002,duplicate@example.com,https://example.com,,,,41.53,1.92,,pendiente,no,,Cerveza|Cerveza
multi-empty,Kura Empty,Abrera,Sake,Sake,Carrer Major 4,Descripcion suficientemente larga para validar,,+34600000003,empty@example.com,https://example.com,,,,41.54,1.93,,pendiente,no,,Cerveza||Vino
multi-invalid,Kura Invalid,Abrera,Sake,Sake,Carrer Major 5,Descripcion suficientemente larga para validar,,+34600000004,invalid@example.com,https://example.com,,,,41.55,1.94,,pendiente,no,,Cerveza artesana
CSV

# Controlled values are matched exactly: folded case and a missing accent are drift.
cat >"$TMP_DIR/inexact-values.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
valor-acento,Masia Acento,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,,si,,
valor-mayus,Masia Mayus,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.52,1.91,,Pendiente,no,,
CSV

cat >"$TMP_DIR/identity-required.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
sin-identidad,,Abrera,,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV

cat >"$TMP_DIR/multi-email.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
dos-correos,Masia Correos,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,uno@example.com; dos@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV

cat >"$TMP_DIR/junk-social.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
social-basura,Masia Social,Abrera,Vino,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/,https://www.instagram.com/explore/tags/queso/,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
social-pagina,Masia Pagina,Abrera,Vino,Vino,Carrer Major 2,Descripcion suficientemente larga para validar,,+34600000001,ok2@example.com,https://example.com,https://www.facebook.com/p/Masia-Pagina-100063712593417,https://www.instagram.com/masiapagina,https://www.google.com/maps/place/Ok2,41.52,1.91,,pendiente,no,,
CSV

cat >"$TMP_DIR/google-maps-quality.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
maps-place-id,Masia Place ID,Abrera,Vino,Vino,Carrer Major 1,Productor con una ficha concreta y revisada,,+34600000000,place@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=41.51%2C1.90&query_place_id=abc,41.51,1.90,,pendiente,no,,
maps-coordinates,Masia Coordenadas,Abrera,Vino,Vino,Carrer Major 2,Productor con un pin exacto sin ficha propia,,+34600000001,coords@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=41.52%2C1.91,41.52,1.91,,pendiente,no,,
maps-text,Masia Textual,Abrera,Vino,Vino,Carrer Major 3,Productor enlazado mediante una busqueda textual,,+34600000002,text@example.com,https://example.com,,,https://www.google.com/maps/search/?api=1&query=Masia+Textual+Abrera,41.53,1.92,,pendiente,no,,
maps-no-api,Masia Sin API,Abrera,Vino,Vino,Carrer Major 4,Productor con una URL universal incompleta,,+34600000003,api@example.com,https://example.com,,,https://www.google.com/maps/search/?query=41.54%2C1.93&query_place_id=def,41.54,1.93,,pendiente,no,,
maps-short,Masia Corta,Abrera,Vino,Vino,Carrer Major 5,Productor enlazado mediante una URL acortada,,+34600000004,short@example.com,https://example.com,,,https://maps.app.goo.gl/opaque,41.55,1.94,,pendiente,no,,
maps-interface,Masia Interfaz,Abrera,Vino,Vino,Carrer Major 6,Productor enlazado mediante una URL de interfaz,,+34600000005,interface@example.com,https://example.com,,,https://www.google.com/maps/place/Masia+Interfaz,41.56,1.95,,pendiente,no,,
CSV

# A UTF-8 BOM (typical of spreadsheet exports) is a blocking error.
prepare_fixture_identity "$TMP_DIR/canonical-ok.csv" "$TMP_DIR/sales-channel.csv"
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

# The retired-label case reads its label off the live registry instead of
# freezing one, so the fixture follows taxonomy migrations.
# Labels with a comma are skipped: they would need quoting inside the fixture.
# One value per line, not tab-separated: bash counts a tab as IFS whitespace
# even when IFS is set to one, so consecutive or leading empty fields collapse —
# and "empty" is the normal state here once a migration finishes.
{
  read -r RETIRED_GONE
  read -r RETIRED_GONE_TARGET
} < <(
  node -e '
    const config = require(process.argv[1]);
    const valid = new Set(config.categories);
    const usable = Object.entries(config.retiredCategories).filter(
      ([label, target]) => !label.includes(",") && !target.includes(","),
    );
    const rejected = usable.find(([label]) => !valid.has(label)) ?? ["", ""];
    // Trailing newline on purpose: `read` returns non-zero on EOF without one.
    process.stdout.write(`${rejected.join("\n")}\n`);
  ' "$ROOT_DIR/data/reference/categories.json"
)

cat >"$TMP_DIR/empty-verification.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
verif-sin-contacto,Masia Verif,Abrera,Vino,Vino,Carrer Major 10,Descripcion suficientemente larga para validar,,,,https://example.com,,,https://www.google.com/maps/place/Verif,41.51,1.90,,,no comprobado,,
verif-geo-malo,Masia Lejos,Abrera,Vino,Vino,Carrer Major 11,Descripcion suficientemente larga para validar,,+34600000000,lejos@example.com,https://example.com,https://facebook.com/lejos,https://instagram.com/lejos,https://www.google.com/maps/place/Lejos,41.0,2.3,,,no comprobado,,
CSV

cat >"$TMP_DIR/geo-blocking.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Venta online,Facebook,Instagram,Google Maps,lat,lon,verificacion
geo-lejisimos,Masia Lejisimos,Abrera,Vino,Vino,Carrer Major 12,Descripcion suficientemente larga para validar,,+34600000000,lejisimos@example.com,https://example.com,no comprobado,https://facebook.com/lejisimos,https://instagram.com/lejisimos,https://www.google.com/maps/place/Lejisimos,40.0,-3.7,pendiente
CSV

# A missing column and a duplicated column are both caught by the positional
# canonical-header comparison, which names the offending position.
run_expect_failure "$TMP_DIR/out-missing.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/missing-column.csv"
grep -q "header does not match the canonical header (column 17 is 'verificacion' instead of 'imagen')" "$TMP_DIR/out-missing.txt"

run_expect_failure "$TMP_DIR/out-duplicate-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/duplicate-header.csv"
grep -q "header does not match the canonical header (column 12 is 'web' instead of 'Facebook')" "$TMP_DIR/out-duplicate-header.txt"

# The exact canonical header passes contract mode, regardless of its current length.
run_expect_success "$TMP_DIR/out-canonical-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/canonical-ok.csv"

run_expect_failure "$TMP_DIR/out-identity-format.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/identity-format.csv"
grep -q "producer_id is required" "$TMP_DIR/out-identity-format.txt"
grep -q "producer_id must be a positive base-10 integer without leading zeroes" "$TMP_DIR/out-identity-format.txt"
grep -q "producer_id must be a safe integer" "$TMP_DIR/out-identity-format.txt"

run_expect_failure "$TMP_DIR/out-reserved-producer-route.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/reserved-producer-route.csv"
grep -q "slug 'vino' is reserved for a category route" \
  "$TMP_DIR/out-reserved-producer-route.txt"

# Canonical producer identity is country-scoped.
run_expect_success "$TMP_DIR/out-identity-cross-country.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$ES_IDENTITY_A/a.csv" "$PT_IDENTITY/pt.csv"
run_expect_failure "$TMP_DIR/out-identity-same-country.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$ES_IDENTITY_A/a.csv" "$ES_IDENTITY_B/b.csv"
grep -q "producer_id '501' is duplicated within country 'es'" "$TMP_DIR/out-identity-same-country.txt"
grep -q "slug 'country-shared' is duplicated within country 'es'" "$TMP_DIR/out-identity-same-country.txt"

# `--changed` audits the changed file's full contract but loads every sibling in
# the same country for identity collisions. Exercise the actual Git-backed CLI
# in an isolated miniature repository so unrelated workspace changes cannot
# influence the result.
CHANGED_ROOT="$TMP_ROOT/changed-repo"
mkdir -p "$CHANGED_ROOT/scripts" "$CHANGED_ROOT/data/reference" \
  "$CHANGED_ROOT/data/csv/es/one" "$CHANGED_ROOT/data/csv/es/two"
cp "$ROOT_DIR/scripts/audit-csv.js" "$CHANGED_ROOT/scripts/audit-csv.js"
cp "$ROOT_DIR/data/reference/categories.json" "$CHANGED_ROOT/data/reference/categories.json"
ln -s "$ROOT_DIR/node_modules" "$CHANGED_ROOT/node_modules"
cat >"$CHANGED_ROOT/data/csv/es/AGENTS.md" <<'GUIDE'
# Country
## Operating state
## Country rules
## Source ceilings
GUIDE
cat >"$CHANGED_ROOT/data/csv/es/country.json" <<'JSON'
{
  "label": "Spain",
  "unit": { "one": "area", "many": "areas" },
  "regionUnit": { "one": "region", "many": "regions" },
  "i18n": {
    "defaultLocale": "es",
    "publishedLocales": ["es"],
    "labels": { "es": "España", "en": "Spain" },
    "unitLabels": {
      "es": { "one": "área", "many": "áreas" },
      "en": { "one": "area", "many": "areas" }
    },
    "regionUnitLabels": {
      "es": { "one": "región", "many": "regiones" },
      "en": { "one": "region", "many": "regions" }
    }
  },
  "regions": [
    {
      "slug": "one",
      "label": "One",
      "labels": { "es": "Uno", "en": "One" },
      "areas": [{ "slug": "one", "label": "One", "labels": { "es": "Uno", "en": "One" } }]
    },
    {
      "slug": "two",
      "label": "Two",
      "labels": { "es": "Dos", "en": "Two" },
      "areas": [{ "slug": "two", "label": "Two", "labels": { "es": "Dos", "en": "Two" } }]
    }
  ]
}
JSON
cat >"$CHANGED_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-producer,Stable Producer,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,1
CSV
cat >"$CHANGED_ROOT/data/csv/es/two/two.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
changed-producer,Changed Producer,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,2
CSV
prepare_fixture_identity \
  "$CHANGED_ROOT/data/csv/es/one/one.csv" \
  "$CHANGED_ROOT/data/csv/es/two/two.csv"
(
  cd "$CHANGED_ROOT"
  git init -q
  git config user.email test@example.com
  git config user.name "Chisan Test"
  git add .
  git commit -qm baseline
  node - <<'NODE'
const fs = require("node:fs");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const file = "data/csv/es/two/two.csv";
const records = parse(fs.readFileSync(file, "utf8"));
const header = records[0];
records[1][header.indexOf("slug")] = "stable-producer";
records[1][header.indexOf("producer_id")] = "1";
fs.writeFileSync(file, stringify(records));
NODE
)
run_expect_failure "$TMP_DIR/out-changed-country-collision.txt" \
  bash -c 'cd "$1" && node scripts/audit-csv.js --changed' _ "$CHANGED_ROOT"
grep -q "producer_id '1' is duplicated within country 'es'" "$TMP_DIR/out-changed-country-collision.txt"
grep -q "slug 'stable-producer' is duplicated within country 'es'" "$TMP_DIR/out-changed-country-collision.txt"

# The one-time bootstrap has no historical producer_id in HEAD. Any valid,
# country-unique assignment is accepted instead of being mistaken for a new-row
# allocation after an existing identity sequence.
BOOTSTRAP_ROOT="$TMP_ROOT/bootstrap-repo"
prepare_git_audit_repo "$BOOTSTRAP_ROOT"
cat >"$BOOTSTRAP_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales
bootstrap-producer,Bootstrap Producer,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,
CSV
(
  cd "$BOOTSTRAP_ROOT"
  git add .
  git commit -qm baseline
)
cat >"$BOOTSTRAP_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
bootstrap-producer,Bootstrap Producer,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,42
CSV
prepare_fixture_identity "$BOOTSTRAP_ROOT/data/csv/es/one/one.csv"
run_expect_success "$TMP_DIR/out-changed-bootstrap.txt" \
  bash -c 'cd "$1" && node scripts/audit-csv.js --changed' _ "$BOOTSTRAP_ROOT"

# Once HEAD contains producer_id, a slug may be renamed without compatibility
# storage, while genuinely new rows consume the next country ID.
HISTORY_OK_ROOT="$TMP_ROOT/history-ok-repo"
prepare_git_audit_repo "$HISTORY_OK_ROOT"
cat >"$HISTORY_OK_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-a,Stable A,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,1
stable-b,Stable B,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,2
CSV
prepare_fixture_identity "$HISTORY_OK_ROOT/data/csv/es/one/one.csv"
(
  cd "$HISTORY_OK_ROOT"
  git add .
  git commit -qm baseline
)
cat >"$HISTORY_OK_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-a,Stable A,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,1
renamed-b,Stable B,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,2
fresh-c,Fresh C,Abrera,Vino,Vino,Carrer 3,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,3
CSV
prepare_fixture_identity "$HISTORY_OK_ROOT/data/csv/es/one/one.csv"
run_expect_success "$TMP_DIR/out-changed-history-ok.txt" \
  bash -c 'cd "$1" && node scripts/audit-csv.js --changed' _ "$HISTORY_OK_ROOT"

HISTORY_BAD_ROOT="$TMP_ROOT/history-bad-repo"
prepare_git_audit_repo "$HISTORY_BAD_ROOT"
mkdir -p "$HISTORY_BAD_ROOT/data/csv/es/two"
cat >"$HISTORY_BAD_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-a,Stable A,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,1
stable-b,Stable B,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,2
CSV
cat >"$HISTORY_BAD_ROOT/data/csv/es/two/two.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-c,Stable C,Abrera,Vino,Vino,Carrer 3,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,3
CSV
prepare_fixture_identity \
  "$HISTORY_BAD_ROOT/data/csv/es/one/one.csv" \
  "$HISTORY_BAD_ROOT/data/csv/es/two/two.csv"
(
  cd "$HISTORY_BAD_ROOT"
  git add .
  git commit -qm baseline
)
cat >"$HISTORY_BAD_ROOT/data/csv/es/one/one.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
stable-a,Stable A,Abrera,Vino,Vino,Carrer 1,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,4
renamed-b,Stable B,Abrera,Vino,Vino,Carrer 2,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,2
replacement,Replacement,Abrera,Vino,Vino,Carrer 4,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,1
fresh-gap,Fresh Gap,Abrera,Vino,Vino,Carrer 5,Productor de prueba,,,,https://example.com,,,,,,,pendiente,no,,,6
CSV
prepare_fixture_identity "$HISTORY_BAD_ROOT/data/csv/es/one/one.csv"
run_expect_failure "$TMP_DIR/out-changed-history-bad.txt" \
  bash -c 'cd "$1" && node scripts/audit-csv.js --changed' _ "$HISTORY_BAD_ROOT"
grep -q "producer_id changed for HEAD slug 'stable-a': expected '1', found '4'" \
  "$TMP_DIR/out-changed-history-bad.txt"
grep -q "new producer_id '6' must continue country 'es' sequence at '5'" \
  "$TMP_DIR/out-changed-history-bad.txt"

# The consolidated CLI requires an explicit scope and audits several inputs in
# one process, which is how the full 500-area gate avoids reloading centroids.
run_expect_failure "$TMP_DIR/out-no-scope.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js"
grep -q "choose exactly one scope" "$TMP_DIR/out-no-scope.txt"

run_expect_success "$TMP_DIR/out-multi-file.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/canonical-ok.csv" "$TMP_DIR/junk-social.csv"
grep -qF -- "- files: 2" "$TMP_DIR/out-multi-file.txt"
grep -qF -- "- rows: 3" "$TMP_DIR/out-multi-file.txt"
grep -qF -- "- status: OK" "$TMP_DIR/out-multi-file.txt"

# A category filter matches an additional category and accepts the documented
# Spanish command aliases.
run_expect_success "$TMP_DIR/out-list-additional.txt" \
  node "$ROOT_DIR/scripts/list-producers.mjs" "$TMP_DIR/canonical-ok.csv" --categoria Cerveza
grep -q "canal-ok .* Vino .* Cerveza" "$TMP_DIR/out-list-additional.txt"

# All canonical columns present but out of order is a blocking error.
run_expect_failure "$TMP_DIR/out-wrong-order-header.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/wrong-order-header.csv"
grep -q "header does not match the canonical header (column 12 is 'Instagram' instead of 'Facebook')" "$TMP_DIR/out-wrong-order-header.txt"

# Additional categories use exact registry tokens separated by one `|`, may not
# repeat the primary category and may not contain duplicates or empty tokens.
run_expect_failure "$TMP_DIR/out-additional-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/additional-categories.csv"
grep -q "ERROR line 3 .* categorias adicionales repeats primary categoria 'Sake'" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 4 .* categorias adicionales repeats 'Cerveza'" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 5 .* categorias adicionales contains an empty token" "$TMP_DIR/out-additional-categories.txt"
grep -q "ERROR line 6 .* categorias adicionales 'Cerveza artesana' was retired; use 'Cerveza'" "$TMP_DIR/out-additional-categories.txt"
if grep -q "ERROR line 2 .* categorias adicionales" "$TMP_DIR/out-additional-categories.txt"; then
  echo "Error: valid additional categories must pass the contract" >&2
  exit 1
fi

run_expect_failure "$TMP_DIR/out-crlf.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/crlf.csv"
grep -q "line endings must be LF, found CR/CRLF" "$TMP_DIR/out-crlf.txt"

run_expect_failure "$TMP_DIR/out-links.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/invalid-links.csv"
grep -q "Facebook: must point to facebook.com" "$TMP_DIR/out-links.txt"

run_expect_failure "$TMP_DIR/out-lat.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/invalid-lat.csv"
grep -q "lat must be between -90 and 90" "$TMP_DIR/out-lat.txt"

run_expect_failure "$TMP_DIR/out-duplicate-slug.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/duplicate-slug.csv"
grep -q "ERROR line 2 .* slug is duplicated" "$TMP_DIR/out-duplicate-slug.txt"

run_expect_failure "$TMP_DIR/out-invalid-verification.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/invalid-verification.csv"
grep -q "verificacion must be empty or pendiente" "$TMP_DIR/out-invalid-verification.txt"

run_expect_failure "$TMP_DIR/out-legacy-verification.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/legacy-verification.csv"
grep -q "verificacion must be empty or pendiente" "$TMP_DIR/out-legacy-verification.txt"

run_expect_failure "$TMP_DIR/out-online-sales.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/invalid-online-sales.csv"
grep -q "Venta online must be one of: sí, no, no comprobado" "$TMP_DIR/out-online-sales.txt"

# Coordinates far enough to belong to another municipio are a blocking error.
run_expect_failure "$TMP_DIR/out-geo-blocking.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/geo-blocking.csv"
grep -q "ERROR line 2 .* km from Abrera centroid (threshold 100 km)" "$TMP_DIR/out-geo-blocking.txt"

# `municipio` written as two names. Either half may be the one the lookup knows
# and the order is not stable, so the check tries them all — but only trusts the
# answer when the halves agree on where the town is.
cat >"$TMP_DIR/municipio-bilingue.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
bilingue-ok,Masia Bilingue,Ujué / Uxue,Vino,Vino,Carrer Major 1,Descripcion de la primera masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,42.47981,-1.49709,,pendiente,no,,
paren-ok,Masia Parentesis,Granollers (Palou),Vino,Vino,Carrer Major 2,Descripcion de la segunda masia con datos propios,,+34600000001,ok2@example.com,https://example.com,https://facebook.com/ok2,https://instagram.com/ok2,https://www.google.com/maps/place/Ok2,41.60833,2.28889,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-bilingue.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/municipio-bilingue.csv"
# A zero skipped count says both rows reached the geo-check.
if grep -q "geo-check skipped .*: [1-9]" "$TMP_DIR/out-municipio-bilingue.txt"; then
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
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
bilingue-lejos,Masia Lejos,Puente la Reina / Gares,Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,42.90,-1.60,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-bilingue-lejos.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/municipio-bilingue-lejos.csv"
grep -q "WARNING line 2 .* km from Puente la Reina centroid" "$TMP_DIR/out-municipio-bilingue-lejos.txt"

# Territorial homonym: `La Floresta` is a municipality in Lleida and also a
# district of Sant Cugat, 96 km apart. Taking the first half would invent that
# gap on a correct row, so a disagreement means the lookup says nothing.
cat >"$TMP_DIR/municipio-homonimo.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
homonimo,Masia Homonima,La Floresta (Sant Cugat del Vallès),Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.47354,2.08524,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-homonimo.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/municipio-homonimo.csv"
grep -q "geo-check skipped .*: 1 rows" "$TMP_DIR/out-municipio-homonimo.txt"
if grep -q "km from" "$TMP_DIR/out-municipio-homonimo.txt"; then
  echo "Error: an ambiguous municipio must be skipped, not resolved to one half" >&2
  exit 1
fi

# A real pedanía the lookup does not cover stays skipped and silent: it is a
# documented gap, not a defect to report.
cat >"$TMP_DIR/municipio-pedania.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
pedania,Masia Pedania,Aldea Sintetica de Arriba,Vino,Vino,Carrer Major 1,Descripcion de la masia con datos propios,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_success "$TMP_DIR/out-municipio-pedania.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/municipio-pedania.csv"
grep -q "geo-check skipped .*: 1 rows" "$TMP_DIR/out-municipio-pedania.txt"

# Canal de venta is blocking: an unknown token, or a channel set without an
# actual online sale to describe, both fail the contract.
run_expect_failure "$TMP_DIR/out-sales-channel.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/sales-channel.csv"
grep -q "ERROR line 3 .* Canal de venta has invalid value.*'tienda'" "$TMP_DIR/out-sales-channel.txt"
grep -q "ERROR line 4 .* Canal de venta is set but Venta online is not" "$TMP_DIR/out-sales-channel.txt"
if grep -q "line 2 .* Canal de venta" "$TMP_DIR/out-sales-channel.txt"; then
  echo "Error: valid multichannel row should not raise a Canal de venta issue" >&2
  exit 1
fi

# Controlled values must match the canonical spelling exactly.
run_expect_failure "$TMP_DIR/out-inexact.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/inexact-values.csv"
grep -q "ERROR line 2 .* Venta online must be one of: sí, no, no comprobado" "$TMP_DIR/out-inexact.txt"
grep -q "ERROR line 3 .* verificacion must be empty or pendiente" "$TMP_DIR/out-inexact.txt"

# nombre, municipio and categoria are required, not merely advisable.
run_expect_failure "$TMP_DIR/out-identity.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/identity-required.csv"
grep -q "ERROR line 2 .* nombre is required" "$TMP_DIR/out-identity.txt"
grep -q "ERROR line 2 .* categoria is required" "$TMP_DIR/out-identity.txt"

# correo carries one address, not a list.
run_expect_failure "$TMP_DIR/out-email.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/multi-email.csv"
grep -q "ERROR line 2 .* correo: .* must be a single valid email address" "$TMP_DIR/out-email.txt"

run_expect_failure "$TMP_DIR/out-bom.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/bom.csv"
grep -q "must not start with a UTF-8 BOM" "$TMP_DIR/out-bom.txt"

# Social links must reach a profile; Facebook's /p/<name>-<id> form is a real page.
run_expect_success "$TMP_DIR/out-junk-social.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/junk-social.csv"
grep -q "WARNING line 2 .* Facebook: points to the network home page" "$TMP_DIR/out-junk-social.txt"
grep -q "WARNING line 2 .* Instagram: points to a feed or explore page" "$TMP_DIR/out-junk-social.txt"
if grep -q "line 3 .* \(Facebook\|Instagram\):" "$TMP_DIR/out-junk-social.txt"; then
  echo "Error: a real Facebook /p/ page and Instagram profile must not warn" >&2
  exit 1
fi

# Only the canonical Place ID link passes. Coordinate-only and text searches,
# missing api=1, short URLs and copied interface URLs remain non-blocking
# migration warnings so the inherited catalog can be repaired progressively.
run_expect_success "$TMP_DIR/out-google-maps-quality.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/google-maps-quality.csv"
grep -q "WARNING line 3 .* Google Maps: coordinate-only link opens a pin" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 4 .* Google Maps: textual search has no query_place_id" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 5 .* Google Maps: search URL must include api=1" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 6 .* Google Maps: shortened maps.app.goo.gl URL is opaque" \
  "$TMP_DIR/out-google-maps-quality.txt"
grep -q "WARNING line 7 .* Google Maps: copied interface URL is not canonical" \
  "$TMP_DIR/out-google-maps-quality.txt"
if grep -q "WARNING line 2 .* Google Maps:" "$TMP_DIR/out-google-maps-quality.txt"; then
  echo "Error: a canonical Place ID Maps URL must not warn" >&2
  exit 1
fi

run_expect_failure "$TMP_DIR/out-categories.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/category-preferences.csv"
grep -q "ERROR line 2 .* categoria 'Quesos y lácteos' was retired; use 'Lácteos y quesos'" "$TMP_DIR/out-categories.txt"
grep -q "ERROR line 3 .* categoria 'Vinos y bebidas' was retired; use 'Vino'" "$TMP_DIR/out-categories.txt"
grep -q "ERROR line 4 .* categoria 'Panadería y repostería' was retired; use 'Pan y cereal'" "$TMP_DIR/out-categories.txt"

# A label that was never registered keeps the plain rejection.
cat >"$TMP_DIR/unknown-category.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
cat-inventada,Masia Inventada,Abrera,Categoria Inventada,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_failure "$TMP_DIR/out-unknown-category.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/unknown-category.csv"
grep -q "categoria 'Categoria Inventada' is not a valid category" "$TMP_DIR/out-unknown-category.txt"

# A retired label out of the valid list cannot come back, and the error names
# what replaced it: most of these are a retired label typed again.
if [[ -z "$RETIRED_GONE" ]]; then
  echo "Error: the registry has no retired-and-rejected label to test" >&2
  exit 1
fi
cat >"$TMP_DIR/retired-rejected.csv" <<CSV
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
cat-retirada,Masia Retirada,Abrera,$RETIRED_GONE,Vino,Carrer Major 1,Descripcion suficientemente larga para validar,,+34600000000,ok@example.com,https://example.com,https://facebook.com/ok,https://instagram.com/ok,https://www.google.com/maps/place/Ok,41.51,1.90,,pendiente,no,,
CSV
run_expect_failure "$TMP_DIR/out-retired-rejected.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/retired-rejected.csv"
grep -qF "categoria '$RETIRED_GONE' was retired; use '$RETIRED_GONE_TARGET'" "$TMP_DIR/out-retired-rejected.txt"

# Empty optional fields are valid; the only warning here is the real geography gap.
run_expect_success "$TMP_DIR/out-empty-verification-geo.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/empty-verification.csv"
grep -q "WARNING line 3 .* lat/lon is .* km from Abrera centroid" "$TMP_DIR/out-empty-verification-geo.txt"

# One municipio name, two countries: `chiba` is Chiba in Kantō and an alt label
# of Chiva in Valencia, 10.751 km apart. Each row is measured against its own
# country's catalog, so both pass without anyone curating the collision.
cat >"$JP_DIR/scoped-jp.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
kura-chiba,Kura Chiba,Chiba,Sake,Sake,1-1 Chuo,Bodega de sake con datos propios en la ciudad,,,,https://example.com,,,,35.60728,140.10636,,pendiente,no comprobado,,
CSV
cat >"$TMP_DIR/scoped-es.csv" <<'CSV'
slug,nombre,municipio,categoria,productos estrella,direccion,descripcion,horario,telefono,correo,web,Facebook,Instagram,Google Maps,lat,lon,imagen,verificacion,Venta online,Canal de venta,categorias adicionales,producer_id
celler-chiva,Celler de Chiva,Chiva,Vino,Vino,Carrer Major 1,Bodega con datos propios en el municipio,,,,https://example.com,,,,39.47138,-0.71971,,pendiente,no comprobado,,
CSV
run_expect_success "$TMP_DIR/out-scoped-jp.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$JP_DIR/scoped-jp.csv"
run_expect_success "$TMP_DIR/out-scoped-es.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/scoped-es.csv"
for scoped in jp es; do
  if grep -q "geo-check skipped (municipio centroid not uniquely resolved): [1-9]" "$TMP_DIR/out-scoped-$scoped.txt"; then
    echo "Error: scoped lookup should resolve Chiba/Chiva in its own country" >&2
    exit 1
  fi
  grep -qF -- "- centroid fallback coordinates: 1" "$TMP_DIR/out-scoped-$scoped.txt"
done

# Canonical descriptions and their source locale are one paired editorial
# value: neither half may be populated independently and codes are exact.
node - "$TMP_DIR/description-locale-invalid.csv" "$TMP_DIR/description-locale-empty.csv" "$TMP_DIR/description-locale-source-only.csv" <<'NODE'
const fs = require("node:fs");
const { stringify } = require("csv-stringify/sync");
const header = require(process.cwd() + "/scripts/audit-csv.js").CANONICAL_HEADER;
const makeRow = (producerId, description, locale) => ({
  slug: `locale-${producerId}`,
  nombre: `Locale ${producerId}`,
  municipio: "Abrera",
  categoria: "Miel",
  verificacion: "pendiente",
  "Venta online": "no comprobado",
  producer_id: String(producerId),
  descripcion: description,
  descripcion_locale: locale,
});
const record = (row) => header.map((column) => row[column] ?? "");
fs.writeFileSync(
  process.argv[2],
  stringify([
    header,
    record(makeRow(91001, "", "es")),
    record(makeRow(91002, "Descripción con idioma ausente.", "")),
    record(makeRow(91003, "Descripción con código incorrecto.", "ES")),
  ]),
);
fs.writeFileSync(
  process.argv[3],
  stringify([header, record(makeRow(91004, "", ""))]),
);
fs.writeFileSync(
  process.argv[4],
  stringify([
    header,
    record(makeRow(91005, "Produit du miel sur son exploitation.", "fr")),
  ]),
);
NODE
run_expect_failure "$TMP_DIR/out-description-locale-invalid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/description-locale-invalid.csv"
grep -q "empty descripcion requires empty descripcion_locale" \
  "$TMP_DIR/out-description-locale-invalid.txt"
grep -q "non-empty descripcion requires descripcion_locale to be one of: en, es, ca, de, ja, fr, it, nl, pt, af" \
  "$TMP_DIR/out-description-locale-invalid.txt"
grep -q "xh, zu, gl, eu" "$TMP_DIR/out-description-locale-invalid.txt"
run_expect_success "$TMP_DIR/out-description-locale-empty.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/description-locale-empty.csv"
run_expect_success "$TMP_DIR/out-description-locale-source-only.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/description-locale-source-only.csv"

# Premium profile fields keep their controlled tokens, locale pairing, Unicode
# ceiling and highlighted-link ordering inside the canonical CSV contract.
node - "$TMP_DIR/premium-fields-valid.csv" "$TMP_DIR/premium-fields-invalid.csv" <<'NODE'
const fs = require("node:fs");
const { stringify } = require("csv-stringify/sync");
const header = require(process.cwd() + "/scripts/audit-csv.js").CANONICAL_HEADER;
const makeRow = (producerId, overrides = {}) => ({
  slug: `premium-${producerId}`,
  nombre: `Premium ${producerId}`,
  municipio: "Abrera",
  categoria: "Miel",
  verificacion: "pendiente",
  "Venta online": "no comprobado",
  producer_id: String(producerId),
  ...overrides,
});
const record = (row) => header.map((column) => row[column] ?? "");
fs.writeFileSync(
  process.argv[2],
  stringify([
    header,
    record(
      makeRow(93001, {
        "visitas guiadas": "sí",
        "mensaje a la comunidad": "🍯".repeat(1000),
        mensaje_comunidad_locale: "es",
        "enlace destacado 1": "http://example.com/prensa",
        "enlace destacado 2": "https://example.com/entrevista",
      }),
    ),
    record(
      makeRow(93002, {
        "visitas guiadas": "no",
        "mensaje a la comunidad": "Primera línea.  Dos espacios.\nSegunda línea.",
        mensaje_comunidad_locale: "es",
      }),
    ),
  ]),
);
fs.writeFileSync(
  process.argv[3],
  stringify([
    header,
    record(makeRow(93003, { "visitas guiadas": "Sí" })),
    record(
      makeRow(93004, {
        "mensaje a la comunidad": "Mensaje sin idioma de origen.",
      }),
    ),
    record(makeRow(93005, { mensaje_comunidad_locale: "es" })),
    record(
      makeRow(93006, {
        "mensaje a la comunidad": "🍯".repeat(1001),
        mensaje_comunidad_locale: "es",
      }),
    ),
    record(
      makeRow(93007, {
        "enlace destacado 1": "ftp://example.com/prensa",
      }),
    ),
    record(
      makeRow(93008, {
        "enlace destacado 2": "https://example.com/entrevista",
      }),
    ),
    record(
      makeRow(93009, {
        "enlace destacado 1": "https://example.com/reportaje",
        "enlace destacado 2": "https://example.com/reportaje",
      }),
    ),
    record(
      makeRow(93010, {
        "mensaje a la comunidad": "=SUM(A1:A2)",
        mensaje_comunidad_locale: "es",
      }),
    ),
    record(
      makeRow(93011, {
        "enlace destacado 1": "https://reporter:secret@example.com/reportaje",
      }),
    ),
    record(
      makeRow(93012, {
        "mensaje a la comunidad": `A${" ".repeat(999)}B`,
        mensaje_comunidad_locale: "es",
      }),
    ),
    record(
      makeRow(93013, {
        "enlace destacado 1": "https://example.com",
        "enlace destacado 2": "https://example.com/",
      }),
    ),
    record(
      makeRow(93014, {
        "mensaje a la comunidad": "<nav>Inicio</nav> Mensaje del productor.",
        mensaje_comunidad_locale: "es",
      }),
    ),
  ]),
);
NODE
run_expect_success "$TMP_DIR/out-premium-fields-valid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/premium-fields-valid.csv"
run_expect_failure "$TMP_DIR/out-premium-fields-invalid.txt" \
  node "$ROOT_DIR/scripts/audit-csv.js" "$TMP_DIR/premium-fields-invalid.csv"
grep -q "visitas guiadas must be empty, 'sí' or 'no'" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "non-empty mensaje a la comunidad requires mensaje_comunidad_locale to be one of:" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "empty mensaje a la comunidad requires empty mensaje_comunidad_locale" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "mensaje a la comunidad must be at most 1000 Unicode characters; found 1001" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
test "$(grep -c "mensaje a la comunidad must be at most 1000 Unicode characters; found 1001" \
  "$TMP_DIR/out-premium-fields-invalid.txt")" -eq 2
grep -q "mensaje a la comunidad cannot start with a spreadsheet formula marker" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "mensaje a la comunidad contains HTML copied from a source page" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "enlace destacado 1: must use http or https" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "enlace destacado 1: must not include embedded credentials" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "enlace destacado 2 requires enlace destacado 1" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
grep -q "enlace destacado 1 and enlace destacado 2 must be different" \
  "$TMP_DIR/out-premium-fields-invalid.txt"
test "$(grep -c "enlace destacado 1 and enlace destacado 2 must be different" \
  "$TMP_DIR/out-premium-fields-invalid.txt")" -eq 2

(cd "$ROOT_DIR" && node_modules/.bin/tsx --test scripts/test-i18n.ts)

echo "CSV audit tests OK."
