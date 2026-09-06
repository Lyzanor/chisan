CREATE TABLE "producer_media_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"sha256" varchar(64) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"bytes" "bytea" NOT NULL,
	"rights_confirmed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_media_uploads_identity_check" CHECK ("producer_media_uploads"."country" ~ '^[a-z]{2}$' AND "producer_media_uploads"."producer_id" > 0),
	CONSTRAINT "producer_media_uploads_image_check" CHECK ("producer_media_uploads"."width" BETWEEN 200 AND 1600 AND "producer_media_uploads"."height" BETWEEN 200 AND 1600 AND octet_length("producer_media_uploads"."bytes") BETWEEN 1 AND 524288 AND "producer_media_uploads"."sha256" = encode(sha256("producer_media_uploads"."bytes"), 'hex'))
);
--> statement-breakpoint
ALTER TABLE "producer_change_requests" DROP CONSTRAINT "producer_change_requests_content_check";--> statement-breakpoint
ALTER TABLE "producer_media_uploads" ADD CONSTRAINT "producer_media_uploads_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_media_uploads_owner_digest_idx" ON "producer_media_uploads" USING btree ("author_user_id","country","producer_id","sha256");--> statement-breakpoint
CREATE INDEX "producer_media_uploads_producer_idx" ON "producer_media_uploads" USING btree ("country","producer_id");--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_content_check" CHECK ("producer_change_requests"."content_change" IS NULL OR (jsonb_typeof("producer_change_requests"."content_change") = 'object' AND "producer_change_requests"."required_entitlement_key" IS NOT DISTINCT FROM 'producer.profile.premium' AND ("producer_change_requests"."content_change"->>'version') IN ('1', '2') AND ("producer_change_requests"."content_change"->>'baseHash') ~ '^[a-f0-9]{64}$' AND ("producer_change_requests"."content_change"->>'requestedHash') ~ '^[a-f0-9]{64}$' AND jsonb_typeof("producer_change_requests"."content_change"->'products') = 'array' AND ("producer_change_requests"."content_change"->'base'->>'country') = "producer_change_requests"."country" AND ("producer_change_requests"."content_change"->'base'->>'producer_id') = "producer_change_requests"."producer_id"::text) IS TRUE);
--> statement-breakpoint
REVOKE ALL ON public.producer_media_uploads FROM PUBLIC;
GRANT SELECT ON public.producer_media_uploads TO chisan_producer_change_operator;
--> statement-breakpoint
CREATE FUNCTION public.chisan_validate_producer_media_proposal() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE item jsonb; uploaded public.producer_media_uploads%ROWTYPE;
BEGIN
  IF NEW.content_change->>'version' = '2' THEN
    IF jsonb_typeof(NEW.content_change->'gallery') IS DISTINCT FROM 'array'
      OR jsonb_typeof(NEW.content_change->'uploads') IS DISTINCT FROM 'array'
      OR jsonb_array_length(NEW.content_change->'uploads') > 20 THEN
      RAISE EXCEPTION 'Invalid media proposal manifest.';
    END IF;
    FOR item IN SELECT value FROM jsonb_array_elements(NEW.content_change->'uploads') LOOP
      SELECT * INTO uploaded FROM public.producer_media_uploads WHERE id = (item->>'uploadId')::uuid FOR SHARE;
      IF NOT FOUND OR uploaded.author_user_id IS DISTINCT FROM NEW.author_user_id
        OR uploaded.country IS DISTINCT FROM NEW.country OR uploaded.producer_id IS DISTINCT FROM NEW.producer_id
        OR uploaded.sha256 IS DISTINCT FROM item->>'sha256'
        OR uploaded.width::text IS DISTINCT FROM item->>'width' OR uploaded.height::text IS DISTINCT FROM item->>'height' THEN
        RAISE EXCEPTION 'Private image does not match its exact author, producer and prepared bytes.';
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER producer_change_media_manifest
BEFORE INSERT OR UPDATE OF content_change ON public.producer_change_requests
FOR EACH ROW EXECUTE FUNCTION public.chisan_validate_producer_media_proposal();
--> statement-breakpoint
CREATE FUNCTION public.chisan_protect_producer_media_upload() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN RAISE EXCEPTION 'Prepared images are immutable; upload a replacement.'; END IF;
  IF EXISTS (SELECT 1 FROM public.producer_change_requests r
    WHERE r.content_change->'uploads' @> jsonb_build_array(jsonb_build_object('uploadId', OLD.id::text))
    AND (r.status NOT IN ('applied', 'withdrawn', 'rejected', 'conflict') OR r.updated_at > now() - interval '90 days')) THEN
    RAISE EXCEPTION 'An image attached to a retained proposal cannot be deleted.';
  END IF;
  RETURN OLD;
END $$;
--> statement-breakpoint
CREATE TRIGGER producer_media_upload_immutable
BEFORE UPDATE OR DELETE ON public.producer_media_uploads
FOR EACH ROW EXECUTE FUNCTION public.chisan_protect_producer_media_upload();
