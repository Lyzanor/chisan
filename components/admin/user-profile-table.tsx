import Link from "next/link";

import { formatAdminDate } from "@/components/admin/producer-change-table";
import type { AdminUserProfileListItem } from "@/lib/admin/user-profiles";

const VISIBILITY_LABELS = {
  private: "Private",
  unlisted: "Unlisted",
  public: "Public",
} as const;

function visibilityTone(visibility: AdminUserProfileListItem["visibility"]): string {
  if (visibility === "public") return "positive";
  if (visibility === "unlisted") return "active";
  return "neutral";
}

function accountStatusTone(status: AdminUserProfileListItem["status"]): string {
  if (status === "active") return "positive";
  if (status === "suspended") return "warning";
  return "danger";
}

function publicProfileHref(item: AdminUserProfileListItem): string | null {
  if (
    item.status !== "active" ||
    !item.publicHandle ||
    item.visibility === "private"
  ) {
    return null;
  }
  return `/u/${item.publicHandle}`;
}

export function UserProfileTable({ items }: { items: AdminUserProfileListItem[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">Account</th>
            <th scope="col">Public profile</th>
            <th scope="col">Visibility</th>
            <th scope="col">Producer selection</th>
            <th scope="col">Account state</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const profileHref = publicProfileHref(item);
            return (
              <tr key={item.id} data-user-id={item.id}>
                <td>
                  <strong>{item.displayName || "Unnamed account"}</strong>
                  <span className="admin-table__secondary">
                    {item.profileKind === "producer" ? "Producer account" : "User account"}
                  </span>
                  <code className="admin-request-id">{item.id}</code>
                </td>
                <td>
                  {profileHref ? (
                    <Link className="admin-table__primary-link" href={profileHref}>
                      @{item.publicHandle}
                    </Link>
                  ) : item.publicHandle ? (
                    <strong>@{item.publicHandle}</strong>
                  ) : (
                    <span>Not configured</span>
                  )}
                  <span className="admin-table__secondary">
                    {profileHref
                      ? "Open profile"
                      : item.publicHandle
                        ? "Route retained but not visible"
                        : "No public handle assigned"}
                  </span>
                </td>
                <td>
                  <span className={`admin-status admin-status--${visibilityTone(item.visibility)}`}>
                    <span className="admin-status__dot" aria-hidden="true" />
                    {VISIBILITY_LABELS[item.visibility]}
                  </span>
                </td>
                <td>
                  <strong>{item.sharedProducerCount} shared</strong>
                  <span className="admin-table__secondary">
                    {item.favoriteCount} saved favorite{item.favoriteCount === 1 ? "" : "s"}
                  </span>
                </td>
                <td>
                  <span className={`admin-status admin-status--${accountStatusTone(item.status)}`}>
                    <span className="admin-status__dot" aria-hidden="true" />
                    {item.status[0].toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="admin-table__secondary">
                    Created {formatAdminDate(item.createdAt)}
                  </span>
                </td>
                <td>
                  <time dateTime={item.updatedAt.toISOString()}>
                    {formatAdminDate(item.updatedAt)}
                  </time>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
