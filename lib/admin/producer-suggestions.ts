import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import {
  PRODUCER_EDITABLE_FIELDS,
  hashProducerFields,
} from "@/lib/accounts/producer-fields";
import {
  getProducerSuggestionSection,
  isProducerSuggestionSection,
} from "@/lib/accounts/producer-suggestion-sections";
import {
  PRODUCER_SUGGESTION_STATUSES,
  resolveProducerSuggestionStatusSelection,
  type ProducerSuggestionStatus,
  type ProducerSuggestionStatusSelection,
} from "@/lib/accounts/producer-suggestion-workflow";
import { buildProducerHref } from "@/lib/catalog-navigation";
import {
  findProducersByIds,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import type { Database } from "@/lib/db";
import {
  producerSuggestions,
  users,
  type ProducerSuggestion,
} from "@/lib/db/schema";

export const ADMIN_PRODUCER_SUGGESTION_PAGE_SIZE = 25;
export const ADMIN_PRODUCER_SUGGESTION_MAX_PAGE_SIZE = 100;

const authorUsers = alias(users, "producer_suggestion_authors");
const reviewerUsers = alias(users, "producer_suggestion_reviewers");

const FIELD_LABELS = new Map(
  PRODUCER_EDITABLE_FIELDS.map(({ key, label }) => [key as string, label]),
);

export type AdminProducerSuggestionActor = {
  id: string;
  displayName: string | null;
};

export type AdminProducerSuggestionFieldDiff = {
  key: string;
  label: string;
  before: string;
  requested: string;
  current: string | null;
};

export type AdminProducerSuggestionListItem = {
  suggestion: ProducerSuggestion;
  producer: LocatedProducerCsvRow | null;
  producerName: string;
  publicPath: string | null;
  sectionLabel: string;
  author: AdminProducerSuggestionActor;
  reviewer: AdminProducerSuggestionActor | null;
  diff: AdminProducerSuggestionFieldDiff[];
  /** The catalog row still matches the values the reader was looking at. */
  baseMatchesCatalog: boolean;
};

export type AdminProducerSuggestionListOptions = {
  status?: string | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
};

export type NormalizedAdminProducerSuggestionListOptions = {
  selection: ProducerSuggestionStatusSelection;
  query: string;
  page: number;
  pageSize: number;
};

export type AdminProducerSuggestionList = {
  items: AdminProducerSuggestionListItem[];
  options: NormalizedAdminProducerSuggestionListOptions;
  total: number;
  totalPages: number;
};

export type ProducerSuggestionCounts = Record<ProducerSuggestionStatus, number>;

function positiveInteger(
  value: number | undefined,
  fallback: number,
  maximum: number,
): number {
  if (!Number.isSafeInteger(value) || !value || value < 1) return fallback;
  return Math.min(value, maximum);
}

export function normalizeAdminProducerSuggestionListOptions(
  options: AdminProducerSuggestionListOptions = {},
): NormalizedAdminProducerSuggestionListOptions {
  return {
    selection: resolveProducerSuggestionStatusSelection(options.status),
    query: options.query?.replace(/\s+/g, " ").trim().slice(0, 120) ?? "",
    page: positiveInteger(options.page, 1, 100_000),
    pageSize: positiveInteger(
      options.pageSize,
      ADMIN_PRODUCER_SUGGESTION_PAGE_SIZE,
      ADMIN_PRODUCER_SUGGESTION_MAX_PAGE_SIZE,
    ),
  };
}

function listConditions(
  options: NormalizedAdminProducerSuggestionListOptions,
): SQL[] {
  const conditions: SQL[] = [];
  if (options.selection.key !== "all") {
    conditions.push(
      inArray(producerSuggestions.status, [...options.selection.statuses]),
    );
  }
  if (options.query) {
    const pattern = `%${options.query}%`;
    const search = or(
      ilike(producerSuggestions.country, pattern),
      ilike(producerSuggestions.section, pattern),
      ilike(authorUsers.displayName, pattern),
      ilike(reviewerUsers.displayName, pattern),
      sql`${producerSuggestions.id}::text ILIKE ${pattern}`,
      sql`${producerSuggestions.producerId}::text ILIKE ${pattern}`,
      sql`${producerSuggestions.baseSnapshot}->>'nombre' ILIKE ${pattern}`,
    );
    if (search) conditions.push(search);
  }
  return conditions;
}

function fieldLabel(key: string): string {
  return FIELD_LABELS.get(key) ?? key;
}

function sectionLabel(section: string): string {
  return isProducerSuggestionSection(section)
    ? getProducerSuggestionSection(section).operatorLabel
    : section;
}

function buildDiff(
  suggestion: ProducerSuggestion,
  producer: LocatedProducerCsvRow | null,
): AdminProducerSuggestionFieldDiff[] {
  return Object.entries(suggestion.patch).map(([key, requested]) => ({
    key,
    label: fieldLabel(key),
    before: suggestion.baseSnapshot[key] ?? "",
    requested,
    current: producer ? (producer.fields[key] ?? "") : null,
  }));
}

async function decorate(
  rows: readonly {
    suggestion: ProducerSuggestion;
    authorDisplayName: string | null;
    reviewerDisplayName: string | null;
  }[],
): Promise<AdminProducerSuggestionListItem[]> {
  const producers = await findProducersByIds(
    rows.map(({ suggestion }) => ({
      country: suggestion.country,
      producerId: suggestion.producerId,
    })),
  );

  return rows.map(({ suggestion, authorDisplayName, reviewerDisplayName }, index) => {
    const producer = producers[index];
    return {
      suggestion,
      producer,
      producerName:
        producer?.name ?? suggestion.baseSnapshot.nombre ?? "Retired producer",
      publicPath: producer
        ? buildProducerHref(producer, {
            country: producer.country,
            area: producer.area,
          })
        : null,
      sectionLabel: sectionLabel(suggestion.section),
      author: { id: suggestion.authorUserId, displayName: authorDisplayName },
      reviewer: suggestion.reviewerUserId
        ? { id: suggestion.reviewerUserId, displayName: reviewerDisplayName }
        : null,
      diff: buildDiff(suggestion, producer),
      baseMatchesCatalog: producer
        ? hashProducerFields(producer.fields) === suggestion.baseRowHash
        : false,
    };
  });
}

export async function queryAdminProducerSuggestions(
  database: Database,
  input: AdminProducerSuggestionListOptions = {},
): Promise<AdminProducerSuggestionList> {
  const options = normalizeAdminProducerSuggestionListOptions(input);
  const conditions = listConditions(options);
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (options.page - 1) * options.pageSize;

  const [rows, [totalRow]] = await Promise.all([
    database
      .select({
        suggestion: producerSuggestions,
        authorDisplayName: authorUsers.displayName,
        reviewerDisplayName: reviewerUsers.displayName,
      })
      .from(producerSuggestions)
      .innerJoin(
        authorUsers,
        eq(producerSuggestions.authorUserId, authorUsers.id),
      )
      .leftJoin(
        reviewerUsers,
        eq(producerSuggestions.reviewerUserId, reviewerUsers.id),
      )
      .where(where)
      // Oldest first while a decision is outstanding, newest first once closed.
      .orderBy(
        options.selection.key === "review"
          ? asc(producerSuggestions.submittedAt)
          : desc(producerSuggestions.updatedAt),
      )
      .limit(options.pageSize)
      .offset(offset),
    database
      .select({ value: count() })
      .from(producerSuggestions)
      .innerJoin(
        authorUsers,
        eq(producerSuggestions.authorUserId, authorUsers.id),
      )
      .leftJoin(
        reviewerUsers,
        eq(producerSuggestions.reviewerUserId, reviewerUsers.id),
      )
      .where(where),
  ]);

  const total = Number(totalRow?.value ?? 0);
  return {
    items: await decorate(rows),
    options,
    total,
    totalPages: Math.max(1, Math.ceil(total / options.pageSize)),
  };
}

export async function queryProducerSuggestionCounts(
  database: Database,
): Promise<ProducerSuggestionCounts> {
  const rows = await database
    .select({ status: producerSuggestions.status, value: count() })
    .from(producerSuggestions)
    .groupBy(producerSuggestions.status);

  const counts = Object.fromEntries(
    PRODUCER_SUGGESTION_STATUSES.map((status) => [status, 0]),
  ) as ProducerSuggestionCounts;
  for (const row of rows) counts[row.status] = Number(row.value);
  return counts;
}
