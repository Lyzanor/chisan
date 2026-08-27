import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import type { PublicProfileVisibility } from "@/lib/accounts/public-profile-policy";
import type { Database } from "@/lib/db";
import { favorites, users, type User } from "@/lib/db/schema";

export const ADMIN_USER_PROFILE_PAGE_SIZE = 25;
export const ADMIN_USER_PROFILE_MAX_PAGE_SIZE = 100;

export const ADMIN_USER_PROFILE_VISIBILITY_VIEWS = {
  all: { label: "All profiles" },
  public: { label: "Public" },
  unlisted: { label: "Unlisted" },
  private: { label: "Private" },
} as const;

export const ADMIN_USER_STATUS_VIEWS = {
  active: { label: "Active accounts" },
  suspended: { label: "Suspended accounts" },
  deleted: { label: "Deleted accounts" },
  all: { label: "All account states" },
} as const;

export type AdminUserProfileVisibilityView =
  keyof typeof ADMIN_USER_PROFILE_VISIBILITY_VIEWS;
export type AdminUserStatusView = keyof typeof ADMIN_USER_STATUS_VIEWS;

export type AdminUserProfileListOptions = {
  visibility?: string | null;
  status?: string | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
};

export type NormalizedAdminUserProfileListOptions = {
  visibility: AdminUserProfileVisibilityView;
  status: AdminUserStatusView;
  query: string;
  page: number;
  pageSize: number;
};

export type AdminUserProfileListItem = {
  id: string;
  status: User["status"];
  displayName: string | null;
  publicHandle: string | null;
  visibility: PublicProfileVisibility;
  profileKind: User["profileKind"];
  favoriteCount: number;
  sharedProducerCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserProfileList = {
  items: AdminUserProfileListItem[];
  options: NormalizedAdminUserProfileListOptions;
  total: number;
  totalPages: number;
};

export type AdminUserProfileCounts = Record<PublicProfileVisibility | "all", number>;

function positiveInteger(value: number | undefined, fallback: number, maximum: number): number {
  if (!Number.isSafeInteger(value) || !value || value < 1) return fallback;
  return Math.min(value, maximum);
}

function profileVisibilityView(value: string | null | undefined): AdminUserProfileVisibilityView {
  return value && value in ADMIN_USER_PROFILE_VISIBILITY_VIEWS
    ? (value as AdminUserProfileVisibilityView)
    : "all";
}

function userStatusView(value: string | null | undefined): AdminUserStatusView {
  return value && value in ADMIN_USER_STATUS_VIEWS
    ? (value as AdminUserStatusView)
    : "active";
}

export function normalizeAdminUserProfileListOptions(
  input: AdminUserProfileListOptions = {},
): NormalizedAdminUserProfileListOptions {
  return {
    visibility: profileVisibilityView(input.visibility),
    status: userStatusView(input.status),
    query: input.query?.replace(/\s+/g, " ").trim().slice(0, 120) ?? "",
    page: positiveInteger(input.page, 1, 100_000),
    pageSize: positiveInteger(
      input.pageSize,
      ADMIN_USER_PROFILE_PAGE_SIZE,
      ADMIN_USER_PROFILE_MAX_PAGE_SIZE,
    ),
  };
}

function statusCondition(status: AdminUserStatusView): SQL | undefined {
  return status === "all" ? undefined : eq(users.status, status);
}

function listConditions(options: NormalizedAdminUserProfileListOptions): SQL[] {
  const conditions: SQL[] = [];
  const accountStatus = statusCondition(options.status);
  if (accountStatus) conditions.push(accountStatus);
  if (options.visibility !== "all") {
    conditions.push(eq(users.publicProfileVisibility, options.visibility));
  }
  if (options.query) {
    const pattern = `%${options.query}%`;
    const search = or(
      ilike(users.displayName, pattern),
      ilike(users.publicHandle, pattern),
      sql`${users.id}::text ILIKE ${pattern}`,
    );
    if (search) conditions.push(search);
  }
  return conditions;
}

export async function queryAdminUserProfiles(
  database: Database,
  input: AdminUserProfileListOptions = {},
): Promise<AdminUserProfileList> {
  const options = normalizeAdminUserProfileListOptions(input);
  const conditions = listConditions(options);
  const where = conditions.length ? and(...conditions) : undefined;
  const offset = (options.page - 1) * options.pageSize;

  const [rows, [totalRow]] = await Promise.all([
    database
      .select({
        id: users.id,
        status: users.status,
        displayName: users.displayName,
        publicHandle: users.publicHandle,
        visibility: users.publicProfileVisibility,
        profileKind: users.profileKind,
        favoriteCount: count(favorites.producerId),
        sharedProducerCount:
          sql<number>`count(${favorites.producerId}) filter (where ${favorites.showOnPublicProfile} = true)`.mapWith(
            Number,
          ),
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(favorites, eq(favorites.userId, users.id))
      .where(where)
      .groupBy(
        users.id,
        users.status,
        users.displayName,
        users.publicHandle,
        users.publicProfileVisibility,
        users.profileKind,
        users.createdAt,
        users.updatedAt,
      )
      .orderBy(desc(users.updatedAt), desc(users.id))
      .limit(options.pageSize)
      .offset(offset),
    database.select({ value: count() }).from(users).where(where),
  ]);
  const total = Number(totalRow?.value ?? 0);

  return {
    items: rows.map((row) => ({
      ...row,
      favoriteCount: Number(row.favoriteCount),
      sharedProducerCount: Number(row.sharedProducerCount),
    })),
    options,
    total,
    totalPages: Math.max(1, Math.ceil(total / options.pageSize)),
  };
}

export async function queryAdminUserProfileCounts(
  database: Database,
  input: Pick<AdminUserProfileListOptions, "status"> = {},
): Promise<AdminUserProfileCounts> {
  const status = userStatusView(input.status);
  const rows = await database
    .select({ visibility: users.publicProfileVisibility, value: count() })
    .from(users)
    .where(statusCondition(status))
    .groupBy(users.publicProfileVisibility);
  const counts: AdminUserProfileCounts = {
    all: 0,
    private: 0,
    unlisted: 0,
    public: 0,
  };
  for (const row of rows) {
    const value = Number(row.value);
    counts[row.visibility] = value;
    counts.all += value;
  }
  return counts;
}
