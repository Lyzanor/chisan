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

  const result = await updateUserProfileQrPreference({
    enabled: formString(formData, "profileQrEnabled") === "yes",
    userId: account.id,
  });
  if (result === "profile_not_public") {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "Make the public profile visible before enabling its QR label.",
    );
  }
  if (result !== "updated") {
    redirectWithMessage(
      "/cuenta/perfil",
      "error",
      "An active Premium profile is required to change the QR label.",
    );
  }

  revalidatePath("/cuenta/perfil");
  if (account.publicHandle) revalidatePath(`/u/${account.publicHandle}`);
  redirectWithMessage(
    "/cuenta/perfil",
    "notice",
    formString(formData, "profileQrEnabled") === "yes"
      ? "Profile QR enabled."
      : "Profile QR disabled.",
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
