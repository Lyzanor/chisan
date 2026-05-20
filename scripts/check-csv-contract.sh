#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  node scripts/audit-csv.js --mode=contract "$1"
  exit $?
fi

checked=0
failed=0

while IFS= read -r csv_path; do
  checked=$((checked + 1))

  if ! output="$(node scripts/audit-csv.js --mode=contract "$csv_path" 2>&1)"; then
    failed=$((failed + 1))
    echo ""
    echo "CSV contract failed: $csv_path"
    echo "$output"
  fi
done < <(find data/csv -type f -name '*.csv' | sort)

echo "CSV contract audit summary"
echo "- files: $checked"
echo "- failed: $failed"

if [[ "$failed" -eq 0 ]]; then
  echo "- status: OK"
else
  exit 1
fi
