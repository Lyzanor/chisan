import { sql } from "drizzle-orm";
import type { ProducerContentChange } from "../accounts/producer-content-change";
import {
  bigint,
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  pgView,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestampWithTimezone = (name: string) =>
  timestamp(name, { mode: "date", withTimezone: true });

// Private operational measurement, keyed by the immutable catalog identity.
// Receipts identify a single page display; they never identify a visitor.
export const producerDailyStats = pgTable("producer_daily_stats", {
  country: varchar("country", { length: 2 }).notNull(),
  producerId: bigint("producer_id", { mode: "number" }).notNull(),
  day: date("day", { mode: "string" }).notNull(),
  views: bigint("views", { mode: "number" }).notNull().default(0),
}, (table) => [
  primaryKey({ columns: [table.country, table.producerId, table.day] }),
  check("producer_daily_stats_count_check", sql`${table.views} >= 0`),
  check("producer_daily_stats_identity_check", sql`${table.country} ~ '^[a-z]{2}$' AND ${table.producerId} > 0`),
]);

export const producerStatsReceipts = pgTable("producer_stats_receipts", {
  eventId: uuid("event_id").primaryKey(),
  day: date("day", { mode: "string" }).notNull(),
}, (table) => [index("producer_stats_receipts_day_idx").on(table.day)]);

export const userProfileKind = pgEnum("user_profile_kind", ["user", "producer"]);
export const userStatus = pgEnum("user_status", ["active", "suspended", "deleted"]);
export const publicProfileVisibility = pgEnum("public_profile_visibility", [
  "private",
  "unlisted",
  "public",
]);
export const staffRole = pgEnum("staff_role", ["reviewer", "admin"]);
export const producerClaimStatus = pgEnum("producer_claim_status", [
  "draft",
  "pending",
  "needs_info",
  "approved",
  "rejected",
  "withdrawn",
  "revoked",
]);
export const producerMembershipRole = pgEnum("producer_membership_role", [
  "owner",
  "editor",
]);
export const producerMembershipStatus = pgEnum("producer_membership_status", [
  "active",
  "revoked",
]);
export const producerChangeRequestStatus = pgEnum("producer_change_request_status", [
  "draft",
  "submitted",
  "needs_changes",
  "approved",
  "applying",
  "applied",
  "rejected",
  "withdrawn",
  "conflict",
  "failed",
]);
export const producerChangeExecutionStatus = pgEnum(
  "producer_change_execution_status",
  ["leased", "materialized", "finalized", "failed", "expired", "cancelled"],
);
export const auditActorKind = pgEnum("audit_actor_kind", ["user", "service", "system"]);
export const webhookReceiptStatus = pgEnum("webhook_receipt_status", [
  "received",
  "processing",
  "processed",
  "failed",
]);
export const entitlementSubjectKind = pgEnum("entitlement_subject_kind", [
  "user",
  "producer",
]);
export const entitlementStatus = pgEnum("entitlement_status", [
  "active",
  "revoked",
  "expired",
]);
export const producerProfileUpgradeStatus = pgEnum(
  "producer_profile_upgrade_status",
  [
    "pending",
    "paid",
    "paid_unfulfilled",
    "payment_failed",
    "expired",
    "partially_refunded",
    "refunded",
    "disputed",
    "dispute_lost",
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    status: userStatus("status").notNull().default("active"),
    displayName: varchar("display_name", { length: 160 }),
    publicHandle: varchar("public_handle", { length: 40 }),
    selectionTitle: varchar("selection_title", { length: 160 }),
    selectionDescription: varchar("selection_description", { length: 600 }),
    publicProfileVisibility: publicProfileVisibility("public_profile_visibility")
      .notNull()
      .default("private"),
    publicProfileBaseCountry: varchar("public_profile_base_country", { length: 2 }),
    publicProfileBaseArea: varchar("public_profile_base_area", { length: 160 }),
    publicProfileBaseMunicipality: varchar("public_profile_base_municipality", {
      length: 160,
    }),
    // Automatic UX state: accounts start as user and become producer on first claim.
    // Authorization still comes only from memberships and grants.
    profileKind: userProfileKind("profile_kind").notNull().default("user"),
    // Legacy column name: this is the current review/publication acknowledgement,
    // not a versioned acceptance of legal terms.
    termsAcceptedAt: timestampWithTimezone("terms_accepted_at"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestampWithTimezone("deleted_at"),
  },
  (table) => [
    index("users_status_idx").on(table.status),
    uniqueIndex("users_public_handle_uidx").on(table.publicHandle),
    check(
      "users_public_handle_format_check",
      sql`${table.publicHandle} IS NULL OR ${table.publicHandle} ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$'`,
    ),
    check(
      "users_public_profile_handle_check",
      sql`${table.publicProfileVisibility} = 'private' OR ${table.publicHandle} IS NOT NULL`,
    ),
    check(
      "users_public_profile_base_location_check",
      sql`(${table.publicProfileBaseCountry} IS NULL AND ${table.publicProfileBaseArea} IS NULL AND ${table.publicProfileBaseMunicipality} IS NULL) OR (${table.publicProfileBaseCountry} IS NOT NULL AND ${table.publicProfileBaseArea} IS NOT NULL AND ${table.publicProfileBaseMunicipality} IS NOT NULL)`,
    ),
    check(
      "users_public_profile_base_country_check",
      sql`${table.publicProfileBaseCountry} IS NULL OR ${table.publicProfileBaseCountry} ~ '^[a-z]{2}$'`,
    ),
    check(
      "users_public_profile_base_area_check",
      sql`${table.publicProfileBaseArea} IS NULL OR ${table.publicProfileBaseArea} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`,
    ),
    check(
      "users_public_profile_base_municipality_check",
      sql`${table.publicProfileBaseMunicipality} IS NULL OR length(trim(${table.publicProfileBaseMunicipality})) > 0`,
    ),
    check(
      "users_public_profile_location_required_check",
      sql`${table.publicHandle} IS NULL OR (${table.publicProfileBaseCountry} IS NOT NULL AND ${table.publicProfileBaseArea} IS NOT NULL AND ${table.publicProfileBaseMunicipality} IS NOT NULL)`,
    ),
    check(
      "users_deleted_state_check",
      sql`(${table.status} = 'deleted' AND ${table.deletedAt} IS NOT NULL) OR (${table.status} <> 'deleted' AND ${table.deletedAt} IS NULL)`,
    ),
  ],
);

export const authIdentities = pgTable(
  "auth_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 64 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    emailVerifiedAt: timestampWithTimezone("email_verified_at"),
    providerUpdatedAt: timestampWithTimezone("provider_updated_at"),
    providerEventId: varchar("provider_event_id", { length: 255 }),
    disabledAt: timestampWithTimezone("disabled_at"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    lastSeenAt: timestampWithTimezone("last_seen_at"),
  },
  (table) => [
    uniqueIndex("auth_identities_provider_subject_uidx").on(table.provider, table.subject),
    index("auth_identities_user_id_idx").on(table.userId),
    check("auth_identities_provider_check", sql`length(btrim(${table.provider})) > 0`),
    check("auth_identities_subject_check", sql`length(btrim(${table.subject})) > 0`),
  ],
);

/**
 * Provider subjects are not reusable. Keeping deletion tombstones separate from
 * local users prevents an out-of-order create/update webhook from resurrecting
 * an identity after its PII has been erased.
 */
export const authIdentityTombstones = pgTable(
  "auth_identity_tombstones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: varchar("provider", { length: 64 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    providerDeletedAt: timestampWithTimezone("provider_deleted_at").notNull(),
    providerEventId: varchar("provider_event_id", { length: 255 }).notNull(),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_identity_tombstones_provider_subject_uidx").on(
      table.provider,
      table.subject,
    ),
    check(
      "auth_identity_tombstones_provider_check",
      sql`length(btrim(${table.provider})) > 0`,
    ),
    check(
      "auth_identity_tombstones_subject_check",
      sql`length(btrim(${table.subject})) > 0`,
    ),
    check(
      "auth_identity_tombstones_event_id_check",
      sql`length(btrim(${table.providerEventId})) > 0`,
    ),
  ],
);

export const staffGrants = pgTable(
  "staff_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: staffRole("role").notNull(),
    grantedByUserId: uuid("granted_by_user_id").references(() => users.id),
    grantedAt: timestampWithTimezone("granted_at").notNull().defaultNow(),
    expiresAt: timestampWithTimezone("expires_at"),
    revokedAt: timestampWithTimezone("revoked_at"),
    revokedByUserId: uuid("revoked_by_user_id").references(() => users.id),
    reason: text("reason"),
  },
  (table) => [
    uniqueIndex("staff_grants_active_user_role_uidx")
      .on(table.userId, table.role)
      .where(sql`${table.revokedAt} IS NULL`),
    index("staff_grants_active_user_idx")
      .on(table.userId)
      .where(sql`${table.revokedAt} IS NULL`),
    check(
      "staff_grants_expiry_check",
      sql`${table.expiresAt} IS NULL OR ${table.expiresAt} > ${table.grantedAt}`,
    ),
    check(
      "staff_grants_revocation_check",
      sql`(${table.revokedAt} IS NULL AND ${table.revokedByUserId} IS NULL) OR (${table.revokedAt} IS NOT NULL AND ${table.revokedByUserId} IS NOT NULL)`,
    ),
  ],
);

export const favorites = pgTable(
  "favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    showOnPublicProfile: boolean("show_on_public_profile").notNull().default(false),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.country, table.producerId] }),
    index("favorites_producer_idx").on(table.country, table.producerId),
    check("favorites_country_check", sql`${table.country} ~ '^[a-z]{2}$'`),
    check(
      "favorites_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
  ],
);

export const producerClaims = pgTable(
  "producer_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimantUserId: uuid("claimant_user_id")
      .notNull()
      .references(() => users.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    status: producerClaimStatus("status").notNull().default("draft"),
    proofMethod: varchar("proof_method", { length: 64 }),
    proof: jsonb("proof").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    claimantMessage: text("claimant_message"),
    reviewerUserId: uuid("reviewer_user_id").references(() => users.id),
    decisionReason: text("decision_reason"),
    lockVersion: integer("lock_version").notNull().default(1),
    submittedAt: timestampWithTimezone("submitted_at"),
    reviewedAt: timestampWithTimezone("reviewed_at"),
    revokedAt: timestampWithTimezone("revoked_at"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("producer_claims_open_claimant_producer_uidx")
      .on(table.claimantUserId, table.country, table.producerId)
      .where(sql`${table.status} IN ('draft', 'pending', 'needs_info', 'approved')`),
    uniqueIndex("producer_claims_approved_producer_uidx")
      .on(table.country, table.producerId)
      .where(sql`${table.status} = 'approved'`),
    index("producer_claims_review_queue_idx").on(table.status, table.submittedAt),
    index("producer_claims_producer_idx").on(table.country, table.producerId),
    check("producer_claims_country_check", sql`${table.country} ~ '^[a-z]{2}$'`),
    check(
      "producer_claims_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check("producer_claims_proof_check", sql`jsonb_typeof(${table.proof}) = 'object'`),
    check("producer_claims_lock_version_check", sql`${table.lockVersion} > 0`),
    check(
      "producer_claims_submission_check",
      sql`${table.status} = 'draft' OR ${table.submittedAt} IS NOT NULL`,
    ),
    check(
      "producer_claims_review_check",
      sql`${table.status} NOT IN ('approved', 'rejected') OR (${table.reviewerUserId} IS NOT NULL AND ${table.reviewedAt} IS NOT NULL)`,
    ),
    check(
      "producer_claims_revocation_check",
      sql`(${table.status} = 'revoked' AND ${table.revokedAt} IS NOT NULL) OR (${table.status} <> 'revoked' AND ${table.revokedAt} IS NULL)`,
    ),
  ],
);

export const producerMemberships = pgTable(
  "producer_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    role: producerMembershipRole("role").notNull(),
    status: producerMembershipStatus("status").notNull().default("active"),
    sourceClaimId: uuid("source_claim_id").references(() => producerClaims.id),
    grantedByUserId: uuid("granted_by_user_id").references(() => users.id),
    grantedAt: timestampWithTimezone("granted_at").notNull().defaultNow(),
    revokedAt: timestampWithTimezone("revoked_at"),
    revokedByUserId: uuid("revoked_by_user_id").references(() => users.id),
    revocationReason: text("revocation_reason"),
  },
  (table) => [
    uniqueIndex("producer_memberships_active_user_producer_uidx")
      .on(table.userId, table.country, table.producerId)
      .where(sql`${table.status} = 'active'`),
    uniqueIndex("producer_memberships_active_owner_producer_uidx")
      .on(table.country, table.producerId)
      .where(sql`${table.status} = 'active' AND ${table.role} = 'owner'`),
    uniqueIndex("producer_memberships_source_claim_uidx")
      .on(table.sourceClaimId)
      .where(sql`${table.sourceClaimId} IS NOT NULL`),
    index("producer_memberships_active_producer_idx")
      .on(table.country, table.producerId)
      .where(sql`${table.status} = 'active'`),
    index("producer_memberships_active_user_idx")
      .on(table.userId)
      .where(sql`${table.status} = 'active'`),
    check("producer_memberships_country_check", sql`${table.country} ~ '^[a-z]{2}$'`),
    check(
      "producer_memberships_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check(
      "producer_memberships_revocation_check",
      sql`(${table.status} = 'active' AND ${table.revokedAt} IS NULL AND ${table.revokedByUserId} IS NULL) OR (${table.status} = 'revoked' AND ${table.revokedAt} IS NOT NULL AND ${table.revokedByUserId} IS NOT NULL)`,
    ),
  ],
);

export const producerChangeRequests = pgTable(
  "producer_change_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorUserId: uuid("author_user_id")
      .notNull()
      .references(() => users.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    status: producerChangeRequestStatus("status").notNull().default("draft"),
    baseRowHash: varchar("base_row_hash", { length: 64 }).notNull(),
    baseSnapshot: jsonb("base_snapshot")
      .$type<Record<string, string>>()
      .notNull(),
    patch: jsonb("patch").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
    contentChange: jsonb("content_change").$type<ProducerContentChange>(),
    requiredEntitlementKey: varchar("required_entitlement_key", { length: 120 }),
    authorNote: text("author_note"),
    lockVersion: integer("lock_version").notNull().default(1),
    reviewerUserId: uuid("reviewer_user_id").references(() => users.id),
    decisionNote: text("decision_note"),
    failureReason: text("failure_reason"),
    appliedCommitSha: varchar("applied_commit_sha", { length: 64 }),
    submittedAt: timestampWithTimezone("submitted_at"),
    reviewedAt: timestampWithTimezone("reviewed_at"),
    appliedAt: timestampWithTimezone("applied_at"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("producer_change_requests_open_author_producer_uidx")
      .on(table.authorUserId, table.country, table.producerId)
      .where(
        sql`${table.status} IN ('draft', 'submitted', 'needs_changes', 'approved', 'applying')`,
      ),
    uniqueIndex("producer_change_requests_execution_identity_uidx").on(
      table.id,
      table.country,
      table.producerId,
    ),
    index("producer_change_requests_review_queue_idx").on(table.status, table.submittedAt),
    index("producer_change_requests_producer_idx").on(
      table.country,
      table.producerId,
      table.createdAt,
    ),
    check("producer_change_requests_country_check", sql`${table.country} ~ '^[a-z]{2}$'`),
    check(
      "producer_change_requests_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check(
      "producer_change_requests_base_hash_check",
      sql`${table.baseRowHash} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      "producer_change_requests_snapshot_check",
      sql`jsonb_typeof(${table.baseSnapshot}) = 'object'`,
    ),
    check("producer_change_requests_patch_check", sql`jsonb_typeof(${table.patch}) = 'object'`),
    check(
      "producer_change_requests_content_check",
      sql`${table.contentChange} IS NULL OR (jsonb_typeof(${table.contentChange}) = 'object' AND ${table.requiredEntitlementKey} IS NOT DISTINCT FROM 'producer.profile.premium' AND (${table.contentChange}->>'version') = '1' AND (${table.contentChange}->>'baseHash') ~ '^[a-f0-9]{64}$' AND (${table.contentChange}->>'requestedHash') ~ '^[a-f0-9]{64}$' AND jsonb_typeof(${table.contentChange}->'products') = 'array' AND (${table.contentChange}->'base'->>'country') = ${table.country} AND (${table.contentChange}->'base'->>'producer_id') = ${table.producerId}::text) IS TRUE`,
    ),
    check(
      "producer_change_requests_entitlement_key_check",
      sql`${table.requiredEntitlementKey} IS NULL OR length(btrim(${table.requiredEntitlementKey})) > 0`,
    ),
    check("producer_change_requests_lock_version_check", sql`${table.lockVersion} > 0`),
    check(
      "producer_change_requests_submission_check",
      sql`${table.status} IN ('draft', 'withdrawn', 'conflict', 'failed') OR (${table.submittedAt} IS NOT NULL AND (${table.patch} <> '{}'::jsonb OR ${table.contentChange} IS NOT NULL))`,
    ),
    check(
      "producer_change_requests_review_check",
      sql`${table.status} NOT IN ('needs_changes', 'approved', 'rejected', 'applying', 'applied') OR (${table.reviewerUserId} IS NOT NULL AND ${table.reviewedAt} IS NOT NULL)`,
    ),
    check(
      "producer_change_requests_applied_check",
      sql`(${table.status} = 'applied' AND ${table.appliedAt} IS NOT NULL AND ${table.appliedCommitSha} IS NOT NULL) OR (${table.status} <> 'applied' AND ${table.appliedAt} IS NULL)`,
    ),
    check(
      "producer_change_requests_commit_sha_check",
      sql`${table.appliedCommitSha} IS NULL OR ${table.appliedCommitSha} ~ '^([0-9a-f]{40}|[0-9a-f]{64})$'`,
    ),
  ],
);

export const producerChangeExecutions = pgTable(
  "producer_change_executions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    changeRequestId: uuid("change_request_id")
      .notNull()
      .references(() => producerChangeRequests.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    status: producerChangeExecutionStatus("status").notNull().default("leased"),
    operatorKey: varchar("operator_key", { length: 160 }).notNull(),
    worktreeKey: varchar("worktree_key", { length: 64 }).notNull(),
    sourceHeadSha: varchar("source_head_sha", { length: 40 }).notNull(),
    expectedRowHash: varchar("expected_row_hash", { length: 64 }).notNull(),
    expectedContentHash: varchar("expected_content_hash", { length: 64 }),
    leaseExpiresAt: timestampWithTimezone("lease_expires_at").notNull(),
    csvPath: varchar("csv_path", { length: 512 }).notNull(),
    materializedAt: timestampWithTimezone("materialized_at"),
    appliedCommitSha: varchar("applied_commit_sha", { length: 40 }),
    finishedAt: timestampWithTimezone("finished_at"),
    errorMessage: text("error_message"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("producer_change_executions_active_request_uidx")
      .on(table.changeRequestId)
      .where(sql`${table.status} IN ('leased', 'materialized')`),
    uniqueIndex("producer_change_executions_active_producer_uidx")
      .on(table.country, table.producerId)
      .where(sql`${table.status} IN ('leased', 'materialized')`),
    uniqueIndex("producer_change_executions_active_csv_uidx")
      .on(table.csvPath)
      .where(sql`${table.status} IN ('leased', 'materialized')`),
    foreignKey({
      columns: [table.changeRequestId, table.country, table.producerId],
      foreignColumns: [
        producerChangeRequests.id,
        producerChangeRequests.country,
        producerChangeRequests.producerId,
      ],
      name: "producer_change_executions_request_identity_fk",
    }),
    index("producer_change_executions_request_idx").on(
      table.changeRequestId,
      table.createdAt,
    ),
    index("producer_change_executions_operator_idx").on(
      table.operatorKey,
      table.status,
      table.createdAt,
    ),
    index("producer_change_executions_lease_idx")
      .on(table.leaseExpiresAt)
      .where(sql`${table.status} = 'leased'`),
    check(
      "producer_change_executions_country_check",
      sql`${table.country} ~ '^[a-z]{2}$'`,
    ),
    check(
      "producer_change_executions_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check(
      "producer_change_executions_operator_key_check",
      sql`length(btrim(${table.operatorKey})) > 0`,
    ),
    check(
      "producer_change_executions_worktree_key_check",
      sql`${table.worktreeKey} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      "producer_change_executions_source_head_check",
      sql`${table.sourceHeadSha} ~ '^[0-9a-f]{40}$'`,
    ),
    check(
      "producer_change_executions_expected_hash_check",
      sql`${table.expectedRowHash} ~ '^[0-9a-f]{64}$'`,
    ),
    check("producer_change_executions_content_hash_check", sql`${table.expectedContentHash} IS NULL OR ${table.expectedContentHash} ~ '^[a-f0-9]{64}$'`),
    check(
      "producer_change_executions_commit_sha_check",
      sql`${table.appliedCommitSha} IS NULL OR ${table.appliedCommitSha} ~ '^[0-9a-f]{40}$'`,
    ),
    check(
      "producer_change_executions_csv_path_check",
      sql`${table.csvPath} ~ ('^data/csv/' || ${table.country} || '/[^/\\\\]+/[^/\\\\]+\\.csv$') AND position('..' in ${table.csvPath}) = 0`,
    ),
    check(
      "producer_change_executions_lease_window_check",
      sql`${table.leaseExpiresAt} > ${table.createdAt}`,
    ),
    check(
      "producer_change_executions_lifecycle_check",
      sql`(${table.status} = 'leased' AND ${table.materializedAt} IS NULL AND ${table.appliedCommitSha} IS NULL AND ${table.finishedAt} IS NULL AND ${table.errorMessage} IS NULL) OR (${table.status} = 'materialized' AND ${table.materializedAt} IS NOT NULL AND ${table.appliedCommitSha} IS NULL AND ${table.finishedAt} IS NULL AND ${table.errorMessage} IS NULL) OR (${table.status} = 'finalized' AND ${table.materializedAt} IS NOT NULL AND ${table.appliedCommitSha} IS NOT NULL AND ${table.finishedAt} IS NOT NULL AND ${table.errorMessage} IS NULL) OR (${table.status} IN ('failed', 'expired', 'cancelled') AND ${table.appliedCommitSha} IS NULL AND ${table.finishedAt} IS NOT NULL AND ${table.errorMessage} IS NOT NULL)`,
    ),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorKind: auditActorKind("actor_kind").notNull(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    actorKey: varchar("actor_key", { length: 160 }),
    action: varchar("action", { length: 160 }).notNull(),
    targetType: varchar("target_type", { length: 80 }).notNull(),
    targetId: varchar("target_id", { length: 255 }).notNull(),
    requestId: varchar("request_id", { length: 160 }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    occurredAt: timestampWithTimezone("occurred_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_events_target_idx").on(table.targetType, table.targetId, table.occurredAt),
    index("audit_events_actor_user_idx").on(table.actorUserId, table.occurredAt),
    index("audit_events_actor_action_occurred_idx").on(
      table.actorUserId,
      table.action,
      table.occurredAt,
    ),
    index("audit_events_action_occurred_idx").on(table.action, table.occurredAt),
    index("audit_events_request_id_idx").on(table.requestId),
    check("audit_events_action_check", sql`length(btrim(${table.action})) > 0`),
    check("audit_events_target_type_check", sql`length(btrim(${table.targetType})) > 0`),
    check("audit_events_target_id_check", sql`length(btrim(${table.targetId})) > 0`),
    check("audit_events_metadata_check", sql`jsonb_typeof(${table.metadata}) = 'object'`),
    check(
      "audit_events_actor_check",
      sql`(${table.actorKind} = 'user' AND ${table.actorUserId} IS NOT NULL AND ${table.actorKey} IS NULL) OR (${table.actorKind} IN ('service', 'system') AND ${table.actorUserId} IS NULL AND ${table.actorKey} IS NOT NULL)`,
    ),
  ],
);

export const producerChangeRequestAuditEvents = pgView(
  "producer_change_request_audit_events",
).as((query) =>
  query
    .select({
      id: auditEvents.id,
      actorKind: auditEvents.actorKind,
      actorUserId: auditEvents.actorUserId,
      actorKey: auditEvents.actorKey,
      action: auditEvents.action,
      targetType: auditEvents.targetType,
      targetId: auditEvents.targetId,
      metadata: auditEvents.metadata,
      occurredAt: auditEvents.occurredAt,
    })
    .from(auditEvents)
    .where(sql`${auditEvents.targetType} = 'producer_change_request'`),
);

export const webhookReceipts = pgTable(
  "webhook_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: varchar("provider", { length: 64 }).notNull(),
    eventId: varchar("event_id", { length: 255 }).notNull(),
    eventType: varchar("event_type", { length: 160 }).notNull(),
    subject: varchar("subject", { length: 255 }),
    eventOccurredAt: timestampWithTimezone("event_occurred_at"),
    payloadHash: varchar("payload_hash", { length: 64 }).notNull(),
    status: webhookReceiptStatus("status").notNull().default("received"),
    attempts: integer("attempts").notNull().default(0),
    errorMessage: text("error_message"),
    receivedAt: timestampWithTimezone("received_at").notNull().defaultNow(),
    processingStartedAt: timestampWithTimezone("processing_started_at"),
    processingToken: uuid("processing_token"),
    processedAt: timestampWithTimezone("processed_at"),
  },
  (table) => [
    uniqueIndex("webhook_receipts_provider_event_uidx").on(table.provider, table.eventId),
    index("webhook_receipts_processing_idx").on(table.status, table.processingStartedAt),
    index("webhook_receipts_subject_order_idx")
      .on(table.provider, table.subject, table.eventOccurredAt)
      .where(sql`${table.subject} IS NOT NULL`),
    check("webhook_receipts_provider_check", sql`length(btrim(${table.provider})) > 0`),
    check("webhook_receipts_event_id_check", sql`length(btrim(${table.eventId})) > 0`),
    check("webhook_receipts_payload_hash_check", sql`${table.payloadHash} ~ '^[0-9a-f]{64}$'`),
    check("webhook_receipts_attempts_check", sql`${table.attempts} >= 0`),
    check(
      "webhook_receipts_processed_check",
      sql`(${table.status}::text = 'processing' AND ${table.processingStartedAt} IS NOT NULL AND ${table.processingToken} IS NOT NULL AND ${table.processedAt} IS NULL) OR (${table.status}::text = 'processed' AND ${table.processingStartedAt} IS NULL AND ${table.processingToken} IS NULL AND ${table.processedAt} IS NOT NULL) OR (${table.status}::text IN ('received', 'failed') AND ${table.processingStartedAt} IS NULL AND ${table.processingToken} IS NULL AND ${table.processedAt} IS NULL)`,
    ),
  ],
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectKind: entitlementSubjectKind("subject_kind").notNull(),
    userId: uuid("user_id").references(() => users.id),
    producerCountry: varchar("producer_country", { length: 2 }),
    producerId: bigint("producer_id", { mode: "number" }),
    key: varchar("key", { length: 120 }).notNull(),
    status: entitlementStatus("status").notNull().default("active"),
    source: varchar("source", { length: 80 }).notNull(),
    sourceReference: varchar("source_reference", { length: 255 }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    startsAt: timestampWithTimezone("starts_at").notNull().defaultNow(),
    expiresAt: timestampWithTimezone("expires_at"),
    revokedAt: timestampWithTimezone("revoked_at"),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("entitlements_active_user_key_uidx")
      .on(table.userId, table.key)
      .where(sql`${table.subjectKind} = 'user' AND ${table.status} = 'active'`),
    uniqueIndex("entitlements_active_producer_key_uidx")
      .on(table.producerCountry, table.producerId, table.key)
      .where(sql`${table.subjectKind} = 'producer' AND ${table.status} = 'active'`),
    index("entitlements_user_idx").on(table.userId, table.status),
    index("entitlements_producer_idx").on(
      table.producerCountry,
      table.producerId,
      table.status,
    ),
    check("entitlements_key_check", sql`length(btrim(${table.key})) > 0`),
    check("entitlements_source_check", sql`length(btrim(${table.source})) > 0`),
    check("entitlements_metadata_check", sql`jsonb_typeof(${table.metadata}) = 'object'`),
    check(
      "entitlements_subject_check",
      sql`(${table.subjectKind} = 'user' AND ${table.userId} IS NOT NULL AND ${table.producerCountry} IS NULL AND ${table.producerId} IS NULL) OR (${table.subjectKind} = 'producer' AND ${table.userId} IS NULL AND ${table.producerCountry} IS NOT NULL AND ${table.producerId} IS NOT NULL)`,
    ),
    check(
      "entitlements_producer_country_check",
      sql`${table.producerCountry} IS NULL OR ${table.producerCountry} ~ '^[a-z]{2}$'`,
    ),
    check(
      "entitlements_producer_id_check",
      sql`${table.producerId} IS NULL OR ${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check(
      "entitlements_expiry_check",
      sql`${table.expiresAt} IS NULL OR ${table.expiresAt} > ${table.startsAt}`,
    ),
    check(
      "entitlements_revocation_check",
      sql`(${table.status} = 'revoked' AND ${table.revokedAt} IS NOT NULL) OR (${table.status} <> 'revoked' AND ${table.revokedAt} IS NULL)`,
    ),
  ],
);

export const producerProfileUpgradeRequests = pgTable(
  "producer_profile_upgrade_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    requesterUserId: uuid("requester_user_id")
      .notNull()
      .references(() => users.id),
    country: varchar("country", { length: 2 }).notNull(),
    producerId: bigint("producer_id", { mode: "number" }).notNull(),
    status: producerProfileUpgradeStatus("status").notNull().default("pending"),
    amountMinor: integer("amount_minor").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    termsVersion: varchar("terms_version", { length: 80 }).notNull(),
    termsUrl: varchar("terms_url", { length: 2048 }).notNull(),
    termsAcceptedAt: timestampWithTimezone("terms_accepted_at").notNull(),
    paymentProvider: varchar("payment_provider", { length: 32 }).notNull(),
    providerOfferId: varchar("provider_offer_id", { length: 255 }).notNull(),
    providerCheckoutId: varchar("provider_checkout_id", { length: 255 }),
    providerPaymentId: varchar("provider_payment_id", { length: 255 }),
    providerChargeId: varchar("provider_charge_id", { length: 255 }),
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),
    providerDisputeId: varchar("provider_dispute_id", { length: 255 }),
    providerDisputeStatus: varchar("provider_dispute_status", { length: 64 }),
    amountCapturedMinor: integer("amount_captured_minor"),
    capturedCurrency: varchar("captured_currency", { length: 3 }),
    amountRefundedMinor: integer("amount_refunded_minor").notNull().default(0),
    entitlementId: uuid("entitlement_id").references(() => entitlements.id),
    checkoutExpiresAt: timestampWithTimezone("checkout_expires_at"),
    paidAt: timestampWithTimezone("paid_at"),
    refundedAt: timestampWithTimezone("refunded_at"),
    disputedAt: timestampWithTimezone("disputed_at"),
    failureCode: varchar("failure_code", { length: 80 }),
    createdAt: timestampWithTimezone("created_at").notNull().defaultNow(),
    updatedAt: timestampWithTimezone("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("producer_profile_upgrade_requests_active_producer_uidx")
      .on(table.country, table.producerId)
      .where(
        sql`${table.status} IN ('pending', 'paid', 'paid_unfulfilled', 'partially_refunded', 'disputed')`,
      ),
    uniqueIndex("producer_profile_upgrade_requests_checkout_uidx")
      .on(table.paymentProvider, table.providerCheckoutId)
      .where(sql`${table.providerCheckoutId} IS NOT NULL`),
    uniqueIndex("producer_profile_upgrade_requests_payment_uidx")
      .on(table.paymentProvider, table.providerPaymentId)
      .where(sql`${table.providerPaymentId} IS NOT NULL`),
    uniqueIndex("producer_profile_upgrade_requests_charge_uidx")
      .on(table.paymentProvider, table.providerChargeId)
      .where(sql`${table.providerChargeId} IS NOT NULL`),
    uniqueIndex("producer_profile_upgrade_requests_dispute_uidx")
      .on(table.paymentProvider, table.providerDisputeId)
      .where(sql`${table.providerDisputeId} IS NOT NULL`),
    uniqueIndex("producer_profile_upgrade_requests_entitlement_uidx")
      .on(table.entitlementId)
      .where(sql`${table.entitlementId} IS NOT NULL`),
    index("producer_profile_upgrade_requests_requester_idx").on(
      table.requesterUserId,
      table.createdAt,
    ),
    index("producer_profile_upgrade_requests_producer_idx").on(
      table.country,
      table.producerId,
      table.createdAt,
    ),
    index("producer_profile_upgrade_requests_incident_idx").on(
      table.paymentProvider,
      table.status,
      table.updatedAt,
    ),
    check("producer_profile_upgrade_requests_country_check", sql`${table.country} ~ '^[a-z]{2}$'`),
    check(
      "producer_profile_upgrade_requests_producer_id_check",
      sql`${table.producerId} BETWEEN 1 AND 9007199254740991`,
    ),
    check("producer_profile_upgrade_requests_amount_check", sql`${table.amountMinor} = 4900`),
    check("producer_profile_upgrade_requests_currency_check", sql`${table.currency} = 'eur'`),
    check(
      "producer_profile_upgrade_requests_terms_check",
      sql`length(btrim(${table.termsVersion})) > 0 AND length(btrim(${table.termsUrl})) > 0`,
    ),
    check(
      "producer_profile_upgrade_requests_provider_check",
      sql`${table.paymentProvider} ~ '^[a-z][a-z0-9_-]{0,31}$'`,
    ),
    check(
      "producer_profile_upgrade_requests_offer_check",
      sql`length(btrim(${table.providerOfferId})) > 0`,
    ),
    check(
      "producer_profile_upgrade_requests_checkout_check",
      sql`(${table.providerCheckoutId} IS NULL AND ${table.checkoutExpiresAt} IS NULL) OR (${table.providerCheckoutId} IS NOT NULL AND ${table.checkoutExpiresAt} IS NOT NULL)`,
    ),
    check(
      "producer_profile_upgrade_requests_payment_check",
      sql`(${table.status} IN ('pending', 'payment_failed', 'expired') AND ${table.paidAt} IS NULL AND ${table.amountCapturedMinor} IS NULL AND ${table.capturedCurrency} IS NULL) OR (${table.status} = 'paid_unfulfilled' AND ${table.paidAt} IS NOT NULL) OR (${table.status} IN ('paid', 'partially_refunded', 'refunded', 'disputed', 'dispute_lost') AND ${table.providerPaymentId} IS NOT NULL AND ${table.paidAt} IS NOT NULL AND ${table.amountCapturedMinor} IS NOT NULL AND ${table.capturedCurrency} IS NOT NULL)`,
    ),
    check(
      "producer_profile_upgrade_requests_captured_amount_check",
      sql`(${table.amountCapturedMinor} IS NULL AND ${table.capturedCurrency} IS NULL) OR (${table.amountCapturedMinor} > 0 AND ${table.capturedCurrency} ~ '^[a-z]{3}$')`,
    ),
    check(
      "producer_profile_upgrade_requests_refund_amount_check",
      sql`${table.amountRefundedMinor} BETWEEN 0 AND COALESCE(${table.amountCapturedMinor}, ${table.amountMinor})`,
    ),
    check(
      "producer_profile_upgrade_requests_refund_check",
      sql`((${table.amountRefundedMinor} = 0 AND ${table.refundedAt} IS NULL) OR (${table.amountRefundedMinor} > 0 AND ${table.refundedAt} IS NOT NULL AND ${table.amountCapturedMinor} IS NOT NULL)) AND (${table.status} NOT IN ('pending', 'payment_failed', 'expired', 'paid') OR ${table.amountRefundedMinor} = 0) AND (${table.status} <> 'partially_refunded' OR (${table.amountRefundedMinor} > 0 AND ${table.amountRefundedMinor} < ${table.amountCapturedMinor})) AND (${table.status} <> 'refunded' OR ${table.amountRefundedMinor} = ${table.amountCapturedMinor})`,
    ),
    check(
      "producer_profile_upgrade_requests_dispute_check",
      sql`(${table.providerDisputeId} IS NULL AND ${table.providerDisputeStatus} IS NULL AND ${table.disputedAt} IS NULL) OR (${table.providerDisputeId} IS NOT NULL AND ${table.providerDisputeStatus} IS NOT NULL AND ${table.disputedAt} IS NOT NULL)`,
    ),
    check(
      "producer_profile_upgrade_requests_entitlement_check",
      sql`(${table.status} = 'paid' AND ${table.entitlementId} IS NOT NULL) OR (${table.status} IN ('pending', 'payment_failed', 'expired') AND ${table.entitlementId} IS NULL) OR (${table.status} IN ('paid_unfulfilled', 'partially_refunded', 'refunded', 'disputed', 'dispute_lost'))`,
    ),
    check(
      "producer_profile_upgrade_requests_failure_check",
      sql`(${table.status} IN ('paid_unfulfilled', 'payment_failed') AND ${table.failureCode} IS NOT NULL) OR (${table.status} NOT IN ('paid_unfulfilled', 'payment_failed') AND ${table.failureCode} IS NULL)`,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type ProducerClaim = typeof producerClaims.$inferSelect;
export type ProducerMembership = typeof producerMemberships.$inferSelect;
export type ProducerChangeRequest = typeof producerChangeRequests.$inferSelect;
export type ProducerChangeExecution = typeof producerChangeExecutions.$inferSelect;
export type Entitlement = typeof entitlements.$inferSelect;
export type ProducerProfileUpgradeRequest =
  typeof producerProfileUpgradeRequests.$inferSelect;
