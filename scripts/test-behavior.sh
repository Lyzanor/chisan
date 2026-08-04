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
const payload = {
  slug: (first.slug || "").trim(),
  name: (first.nombre || "").trim(),
  category: (first.categoria || "").trim(),
};
if (!payload.slug || !payload.name || !payload.category) {
  console.error("First CSV row is missing required fields for test fixture.");
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

./node_modules/.bin/next dev --port "$PORT" >/tmp/km0-test-dev.log 2>&1 &
DEV_PID=$!

wait_for_app

HTML_HOME="$(curl -fsS "$BASE_URL/")"
HTML_HOME_CLEAN="$(printf '%s' "$HTML_HOME" | sed 's/<!-- -->//g')"

if [[ "$HTML_HOME_CLEAN" != *"Choose a country"* ]]; then
  echo "Error: home page should ask for an initial country selection." >&2
  exit 1
fi

# Each country route names its own unit: a prefecture is not a province.
HTML_ES="$(curl -fsS "$BASE_URL/es" | sed 's/<!-- -->//g')"
if [[ "$HTML_ES" != *"Choose a province"* || "$HTML_ES" != *"Barcelona"* ]]; then
  echo "Error: /es should list Spanish provinces." >&2
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

HTML_FILTERED="$(curl -fsS --get "$BASE_URL/" \
  --data-urlencode "area=barcelona" \
  --data-urlencode "category=$CATEGORY")"

if [[ "$HTML_FILTERED" != *"$NAME"* ]]; then
  echo "Error: filtered search did not contain expected producer '$NAME'." >&2
  exit 1
fi

HTML_NO_MATCH="$(curl -fsS --get "$BASE_URL/" \
  --data-urlencode "area=barcelona" \
  --data-urlencode "category=__no_such_category__")"

HTML_NO_MATCH_CLEAN="$(printf '%s' "$HTML_NO_MATCH" | sed 's/<!-- -->//g')"

if [[ "$HTML_NO_MATCH_CLEAN" != *"No producers in this category"* ]]; then
  echo "Error: expected 0 results for non-matching category." >&2
  exit 1
fi

REDIRECT_URL="$(curl -fsS -o /dev/null --write-out '%{redirect_url}' "$BASE_URL/p/1?area=barcelona")"
if [[ "$REDIRECT_URL" != "$BASE_URL/p/$SLUG?area=barcelona" ]]; then
  echo "Error: expected /p/1?area=barcelona to redirect to /p/$SLUG?area=barcelona, got '$REDIRECT_URL'." >&2
  exit 1
fi

LEGACY_REDIRECT_URL="$(curl -fsS -o /dev/null --write-out '%{redirect_url}' "$BASE_URL/p/1-$SLUG?area=barcelona")"
if [[ "$LEGACY_REDIRECT_URL" != "$BASE_URL/p/$SLUG?area=barcelona" ]]; then
  echo "Error: expected /p/1-$SLUG?area=barcelona to redirect to /p/$SLUG?area=barcelona, got '$LEGACY_REDIRECT_URL'." >&2
  exit 1
fi

MISSING_AREA_REDIRECT_URL="$(curl -fsS -o /dev/null --write-out '%{redirect_url}' "$BASE_URL/p/$SLUG")"
if [[ "$MISSING_AREA_REDIRECT_URL" != "$BASE_URL/" ]]; then
  echo "Error: expected /p/$SLUG without area to redirect to /, got '$MISSING_AREA_REDIRECT_URL'." >&2
  exit 1
fi

DETAIL_OK=0
for _ in {1..20}; do
  HTML_DETAIL="$(curl -fsS "$BASE_URL/p/$SLUG?area=barcelona")"
  HTML_DETAIL_CLEAN="$(printf '%s' "$HTML_DETAIL" | sed 's/<!-- -->//g')"
  if [[ "$HTML_DETAIL_CLEAN" == *"$NAME"* && "$HTML_DETAIL_CLEAN" == *"Details"* ]]; then
    DETAIL_OK=1
    break
  fi
  sleep 0.4
done

if [[ "$DETAIL_OK" -ne 1 ]]; then
  echo "Error: detail page /p/$SLUG?area=barcelona does not render expected content." >&2
  exit 1
fi

echo "Behavior tests OK."
