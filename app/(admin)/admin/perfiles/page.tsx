import Link from "next/link";

import { UserProfileTable } from "@/components/admin/user-profile-table";
import { requireStaffAccount } from "@/lib/accounts/auth";
import {
  ADMIN_USER_PROFILE_VISIBILITY_VIEWS,
  ADMIN_USER_STATUS_VIEWS,
  queryAdminUserProfileCounts,
  queryAdminUserProfiles,
  type AdminUserProfileVisibilityView,
  type AdminUserStatusView,
} from "@/lib/admin/user-profiles";
import { getDatabase } from "@/lib/db";

type AdminProfilesSearchParams = {
  visibility?: string | string[];
  status?: string | string[];
  q?: string | string[];
  page?: string | string[];
};

type AdminProfilesPageProps = {
  searchParams: Promise<AdminProfilesSearchParams>;
};

const VISIBILITY_ORDER: AdminUserProfileVisibilityView[] = [
  "all",
  "public",
  "unlisted",
  "private",
];

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function pageNumber(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : 1;
}

function profileRegistryHref({
  visibility,
  status,
  query,
  page = 1,
}: {
  visibility: AdminUserProfileVisibilityView;
  status: AdminUserStatusView;
  query: string;
  page?: number;
}): string {
  const parameters = new URLSearchParams();
  if (visibility !== "all") parameters.set("visibility", visibility);
  if (status !== "active") parameters.set("status", status);
  if (query) parameters.set("q", query);
  if (page > 1) parameters.set("page", String(page));
  const encoded = parameters.toString();
  return encoded ? `/admin/perfiles?${encoded}` : "/admin/perfiles";
}

export default async function AdminProfilesPage({ searchParams }: AdminProfilesPageProps) {
  const [, parameters] = await Promise.all([requireStaffAccount(), searchParams]);
  const database = getDatabase();
  const [registry, counts] = await Promise.all([
    queryAdminUserProfiles(database, {
      visibility: first(parameters.visibility),
      status: first(parameters.status),
      query: first(parameters.q),
      page: pageNumber(first(parameters.page)),
    }),
    queryAdminUserProfileCounts(database, { status: first(parameters.status) }),
  ]);

  return (
    <div className="admin-content">
      <header className="admin-page-heading">
        <div>
          <p className="catalog-kicker">Chisan account registry</p>
          <h2>User profiles</h2>
          <p>
            Inspect profile visibility and shared producer selections from Chisan-owned account
            state. Identity and hosting providers are not part of this registry.
          </p>
        </div>
        <div className="admin-page-heading__meta">
          <strong>{registry.total}</strong>
          <span>accounts matching this view</span>
        </div>
      </header>

      <nav className="admin-filter-tabs" aria-label="Filter user profiles by visibility">
        {VISIBILITY_ORDER.map((visibility) => {
          const active = registry.options.visibility === visibility;
          return (
            <Link
              key={visibility}
              href={profileRegistryHref({
                visibility,
                status: registry.options.status,
                query: registry.options.query,
              })}
              aria-current={active ? "page" : undefined}
            >
              <span>{ADMIN_USER_PROFILE_VISIBILITY_VIEWS[visibility].label}</span>
              <strong>{counts[visibility]}</strong>
            </Link>
          );
        })}
      </nav>

      <form action="/admin/perfiles" method="get" className="admin-search-form" role="search">
        {registry.options.visibility !== "all" ? (
          <input type="hidden" name="visibility" value={registry.options.visibility} />
        ) : null}
        <label htmlFor="admin-profile-search">Search accounts</label>
        <div>
          <input
            id="admin-profile-search"
            type="search"
            name="q"
            defaultValue={registry.options.query}
            maxLength={120}
            placeholder="Display name, public handle or account UUID"
          />
          <select name="status" defaultValue={registry.options.status} aria-label="Account state">
            {Object.entries(ADMIN_USER_STATUS_VIEWS).map(([value, definition]) => (
              <option key={value} value={value}>
                {definition.label}
              </option>
            ))}
          </select>
          <button type="submit" className="account-button">
            Apply
          </button>
          {registry.options.query || registry.options.status !== "active" ? (
            <Link
              href={profileRegistryHref({
                visibility: registry.options.visibility,
                status: "active",
                query: "",
              })}
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <section aria-labelledby="profile-results-title">
        <div className="admin-section-heading">
          <div>
            <h3 id="profile-results-title">
              {ADMIN_USER_PROFILE_VISIBILITY_VIEWS[registry.options.visibility].label}
            </h3>
            <p>
              Page {registry.options.page} of {registry.totalPages} · {registry.total} matching
              account{registry.total === 1 ? "" : "s"}
            </p>
          </div>
          <code className="admin-schema-label">user-profile/v1</code>
        </div>

        {registry.items.length ? (
          <UserProfileTable items={registry.items} />
        ) : (
          <p className="account-empty">No accounts match this view.</p>
        )}

        {registry.totalPages > 1 ? (
          <nav className="admin-pagination" aria-label="User profile pages">
            {registry.options.page > 1 ? (
              <Link
                href={profileRegistryHref({
                  visibility: registry.options.visibility,
                  status: registry.options.status,
                  query: registry.options.query,
                  page: registry.options.page - 1,
                })}
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span>
              Page {registry.options.page} of {registry.totalPages}
            </span>
            {registry.options.page < registry.totalPages ? (
              <Link
                href={profileRegistryHref({
                  visibility: registry.options.visibility,
                  status: registry.options.status,
                  query: registry.options.query,
                  page: registry.options.page + 1,
                })}
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>

      <aside className="admin-state-callout">
        <h3>Provider-neutral by design</h3>
        <p>
          This registry uses the durable Chisan user UUID and PostgreSQL account state. Replacing
          the sign-in provider, database host or deployment platform does not change profile,
          favorite or public-selection identity.
        </p>
      </aside>
    </div>
  );
}
