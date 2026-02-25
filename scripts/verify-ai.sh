#!/usr/bin/env bash
set -euo pipefail

npx --yes pnpm verify
bash scripts/check-csv-contract.sh
bash scripts/test-behavior.sh
