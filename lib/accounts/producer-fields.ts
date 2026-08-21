import { createHash } from "node:crypto";

import categoriesRegistry from "@/data/reference/categories.json";

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

export const PRODUCER_EDITABLE_FIELDS = [
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

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDelimitedValues(values: readonly unknown[]): string {
  const normalized = values
    .flatMap((value) => normalizeText(value).split("|"))
    .map(normalizeText)
    .filter(Boolean);

  return [...new Set(normalized)].join("|");
}

export function readProducerProposalForm(formData: FormData): ProducerProposal {
  return Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key, kind }) => {
      const value =
        kind === "categories" || kind === "sales-channels"
          ? normalizeDelimitedValues(formData.getAll(key))
          : normalizeText(formData.get(key));

      return [key, value];
    }),
  ) as ProducerProposal;
}

function validateUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
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
): ProposalValidationResult {
  const errors: Record<string, string> = {};
  const candidate = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.map(({ key }) => [
      key,
      normalizeText(rawProposal[key] ?? currentFields[key] ?? ""),
    ]),
  ) as ProducerProposal;

  for (const field of PRODUCER_EDITABLE_FIELDS) {
    const value = candidate[field.key];
    if (field.required && !value) {
      errors[field.key] = `${field.label} is required.`;
      continue;
    }
    if (value.length > field.maxLength) {
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

  for (const key of ["web", "Facebook", "Instagram", "Google Maps"] as const) {
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

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const patch = Object.fromEntries(
    PRODUCER_EDITABLE_FIELDS.flatMap(({ key }) => {
      const currentValue = normalizeText(currentFields[key] ?? "");
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
      .map(([key, value]) => [normalizeText(key), normalizeText(value)] as const)
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
