import { and, asc, count, desc, eq, gte, inArray, lt, or, sql } from "drizzle-orm";
import type { Database } from "../db";
import { auditEvents, selectionShelves, users } from "../db/schema";
import { normalizePublicHandle, publicHandleProblem } from "../accounts/public-profile-policy";
import type { PublicProfileBaseLocation } from "../accounts/public-profile-location";
import { prepareImage } from "../accounts/prepare-producer-image";
import { canManageSelectionShelf, canReviewSelectionShelf } from "./access";
import { aiRequestReportSchema } from "../ai/usage";
import { SHELF_LIMITS, ShelfError, shelfSourceMessageKey, shelfImageUrl, shelfPointsSchema, shelfReviewSchema, shelfPublishSchema, type ShelfPoint, type PublicSelectionShelf, type ShelfCandidate } from "./policy";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type ShelfRecord = typeof selectionShelves.$inferSelect;
export type ShelfCatalog = (identities?: { country: string; producerId: number }[]) => Promise<ShelfCandidate[]>;
const pending = ["received", "queued", "processing", "review", "ready"];
const identitiesFor = (keys: string[]) => [...new Set(keys)].map((key) => { const [country, id] = key.split(":"); return { country, producerId: Number(id) }; });

export async function lockShelfAccount(tx: Transaction, userId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${userId}`}))`);
  const [account] = await tx.select().from(users).where(eq(users.id, userId)).for("update").limit(1);
  if (!account || account.status !== "active") throw new ShelfError("access");
  return account;
}

export function createSelectionShelfService(deps: { database: Database; catalog: ShelfCatalog; enabled: () => boolean;
  allowance?: (database: Pick<Database, "select">) => Promise<{ used: number; limit: number; remaining: number }>;
  location?: (key: string, municipality: string) => Promise<PublicProfileBaseLocation | null> }) {
  const db = deps.database;
  function enabled() { if (!deps.enabled()) throw new ShelfError("access"); }
  async function candidates() { return deps.catalog(); }
  async function validatePoints(points: ShelfPoint[]) {
    const choices = await deps.catalog(identitiesFor(points.map((point) => point.producerKey)));
    const valid = new Map(choices.map((item) => [item.key, item]));
    if (points.some((point) => !valid.has(point.producerKey) || (point.productId && !valid.get(point.producerKey)!.products.some((item) => item.id === point.productId)))) throw new ShelfError("selection");
    return choices;
  }
  async function audit(tx: Transaction, actor: string, id: string, action: string, metadata: Record<string, unknown> = {}) {
    await tx.insert(auditEvents).values({ actorKind: "user", actorUserId: actor,
      action: `selection_shelf.${action}`, targetType: "selection_shelf", targetId: id, metadata });
  }
  async function submit(userId: string, bytes: Buffer, channel: string, externalMessageId?: string) {
    enabled();
    const messageId = shelfSourceMessageKey(channel, externalMessageId);
    // Reserve uploads before decoding, including invalid files. No inference runs here.
    await db.transaction(async (tx) => {
      const account = await lockShelfAccount(tx, userId);
      if (!account.termsAcceptedAt || !(await canManageSelectionShelf(tx, userId))) throw new ShelfError("access");
      const [attempts] = await tx.select({ value: count() }).from(auditEvents).where(and(
        eq(auditEvents.actorUserId, userId), eq(auditEvents.action, "selection_shelf.upload_attempt"),
        gte(auditEvents.occurredAt, new Date(Date.now() - 86_400_000))));
      if (attempts.value >= SHELF_LIMITS.uploadsPerDay) throw new ShelfError("quota");
      await audit(tx, userId, userId, "upload_attempt");
    });
    const image = await prepareImage(bytes, SHELF_LIMITS);
    return db.transaction(async (tx) => {
      await lockShelfAccount(tx, userId);
      if (!(await canManageSelectionShelf(tx, userId))) throw new ShelfError("access");
      if (messageId) {
        const [receipt] = await tx.select({ id: selectionShelves.id }).from(selectionShelves)
          .where(and(eq(selectionShelves.userId, userId), eq(selectionShelves.messageId, messageId))).limit(1);
        if (receipt) return receipt.id;
      }
      const [same] = await tx.select({ id: selectionShelves.id }).from(selectionShelves).where(and(
        eq(selectionShelves.userId, userId), eq(selectionShelves.sha256, image.sha256),
        inArray(selectionShelves.status, [...pending, "published"]))).orderBy(desc(selectionShelves.createdAt)).limit(1);
      if (same) return same.id;
      await tx.update(selectionShelves).set({ status: "superseded", version: sql`${selectionShelves.version} + 1`, updatedAt: new Date() })
        .where(and(eq(selectionShelves.userId, userId), inArray(selectionShelves.status, pending)));
      await tx.delete(selectionShelves).where(and(eq(selectionShelves.userId, userId),
        inArray(selectionShelves.status, ["superseded", "rejected"]), lt(selectionShelves.updatedAt, new Date(Date.now() - 30 * 86_400_000))));
      const [created] = await tx.insert(selectionShelves).values({ ...image, userId, channel, messageId, status: "queued" }).returning({ id: selectionShelves.id });
      await audit(tx, userId, created.id, "received", { channel, sha256: image.sha256, rightsConfirmed: true });
      return created.id;
    });
  }
  async function publicShelf(subjectId: string): Promise<PublicSelectionShelf | null> {
    if (!deps.enabled()) return null;
    const [shelf] = await db.select({
      id: selectionShelves.id,
      userId: selectionShelves.userId,
      width: selectionShelves.width,
      height: selectionShelves.height,
      points: selectionShelves.points,
      reviewedAt: selectionShelves.reviewedAt,
    }).from(selectionShelves)
      .where(and(
        or(
          eq(selectionShelves.id, subjectId),
          eq(selectionShelves.selectionId, subjectId),
          eq(selectionShelves.userId, subjectId),
        ),
        eq(selectionShelves.status, "published"),
      )).limit(1);
    if (!shelf?.reviewedAt) return null;
    const [owner] = await db.select({ visibility: users.publicProfileVisibility, handle: users.publicHandle }).from(users)
      .where(and(eq(users.id, shelf.userId), eq(users.status, "active"))).limit(1);
    if (!owner || owner.visibility === "private" || !(await canManageSelectionShelf(db, shelf.userId))) return null;
    const parsed = shelfPointsSchema.safeParse(shelf.points);
    if (!parsed.success) return null;
    const choices = await deps.catalog(identitiesFor(parsed.data.map((point) => point.producerKey)));
    const allowed = new Map(choices.map((item) => [item.key, item]));
    const points = parsed.data.filter((point) => allowed.has(point.producerKey)).map((point) => {
      if (point.productId && !allowed.get(point.producerKey)!.products.some((product) => product.id === point.productId)) {
        const current = { ...point }; delete current.productId; return current;
      }
      return point;
    });
    if (!points.length) return null;
    return { id: shelf.id, width: shelf.width, height: shelf.height, points,
      updatedOn: shelf.reviewedAt.toISOString().slice(0, 10), imageSrc: shelfImageUrl(shelf.id) };
  }
  async function readImage(id: string, viewerId?: string) {
    if (!deps.enabled()) return null;
    const [record] = await db.select({ userId: selectionShelves.userId }).from(selectionShelves).where(eq(selectionShelves.id, id)).limit(1);
    if (!record) return null;
    const [owner] = await db.select({ status: users.status }).from(users).where(eq(users.id, record.userId)).limit(1);
    if (owner?.status !== "active") return null;
    const privateAccess = viewerId && (viewerId === record.userId || await canReviewSelectionShelf(db, viewerId));
    if (!privateAccess && (await publicShelf(id))?.id !== id) return null;
    const [image] = await db.select({ bytes: selectionShelves.bytes }).from(selectionShelves).where(eq(selectionShelves.id, id));
    return image?.bytes ?? null;
  }
  async function ownerStatus(userId: string) {
    enabled();
    const rows = await db.select({ id: selectionShelves.id, status: selectionShelves.status, createdAt: selectionShelves.createdAt })
      .from(selectionShelves).where(eq(selectionShelves.userId, userId)).orderBy(desc(selectionShelves.createdAt)).limit(5);
    // A succession of rejected/replaced drafts must not hide the removal
    // control for the older photo that is still public.
    if (!rows.some((row) => row.status === "published")) {
      const [published] = await db.select({ id: selectionShelves.id, status: selectionShelves.status, createdAt: selectionShelves.createdAt })
        .from(selectionShelves).where(and(eq(selectionShelves.userId, userId), eq(selectionShelves.status, "published"))).limit(1);
      if (published) rows.push(published);
    }
    return rows;
  }
  async function queue(reviewerId: string) {
    enabled();
    if (!(await canReviewSelectionShelf(db, reviewerId))) throw new ShelfError("access");
    return db.select({ id: selectionShelves.id, status: selectionShelves.status, createdAt: selectionShelves.createdAt,
      channel: selectionShelves.channel, name: users.displayName, handle: users.publicHandle }).from(selectionShelves)
      .innerJoin(users, eq(users.id, selectionShelves.userId)).where(inArray(selectionShelves.status, pending))
      .orderBy(asc(selectionShelves.createdAt)).limit(50);
  }
  async function reviewDetail(reviewerId: string, id: string, query = "") {
    enabled();
    if (!(await canReviewSelectionShelf(db, reviewerId))) throw new ShelfError("access");
    const [row] = await db.select({ id: selectionShelves.id, userId: selectionShelves.userId, version: selectionShelves.version,
      status: selectionShelves.status, width: selectionShelves.width, height: selectionShelves.height, points: selectionShelves.points,
      suggestions: selectionShelves.suggestions, note: selectionShelves.note, analysisError: selectionShelves.analysisError,
      channel: selectionShelves.channel }).from(selectionShelves).where(eq(selectionShelves.id, id)).limit(1);
    if (!row) throw new ShelfError("missing");
    const keys = [...row.points.map((point) => point.producerKey), ...row.suggestions.points.flatMap((point) => [point.producerKey, ...(point.candidateKeys ?? [])].filter((key): key is string => Boolean(key)))];
    const selected = await deps.catalog(identitiesFor(keys));
    const searched = query.trim() ? (await deps.catalog()).filter((item) => item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).slice(0, 50) : [];
    const choices = [...new Map([...selected, ...searched].map((item) => [item.key, item])).values()];
    const [events, allowance] = await Promise.all([
      db.select({ metadata: auditEvents.metadata, at: auditEvents.occurredAt }).from(auditEvents)
        .where(and(eq(auditEvents.targetType, "selection_shelf"), eq(auditEvents.targetId, id),
          inArray(auditEvents.action, ["ai.request_completed", "ai.request_failed"])))
        .orderBy(desc(auditEvents.occurredAt)).limit(5),
      deps.allowance?.(db) ?? Promise.resolve(null),
    ]);
    const analysisAttempts = events.flatMap((event) => {
      const parsed = aiRequestReportSchema.safeParse(event.metadata);
      return parsed.success ? [{ ...parsed.data, at: event.at.toISOString() }] : [];
    });
    return { ...row, candidates: choices, imageSrc: shelfImageUrl(row.id), analysisAttempts, allowance, viewerIsOwner: reviewerId === row.userId };
  }
  async function ownerProposal(userId: string) {
    enabled();
    const [row] = await db.select({ id: selectionShelves.id, version: selectionShelves.version, status: selectionShelves.status,
      points: selectionShelves.points, width: selectionShelves.width, height: selectionShelves.height,
      suggestions: selectionShelves.suggestions, analysisError: selectionShelves.analysisError }).from(selectionShelves)
      .where(and(eq(selectionShelves.userId, userId), inArray(selectionShelves.status, pending))).orderBy(desc(selectionShelves.createdAt)).limit(1);
    if (!row) return null;
    const catalog = await deps.catalog(identitiesFor(row.points.map((point) => point.producerKey)));
    const allowed = new Map(catalog.map((item) => [item.key, item]));
    const points = shelfPointsSchema.parse(row.points).filter((point) => allowed.has(point.producerKey));
    return { id: row.id, version: row.version, status: row.status, points, width: row.width, height: row.height,
      imageSrc: shelfImageUrl(row.id), producers: catalog, analysisError: row.analysisError,
      unmatched: row.suggestions.points.filter((point) => !point.producerKey).length };
  }
  async function publish(userId: string, raw: unknown) {
    enabled();
    const input = shelfPublishSchema.parse(raw);
    return db.transaction(async (tx) => {
      const account = await lockShelfAccount(tx, userId);
      if (!account.termsAcceptedAt || !(await canManageSelectionShelf(tx, userId))) throw new ShelfError("access");
      const [row] = await tx.select().from(selectionShelves).where(and(eq(selectionShelves.id, input.id), eq(selectionShelves.userId, userId))).for("update");
      if (!row) throw new ShelfError("missing");
      if (row.status !== "ready" || row.version !== input.version) throw new ShelfError("changed");
      const points = shelfPointsSchema.parse(row.points).filter((point) => input.producerKeys.includes(point.producerKey));
      if (input.producerKeys.some((key) => !points.some((point) => point.producerKey === key))) throw new ShelfError("selection");
      await validatePoints(points);
      const handle = normalizePublicHandle(input.profile.publicHandle);
      if (publicHandleProblem(handle) || (account.publicHandle && account.publicHandle !== handle)) throw new ShelfError("profile");
      const location = await deps.location?.(input.profile.baseLocation, input.profile.baseMunicipality);
      if (!location) throw new ShelfError("profile");
      const [other] = await tx.select({ id: users.id }).from(users).where(eq(users.publicHandle, handle)).limit(1);
      if (other && other.id !== userId) throw new ShelfError("profile");
      await tx.update(users).set({ publicHandle: handle,
        publicProfileVisibility: account.publicProfileVisibility === "private" ? "public" : account.publicProfileVisibility,
        publicProfileBaseCountry: location.country, publicProfileBaseArea: location.area, publicProfileBaseMunicipality: location.municipality,
        updatedAt: new Date() }).where(eq(users.id, userId));

      await tx.update(selectionShelves).set({ status: "superseded", updatedAt: new Date(), version: sql`${selectionShelves.version} + 1` })
        .where(and(eq(selectionShelves.userId, userId), eq(selectionShelves.status, "published")));
      await tx.update(selectionShelves).set({ status: "published", points, reviewedBy: userId, reviewedAt: new Date(), updatedAt: new Date(), version: row.version + 1 })
        .where(eq(selectionShelves.id, row.id));
      await audit(tx, userId, row.id, "published", { producerKeys: input.producerKeys, version: row.version + 1, profilePublished: account.publicProfileVisibility === "private" });
      return { version: row.version + 1, status: "published", handle };
    });
  }
  async function review(reviewerId: string, raw: unknown) {
    enabled();
    const input = shelfReviewSchema.parse(raw);
    return db.transaction(async (tx) => {
      if (!(await canReviewSelectionShelf(tx, reviewerId))) throw new ShelfError("access");
      const [initial] = await tx.select({ userId: selectionShelves.userId }).from(selectionShelves).where(eq(selectionShelves.id, input.id));
      if (!initial) throw new ShelfError("missing");
      const account = await lockShelfAccount(tx, initial.userId);
      const [record] = await tx.select({ status: selectionShelves.status, version: selectionShelves.version }).from(selectionShelves)
        .where(eq(selectionShelves.id, input.id)).for("update");
      if (!record || record.version !== input.version || !pending.includes(record.status)) throw new ShelfError("changed");
      if (input.action === "analyze" && !["received", "review", "ready"].includes(record.status)) throw new ShelfError("changed");
      if (input.action === "analyze" && (await deps.allowance?.(tx))?.remaining === 0) throw new ShelfError("budget");
      if (input.action !== "reject" && !(await canManageSelectionShelf(tx, initial.userId))) throw new ShelfError("access");
      if (input.action !== "reject") await validatePoints(input.points);
      if (input.action === "approve" && !input.points.length) throw new ShelfError("selection");
      if (input.action === "reject" && !input.note) throw new ShelfError("invalid");
      const status = { save: "review", approve: "ready", reject: "rejected", analyze: "queued" }[input.action];
      await tx.update(selectionShelves).set({ status, points: input.points, note: input.note, version: record.version + 1,
        updatedAt: new Date(), ...(input.action === "analyze" ? { analysisError: null } : {}),
        ...(input.action === "approve" || input.action === "reject" ? { reviewedBy: reviewerId, reviewedAt: new Date() } : {}) })
        .where(eq(selectionShelves.id, input.id));
      await audit(tx, reviewerId, input.id, input.action, { version: record.version + 1, pointCount: input.points.length });
      return { version: record.version + 1, status, handle: account.publicHandle };
    });
  }
  async function withdraw(userId: string, id: string) {
    enabled();
    return db.transaction(async (tx) => {
      await lockShelfAccount(tx, userId);
      const rows = await tx.update(selectionShelves).set({ status: "superseded", updatedAt: new Date(), version: sql`${selectionShelves.version} + 1` })
        .where(and(eq(selectionShelves.id, id), eq(selectionShelves.userId, userId), inArray(selectionShelves.status, [...pending, "published"]))).returning({ id: selectionShelves.id });
      if (!rows.length) throw new ShelfError("missing");
      await audit(tx, userId, id, "withdrawn");
    });
  }
  return { submit, candidates, publicShelf, readImage, ownerStatus, ownerProposal, publish, queue, reviewDetail, review, withdraw };
}
