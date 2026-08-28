#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3210}"
BASE_URL="${BASE_URL:-http://127.0.0.1:$PORT}"

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required." >&2
  exit 1
fi

extract_sample() {
  node <<'NODE'
const fs = require("node:fs");
const { parse } = require("csv-parse/sync");

const raw = fs.readFileSync("data/csv/es/catalunya/barcelona.csv", "utf8");
const rows = parse(raw, { columns: true, bom: true, skip_empty_lines: true });
if (!rows.length) {
  console.error("CSV has no rows.");
  process.exit(1);
}

const readAdditionalCategories = (row) =>
  (row["categorias adicionales"] || "")
    .split("|")
    .map((category) => category.trim())
    .filter(Boolean);
const first = rows[0];
const multiCategory = rows.find((row) => readAdditionalCategories(row).length >= 2);
const last = rows.at(-1);
const additionalCategories = multiCategory ? readAdditionalCategories(multiCategory) : [];
const payload = {
  slug: (first.slug || "").trim(),
  name: (first.nombre || "").trim(),
  category: (first.categoria || "").trim(),
  producerId: (first.producer_id || "").trim(),
  multiSlug: (multiCategory?.slug || "").trim(),
  multiName: (multiCategory?.nombre || "").trim(),
  multiPrimaryCategory: (multiCategory?.categoria || "").trim(),
  multiAdditionalCategory: additionalCategories[0] || "",
  multiSecondAdditionalCategory: additionalCategories[1] || "",
  lastSlug: (last?.slug || "").trim(),
};
if (
  !payload.slug ||
  !payload.name ||
  !payload.category ||
  !payload.producerId ||
  !payload.multiSlug ||
  !payload.multiName ||
  !payload.multiPrimaryCategory ||
  !payload.multiAdditionalCategory ||
  !payload.multiSecondAdditionalCategory ||
  !payload.lastSlug
) {
  console.error("CSV rows are missing required fields for behavior fixtures.");
  process.exit(1);
}

process.stdout.write(JSON.stringify(payload));
NODE
}

wait_for_app() {
  local attempts=0
  until curl -fsS "$BASE_URL/" >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [[ "$attempts" -ge 80 ]]; then
      echo "Error: app did not become ready at $BASE_URL" >&2
      return 1
    fi
    sleep 0.5
  done
}

assert_html_lang() {
  local route="$1"
  local expected="$2"
  local html="$3"

  if [[ "$html" != *"<html lang=\"$expected\""* ]]; then
    echo "Error: $route should render html lang='$expected' before JavaScript." >&2
    exit 1
  fi
}

cleanup() {
  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" >/dev/null 2>&1; then
    kill "$DEV_PID" >/dev/null 2>&1 || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

FIXTURE_JSON="$(extract_sample)"
SLUG="$(node -p "JSON.parse(process.argv[1]).slug" "$FIXTURE_JSON")"
NAME="$(node -p "JSON.parse(process.argv[1]).name" "$FIXTURE_JSON")"
CATEGORY="$(node -p "JSON.parse(process.argv[1]).category" "$FIXTURE_JSON")"
PRODUCER_ID="$(node -p "JSON.parse(process.argv[1]).producerId" "$FIXTURE_JSON")"
MULTI_SLUG="$(node -p "JSON.parse(process.argv[1]).multiSlug" "$FIXTURE_JSON")"
MULTI_NAME="$(node -p "JSON.parse(process.argv[1]).multiName" "$FIXTURE_JSON")"
MULTI_PRIMARY_CATEGORY="$(node -p "JSON.parse(process.argv[1]).multiPrimaryCategory" "$FIXTURE_JSON")"
MULTI_ADDITIONAL_CATEGORY="$(node -p "JSON.parse(process.argv[1]).multiAdditionalCategory" "$FIXTURE_JSON")"
MULTI_SECOND_ADDITIONAL_CATEGORY="$(node -p "JSON.parse(process.argv[1]).multiSecondAdditionalCategory" "$FIXTURE_JSON")"
LAST_SLUG="$(node -p "JSON.parse(process.argv[1]).lastSlug" "$FIXTURE_JSON")"

./node_modules/.bin/tsx --test \
  scripts/test-root-layouts.ts \
  scripts/test-catalog-redirects.ts \
  scripts/test-catalog-metadata.ts \
  scripts/test-language-switcher.ts \
  scripts/test-producer-route-aliases.ts

./node_modules/.bin/tsx -e '
import robots from "./app/robots";
import sitemap, { generateSitemaps } from "./app/sitemap";

async function main() {
  process.env.VERCEL_ENV = "preview";
  process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = "true";
  const preview = await robots();
  const previewRules = Array.isArray(preview.rules) ? preview.rules : [preview.rules];
  if (
    previewRules.length !== 1 ||
    previewRules[0]?.userAgent !== "*" ||
    previewRules[0]?.disallow !== "/" ||
    "allow" in previewRules[0] ||
    preview.sitemap !== undefined ||
    preview.host !== undefined
  ) {
    throw new Error("Preview deployments must disallow all crawlers.");
  }

  process.env.VERCEL_ENV = "production";
  process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = "false";
  const privateProduction = await robots();
  const privateRules = Array.isArray(privateProduction.rules)
    ? privateProduction.rules
    : [privateProduction.rules];
  if (
    privateRules.length !== 1 ||
    privateRules[0]?.userAgent !== "*" ||
    privateRules[0]?.disallow !== "/" ||
    "allow" in privateRules[0] ||
    privateProduction.sitemap !== undefined ||
    privateProduction.host !== undefined ||
    (await sitemap({ id: Promise.resolve("0") })).length !== 0
  ) {
    throw new Error("Pre-launch Production must not expose public discovery.");
  }

  process.env.CHISAN_PUBLIC_DISCOVERY_ENABLED = "true";
  const publicProduction = await robots();
  const publicRules = Array.isArray(publicProduction.rules)
    ? publicProduction.rules
    : [publicProduction.rules];
  const publicRule = publicRules[0];
  const disallowed = Array.isArray(publicRule?.disallow)
    ? publicRule.disallow
    : [publicRule?.disallow];
  const expectedPrivatePaths = ["/acceso", "/registro", "/cuenta", "/admin", "/api/"];
  const sitemapDescriptors = await generateSitemaps();
  const expectedSitemapUrls = sitemapDescriptors.map(
    ({ id }) => `https://chisan.app/sitemap/${id}.xml`,
  );
  const advertisedSitemaps = Array.isArray(publicProduction.sitemap)
    ? publicProduction.sitemap
    : [publicProduction.sitemap];
  if (
    publicRules.length !== 1 ||
    publicRule?.userAgent !== "*" ||
    publicRule?.allow !== "/" ||
    expectedPrivatePaths.some((path) => !disallowed.includes(path)) ||
    JSON.stringify(advertisedSitemaps) !== JSON.stringify(expectedSitemapUrls) ||
    publicProduction.host !== "https://chisan.app"
  ) {
    throw new Error("Public Production robots policy is incomplete or non-canonical.");
  }

  const publicShards = await Promise.all(
    sitemapDescriptors.map(({ id }) => sitemap({ id: Promise.resolve(String(id)) })),
  );
  const publicSitemap = publicShards.flat();
  if (
    publicSitemap.length < 1_000 ||
    publicSitemap.some(({ url }) => !url.startsWith("https://chisan.app/")) ||
    publicShards.some((shard) => shard.length > 40_000)
  ) {
    throw new Error("Public Production sitemap is incomplete or non-canonical.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
'

VERCEL_ENV=production CHISAN_PUBLIC_DISCOVERY_ENABLED=false NEXT_PUBLIC_APP_URL=https://chisan.app \
  ./node_modules/.bin/next dev --port "$PORT" >/tmp/chisan-test-dev.log 2>&1 &
DEV_PID=$!

wait_for_app

HTML_HOME="$(curl -fsS "$BASE_URL/")"
HTML_HOME_CLEAN="$(printf '%s' "$HTML_HOME" | sed 's/<!-- -->//g')"

assert_html_lang "/" "en" "$HTML_HOME_CLEAN"

if [[ "$HTML_HOME_CLEAN" != *"Choose a country"* ]]; then
  echo "Error: home page should ask for an initial country selection." >&2
  exit 1
fi

if [[
  "$HTML_HOME_CLEAN" != *'id="manual-area-selection"'* ||
  "$HTML_HOME_CLEAN" != *"Select a catalog area"* ||
  "$HTML_HOME_CLEAN" != *"Open area"* ||
  "$HTML_HOME_CLEAN" != *'<noscript><div class="manual-catalog-selector__fallback">'* ||
  "$HTML_HOME_CLEAN" != *'<a href="/en-es/barcelona">Barcelona</a>'*
]]; then
  echo "Error: home page should keep JavaScript and no-JavaScript manual area-selection paths." >&2
  exit 1
fi

if [[
  "$HTML_HOME_CLEAN" != *"<title>Chisan · Connecting local food.</title>"* ||
  "$HTML_HOME_CLEAN" != *'aria-label="Chisan — Connecting local food."'* ||
  "$HTML_HOME_CLEAN" != *'class="site-header__name">Chisan</span>'* ||
  "$HTML_HOME_CLEAN" != *'class="site-header__tagline">Connecting local food.</span>'* ||
  "$HTML_HOME_CLEAN" != *'id="home-about-title">Connecting local food.</h2>'* ||
  "$HTML_HOME_CLEAN" != *'class="site-footer"'* ||
  "$HTML_HOME_CLEAN" != *'href="/our-purpose">Our purpose</a>'* ||
  "$HTML_HOME_CLEAN" != *'>Producer catalog</a>'* ||
  "$HTML_HOME_CLEAN" != *'href="https://github.com/Lyzanor/chisan/issues">Contact us on GitHub</a>'* ||
  "$HTML_HOME_CLEAN" == *'>About us</h2>'* ||
  "$HTML_HOME_CLEAN" == *'class="site-footer__copyright"'*
]]; then
  echo "Error: home page should expose the Chisan brand and links-only global footer." >&2
  exit 1
fi

HTML_PURPOSE="$(curl -fsS "$BASE_URL/our-purpose" | sed 's/<!-- -->//g')"
if [[
  "$HTML_PURPOSE" != *'<title>Our purpose | Chisan</title>'* ||
  "$HTML_PURPOSE" != *'id="purpose-title">Our purpose</h1>'* ||
  "$HTML_PURPOSE" != *'Local food systems are full of value, but too often fragmented.'* ||
  "$HTML_PURPOSE" != *'<em>chisan-chisho</em>'* ||
  "$HTML_PURPOSE" != *'Connecting local food.</strong>'*
]]; then
  echo "Error: /our-purpose should render the complete purpose statement and metadata." >&2
  exit 1
fi

if [[ "$HTML_HOME_CLEAN" == *"KM0"* ]]; then
  echo "Error: home page still exposes the former KM0 product brand." >&2
  exit 1
fi

if [[ "$HTML_HOME_CLEAN" != *'name="robots" content="noindex, nofollow"'* ]]; then
  echo "Error: pre-launch home metadata must disable indexing and following." >&2
  exit 1
fi

# Each country route names its own unit: a prefecture is not a province.
HTML_ES="$(curl -fsS "$BASE_URL/es" | sed 's/<!-- -->//g')"
assert_html_lang "/es" "es" "$HTML_ES"
if [[
  "$HTML_ES" != *"Elige una provincia"* ||
  "$HTML_ES" != *"Barcelona"* ||
  "$HTML_ES" != *"Abrir zona"*
]]; then
  echo "Error: /es should list Spanish provinces in Spanish." >&2
  exit 1
fi

if [[ "$HTML_ES" != *"Chisan"* || "$HTML_ES" == *"KM0"* ]]; then
  echo "Error: sampled public catalogue UI should use only the Chisan product brand." >&2
  exit 1
fi

HTML_JP="$(curl -fsS "$BASE_URL/jp" | sed 's/<!-- -->//g')"
assert_html_lang "/jp" "ja" "$HTML_JP"
if [[ "$HTML_JP" != *"都道府県を選択"* || "$HTML_JP" != *"京都府"* ]]; then
  echo "Error: /jp should list Japanese prefectures in Japanese." >&2
  exit 1
fi

UNKNOWN_COUNTRY_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/zz")"
if [[ "$UNKNOWN_COUNTRY_STATUS" != "404" ]]; then
  echo "Error: unknown country route should 404, got '$UNKNOWN_COUNTRY_STATUS'." >&2
  exit 1
fi

HTML_ES_NOT_FOUND="$(curl -sS "$BASE_URL/es/area-that-does-not-exist" | sed 's/<!-- -->//g')"
ES_NOT_FOUND_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/es/area-that-does-not-exist")"
assert_html_lang "/es/area-that-does-not-exist" "es" "$HTML_ES_NOT_FOUND"
if [[
  "$ES_NOT_FOUND_STATUS" != "404" ||
  "$HTML_ES_NOT_FOUND" != *"Página no encontrada"* ||
  "$HTML_ES_NOT_FOUND" != *"Volver al catálogo"*
]]; then
  echo "Error: catalog 404 responses should retain the URL locale." >&2
  exit 1
fi

UNPUBLISHED_COUNTRY_LOCALE_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/ca-es")"
HTML_UNPUBLISHED_COUNTRY_LOCALE="$(curl -sS "$BASE_URL/ca-es" | sed 's/<!-- -->//g')"
if [[
  "$UNPUBLISHED_COUNTRY_LOCALE_STATUS" != "404" ||
  "$HTML_UNPUBLISHED_COUNTRY_LOCALE" != *'href="/es"'* ||
  "$HTML_UNPUBLISHED_COUNTRY_LOCALE" == *'href="/ca-es"'*
]]; then
  echo "Error: an unpublished country locale should 404 with a published fallback link." >&2
  exit 1
fi

HTML_UNPUBLISHED_AREA_LOCALE_PRODUCER="$(curl -sS "$BASE_URL/ca-es/barcelona/not-a-producer" | sed 's/<!-- -->//g')"
UNPUBLISHED_AREA_LOCALE_PRODUCER_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/ca-es/barcelona/not-a-producer")"
if [[
  "$UNPUBLISHED_AREA_LOCALE_PRODUCER_STATUS" != "404" ||
  "$HTML_UNPUBLISHED_AREA_LOCALE_PRODUCER" != *'href="/ca-es/barcelona"'*
]]; then
  echo "Error: a localized producer 404 should link to its published Catalan area parent." >&2
  exit 1
fi

UNPUBLISHED_ENGLISH_COUNTRY_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/en-es")"
if [[ "$UNPUBLISHED_ENGLISH_COUNTRY_STATUS" != "404" ]]; then
  echo "Error: the unreviewed English Spain locale should 404, got '$UNPUBLISHED_ENGLISH_COUNTRY_STATUS'." >&2
  exit 1
fi

REDUNDANT_COUNTRY_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/es-es" \
  --data-urlencode "category=Aceite" \
  --data-urlencode "highlight=producer-1" \
  --data-urlencode "lat=41.3" \
  --data-urlencode "lon=2.1")"
if [[ "$REDUNDANT_COUNTRY_RESPONSE" != "308|$BASE_URL/es?category=Aceite&highlight=producer-1" ]]; then
  echo "Error: a redundant default catalog scope must redirect permanently, preserve safe query state and drop ownerless coordinates; got '$REDUNDANT_COUNTRY_RESPONSE'." >&2
  exit 1
fi

ROOT_QUERY_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/" \
  --data-urlencode "area=barcelona")"
if [[ "$ROOT_QUERY_RESPONSE" != "200|" ]]; then
  echo "Error: the obsolete area query must not redirect, got '$ROOT_QUERY_RESPONSE'." >&2
  exit 1
fi

HTML_FILTERED="$(curl -fsS --get "$BASE_URL/es/barcelona" \
  --data-urlencode "category=$CATEGORY")"

if [[ "$HTML_FILTERED" != *"$NAME"* ]]; then
  echo "Error: filtered search did not contain expected producer '$NAME'." >&2
  exit 1
fi

for MULTI_FILTER_CATEGORY in "$MULTI_ADDITIONAL_CATEGORY" "$MULTI_SECOND_ADDITIONAL_CATEGORY"; do
  HTML_FILTERED_ADDITIONAL="$(curl -fsS --get "$BASE_URL/es/barcelona" \
    --data-urlencode "category=$MULTI_FILTER_CATEGORY")"

  if [[ "$HTML_FILTERED_ADDITIONAL" != *"$MULTI_NAME"* ]]; then
    echo "Error: category '$MULTI_FILTER_CATEGORY' did not contain expected producer '$MULTI_NAME'." >&2
    exit 1
  fi
done

HTML_NO_MATCH="$(curl -fsS --get "$BASE_URL/es/barcelona" \
  --data-urlencode "category=__no_such_category__")"

HTML_NO_MATCH_CLEAN="$(printf '%s' "$HTML_NO_MATCH" | sed 's/<!-- -->//g')"

if [[ "$HTML_NO_MATCH_CLEAN" != *"No hay productores de esta categoría"* ]]; then
  echo "Error: expected 0 results for non-matching category." >&2
  exit 1
fi

UNPUBLISHED_AREA_LOCALE_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/ca-es/barcelona")"
HTML_CATALAN_AREA="$(curl -fsS "$BASE_URL/ca-es/barcelona" | sed 's/<!-- -->//g')"
assert_html_lang "/ca-es/barcelona" "ca" "$HTML_CATALAN_AREA"
if [[
  "$UNPUBLISHED_AREA_LOCALE_STATUS" != "200" ||
  "$HTML_CATALAN_AREA" != *"Mapa de productors"* ||
  "$HTML_CATALAN_AREA" != *">El nostre propòsit</a>"* ||
  "$HTML_CATALAN_AREA" != *">Catàleg de productors</a>"* ||
  "$HTML_CATALAN_AREA" != *">Contacta amb nosaltres a GitHub</a>"*
]]; then
  echo "Error: the published Catalan Barcelona locale should render, got '$UNPUBLISHED_AREA_LOCALE_STATUS'." >&2
  exit 1
fi

REDUNDANT_AREA_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/es-es/barcelona" \
  --data-urlencode "category=Aceite" \
  --data-urlencode "highlight=producer-1")"
if [[ "$REDUNDANT_AREA_RESPONSE" != "308|$BASE_URL/es/barcelona?category=Aceite&highlight=producer-1" ]]; then
  echo "Error: a redundant default area scope must preserve its safe query state; got '$REDUNDANT_AREA_RESPONSE'." >&2
  exit 1
fi

AREA_ALIAS_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/es-es/logrono" \
  --data-urlencode "category=Vino" \
  --data-urlencode "highlight=producer-1" \
  --data-urlencode "lat=42.4" \
  --data-urlencode "lon=-2.4")"
if [[ "$AREA_ALIAS_RESPONSE" != "308|$BASE_URL/es/la-rioja?category=Vino&highlight=producer-1" ]]; then
  echo "Error: an area alias must normalize its locale and preserve only safe query state; got '$AREA_ALIAS_RESPONSE'." >&2
  exit 1
fi

UNPUBLISHED_AREA_ALIAS_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/ca-es/logrono")"
if [[ "$UNPUBLISHED_AREA_ALIAS_STATUS" != "404" ]]; then
  echo "Error: an area alias must not invent an unpublished effective locale; got '$UNPUBLISHED_AREA_ALIAS_STATUS'." >&2
  exit 1
fi

OBSOLETE_DETAIL_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/p/$SLUG?area=barcelona")"
if [[ "$OBSOLETE_DETAIL_STATUS" != "404" ]]; then
  echo "Error: obsolete /p/ producer URLs must return 404, got '$OBSOLETE_DETAIL_STATUS'." >&2
  exit 1
fi

DETAIL_OK=0
for _ in {1..20}; do
  HTML_DETAIL="$(curl -fsS "$BASE_URL/es/barcelona/$SLUG")"
  HTML_DETAIL_CLEAN="$(printf '%s' "$HTML_DETAIL" | sed 's/<!-- -->//g')"
  if [[ "$HTML_DETAIL_CLEAN" == *"$NAME"* && "$HTML_DETAIL_CLEAN" == *"Detalles"* ]]; then
    DETAIL_OK=1
    break
  fi
  sleep 0.4
done

if [[ "$DETAIL_OK" -ne 1 ]]; then
  echo "Error: detail page /es/barcelona/$SLUG does not render expected content." >&2
  exit 1
fi

REDUNDANT_PRODUCER_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/es-es/barcelona/$SLUG" \
  --data-urlencode "category=Aceite")"
if [[ "$REDUNDANT_PRODUCER_RESPONSE" != "308|$BASE_URL/es/barcelona/$SLUG?category=Aceite" ]]; then
  echo "Error: a redundant default producer scope must resolve the same producer and preserve safe query state; got '$REDUNDANT_PRODUCER_RESPONSE'." >&2
  exit 1
fi

if [[ "$HTML_DETAIL_CLEAN" != *"ID del productor"* || "$HTML_DETAIL_CLEAN" != *"$PRODUCER_ID"* ]]; then
  echo "Error: detail page does not expose the persisted producer_id." >&2
  exit 1
fi

if [[ "$HTML_DETAIL" != *"https://chisan.app/es/barcelona/$SLUG"* ]]; then
  echo "Error: producer metadata does not expose the absolute canonical URL." >&2
  exit 1
fi

if [[ "$HTML_DETAIL_CLEAN" != *'name="robots" content="noindex, nofollow"'* ]]; then
  echo "Error: producer detail must inherit the pre-launch robots metadata." >&2
  exit 1
fi

WRONG_COUNTRY_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/fr/barcelona/$SLUG")"
if [[ "$WRONG_COUNTRY_STATUS" != "404" ]]; then
  echo "Error: a country/area mismatch should return 404, got '$WRONG_COUNTRY_STATUS'." >&2
  exit 1
fi

EXAMPLE_HTML="$(curl -fsS "$BASE_URL/es/barcelona/granja-la-pasiega-abrera" | sed 's/<!-- -->//g')"
if [[ "$EXAMPLE_HTML" != *"Granja La Pasiega"* ]]; then
  echo "Error: requested canonical example /es/barcelona/granja-la-pasiega-abrera does not resolve." >&2
  exit 1
fi

BERLIN_HTML="$(curl -fsS "$BASE_URL/de/berlin/hofladen" | sed 's/<!-- -->//g')"
if [[ "$BERLIN_HTML" != *"Hofladen"* ]]; then
  echo "Error: requested canonical example /de/berlin/hofladen does not resolve." >&2
  exit 1
fi

BERLIN_OLD_SLUG_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/de/berlin/hofladen-berlin" \
  --data-urlencode "category=Otros" \
  --data-urlencode "highlight=hofladen-berlin" \
  --data-urlencode "lat=52.5" \
  --data-urlencode "lon=13.4" \
  --data-urlencode "municipality=Berlin")"
if [[ "$BERLIN_OLD_SLUG_RESPONSE" != "308|$BASE_URL/de/berlin/hofladen?category=Otros&highlight=hofladen" ]]; then
  echo "Error: a historical producer slug must redirect permanently and preserve only safe query state; got '$BERLIN_OLD_SLUG_RESPONSE'." >&2
  exit 1
fi

BERLIN_COMPOSITE_OLD_SLUG_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' --get "$BASE_URL/en-de/berlin/hofladen-berlin" \
  --data-urlencode "category=Otros" \
  --data-urlencode "lat=52.5")"
if [[ "$BERLIN_COMPOSITE_OLD_SLUG_RESPONSE" != "308|$BASE_URL/en-de/berlin/hofladen?category=Otros" ]]; then
  echo "Error: a historical producer slug under a composite scope must preserve its resolved locale; got '$BERLIN_COMPOSITE_OLD_SLUG_RESPONSE'." >&2
  exit 1
fi

UNICODE_OLD_SLUG_RESPONSE="$(curl -sS -o /dev/null --write-out '%{http_code}|%{redirect_url}' "$BASE_URL/es/barcelona/%C3%B8lgod-brewpub-barcelona")"
if [[ "$UNICODE_OLD_SLUG_RESPONSE" != "308|$BASE_URL/es/barcelona/olgod-brewpub" ]]; then
  echo "Error: a percent-encoded historical Unicode slug must retain its identity and redirect; got '$UNICODE_OLD_SLUG_RESPONSE'." >&2
  exit 1
fi

HTML_MULTI_DETAIL="$(curl -fsS "$BASE_URL/es/barcelona/$MULTI_SLUG" | sed 's/<!-- -->//g')"
if [[
  "$HTML_MULTI_DETAIL" != *"$MULTI_NAME"* ||
  "$HTML_MULTI_DETAIL" != *"$MULTI_PRIMARY_CATEGORY"* ||
  "$HTML_MULTI_DETAIL" != *"$MULTI_ADDITIONAL_CATEGORY"* ||
  "$HTML_MULTI_DETAIL" != *"$MULTI_SECOND_ADDITIONAL_CATEGORY"*
]]; then
  echo "Error: multi-category detail does not render the producer and both category types." >&2
  exit 1
fi

SITEMAP="$(curl -fsS "$BASE_URL/sitemap/0.xml")"
if [[ "$SITEMAP" == *"<loc>"* || "$SITEMAP" == *"https://chisan.app/"* ]]; then
  echo "Error: the pre-launch sitemap must not expose catalog URLs." >&2
  exit 1
fi

ROBOTS_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/robots.txt")"
if [[ "$ROBOTS_STATUS" != "200" ]]; then
  echo "Error: robots.txt should return 200, got '$ROBOTS_STATUS'." >&2
  exit 1
fi

ROBOTS="$(curl -fsS "$BASE_URL/robots.txt")"
for ROBOTS_DIRECTIVE in \
  "User-Agent: *" \
  "Disallow: /"; do
  if [[ "$ROBOTS" != *"$ROBOTS_DIRECTIVE"* ]]; then
    echo "Error: robots.txt is missing '$ROBOTS_DIRECTIVE'." >&2
    exit 1
  fi
done

for FORBIDDEN_ROBOTS_DIRECTIVE in "Allow:" "Host:" "Sitemap:"; do
  if [[ "$ROBOTS" == *"$FORBIDDEN_ROBOTS_DIRECTIVE"* ]]; then
    echo "Error: pre-launch robots.txt must omit '$FORBIDDEN_ROBOTS_DIRECTIVE'." >&2
    exit 1
  fi
done

echo "Behavior tests OK."
