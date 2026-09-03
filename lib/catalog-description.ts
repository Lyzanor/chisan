import descriptionPolicy from "@/data/reference/description-policy.json";

export const PRODUCER_DESCRIPTION_MAX_CHARACTERS =
  descriptionPolicy.canonicalMaxCharacters;
export const AREA_DESCRIPTION_PREVIEW_MAX_CHARACTERS =
  descriptionPolicy.areaPreviewMaxCharacters;

export function normalizeDescriptionWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

export function getDescriptionContaminationReason(value: string): string | null {
  if (/<\/?[a-z][^>]*>/iu.test(value)) return "HTML copied from a source page";
  if (/(?:https?:\/\/|www\.)\S+/iu.test(value)) return "a URL or source citation";
  if (/_x000d_/iu.test(value)) return "a spreadsheet formatting artifact";
  if (/milflivecamsforce|livecamsforce/iu.test(value)) return "injected spam text";

  const boilerplateSignals = [
    /\bcookies?\b/iu,
    /pol[ií]tica de privacidad|privacy policy/iu,
    /aviso legal|legal notice/iu,
    /todos los derechos reservados|all rights reserved/iu,
    /configuraci[oó]n de cookies?|cookie settings/iu,
    /aceptar(?: todas)?(?: las)? cookies?|accept all cookies?/iu,
    /iniciar sesi[oó]n|log[ -]?in|sign[ -]?in/iu,
    /carrito|shopping cart/iu,
  ].filter((pattern) => pattern.test(value)).length;

  return boilerplateSignals >= 2
    ? "copied navigation, legal or cookie boilerplate"
    : null;
}

export function getDescriptionPreview(
  value: string,
  locale: string,
  maxCharacters = AREA_DESCRIPTION_PREVIEW_MAX_CHARACTERS,
): string {
  const description = normalizeDescriptionWhitespace(value);
  const characters = Array.from(description);

  if (characters.length <= maxCharacters) return description;
  if (maxCharacters <= 1) return maxCharacters === 1 ? "…" : "";

  const budget = maxCharacters - 1;
  const candidate = characters.slice(0, budget).join("");
  let boundary = 0;

  for (const segment of new Intl.Segmenter(locale, {
    granularity: "word",
  }).segment(description)) {
    const end = segment.index + segment.segment.length;
    if (end > budget) break;
    if (segment.isWordLike) boundary = end;
  }

  const prefix = (boundary > 0 ? description.slice(0, boundary) : candidate)
    .trimEnd()
    .replace(/[,:;\-–—]+$/u, "")
    .trimEnd();

  return `${prefix}…`;
}
