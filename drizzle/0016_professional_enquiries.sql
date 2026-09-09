CREATE TABLE "business_enquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"requester_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"business" jsonb NOT NULL,
	"products" jsonb NOT NULL,
	"frequency" varchar(120) NOT NULL,
	"delivery_location" varchar(240) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_enquiries_status_check" CHECK ("business_enquiries"."status" in ('open','closed')),
	CONSTRAINT "business_enquiries_identity_check" CHECK ("business_enquiries"."country" ~ '^[a-z]{2}$' and "business_enquiries"."producer_id" > 0),
	CONSTRAINT "business_enquiries_products_check" CHECK (jsonb_typeof("business_enquiries"."products") = 'array' and jsonb_array_length("business_enquiries"."products") between 1 and 10),
	CONSTRAINT "business_enquiries_message_check" CHECK (length("business_enquiries"."message") between 1 and 2000)
);
--> statement-breakpoint
CREATE TABLE "business_messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"side" varchar(10) NOT NULL,
	"body" text NOT NULL,
	"offer" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_messages_side_check" CHECK ("business_messages"."side" in ('buyer','supplier')),
	CONSTRAINT "business_messages_offer_check" CHECK ("business_messages"."offer" is null or ("business_messages"."side" = 'supplier' and jsonb_typeof("business_messages"."offer") = 'object')),
	CONSTRAINT "business_messages_body_check" CHECK (length("business_messages"."body") between 1 and 2000)
);
--> statement-breakpoint
CREATE TABLE "business_product_terms" (
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"product_id" varchar(80) NOT NULL,
	"terms" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_product_terms_country_producer_id_product_id_pk" PRIMARY KEY("country","producer_id","product_id"),
	CONSTRAINT "business_product_terms_identity_check" CHECK ("business_product_terms"."country" ~ '^[a-z]{2}$' and "business_product_terms"."producer_id" > 0 and "business_product_terms"."version" > 0),
	CONSTRAINT "business_product_terms_json_check" CHECK (jsonb_typeof("business_product_terms"."terms") = 'object')
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"business_name" varchar(160) NOT NULL,
	"activity" varchar(30) NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_profiles_activity_check" CHECK ("business_profiles"."activity" in ('restaurante','hosteleria','tienda','distribucion','otro'))
);
--> statement-breakpoint
ALTER TABLE "business_enquiries" ADD CONSTRAINT "business_enquiries_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_messages" ADD CONSTRAINT "business_messages_enquiry_id_business_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."business_enquiries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_messages" ADD CONSTRAINT "business_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_product_terms" ADD CONSTRAINT "business_product_terms_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_profiles" ADD CONSTRAINT "business_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "business_enquiries_buyer_idx" ON "business_enquiries" USING btree ("requester_id","updated_at");--> statement-breakpoint
CREATE INDEX "business_enquiries_supplier_idx" ON "business_enquiries" USING btree ("country","producer_id","updated_at");--> statement-breakpoint
CREATE INDEX "business_messages_enquiry_idx" ON "business_messages" USING btree ("enquiry_id","created_at");
--> statement-breakpoint
REVOKE ALL ON business_profiles, business_product_terms, business_enquiries, business_messages FROM PUBLIC;
