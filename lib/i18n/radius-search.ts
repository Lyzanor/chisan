import type { Locale } from "./locales";

const en = {
  title: "Near me", useLocation: "Use my location", locating: "Finding location…",
  radius: "Radius (km)", latitude: "Latitude", longitude: "Longitude",
  manual: "Or enter coordinates", apply: "Apply coordinates", clear: "Remove filter",
  description: "Show producers within 5 km of your location. Your location stays in this browser and is not saved. Producers without coordinates are excluded.",
  active: "Within 5 km · {count} results", invalid: "Enter valid latitude (−90 to 90) and longitude (−180 to 180).",
  within5km: "Within 5 km",
};
type Messages = { [K in keyof typeof en]: string };
const messages: Partial<Record<Locale, Messages>> = {
  en,
  es: {
    title: "Cerca de mí", useLocation: "Usar mi ubicación", locating: "Obteniendo ubicación…",
    radius: "Radio (km)", latitude: "Latitud", longitude: "Longitud",
    manual: "O introduce coordenadas", apply: "Aplicar coordenadas", clear: "Quitar filtro",
    description: "Muestra productores a menos de 5 km de tu ubicación. Tu ubicación permanece en este navegador y no se guarda. Se excluyen productores sin coordenadas.",
    active: "A menos de 5 km · {count} resultados", invalid: "Introduce una latitud (−90 a 90) y una longitud (−180 a 180) válidas.",
    within5km: "A 5 km",
  },
  ca: {
    title: "A prop meu", useLocation: "Utilitza la meva ubicació", locating: "Obtenint la ubicació…",
    radius: "Radi (km)", latitude: "Latitud", longitude: "Longitud",
    manual: "O introdueix coordenades", apply: "Aplica les coordenades", clear: "Treu el filtre",
    description: "Mostra productors a menys de 5 km de la teva ubicació. La ubicació es queda en aquest navegador i no es desa. S'exclouen els productors sense coordenades.",
    active: "A menys de 5 km · {count} resultats", invalid: "Introdueix una latitud (−90 a 90) i una longitud (−180 a 180) vàlides.",
    within5km: "A 5 km",
  },
};
export function getRadiusSearchMessages(locale: Locale): Messages {
  return messages[locale] ?? en;
}
