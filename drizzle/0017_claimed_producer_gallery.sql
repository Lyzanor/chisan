-- Free claimed profiles can change up to five standalone images, preserving all
-- product records and product-owned images. This pure predicate is also used by
-- the row constraint during review and the existing publication lease workflow.
CREATE FUNCTION public.chisan_is_free_gallery_change(change jsonb) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE SET search_path = pg_catalog, public AS $$
DECLARE used_ids text[]; before_images jsonb; after_images jsonb; free_count integer;
BEGIN
  IF change->>'version' IS DISTINCT FROM '2'
    OR jsonb_typeof(change->'products') IS DISTINCT FROM 'array'
    OR jsonb_typeof(change->'base'->'products') IS DISTINCT FROM 'array'
    OR jsonb_typeof(change->'gallery') IS DISTINCT FROM 'array'
    OR jsonb_typeof(change->'base'->'gallery') IS DISTINCT FROM 'array'
    OR change->'products' IS DISTINCT FROM change->'base'->'products' THEN RETURN false; END IF;
  SELECT coalesce(array_agg(id), ARRAY[]::text[]) INTO used_ids
    FROM jsonb_array_elements(change->'base'->'products') p,
      jsonb_array_elements_text(p->'media_ids') id;
  SELECT coalesce(jsonb_agg(image ORDER BY ordinal), '[]'::jsonb) INTO before_images
    FROM jsonb_array_elements(change->'base'->'gallery') WITH ORDINALITY AS images(image, ordinal)
    WHERE image->>'id' = ANY(used_ids);
  SELECT coalesce(jsonb_agg(image ORDER BY ordinal), '[]'::jsonb) INTO after_images
    FROM jsonb_array_elements(change->'gallery') WITH ORDINALITY AS images(image, ordinal)
    WHERE image->>'id' = ANY(used_ids);
  SELECT count(*) INTO free_count FROM jsonb_array_elements(change->'gallery') image
    WHERE NOT (image->>'id' = ANY(used_ids));
  RETURN free_count <= 5 AND before_images = after_images;
END $$;
--> statement-breakpoint
ALTER TABLE "producer_change_requests" DROP CONSTRAINT "producer_change_requests_content_check";--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_content_check" CHECK ("producer_change_requests"."content_change" IS NULL OR (jsonb_typeof("producer_change_requests"."content_change") = 'object' AND ("producer_change_requests"."required_entitlement_key" IS NOT DISTINCT FROM 'producer.profile.premium' OR ("producer_change_requests"."required_entitlement_key" IS NULL AND public.chisan_is_free_gallery_change("producer_change_requests"."content_change"))) AND ("producer_change_requests"."content_change"->>'version') IN ('1', '2') AND ("producer_change_requests"."content_change"->>'baseHash') ~ '^[a-f0-9]{64}$' AND ("producer_change_requests"."content_change"->>'requestedHash') ~ '^[a-f0-9]{64}$' AND jsonb_typeof("producer_change_requests"."content_change"->'products') = 'array' AND ("producer_change_requests"."content_change"->'base'->>'country') = "producer_change_requests"."country" AND ("producer_change_requests"."content_change"->'base'->>'producer_id') = "producer_change_requests"."producer_id"::text) IS TRUE);