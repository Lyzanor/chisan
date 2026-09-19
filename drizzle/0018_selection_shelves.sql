CREATE TABLE "selection_shelf_whatsapp_links" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"sender" varchar(15),
	"token_hash" varchar(64),
	"token_expires_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"rights_confirmed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "selection_shelf_whatsapp_links_sender_unique" UNIQUE("sender"),
	CONSTRAINT "selection_shelf_whatsapp_links_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "selection_shelf_whatsapp_sender_check" CHECK ("selection_shelf_whatsapp_links"."sender" is null or "selection_shelf_whatsapp_links"."sender" ~ '^[1-9][0-9]{6,14}$')
);
--> statement-breakpoint
CREATE TABLE "selection_shelves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"channel" varchar(32) NOT NULL,
	"message_id" varchar(256),
	"sha256" varchar(64) NOT NULL,
	"bytes" "bytea" NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"status" varchar(16) DEFAULT 'queued' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"suggestions" jsonb DEFAULT '{"points":[]}'::jsonb NOT NULL,
	"points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"analysis_error" varchar(40),
	"analysis_started_at" timestamp with time zone,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"note" text DEFAULT '' NOT NULL,
	"rights_confirmed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "selection_shelves_message_id_unique" UNIQUE("message_id"),
	CONSTRAINT "selection_shelves_status_check" CHECK ("selection_shelves"."status" in ('queued','processing','review','published','rejected','superseded')),
	CONSTRAINT "selection_shelves_channel_check" CHECK ("selection_shelves"."channel" ~ '^[a-z][a-z0-9_-]{0,31}$'),
	CONSTRAINT "selection_shelves_version_check" CHECK ("selection_shelves"."version" > 0),
	CONSTRAINT "selection_shelves_image_check" CHECK ("selection_shelves"."width" between 200 and 2400 and "selection_shelves"."height" between 200 and 2400 and octet_length("selection_shelves"."bytes") between 1 and 1572864 and "selection_shelves"."sha256" = encode(sha256("selection_shelves"."bytes"), 'hex')),
	CONSTRAINT "selection_shelves_points_check" CHECK (jsonb_typeof("selection_shelves"."points") = 'array' and jsonb_array_length("selection_shelves"."points") <= 80),
	CONSTRAINT "selection_shelves_review_check" CHECK ("selection_shelves"."status" <> 'published' or ("selection_shelves"."reviewed_by" is not null and "selection_shelves"."reviewed_at" is not null and jsonb_array_length("selection_shelves"."points") > 0))
);
--> statement-breakpoint
ALTER TABLE "selection_shelf_whatsapp_links" ADD CONSTRAINT "selection_shelf_whatsapp_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD CONSTRAINT "selection_shelves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selection_shelves" ADD CONSTRAINT "selection_shelves_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "selection_shelves_published_idx" ON "selection_shelves" USING btree ("user_id") WHERE "selection_shelves"."status" = 'published';--> statement-breakpoint
CREATE UNIQUE INDEX "selection_shelves_pending_idx" ON "selection_shelves" USING btree ("user_id") WHERE "selection_shelves"."status" in ('queued','processing','review');--> statement-breakpoint
CREATE INDEX "selection_shelves_queue_idx" ON "selection_shelves" USING btree ("status","created_at");
--> statement-breakpoint
REVOKE ALL ON "selection_shelves", "selection_shelf_whatsapp_links" FROM PUBLIC;
--> statement-breakpoint
CREATE FUNCTION protect_selection_shelf_image() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.bytes IS DISTINCT FROM OLD.bytes
    OR NEW.sha256 IS DISTINCT FROM OLD.sha256 OR NEW.width IS DISTINCT FROM OLD.width
    OR NEW.height IS DISTINCT FROM OLD.height OR NEW.channel IS DISTINCT FROM OLD.channel
    OR NEW.message_id IS DISTINCT FROM OLD.message_id OR NEW.rights_confirmed_at IS DISTINCT FROM OLD.rights_confirmed_at THEN
    RAISE EXCEPTION 'Shelf images and their ownership are immutable; submit a replacement';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER selection_shelf_image_immutable BEFORE UPDATE ON selection_shelves
FOR EACH ROW EXECUTE FUNCTION protect_selection_shelf_image();
