"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";

import { setProducerFollow } from "@/lib/accounts/producer-follows";

import { redirectWithMessage } from "./navigation";
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
