ALTER TABLE "selection_shelves" DROP CONSTRAINT "selection_shelves_status_check";--> statement-breakpoint
DROP INDEX "selection_shelves_pending_idx";--> statement-breakpoint
ALTER TABLE "selection_shelves" ALTER COLUMN "status" SET DEFAULT 'received';--> statement-breakpoint
CREATE UNIQUE INDEX "selection_shelves_pending_idx" ON "selection_shelves" USING btree ("user_id") WHERE "selection_shelves"."status" in ('received','queued','processing','review');--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD CONSTRAINT "selection_shelves_status_check" CHECK ("selection_shelves"."status" in ('received','queued','processing','review','published','rejected','superseded'));
--> statement-breakpoint
-- Earlier pending photos were queued without staff admission. Fence off old
-- workers and require admission while retaining any existing review points.
UPDATE "selection_shelves"
SET "status" = 'received', "version" = "version" + 1,
    "analysis_started_at" = NULL, "updated_at" = now()
WHERE "status" IN ('queued', 'processing', 'review');
