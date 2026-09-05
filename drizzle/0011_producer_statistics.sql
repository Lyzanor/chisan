CREATE TABLE "producer_daily_stats" (
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"day" date NOT NULL,
	"views" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "producer_daily_stats_country_producer_id_day_pk" PRIMARY KEY("country","producer_id","day"),
	CONSTRAINT "producer_daily_stats_count_check" CHECK ("producer_daily_stats"."views" >= 0),
	CONSTRAINT "producer_daily_stats_identity_check" CHECK ("producer_daily_stats"."country" ~ '^[a-z]{2}$' AND "producer_daily_stats"."producer_id" > 0)
);
--> statement-breakpoint
CREATE TABLE "producer_stats_receipts" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"day" date NOT NULL
);
--> statement-breakpoint
CREATE INDEX "producer_stats_receipts_day_idx" ON "producer_stats_receipts" USING btree ("day");