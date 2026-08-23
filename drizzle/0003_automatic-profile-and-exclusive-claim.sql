CREATE UNIQUE INDEX "producer_claims_approved_producer_uidx" ON "producer_claims" USING btree ("country","producer_id") WHERE "producer_claims"."status" = 'approved';--> statement-breakpoint
UPDATE "users" AS "account"
SET
	"profile_kind" = CASE
		WHEN EXISTS (
			SELECT 1
			FROM "producer_claims" AS "claim"
			WHERE "claim"."claimant_user_id" = "account"."id"
				AND "claim"."submitted_at" IS NOT NULL
		)
		THEN 'producer'::"user_profile_kind"
		ELSE 'user'::"user_profile_kind"
	END,
	"updated_at" = now()
WHERE "profile_kind" IS DISTINCT FROM CASE
	WHEN EXISTS (
		SELECT 1
		FROM "producer_claims" AS "claim"
		WHERE "claim"."claimant_user_id" = "account"."id"
			AND "claim"."submitted_at" IS NOT NULL
	)
	THEN 'producer'::"user_profile_kind"
	ELSE 'user'::"user_profile_kind"
END;
