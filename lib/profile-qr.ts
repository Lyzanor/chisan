import { SITE_ORIGIN } from "@/lib/site";

/**
 * Printable sticker layout in design units, shared by the on-screen SVG and the
 * downloaded PNG so both draw the same label. It prints at 100 × 127.9 mm.
 */
export const PROFILE_QR_STICKER = {
  width: 860,
  height: 1100,
  radius: 60,
  frame: 10,
  wordmark: { x: 195, y: 55, width: 470, height: 107 },
  divider: { x1: 150, x2: 710, y: 212 },
  code: { x: 100, y: 250, size: 660 },
  bandTop: 960,
  label: { y: 1030, maxWidth: 740, fontSize: 56, fontWeight: 600, tracking: 3 },
} as const;
export const PROFILE_QR_LABEL_SCALE = 2.5;
export const PROFILE_QR_LABEL_WIDTH = PROFILE_QR_STICKER.width * PROFILE_QR_LABEL_SCALE;
export const PROFILE_QR_LABEL_HEIGHT = PROFILE_QR_STICKER.height * PROFILE_QR_LABEL_SCALE;
export const PROFILE_QR_ENABLED_METADATA_KEY = "profileQrEnabled";

export type ProfileQrKind = "producer" | "selection";

export function isProfileQrEnabled(
  metadata: Readonly<Record<string, unknown>> | null | undefined,
): boolean {
  return metadata?.[PROFILE_QR_ENABLED_METADATA_KEY] === true;
}

/**
 * Server-renderable estimate of the band label size: uppercase Outfit is about
 * 0.68 em per Latin glyph and 1 em per CJK glyph. The PNG measures exactly.
 */
export function estimateProfileQrLabelFontSize(text: string): number {
  const { fontSize, maxWidth, tracking } = PROFILE_QR_STICKER.label;
  const glyphs = Array.from(text);
  const ems = glyphs.reduce(
    (sum, glyph) => sum + ((glyph.codePointAt(0) ?? 0) >= 0x2e80 ? 1 : 0.68),
    0,
  );
  const width = ems * fontSize + Math.max(0, glyphs.length - 1) * tracking;
  return width <= maxWidth ? fontSize : Math.floor((fontSize * maxWidth) / width);
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
