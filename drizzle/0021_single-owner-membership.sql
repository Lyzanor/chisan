DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "producer_memberships"
		WHERE "status" = 'active' AND "role" = 'owner'
		GROUP BY "user_id"
		HAVING count(*) > 1
	) THEN
		RAISE EXCEPTION 'Cannot enforce one producer per owner account: duplicate active owner memberships require review';
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX "producer_memberships_active_owner_user_uidx" ON "producer_memberships" USING btree ("user_id") WHERE "producer_memberships"."status" = 'active' AND "producer_memberships"."role" = 'owner';
