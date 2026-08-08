#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  node scripts/audit-csv.js --mode=contract "$1"
  exit $?
fi

node scripts/check-area-registry.mjs

checked=0
failed=0
centroid_fallbacks=0

while IFS= read -r csv_path; do
  checked=$((checked + 1))

  if ! output="$(node scripts/audit-csv.js --mode=contract "$csv_path" 2>&1)"; then
    failed=$((failed + 1))
    echo ""
    echo "CSV contract failed: $csv_path"
    echo "$output"
  fi

  file_centroid_fallbacks="$(
    printf '%s\n' "$output" | awk -F': ' '/^- centroid fallback coordinates:/ { print $2; exit }'
  )"
  file_centroid_fallbacks="${file_centroid_fallbacks:-0}"
  centroid_fallbacks=$((centroid_fallbacks + file_centroid_fallbacks))
done < <(find data/csv -type f -name '*.csv' | sort)

echo "CSV contract audit summary"
echo "- files: $checked"
echo "- failed: $failed"
echo "- centroid fallback coordinates: $centroid_fallbacks"

if [[ "$failed" -eq 0 ]]; then
  echo "- status: OK"
else
  exit 1
fi
