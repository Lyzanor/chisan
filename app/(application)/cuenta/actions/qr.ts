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
      "Review your selection before activating its QR.",
    );
  }
  const result = await updateUserProfileQrPreference({
    enabled,
    userId: account.id,
    previewRevision: formString(formData, "previewRevision"),
  });
  const errors = {
    profile_not_public:
      "Make the selection Unlisted or Public in profile settings before enabling its QR.",
    selection_empty:
      "Choose at least one published producer before enabling the Selection QR.",
    preview_changed:
      "Your selection has changed. Review the current preview before enabling its QR.",
    not_entitled:
      "An active Premium profile is required to change the Selection QR.",
    not_authorized: "You cannot change this Selection QR.",
  };
  if (result !== "updated")
    redirectWithMessage("/cuenta/seleccion", "error", errors[result]);
  revalidatePath("/cuenta/perfil");
  revalidatePath("/cuenta/seleccion");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    "/cuenta/seleccion",
    "notice",
    enabled ? "Selection QR enabled." : "Selection QR disabled.",
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
      firstValidationMessage(parsed.error),
    );
  }

  const path = producerEditPath(parsed.data.country, parsed.data.producerId);
  const producer = await findProducerById(
    parsed.data.country,
    parsed.data.producerId,
  );
  if (!producer) {
    redirectWithMessage(path, "error", "The producer is no longer published.");
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
      "Only the verified owner can change the producer QR label.",
    );
  }
  if (result !== "updated") {
    redirectWithMessage(
      path,
      "error",
      "An active expanded-profile entitlement is required to change the QR label.",
    );
  }

  revalidatePath(path);
  redirectWithMessage(
    path,
    "notice",
    enabled ? "Producer QR enabled." : "Producer QR disabled.",
  );
}
