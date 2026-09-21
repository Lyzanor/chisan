CREATE TABLE "account_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"public_handle" varchar(40) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" varchar(600),
	"visibility" "public_profile_visibility" DEFAULT 'public' NOT NULL,
	"base_country" varchar(2),
	"base_area" varchar(160),
	"base_municipality" varchar(160),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_selections_public_handle_format_check" CHECK ("account_selections"."public_handle" ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$'),
	CONSTRAINT "account_selections_base_country_check" CHECK ("account_selections"."base_country" IS NULL OR "account_selections"."base_country" ~ '^[a-z]{2}$'),
	CONSTRAINT "account_selections_base_area_check" CHECK ("account_selections"."base_area" IS NULL OR "account_selections"."base_area" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD COLUMN "selection_id" uuid;--> statement-breakpoint
ALTER TABLE "account_selections" ADD CONSTRAINT "account_selections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_selections_public_handle_uidx" ON "account_selections" USING btree ("public_handle");--> statement-breakpoint
CREATE INDEX "account_selections_user_id_idx" ON "account_selections" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD CONSTRAINT "selection_shelves_selection_id_account_selections_id_fk" FOREIGN KEY ("selection_id") REFERENCES "public"."account_selections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "selection_shelves_selection_id_idx" ON "selection_shelves" USING btree ("selection_id");--> statement-breakpoint
DO $$
DECLARE
	r RECORD;
	new_selection_id UUID;
BEGIN
	FOR r IN
		SELECT s.id AS shelf_id, s.user_id, u.public_handle, u.selection_title, u.selection_description,
		       u.public_profile_visibility, u.public_profile_base_country, u.public_profile_base_area, u.public_profile_base_municipality
		FROM "selection_shelves" s
		JOIN "users" u ON u.id = s.user_id
		WHERE s.status = 'published' AND s.selection_id IS NULL
	LOOP
		INSERT INTO "account_selections" (
			user_id, public_handle, title, description, visibility,
			base_country, base_area, base_municipality
		) VALUES (
			r.user_id,
			COALESCE(r.public_handle, 'seleccion-' || substring(r.shelf_id::text from 1 for 8)),
			COALESCE(r.selection_title, 'Estantería'),
			r.selection_description,
			r.public_profile_visibility,
			r.public_profile_base_country,
			r.public_profile_base_area,
			r.public_profile_base_municipality
		)
		RETURNING id INTO new_selection_id;

		UPDATE "selection_shelves"
		SET selection_id = new_selection_id
		WHERE id = r.shelf_id;
	END LOOP;
END $$;