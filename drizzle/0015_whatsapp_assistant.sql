CREATE TABLE "whatsapp_inbox" (
	"id" varchar(200) PRIMARY KEY NOT NULL,
	"sender" varchar(15) NOT NULL,
	"message" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"reply" text,
	"delivered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "whatsapp_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"sender" varchar(15),
	"token_hash" varchar(64),
	"token_expires_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"time_zone" varchar(40) NOT NULL,
	"state" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_links_token_hash_unique" UNIQUE("token_hash"),
	CONSTRAINT "whatsapp_links_identity_check" CHECK ("whatsapp_links"."country" = 'es' AND "whatsapp_links"."producer_id" > 0),
	CONSTRAINT "whatsapp_links_sender_check" CHECK ("whatsapp_links"."sender" IS NULL OR "whatsapp_links"."sender" ~ '^[1-9][0-9]{6,14}$'),
	CONSTRAINT "whatsapp_links_timezone_check" CHECK ("whatsapp_links"."time_zone" IN ('Europe/Madrid', 'Atlantic/Canary'))
);
--> statement-breakpoint
ALTER TABLE "whatsapp_links" ADD CONSTRAINT "whatsapp_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whatsapp_inbox_pending_idx" ON "whatsapp_inbox" USING btree ("processed_at","received_at");--> statement-breakpoint
CREATE INDEX "whatsapp_inbox_sender_idx" ON "whatsapp_inbox" USING btree ("sender","received_at");--> statement-breakpoint
CREATE UNIQUE INDEX "whatsapp_links_sender_uidx" ON "whatsapp_links" USING btree ("sender");--> statement-breakpoint
CREATE UNIQUE INDEX "whatsapp_links_user_uidx" ON "whatsapp_links" USING btree ("user_id");
--> statement-breakpoint
REVOKE ALL ON public.whatsapp_links, public.whatsapp_inbox FROM PUBLIC;
