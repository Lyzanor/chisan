#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${1:-Km0-productores.csv}"

if [[ ! -f "$CSV_PATH" ]]; then
  echo "Error: CSV not found at $CSV_PATH" >&2
  exit 1
fi

node - "$CSV_PATH" <<'NODE'
const fs = require("node:fs");
const { parse } = require("csv-parse/sync");

const csvPath = process.argv[2];
const required = [
  "slug",
  "nombre",
  "municipio",
  "categoria",
  "productos estrella",
  "direccion",
  "descripcion",
  "horario",
  "telefono",
  "correo",
  "web",
  "Facebook",
  "Instagram",
  "Google Maps",
  "lat",
  "lon",
  "fecha_revision",
];

const raw = fs.readFileSync(csvPath, "utf8");
const firstLine = raw.split(/\r?\n/, 1)[0].replace(/^\uFEFF/, "");
const headers = firstLine.split(",").map((value) => value.trim());
const missing = required.filter((column) => !headers.includes(column));

if (missing.length > 0) {
  console.error(`Error: missing required CSV columns: ${missing.join(", ")}`);
  process.exit(1);
}

const rows = parse(raw, {
  columns: true,
  bom: true,
  skip_empty_lines: true,
});

function readUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed !== value) {
    return { error: "contains leading or trailing spaces" };
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { error: "must use http or https" };
    }

    return { url };
  } catch {
    return { error: "is not a valid URL" };
  }
}

function matchesHost(hostname, matcher) {
  const host = hostname.toLowerCase();
  return host === matcher || host.endsWith(`.${matcher}`);
}

function isGoogleMapsUrl(url) {
  const host = url.hostname.toLowerCase();

  if (host === "maps.app.goo.gl") {
    return true;
  }

  if (host === "maps.google.com") {
    return true;
  }

  return host.includes("google.") && url.pathname.startsWith("/maps");
}

const validators = {
  web: () => null,
  Facebook: (url) =>
    matchesHost(url.hostname, "facebook.com") ? null : "must point to facebook.com",
  Instagram: (url) =>
    matchesHost(url.hostname, "instagram.com") ? null : "must point to instagram.com",
  "Google Maps": (url) =>
    isGoogleMapsUrl(url) ? null : "must point to a Google Maps URL",
};

const errors = [];

for (const [index, row] of rows.entries()) {
  const line = index + 2;

  for (const [column, validateHost] of Object.entries(validators)) {
    const rawValue = row[column];
    const parsed = readUrl(rawValue);

    if (parsed === null) {
      continue;
    }

    if (parsed.error) {
      errors.push(`line ${line} · ${column}: ${parsed.error}`);
      continue;
    }

    const hostError = validateHost(parsed.url);
    if (hostError) {
      errors.push(`line ${line} · ${column}: ${hostError}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Error: invalid link fields found (${errors.length}).`);
  for (const error of errors.slice(0, 20)) {
    console.error(`- ${error}`);
  }
  if (errors.length > 20) {
    console.error(`- ...and ${errors.length - 20} more`);
  }
  process.exit(1);
}

console.log(`CSV contract OK (${required.length} required columns present; link fields valid).`);
NODE
