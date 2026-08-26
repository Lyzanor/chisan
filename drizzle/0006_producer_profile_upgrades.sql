CREATE TYPE "public"."producer_profile_upgrade_status" AS ENUM('pending', 'paid', 'paid_unfulfilled', 'payment_failed', 'expired', 'partially_refunded', 'refunded', 'disputed', 'dispute_lost');--> statement-breakpoint
CREATE TABLE "producer_profile_upgrade_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"status" "producer_profile_upgrade_status" DEFAULT 'pending' NOT NULL,
	"amount_minor" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"terms_version" varchar(80) NOT NULL,
	"terms_url" varchar(2048) NOT NULL,
	"terms_accepted_at" timestamp with time zone NOT NULL,
	"payment_provider" varchar(32) NOT NULL,
	"provider_offer_id" varchar(255) NOT NULL,
	"provider_checkout_id" varchar(255),
	"provider_payment_id" varchar(255),
	"provider_charge_id" varchar(255),
	"provider_customer_id" varchar(255),
	"provider_dispute_id" varchar(255),
	"provider_dispute_status" varchar(64),
	"amount_captured_minor" integer,
	"captured_currency" varchar(3),
	"amount_refunded_minor" integer DEFAULT 0 NOT NULL,
	"entitlement_id" uuid,
	"checkout_expires_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"disputed_at" timestamp with time zone,
	"failure_code" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_profile_upgrade_requests_country_check" CHECK ("producer_profile_upgrade_requests"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "producer_profile_upgrade_requests_producer_id_check" CHECK ("producer_profile_upgrade_requests"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_profile_upgrade_requests_amount_check" CHECK ("producer_profile_upgrade_requests"."amount_minor" = 4900),
	CONSTRAINT "producer_profile_upgrade_requests_currency_check" CHECK ("producer_profile_upgrade_requests"."currency" = 'eur'),
	CONSTRAINT "producer_profile_upgrade_requests_terms_check" CHECK (length(btrim("producer_profile_upgrade_requests"."terms_version")) > 0 AND length(btrim("producer_profile_upgrade_requests"."terms_url")) > 0),
	CONSTRAINT "producer_profile_upgrade_requests_provider_check" CHECK ("producer_profile_upgrade_requests"."payment_provider" ~ '^[a-z][a-z0-9_-]{0,31}$'),
	CONSTRAINT "producer_profile_upgrade_requests_offer_check" CHECK (length(btrim("producer_profile_upgrade_requests"."provider_offer_id")) > 0),
	CONSTRAINT "producer_profile_upgrade_requests_checkout_check" CHECK (("producer_profile_upgrade_requests"."provider_checkout_id" IS NULL AND "producer_profile_upgrade_requests"."checkout_expires_at" IS NULL) OR ("producer_profile_upgrade_requests"."provider_checkout_id" IS NOT NULL AND "producer_profile_upgrade_requests"."checkout_expires_at" IS NOT NULL)),
	CONSTRAINT "producer_profile_upgrade_requests_payment_check" CHECK (("producer_profile_upgrade_requests"."status" IN ('pending', 'payment_failed', 'expired') AND "producer_profile_upgrade_requests"."paid_at" IS NULL AND "producer_profile_upgrade_requests"."amount_captured_minor" IS NULL AND "producer_profile_upgrade_requests"."captured_currency" IS NULL) OR ("producer_profile_upgrade_requests"."status" = 'paid_unfulfilled' AND "producer_profile_upgrade_requests"."paid_at" IS NOT NULL) OR ("producer_profile_upgrade_requests"."status" IN ('paid', 'partially_refunded', 'refunded', 'disputed', 'dispute_lost') AND "producer_profile_upgrade_requests"."provider_payment_id" IS NOT NULL AND "producer_profile_upgrade_requests"."paid_at" IS NOT NULL AND "producer_profile_upgrade_requests"."amount_captured_minor" IS NOT NULL AND "producer_profile_upgrade_requests"."captured_currency" IS NOT NULL)),
	CONSTRAINT "producer_profile_upgrade_requests_captured_amount_check" CHECK (("producer_profile_upgrade_requests"."amount_captured_minor" IS NULL AND "producer_profile_upgrade_requests"."captured_currency" IS NULL) OR ("producer_profile_upgrade_requests"."amount_captured_minor" > 0 AND "producer_profile_upgrade_requests"."captured_currency" ~ '^[a-z]{3}$')),
	CONSTRAINT "producer_profile_upgrade_requests_refund_amount_check" CHECK ("producer_profile_upgrade_requests"."amount_refunded_minor" BETWEEN 0 AND COALESCE("producer_profile_upgrade_requests"."amount_captured_minor", "producer_profile_upgrade_requests"."amount_minor")),
	CONSTRAINT "producer_profile_upgrade_requests_refund_check" CHECK ((("producer_profile_upgrade_requests"."amount_refunded_minor" = 0 AND "producer_profile_upgrade_requests"."refunded_at" IS NULL) OR ("producer_profile_upgrade_requests"."amount_refunded_minor" > 0 AND "producer_profile_upgrade_requests"."refunded_at" IS NOT NULL AND "producer_profile_upgrade_requests"."amount_captured_minor" IS NOT NULL)) AND ("producer_profile_upgrade_requests"."status" NOT IN ('pending', 'payment_failed', 'expired', 'paid') OR "producer_profile_upgrade_requests"."amount_refunded_minor" = 0) AND ("producer_profile_upgrade_requests"."status" <> 'partially_refunded' OR ("producer_profile_upgrade_requests"."amount_refunded_minor" > 0 AND "producer_profile_upgrade_requests"."amount_refunded_minor" < "producer_profile_upgrade_requests"."amount_captured_minor")) AND ("producer_profile_upgrade_requests"."status" <> 'refunded' OR "producer_profile_upgrade_requests"."amount_refunded_minor" = "producer_profile_upgrade_requests"."amount_captured_minor")),
	CONSTRAINT "producer_profile_upgrade_requests_dispute_check" CHECK (("producer_profile_upgrade_requests"."provider_dispute_id" IS NULL AND "producer_profile_upgrade_requests"."provider_dispute_status" IS NULL AND "producer_profile_upgrade_requests"."disputed_at" IS NULL) OR ("producer_profile_upgrade_requests"."provider_dispute_id" IS NOT NULL AND "producer_profile_upgrade_requests"."provider_dispute_status" IS NOT NULL AND "producer_profile_upgrade_requests"."disputed_at" IS NOT NULL)),
	CONSTRAINT "producer_profile_upgrade_requests_entitlement_check" CHECK (("producer_profile_upgrade_requests"."status" = 'paid' AND "producer_profile_upgrade_requests"."entitlement_id" IS NOT NULL) OR ("producer_profile_upgrade_requests"."status" IN ('pending', 'payment_failed', 'expired') AND "producer_profile_upgrade_requests"."entitlement_id" IS NULL) OR ("producer_profile_upgrade_requests"."status" IN ('paid_unfulfilled', 'partially_refunded', 'refunded', 'disputed', 'dispute_lost'))),
	CONSTRAINT "producer_profile_upgrade_requests_failure_check" CHECK (("producer_profile_upgrade_requests"."status" IN ('paid_unfulfilled', 'payment_failed') AND "producer_profile_upgrade_requests"."failure_code" IS NOT NULL) OR ("producer_profile_upgrade_requests"."status" NOT IN ('paid_unfulfilled', 'payment_failed') AND "producer_profile_upgrade_requests"."failure_code" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD COLUMN "required_entitlement_key" varchar(120);--> statement-breakpoint
ALTER TABLE "producer_profile_upgrade_requests" ADD CONSTRAINT "producer_profile_upgrade_requests_requester_user_id_users_id_fk" FOREIGN KEY ("requester_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_profile_upgrade_requests" ADD CONSTRAINT "producer_profile_upgrade_requests_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "public"."entitlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_active_producer_uidx" ON "producer_profile_upgrade_requests" USING btree ("country","producer_id") WHERE "producer_profile_upgrade_requests"."status" IN ('pending', 'paid', 'paid_unfulfilled', 'partially_refunded', 'disputed');--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_checkout_uidx" ON "producer_profile_upgrade_requests" USING btree ("payment_provider","provider_checkout_id") WHERE "producer_profile_upgrade_requests"."provider_checkout_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_payment_uidx" ON "producer_profile_upgrade_requests" USING btree ("payment_provider","provider_payment_id") WHERE "producer_profile_upgrade_requests"."provider_payment_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_charge_uidx" ON "producer_profile_upgrade_requests" USING btree ("payment_provider","provider_charge_id") WHERE "producer_profile_upgrade_requests"."provider_charge_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_dispute_uidx" ON "producer_profile_upgrade_requests" USING btree ("payment_provider","provider_dispute_id") WHERE "producer_profile_upgrade_requests"."provider_dispute_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_profile_upgrade_requests_entitlement_uidx" ON "producer_profile_upgrade_requests" USING btree ("entitlement_id") WHERE "producer_profile_upgrade_requests"."entitlement_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "producer_profile_upgrade_requests_requester_idx" ON "producer_profile_upgrade_requests" USING btree ("requester_user_id","created_at");--> statement-breakpoint
CREATE INDEX "producer_profile_upgrade_requests_producer_idx" ON "producer_profile_upgrade_requests" USING btree ("country","producer_id","created_at");--> statement-breakpoint
CREATE INDEX "producer_profile_upgrade_requests_incident_idx" ON "producer_profile_upgrade_requests" USING btree ("payment_provider","status","updated_at");--> statement-breakpoint
CREATE INDEX "audit_events_action_occurred_idx" ON "audit_events" USING btree ("action","occurred_at");--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_entitlement_key_check" CHECK ("producer_change_requests"."required_entitlement_key" IS NULL OR length(btrim("producer_change_requests"."required_entitlement_key")) > 0);--> statement-breakpoint
REVOKE ALL ON TABLE public.producer_profile_upgrade_requests FROM PUBLIC, chisan_admin_read, chisan_producer_change_operator, chisan_producer_change_recovery, chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT ("required_entitlement_key") ON TABLE public.producer_change_requests TO chisan_admin_read;--> statement-breakpoint
GRANT SELECT (
	"id", "subject_kind", "producer_country", "producer_id", "key", "status",
	"starts_at", "expires_at", "revoked_at"
) ON TABLE public.entitlements TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT CREATE ON SCHEMA public TO chisan_producer_change_api_owner;--> statement-breakpoint
CREATE FUNCTION public.chisan_enforce_producer_change_entitlement_v1()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_change public.producer_change_requests%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
BEGIN
	IF NEW.status::text NOT IN ('leased', 'materialized', 'finalized') THEN
		RETURN NEW;
	END IF;

	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = NEW.change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer change request % was not found.', NEW.change_request_id;
	END IF;
	IF v_change.required_entitlement_key IS NULL THEN
		RETURN NEW;
	END IF;

	IF NOT EXISTS (
		SELECT 1
		FROM public.entitlements AS entitlement
		WHERE entitlement.subject_kind::text = 'producer'
			AND entitlement.producer_country = v_change.country
			AND entitlement.producer_id = v_change.producer_id
			AND entitlement.key = v_change.required_entitlement_key
			AND entitlement.status::text = 'active'
			AND entitlement.starts_at <= v_now
			AND (entitlement.expires_at IS NULL OR entitlement.expires_at > v_now)
			AND entitlement.revoked_at IS NULL
	) THEN
		RAISE EXCEPTION 'The producer entitlement required by this change is no longer active.';
	END IF;

	RETURN NEW;
END
$function$;--> statement-breakpoint
ALTER FUNCTION public.chisan_enforce_producer_change_entitlement_v1() OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE CREATE ON SCHEMA public FROM chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_enforce_producer_change_entitlement_v1() FROM PUBLIC;--> statement-breakpoint
CREATE TRIGGER chisan_producer_change_entitlement_insert_trigger
	BEFORE INSERT ON public.producer_change_executions
	FOR EACH ROW
	EXECUTE FUNCTION public.chisan_enforce_producer_change_entitlement_v1();--> statement-breakpoint
CREATE TRIGGER chisan_producer_change_entitlement_update_trigger
	BEFORE UPDATE OF status ON public.producer_change_executions
	FOR EACH ROW
	EXECUTE FUNCTION public.chisan_enforce_producer_change_entitlement_v1();
