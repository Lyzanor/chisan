import type { Locale } from "./locales";

const en = {
  title: "Distance", useLocation: "Use my location", locating: "Finding location…",
  radius: "Radius (km)", latitude: "Latitude", longitude: "Longitude",
  manual: "Or enter coordinates", apply: "Apply coordinates", clear: "Remove distance filter",
  description: "Straight-line distance within {area}. Your location stays in this browser and is not saved. Producers without coordinates are excluded.",
  active: "Within {radius} km · {count} results", invalid: "Enter valid latitude (−90 to 90) and longitude (−180 to 180).",
};
type Messages = { [K in keyof typeof en]: string };
const messages: Partial<Record<Locale, Messages>> = {
  en,
  es: {
    title: "Distancia", useLocation: "Usar mi ubicación", locating: "Obteniendo ubicación…",
    radius: "Radio (km)", latitude: "Latitud", longitude: "Longitud",
    manual: "O introduce coordenadas", apply: "Aplicar coordenadas", clear: "Quitar filtro de distancia",
    description: "Distancia en línea recta dentro de {area}. Tu ubicación permanece en este navegador y no se guarda. Se excluyen productores sin coordenadas.",
    active: "A menos de {radius} km · {count} resultados", invalid: "Introduce una latitud (−90 a 90) y una longitud (−180 a 180) válidas.",
  },
  ca: {
    title: "Distància", useLocation: "Utilitza la meva ubicació", locating: "Obtenint la ubicació…",
    radius: "Radi (km)", latitude: "Latitud", longitude: "Longitud",
    manual: "O introdueix coordenades", apply: "Aplica les coordenades", clear: "Treu el filtre de distància",
    description: "Distància en línia recta dins de {area}. La ubicació es queda en aquest navegador i no es desa. S'exclouen els productors sense coordenades.",
    active: "A menys de {radius} km · {count} resultats", invalid: "Introdueix una latitud (−90 a 90) i una longitud (−180 a 180) vàlides.",
  },
};
export function getRadiusSearchMessages(locale: Locale): Messages {
  return messages[locale] ?? en;
}
