import { getLocaleDisplayTag, type Locale } from "./locales";

const en = {
  price: "Price (EUR)",
  purchaseUrl: "Product purchase link",
  purchaseHelp:
    "Paste the product's page in the shop. Chisan sends visitors there to complete their purchase.",
  priceHelp:
    "Optional. Price for the product and size described above; use up to two decimal places.",
  date: "Product updated",
  dateHelp:
    "Set automatically when you send product changes for review. Reordering does not renew this date.",
  pendingDate: "Date set when submitted",
  shop: "View in shop",
  demoLink: "Try example link",
  demo: "Demonstration: fictional price and link; this product is not for sale.",
  shopHelp:
    "Purchase in the linked shop. Confirm the current price and conditions there.",
  week: "Updated this week",
  month: "Updated this month",
  year: "Updated in the last year",
  updated: "Updated on",
  recordedPrice: "Recorded price",
  empty: "Not provided",
};
type Labels = typeof en;
const es: Labels = {
  price: "Precio (EUR)",
  purchaseUrl: "Enlace de compra del producto",
  purchaseHelp:
    "Pega la página del producto en la tienda. Chisan enviará allí a quien quiera comprarlo.",
  priceHelp:
    "Opcional. Precio del producto y formato descritos arriba; admite hasta dos decimales.",
  date: "Actualización del producto",
  dateHelp:
    "Se fija al enviar cambios del producto a revisión. Reordenarlo no renueva esta fecha.",
  pendingDate: "Se fechará al enviar",
  shop: "Ver en la tienda",
  demoLink: "Probar enlace de ejemplo",
  demo: "Demostración: precio y enlace ficticios; este producto no está a la venta.",
  shopHelp:
    "La compra se realiza en la tienda enlazada. Confirma allí el precio y las condiciones actuales.",
  week: "Actualizado esta semana",
  month: "Actualizado este mes",
  year: "Actualizado en el último año",
  updated: "Actualizado el",
  recordedPrice: "Precio indicado",
  empty: "Sin indicar",
};
const ca: Labels = {
  price: "Preu (EUR)",
  purchaseUrl: "Enllaç de compra del producte",
  purchaseHelp:
    "Enganxa la pàgina del producte a la botiga. Chisan hi enviarà qui vulgui comprar-lo.",
  priceHelp:
    "Opcional. Preu del producte i format descrits més amunt; admet fins a dos decimals.",
  date: "Actualització del producte",
  dateHelp:
    "Es fixa en enviar canvis del producte a revisió. Reordenar-lo no renova aquesta data.",
  pendingDate: "Es datarà en enviar",
  shop: "Veure a la botiga",
  demoLink: "Provar enllaç d’exemple",
  demo: "Demostració: preu i enllaç ficticis; aquest producte no està a la venda.",
  shopHelp:
    "La compra es fa a la botiga enllaçada. Confirma-hi el preu i les condicions actuals.",
  week: "Actualitzat aquesta setmana",
  month: "Actualitzat aquest mes",
  year: "Actualitzat durant l’últim any",
  updated: "Actualitzat el",
  recordedPrice: "Preu indicat",
  empty: "Sense indicar",
};
export function getProductCommerceLabels(locale: Locale) {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}
export function formatProductPrice(
  price: { amount: string; currency: "EUR" },
  locale: Locale,
) {
  return new Intl.NumberFormat(getLocaleDisplayTag(locale), {
    style: "currency",
    currency: price.currency,
  }).format(Number(price.amount));
}
export function productUpdatePresentation(
  day: string,
  locale: Locale,
  now = new Date(),
) {
  const words = getProductCommerceLabels(locale);
  const date = new Date(`${day}T00:00:00Z`);
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  const weekStart = new Date(today);
  weekStart.setUTCDate(
    weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7),
  );
  const yearAgo = new Date(today);
  // Calendar-year anniversary, clamped to February 28 after a leap day.
  const month = yearAgo.getUTCMonth();
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
  if (yearAgo.getUTCMonth() !== month) yearAgo.setUTCDate(0);
  const past = date.getTime() <= today;
  const exact = new Intl.DateTimeFormat(getLocaleDisplayTag(locale), {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
  const label =
    past && date >= weekStart
      ? words.week
      : past && day.slice(0, 7) === now.toISOString().slice(0, 7)
        ? words.month
        : past && date >= yearAgo
          ? words.year
          : `${words.updated} ${exact}`;
  return { label, exact: `${words.updated} ${exact}` };
}
