#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  node scripts/audit-csv.js --mode=quality "$1"
  exit $?
fi

checked=0
failed=0
warnings=0

while IFS= read -r csv_path; do
  checked=$((checked + 1))

  if ! output="$(node scripts/audit-csv.js --mode=quality --summary-only "$csv_path" 2>&1)"; then
    failed=$((failed + 1))
    echo ""
    echo "CSV data-quality failed: $csv_path"
    echo "$output"
    continue
  fi

  file_warnings="$(
    printf '%s\n' "$output" | awk -F': ' '/^- warnings:/ { print $2; exit }'
  )"
  file_warnings="${file_warnings:-0}"
  warnings=$((warnings + file_warnings))

  if [[ "$file_warnings" -gt 0 ]]; then
    echo "- $csv_path: $file_warnings warnings"
  fi
done < <(find data/csv -type f -name '*.csv' | sort)

echo "CSV data-quality audit summary"
echo "- files: $checked"
echo "- failed: $failed"
echo "- warnings: $warnings"

if [[ "$failed" -eq 0 ]]; then
  echo "- status: OK"
else
  exit 1
fi
