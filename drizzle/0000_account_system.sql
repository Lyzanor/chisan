CREATE TYPE "public"."audit_actor_kind" AS ENUM('user', 'service', 'system');--> statement-breakpoint
CREATE TYPE "public"."entitlement_status" AS ENUM('active', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."entitlement_subject_kind" AS ENUM('user', 'producer');--> statement-breakpoint
CREATE TYPE "public"."producer_change_request_status" AS ENUM('draft', 'submitted', 'needs_changes', 'approved', 'applying', 'applied', 'rejected', 'withdrawn', 'conflict', 'failed');--> statement-breakpoint
CREATE TYPE "public"."producer_claim_status" AS ENUM('draft', 'pending', 'needs_info', 'approved', 'rejected', 'withdrawn', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."producer_membership_role" AS ENUM('owner', 'editor');--> statement-breakpoint
CREATE TYPE "public"."producer_membership_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('reviewer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_profile_kind" AS ENUM('user', 'producer');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."webhook_receipt_status" AS ENUM('received', 'processed', 'failed');--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_kind" "audit_actor_kind" NOT NULL,
	"actor_user_id" uuid,
	"actor_key" varchar(160),
	"action" varchar(160) NOT NULL,
	"target_type" varchar(80) NOT NULL,
	"target_id" varchar(255) NOT NULL,
	"request_id" varchar(160),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "audit_events_action_check" CHECK (length(btrim("audit_events"."action")) > 0),
	CONSTRAINT "audit_events_target_type_check" CHECK (length(btrim("audit_events"."target_type")) > 0),
	CONSTRAINT "audit_events_target_id_check" CHECK (length(btrim("audit_events"."target_id")) > 0),
	CONSTRAINT "audit_events_metadata_check" CHECK (jsonb_typeof("audit_events"."metadata") = 'object'),
	CONSTRAINT "audit_events_actor_check" CHECK (("audit_events"."actor_kind" = 'user' AND "audit_events"."actor_user_id" IS NOT NULL AND "audit_events"."actor_key" IS NULL) OR ("audit_events"."actor_kind" IN ('service', 'system') AND "audit_events"."actor_user_id" IS NULL AND "audit_events"."actor_key" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "auth_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(64) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"email" varchar(320),
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "auth_identities_provider_check" CHECK (length(btrim("auth_identities"."provider")) > 0),
	CONSTRAINT "auth_identities_subject_check" CHECK (length(btrim("auth_identities"."subject")) > 0)
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_kind" "entitlement_subject_kind" NOT NULL,
	"user_id" uuid,
	"producer_country" varchar(2),
	"producer_id" bigint,
	"key" varchar(120) NOT NULL,
	"status" "entitlement_status" DEFAULT 'active' NOT NULL,
	"source" varchar(80) NOT NULL,
	"source_reference" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entitlements_key_check" CHECK (length(btrim("entitlements"."key")) > 0),
	CONSTRAINT "entitlements_source_check" CHECK (length(btrim("entitlements"."source")) > 0),
	CONSTRAINT "entitlements_metadata_check" CHECK (jsonb_typeof("entitlements"."metadata") = 'object'),
	CONSTRAINT "entitlements_subject_check" CHECK (("entitlements"."subject_kind" = 'user' AND "entitlements"."user_id" IS NOT NULL AND "entitlements"."producer_country" IS NULL AND "entitlements"."producer_id" IS NULL) OR ("entitlements"."subject_kind" = 'producer' AND "entitlements"."user_id" IS NULL AND "entitlements"."producer_country" IS NOT NULL AND "entitlements"."producer_id" IS NOT NULL)),
	CONSTRAINT "entitlements_producer_country_check" CHECK ("entitlements"."producer_country" IS NULL OR "entitlements"."producer_country" ~ '^[a-z]{2}$'),
	CONSTRAINT "entitlements_producer_id_check" CHECK ("entitlements"."producer_id" IS NULL OR "entitlements"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "entitlements_expiry_check" CHECK ("entitlements"."expires_at" IS NULL OR "entitlements"."expires_at" > "entitlements"."starts_at"),
	CONSTRAINT "entitlements_revocation_check" CHECK (("entitlements"."status" = 'revoked' AND "entitlements"."revoked_at" IS NOT NULL) OR ("entitlements"."status" <> 'revoked' AND "entitlements"."revoked_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_country_producer_id_pk" PRIMARY KEY("user_id","country","producer_id"),
	CONSTRAINT "favorites_country_check" CHECK ("favorites"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "favorites_producer_id_check" CHECK ("favorites"."producer_id" BETWEEN 1 AND 9007199254740991)
);
--> statement-breakpoint
CREATE TABLE "producer_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"status" "producer_change_request_status" DEFAULT 'draft' NOT NULL,
	"base_row_hash" varchar(64) NOT NULL,
	"base_snapshot" jsonb NOT NULL,
	"patch" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"author_note" text,
	"lock_version" integer DEFAULT 1 NOT NULL,
	"reviewer_user_id" uuid,
	"decision_note" text,
	"failure_reason" text,
	"applied_commit_sha" varchar(64),
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_change_requests_country_check" CHECK ("producer_change_requests"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "producer_change_requests_producer_id_check" CHECK ("producer_change_requests"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_change_requests_base_hash_check" CHECK ("producer_change_requests"."base_row_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "producer_change_requests_snapshot_check" CHECK (jsonb_typeof("producer_change_requests"."base_snapshot") = 'object'),
	CONSTRAINT "producer_change_requests_patch_check" CHECK (jsonb_typeof("producer_change_requests"."patch") = 'object'),
	CONSTRAINT "producer_change_requests_lock_version_check" CHECK ("producer_change_requests"."lock_version" > 0),
	CONSTRAINT "producer_change_requests_submission_check" CHECK ("producer_change_requests"."status" = 'draft' OR ("producer_change_requests"."submitted_at" IS NOT NULL AND "producer_change_requests"."patch" <> '{}'::jsonb)),
	CONSTRAINT "producer_change_requests_review_check" CHECK ("producer_change_requests"."status" NOT IN ('needs_changes', 'approved', 'rejected', 'applying', 'applied') OR ("producer_change_requests"."reviewer_user_id" IS NOT NULL AND "producer_change_requests"."reviewed_at" IS NOT NULL)),
	CONSTRAINT "producer_change_requests_applied_check" CHECK (("producer_change_requests"."status" = 'applied' AND "producer_change_requests"."applied_at" IS NOT NULL AND "producer_change_requests"."applied_commit_sha" IS NOT NULL) OR ("producer_change_requests"."status" <> 'applied' AND "producer_change_requests"."applied_at" IS NULL)),
	CONSTRAINT "producer_change_requests_commit_sha_check" CHECK ("producer_change_requests"."applied_commit_sha" IS NULL OR "producer_change_requests"."applied_commit_sha" ~ '^([0-9a-f]{40}|[0-9a-f]{64})$')
);
--> statement-breakpoint
CREATE TABLE "producer_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claimant_user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"status" "producer_claim_status" DEFAULT 'draft' NOT NULL,
	"proof_method" varchar(64),
	"proof" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"claimant_message" text,
	"reviewer_user_id" uuid,
	"decision_reason" text,
	"lock_version" integer DEFAULT 1 NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_claims_country_check" CHECK ("producer_claims"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "producer_claims_producer_id_check" CHECK ("producer_claims"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_claims_proof_check" CHECK (jsonb_typeof("producer_claims"."proof") = 'object'),
	CONSTRAINT "producer_claims_lock_version_check" CHECK ("producer_claims"."lock_version" > 0),
	CONSTRAINT "producer_claims_submission_check" CHECK ("producer_claims"."status" = 'draft' OR "producer_claims"."submitted_at" IS NOT NULL),
	CONSTRAINT "producer_claims_review_check" CHECK ("producer_claims"."status" NOT IN ('approved', 'rejected') OR ("producer_claims"."reviewer_user_id" IS NOT NULL AND "producer_claims"."reviewed_at" IS NOT NULL)),
	CONSTRAINT "producer_claims_revocation_check" CHECK (("producer_claims"."status" = 'revoked' AND "producer_claims"."revoked_at" IS NOT NULL) OR ("producer_claims"."status" <> 'revoked' AND "producer_claims"."revoked_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "producer_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"role" "producer_membership_role" NOT NULL,
	"status" "producer_membership_status" DEFAULT 'active' NOT NULL,
	"source_claim_id" uuid,
	"granted_by_user_id" uuid,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by_user_id" uuid,
	"revocation_reason" text,
	CONSTRAINT "producer_memberships_country_check" CHECK ("producer_memberships"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "producer_memberships_producer_id_check" CHECK ("producer_memberships"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_memberships_revocation_check" CHECK (("producer_memberships"."status" = 'active' AND "producer_memberships"."revoked_at" IS NULL AND "producer_memberships"."revoked_by_user_id" IS NULL) OR ("producer_memberships"."status" = 'revoked' AND "producer_memberships"."revoked_at" IS NOT NULL AND "producer_memberships"."revoked_by_user_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "staff_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "staff_role" NOT NULL,
	"granted_by_user_id" uuid,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"revoked_by_user_id" uuid,
	"reason" text,
	CONSTRAINT "staff_grants_expiry_check" CHECK ("staff_grants"."expires_at" IS NULL OR "staff_grants"."expires_at" > "staff_grants"."granted_at"),
	CONSTRAINT "staff_grants_revocation_check" CHECK (("staff_grants"."revoked_at" IS NULL AND "staff_grants"."revoked_by_user_id" IS NULL) OR ("staff_grants"."revoked_at" IS NOT NULL AND "staff_grants"."revoked_by_user_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"display_name" varchar(160),
	"locale" varchar(16),
	"profile_kind" "user_profile_kind" DEFAULT 'user' NOT NULL,
	"terms_accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_deleted_state_check" CHECK (("users"."status" = 'deleted' AND "users"."deleted_at" IS NOT NULL) OR ("users"."status" <> 'deleted' AND "users"."deleted_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "webhook_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(64) NOT NULL,
	"event_id" varchar(255) NOT NULL,
	"event_type" varchar(160) NOT NULL,
	"payload_hash" varchar(64) NOT NULL,
	"status" "webhook_receipt_status" DEFAULT 'received' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	CONSTRAINT "webhook_receipts_provider_check" CHECK (length(btrim("webhook_receipts"."provider")) > 0),
	CONSTRAINT "webhook_receipts_event_id_check" CHECK (length(btrim("webhook_receipts"."event_id")) > 0),
	CONSTRAINT "webhook_receipts_payload_hash_check" CHECK ("webhook_receipts"."payload_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "webhook_receipts_attempts_check" CHECK ("webhook_receipts"."attempts" >= 0),
	CONSTRAINT "webhook_receipts_processed_check" CHECK ("webhook_receipts"."status" <> 'processed' OR "webhook_receipts"."processed_at" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_claims" ADD CONSTRAINT "producer_claims_claimant_user_id_users_id_fk" FOREIGN KEY ("claimant_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_claims" ADD CONSTRAINT "producer_claims_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_memberships" ADD CONSTRAINT "producer_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_memberships" ADD CONSTRAINT "producer_memberships_source_claim_id_producer_claims_id_fk" FOREIGN KEY ("source_claim_id") REFERENCES "public"."producer_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_memberships" ADD CONSTRAINT "producer_memberships_granted_by_user_id_users_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_memberships" ADD CONSTRAINT "producer_memberships_revoked_by_user_id_users_id_fk" FOREIGN KEY ("revoked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_grants" ADD CONSTRAINT "staff_grants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_grants" ADD CONSTRAINT "staff_grants_granted_by_user_id_users_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_grants" ADD CONSTRAINT "staff_grants_revoked_by_user_id_users_id_fk" FOREIGN KEY ("revoked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_target_idx" ON "audit_events" USING btree ("target_type","target_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_events_actor_user_idx" ON "audit_events" USING btree ("actor_user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_events_request_id_idx" ON "audit_events" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_identities_provider_subject_uidx" ON "auth_identities" USING btree ("provider","subject");--> statement-breakpoint
CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_active_user_key_uidx" ON "entitlements" USING btree ("user_id","key") WHERE "entitlements"."subject_kind" = 'user' AND "entitlements"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_active_producer_key_uidx" ON "entitlements" USING btree ("producer_country","producer_id","key") WHERE "entitlements"."subject_kind" = 'producer' AND "entitlements"."status" = 'active';--> statement-breakpoint
CREATE INDEX "entitlements_user_idx" ON "entitlements" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "entitlements_producer_idx" ON "entitlements" USING btree ("producer_country","producer_id","status");--> statement-breakpoint
CREATE INDEX "favorites_producer_idx" ON "favorites" USING btree ("country","producer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "producer_change_requests_open_author_producer_uidx" ON "producer_change_requests" USING btree ("author_user_id","country","producer_id") WHERE "producer_change_requests"."status" IN ('draft', 'submitted', 'needs_changes', 'approved', 'applying');--> statement-breakpoint
CREATE INDEX "producer_change_requests_review_queue_idx" ON "producer_change_requests" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "producer_change_requests_producer_idx" ON "producer_change_requests" USING btree ("country","producer_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "producer_claims_open_claimant_producer_uidx" ON "producer_claims" USING btree ("claimant_user_id","country","producer_id") WHERE "producer_claims"."status" IN ('draft', 'pending', 'needs_info', 'approved');--> statement-breakpoint
CREATE INDEX "producer_claims_review_queue_idx" ON "producer_claims" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "producer_claims_producer_idx" ON "producer_claims" USING btree ("country","producer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "producer_memberships_active_user_producer_uidx" ON "producer_memberships" USING btree ("user_id","country","producer_id") WHERE "producer_memberships"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "producer_memberships_source_claim_uidx" ON "producer_memberships" USING btree ("source_claim_id") WHERE "producer_memberships"."source_claim_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "producer_memberships_active_producer_idx" ON "producer_memberships" USING btree ("country","producer_id") WHERE "producer_memberships"."status" = 'active';--> statement-breakpoint
CREATE INDEX "producer_memberships_active_user_idx" ON "producer_memberships" USING btree ("user_id") WHERE "producer_memberships"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "staff_grants_active_user_role_uidx" ON "staff_grants" USING btree ("user_id","role") WHERE "staff_grants"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "staff_grants_active_user_idx" ON "staff_grants" USING btree ("user_id") WHERE "staff_grants"."revoked_at" IS NULL;--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_receipts_provider_event_uidx" ON "webhook_receipts" USING btree ("provider","event_id");--> statement-breakpoint
CREATE INDEX "webhook_receipts_processing_idx" ON "webhook_receipts" USING btree ("status","received_at");