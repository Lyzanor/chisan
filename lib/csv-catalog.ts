import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { parse } from "csv-parse/sync";

type RawCsvRow = Record<string, string | undefined>;

export type ProducerCsvRow = {
  id: number;
  name: string;
  city: string;
  category: string;
  subcategory: string;
  fields: Record<string, string>;
  searchIndex: string;
};

const CSV_PATH = path.resolve(process.cwd(), "Km0-productores.csv");

function cleanCell(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchIndex(fields: Record<string, string>): string {
  return normalizeSearch(Object.values(fields).join(" "));
}

const loadCsvRows = cache(async (): Promise<ProducerCsvRow[]> => {
  const csvRaw = await readFile(CSV_PATH, "utf8");
  const parsedRows = parse(csvRaw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawCsvRow[];

  return parsedRows.map((row, index) => {
    const fields = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [cleanCell(key), cleanCell(value)]),
    );

    return {
      id: index + 1,
      name: fields.nombre || `Fila ${index + 1}`,
      city: fields.municipio || "Sin municipio",
      category: fields.categoria || "Sin categoría",
      subcategory: fields.subcategoria || "",
      searchIndex: buildSearchIndex(fields),
      fields,
    };
  });
});

export async function findProducerById(rawId: string): Promise<ProducerCsvRow | null> {
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  const rows = await loadCsvRows();
  return rows[id - 1] ?? null;
}

export async function searchProducers(rawQuery: string): Promise<ProducerCsvRow[]> {
  const rows = await loadCsvRows();
  const normalizedQuery = normalizeSearch(rawQuery);

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) => row.searchIndex.includes(normalizedQuery));
}
