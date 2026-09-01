import { SITE_ORIGIN } from "@/lib/site";

export const PROFILE_QR_LABEL_WIDTH = 1200;
export const PROFILE_QR_LABEL_HEIGHT = 1600;
export const PROFILE_QR_ENABLED_METADATA_KEY = "profileQrEnabled";

export type ProfileQrKind = "producer" | "selection";

export function isProfileQrEnabled(
  metadata: Readonly<Record<string, unknown>> | null | undefined,
): boolean {
  return metadata?.[PROFILE_QR_ENABLED_METADATA_KEY] === true;
}

export function buildProfileQrUrl(path: string): string {
  const url = new URL(path, SITE_ORIGIN);

  if (url.origin !== SITE_ORIGIN) {
    throw new Error("Profile QR paths must stay on the canonical Chisan origin.");
  }

  url.search = "";
  url.hash = "";
  return url.toString();
}

export function buildProfileQrFilename(
  kind: ProfileQrKind,
  name: string,
): string {
  const safeName = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return `chisan-${kind === "producer" ? "productor" : "seleccion"}-${
    safeName || "perfil"
  }.png`;
}
