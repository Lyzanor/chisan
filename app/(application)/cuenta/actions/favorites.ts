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
import { auditEvents, favorites, users } from "@/lib/db/schema";

import { setProducerFollow } from "@/lib/accounts/producer-follows";

import { redirectWithMessage } from "./navigation";
export async function setFavoritePublicVisibilityAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/siguiendo");
  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  const returnTo = safeReturnPath(
    formString(formData, "returnTo"),
    "/cuenta/siguiendo",
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
    const [active] = await transaction
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, account.id), eq(users.status, "active")))
      .for("update");
    if (!active) throw new Error("An active account is required.");
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
      "Sigue al productor antes de añadirlo a tu selección.",
    );
  }

  revalidatePath(returnTo.split("?")[0] || "/cuenta/siguiendo");
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
    "/cuenta/siguiendo",
  );

  if (!parsed.success) {
    redirectWithMessage(
      returnTo,
      "error",
      firstValidationMessage(parsed.error, "es"),
    );
  }

  const following = formString(formData, "following");
  if (following !== "yes" && following !== "no") {
    redirectWithMessage(
      returnTo,
      "error",
      "Recarga el perfil antes de cambiar el seguimiento.",
    );
  }
  try {
    await setProducerFollow(
      getDatabase(),
      account.id,
      parsed.data,
      following === "yes",
      async (key) =>
        Boolean(await findProducerById(key.country, key.producerId)),
    );
  } catch {
    redirectWithMessage(
      returnTo,
      "error",
      "No se ha podido actualizar el seguimiento. Recarga e inténtalo de nuevo.",
    );
  }
  revalidatePath(returnTo.split("?")[0] || "/");
  revalidatePath("/cuenta/siguiendo");
  revalidatePath("/cuenta/novedades");
  revalidatePath("/cuenta");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    returnTo,
    "notice",
    following === "yes"
      ? "Ahora sigues a este productor."
      : "Has dejado de seguir a este productor.",
  );
}
