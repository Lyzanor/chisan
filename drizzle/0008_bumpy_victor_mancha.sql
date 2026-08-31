ALTER TABLE "users" ADD COLUMN "public_profile_base_country" varchar(2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "public_profile_base_area" varchar(160);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "public_profile_base_municipality" varchar(160);--> statement-breakpoint
UPDATE "users"
   SET "public_profile_base_country" = 'es',
       "public_profile_base_area" = 'barcelona',
       "public_profile_base_municipality" = 'Barcelona'
 WHERE "public_handle" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_base_location_check" CHECK (("users"."public_profile_base_country" IS NULL AND "users"."public_profile_base_area" IS NULL AND "users"."public_profile_base_municipality" IS NULL) OR ("users"."public_profile_base_country" IS NOT NULL AND "users"."public_profile_base_area" IS NOT NULL AND "users"."public_profile_base_municipality" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_base_country_check" CHECK ("users"."public_profile_base_country" IS NULL OR "users"."public_profile_base_country" ~ '^[a-z]{2}$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_base_area_check" CHECK ("users"."public_profile_base_area" IS NULL OR "users"."public_profile_base_area" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_base_municipality_check" CHECK ("users"."public_profile_base_municipality" IS NULL OR length(trim("users"."public_profile_base_municipality")) > 0);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_profile_location_required_check" CHECK ("users"."public_handle" IS NULL OR ("users"."public_profile_base_country" IS NOT NULL AND "users"."public_profile_base_area" IS NOT NULL AND "users"."public_profile_base_municipality" IS NOT NULL));
