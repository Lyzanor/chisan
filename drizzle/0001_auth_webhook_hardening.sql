ALTER TYPE "public"."webhook_receipt_status" ADD VALUE 'processing' BEFORE 'processed';--> statement-breakpoint
CREATE TABLE "auth_identity_tombstones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(64) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"provider_deleted_at" timestamp with time zone NOT NULL,
	"provider_event_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_identity_tombstones_provider_check" CHECK (length(btrim("auth_identity_tombstones"."provider")) > 0),
	CONSTRAINT "auth_identity_tombstones_subject_check" CHECK (length(btrim("auth_identity_tombstones"."subject")) > 0),
	CONSTRAINT "auth_identity_tombstones_event_id_check" CHECK (length(btrim("auth_identity_tombstones"."provider_event_id")) > 0)
);
--> statement-breakpoint
ALTER TABLE "webhook_receipts" DROP CONSTRAINT "webhook_receipts_processed_check";--> statement-breakpoint
DROP INDEX "webhook_receipts_processing_idx";--> statement-breakpoint
ALTER TABLE "auth_identities" ADD COLUMN "provider_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "auth_identities" ADD COLUMN "provider_event_id" varchar(255);--> statement-breakpoint
ALTER TABLE "webhook_receipts" ADD COLUMN "subject" varchar(255);--> statement-breakpoint
ALTER TABLE "webhook_receipts" ADD COLUMN "event_occurred_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "webhook_receipts" ADD COLUMN "processing_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "webhook_receipts" ADD COLUMN "processing_token" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_identity_tombstones_provider_subject_uidx" ON "auth_identity_tombstones" USING btree ("provider","subject");--> statement-breakpoint
CREATE INDEX "audit_events_actor_action_occurred_idx" ON "audit_events" USING btree ("actor_user_id","action","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "producer_memberships_active_owner_producer_uidx" ON "producer_memberships" USING btree ("country","producer_id") WHERE "producer_memberships"."status" = 'active' AND "producer_memberships"."role" = 'owner';--> statement-breakpoint
CREATE INDEX "webhook_receipts_subject_order_idx" ON "webhook_receipts" USING btree ("provider","subject","event_occurred_at") WHERE "webhook_receipts"."subject" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "webhook_receipts_processing_idx" ON "webhook_receipts" USING btree ("status","processing_started_at");--> statement-breakpoint
ALTER TABLE "webhook_receipts" ADD CONSTRAINT "webhook_receipts_processed_check" CHECK (("webhook_receipts"."status"::text = 'processing' AND "webhook_receipts"."processing_started_at" IS NOT NULL AND "webhook_receipts"."processing_token" IS NOT NULL AND "webhook_receipts"."processed_at" IS NULL) OR ("webhook_receipts"."status"::text = 'processed' AND "webhook_receipts"."processing_started_at" IS NULL AND "webhook_receipts"."processing_token" IS NULL AND "webhook_receipts"."processed_at" IS NOT NULL) OR ("webhook_receipts"."status"::text IN ('received', 'failed') AND "webhook_receipts"."processing_started_at" IS NULL AND "webhook_receipts"."processing_token" IS NULL AND "webhook_receipts"."processed_at" IS NULL));