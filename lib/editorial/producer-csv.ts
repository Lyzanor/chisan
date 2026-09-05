import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import {
  PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD,
  hashProducerFields,
  isProducerPatch,
  validateProducerProposal,
} from "../accounts/producer-fields";
type ParsedCsvRecord = {
  record: string[];
  raw: string;
};

type LocatedCsvProducer = {
  columns: string[];
  fields: Record<string, string>;
  record: string[];
  raw: string;
  rawStart: number;
  rawEnd: number;
};

export type ProducerCsvPatchResult = {
  csv: string;
  beforeFields: Record<string, string>;
  afterFields: Record<string, string>;
};

export type ExpectedProducerChange = {
  patch: Readonly<Record<string, string>>;
  fields: Record<string, string>;
  hash: string;
};

export class ProducerCsvRowNotFoundError extends Error {}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (fieldValue) => typeof fieldValue === "string",
    )
  );
}

function isBlankCsvRecord(record: readonly string[]): boolean {
  return record.every((value) => value === "");
}

function locateProducerInCsv(
  csv: string,
  producerId: number,
): LocatedCsvProducer {
  if (!Number.isSafeInteger(producerId) || producerId <= 0) {
    throw new Error("producer_id must be a positive safe integer.");
  }

  const parsed = parse(csv, {
    bom: true,
    info: true,
    raw: true,
    relax_column_count: true,
    skip_empty_lines: false,
  }) as unknown as ParsedCsvRecord[];
  const header = parsed.find(({ record }) => !isBlankCsvRecord(record));
  if (!header) throw new Error("The producer CSV is empty.");

  const columns = header.record;
  if (columns.some((column) => !column)) {
    throw new Error("The producer CSV contains an empty header column.");
  }
  if (new Set(columns).size !== columns.length) {
    throw new Error("The producer CSV contains duplicate header columns.");
  }

  const producerIdIndex = columns.indexOf("producer_id");
  if (producerIdIndex < 0) {
    throw new Error("The producer CSV is missing the producer_id column.");
  }

  let cursor = 0;
  let match: LocatedCsvProducer | null = null;
  for (const entry of parsed) {
    const rawStart = csv.indexOf(entry.raw, cursor);
    if (rawStart < 0) {
      throw new Error(
        "Could not map a parsed CSV row back to the source bytes.",
      );
    }
    const rawEnd = rawStart + entry.raw.length;
    cursor = rawEnd;

    if (entry === header || isBlankCsvRecord(entry.record)) continue;
    if (entry.record.length !== columns.length) {
      throw new Error(
        `The producer CSV contains a row with ${entry.record.length} fields; expected ${columns.length}.`,
      );
    }
    if (entry.record[producerIdIndex]?.trim() !== String(producerId)) continue;
    if (match) {
      throw new Error(
        `producer_id '${producerId}' appears more than once in the CSV.`,
      );
    }

    match = {
      columns,
      fields: Object.fromEntries(
        columns.map((column, index) => [column, entry.record[index] ?? ""]),
      ),
      record: entry.record,
      raw: entry.raw,
      rawStart,
      rawEnd,
    };
  }

  if (!match) {
    throw new ProducerCsvRowNotFoundError(
      `producer_id '${producerId}' does not exist in the target CSV.`,
    );
  }
  return match;
}

function recordDelimiter(raw: string): string {
  if (raw.endsWith("\r\n")) return "\r\n";
  if (raw.endsWith("\n")) return "\n";
  if (raw.endsWith("\r")) return "\r";
  return "";
}

export function readProducerFieldsFromCsv(
  csv: string,
  producerId: number,
): Record<string, string> {
  return locateProducerInCsv(csv, producerId).fields;
}

/** Re-serializes only the requested producer row and preserves every other byte. */
export function applyProducerPatchToCsv(
  csv: string,
  producerId: number,
  patch: Readonly<Record<string, string>>,
): ProducerCsvPatchResult {
  const located = locateProducerInCsv(csv, producerId);
  const nextRecord = [...located.record];

  for (const [field, value] of Object.entries(patch)) {
    const columnIndex = located.columns.indexOf(field);
    if (columnIndex < 0) {
      throw new Error(`CSV column '${field}' is missing.`);
    }
    if (field === "producer_id") {
      throw new Error("producer_id is immutable and cannot be materialized.");
    }
    nextRecord[columnIndex] = value;
  }

  const delimiter = recordDelimiter(located.raw);
  let nextRaw = stringify([nextRecord], {
    header: false,
    record_delimiter: delimiter || "\n",
  });
  if (!delimiter) nextRaw = nextRaw.slice(0, -1);

  const nextCsv = `${csv.slice(0, located.rawStart)}${nextRaw}${csv.slice(located.rawEnd)}`;
  const afterFields = Object.fromEntries(
    located.columns.map((column, index) => [column, nextRecord[index] ?? ""]),
  );

  return {
    csv: nextCsv,
    beforeFields: located.fields,
    afterFields,
  };
}

function approvedProducerChangeDate(reviewedAt: unknown): string {
  if (!(reviewedAt instanceof Date) && typeof reviewedAt !== "string") {
    throw new Error("The approved producer change has no review timestamp.");
  }
  const parsed = reviewedAt instanceof Date ? reviewedAt : new Date(reviewedAt);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      "The approved producer change has a malformed review timestamp.",
    );
  }
  return parsed.toISOString().slice(0, 10);
}

/** Derives the sole expected state from the immutable submission snapshot and approval. */
export function resolveExpectedProducerChange(
  baseSnapshot: unknown,
  baseRowHash: string,
  patch: unknown,
  reviewedAt: unknown,
  hasContentChange = false,
): ExpectedProducerChange {
  if (!isStringRecord(baseSnapshot)) {
    throw new Error("The stored base snapshot is not a string-valued object.");
  }
  if (!/^[0-9a-f]{64}$/.test(baseRowHash)) {
    throw new Error("The stored base-row hash is malformed.");
  }
  if (hashProducerFields(baseSnapshot) !== baseRowHash) {
    throw new Error("The stored base snapshot does not match its row hash.");
  }
  if (!isProducerPatch(patch) || (!hasContentChange && Object.keys(patch).length === 0)) {
    throw new Error(
      "The stored patch is empty or contains a non-editable field.",
    );
  }
  if (!(PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD in baseSnapshot)) {
    throw new Error(
      `The stored base snapshot predates the '${PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD}' catalog column.`,
    );
  }

  const validation = validateProducerProposal(
    { ...baseSnapshot, ...patch },
    baseSnapshot,
  );
  if (!validation.ok) {
    throw new Error(
      Object.values(validation.errors)[0] ?? "Stored patch is invalid.",
    );
  }
  if (!hasContentChange && Object.keys(validation.patch).length === 0) {
    throw new Error("The stored patch does not change the base snapshot.");
  }

  const materializationPatch = {
    ...validation.patch,
    [PRODUCER_LAST_APPROVED_CHANGE_DATE_FIELD]:
      approvedProducerChangeDate(reviewedAt),
  };
  const fields = { ...baseSnapshot, ...materializationPatch };
  return {
    patch: materializationPatch,
    fields,
    hash: hashProducerFields(fields),
  };
}
