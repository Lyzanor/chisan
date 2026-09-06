CREATE TABLE "user_presentation" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"avatar_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"avatar_bytes" "bytea",
	"avatar_initialized" boolean DEFAULT false NOT NULL,
	"favorites_attribution_enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_presentation_avatar_size_check" CHECK ("user_presentation"."avatar_bytes" IS NULL OR octet_length("user_presentation"."avatar_bytes") <= 131072)
);
--> statement-breakpoint
ALTER TABLE "user_presentation" ADD CONSTRAINT "user_presentation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_presentation_avatar_uidx" ON "user_presentation" USING btree ("avatar_id");