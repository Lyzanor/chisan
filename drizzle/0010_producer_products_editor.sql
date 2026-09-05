ALTER TABLE "producer_change_requests" DROP CONSTRAINT "producer_change_requests_submission_check";--> statement-breakpoint
ALTER TABLE "producer_change_executions" ADD COLUMN "expected_content_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD COLUMN "content_change" jsonb;--> statement-breakpoint
ALTER TABLE "producer_change_executions" ADD CONSTRAINT "producer_change_executions_content_hash_check" CHECK ("producer_change_executions"."expected_content_hash" IS NULL OR "producer_change_executions"."expected_content_hash" ~ '^[a-f0-9]{64}$');--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_content_check" CHECK ("producer_change_requests"."content_change" IS NULL OR (jsonb_typeof("producer_change_requests"."content_change") = 'object' AND "producer_change_requests"."required_entitlement_key" IS NOT DISTINCT FROM 'producer.profile.premium' AND ("producer_change_requests"."content_change"->>'version') = '1' AND ("producer_change_requests"."content_change"->>'baseHash') ~ '^[a-f0-9]{64}$' AND ("producer_change_requests"."content_change"->>'requestedHash') ~ '^[a-f0-9]{64}$' AND jsonb_typeof("producer_change_requests"."content_change"->'products') = 'array' AND ("producer_change_requests"."content_change"->'base'->>'country') = "producer_change_requests"."country" AND ("producer_change_requests"."content_change"->'base'->>'producer_id') = "producer_change_requests"."producer_id"::text) IS TRUE);--> statement-breakpoint
ALTER TABLE "producer_change_requests" ADD CONSTRAINT "producer_change_requests_submission_check" CHECK ("producer_change_requests"."status" IN ('draft', 'withdrawn', 'conflict', 'failed') OR ("producer_change_requests"."submitted_at" IS NOT NULL AND ("producer_change_requests"."patch" <> '{}'::jsonb OR "producer_change_requests"."content_change" IS NOT NULL)));
--> statement-breakpoint
GRANT CREATE ON SCHEMA public TO chisan_producer_change_api_owner;
--> statement-breakpoint
GRANT SELECT (content_change) ON public.producer_change_requests TO chisan_admin_read;
--> statement-breakpoint
GRANT SELECT (expected_content_hash) ON public.producer_change_executions TO chisan_admin_read;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_begin_producer_change_execution_v1(
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

	IF EXISTS (SELECT 1 FROM public.producer_change_requests WHERE id = p_change_request_id AND content_change IS NOT NULL) THEN
		RAISE EXCEPTION 'Product proposals require the v2 publication workflow.';
	END IF;
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
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_begin_producer_change_execution_v2(
	p_execution_id uuid,
	p_change_request_id uuid,
	p_worktree_key text,
	p_csv_path text,
	p_source_head_sha text,
	p_expected_row_hash text,
	p_lease_seconds integer DEFAULT 900,
	p_expected_content_hash text DEFAULT NULL
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
	IF p_expected_content_hash IS DISTINCT FROM (SELECT content_change->>'requestedHash' FROM public.producer_change_requests WHERE id = p_change_request_id) THEN RAISE EXCEPTION 'Product proposal hash mismatch.'; END IF;
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
			AND v_existing.expected_content_hash IS NOT DISTINCT FROM p_expected_content_hash
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
		worktree_key, source_head_sha, expected_row_hash, expected_content_hash, lease_expires_at, csv_path
	) VALUES (
		p_execution_id, v_change.id, v_change.country, v_change.producer_id,
		'leased', v_operator, p_worktree_key, p_source_head_sha,
		p_expected_row_hash, p_expected_content_hash,
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
$function$;
--> statement-breakpoint
ALTER FUNCTION public.chisan_begin_producer_change_execution_v2(uuid, uuid, text, text, text, text, integer, text) OWNER TO chisan_producer_change_api_owner;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_begin_producer_change_execution_v2(uuid, uuid, text, text, text, text, integer, text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_begin_producer_change_execution_v2(uuid, uuid, text, text, text, text, integer, text) TO chisan_producer_change_operator;
--> statement-breakpoint
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

	IF EXISTS (SELECT 1 FROM public.producer_change_executions WHERE id = p_execution_id AND expected_content_hash IS NOT NULL) THEN
		RAISE EXCEPTION 'Product proposals require the v2 publication workflow.';
	END IF;
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
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_complete_producer_change_execution_v2(
	p_execution_id uuid,
	p_expected_row_hash text,
	p_fields text[],
	p_already_present boolean DEFAULT false,
	p_expected_content_hash text DEFAULT NULL
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
	IF p_expected_content_hash IS DISTINCT FROM (SELECT expected_content_hash FROM public.producer_change_executions WHERE id = p_execution_id) THEN RAISE EXCEPTION 'Product execution hash mismatch.'; END IF;
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
$function$;
--> statement-breakpoint
ALTER FUNCTION public.chisan_complete_producer_change_execution_v2(uuid, text, text[], boolean, text) OWNER TO chisan_producer_change_api_owner;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_complete_producer_change_execution_v2(uuid, text, text[], boolean, text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_complete_producer_change_execution_v2(uuid, text, text[], boolean, text) TO chisan_producer_change_operator;
--> statement-breakpoint
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

	IF EXISTS (SELECT 1 FROM public.producer_change_requests WHERE id = p_change_request_id AND content_change IS NOT NULL) THEN
		RAISE EXCEPTION 'Product proposals require the v2 publication workflow.';
	END IF;
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
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_finalize_producer_change_execution_v2(
	p_change_request_id uuid,
	p_commit_sha text,
	p_csv_path text,
	p_expected_row_hash text,
	p_expected_content_hash text DEFAULT NULL
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
	IF p_expected_content_hash IS DISTINCT FROM (SELECT content_change->>'requestedHash' FROM public.producer_change_requests WHERE id = p_change_request_id) THEN RAISE EXCEPTION 'Product proposal hash mismatch.'; END IF;
	IF EXISTS (SELECT 1 FROM public.producer_change_executions WHERE change_request_id = p_change_request_id AND status IN ('materialized', 'finalized') AND expected_content_hash IS DISTINCT FROM p_expected_content_hash) THEN RAISE EXCEPTION 'Product execution hash mismatch.'; END IF;
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
$function$;
--> statement-breakpoint
ALTER FUNCTION public.chisan_finalize_producer_change_execution_v2(uuid, text, text, text, text) OWNER TO chisan_producer_change_api_owner;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_finalize_producer_change_execution_v2(uuid, text, text, text, text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_finalize_producer_change_execution_v2(uuid, text, text, text, text) TO chisan_producer_change_operator;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_recover_producer_change_execution_v1(
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

	IF EXISTS (SELECT 1 FROM public.producer_change_requests WHERE id = p_change_request_id AND content_change IS NOT NULL) THEN
		RAISE EXCEPTION 'Product proposals require the v2 publication workflow.';
	END IF;
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
$function$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.chisan_recover_producer_change_execution_v2(
	p_change_request_id uuid,
	p_execution_id uuid,
	p_worktree_key text,
	p_source_head_sha text,
	p_observed_row_hash text,
	p_reason text,
	p_observed_content_hash text DEFAULT NULL
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
	IF EXISTS (SELECT 1 FROM public.producer_change_requests WHERE id = p_change_request_id AND content_change IS NOT NULL) AND NOT EXISTS (SELECT 1 FROM public.producer_change_requests WHERE id = p_change_request_id AND p_observed_content_hash IN (content_change->>'baseHash', content_change->>'requestedHash')) THEN RAISE EXCEPTION 'Recovery requires the exact base or approved product state.'; END IF;
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
$function$;
--> statement-breakpoint
ALTER FUNCTION public.chisan_recover_producer_change_execution_v2(uuid, uuid, text, text, text, text, text) OWNER TO chisan_producer_change_api_owner;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_recover_producer_change_execution_v2(uuid, uuid, text, text, text, text, text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.chisan_recover_producer_change_execution_v2(uuid, uuid, text, text, text, text, text) TO chisan_producer_change_recovery;
--> statement-breakpoint
CREATE FUNCTION public.chisan_lock_reviewed_profile_payload()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $function$
BEGIN
  IF OLD.status::text <> 'draft' AND (
    NEW.base_snapshot IS DISTINCT FROM OLD.base_snapshot OR
    NEW.base_row_hash IS DISTINCT FROM OLD.base_row_hash OR
    NEW.patch IS DISTINCT FROM OLD.patch OR
    NEW.content_change IS DISTINCT FROM OLD.content_change OR
    NEW.required_entitlement_key IS DISTINCT FROM OLD.required_entitlement_key OR
    NEW.author_note IS DISTINCT FROM OLD.author_note
  ) THEN RAISE EXCEPTION 'A submitted profile proposal is immutable.'; END IF;
  IF NEW.country IS DISTINCT FROM OLD.country OR NEW.producer_id IS DISTINCT FROM OLD.producer_id OR NEW.author_user_id IS DISTINCT FROM OLD.author_user_id THEN
    RAISE EXCEPTION 'Proposal identity is immutable.';
  END IF;
  RETURN NEW;
END
$function$;
--> statement-breakpoint
CREATE TRIGGER chisan_reviewed_profile_payload BEFORE UPDATE ON public.producer_change_requests FOR EACH ROW EXECUTE FUNCTION public.chisan_lock_reviewed_profile_payload();
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.chisan_lock_reviewed_profile_payload() FROM PUBLIC;
--> statement-breakpoint
REVOKE CREATE ON SCHEMA public FROM chisan_producer_change_api_owner;
