import type { Locale } from "./locales";

const en = {
  scope: "Search in", province: "Province: {area}", nearby: "Near me",
  loading: "Loading the national catalog…", error: "The national catalog could not be loaded.",
  retry: "Try again", chooseLocation: "Choose a location to see nearby producers.",
  results: "{count} producers · {scope}", more: "Show more", relevance: "Sorted by relevance",
  empty: "No producers match this search in {scope}.",
};
type Messages = { [K in keyof typeof en]: string };
const messages: Partial<Record<Locale, Messages>> = {
  en,
  es: {
    scope: "Buscar en", province: "Provincia: {area}", nearby: "Cerca de mí",
    loading: "Cargando el catálogo nacional…", error: "No se ha podido cargar el catálogo nacional.",
    retry: "Reintentar", chooseLocation: "Elige una ubicación para ver productores cercanos.",
    results: "{count} productores · {scope}", more: "Mostrar más", relevance: "Ordenados por relevancia",
    empty: "No hay productores que coincidan con esta búsqueda en {scope}.",
  },
  ca: {
    scope: "Cerca a", province: "Província: {area}", nearby: "A prop meu",
    loading: "Carregant el catàleg nacional…", error: "No s'ha pogut carregar el catàleg nacional.",
    retry: "Torna-ho a provar", chooseLocation: "Tria una ubicació per veure productors propers.",
    results: "{count} productors · {scope}", more: "Mostra'n més", relevance: "Ordenats per rellevància",
    empty: "No hi ha productors que coincideixin amb aquesta cerca a {scope}.",
  },
};
export function getCatalogSearchMessages(locale: Locale): Messages {
  return messages[locale] ?? en;
}
