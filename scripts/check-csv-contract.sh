#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${1:-data/csv/catalunya/barcelona.csv}"

node scripts/audit-csv.js --mode=contract "$CSV_PATH"
