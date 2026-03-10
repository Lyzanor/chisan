#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx is required but not found on PATH." >&2
  exit 1
fi

export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="${PWCLI:-$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh}"

if [[ ! -x "$PWCLI" ]]; then
  echo "Error: Playwright wrapper not found at $PWCLI" >&2
  exit 1
fi

BASE_URL="${1:-http://localhost:3000}"
QUERY="${2:-chocolate}"
SESSION="${PLAYWRIGHT_CLI_SESSION:-km0-workflow}"
ARTIFACT_DIR="output/playwright"
mkdir -p "$ARTIFACT_DIR"

run_pwcli() {
  PLAYWRIGHT_CLI_SESSION="$SESSION" "$PWCLI" "$@"
}

extract_snapshot_path() {
  sed -n 's#^- \[Snapshot\](\(.*\))$#\1#p' | tail -n 1
}

extract_ref_by_pattern() {
  local snapshot_path="$1"
  local pattern="$2"

  awk -v pat="$pattern" '
    $0 ~ pat {
      if (match($0, /\[ref=e[0-9]+\]/)) {
        print substr($0, RSTART + 5, RLENGTH - 6)
        exit
      }
    }
  ' "$snapshot_path"
}

extract_first_url() {
  sed -nE 's/.*"(https?:\/\/[^"]+)".*/\1/p' | head -n 1
}

extract_first_result_ref() {
  local snapshot_path="$1"

  awk '
    /- link / {
      current=$0
      next
    }
    /\/url: \/p\// && current != "" {
      if (match(current, /\[ref=e[0-9]+\]/)) {
        print substr(current, RSTART + 5, RLENGTH - 6)
        exit
      }
    }
  ' "$snapshot_path"
}

open_output=$(run_pwcli open "$BASE_URL")
printf '%s\n' "$open_output" > "$ARTIFACT_DIR/open.log"

home_snapshot_output=$(run_pwcli snapshot)
printf '%s\n' "$home_snapshot_output" > "$ARTIFACT_DIR/snapshot-home.log"
home_snapshot_path=$(printf '%s\n' "$home_snapshot_output" | extract_snapshot_path)

if [[ -z "$home_snapshot_path" || ! -f "$home_snapshot_path" ]]; then
  echo "Error: Could not resolve home snapshot path." >&2
  exit 1
fi

search_ref=$(extract_ref_by_pattern "$home_snapshot_path" 'searchbox "Buscar en CSV"')
search_btn_ref=$(extract_ref_by_pattern "$home_snapshot_path" 'button "Buscar"')

if [[ -z "$search_ref" || -z "$search_btn_ref" ]]; then
  echo "Error: Could not resolve search input/button refs from snapshot $home_snapshot_path" >&2
  exit 1
fi

run_pwcli fill "$search_ref" "$QUERY" > "$ARTIFACT_DIR/fill.log"
run_pwcli click "$search_btn_ref" > "$ARTIFACT_DIR/search-click.log"

results_snapshot_output=$(run_pwcli snapshot)
printf '%s\n' "$results_snapshot_output" > "$ARTIFACT_DIR/snapshot-results.log"
results_snapshot_path=$(printf '%s\n' "$results_snapshot_output" | extract_snapshot_path)

if [[ -z "$results_snapshot_path" || ! -f "$results_snapshot_path" ]]; then
  echo "Error: Could not resolve results snapshot path." >&2
  exit 1
fi

first_result_ref=$(extract_first_result_ref "$results_snapshot_path")
if [[ -z "$first_result_ref" ]]; then
  echo "Error: No result link found for query '$QUERY'." >&2
  exit 1
fi

run_pwcli click "$first_result_ref" > "$ARTIFACT_DIR/result-click.log"

profile_snapshot_output=$(run_pwcli snapshot)
printf '%s\n' "$profile_snapshot_output" > "$ARTIFACT_DIR/snapshot-profile.log"

profile_url_output=$(run_pwcli eval 'location.href')
printf '%s\n' "$profile_url_output" > "$ARTIFACT_DIR/profile-url.log"
profile_url=$(printf '%s\n' "$profile_url_output" | extract_first_url)

if [[ -z "$profile_url" || "$profile_url" != *"/p/"* ]]; then
  echo "Error: Expected to navigate to /p/[id], got: $profile_url_output" >&2
  exit 1
fi

run_pwcli screenshot > "$ARTIFACT_DIR/screenshot.log"

printf 'Completed workflow successfully.\n'
printf 'Base URL: %s\n' "$BASE_URL"
printf 'Search query: %s\n' "$QUERY"
printf 'Result URL: %s\n' "$profile_url"
printf 'Artifacts: %s\n' "$ARTIFACT_DIR"
