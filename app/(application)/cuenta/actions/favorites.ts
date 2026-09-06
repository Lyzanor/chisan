"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { isPublicProfileVisible } from "@/lib/accounts/public-profile-policy";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { auditEvents, favorites } from "@/lib/db/schema";

import { redirectWithMessage } from "./navigation";
export async function setFavoritePublicVisibilityAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/favoritos");
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const returnTo = safeReturnPath(
    formString(formData, "returnTo"),
    "/cuenta/favoritos",
  );
  if (!parsed.success) {
    redirectWithMessage(
      returnTo,
      "error",
      firstValidationMessage(parsed.error, "es"),
    );
  }

  const showOnPublicProfile = formString(formData, "show") === "yes";
  if (
    showOnPublicProfile &&
    !(await findProducerById(parsed.data.country, parsed.data.producerId))
  ) {
    redirectWithMessage(
      returnTo,
      "error",
      "Ese productor ya no está en el catálogo.",
    );
  }

  const updated = await getDatabase().transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${account.id}`}))`,
    );
    const rows = await transaction
      .update(favorites)
      .set({ showOnPublicProfile })
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, parsed.data.country),
          eq(favorites.producerId, parsed.data.producerId),
        ),
      )
      .returning({ producerId: favorites.producerId });
    if (rows.length) {
      await transaction.insert(auditEvents).values({
        actorKind: "user",
        actorUserId: account.id,
        action: "favorite.public_visibility_updated",
        targetType: "favorite",
        targetId: `${account.id}:${parsed.data.country}:${parsed.data.producerId}`,
        metadata: { showOnPublicProfile },
      });
    }
    return rows;
  });
  if (!updated.length) {
    redirectWithMessage(
      returnTo,
      "error",
      "Guarda el productor antes de compartirlo.",
    );
  }

  revalidatePath(returnTo.split("?")[0] || "/cuenta/favoritos");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    returnTo,
    "notice",
    showOnPublicProfile
      ? isPublicProfileVisible(account.publicProfileVisibility)
        ? "Productor añadido a tu perfil público."
        : "Productor seleccionado para tu perfil; el perfil sigue siendo privado."
      : "Productor oculto en tu perfil público.",
  );
}

export async function toggleFavoriteAction(formData: FormData): Promise<void> {
  const account = await requireCurrentAccount();
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const returnTo = safeReturnPath(
    formString(formData, "returnTo"),
    "/cuenta/favoritos",
  );

  if (!parsed.success) {
    redirectWithMessage(
      returnTo,
      "error",
      firstValidationMessage(parsed.error, "es"),
    );
  }

  const producer = await findProducerById(
    parsed.data.country,
    parsed.data.producerId,
  );
  if (!producer) {
    redirectWithMessage(
      returnTo,
      "error",
      "Ese productor ya no está en el catálogo.",
    );
  }

  const removed = await getDatabase().transaction(async (database) => {
    await database.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`profile-qr:user:${account.id}`}))`,
    );
    const [existing] = await database
      .select({ userId: favorites.userId })
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, parsed.data.country),
          eq(favorites.producerId, parsed.data.producerId),
        ),
      )
      .limit(1);

    if (existing) {
      await database
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, account.id),
            eq(favorites.country, parsed.data.country),
            eq(favorites.producerId, parsed.data.producerId),
          ),
        );
    } else {
      await database
        .insert(favorites)
        .values({
          userId: account.id,
          country: parsed.data.country,
          producerId: parsed.data.producerId,
        })
        .onConflictDoNothing();
    }

    return Boolean(existing);
  });

  revalidatePath(returnTo.split("?")[0] || "/");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    returnTo,
    "notice",
    removed ? "Eliminado de favoritos." : "Añadido a favoritos.",
  );
}
