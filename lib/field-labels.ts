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
  "productos estrella": "featuredProducts",
  direccion: "address",
  descripcion: "description",
  descripcion_locale: "descriptionLocale",
  "visitas guiadas": "guidedVisits",
  "mensaje a la comunidad": "communityMessage",
  mensaje_comunidad_locale: "communityMessageLocale",
  "enlace destacado 1": "highlightedLink1",
  "enlace destacado 2": "highlightedLink2",
  video: "video",
  "quien hay detras": "behindProducer",
  quien_hay_detras_locale: "behindProducerLocale",
  historia: "history",
  historia_locale: "historyLocale",
  "fecha ultimo cambio": "lastApprovedChange",
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
};

const OPTIONAL_FIELD_LABEL_FALLBACKS: Partial<
  Record<FieldLabelKey, string>
> = {
  video: "Video",
  behindProducer: "Who is behind it",
  behindProducerLocale: "Who-is-behind language",
  history: "History",
  historyLocale: "History language",
  lastApprovedChange: "Last approved producer change",
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
    return labels[labelKey] ?? OPTIONAL_FIELD_LABEL_FALLBACKS[labelKey] ?? csvColumnName;
  }
  if (!csvColumnName) return csvColumnName;
  return (
    csvColumnName.charAt(0).toLocaleUpperCase(locale) +
    csvColumnName.slice(1).toLocaleLowerCase(locale)
  );
}
