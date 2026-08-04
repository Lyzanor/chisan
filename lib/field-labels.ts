/**
 * Etiquetas legibles para las columnas del CSV (mayúscula inicial y acentos).
 * Clave = nombre de columna en minúscula sin acentos para búsqueda insensible.
 */

const LABELS: Record<string, string> = {
  nombre: "Name",
  municipio: "Municipality",
  categoria: "Category",
  subcategoria: "Subcategory",
  direccion: "Address",
  descripcion: "Description",
  horario: "Opening hours",
  telefono: "Phone",
  correo: "Email",
  web: "Web",
  "venta online": "Online sales",
  "canal de venta": "Sales channel",
  facebook: "Facebook",
  instagram: "Instagram",
  "google maps": "Google Maps",
  lat: "Latitude",
  lon: "Longitude",
  revisado: "Reviewed",
};

function normalizeKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Devuelve la etiqueta legible para un nombre de columna del CSV.
 * Si no hay entrada en el mapa, devuelve el nombre con mayúscula inicial.
 */
export function getFieldLabel(csvColumnName: string): string {
  const normalized = normalizeKey(csvColumnName);
  if (LABELS[normalized] !== undefined) {
    return LABELS[normalized];
  }
  if (!csvColumnName) return csvColumnName;
  return csvColumnName.charAt(0).toUpperCase() + csvColumnName.slice(1).toLowerCase();
}
