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
  getProducerChangeStatusDefinition,
  requestedProducerFields,
  resolveProducerChangeStatusSelection,
  type ProducerChangeStatus,
  type ProducerChangeStatusSelection,
} from "@/lib/accounts/producer-change-workflow";
import {
  hashProducerFields,
  PRODUCER_EDITABLE_FIELDS,
} from "@/lib/accounts/producer-fields";
import {
  findProducerById,
  findProducersByIds,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import { buildProducerHref } from "@/lib/catalog-navigation";
import type { Database } from "@/lib/db";
import {
  producerChangeRequestAuditEvents,
  producerChangeExecutions,
  producerChangeRequests,
  users,
  type ProducerChangeExecution,
  type ProducerChangeRequest,
} from "@/lib/db/schema";

export const PRODUCER_CHANGE_AGENT_SCHEMA_VERSION = 2;
export const ADMIN_PRODUCER_CHANGE_PAGE_SIZE = 25;
export const ADMIN_PRODUCER_CHANGE_MAX_PAGE_SIZE = 100;
export const PRODUCER_CHANGE_RECOVERY_QUARANTINE_MS = 24 * 60 * 60 * 1_000;

export function buildAdminProducerPublicPath(
  producer: Pick<LocatedProducerCsvRow, "area" | "country" | "slug">,
): string {
  return buildProducerHref(producer, {
    country: producer.country,
    area: producer.area,
  });
}

const authorUsers = alias(users, "producer_change_authors");
const reviewerUsers = alias(users, "producer_change_reviewers");
const auditActorUsers = alias(users, "producer_change_audit_actors");

export type AdminProducerChangeListOptions = {
  status?: string | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
};

export type NormalizedAdminProducerChangeListOptions = {
  selection: ProducerChangeStatusSelection;
  query: string;
  page: number;
  pageSize: number;
};

export type AdminProducerChangeActor = {
  id: string;
  displayName: string | null;
};

export type AdminProducerChangeListRow = {
  id: string;
  authorUserId: string;
  country: string;
  producerId: number;
  status: ProducerChangeStatus;
  patch: Record<string, string>;
  historicProducerName: string | null;
  reviewerUserId: string | null;
  appliedCommitSha: string | null;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminProducerChangeListItem = {
  change: AdminProducerChangeListRow;
  producer: LocatedProducerCsvRow | null;
  author: AdminProducerChangeActor;
  reviewer: AdminProducerChangeActor | null;
  changedFields: string[];
  producerName: string;
  publicPath: string | null;
};

export type AdminProducerChangeList = {
  items: AdminProducerChangeListItem[];
  options: NormalizedAdminProducerChangeListOptions;
  total: number;
  totalPages: number;
};

export type ProducerChangeCounts = Record<ProducerChangeStatus, number>;

export type AdminProducerChangeAuditItem = {
  id: string;
  actorKind: "user" | "service" | "system";
  actorUserId: string | null;
  actorKey: string | null;
  actorDisplayName: string | null;
  action: string;
  metadata: Record<string, unknown>;
  occurredAt: Date;
};

export type AdminProducerChangeFieldDiff = {
  key: string;
  label: string;
  before: string;
  requested: string;
  current: string | null;
};

export type AdminProducerChangeExecution = Pick<
  ProducerChangeExecution,
  | "id"
  | "status"
  | "operatorKey"
  | "worktreeKey"
  | "sourceHeadSha"
  | "expectedRowHash"
  | "leaseExpiresAt"
  | "csvPath"
  | "materializedAt"
  | "appliedCommitSha"
  | "finishedAt"
  | "errorMessage"
  | "createdAt"
  | "updatedAt"
>;

export type ProducerChangeCatalogState =
  | "missing"
  | "matches_base"
  | "matches_requested"
  | "diverged";

export type AdminProducerChangeDetail = {
  change: ProducerChangeRequest;
  execution: AdminProducerChangeExecution | null;
  producer: LocatedProducerCsvRow | null;
  producerName: string;
  publicPath: string | null;
  author: AdminProducerChangeActor;
  reviewer: AdminProducerChangeActor | null;
  audit: AdminProducerChangeAuditItem[];
  diff: AdminProducerChangeFieldDiff[];
  catalog: {
    state: ProducerChangeCatalogState;
    currentHash: string | null;
    requestedHash: string;
  };
};

function positiveInteger(value: number | undefined, fallback: number, maximum: number): number {
  if (!Number.isSafeInteger(value) || !value || value < 1) return fallback;
  return Math.min(value, maximum);
}

export function normalizeAdminProducerChangeListOptions(
  options: AdminProducerChangeListOptions = {},
): NormalizedAdminProducerChangeListOptions {
  return {
    selection: resolveProducerChangeStatusSelection(options.status),
    query: options.query?.replace(/\s+/g, " ").trim().slice(0, 120) ?? "",
    page: positiveInteger(options.page, 1, 100_000),
    pageSize: positiveInteger(
      options.pageSize,
      ADMIN_PRODUCER_CHANGE_PAGE_SIZE,
      ADMIN_PRODUCER_CHANGE_MAX_PAGE_SIZE,
    ),
  };
}

function listConditions(options: NormalizedAdminProducerChangeListOptions): SQL[] {
  const conditions: SQL[] = [];
  if (options.selection.key !== "all") {
    conditions.push(inArray(producerChangeRequests.status, [...options.selection.statuses]));
  }
  if (options.query) {
    const pattern = `%${options.query}%`;
    const search = or(
      ilike(producerChangeRequests.country, pattern),
      ilike(authorUsers.displayName, pattern),
      ilike(reviewerUsers.displayName, pattern),
      sql`${producerChangeRequests.id}::text ILIKE ${pattern}`,
      sql`${producerChangeRequests.producerId}::text ILIKE ${pattern}`,
      sql`${producerChangeRequests.baseSnapshot}->>'nombre' ILIKE ${pattern}`,
    );
    if (search) conditions.push(search);
  }
  return conditions;
}

export async function queryAdminProducerChanges(
  database: Database,
  input: AdminProducerChangeListOptions = {},
): Promise<AdminProducerChangeList> {
  const options = normalizeAdminProducerChangeListOptions(input);
  const conditions = listConditions(options);
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (options.page - 1) * options.pageSize;

  const selection = {
    id: producerChangeRequests.id,
    authorUserId: producerChangeRequests.authorUserId,
    country: producerChangeRequests.country,
    producerId: producerChangeRequests.producerId,
    status: producerChangeRequests.status,
    patch: producerChangeRequests.patch,
    historicProducerName: sql<string | null>`${producerChangeRequests.baseSnapshot}->>'nombre'`,
    reviewerUserId: producerChangeRequests.reviewerUserId,
    appliedCommitSha: producerChangeRequests.appliedCommitSha,
    submittedAt: producerChangeRequests.submittedAt,
    reviewedAt: producerChangeRequests.reviewedAt,
    appliedAt: producerChangeRequests.appliedAt,
    createdAt: producerChangeRequests.createdAt,
    updatedAt: producerChangeRequests.updatedAt,
    authorDisplayName: authorUsers.displayName,
    reviewerDisplayName: reviewerUsers.displayName,
  };

  const [rows, [totalRow]] = await Promise.all([
    database
      .select(selection)
      .from(producerChangeRequests)
      .innerJoin(authorUsers, eq(producerChangeRequests.authorUserId, authorUsers.id))
      .leftJoin(reviewerUsers, eq(producerChangeRequests.reviewerUserId, reviewerUsers.id))
      .where(where)
      .orderBy(desc(producerChangeRequests.updatedAt), desc(producerChangeRequests.id))
      .limit(options.pageSize)
      .offset(offset),
    database
      .select({ value: count() })
      .from(producerChangeRequests)
      .innerJoin(authorUsers, eq(producerChangeRequests.authorUserId, authorUsers.id))
      .leftJoin(reviewerUsers, eq(producerChangeRequests.reviewerUserId, reviewerUsers.id))
      .where(where),
  ]);

  const producers = await findProducersByIds(
    rows.map(({ country, producerId }) => ({ country, producerId })),
  );
  const items = rows.map((row, index): AdminProducerChangeListItem => {
    const producer = producers[index];
    return {
      change: {
        id: row.id,
        authorUserId: row.authorUserId,
        country: row.country,
        producerId: row.producerId,
        status: row.status,
        patch: row.patch,
        historicProducerName: row.historicProducerName,
        reviewerUserId: row.reviewerUserId,
        appliedCommitSha: row.appliedCommitSha,
        submittedAt: row.submittedAt,
        reviewedAt: row.reviewedAt,
        appliedAt: row.appliedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      producer,
      author: { id: row.authorUserId, displayName: row.authorDisplayName },
      reviewer: row.reviewerUserId
        ? { id: row.reviewerUserId, displayName: row.reviewerDisplayName }
        : null,
      changedFields: Object.keys(row.patch).sort((left, right) => left.localeCompare(right)),
      producerName:
        producer?.name || row.historicProducerName || `Producer #${row.producerId}`,
      publicPath: producer ? buildAdminProducerPublicPath(producer) : null,
    };
  });
  const total = Number(totalRow?.value ?? 0);

  return {
    items,
    options,
    total,
    totalPages: Math.max(1, Math.ceil(total / options.pageSize)),
  };
}

export async function queryProducerChangeCounts(database: Database): Promise<ProducerChangeCounts> {
  const rows = await database
    .select({ status: producerChangeRequests.status, value: count() })
    .from(producerChangeRequests)
    .groupBy(producerChangeRequests.status);
  const allStatuses = resolveProducerChangeStatusSelection("all").statuses;
  const counts = Object.fromEntries(allStatuses.map((status) => [status, 0])) as ProducerChangeCounts;
  for (const row of rows) counts[row.status] = Number(row.value);
  return counts;
}

function fieldDiff(
  change: ProducerChangeRequest,
  producer: LocatedProducerCsvRow | null,
): AdminProducerChangeFieldDiff[] {
  const definitions = new Map<string, string>(
    PRODUCER_EDITABLE_FIELDS.map((definition) => [definition.key, definition.label]),
  );
  const order = new Map<string, number>(
    PRODUCER_EDITABLE_FIELDS.map((definition, index) => [definition.key, index]),
  );
  return Object.entries(change.patch)
    .sort(([left], [right]) => {
      const leftIndex = order.get(left) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = order.get(right) ?? Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex || left.localeCompare(right);
    })
    .map(([key, requested]) => ({
      key,
      label: definitions.get(key) ?? key,
      before: change.baseSnapshot[key] ?? "",
      requested,
      current: producer ? (producer.fields[key] ?? "") : null,
    }));
}

export async function queryAdminProducerChangeById(
  database: Database,
  id: string,
): Promise<AdminProducerChangeDetail | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const [row] = await database
    .select({
      change: producerChangeRequests,
      authorDisplayName: authorUsers.displayName,
      reviewerDisplayName: reviewerUsers.displayName,
    })
    .from(producerChangeRequests)
    .innerJoin(authorUsers, eq(producerChangeRequests.authorUserId, authorUsers.id))
    .leftJoin(reviewerUsers, eq(producerChangeRequests.reviewerUserId, reviewerUsers.id))
    .where(eq(producerChangeRequests.id, id))
    .limit(1);
  if (!row) return null;

  const [producer, events, [execution]] = await Promise.all([
    findProducerById(row.change.country, row.change.producerId),
    database
      .select({
        id: producerChangeRequestAuditEvents.id,
        actorKind: producerChangeRequestAuditEvents.actorKind,
        actorUserId: producerChangeRequestAuditEvents.actorUserId,
        actorKey: producerChangeRequestAuditEvents.actorKey,
        actorDisplayName: auditActorUsers.displayName,
        action: producerChangeRequestAuditEvents.action,
        metadata: producerChangeRequestAuditEvents.metadata,
        occurredAt: producerChangeRequestAuditEvents.occurredAt,
      })
      .from(producerChangeRequestAuditEvents)
      .leftJoin(
        auditActorUsers,
        eq(producerChangeRequestAuditEvents.actorUserId, auditActorUsers.id),
      )
      .where(
        and(
          eq(producerChangeRequestAuditEvents.targetType, "producer_change_request"),
          eq(producerChangeRequestAuditEvents.targetId, row.change.id),
        ),
      )
      .orderBy(
        asc(producerChangeRequestAuditEvents.occurredAt),
        asc(producerChangeRequestAuditEvents.id),
      ),
    database
      .select({
        id: producerChangeExecutions.id,
        status: producerChangeExecutions.status,
        operatorKey: producerChangeExecutions.operatorKey,
        worktreeKey: producerChangeExecutions.worktreeKey,
        sourceHeadSha: producerChangeExecutions.sourceHeadSha,
        expectedRowHash: producerChangeExecutions.expectedRowHash,
        leaseExpiresAt: producerChangeExecutions.leaseExpiresAt,
        csvPath: producerChangeExecutions.csvPath,
        materializedAt: producerChangeExecutions.materializedAt,
        appliedCommitSha: producerChangeExecutions.appliedCommitSha,
        finishedAt: producerChangeExecutions.finishedAt,
        errorMessage: producerChangeExecutions.errorMessage,
        createdAt: producerChangeExecutions.createdAt,
        updatedAt: producerChangeExecutions.updatedAt,
      })
      .from(producerChangeExecutions)
      .where(eq(producerChangeExecutions.changeRequestId, row.change.id))
      .orderBy(
        desc(
          sql<number>`CASE WHEN ${producerChangeExecutions.status} IN ('materialized', 'leased') THEN 1 ELSE 0 END`,
        ),
        desc(producerChangeExecutions.createdAt),
        desc(producerChangeExecutions.id),
      )
      .limit(1),
  ]);
  const requestedHash = hashProducerFields(requestedProducerFields(row.change));
  const currentHash = producer ? hashProducerFields(producer.fields) : null;
  const catalogState: ProducerChangeCatalogState = !producer
    ? "missing"
    : currentHash === requestedHash
      ? "matches_requested"
      : currentHash === row.change.baseRowHash
        ? "matches_base"
        : "diverged";

  return {
    change: row.change,
    execution: execution ?? null,
    producer,
    producerName:
      producer?.name || row.change.baseSnapshot.nombre || `Producer #${row.change.producerId}`,
    publicPath: producer ? buildAdminProducerPublicPath(producer) : null,
    author: { id: row.change.authorUserId, displayName: row.authorDisplayName },
    reviewer: row.change.reviewerUserId
      ? { id: row.change.reviewerUserId, displayName: row.reviewerDisplayName }
      : null,
    audit: events,
    diff: fieldDiff(row.change, producer),
    catalog: { state: catalogState, currentHash, requestedHash },
  };
}

function iso(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

export function producerChangeRecoveryEligibleAt(
  materializedAt: Date | null,
): Date | null {
  return materializedAt
    ? new Date(materializedAt.getTime() + PRODUCER_CHANGE_RECOVERY_QUARANTINE_MS)
    : null;
}

export function serializeProducerChangeListItem(item: AdminProducerChangeListItem) {
  const status = getProducerChangeStatusDefinition(item.change.status);
  return {
    id: item.change.id,
    resourceType: "producer_change_request" as const,
    status: {
      code: item.change.status,
      label: status.label,
      phase: status.phase,
      requiresOperatorAction: status.requiresOperatorAction,
      nextAction: status.nextAction,
    },
    producer: {
      country: item.change.country,
      producerId: item.change.producerId,
      name: item.producerName,
      catalogPresent: Boolean(item.producer),
      area: item.producer?.area ?? null,
      slug: item.producer?.slug ?? null,
      publicPath: item.publicPath,
    },
    changedFields: item.changedFields,
    actors: {
      author: item.author,
      reviewer: item.reviewer,
    },
    timestamps: {
      createdAt: iso(item.change.createdAt),
      submittedAt: iso(item.change.submittedAt),
      reviewedAt: iso(item.change.reviewedAt),
      appliedAt: iso(item.change.appliedAt),
      updatedAt: iso(item.change.updatedAt),
    },
    appliedCommitSha: item.change.appliedCommitSha,
    links: {
      adminPath: `/admin/cambios/${item.change.id}`,
    },
  };
}

const SAFE_AUDIT_METADATA_KEYS = new Set([
  "alreadyPresent",
  "commitSha",
  "country",
  "csvPath",
  "executionId",
  "fields",
  "observedRowHash",
  "observedState",
  "previousExecutionId",
  "previousOperator",
  "producerHash",
  "producerId",
  "reason",
  "sourceHeadSha",
]);

function safeAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => SAFE_AUDIT_METADATA_KEYS.has(key)),
  );
}

export function serializeProducerChangeDetail(detail: AdminProducerChangeDetail) {
  return {
    ...serializeProducerChangeListItem({
      change: {
        id: detail.change.id,
        authorUserId: detail.change.authorUserId,
        country: detail.change.country,
        producerId: detail.change.producerId,
        status: detail.change.status,
        patch: detail.change.patch,
        historicProducerName: detail.change.baseSnapshot.nombre ?? null,
        reviewerUserId: detail.change.reviewerUserId,
        appliedCommitSha: detail.change.appliedCommitSha,
        submittedAt: detail.change.submittedAt,
        reviewedAt: detail.change.reviewedAt,
        appliedAt: detail.change.appliedAt,
        createdAt: detail.change.createdAt,
        updatedAt: detail.change.updatedAt,
      },
      producer: detail.producer,
      author: detail.author,
      reviewer: detail.reviewer,
      changedFields: detail.diff.map(({ key }) => key),
      producerName: detail.producerName,
      publicPath: detail.publicPath,
    }),
    request: {
      baseRowHash: detail.change.baseRowHash,
      baseSnapshot: detail.change.baseSnapshot,
      patch: detail.change.patch,
      authorNote: detail.change.authorNote,
      decisionNote: detail.change.decisionNote,
      failureReason: detail.change.failureReason,
      lockVersion: detail.change.lockVersion,
    },
    diff: detail.diff,
    catalog: detail.catalog,
    execution: detail.execution
      ? {
          id: detail.execution.id,
          status: detail.execution.status,
          operatorKey: detail.execution.operatorKey,
          worktreeKey: detail.execution.worktreeKey,
          sourceHeadSha: detail.execution.sourceHeadSha,
          expectedRowHash: detail.execution.expectedRowHash,
          leaseExpiresAt: iso(detail.execution.leaseExpiresAt),
          csvPath: detail.execution.csvPath,
          materializedAt: iso(detail.execution.materializedAt),
          recoveryEligibleAt: iso(
            producerChangeRecoveryEligibleAt(detail.execution.materializedAt),
          ),
          appliedCommitSha: detail.execution.appliedCommitSha,
          finishedAt: iso(detail.execution.finishedAt),
          errorMessage: detail.execution.errorMessage,
          createdAt: iso(detail.execution.createdAt),
          updatedAt: iso(detail.execution.updatedAt),
        }
      : null,
    audit: detail.audit.map((event) => ({
      id: event.id,
      action: event.action,
      actor: {
        kind: event.actorKind,
        userId: event.actorUserId,
        displayName: event.actorDisplayName,
        key: event.actorKey,
      },
      metadata: safeAuditMetadata(event.metadata),
      occurredAt: event.occurredAt.toISOString(),
    })),
    operatorCommands: {
      materialize:
        detail.change.status === "approved" || detail.change.status === "applying"
          ? `npx pnpm producer:change materialize ${detail.change.id}`
          : null,
      finalizeTemplate:
        detail.change.status === "applying"
          ? `npx pnpm producer:change finalize ${detail.change.id} <full-commit-sha>`
          : null,
      recoverTemplate:
        detail.change.status === "applying" && detail.execution?.status === "materialized"
          ? `npx pnpm producer:change recover ${detail.change.id} ${detail.execution.id} --reason "<documented reason>"`
          : null,
    },
  };
}
