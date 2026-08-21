# Chisan Operations

## Purpose

This is the production runbook for <https://chisan.app>. It owns environment
configuration, preflight, deployment, smoke checks, rollback, backups and secret
handling. `docs/ACCOUNT_SYSTEM.md` owns account semantics and migrations;
`AGENTS.md` owns repository and Git rules. Never copy live deployment IDs,
resource identifiers or secret values into this file.

## Environment contract

Production uses its dedicated Clerk instance and PostgreSQL database. Local and
Preview must never write account data through Production credentials. Preview
may enable accounts only when both its Clerk credentials and database are
non-Production and its database is isolated. If Vercel exposes the Production
database integration to Preview, keep `CHISAN_ACCOUNTS_ENABLED=false` and
`KM0_ACCOUNTS_ENABLED=false` there: Preview may test the public catalog and the
disabled-account fallback, but not registration, favorites, claims, reviews or
producer changes.

When accounts are enabled, configure the variables in `.env.example`. Production
uses `NEXT_PUBLIC_APP_URL=https://chisan.app`. `CHISAN_ACCOUNTS_ENABLED` and
`CHISAN_ADMIN_EMAILS` are canonical; `KM0_ACCOUNTS_ENABLED` and
`KM0_ADMIN_EMAILS` are temporary legacy fallbacks during the rename. A canonical
value wins when both exist. Migrate one environment at a time, verify it, then
remove the legacy record.

`CHISAN_ADMIN_EMAILS` is bootstrap provisioning, not request-time authorization.
Remove it after the permanent admin grant exists; a staff grant in PostgreSQL is
the durable authority.

## Preflight

1. Run `git status --short`, `git diff --name-status` and `git diff --stat`.
   Preserve unrelated work and confirm the release contains only the intended
   scope.
2. Run `npx pnpm verify:ai`. A data-only release may use
   `npx pnpm verify:data`, but any code, validator, policy, migration or account
   change requires the full gate.
3. Run `npx pnpm db:check`. When accounts are enabled in the target environment,
   run the read-only `npx pnpm db:assert-current` against that exact database.
4. Confirm Production has the Chisan domain, Production Clerk keys, signed
   webhook secret, Production database URLs and the canonical app origin. Check
   names and scopes without printing values.
5. For a schema change, take a recoverable database backup and prove the
   migration in an isolated database before touching Production. Migrations must
   be expand-first and backward compatible; a build never applies DDL.
6. Exercise the public change and disabled-account fallback in Preview. Exercise
   account writes there only after proving its resources are isolated from
   Production; otherwise use a purpose-built isolated test environment.

## Database and deployment order

For a release with committed migrations:

1. keep the new capability disabled;
2. apply `npx pnpm db:migrate` explicitly with the target's direct migration
   connection;
3. run `npx pnpm db:assert-current` against the target runtime database;
4. deploy compatible application code to Preview and complete the public and
   disabled-account smoke checks;
5. enable and verify the capability in Preview only if its account resources are
   isolated; otherwise keep both account flags false and use an isolated test
   environment for account-write checks;
6. repeat the migration assertion for Production, then push the verified commit
   to `main` once.

GitHub triggers the Vercel Production build from `main`; do not create a second
manual deployment for the same commit. The build asserts migration compatibility
and fails closed when accounts are enabled against an outdated schema.

## Production smoke check

Use a real authorized account only where authentication is required. Do not
submit a fictitious ownership claim or producer change merely to test a form.

- Open `/`, one area and one producer detail; confirm canonical links and the
  sitemap use `https://chisan.app`.
- Signed out, confirm `/cuenta` and `/admin` follow the expected authentication
  or authorization path and public catalog pages remain usable.
- Signed in, confirm the internal profile loads, add and remove one favorite,
  and leave the account in its original state.
- Confirm an unauthorized producer edit redirects with a controlled message and
  does not produce a 5xx response.
- With staff access, open `/admin`, `/admin/reclamaciones` and `/admin/cambios`;
  inspect queues without changing real decisions.
- Send no hand-built signed webhook. An unsigned request may be used only to
  confirm rejection; use Clerk's test-event facility for an end-to-end signed
  event.
- Inspect runtime logs for new 5xx responses, authorization exceptions, database
  errors or repeated webhook failures.

## Rollback and containment

If the account subsystem fails while the public catalog is healthy, set
`CHISAN_ACCOUNTS_ENABLED=false` and redeploy the same known code path. This is
the first containment action because it removes account writes without taking
the CSV catalog offline.

For an application regression, promote the last known-good Vercel deployment or
revert the offending commit on `main`, then repeat the smoke check. Do not deploy
an unreviewed local build as a shortcut.

Do not run destructive down migrations. Expand-first migrations remain in place
while old compatible code runs; repair forward in a new migration. Restore a
database backup only for confirmed data loss or corruption, into an isolated
database first, with account writes stopped and an explicit reconciliation plan
for events received after the backup.

Rotate a Clerk, database or webhook secret immediately if it appears in a log,
screenshot, chat, shell history or repository. Update the affected environment,
redeploy, verify, and revoke the exposed value only after the replacement works.

## Backup, restore and provider exit

Before a migration, identity-provider exit or high-risk account release:

1. stop account writes while leaving the public catalog available;
2. take an encrypted PostgreSQL backup and a Clerk user export, including
   password hashes where supported;
3. record non-PII row counts for users, identities, favorites, claims,
   memberships, changes, grants, audit events and entitlements, plus checksums of
   the encrypted artifacts;
4. restore the database into an isolated environment, run
   `npx pnpm db:assert-current`, and reconcile the recorded counts;
5. retain artifacts only under the approved access and retention policy, then
   destroy the test restore when the drill is complete.

The PostgreSQL backup contains all Chisan-owned account and domain state. Clerk
sessions are disposable, and MFA, passkeys or social connections may require
re-enrollment after a provider migration. Follow the identity mapping procedure
in `docs/ACCOUNT_SYSTEM.md` rather than rewriting domain foreign keys.

There is no self-service Chisan erasure flow in the current release. Do not
simulate one with ad hoc SQL or by deleting only the Clerk user; preserve the
request and escalate it to an audited implementation that can redact PII,
revoke resources and retain only the minimum integrity history coherently.
