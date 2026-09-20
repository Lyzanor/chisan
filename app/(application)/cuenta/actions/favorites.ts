"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { getCurrentAccount, requireCurrentAccount } from "@/lib/accounts/auth";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { favorites } from "@/lib/db/schema";

import { setProducerFollow } from "@/lib/accounts/producer-follows";

import { redirectWithMessage } from "./navigation";

/** One session-scoped read for every visible follow control, never catalog data. */
export async function getProducerFollowsAction(): Promise<{ status: "guest" | "ready" | "unavailable"; keys: string[] }> {
  try {
    const account = await getCurrentAccount();
    if (!account) return { status: "guest", keys: [] };
    const rows = await getDatabase().select({ country: favorites.country, producerId: favorites.producerId })
      .from(favorites).where(eq(favorites.userId, account.id));
    return { status: "ready", keys: rows.map(({ country, producerId }) => `${country}:${producerId}`) };
  } catch {
    return { status: "unavailable", keys: [] };
  }
}

/** Inline map/profile control; the domain service rechecks the active account. */
export async function updateProducerFollowAction(input: { country: string; producerId: number; following: boolean }): Promise<"saved" | "guest" | "error"> {
  try {
    const account = await getCurrentAccount();
    if (!account) return "guest";
    const parsed = producerKeySchema.safeParse(input);
    if (!parsed.success || typeof input.following !== "boolean") return "error";
    await setProducerFollow(getDatabase(), account.id, parsed.data, input.following,
      async (key) => Boolean(await findProducerById(key.country, key.producerId)));
    revalidateFollowing(account.publicHandle);
    return "saved";
  } catch {
    return "error";
  }
}

function revalidateFollowing(publicHandle: string | null) {
  revalidatePath("/cuenta/siguiendo");
  revalidatePath("/cuenta/novedades");
  revalidatePath("/cuenta");
  if (publicHandle) revalidatePath(`/u/${publicHandle}`);
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
  revalidateFollowing(account.publicHandle);
  redirectWithMessage(
    returnTo,
    "notice",
    following === "yes"
      ? "Ahora sigues a este productor."
      : "Has dejado de seguir a este productor.",
  );
}
