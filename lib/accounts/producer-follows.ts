import "server-only";
import { and, eq, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { auditEvents, favorites, users } from "@/lib/db/schema";
import { producerKeySchema } from "./input";

/** Keep the original relation and opt-ins; following never publishes a selection or an identity. */
export async function setProducerFollow(
  database: Database,
  userId: string,
  raw: unknown,
  following: boolean,
  exists: (key: { country: string; producerId: number }) => Promise<boolean>,
) {
  const key = producerKeySchema.parse(raw);
  if (following && !(await exists(key)))
    throw new Error("Ese productor ya no está publicado en el catálogo.");
  await database.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${userId}`}))`,
    );
    const [account] = await tx
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, userId), eq(users.status, "active")))
      .for("update");
    if (!account) throw new Error("Tu cuenta no está activa.");
    const condition = and(
      eq(favorites.userId, userId),
      eq(favorites.country, key.country),
      eq(favorites.producerId, key.producerId),
    );
    const changed = following
      ? await tx
          .insert(favorites)
          .values({ userId, ...key })
          .onConflictDoNothing()
          .returning({ id: favorites.producerId })
      : await tx
          .delete(favorites)
          .where(condition)
          .returning({ id: favorites.producerId });
    if (changed.length)
      await tx
        .insert(auditEvents)
        .values({
          actorKind: "user",
          actorUserId: userId,
          action: following ? "producer.followed" : "producer.unfollowed",
          targetType: "producer_follow",
          targetId: `${userId}:${key.country}:${key.producerId}`,
          metadata: key,
        });
  });
}
