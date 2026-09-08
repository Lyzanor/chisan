import type { Locale } from "./locales";

export function producerSeasonLabels(locale: Locale) {
  return locale === "es" ? {
    title: "Temporada habitual", special: "Producto especial de temporada",
    help: "Selecciona los meses habituales. No indica existencias actuales. Sin meses, la temporada queda sin especificar.",
  } : locale === "ca" ? {
    title: "Temporada habitual", special: "Producte especial de temporada",
    help: "Selecciona els mesos habituals. No indica existències actuals. Sense mesos, la temporada queda sense especificar.",
  } : {
    title: "Usual season", special: "Seasonal special",
    help: "Select the usual months. This does not indicate current stock. No months means the season is unspecified.",
  };
}
export function seasonMonthLabel(month: number, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, month - 1, 1)));
}
