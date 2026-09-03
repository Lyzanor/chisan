import fs from "node:fs";

const policy = JSON.parse(
  fs.readFileSync(
    new URL("../../data/reference/description-policy.json", import.meta.url),
    "utf8",
  ),
);
const NAVIGATION_BOILERPLATE = [
  /\bcookies?\b/iu,
  /pol[ií]tica de privacidad|privacy policy/iu,
  /aviso legal|legal notice/iu,
  /todos los derechos reservados|all rights reserved/iu,
  /configuraci[oó]n de cookies?|cookie settings/iu,
  /aceptar(?: todas)?(?: las)? cookies?|accept all cookies?/iu,
  /iniciar sesi[oó]n|log[ -]?in|sign[ -]?in/iu,
  /carrito|shopping cart/iu,
];
const INCOMPLETE_FINAL_TOKENS = new Set([
  "produ",
  "elabor",
  "fabric",
  "comercializ",
  "cultiv",
  "manufactur",
  "and",
  "or",
  "of",
  "to",
  "with",
  "y",
  "o",
  "de",
  "del",
  "con",
  "para",
  "por",
  "un",
  "una",
  "que",
  "en",
]);

export const AREA_DESCRIPTION_PREVIEW_MAX_CHARACTERS =
  policy.areaPreviewMaxCharacters;
export const PRODUCER_DESCRIPTION_MAX_CHARACTERS =
  policy.canonicalMaxCharacters;

export function codePointLength(value) {
  return Array.from(String(value ?? "")).length;
}

export function descriptionContaminationReason(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (/<\/?[a-z][^>]*>/iu.test(text)) return "contains HTML copied from a source page";
  if (/(?:https?:\/\/|www\.)\S+/iu.test(text)) return "contains a URL or source citation";
  if (/_x000d_/iu.test(text)) return "contains a spreadsheet formatting artifact";
  if (/milflivecamsforce|livecamsforce/iu.test(text)) return "contains injected spam text";
  const boilerplateSignals = NAVIGATION_BOILERPLATE.filter((pattern) =>
    pattern.test(text),
  ).length;
  if (boilerplateSignals >= 2) return "contains copied navigation, legal or cookie boilerplate";
  return null;
}

export function isLikelyDescriptionTruncated(value) {
  const text = String(value ?? "").replace(/\s+/gu, " ").trim();
  if (!text) return false;
  if (codePointLength(text) >= 150 && /(?:\.\.\.|…)$/u.test(text)) return true;
  const lastToken = text.match(/([\p{L}]+)$/u)?.[1].toLocaleLowerCase() ?? "";
  return INCOMPLETE_FINAL_TOKENS.has(lastToken);
}
