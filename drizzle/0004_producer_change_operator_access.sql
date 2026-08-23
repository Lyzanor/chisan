CREATE TYPE "public"."producer_change_execution_status" AS ENUM('leased', 'materialized', 'finalized', 'failed', 'expired', 'cancelled');--> statement-breakpoint
CREATE TABLE "producer_change_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_request_id" uuid NOT NULL,
	"country" varchar(2) NOT NULL,
	"producer_id" bigint NOT NULL,
	"status" "producer_change_execution_status" DEFAULT 'leased' NOT NULL,
	"operator_key" varchar(160) NOT NULL,
	"worktree_key" varchar(64) NOT NULL,
	"source_head_sha" varchar(40) NOT NULL,
	"expected_row_hash" varchar(64) NOT NULL,
	"lease_expires_at" timestamp with time zone NOT NULL,
	"csv_path" varchar(512) NOT NULL,
	"materialized_at" timestamp with time zone,
	"applied_commit_sha" varchar(40),
	"finished_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "producer_change_executions_country_check" CHECK ("producer_change_executions"."country" ~ '^[a-z]{2}$'),
	CONSTRAINT "producer_change_executions_producer_id_check" CHECK ("producer_change_executions"."producer_id" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "producer_change_executions_operator_key_check" CHECK (length(btrim("producer_change_executions"."operator_key")) > 0),
	CONSTRAINT "producer_change_executions_worktree_key_check" CHECK ("producer_change_executions"."worktree_key" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "producer_change_executions_source_head_check" CHECK ("producer_change_executions"."source_head_sha" ~ '^[0-9a-f]{40}$'),
	CONSTRAINT "producer_change_executions_expected_hash_check" CHECK ("producer_change_executions"."expected_row_hash" ~ '^[0-9a-f]{64}$'),
	CONSTRAINT "producer_change_executions_commit_sha_check" CHECK ("producer_change_executions"."applied_commit_sha" IS NULL OR "producer_change_executions"."applied_commit_sha" ~ '^[0-9a-f]{40}$'),
	CONSTRAINT "producer_change_executions_csv_path_check" CHECK ("producer_change_executions"."csv_path" ~ ('^data/csv/' || "producer_change_executions"."country" || '/[^/\\]+/[^/\\]+\.csv$') AND position('..' in "producer_change_executions"."csv_path") = 0),
	CONSTRAINT "producer_change_executions_lease_window_check" CHECK ("producer_change_executions"."lease_expires_at" > "producer_change_executions"."created_at"),
	CONSTRAINT "producer_change_executions_lifecycle_check" CHECK (("producer_change_executions"."status" = 'leased' AND "producer_change_executions"."materialized_at" IS NULL AND "producer_change_executions"."applied_commit_sha" IS NULL AND "producer_change_executions"."finished_at" IS NULL AND "producer_change_executions"."error_message" IS NULL) OR ("producer_change_executions"."status" = 'materialized' AND "producer_change_executions"."materialized_at" IS NOT NULL AND "producer_change_executions"."applied_commit_sha" IS NULL AND "producer_change_executions"."finished_at" IS NULL AND "producer_change_executions"."error_message" IS NULL) OR ("producer_change_executions"."status" = 'finalized' AND "producer_change_executions"."materialized_at" IS NOT NULL AND "producer_change_executions"."applied_commit_sha" IS NOT NULL AND "producer_change_executions"."finished_at" IS NOT NULL AND "producer_change_executions"."error_message" IS NULL) OR ("producer_change_executions"."status" IN ('failed', 'expired', 'cancelled') AND "producer_change_executions"."applied_commit_sha" IS NULL AND "producer_change_executions"."finished_at" IS NOT NULL AND "producer_change_executions"."error_message" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "producer_change_requests" DROP CONSTRAINT "producer_change_requests_submission_check";--> statement-breakpoint
ALTER TABLE "producer_change_executions" ADD CONSTRAINT "producer_change_executions_change_request_id_producer_change_requests_id_fk" FOREIGN KEY ("change_request_id") REFERENCES "public"."producer_change_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_change_requests_execution_identity_uidx" ON "producer_change_requests" USING btree ("id","country","producer_id");--> statement-breakpoint
ALTER TABLE "producer_change_executions" ADD CONSTRAINT "producer_change_executions_request_identity_fk" FOREIGN KEY ("change_request_id","country","producer_id") REFERENCES "public"."producer_change_requests"("id","country","producer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "producer_change_executions_active_request_uidx" ON "producer_change_executions" USING btree ("change_request_id") WHERE "producer_change_executions"."status" IN ('leased', 'materialized');--> statement-breakpoint
CREATE UNIQUE INDEX "producer_change_executions_active_producer_uidx" ON "producer_change_executions" USING btree ("country","producer_id") WHERE "producer_change_executions"."status" IN ('leased', 'materialized');--> statement-breakpoint
CREATE UNIQUE INDEX "producer_change_executions_active_csv_uidx" ON "producer_change_executions" USING btree ("csv_path") WHERE "producer_change_executions"."status" IN ('leased', 'materialized');--> statement-breakpoint
CREATE INDEX "producer_change_executions_request_idx" ON "producer_change_executions" USING btree ("change_request_id","created_at");--> statement-breakpoint
CREATE INDEX "producer_change_executions_operator_idx" ON "producer_change_executions" USING btree ("operator_key","status","created_at");--> statement-breakpoint
CREATE INDEX "producer_change_executions_lease_idx" ON "producer_change_executions" USING btree ("lease_expires_at") WHERE "producer_change_executions"."status" = 'leased';--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_submission_check" CHECK ("producer_change_requests"."status" IN ('draft', 'withdrawn', 'conflict', 'failed') OR ("producer_change_requests"."submitted_at" IS NOT NULL AND "producer_change_requests"."patch" <> '{}'::jsonb));--> statement-breakpoint
CREATE VIEW "public"."producer_change_request_audit_events" AS (select "id", "actor_kind", "actor_user_id", "actor_key", "action", "target_type", "target_id", "metadata", "occurred_at" from "audit_events" where "audit_events"."target_type" = 'producer_change_request');
--> statement-breakpoint
DO $roles$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'chisan_admin_read') THEN
		CREATE ROLE chisan_admin_read NOLOGIN;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'chisan_producer_change_operator') THEN
		CREATE ROLE chisan_producer_change_operator NOLOGIN;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'chisan_producer_change_recovery') THEN
		CREATE ROLE chisan_producer_change_recovery NOLOGIN;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'chisan_producer_change_api_owner') THEN
		CREATE ROLE chisan_producer_change_api_owner NOLOGIN;
	END IF;
END
$roles$;--> statement-breakpoint
ALTER ROLE chisan_admin_read NOLOGIN INHERIT NOCREATEROLE;--> statement-breakpoint
ALTER ROLE chisan_producer_change_operator NOLOGIN INHERIT NOCREATEROLE;--> statement-breakpoint
ALTER ROLE chisan_producer_change_recovery NOLOGIN INHERIT NOCREATEROLE;--> statement-breakpoint
ALTER ROLE chisan_producer_change_api_owner NOLOGIN NOINHERIT NOCREATEROLE;--> statement-breakpoint
DO $role_safety$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM pg_catalog.pg_roles
		WHERE rolname IN (
			'chisan_admin_read',
			'chisan_producer_change_operator',
			'chisan_producer_change_recovery',
			'chisan_producer_change_api_owner'
		)
		AND (
			rolcanlogin OR rolsuper OR rolcreatedb OR rolcreaterole
			OR rolreplication OR rolbypassrls
		)
	) THEN
		RAISE EXCEPTION 'Producer-change capability roles have unsafe PostgreSQL attributes.';
	END IF;
	IF EXISTS (
		SELECT 1
		FROM pg_catalog.pg_auth_members AS membership
		JOIN pg_catalog.pg_roles AS member ON member.oid = membership.member
		JOIN pg_catalog.pg_roles AS granted ON granted.oid = membership.roleid
		WHERE member.rolname IN (
			'chisan_admin_read', 'chisan_producer_change_operator',
			'chisan_producer_change_recovery', 'chisan_producer_change_api_owner'
		)
		OR (
			granted.rolname IN (
				'chisan_admin_read', 'chisan_producer_change_operator',
				'chisan_producer_change_recovery', 'chisan_producer_change_api_owner'
			)
			AND member.rolname <> current_user
		)
	) THEN
		RAISE EXCEPTION 'Producer-change capability roles have unexpected memberships or grantees.';
	END IF;
END
$role_safety$;--> statement-breakpoint
GRANT chisan_admin_read TO chisan_producer_change_operator;--> statement-breakpoint
GRANT chisan_admin_read TO chisan_producer_change_recovery;--> statement-breakpoint
GRANT chisan_producer_change_api_owner TO CURRENT_USER;--> statement-breakpoint
DO $database_grants$
BEGIN
	EXECUTE pg_catalog.format(
		'GRANT CONNECT ON DATABASE %I TO chisan_admin_read, chisan_producer_change_operator, chisan_producer_change_recovery, chisan_producer_change_api_owner',
		pg_catalog.current_database()
	);
END
$database_grants$;--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO chisan_admin_read, chisan_producer_change_operator, chisan_producer_change_recovery, chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE CREATE ON SCHEMA public FROM chisan_admin_read, chisan_producer_change_operator, chisan_producer_change_recovery;--> statement-breakpoint
GRANT CREATE ON SCHEMA public TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON TABLE public.producer_change_requests, public.producer_change_executions, public.producer_memberships, public.users, public.audit_events FROM chisan_admin_read, chisan_producer_change_operator, chisan_producer_change_recovery, chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT (
	id, author_user_id, country, producer_id, status, base_row_hash, base_snapshot,
	patch, author_note, lock_version, reviewer_user_id, decision_note, failure_reason,
	applied_commit_sha, submitted_at, reviewed_at, applied_at, created_at, updated_at
) ON TABLE public.producer_change_requests TO chisan_admin_read;--> statement-breakpoint
GRANT SELECT (id, display_name) ON TABLE public.users TO chisan_admin_read;--> statement-breakpoint
GRANT SELECT (
	id, change_request_id, country, producer_id, status, operator_key,
	worktree_key, source_head_sha, expected_row_hash, lease_expires_at, csv_path,
	materialized_at, applied_commit_sha, finished_at, error_message, created_at,
	updated_at
) ON TABLE public.producer_change_executions TO chisan_admin_read;--> statement-breakpoint
GRANT SELECT ON TABLE public.producer_change_requests TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT UPDATE (
	status, failure_reason, applied_commit_sha, applied_at, lock_version, updated_at
) ON TABLE public.producer_change_requests TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT (id, user_id, country, producer_id, status)
	ON TABLE public.producer_memberships TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT (id, status) ON TABLE public.users TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON TABLE public.producer_change_executions TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT INSERT (
	actor_kind, actor_key, action, target_type, target_id, metadata
) ON TABLE public.audit_events TO chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT (
	id, actor_kind, actor_user_id, actor_key, action, target_type, target_id,
	metadata, occurred_at
) ON TABLE public.audit_events TO chisan_producer_change_api_owner;--> statement-breakpoint
ALTER VIEW public.producer_change_request_audit_events SET (security_barrier = true);--> statement-breakpoint
ALTER VIEW public.producer_change_request_audit_events OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON TABLE public.producer_change_request_audit_events FROM PUBLIC, chisan_producer_change_operator, chisan_producer_change_recovery, chisan_producer_change_api_owner;--> statement-breakpoint
GRANT SELECT (
	id, actor_kind, actor_user_id, actor_key, action, target_type, target_id,
	metadata, occurred_at
) ON TABLE public.producer_change_request_audit_events TO chisan_admin_read;--> statement-breakpoint
CREATE FUNCTION public.chisan_begin_producer_change_execution_v1(
	p_execution_id uuid,
	p_change_request_id uuid,
	p_worktree_key text,
	p_csv_path text,
	p_source_head_sha text,
	p_expected_row_hash text,
	p_lease_seconds integer DEFAULT 900
)
RETURNS TABLE(execution_id uuid, lease_expires_at timestamp with time zone, operator_key text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_change public.producer_change_requests%ROWTYPE;
	v_active public.producer_change_executions%ROWTYPE;
	v_existing public.producer_change_executions%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
	v_operator text := session_user::text;
BEGIN
	IF p_execution_id IS NULL OR p_change_request_id IS NULL THEN
		RAISE EXCEPTION 'Execution id and producer change request id are required.';
	END IF;
	IF p_lease_seconds IS NULL OR p_lease_seconds < 60 OR p_lease_seconds > 3600 THEN
		RAISE EXCEPTION 'Materialization lease must be between 60 and 3600 seconds.';
	END IF;
	IF p_worktree_key IS NULL OR p_worktree_key !~ '^[0-9a-f]{64}$' THEN
		RAISE EXCEPTION 'Worktree key must be a lowercase SHA-256 value.';
	END IF;
	IF p_source_head_sha IS NULL OR p_source_head_sha !~ '^[0-9a-f]{40}$' THEN
		RAISE EXCEPTION 'Source HEAD must be a full lowercase Git SHA.';
	END IF;
	IF p_expected_row_hash IS NULL OR p_expected_row_hash !~ '^[0-9a-f]{64}$' THEN
		RAISE EXCEPTION 'Expected producer hash is invalid.';
	END IF;

	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer change request % was not found.', p_change_request_id;
	END IF;
	IF p_csv_path IS NULL
		OR p_csv_path !~ ('^data/csv/' || v_change.country || '/[^/\\]+/[^/\\]+\.csv$')
		OR pg_catalog.strpos(p_csv_path, '..') > 0 THEN
		RAISE EXCEPTION 'CSV path is not a canonical path inside the request country.';
	END IF;

	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_change.country || ':' || v_change.producer_id)
	);
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer-file:' || p_csv_path)
	);
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id
	FOR UPDATE;

	IF v_change.status::text NOT IN ('approved', 'applying') THEN
		RAISE EXCEPTION 'Producer change request is %, not approved for materialization.', v_change.status;
	END IF;
	IF v_change.reviewer_user_id IS NULL OR v_change.reviewed_at IS NULL THEN
		RAISE EXCEPTION 'Producer change request has not passed editorial review.';
	END IF;
	UPDATE public.producer_change_executions AS execution
	SET status = 'expired',
		finished_at = v_now,
		error_message = 'Lease expired before materialization completed.',
		updated_at = v_now
	WHERE execution.status = 'leased'
		AND execution.lease_expires_at <= v_now
		AND (
			execution.change_request_id = v_change.id
			OR (execution.country = v_change.country AND execution.producer_id = v_change.producer_id)
			OR execution.csv_path = p_csv_path
		);
	IF NOT EXISTS (
		SELECT 1
		FROM public.producer_memberships AS membership
		JOIN public.users AS account ON account.id = membership.user_id
		WHERE membership.user_id = v_change.author_user_id
			AND membership.country = v_change.country
			AND membership.producer_id = v_change.producer_id
			AND membership.status::text = 'active'
			AND account.status::text = 'active'
	) THEN
		RAISE EXCEPTION 'The author no longer has active access to this producer.';
	END IF;

	SELECT * INTO v_existing
	FROM public.producer_change_executions
	WHERE id = p_execution_id;
	IF FOUND THEN
		IF v_existing.change_request_id IS NOT DISTINCT FROM p_change_request_id
			AND v_existing.status::text IN ('leased', 'materialized')
			AND v_existing.operator_key = v_operator
			AND v_existing.worktree_key IS NOT DISTINCT FROM p_worktree_key
			AND v_existing.csv_path IS NOT DISTINCT FROM p_csv_path
			AND v_existing.source_head_sha IS NOT DISTINCT FROM p_source_head_sha
			AND v_existing.expected_row_hash IS NOT DISTINCT FROM p_expected_row_hash
			AND (v_existing.status::text = 'materialized' OR v_existing.lease_expires_at > v_now) THEN
			RETURN QUERY SELECT v_existing.id, v_existing.lease_expires_at,
				v_existing.operator_key::text;
			RETURN;
		END IF;
		RAISE EXCEPTION 'Execution id % already exists with different or expired parameters.', p_execution_id;
	END IF;

	SELECT execution.* INTO v_active
	FROM public.producer_change_executions AS execution
	WHERE execution.status IN ('leased', 'materialized')
		AND (
			execution.change_request_id = v_change.id
			OR (execution.country = v_change.country AND execution.producer_id = v_change.producer_id)
			OR execution.csv_path = p_csv_path
		)
	ORDER BY execution.created_at
	LIMIT 1;
	IF FOUND THEN
		RAISE EXCEPTION 'Active producer-change execution % already owns this request, producer or CSV.', v_active.id;
	END IF;

	INSERT INTO public.producer_change_executions (
		id, change_request_id, country, producer_id, status, operator_key,
		worktree_key, source_head_sha, expected_row_hash, lease_expires_at, csv_path
	) VALUES (
		p_execution_id, v_change.id, v_change.country, v_change.producer_id,
		'leased', v_operator, p_worktree_key, p_source_head_sha,
		p_expected_row_hash,
		v_now + pg_catalog.make_interval(secs => p_lease_seconds), p_csv_path
	);

	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', v_operator, 'producer_change.execution_started',
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'executionId', p_execution_id,
			'worktreeKey', p_worktree_key,
			'csvPath', p_csv_path,
			'sourceHeadSha', p_source_head_sha,
			'leaseExpiresAt', v_now + pg_catalog.make_interval(secs => p_lease_seconds)
		)
	);

	RETURN QUERY SELECT p_execution_id,
		v_now + pg_catalog.make_interval(secs => p_lease_seconds), v_operator;
END
$function$;--> statement-breakpoint
ALTER FUNCTION public.chisan_begin_producer_change_execution_v1(uuid, uuid, text, text, text, text, integer) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_begin_producer_change_execution_v1(uuid, uuid, text, text, text, text, integer) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_begin_producer_change_execution_v1(uuid, uuid, text, text, text, text, integer) TO chisan_producer_change_operator;

CREATE OR REPLACE FUNCTION public.chisan_complete_producer_change_execution_v1(
	p_execution_id uuid,
	p_expected_row_hash text,
	p_fields text[],
	p_already_present boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_execution public.producer_change_executions%ROWTYPE;
	v_change public.producer_change_requests%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
BEGIN
	IF p_execution_id IS NULL
		OR p_expected_row_hash IS NULL
		OR p_expected_row_hash !~ '^[0-9a-f]{64}$'
		OR p_fields IS NULL
		OR pg_catalog.array_position(p_fields, NULL) IS NOT NULL
		OR p_already_present IS NULL THEN
		RAISE EXCEPTION 'Completion inputs are invalid.';
	END IF;
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer-change execution % was not found.', p_execution_id;
	END IF;

	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_execution.country || ':' || v_execution.producer_id)
	);
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer-file:' || v_execution.csv_path)
	);
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id
	FOR UPDATE;

	IF v_execution.status::text = 'materialized'
		AND v_execution.operator_key = session_user::text
		AND v_execution.expected_row_hash IS NOT DISTINCT FROM p_expected_row_hash THEN
		RETURN;
	END IF;
	IF v_execution.status::text <> 'leased' THEN
		RAISE EXCEPTION 'Producer-change execution is %, not leased.', v_execution.status;
	END IF;
	IF v_execution.operator_key <> session_user::text THEN
		RAISE EXCEPTION 'Producer-change execution belongs to another operator.';
	END IF;
	IF v_execution.lease_expires_at <= v_now THEN
		RAISE EXCEPTION 'Producer-change execution lease expired before completion.';
	END IF;
	IF v_execution.expected_row_hash IS DISTINCT FROM p_expected_row_hash THEN
		RAISE EXCEPTION 'Materialized producer hash differs from the leased hash.';
	END IF;

	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = v_execution.change_request_id
	FOR UPDATE;
	IF v_change.status::text NOT IN ('approved', 'applying') THEN
		RAISE EXCEPTION 'Producer change request is %, not approved for materialization.', v_change.status;
	END IF;
	IF NOT EXISTS (
		SELECT 1
		FROM public.producer_memberships AS membership
		JOIN public.users AS account ON account.id = membership.user_id
		WHERE membership.user_id = v_change.author_user_id
			AND membership.country = v_change.country
			AND membership.producer_id = v_change.producer_id
			AND membership.status::text = 'active'
			AND account.status::text = 'active'
	) THEN
		RAISE EXCEPTION 'The author no longer has active access to this producer.';
	END IF;

	UPDATE public.producer_change_requests
	SET status = 'applying', failure_reason = NULL,
		lock_version = lock_version + 1, updated_at = v_now
	WHERE id = v_change.id;
	UPDATE public.producer_change_executions
	SET status = 'materialized', materialized_at = v_now, updated_at = v_now
	WHERE id = v_execution.id;
	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', session_user::text, 'producer_change.materialized',
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'executionId', v_execution.id,
			'country', v_change.country,
			'producerId', v_change.producer_id,
			'csvPath', v_execution.csv_path,
			'fields', pg_catalog.to_jsonb(p_fields),
			'alreadyPresent', p_already_present
		)
	);
END
$function$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_fail_producer_change_execution_v1(
	p_execution_id uuid,
	p_outcome text,
	p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_execution public.producer_change_executions%ROWTYPE;
	v_change public.producer_change_requests%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
	v_reason text := pg_catalog.left(coalesce(p_reason, 'Materialization failed.'), 2000);
BEGIN
	IF p_execution_id IS NULL OR p_outcome IS NULL OR p_outcome NOT IN ('conflict', 'failed') THEN
		RAISE EXCEPTION 'Execution outcome must be conflict or failed.';
	END IF;
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer-change execution % was not found.', p_execution_id;
	END IF;

	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_execution.country || ':' || v_execution.producer_id)
	);
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer-file:' || v_execution.csv_path)
	);
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id
	FOR UPDATE;
	IF v_execution.status::text <> 'leased' THEN
		RAISE EXCEPTION 'Only a leased execution can fail; current status is %.', v_execution.status;
	END IF;
	IF v_execution.operator_key <> session_user::text THEN
		RAISE EXCEPTION 'Producer-change execution belongs to another operator.';
	END IF;

	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = v_execution.change_request_id
	FOR UPDATE;
	IF v_change.status::text NOT IN ('approved', 'applying') THEN
		RAISE EXCEPTION 'Producer change request is %, not owned by this execution.', v_change.status;
	END IF;

	UPDATE public.producer_change_executions
	SET status = 'failed', finished_at = v_now, error_message = v_reason,
		updated_at = v_now
	WHERE id = v_execution.id;
	UPDATE public.producer_change_requests
	SET status = p_outcome::public.producer_change_request_status,
		failure_reason = v_reason, lock_version = lock_version + 1,
		updated_at = v_now
	WHERE id = v_change.id;
	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', session_user::text, 'producer_change.' || p_outcome,
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'executionId', v_execution.id,
			'reason', pg_catalog.left(v_reason, 500)
		)
	);
END
$function$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_fail_producer_change_preflight_v1(
	p_change_request_id uuid,
	p_outcome text,
	p_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_change public.producer_change_requests%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
	v_reason text := pg_catalog.left(coalesce(p_reason, 'Materialization preflight failed.'), 2000);
BEGIN
	IF p_change_request_id IS NULL OR p_outcome IS NULL OR p_outcome NOT IN ('conflict', 'failed') THEN
		RAISE EXCEPTION 'Preflight outcome must be conflict or failed.';
	END IF;
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer change request % was not found.', p_change_request_id;
	END IF;
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_change.country || ':' || v_change.producer_id)
	);
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id
	FOR UPDATE;
	IF v_change.status::text NOT IN ('approved', 'applying') THEN
		RAISE EXCEPTION 'Only an approved or applying request can fail preflight; current status is %.', v_change.status;
	END IF;

	UPDATE public.producer_change_executions
	SET status = 'expired',
		finished_at = v_now,
		error_message = 'Lease expired before materialization completed.',
		updated_at = v_now
	WHERE change_request_id = v_change.id
		AND status = 'leased'
		AND lease_expires_at <= v_now;

	IF NOT EXISTS (
		SELECT 1
		FROM public.producer_memberships AS membership
		JOIN public.users AS account ON account.id = membership.user_id
		WHERE membership.user_id = v_change.author_user_id
			AND membership.country = v_change.country
			AND membership.producer_id = v_change.producer_id
			AND membership.status::text = 'active'
			AND account.status::text = 'active'
	) THEN
		UPDATE public.producer_change_executions
		SET status = 'cancelled',
			finished_at = v_now,
			error_message = v_reason,
			updated_at = v_now
		WHERE change_request_id = v_change.id
			AND status IN ('leased', 'materialized');
	ELSIF EXISTS (
		SELECT 1 FROM public.producer_change_executions
		WHERE change_request_id = v_change.id
			AND status IN ('leased', 'materialized')
	) THEN
		RAISE EXCEPTION 'An active execution already owns this request.';
	END IF;

	UPDATE public.producer_change_requests
	SET status = p_outcome::public.producer_change_request_status,
		failure_reason = v_reason, lock_version = lock_version + 1,
		updated_at = v_now
	WHERE id = v_change.id;
	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', session_user::text, 'producer_change.' || p_outcome,
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'phase', 'preflight',
			'reason', pg_catalog.left(v_reason, 500)
		)
	);
END
$function$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_finalize_producer_change_execution_v1(
	p_change_request_id uuid,
	p_commit_sha text,
	p_csv_path text,
	p_expected_row_hash text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_change public.producer_change_requests%ROWTYPE;
	v_execution public.producer_change_executions%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
BEGIN
	IF p_change_request_id IS NULL THEN
		RAISE EXCEPTION 'Producer change request id is required.';
	END IF;
	IF p_commit_sha IS NULL OR p_commit_sha !~ '^[0-9a-f]{40}$' THEN
		RAISE EXCEPTION 'Applied commit SHA must contain 40 lowercase hexadecimal characters.';
	END IF;
	IF p_expected_row_hash IS NULL OR p_expected_row_hash !~ '^[0-9a-f]{64}$' THEN
		RAISE EXCEPTION 'Expected producer hash is invalid.';
	END IF;
	IF p_csv_path IS NULL THEN
		RAISE EXCEPTION 'Finalized CSV path is required.';
	END IF;
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer change request % was not found.', p_change_request_id;
	END IF;

	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_change.country || ':' || v_change.producer_id)
	);
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer-file:' || p_csv_path)
	);
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id
	FOR UPDATE;

	IF v_change.status::text = 'applied' AND v_change.applied_commit_sha IS NOT DISTINCT FROM p_commit_sha THEN
		SELECT * INTO v_execution
		FROM public.producer_change_executions
		WHERE change_request_id = v_change.id
			AND status = 'finalized'
			AND applied_commit_sha = p_commit_sha
		ORDER BY finished_at DESC
		LIMIT 1;
		RETURN v_execution.id;
	END IF;
	IF v_change.status::text <> 'applying' THEN
		RAISE EXCEPTION 'Producer change request is %, not awaiting finalization.', v_change.status;
	END IF;

	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE change_request_id = v_change.id
		AND status = 'materialized'
	FOR UPDATE;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'No materialized execution owns this producer change request.';
	END IF;
	IF v_execution.csv_path IS DISTINCT FROM p_csv_path THEN
		RAISE EXCEPTION 'Finalized CSV path differs from the materialized execution.';
	END IF;
	IF v_execution.expected_row_hash IS DISTINCT FROM p_expected_row_hash THEN
		RAISE EXCEPTION 'Finalized producer hash differs from the materialized execution.';
	END IF;
	IF v_execution.operator_key <> session_user::text THEN
		RAISE EXCEPTION 'Producer-change execution belongs to another operator.';
	END IF;
	IF NOT EXISTS (
		SELECT 1
		FROM public.producer_memberships AS membership
		JOIN public.users AS account ON account.id = membership.user_id
		WHERE membership.user_id = v_change.author_user_id
			AND membership.country = v_change.country
			AND membership.producer_id = v_change.producer_id
			AND membership.status::text = 'active'
			AND account.status::text = 'active'
	) THEN
		RAISE EXCEPTION 'The author no longer has active access to this producer.';
	END IF;

	UPDATE public.producer_change_requests
	SET status = 'applied', failure_reason = NULL,
		applied_commit_sha = p_commit_sha, applied_at = v_now,
		lock_version = lock_version + 1, updated_at = v_now
	WHERE id = v_change.id;
	UPDATE public.producer_change_executions
	SET status = 'finalized', applied_commit_sha = p_commit_sha,
		finished_at = v_now, updated_at = v_now
	WHERE id = v_execution.id;
	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', session_user::text, 'producer_change.applied',
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'executionId', v_execution.id,
			'commitSha', p_commit_sha,
			'csvPath', p_csv_path,
			'producerHash', p_expected_row_hash
		)
	);
	RETURN v_execution.id;
END
$function$;--> statement-breakpoint
ALTER FUNCTION public.chisan_complete_producer_change_execution_v1(uuid, text, text[], boolean) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
ALTER FUNCTION public.chisan_fail_producer_change_execution_v1(uuid, text, text) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
ALTER FUNCTION public.chisan_fail_producer_change_preflight_v1(uuid, text, text) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
ALTER FUNCTION public.chisan_finalize_producer_change_execution_v1(uuid, text, text, text) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_complete_producer_change_execution_v1(uuid, text, text[], boolean) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_fail_producer_change_execution_v1(uuid, text, text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_fail_producer_change_preflight_v1(uuid, text, text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_finalize_producer_change_execution_v1(uuid, text, text, text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_complete_producer_change_execution_v1(uuid, text, text[], boolean) TO chisan_producer_change_operator;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_fail_producer_change_execution_v1(uuid, text, text) TO chisan_producer_change_operator;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_fail_producer_change_preflight_v1(uuid, text, text) TO chisan_producer_change_operator;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_finalize_producer_change_execution_v1(uuid, text, text, text) TO chisan_producer_change_operator;--> statement-breakpoint
CREATE FUNCTION public.chisan_recover_producer_change_execution_v1(
	p_change_request_id uuid,
	p_execution_id uuid,
	p_worktree_key text,
	p_source_head_sha text,
	p_observed_row_hash text,
	p_reason text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
DECLARE
	v_change public.producer_change_requests%ROWTYPE;
	v_execution public.producer_change_executions%ROWTYPE;
	v_now timestamp with time zone := pg_catalog.clock_timestamp();
	v_operator text := session_user::text;
	v_reason text := pg_catalog.left(p_reason, 2000);
	v_observed_state text;
BEGIN
	IF p_change_request_id IS NULL OR p_execution_id IS NULL THEN
		RAISE EXCEPTION 'Change request id and execution id are required for recovery.';
	END IF;
	IF p_worktree_key IS NULL OR p_worktree_key !~ '^[0-9a-f]{64}$' THEN
		RAISE EXCEPTION 'Recovery worktree key must be a lowercase SHA-256 value.';
	END IF;
	IF p_source_head_sha IS NULL OR p_source_head_sha !~ '^[0-9a-f]{40}$' THEN
		RAISE EXCEPTION 'Recovery source HEAD must be a full lowercase Git SHA.';
	END IF;
	IF p_observed_row_hash IS NULL OR p_observed_row_hash !~ '^[0-9a-f]{64}$' THEN
		RAISE EXCEPTION 'Recovery producer hash is invalid.';
	END IF;
	IF p_reason IS NULL OR pg_catalog.length(pg_catalog.btrim(v_reason)) < 20 THEN
		RAISE EXCEPTION 'Recovery reason must explain the operator decision.';
	END IF;

	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer change request % was not found.', p_change_request_id;
	END IF;
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id
		AND change_request_id = p_change_request_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Producer-change execution % was not found for this request.', p_execution_id;
	END IF;

	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer:' || v_change.country || ':' || v_change.producer_id)
	);
	PERFORM pg_catalog.pg_advisory_xact_lock(
		pg_catalog.hashtext('producer-file:' || v_execution.csv_path)
	);
	SELECT * INTO v_change
	FROM public.producer_change_requests
	WHERE id = p_change_request_id
	FOR UPDATE;

	IF v_change.status::text IN ('approved', 'conflict')
		AND NOT EXISTS (
			SELECT 1 FROM public.producer_change_executions
			WHERE change_request_id = v_change.id
				AND status IN ('leased', 'materialized')
		) THEN
		SELECT * INTO v_execution
		FROM public.producer_change_executions
		WHERE id = p_execution_id AND status = 'cancelled';
		IF FOUND AND (
			(v_change.status::text = 'approved' AND EXISTS (
				SELECT 1 FROM public.audit_events
				WHERE target_type = 'producer_change_request'
					AND target_id = v_change.id::text
					AND action = 'producer_change.execution_recovered'
					AND actor_key = v_operator
					AND metadata ->> 'previousExecutionId' = p_execution_id::text
					AND metadata ->> 'worktreeKey' = p_worktree_key
					AND metadata ->> 'sourceHeadSha' = p_source_head_sha
					AND metadata ->> 'observedRowHash' = p_observed_row_hash
					AND metadata ->> 'reason' = pg_catalog.left(v_reason, 500)
			))
			OR (v_change.status::text = 'conflict' AND EXISTS (
				SELECT 1 FROM public.audit_events
				WHERE target_type = 'producer_change_request'
					AND target_id = v_change.id::text
					AND action = 'producer_change.execution_cancelled'
					AND actor_key = v_operator
					AND metadata ->> 'executionId' = p_execution_id::text
					AND metadata ->> 'operatorReason' = pg_catalog.left(v_reason, 500)
			))
		) THEN
			RETURN v_execution.id;
		END IF;
	END IF;

	IF v_change.status::text <> 'applying' THEN
		RAISE EXCEPTION 'Producer change request is %, not awaiting recovery.', v_change.status;
	END IF;
	SELECT * INTO v_execution
	FROM public.producer_change_executions
	WHERE id = p_execution_id
		AND change_request_id = v_change.id
		AND status = 'materialized'
	FOR UPDATE;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'The selected materialized execution no longer owns this request.';
	END IF;
	IF v_execution.materialized_at > v_now - pg_catalog.make_interval(hours => 24) THEN
		RAISE EXCEPTION 'Recovery quarantine remains active for this materialized execution.';
	END IF;
	IF NOT EXISTS (
		SELECT 1
		FROM public.producer_memberships AS membership
		JOIN public.users AS account ON account.id = membership.user_id
		WHERE membership.user_id = v_change.author_user_id
			AND membership.country = v_change.country
			AND membership.producer_id = v_change.producer_id
			AND membership.status::text = 'active'
			AND account.status::text = 'active'
	) THEN
		UPDATE public.producer_change_executions
		SET status = 'cancelled', finished_at = v_now,
			error_message = 'Producer access was no longer active during staff recovery.',
			updated_at = v_now
		WHERE id = v_execution.id;
		UPDATE public.producer_change_requests
		SET status = 'conflict',
			failure_reason = 'Producer access was revoked before publication.',
			lock_version = lock_version + 1, updated_at = v_now
		WHERE id = v_change.id;
		INSERT INTO public.audit_events (
			actor_kind, actor_key, action, target_type, target_id, metadata
		) VALUES (
			'service', v_operator, 'producer_change.execution_cancelled',
			'producer_change_request', v_change.id::text,
			pg_catalog.jsonb_build_object(
				'executionId', v_execution.id,
				'previousOperator', v_execution.operator_key,
				'reason', 'Producer access was no longer active during staff recovery.',
				'operatorReason', pg_catalog.left(v_reason, 500)
			)
		);
		RETURN v_execution.id;
	END IF;
	IF v_change.base_row_hash IS NOT DISTINCT FROM p_observed_row_hash THEN
		v_observed_state := 'base';
	ELSIF v_execution.expected_row_hash IS NOT DISTINCT FROM p_observed_row_hash THEN
		v_observed_state := 'approved';
	ELSE
		RAISE EXCEPTION 'Recovery requires the exact reviewed base or approved producer hash.';
	END IF;

	UPDATE public.producer_change_executions
	SET status = 'cancelled', finished_at = v_now,
		error_message = 'Recovered by ' || v_operator || ': ' || v_reason,
		updated_at = v_now
	WHERE id = v_execution.id;

	UPDATE public.producer_change_requests
	SET status = 'approved', failure_reason = NULL,
		lock_version = lock_version + 1, updated_at = v_now
	WHERE id = v_change.id;

	INSERT INTO public.audit_events (
		actor_kind, actor_key, action, target_type, target_id, metadata
	) VALUES (
		'service', v_operator, 'producer_change.execution_recovered',
		'producer_change_request', v_change.id::text,
		pg_catalog.jsonb_build_object(
			'previousExecutionId', v_execution.id,
			'previousOperator', v_execution.operator_key,
			'worktreeKey', p_worktree_key,
			'sourceHeadSha', p_source_head_sha,
			'observedRowHash', p_observed_row_hash,
			'observedState', v_observed_state,
			'reason', pg_catalog.left(v_reason, 500)
		)
	);
	RETURN v_execution.id;
END
$function$;--> statement-breakpoint
ALTER FUNCTION public.chisan_recover_producer_change_execution_v1(uuid, uuid, text, text, text, text) OWNER TO chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE CREATE ON SCHEMA public FROM chisan_producer_change_api_owner;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_recover_producer_change_execution_v1(uuid, uuid, text, text, text, text) FROM PUBLIC, chisan_admin_read, chisan_producer_change_operator;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_recover_producer_change_execution_v1(uuid, uuid, text, text, text, text) TO chisan_producer_change_recovery;
