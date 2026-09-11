CREATE TYPE "public"."producer_intent_action" AS ENUM('contact', 'call', 'directions', 'shop', 'website');--> statement-breakpoint
CREATE TABLE "producer_daily_actions" (
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"day" date NOT NULL,
	"action" "producer_intent_action" NOT NULL,
	"clicks" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "producer_daily_actions_country_producer_id_day_action_pk" PRIMARY KEY("country","producer_id","day","action"),
	CONSTRAINT "producer_daily_actions_count_check" CHECK ("producer_daily_actions"."clicks" >= 0),
	CONSTRAINT "producer_daily_actions_identity_check" CHECK ("producer_daily_actions"."country" ~ '^[a-z]{2}$' AND "producer_daily_actions"."producer_id" > 0)
);
