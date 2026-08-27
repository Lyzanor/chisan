CREATE TYPE "public"."public_profile_visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
ALTER TABLE "favorites" ADD COLUMN "show_on_public_profile" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "public_handle" varchar(40);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "public_profile_visibility" "public_profile_visibility" DEFAULT 'private' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_public_handle_uidx" ON "users" USING btree ("public_handle");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_handle_format_check" CHECK ("users"."public_handle" IS NULL OR "users"."public_handle" ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_handle_check" CHECK ("users"."public_profile_visibility" = 'private' OR "users"."public_handle" IS NOT NULL);