import { and, count, eq, gt, gte, isNull, lte, or, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import {
  auditEvents,
  entitlements,
  producerMediaUploads,
  producerMemberships,
} from "@/lib/db/schema";
import { PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY } from "./producer-profile-upgrade-policy";
import {
  PRODUCER_MEDIA_LIMITS,
  type PreparedMediaReference,
} from "./producer-media-policy";
import { prepareProducerImage } from "./prepare-producer-image";
import type { ProducerContentChange } from "./producer-content-change";

export class MediaAccessError extends Error {
  constructor(public code: "access" | "quota" | "missing") {
    super(code);
  }
}
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type MediaIdentity = {
  userId: string;
  country: string;
  producerId: number;
};

async function lockMediaAccess(tx: Transaction, identity: MediaIdentity) {
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`producer-media:${identity.userId}`}))`,
  );
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`producer:${identity.country}:${identity.producerId}`}))`,
  );
  const [member] = await tx
    .select({ id: producerMemberships.id })
    .from(producerMemberships)
    .where(
      and(
        eq(producerMemberships.userId, identity.userId),
        eq(producerMemberships.country, identity.country),
        eq(producerMemberships.producerId, identity.producerId),
        eq(producerMemberships.status, "active"),
      ),
    )
    .for("update")
    .limit(1);
  const [premium] = await tx
    .select({ id: entitlements.id })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.subjectKind, "producer"),
        eq(entitlements.producerCountry, identity.country),
        eq(entitlements.producerId, identity.producerId),
        eq(entitlements.key, PRODUCER_PROFILE_PREMIUM_ENTITLEMENT_KEY),
        eq(entitlements.status, "active"),
        isNull(entitlements.revokedAt),
        lte(entitlements.startsAt, new Date()),
        or(
          isNull(entitlements.expiresAt),
          gt(entitlements.expiresAt, new Date()),
        ),
      ),
    )
    .for("update")
    .limit(1);
  if (!member || !premium) throw new MediaAccessError("access");
}

const uploadMetadata = {
  uploadId: producerMediaUploads.id,
  sha256: producerMediaUploads.sha256,
  width: producerMediaUploads.width,
  height: producerMediaUploads.height,
};
export async function listProducerMediaUploads(
  db: Database,
  identity: MediaIdentity,
): Promise<PreparedMediaReference[]> {
  return db
    .select(uploadMetadata)
    .from(producerMediaUploads)
    .where(
      and(
        eq(producerMediaUploads.authorUserId, identity.userId),
        eq(producerMediaUploads.country, identity.country),
        eq(producerMediaUploads.producerId, identity.producerId),
      ),
    )
    .orderBy(producerMediaUploads.createdAt)
    .limit(PRODUCER_MEDIA_LIMITS.inbox);
}

export async function uploadProducerMedia(
  db: Database,
  identity: MediaIdentity,
  input: Buffer,
) {
  // Count attempts before decoding. Bad files also consume the bounded daily allowance.
  await db.transaction(async (tx) => {
    await lockMediaAccess(tx, identity);
    const [recent] = await tx
      .select({ total: count() })
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.actorUserId, identity.userId),
          eq(auditEvents.action, "producer_media.upload_attempt"),
          gte(auditEvents.occurredAt, new Date(Date.now() - 86_400_000)),
        ),
      );
    if (recent.total >= PRODUCER_MEDIA_LIMITS.uploadsPerDay)
      throw new MediaAccessError("quota");
    await tx
      .insert(auditEvents)
      .values({
        actorKind: "user",
        actorUserId: identity.userId,
        action: "producer_media.upload_attempt",
        targetType: "producer",
        targetId: `${identity.country}:${identity.producerId}`,
      });
  });
  const prepared = await prepareProducerImage(input);
  return db.transaction(async (tx) => {
    await lockMediaAccess(tx, identity);
    const scope = and(
      eq(producerMediaUploads.country, identity.country),
      eq(producerMediaUploads.producerId, identity.producerId),
    );
    const [existing] = await tx
      .select(uploadMetadata)
      .from(producerMediaUploads)
      .where(
        and(
          scope,
          eq(producerMediaUploads.authorUserId, identity.userId),
          eq(producerMediaUploads.sha256, prepared.sha256),
        ),
      )
      .limit(1);
    if (existing) return existing;
    // Unattached abandoned uploads expire after 30 days; open proposals always retain their bytes.
    await tx.execute(sql`delete from producer_media_uploads u where u.author_user_id = ${identity.userId}::uuid
      and u.country = ${identity.country} and u.producer_id = ${identity.producerId} and u.created_at < now() - interval '30 days'
      and not exists (select 1 from producer_change_requests r where r.content_change->'uploads' @> jsonb_build_array(jsonb_build_object('uploadId', u.id::text))
        and (r.status not in ('applied','withdrawn','rejected','conflict') or r.updated_at > now() - interval '90 days'))`);
    const [inbox] = await tx
      .select({ total: count() })
      .from(producerMediaUploads)
      .where(scope);
    if (inbox.total >= PRODUCER_MEDIA_LIMITS.inbox)
      throw new MediaAccessError("quota");
    const [created] = await tx
      .insert(producerMediaUploads)
      .values({
        ...prepared,
        authorUserId: identity.userId,
        country: identity.country,
        producerId: identity.producerId,
      })
      .returning(uploadMetadata);
    await tx
      .insert(auditEvents)
      .values({
        actorKind: "user",
        actorUserId: identity.userId,
        action: "producer_media.prepared",
        targetType: "producer_media_upload",
        targetId: created.uploadId,
        metadata: {
          country: identity.country,
          producerId: identity.producerId,
          sha256: prepared.sha256,
          bytes: prepared.bytes.length,
          rightsConfirmed: true,
        },
      });
    return created;
  });
}

/** Also checked by the database trigger, against immutable rows locked until the proposal is saved. */
export async function assertProducerMediaReferences(
  tx: Transaction | Database,
  identity: MediaIdentity,
  change: ProducerContentChange | null,
) {
  if (change?.version !== 2) return;
  for (const reference of change.uploads) {
    const [image] = await tx
      .select(uploadMetadata)
      .from(producerMediaUploads)
      .where(
        and(
          eq(producerMediaUploads.id, reference.uploadId),
          eq(producerMediaUploads.authorUserId, identity.userId),
          eq(producerMediaUploads.country, identity.country),
          eq(producerMediaUploads.producerId, identity.producerId),
        ),
      )
      .for("share")
      .limit(1);
    if (
      !image ||
      image.sha256 !== reference.sha256 ||
      image.width !== reference.width ||
      image.height !== reference.height
    )
      throw new MediaAccessError("missing");
  }
}
