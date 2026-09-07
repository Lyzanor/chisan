CREATE TYPE "public"."producer_suggestion_status" AS ENUM('pending', 'approved', 'rejected', 'withdrawn', 'applied');--> statement-breakpoint
CREATE TABLE "producer_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"status" "producer_suggestion_status" DEFAULT 'pending' NOT NULL,
	"section" varchar(40) NOT NULL,
	"base_row_hash" varchar(64) NOT NULL,
	"base_snapshot" jsonb NOT NULL,
	"patch" jsonb NOT NULL,
	"author_note" text NOT NULL,
	"reviewer_user_id" uuid,
	"decision_note" text,
	"applied_commit_sha" varchar(64),
	"lock_version" integer DEFAULT 1 NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_suggestions_identity_check" CHECK ("producer_suggestions"."country" ~ '^[a-z]{2}$' AND "producer_suggestions"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_suggestions_section_check" CHECK (length(btrim("producer_suggestions"."section")) > 0),
	CONSTRAINT "producer_suggestions_base_hash_check" CHECK ("producer_suggestions"."base_row_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "producer_suggestions_snapshot_check" CHECK (jsonb_typeof("producer_suggestions"."base_snapshot") = 'object'),
	CONSTRAINT "producer_suggestions_patch_check" CHECK (jsonb_typeof("producer_suggestions"."patch") = 'object' AND "producer_suggestions"."patch" <> '{}'::jsonb),
	CONSTRAINT "producer_suggestions_note_check" CHECK (length(btrim("producer_suggestions"."author_note")) > 0),
	CONSTRAINT "producer_suggestions_lock_version_check" CHECK ("producer_suggestions"."lock_version" > 0),
	CONSTRAINT "producer_suggestions_review_check" CHECK ("producer_suggestions"."status" NOT IN ('approved', 'rejected', 'applied') OR ("producer_suggestions"."reviewer_user_id" IS NOT NULL AND "producer_suggestions"."reviewed_at" IS NOT NULL)),
	CONSTRAINT "producer_suggestions_applied_check" CHECK (("producer_suggestions"."status" = 'applied' AND "producer_suggestions"."applied_at" IS NOT NULL) OR ("producer_suggestions"."status" <> 'applied' AND "producer_suggestions"."applied_at" IS NULL)),
	CONSTRAINT "producer_suggestions_commit_sha_check" CHECK ("producer_suggestions"."applied_commit_sha" IS NULL OR "producer_suggestions"."applied_commit_sha" ~ '^([0-9a-f]{40}|[0-9a-f]{64})$')
);
--> statement-breakpoint
ALTER TABLE "producer_suggestions" ADD CONSTRAINT "producer_suggestions_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_suggestions" ADD CONSTRAINT "producer_suggestions_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_suggestions_open_author_producer_uidx" ON "producer_suggestions" USING btree ("author_user_id","country","producer_id","section") WHERE "producer_suggestions"."status" IN ('pending', 'approved');--> statement-breakpoint
CREATE INDEX "producer_suggestions_review_queue_idx" ON "producer_suggestions" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "producer_suggestions_producer_idx" ON "producer_suggestions" USING btree ("country","producer_id","created_at");--> statement-breakpoint
CREATE INDEX "producer_suggestions_author_idx" ON "producer_suggestions" USING btree ("author_user_id","created_at");--> statement-breakpoint
REVOKE ALL ON public.producer_suggestions FROM PUBLIC;
--> statement-breakpoint
CREATE FUNCTION public.chisan_protect_producer_suggestion() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  IF NEW.author_user_id IS DISTINCT FROM OLD.author_user_id
    OR NEW.country IS DISTINCT FROM OLD.country
    OR NEW.producer_id IS DISTINCT FROM OLD.producer_id
    OR NEW.section IS DISTINCT FROM OLD.section
    OR NEW.base_row_hash IS DISTINCT FROM OLD.base_row_hash
    OR NEW.base_snapshot IS DISTINCT FROM OLD.base_snapshot
    OR NEW.patch IS DISTINCT FROM OLD.patch
    OR NEW.author_note IS DISTINCT FROM OLD.author_note
    OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at THEN
    RAISE EXCEPTION 'A submitted producer suggestion is immutable.';
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER producer_suggestion_payload_immutable
BEFORE UPDATE ON public.producer_suggestions
FOR EACH ROW EXECUTE FUNCTION public.chisan_protect_producer_suggestion();
