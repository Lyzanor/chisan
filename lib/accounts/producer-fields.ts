import { createHash } from "node:crypto";

import categoriesRegistry from "@/data/reference/categories.json";
import { DESCRIPTION_SOURCE_LOCALES } from "@/lib/i18n/locales";

export const PRODUCER_CATEGORIES = categoriesRegistry.categories as readonly string[];

export const ONLINE_SALES_VALUES = ["sí", "no", "no comprobado"] as const;
export const SALES_CHANNEL_VALUES = [
  "ecommerce",
  "whatsapp",
  "email",
  "telefono",
  "suscripcion",
  "marketplace",
] as const;
export const PRODUCER_DESCRIPTION_LOCALES = DESCRIPTION_SOURCE_LOCALES;

export const PRODUCER_STANDARD_EDITABLE_FIELDS = [
  {
    key: "nombre",
    label: "Public name",
    kind: "text",
    required: true,
    maxLength: 160,
    help: "The public producer or brand name.",
  },
  {
    key: "municipio",
    label: "Municipality",
    kind: "text",
    required: true,
    maxLength: 160,
    help: "Municipality of the productive unit, not a sales office.",
  },
  {
    key: "categoria",
    label: "Primary category",
    kind: "category",
    required: true,
    maxLength: 80,
    help: "The producer's main material output.",
  },
  {
    key: "categorias adicionales",
    label: "Additional categories",
    kind: "categories",
    required: false,
    maxLength: 500,
    help: "Other material outputs made by this same productive unit.",
  },
  {
    key: "productos estrella",
    label: "Featured products",
    kind: "textarea",
    required: false,
    maxLength: 500,
    help: "A short list of concrete products, brands or appellations.",
  },
  {
    key: "descripcion",
    label: "Description",
    kind: "textarea",
    required: false,
    maxLength: 2_000,
    help: "Factual producer-specific information, without promotional claims.",
  },
  {
    key: "descripcion_locale",
    label: "Description language",
    kind: "description-locale",
    required: false,
    maxLength: 2,
    help: "The source language of the canonical description; leave empty only with an empty description.",
  },
  {
    key: "direccion",
    label: "Address",
    kind: "text",
    required: false,
    maxLength: 500,
    help: "Address of the productive unit or producer-facing premises.",
  },
  {
    key: "horario",
    label: "Public hours",
    kind: "textarea",
    required: false,
    maxLength: 1_000,
    help: "Current visiting, collection or public-opening hours.",
  },
  {
    key: "telefono",
    label: "Phone",
    kind: "tel",
    required: false,
    maxLength: 16,
    help: "International E.164 format, for example +34600112233.",
  },
  {
    key: "correo",
    label: "Public email",
    kind: "email",
    required: false,
    maxLength: 254,
    help: "A public contact address for this producer.",
  },
  {
    key: "web",
    label: "Website",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "Official HTTP(S) producer website.",
  },
  {
    key: "Facebook",
    label: "Facebook",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "Official Facebook page URL.",
  },
  {
    key: "Instagram",
    label: "Instagram",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "Official Instagram profile URL.",
  },
  {
    key: "Google Maps",
    label: "Google Maps",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "Reviewed Google Maps listing for the productive unit.",
  },
  {
    key: "lat",
    label: "Latitude",
    kind: "coordinate",
    required: false,
    maxLength: 32,
    help: "WGS84 decimal latitude. Latitude and longitude must be supplied together.",
  },
  {
    key: "lon",
    label: "Longitude",
    kind: "coordinate",
    required: false,
    maxLength: 32,
    help: "WGS84 decimal longitude. Latitude and longitude must be supplied together.",
  },
  {
    key: "Venta online",
    label: "Online sales",
    kind: "online-sales",
    required: true,
    maxLength: 20,
    help: "Whether a current ordering mechanism has been reviewed.",
  },
  {
    key: "Canal de venta",
    label: "Sales channels",
    kind: "sales-channels",
    required: false,
    maxLength: 200,
    help: "Current demonstrated ordering mechanisms.",
  },
] as const;

export const PRODUCER_PREMIUM_EDITABLE_FIELDS = [
  {
    key: "visitas guiadas",
    label: "Guided visits",
    kind: "yes-no",
    required: false,
    maxLength: 2,
    help: "Whether this producer currently offers guided visits; leave empty when unpublished.",
  },
  {
    key: "mensaje a la comunidad",
    label: "Message to the community",
    kind: "textarea",
    required: false,
    maxLength: 1_000,
    help: "A producer-authored public message, preserved in its original language and reviewed before publication.",
  },
  {
    key: "mensaje_comunidad_locale",
    label: "Community message language",
    kind: "description-locale",
    required: false,
    maxLength: 3,
    help: "The source language of the community message; leave empty only when the message is empty.",
  },
  {
    key: "enlace destacado 1",
    label: "Highlighted link 1",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "A relevant HTTP(S) article, interview or other public page about this producer.",
  },
  {
    key: "enlace destacado 2",
    label: "Highlighted link 2",
    kind: "url",
    required: false,
    maxLength: 2_048,
    help: "A second distinct public HTTP(S) page; link 1 must be filled first.",
  },
] as const;

export const PRODUCER_EDITABLE_FIELDS = [
  ...PRODUCER_STANDARD_EDITABLE_FIELDS,
  ...PRODUCER_PREMIUM_EDITABLE_FIELDS,
] as const;

export type ProducerEditableField = (typeof PRODUCER_EDITABLE_FIELDS)[number];
export type ProducerEditableFieldKey = ProducerEditableField["key"];
export type ProducerPatch = Partial<Record<ProducerEditableFieldKey, string>>;
export type ProducerProposal = Record<ProducerEditableFieldKey, string>;

export type ProposalValidationResult =
  | { ok: true; candidate: ProducerProposal; patch: ProducerPatch }
  | { ok: false; errors: Record<string, string> };

const EDITABLE_FIELD_KEYS = new Set<string>(
  PRODUCER_EDITABLE_FIELDS.map(({ key }) => key),
);
const CATEGORY_SET = new Set<string>(PRODUCER_CATEGORIES);
const ONLINE_SALES_SET = new Set<string>(ONLINE_SALES_VALUES);
const SALES_CHANNEL_SET = new Set<string>(SALES_CHANNEL_VALUES);
const DESCRIPTION_LOCALE_SET = new Set<string>(PRODUCER_DESCRIPTION_LOCALES);
const PREMIUM_FIELD_KEYS = new Set<string>(
  PRODUCER_PREMIUM_EDITABLE_FIELDS.map(({ key }) => key),
);

export function producerEditableFieldsForPremiumAccess(
  hasPremiumAccess: boolean,
): readonly ProducerEditableField[] {
  return hasPremiumAccess
    ? PRODUCER_EDITABLE_FIELDS
    : PRODUCER_STANDARD_EDITABLE_FIELDS;
}

export function isPremiumProducerPatch(patch: ProducerPatch): boolean {
  return Object.keys(patch).some((key) => PREMIUM_FIELD_KEYS.has(key));
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeProducerFieldValue(key: string, value: unknown): string {
  if (key !== "mensaje a la comunidad") return normalizeText(value);

  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function getCommunityMessageContaminationReason(value: string): string | null {
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

function normalizeDelimitedValues(values: readonly unknown[]): string {
  const normalized = values
    .flatMap((value) => normalizeText(value).split("|"))
    .map(normalizeText)
    .filter(Boolean);

  return [...new Set(normalized)].join("|");
}

export function readProducerProposalForm(
  formData: FormData,
  editableFields: readonly ProducerEditableField[] = PRODUCER_EDITABLE_FIELDS,
): Partial<Record<ProducerEditableFieldKey, string>> {
  return Object.fromEntries(
    editableFields.map(({ key, kind }) => {
      const value =
        kind === "categories" || kind === "sales-channels"
          ? normalizeDelimitedValues(formData.getAll(key))
          : normalizeProducerFieldValue(key, formData.get(key));

      return [key, value];
    }),
  ) as Partial<Record<ProducerEditableFieldKey, string>>;
}

function readHttpUrl(value: string): URL | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
      ? url
      : null;
  } catch {
    return null;
  }
}

function validateUrl(value: string): boolean {
  return !value || readHttpUrl(value) !== null;
}

function validateEmail(value: string): boolean {
  if (!value || value.length > 254) return !value;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeCoordinate(value: string, min: number, max: number): string | null {
  if (!value) return "";
  const normalized = value.replace(",", ".");
  if (!/^-?(?:\d+|\d*\.\d+)$/.test(normalized)) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return String(parsed);
}

function hasSpreadsheetFormulaPrefix(value: string): boolean {
  return /^[=+\-@]/.test(value);
}

export function validateProducerProposal(
  rawProposal: Partial<Record<ProducerEditableFieldKey, unknown>>,
  currentFields: Record<string, string>,
  editableFields: readonly ProducerEditableField[] = PRODUCER_EDITABLE_FIELDS,
): ProposalValidationResult {
  const errors: Record<string, string> = {};
  const editableKeys = new Set(editableFields.map(({ key }) => key));
  const candidate = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key }) => [
      key,
      normalizeProducerFieldValue(
        key,
        editableKeys.has(key) ? rawProposal[key] ?? "" : currentFields[key] ?? "",
      ),
    ]),
  ) as ProducerProposal;

  for (const field of PRODUCER_EDITABLE_FIELDS) {
    const value = candidate[field.key];
    if (field.required && !value) {
      errors[field.key] = `${field.label} is required.`;
      continue;
    }
    const valueLength =
      field.key === "mensaje a la comunidad"
        ? Array.from(value).length
        : value.length;
    if (valueLength > field.maxLength) {
      errors[field.key] = `${field.label} is too long (maximum ${field.maxLength} characters).`;
      continue;
    }
    if (
      value &&
      !["url", "tel", "coordinate"].includes(field.kind) &&
      hasSpreadsheetFormulaPrefix(value)
    ) {
      errors[field.key] = `${field.label} cannot start with a spreadsheet formula marker.`;
    }
  }

  if (!CATEGORY_SET.has(candidate.categoria)) {
    errors.categoria = "Choose a category from the catalog registry.";
  }

  const additionalCategories = normalizeDelimitedValues([
    candidate["categorias adicionales"],
  ]).split("|").filter(Boolean);
  candidate["categorias adicionales"] = additionalCategories.join("|");
  if (additionalCategories.some((category) => !CATEGORY_SET.has(category))) {
    errors["categorias adicionales"] = "Every additional category must use a catalog value.";
  } else if (additionalCategories.includes(candidate.categoria)) {
    errors["categorias adicionales"] = "The primary category cannot be repeated.";
  }

  if (candidate.telefono && !/^\+[1-9]\d{6,14}$/.test(candidate.telefono)) {
    errors.telefono = "Use international E.164 format, for example +34600112233.";
  }

  if (!validateEmail(candidate.correo)) {
    errors.correo = "Enter a valid public email address.";
  }

  for (const key of [
    "web",
    "Facebook",
    "Instagram",
    "Google Maps",
    "enlace destacado 1",
    "enlace destacado 2",
  ] as const) {
    if (!validateUrl(candidate[key])) {
      errors[key] = "Enter a complete HTTP(S) URL without embedded credentials.";
    }
  }

  const latitude = normalizeCoordinate(candidate.lat, -90, 90);
  const longitude = normalizeCoordinate(candidate.lon, -180, 180);
  if (latitude === null) errors.lat = "Latitude must be between -90 and 90.";
  if (longitude === null) errors.lon = "Longitude must be between -180 and 180.";
  if ((latitude === "") !== (longitude === "")) {
    errors.lat = errors.lat ?? "Latitude and longitude must be supplied together.";
    errors.lon = errors.lon ?? "Latitude and longitude must be supplied together.";
  }
  if (latitude !== null) candidate.lat = latitude;
  if (longitude !== null) candidate.lon = longitude;

  if (!ONLINE_SALES_SET.has(candidate["Venta online"])) {
    errors["Venta online"] = "Choose a valid online-sales state.";
  }

  const salesChannels = normalizeDelimitedValues([candidate["Canal de venta"]])
    .split("|")
    .filter(Boolean);
  candidate["Canal de venta"] = salesChannels.join("|");
  if (salesChannels.some((channel) => !SALES_CHANNEL_SET.has(channel))) {
    errors["Canal de venta"] = "Every sales channel must use a catalog value.";
  } else if (candidate["Venta online"] !== "sí" && salesChannels.length > 0) {
    errors["Canal de venta"] = "Sales channels are only valid when online sales is yes.";
  }

  if (!candidate.descripcion && candidate.descripcion_locale) {
    errors.descripcion_locale = "Leave the description language empty when the description is empty.";
  } else if (
    candidate.descripcion &&
    !DESCRIPTION_LOCALE_SET.has(candidate.descripcion_locale)
  ) {
    errors.descripcion_locale = "Choose the source language of the description.";
  }
  if (candidate["visitas guiadas"] && !["sí", "no"].includes(candidate["visitas guiadas"])) {
    errors["visitas guiadas"] = "Choose yes, no or leave guided visits unpublished.";
  }
  if (!candidate["mensaje a la comunidad"] && candidate.mensaje_comunidad_locale) {
    errors.mensaje_comunidad_locale =
      "Leave the community-message language empty when the message is empty.";
  } else if (
    candidate["mensaje a la comunidad"] &&
    !DESCRIPTION_LOCALE_SET.has(candidate.mensaje_comunidad_locale)
  ) {
    errors.mensaje_comunidad_locale = "Choose the source language of the community message.";
  }
  const communityMessageContamination = getCommunityMessageContaminationReason(
    candidate["mensaje a la comunidad"],
  );
  if (communityMessageContamination) {
    errors["mensaje a la comunidad"] =
      `Community message cannot contain ${communityMessageContamination}.`;
  }
  if (candidate["enlace destacado 2"] && !candidate["enlace destacado 1"]) {
    errors["enlace destacado 2"] = "Fill highlighted link 1 before link 2.";
  } else if (candidate["enlace destacado 1"] && candidate["enlace destacado 2"]) {
    const highlightedLink1 = readHttpUrl(candidate["enlace destacado 1"]);
    const highlightedLink2 = readHttpUrl(candidate["enlace destacado 2"]);
    if (highlightedLink1 && highlightedLink1.href === highlightedLink2?.href) {
      errors["enlace destacado 2"] = "Highlighted links must be different.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const pairedFields = [
    ["descripcion", "descripcion_locale"],
    ["mensaje a la comunidad", "mensaje_comunidad_locale"],
  ] as const;
  const changedPairs = pairedFields.filter((pair) =>
    pair.some(
      (key) =>
        candidate[key] !== normalizeProducerFieldValue(key, currentFields[key] ?? ""),
    ),
  );
  const patch = Object.fromEntries(
    editableFields.flatMap(({ key }) => {
      const currentValue = normalizeProducerFieldValue(key, currentFields[key] ?? "");
      if (changedPairs.some((pair) => pair[0] === key || pair[1] === key)) {
        return [[key, candidate[key]]];
      }
      return candidate[key] === currentValue ? [] : [[key, candidate[key]]];
    }),
  ) as ProducerPatch;

  return { ok: true, candidate, patch };
}

export function isProducerPatch(value: unknown): value is ProducerPatch {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([key, fieldValue]) => EDITABLE_FIELD_KEYS.has(key) && typeof fieldValue === "string",
  );
}

export function hashProducerFields(fields: Record<string, string>): string {
  const stableFields = Object.fromEntries(
    Object.entries(fields)
      .map(([key, value]) => {
        const normalizedKey = normalizeText(key);
        return [
          normalizedKey,
          normalizeProducerFieldValue(normalizedKey, value),
        ] as const;
      })
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)),
  );

  return createHash("sha256").update(JSON.stringify(stableFields)).digest("hex");
}

export function safeReturnPath(value: unknown, fallback = "/cuenta"): string {
  const path = normalizeText(value);
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(path)
  ) {
    return fallback;
  }
  return path;
}
