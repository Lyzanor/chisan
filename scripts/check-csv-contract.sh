#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${1:-Km0-productores.csv}"

node scripts/audit-csv.js --mode=contract "$CSV_PATH"
