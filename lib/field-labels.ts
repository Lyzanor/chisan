/**
 * Etiquetas legibles para las columnas del CSV (mayúscula inicial y acentos).
 * Clave = nombre de columna en minúscula sin acentos para búsqueda insensible.
 */

const LABELS: Record<string, string> = {
  nombre: "Nombre",
  municipio: "Municipio",
  categoria: "Categoría",
  subcategoria: "Subcategoría",
  direccion: "Dirección",
  descripcion: "Descripción",
  horario: "Horario",
  telefono: "Teléfono",
  correo: "Correo",
  web: "Web",
  "venta online": "Venta online",
  "canal de venta": "Canal de venta",
  facebook: "Facebook",
  instagram: "Instagram",
  "google maps": "Google Maps",
  lat: "Latitud",
  lon: "Longitud",
  revisado: "Revisado",
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
