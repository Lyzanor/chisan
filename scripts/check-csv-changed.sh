#!/usr/bin/env bash
set -euo pipefail

# Run the blocking contract audit only on CSVs changed in the working tree
# (staged, unstaged, or untracked) under data/csv. Use this while working;
# run the full `pnpm verify:ai` before finishing.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

checked=0
failed=0
found=0

while IFS= read -r csv_path; do
  [[ -n "$csv_path" && -f "$csv_path" ]] || continue
  found=$((found + 1))
  checked=$((checked + 1))

  if ! output="$(node scripts/audit-csv.js --mode=contract "$csv_path" 2>&1)"; then
    failed=$((failed + 1))
    echo ""
    echo "CSV contract failed: $csv_path"
    echo "$output"
  fi
done < <(
  {
    git diff --name-only -- 'data/csv/*.csv'
    git diff --name-only --cached -- 'data/csv/*.csv'
    git ls-files --others --exclude-standard -- 'data/csv/*.csv'
  } | sort -u
)

if [[ "$found" -eq 0 ]]; then
  echo "No changed CSV files under data/csv."
  exit 0
fi

echo "Changed CSV contract audit summary"
echo "- files: $checked"
echo "- failed: $failed"

if [[ "$failed" -eq 0 ]]; then
  echo "- status: OK"
else
  exit 1
fi
