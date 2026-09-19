ALTER TABLE "selection_shelves" DROP CONSTRAINT "selection_shelves_status_check";--> statement-breakpoint
DROP INDEX "selection_shelves_pending_idx";--> statement-breakpoint
ALTER TABLE "selection_shelves" ALTER COLUMN "status" SET DEFAULT 'queued';--> statement-breakpoint
CREATE UNIQUE INDEX "selection_shelves_pending_idx" ON "selection_shelves" USING btree ("user_id") WHERE "selection_shelves"."status" in ('received','queued','processing','review','ready');--> statement-breakpoint
ALTER TABLE "favorites" DROP COLUMN "show_on_public_profile";--> statement-breakpoint
ALTER TABLE "user_presentation" DROP COLUMN "favorites_attribution_enabled";--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD CONSTRAINT "selection_shelves_status_check" CHECK ("selection_shelves"."status" in ('received','queued','processing','review','ready','published','rejected','superseded'));
--> statement-breakpoint
-- Preserve old drafts for manual review, fencing in-flight results without
-- spending the shared AI allowance on photos submitted under the older flow.
UPDATE "selection_shelves"
SET "status" = 'review', "version" = "version" + 1,
    "analysis_started_at" = NULL, "updated_at" = now()
WHERE "status" IN ('received', 'queued', 'processing', 'review');
