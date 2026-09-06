"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  firstValidationMessage,
  formString,
  producerKeySchema,
} from "@/lib/accounts/input";
import {
  updateProducerProfileQrPreference,
  updateUserProfileQrPreference,
} from "@/lib/accounts/profile-qr-entitlements";
import { findProducerById } from "@/lib/csv-catalog";

import { producerEditPath, redirectWithMessage } from "./navigation";
export async function updatePublicProfileQrAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/perfil");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const enabled = formString(formData, "profileQrEnabled") === "yes";
  if (enabled && formString(formData, "reviewed") !== "yes") {
    redirectWithMessage(
      "/cuenta/seleccion",
      "error",
      "Revisa tu selección antes de activar su QR.",
    );
  }
  const result = await updateUserProfileQrPreference({
    enabled,
    userId: account.id,
    previewRevision: formString(formData, "previewRevision"),
  });
  const errors = {
    profile_not_public:
      "Elige la visibilidad Sin listar o Público en los ajustes del perfil antes de activar el QR.",
    selection_empty:
      "Elige al menos un productor publicado antes de activar el QR de selección.",
    preview_changed:
      "Tu selección ha cambiado. Revisa la vista previa actual antes de activar su QR.",
    not_entitled:
      "Necesitas un perfil premium activo para cambiar el QR de selección.",
    not_authorized: "No puedes cambiar este QR de selección.",
  };
  if (result !== "updated")
    redirectWithMessage("/cuenta/seleccion", "error", errors[result]);
  revalidatePath("/cuenta/perfil");
  revalidatePath("/cuenta/seleccion");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    "/cuenta/seleccion",
    "notice",
    enabled ? "QR de selección activado." : "QR de selección desactivado.",
  );
}

export async function updateProducerProfileQrAction(
  formData: FormData,
): Promise<void> {
  const account = await requireCurrentAccount("/cuenta/reclamaciones");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const parsed = producerKeySchema.safeParse({
    country: formString(formData, "country"),
    producerId: formString(formData, "producerId"),
  });
  if (!parsed.success) {
    redirectWithMessage(
      "/cuenta/reclamaciones",
      "error",
      firstValidationMessage(parsed.error, "es"),
    );
  }

  const path = producerEditPath(parsed.data.country, parsed.data.producerId);
  const producer = await findProducerById(
    parsed.data.country,
    parsed.data.producerId,
  );
  if (!producer) {
    redirectWithMessage(path, "error", "El productor ya no está publicado.");
  }

  const enabled = formString(formData, "profileQrEnabled") === "yes";
  const result = await updateProducerProfileQrPreference({
    country: parsed.data.country,
    enabled,
    producerId: parsed.data.producerId,
    userId: account.id,
  });
  if (result === "not_authorized") {
    redirectWithMessage(
      path,
      "error",
      "Solo el titular verificado puede cambiar la etiqueta QR del productor.",
    );
  }
  if (result !== "updated") {
    redirectWithMessage(
      path,
      "error",
      "Necesitas acceso activo al perfil ampliado para cambiar la etiqueta QR.",
    );
  }

  revalidatePath(path);
  redirectWithMessage(
    path,
    "notice",
    enabled ? "QR del productor activado." : "QR del productor desactivado.",
  );
}
