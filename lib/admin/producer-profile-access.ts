import {
  and,
  count,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  type SQL,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { canAdminRevokeProfileUpgradeGift } from "@/lib/accounts/producer-profile-upgrade-domain";
import {
  PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
  PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
  PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
  PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
} from "@/lib/accounts/producer-profile-upgrade-policy";
import { buildProducerHref } from "@/lib/catalog-navigation";
import {
  findProducersByIds,
  type LocatedProducerCsvRow,
} from "@/lib/csv-catalog";
import type { Database } from "@/lib/db";
import {
  entitlements,
  producerMemberships,
  producerProfileUpgradeRequests,
  users,
} from "@/lib/db/schema";

export const ADMIN_PROFILE_ACCESS_PAGE_SIZE = 25;
export const ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE = 10;

export type AdminProfileAccessState = "active" | "inactive" | "all";
export type AdminProfileAccessSource = "gift" | "payment" | "all";

export type AdminProfileAccessListOptions = {
  page?: number;
  source?: string | null;
  state?: string | null;
};

export type AdminProfileGiftCandidateOptions = {
  page?: number;
  query?: string | null;
};

export type AdminProfileActor = {
  id: string;
  displayName: string | null;
};

export type AdminProfileAccessItem = {
  entitlementId: string;
  country: string;
  producerId: number;
  producer: LocatedProducerCsvRow | null;
  publicPath: string | null;
  state: "active" | "expired" | "revoked";
  source: "gift" | "payment" | "unknown";
  paymentProvider: string | null;
  sourceReference: string | null;
  startsAt: Date;
  revokedAt: Date | null;
  owner: AdminProfileActor | null;
  purchaser: AdminProfileActor | null;
  grantedBy: AdminProfileActor | null;
  revokedBy: AdminProfileActor | null;
  grantReason: string | null;
  revocationReason: string | null;
  canRevokeGift: boolean;
};

export type AdminProfileAccessList = {
  items: AdminProfileAccessItem[];
  page: number;
  source: AdminProfileAccessSource;
  state: AdminProfileAccessState;
  total: number;
  totalPages: number;
};

export type AdminProfileGiftCandidate = {
  country: string;
  producerId: number;
  producer: LocatedProducerCsvRow;
  publicPath: string;
  owner: AdminProfileActor;
  eligibility: "eligible" | "active_access" | "commercial_request_open";
};

export type AdminProfileGiftCandidateList = {
  items: AdminProfileGiftCandidate[];
  page: number;
  query: string;
  total: number;
  totalPages: number;
};

const requesterUsers = alias(users, "profile_upgrade_requesters");
const currentOwnerMemberships = alias(
  producerMemberships,
  "profile_upgrade_current_owner_memberships",
);
const currentOwnerUsers = alias(users, "profile_upgrade_current_owner_users");

function positivePage(value: number | undefined): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? Math.min(value, 100_000)
    : 1;
}

function accessState(value: string | null | undefined): AdminProfileAccessState {
  return value === "inactive" || value === "all" ? value : "active";
}

function accessSource(value: string | null | undefined): AdminProfileAccessSource {
  return value === "gift" || value === "payment" ? value : "all";
}

function publicPath(producer: LocatedProducerCsvRow | null): string | null {
  return producer
    ? buildProducerHref(producer, {
        area: producer.area,
        country: producer.country,
      })
    : null;
}

function metadataString(
  metadata: Record<string, unknown>,
  key: string,
  maximum = 1_000,
): string | null {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 && value.length <= maximum
    ? value
    : null;
}

function uuidMetadata(metadata: Record<string, unknown>, key: string): string | null {
  const value = metadataString(metadata, key, 36);
  return value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
    ? value
    : null;
}

function effectiveEntitlementState(input: {
  expiresAt: Date | null;
  revokedAt: Date | null;
  startsAt: Date;
  status: "active" | "expired" | "revoked";
}): "active" | "expired" | "revoked" {
  if (input.status === "revoked" || input.revokedAt) return "revoked";
  if (
    input.status === "expired" ||
    input.startsAt > new Date() ||
    (input.expiresAt !== null && input.expiresAt <= new Date())
  ) {
    return "expired";
  }
  return "active";
}

function accessConditions(input: {
  source: AdminProfileAccessSource;
  state: AdminProfileAccessState;
}): SQL[] {
  const conditions: SQL[] = [
    eq(entitlements.subjectKind, "producer"),
    eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
  ];
  const now = new Date();
  if (input.state === "active") {
    const active = or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now));
    conditions.push(
      eq(entitlements.status, "active"),
      lte(entitlements.startsAt, now),
      isNull(entitlements.revokedAt),
    );
    if (active) conditions.push(active);
  } else if (input.state === "inactive") {
    const inactive = or(
      inArray(entitlements.status, ["expired", "revoked"]),
      gt(entitlements.startsAt, now),
      lte(entitlements.expiresAt, now),
      isNotNull(entitlements.revokedAt),
    );
    if (inactive) conditions.push(inactive);
  }
  if (input.source === "gift") {
    conditions.push(
      eq(
        entitlements.source,
        PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE,
      ),
    );
  } else if (input.source === "payment") {
    conditions.push(
      eq(
        entitlements.source,
        PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE,
      ),
    );
  }
  return conditions;
}

export async function queryAdminProfileAccess(
  database: Database,
  input: AdminProfileAccessListOptions = {},
): Promise<AdminProfileAccessList> {
  const page = positivePage(input.page);
  const source = accessSource(input.source);
  const state = accessState(input.state);
  const where = and(...accessConditions({ source, state }));
  const [rows, [totalRow]] = await Promise.all([
    database
      .select({
        entitlementId: entitlements.id,
        country: entitlements.producerCountry,
        producerId: entitlements.producerId,
        entitlementStatus: entitlements.status,
        entitlementSource: entitlements.source,
        sourceReference: entitlements.sourceReference,
        metadata: entitlements.metadata,
        startsAt: entitlements.startsAt,
        expiresAt: entitlements.expiresAt,
        revokedAt: entitlements.revokedAt,
        requesterUserId: producerProfileUpgradeRequests.requesterUserId,
        requesterDisplayName: requesterUsers.displayName,
        paymentProvider: producerProfileUpgradeRequests.paymentProvider,
        ownerUserId: currentOwnerUsers.id,
        ownerDisplayName: currentOwnerUsers.displayName,
      })
      .from(entitlements)
      .leftJoin(
        producerProfileUpgradeRequests,
        eq(producerProfileUpgradeRequests.entitlementId, entitlements.id),
      )
      .leftJoin(
        requesterUsers,
        eq(producerProfileUpgradeRequests.requesterUserId, requesterUsers.id),
      )
      .leftJoin(
        currentOwnerMemberships,
        and(
          eq(currentOwnerMemberships.country, entitlements.producerCountry),
          eq(currentOwnerMemberships.producerId, entitlements.producerId),
          eq(currentOwnerMemberships.role, "owner"),
          eq(currentOwnerMemberships.status, "active"),
        ),
      )
      .leftJoin(
        currentOwnerUsers,
        and(
          eq(currentOwnerMemberships.userId, currentOwnerUsers.id),
          eq(currentOwnerUsers.status, "active"),
        ),
      )
      .where(where)
      .orderBy(desc(entitlements.createdAt), desc(entitlements.id))
      .limit(ADMIN_PROFILE_ACCESS_PAGE_SIZE)
      .offset((page - 1) * ADMIN_PROFILE_ACCESS_PAGE_SIZE),
    database.select({ value: count() }).from(entitlements).where(where),
  ]);

  const producers = await findProducersByIds(
    rows.map((row) => ({
      country: row.country ?? "",
      producerId: row.producerId ?? 0,
    })),
  );
  const actorIds = [
    ...new Set(
      rows.flatMap((row) =>
        [
          uuidMetadata(row.metadata, "grantedByUserId"),
          uuidMetadata(row.metadata, "revokedByUserId"),
        ].filter((value): value is string => Boolean(value)),
      ),
    ),
  ];
  const actorRows = actorIds.length
    ? await database
        .select({ id: users.id, displayName: users.displayName })
        .from(users)
        .where(inArray(users.id, actorIds))
    : [];
  const actors = new Map(
    actorRows.map((actor) => [
      actor.id,
      { id: actor.id, displayName: actor.displayName },
    ]),
  );

  const items = rows.flatMap((row, index): AdminProfileAccessItem[] => {
    if (!row.country || !row.producerId) return [];
    const producer = producers[index];
    const stateValue = effectiveEntitlementState({
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      startsAt: row.startsAt,
      status: row.entitlementStatus,
    });
    const sourceValue =
      row.entitlementSource ===
      PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE
        ? "gift"
        : row.entitlementSource ===
            PRODUCER_PROFILE_UPGRADE_PAID_ENTITLEMENT_SOURCE
          ? "payment"
          : "unknown";
    const grantedByUserId = uuidMetadata(row.metadata, "grantedByUserId");
    const revokedByUserId = uuidMetadata(row.metadata, "revokedByUserId");
    return [
      {
        entitlementId: row.entitlementId,
        country: row.country,
        producerId: row.producerId,
        producer,
        publicPath: publicPath(producer),
        state: stateValue,
        source: sourceValue,
        paymentProvider: row.paymentProvider,
        sourceReference: row.sourceReference,
        startsAt: row.startsAt,
        revokedAt: row.revokedAt,
        owner: row.ownerUserId
          ? { id: row.ownerUserId, displayName: row.ownerDisplayName }
          : null,
        purchaser: row.requesterUserId
          ? { id: row.requesterUserId, displayName: row.requesterDisplayName }
          : null,
        grantedBy: grantedByUserId ? actors.get(grantedByUserId) ?? null : null,
        revokedBy: revokedByUserId ? actors.get(revokedByUserId) ?? null : null,
        grantReason: metadataString(row.metadata, "grantReason"),
        revocationReason: metadataString(row.metadata, "revocationReason"),
        canRevokeGift: canAdminRevokeProfileUpgradeGift({
          key: PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY,
          source: row.entitlementSource,
          status: row.entitlementStatus,
          subjectKind: "producer",
        }),
      },
    ];
  });
  const total = Number(totalRow?.value ?? 0);
  return {
    items,
    page,
    source,
    state,
    total,
    totalPages: Math.max(1, Math.ceil(total / ADMIN_PROFILE_ACCESS_PAGE_SIZE)),
  };
}

function normalizedSearch(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function producerSearchText(input: {
  country: string;
  owner: AdminProfileActor;
  producer: LocatedProducerCsvRow;
}): string {
  return normalizedSearch(
    [
      input.country,
      input.producer.producerId,
      input.producer.name,
      input.producer.city,
      input.producer.slug,
      input.owner.displayName,
      input.owner.id,
    ].join(" "),
  );
}

function producerIdentity(country: string, producerId: number): string {
  return `${country}:${producerId}`;
}

function activeOwnerConditions(): SQL[] {
  return [
    eq(producerMemberships.role, "owner"),
    eq(producerMemberships.status, "active"),
    eq(users.status, "active"),
  ];
}

function activeOwnerQuery(database: Database) {
  return database
    .select({
      country: producerMemberships.country,
      producerId: producerMemberships.producerId,
      userId: producerMemberships.userId,
      displayName: users.displayName,
    })
    .from(producerMemberships)
    .innerJoin(users, eq(producerMemberships.userId, users.id))
    .where(and(...activeOwnerConditions()))
    .orderBy(desc(producerMemberships.grantedAt), desc(producerMemberships.id));
}

type ProfileGiftCandidateSeed = Omit<AdminProfileGiftCandidate, "eligibility">;

function profileGiftCandidateSeeds(
  owners: Awaited<ReturnType<typeof activeOwnerQuery>>,
  producers: readonly (LocatedProducerCsvRow | null)[],
  query: string,
): ProfileGiftCandidateSeed[] {
  return owners.flatMap((owner, index): ProfileGiftCandidateSeed[] => {
    const producer = producers[index];
    if (!producer) return [];
    const actor = { id: owner.userId, displayName: owner.displayName };
    if (
      query &&
      !producerSearchText({ country: owner.country, owner: actor, producer }).includes(
        query,
      )
    ) {
      return [];
    }
    return [
      {
        country: owner.country,
        producerId: owner.producerId,
        producer,
        publicPath: publicPath(producer)!,
        owner: actor,
      },
    ];
  });
}

async function profileGiftCandidateEligibility(
  database: Database,
  candidates: readonly ProfileGiftCandidateSeed[],
): Promise<{
  activeAccess: ReadonlySet<string>;
  openCommercialRequests: ReadonlySet<string>;
}> {
  if (!candidates.length) {
    return { activeAccess: new Set(), openCommercialRequests: new Set() };
  }
  const now = new Date();

  const entitlementScope = or(
    ...candidates.map((candidate) =>
      and(
        eq(entitlements.producerCountry, candidate.country),
        eq(entitlements.producerId, candidate.producerId),
      ),
    ),
  );
  const commercialRequestScope = or(
    ...candidates.map((candidate) =>
      and(
        eq(producerProfileUpgradeRequests.country, candidate.country),
        eq(producerProfileUpgradeRequests.producerId, candidate.producerId),
      ),
    ),
  );
  const [activeAccessRows, openCommercialRows] = await Promise.all([
    database
      .select({
        country: entitlements.producerCountry,
        producerId: entitlements.producerId,
      })
      .from(entitlements)
      .where(
        and(
          entitlementScope,
          eq(entitlements.subjectKind, "producer"),
          eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
          eq(entitlements.status, "active"),
          lte(entitlements.startsAt, now),
          or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
          isNull(entitlements.revokedAt),
        ),
      ),
    database
      .select({
        country: producerProfileUpgradeRequests.country,
        producerId: producerProfileUpgradeRequests.producerId,
      })
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          commercialRequestScope,
          inArray(producerProfileUpgradeRequests.status, [
            ...PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES,
          ]),
        ),
      ),
  ]);

  return {
    activeAccess: new Set(
      activeAccessRows.flatMap((row) =>
        row.country && row.producerId
          ? [producerIdentity(row.country, row.producerId)]
          : [],
      ),
    ),
    openCommercialRequests: new Set(
      openCommercialRows.map((row) => producerIdentity(row.country, row.producerId)),
    ),
  };
}

function addProfileGiftCandidateEligibility(
  candidates: readonly ProfileGiftCandidateSeed[],
  eligibility: Awaited<ReturnType<typeof profileGiftCandidateEligibility>>,
): AdminProfileGiftCandidate[] {
  return candidates.map((candidate) => {
    const identity = producerIdentity(candidate.country, candidate.producerId);
    return {
      ...candidate,
      eligibility: eligibility.activeAccess.has(identity)
        ? "active_access"
        : eligibility.openCommercialRequests.has(identity)
          ? "commercial_request_open"
          : "eligible",
    };
  });
}

export async function queryAdminProfileGiftCandidates(
  database: Database,
  input: AdminProfileGiftCandidateOptions = {},
): Promise<AdminProfileGiftCandidateList> {
  const page = positivePage(input.page);
  const query = normalizedSearch(input.query);
  let candidates: ProfileGiftCandidateSeed[];
  let total: number;

  if (query) {
    const owners = await activeOwnerQuery(database);
    const producers = await findProducersByIds(owners);
    const matchingCandidates = profileGiftCandidateSeeds(owners, producers, query);
    total = matchingCandidates.length;
    candidates = matchingCandidates.slice(
      (page - 1) * ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE,
      page * ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE,
    );
  } else {
    const [owners, [totalRow]] = await Promise.all([
      activeOwnerQuery(database)
        .limit(ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE)
        .offset((page - 1) * ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE),
      database
        .select({ value: count() })
        .from(producerMemberships)
        .innerJoin(users, eq(producerMemberships.userId, users.id))
        .where(and(...activeOwnerConditions())),
    ]);
    const producers = await findProducersByIds(owners);
    candidates = profileGiftCandidateSeeds(owners, producers, "");
    total = Number(totalRow?.value ?? 0);
  }

  const eligibility = await profileGiftCandidateEligibility(database, candidates);
  return {
    items: addProfileGiftCandidateEligibility(candidates, eligibility),
    page,
    query,
    total,
    totalPages: Math.max(
      1,
      Math.ceil(total / ADMIN_PROFILE_GIFT_CANDIDATE_PAGE_SIZE),
    ),
  };
}
