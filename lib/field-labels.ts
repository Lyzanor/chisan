import type { Locale } from "./i18n/locales";
import type { Messages } from "./i18n/messages";

type FieldLabelKey = keyof Messages["fieldLabels"];

const FIELD_LABEL_KEYS: Record<string, FieldLabelKey> = {
  slug: "slug",
  producer_id: "producerId",
  nombre: "name",
  municipio: "municipality",
  categoria: "category",
  "categorias adicionales": "additionalCategories",
  subcategoria: "subcategory",
  "productos estrella": "featuredProducts",
  direccion: "address",
  descripcion: "description",
  descripcion_locale: "descriptionLocale",
  horario: "openingHours",
  telefono: "phone",
  correo: "email",
  web: "website",
  imagen: "image",
  "venta online": "onlineSales",
  "canal de venta": "salesChannels",
  facebook: "facebook",
  instagram: "instagram",
  "google maps": "googleMaps",
  lat: "latitude",
  lon: "longitude",
  verificacion: "verification",
  revisado: "reviewed",
};

function normalizeKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getFieldLabel(
  csvColumnName: string,
  labels: Messages["fieldLabels"],
  locale: Locale,
): string {
  const normalized = normalizeKey(csvColumnName);
  const labelKey = FIELD_LABEL_KEYS[normalized];
  if (labelKey) {
    return labels[labelKey];
  }
  if (!csvColumnName) return csvColumnName;
  return (
    csvColumnName.charAt(0).toLocaleUpperCase(locale) +
    csvColumnName.slice(1).toLocaleLowerCase(locale)
  );
}
