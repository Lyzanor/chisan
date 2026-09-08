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
  const extra: Record<string, readonly string[]> = {
    certificaciones: ["Certificaciones y sellos", "Certificacions i segells", "Certifications and labels"],
    certificaciones_detalle: ["Alcance y registro de los sellos", "Abast i registre dels segells", "Certification scope and register"],
    visita_cita_previa: ["Cita previa para visitas", "Cita prèvia per a visites", "Booking for visits"],
    venta_profesionales: ["Venta a profesionales", "Venda a professionals", "Sales to professionals"],
    pedido_minimo: ["Pedido mínimo", "Comanda mínima", "Minimum order"],
    condiciones_envio: ["Condiciones de envío", "Condicions d’enviament", "Delivery conditions"],
    "como producimos": ["Cómo producimos", "Com produïm", "How we produce"],
    "como_producimos_locale": ["Idioma de cómo producimos", "Idioma de com produïm", "Production methods language"],
    "fecha novedades": ["Fecha de la novedad", "Data de la novetat", "News date"],
    "mensaje a la comunidad": ["Novedades", "Novetats", "News"],
  };
  const normalized = normalizeKey(csvColumnName);
  if (extra[normalized]) return extra[normalized][locale === "es" ? 0 : locale === "ca" ? 1 : 2];
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
