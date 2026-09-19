import { and, asc, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { Database } from "../db";
import { auditEvents, favorites, selectionShelves, users } from "../db/schema";
import { prepareImage } from "../accounts/prepare-producer-image";
import { canManageSelectionShelf, canReviewSelectionShelf, type ShelfReader } from "./access";
import { SHELF_LIMITS, ShelfError, shelfSourceMessageKey, shelfImageUrl, shelfPointsSchema, shelfReviewSchema, type PublicSelectionShelf, type ShelfCandidate } from "./policy";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type ShelfRecord = typeof selectionShelves.$inferSelect;
export type ShelfCatalog = (identities: { country: string; producerId: number }[]) => Promise<ShelfCandidate[]>;
const pending = ["received", "queued", "processing", "review"];

export async function lockShelfAccount(tx: Transaction, userId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${userId}`}))`);
  const [account] = await tx.select().from(users).where(eq(users.id, userId)).for("update").limit(1);
  if (!account || account.status !== "active") throw new ShelfError("access");
  return account;
}

export function createSelectionShelfService(deps: { database: Database; catalog: ShelfCatalog; enabled: () => boolean }) {
  const db = deps.database;
  function enabled() { if (!deps.enabled()) throw new ShelfError("access"); }
  async function candidates(userId: string, reader: ShelfReader = db) {
    const identities = await reader.select({ country: favorites.country, producerId: favorites.producerId })
      .from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.showOnPublicProfile, true)))
      .orderBy(desc(favorites.createdAt), favorites.country, favorites.producerId).limit(SHELF_LIMITS.candidates + 1);
    if (identities.length > SHELF_LIMITS.candidates) throw new ShelfError("selection");
    return deps.catalog(identities);
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
      const choices = await candidates(userId, tx);
      if (!choices.length) throw new ShelfError("selection");
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
      const [created] = await tx.insert(selectionShelves).values({ ...image, userId, channel, messageId, status: "received" }).returning({ id: selectionShelves.id });
      await audit(tx, userId, created.id, "received", { channel, sha256: image.sha256, rightsConfirmed: true });
      return created.id;
    });
  }
  async function publicShelf(userId: string): Promise<PublicSelectionShelf | null> {
    if (!deps.enabled()) return null;
    const [owner] = await db.select({ visibility: users.publicProfileVisibility, handle: users.publicHandle }).from(users)
      .where(and(eq(users.id, userId), eq(users.status, "active"))).limit(1);
    if (!owner?.handle || owner.visibility === "private" || !(await canManageSelectionShelf(db, userId))) return null;
    const [shelf] = await db.select({ id: selectionShelves.id, width: selectionShelves.width, height: selectionShelves.height,
      points: selectionShelves.points, reviewedAt: selectionShelves.reviewedAt }).from(selectionShelves)
      .where(and(eq(selectionShelves.userId, userId), eq(selectionShelves.status, "published"))).limit(1);
    if (!shelf?.reviewedAt) return null;
    let choices: ShelfCandidate[];
    try { choices = await candidates(userId); }
    catch (error) { if (error instanceof ShelfError && error.code === "selection") return null; throw error; }
    const allowed = new Set(choices.map((item) => item.key));
    const parsed = shelfPointsSchema.safeParse(shelf.points);
    if (!parsed.success) return null;
    const points = parsed.data.filter((point) => allowed.has(point.producerKey));
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
    if (!privateAccess && (await publicShelf(record.userId))?.id !== id) return null;
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
  async function reviewDetail(reviewerId: string, id: string) {
    enabled();
    if (!(await canReviewSelectionShelf(db, reviewerId))) throw new ShelfError("access");
    const [row] = await db.select({ id: selectionShelves.id, userId: selectionShelves.userId, version: selectionShelves.version,
      status: selectionShelves.status, width: selectionShelves.width, height: selectionShelves.height, points: selectionShelves.points,
      suggestions: selectionShelves.suggestions, note: selectionShelves.note, analysisError: selectionShelves.analysisError,
      channel: selectionShelves.channel }).from(selectionShelves).where(eq(selectionShelves.id, id)).limit(1);
    if (!row) throw new ShelfError("missing");
    const choices = await candidates(row.userId).catch((error) => {
      if (error instanceof ShelfError && error.code === "selection") return [];
      throw error;
    });
    return { ...row, candidates: choices, imageSrc: shelfImageUrl(row.id) };
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
      if (input.action === "admit" && record.status !== "received") throw new ShelfError("changed");
      if (input.action === "analyze" && record.status !== "review") throw new ShelfError("changed");
      if (input.action === "publish" && record.status === "received") throw new ShelfError("changed");
      if (input.action !== "reject" && !(await canManageSelectionShelf(tx, initial.userId))) throw new ShelfError("access");
      const allowed = new Set((input.action === "reject" ? [] : await candidates(initial.userId, tx)).map((item) => item.key));
      if (input.action !== "reject" && input.points.some((point) => !allowed.has(point.producerKey))) throw new ShelfError("selection");
      if ((input.action === "admit" || input.action === "analyze") && !allowed.size) throw new ShelfError("selection");
      if (input.action === "publish" && (!input.points.length || !account.publicHandle || account.publicProfileVisibility === "private")) throw new ShelfError("selection");
      if (input.action === "reject" && !input.note) throw new ShelfError("invalid");
      if (input.action === "publish") await tx.update(selectionShelves).set({ status: "superseded", updatedAt: new Date(), version: sql`${selectionShelves.version} + 1` })
        .where(and(eq(selectionShelves.userId, initial.userId), eq(selectionShelves.status, "published")));
      // Saving corrections before admission must never authorize inference.
      const status = { admit: "queued", save: record.status === "received" ? "received" : "review", publish: "published", reject: "rejected", analyze: "queued" }[input.action];
      await tx.update(selectionShelves).set({ status, points: input.points, note: input.note, version: record.version + 1,
        updatedAt: new Date(), ...(input.action === "publish" || input.action === "reject" ? { reviewedBy: reviewerId, reviewedAt: new Date() } : {}) })
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
  return { submit, candidates, publicShelf, readImage, ownerStatus, queue, reviewDetail, review, withdraw };
}
