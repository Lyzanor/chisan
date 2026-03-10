#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${1:-Km0-productores.csv}"

if [[ ! -f "$CSV_PATH" ]]; then
  echo "Error: CSV not found at $CSV_PATH" >&2
  exit 1
fi

node - "$CSV_PATH" <<'NODE'
const fs = require("node:fs");

const csvPath = process.argv[2];
const required = [
  "nombre",
  "municipio",
  "categoria",
  "subcategoria",
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
  "Revisado",
];

const raw = fs.readFileSync(csvPath, "utf8");
const firstLine = raw.split(/\r?\n/, 1)[0].replace(/^\uFEFF/, "");
const headers = firstLine.split(",").map((value) => value.trim());
const missing = required.filter((column) => !headers.includes(column));

if (missing.length > 0) {
  console.error(`Error: missing required CSV columns: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`CSV contract OK (${required.length} required columns present).`);
NODE
