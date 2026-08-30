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

// These expressions cover known import templates whose variable parts only
// repeat `nombre`, `municipio`, category or product columns. They are narrow on
// purpose: the blocking CSV gate must never reject distinctive prose merely
// because several producers make the same thing.
const STRUCTURED_FIELD_TEMPLATES = [
  /^(?:a )?brewery produc(?:es|ing) beer at its .+ unit\.$/iu,
  /^(?:produces|brews) .+ at its .+ unit\.$/iu,
  /^.+ produces .+ at its .+ (?:site|unit|brewery|distillery|operation|workshop)\.$/iu,
  /^.+ (?:produces|makes|brews|roasts|grows and prepares|raises or prepares) its own .+ in .+\.$/iu,
  /^.+ (?:raises .+|smokes and prepares fish|processes .+) at its .+ operation(?:, with direct local sales)?\.$/iu,
  /^.+ produces and ages .+ at its productive unit in .+\.$/iu,
  /^.+ operates (?:this|a) .+ productive unit, where it makes .+\.$/iu,
  /^.+ roasts (?:specialty )?coffee at its production unit in .+ and sells .+ through its (?:own )?online shop\.$/iu,
  /^.+ is an independent brewery in .+ producing its own craft beer\.$/iu,
  /^an organic (?:producer|winery|farm) in .+, (?:offering|producing) .+ under the .+ identity\.$/iu,
  /^.+ is a current traces-certified organic operator in .+ producing .+\.$/iu,
  /^.+ is (?:a|an) (?:craft brewery|coffee roaster|artisan .+ maker|artisan distillery) in .+, producing .+\.$/iu,
  /^.+ is (?:a|an) (?:dairy producer|sweet and confectionery maker|brewery) in .+ making .+\.$/iu,
  /^.+ (?:producer|maker|roaster|distillery|brewery) at .+, .+, making .+\.$/iu,
  /^(?:winery|craft brewery) (?:at|in) [\p{L}\p{M}'’().,-]+(?: [\p{L}\p{M}'’().,-]+){0,5}\.$/iu,
  /^.+ es un productor local de .+(?: especializado en .+)?(?:, integrado en la oferta agroalimentaria de proximidad de la provincia de .+|, dentro de la provincia de .+|\.)$/iu,
  /^.+ es un elaborador local de .+ en .+\.?$/iu,
  /^productor con venta directa y en circuito corto de .+ en .+\.$/iu,
  /^.+ ofrece productos de proximidad en .+, como .+ con venta directa\.$/iu,
  /^.+ ofrece .+ de proximidad en .+ con venta directa\.$/iu,
  /^bodega de .+ que elabora vinos\.$/iu,
  /^.+ es una bodega de la provincia de .+ vinculada a vinos locales y variedades mediterr[aá]neas\.$/iu,
];

const EDITORIAL_PROCESS_TEXT = [
  /incorporad[oa].*(?:cat[aá]logo|directorio|csv)/iu,
  /revisad[oa] con (?:google maps|fuentes?)/iu,
  /(?:figura|incluid[oa]) en (?:el )?directorio/iu,
  /no se confirm[oó] fuente propia/iu,
  /sin web propia\s*(?:→|->)?\s*pendiente/iu,
  /(?:r[eé]f[eé]renc[eé]e?|inscrit(?:e)?) .*(?:r[eé]pertoire|annuaire)/iu,
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
export const TRANSLATED_DESCRIPTION_MAX_CHARACTERS =
  policy.translatedMaxCharacters;

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
  return boilerplateSignals >= 2
    ? "contains copied navigation, legal or cookie boilerplate"
    : null;
}

export function descriptionNaturalnessReason(value) {
  const text = String(value ?? "").replace(/\s+/gu, " ").trim();
  if (!text) return null;
  if (EDITORIAL_PROCESS_TEXT.some((pattern) => pattern.test(text))) {
    return "narrates cataloguing, review or source provenance instead of the producer";
  }
  // The known import templates are single sentences. Never let a permissive
  // placeholder consume a second sentence that may contain the distinctive
  // fact the description exists to preserve.
  const sentenceEnds = text.match(/[.!?…]+(?:[”’»")\]]*)?(?=\s|$)/gu) ?? [];
  if (
    sentenceEnds.length <= 1 &&
    STRUCTURED_FIELD_TEMPLATES.some((pattern) => pattern.test(text))
  ) {
    return "uses a shared template that only repeats structured producer fields";
  }
  return null;
}

export function isLikelyDescriptionTruncated(value) {
  const text = String(value ?? "").replace(/\s+/gu, " ").trim();
  if (!text) return false;
  if (codePointLength(text) >= 150 && /(?:\.\.\.|…)$/u.test(text)) return true;
  const lastToken = text.match(/([\p{L}]+)$/u)?.[1].toLocaleLowerCase() ?? "";
  return INCOMPLETE_FINAL_TOKENS.has(lastToken);
}
