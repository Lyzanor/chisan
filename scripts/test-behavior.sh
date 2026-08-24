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

const first = rows[0];
const multiCategory = rows.find((row) => (row["categorias adicionales"] || "").trim());
const last = rows.at(-1);
const additionalCategories = (multiCategory?.["categorias adicionales"] || "")
  .split("|")
  .map((category) => category.trim())
  .filter(Boolean);
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

./node_modules/.bin/tsx -e '
import robots from "./app/robots";

process.env.VERCEL_ENV = "preview";
const preview = robots();
const previewRules = Array.isArray(preview.rules) ? preview.rules : [preview.rules];
if (
  previewRules.length !== 1 ||
  previewRules[0]?.userAgent !== "*" ||
  previewRules[0]?.disallow !== "/" ||
  "allow" in previewRules[0]
) {
  throw new Error("Preview deployments must disallow all crawlers.");
}

process.env.VERCEL_ENV = "production";
const production = robots();
const productionRules = Array.isArray(production.rules)
  ? production.rules
  : [production.rules];
const productionRule = productionRules[0];
const disallowed = Array.isArray(productionRule?.disallow)
  ? productionRule.disallow
  : [productionRule?.disallow];
const expectedPrivatePaths = ["/acceso", "/registro", "/cuenta", "/admin", "/api/"];
if (
  productionRules.length !== 1 ||
  productionRule?.userAgent !== "*" ||
  productionRule?.allow !== "/" ||
  expectedPrivatePaths.some((path) => !disallowed.includes(path)) ||
  production.sitemap !== "https://chisan.app/sitemap.xml" ||
  production.host !== "https://chisan.app"
) {
  throw new Error("Production robots policy is incomplete or non-canonical.");
}
'

VERCEL_ENV=production NEXT_PUBLIC_APP_URL=https://chisan.app \
  ./node_modules/.bin/next dev --port "$PORT" >/tmp/chisan-test-dev.log 2>&1 &
DEV_PID=$!

wait_for_app

HTML_HOME="$(curl -fsS "$BASE_URL/")"
HTML_HOME_CLEAN="$(printf '%s' "$HTML_HOME" | sed 's/<!-- -->//g')"

if [[ "$HTML_HOME_CLEAN" != *"Choose a country"* ]]; then
  echo "Error: home page should ask for an initial country selection." >&2
  exit 1
fi

if [[
  "$HTML_HOME_CLEAN" != *"<title>Chisan · Local food, unified</title>"* ||
  "$HTML_HOME_CLEAN" != *'aria-label="Chisan — Local food, unified"'* ||
  "$HTML_HOME_CLEAN" != *'class="site-header__name">Chisan</span>'* ||
  "$HTML_HOME_CLEAN" != *'class="site-header__tagline">Local food, unified</span>'* ||
  "$HTML_HOME_CLEAN" != *'id="home-about-title">Local food, unified</h2>'* ||
  "$HTML_HOME_CLEAN" != *'class="site-footer"'* ||
  "$HTML_HOME_CLEAN" != *'>About us</h2>'* ||
  "$HTML_HOME_CLEAN" != *'href="/#about">Our purpose</a>'* ||
  "$HTML_HOME_CLEAN" != *'href="https://github.com/Lyzanor/chisan/issues">Contact us on GitHub</a>'*
]]; then
  echo "Error: home page should expose the Chisan tagline, brand, About Chisan and global footer." >&2
  exit 1
fi

if [[ "$HTML_HOME_CLEAN" == *"KM0"* ]]; then
  echo "Error: home page still exposes the former KM0 product brand." >&2
  exit 1
fi

# Each country route names its own unit: a prefecture is not a province.
HTML_ES="$(curl -fsS "$BASE_URL/es" | sed 's/<!-- -->//g')"
if [[ "$HTML_ES" != *"Choose a province"* || "$HTML_ES" != *"Barcelona"* ]]; then
  echo "Error: /es should list Spanish provinces." >&2
  exit 1
fi

if [[ "$HTML_ES" != *"Chisan"* || "$HTML_ES" == *"KM0"* ]]; then
  echo "Error: sampled public catalogue UI should use only the Chisan product brand." >&2
  exit 1
fi

HTML_JP="$(curl -fsS "$BASE_URL/jp" | sed 's/<!-- -->//g')"
if [[ "$HTML_JP" != *"Choose a prefecture"* || "$HTML_JP" != *"Kyoto"* ]]; then
  echo "Error: /jp should list Japanese prefectures." >&2
  exit 1
fi

UNKNOWN_COUNTRY_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/zz")"
if [[ "$UNKNOWN_COUNTRY_STATUS" != "404" ]]; then
  echo "Error: unknown country route should 404, got '$UNKNOWN_COUNTRY_STATUS'." >&2
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

if [[ "$HTML_NO_MATCH_CLEAN" != *"No producers in this category"* ]]; then
  echo "Error: expected 0 results for non-matching category." >&2
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
  if [[ "$HTML_DETAIL_CLEAN" == *"$NAME"* && "$HTML_DETAIL_CLEAN" == *"Details"* ]]; then
    DETAIL_OK=1
    break
  fi
  sleep 0.4
done

if [[ "$DETAIL_OK" -ne 1 ]]; then
  echo "Error: detail page /es/barcelona/$SLUG does not render expected content." >&2
  exit 1
fi

if [[ "$HTML_DETAIL_CLEAN" != *"Producer ID"* || "$HTML_DETAIL_CLEAN" != *"$PRODUCER_ID"* ]]; then
  echo "Error: detail page does not expose the persisted producer_id." >&2
  exit 1
fi

if [[ "$HTML_DETAIL" != *"https://chisan.app/es/barcelona/$SLUG"* ]]; then
  echo "Error: producer metadata does not expose the absolute canonical URL." >&2
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

BERLIN_OLD_SLUG_STATUS="$(curl -sS -o /dev/null --write-out '%{http_code}' "$BASE_URL/de/berlin/hofladen-berlin")"
if [[ "$BERLIN_OLD_SLUG_STATUS" != "404" ]]; then
  echo "Error: removed producer slugs must return 404, got '$BERLIN_OLD_SLUG_STATUS'." >&2
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

SITEMAP="$(curl -fsS "$BASE_URL/sitemap.xml")"
if [[
  "$SITEMAP" != *"https://chisan.app/es/barcelona/$SLUG"* ||
  "$SITEMAP" != *"https://chisan.app/es/barcelona/$LAST_SLUG"*
]]; then
  echo "Error: sitemap does not contain canonical producer URLs beyond the visible list." >&2
  exit 1
fi

NON_CANONICAL_SITEMAP_URL="$(
  printf '%s' "$SITEMAP" |
    grep -o '<loc>[^<]*</loc>' |
    sed -e 's#^<loc>##' -e 's#</loc>$##' |
    grep -v '^https://chisan\.app/' |
    head -n 1 || true
)"
if [[ -n "$NON_CANONICAL_SITEMAP_URL" || "$SITEMAP" == *"km0-nu.vercel.app"* ]]; then
  echo "Error: sitemap contains a non-canonical or legacy host." >&2
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
  "Allow: /" \
  "Disallow: /acceso" \
  "Disallow: /registro" \
  "Disallow: /cuenta" \
  "Disallow: /admin" \
  "Disallow: /api/" \
  "Host: https://chisan.app" \
  "Sitemap: https://chisan.app/sitemap.xml"; do
  if [[ "$ROBOTS" != *"$ROBOTS_DIRECTIVE"* ]]; then
    echo "Error: robots.txt is missing '$ROBOTS_DIRECTIVE'." >&2
    exit 1
  fi
done

echo "Behavior tests OK."
