import { resolveProducerWhatsAppLink } from "../catalog/producer-contact";
import type { Locale } from "../i18n/locales";
import type { PublicProducer, PublicProducerBase } from "./catalog-schema";

const messages: Partial<Record<Locale, (name: string, url: string) => string>> = {
  es: (name, url) => `Hola, he encontrado ${name} en Chisan (${url}). Me gustaría consultar vuestros productos y cómo hacer un pedido.`,
  ca: (name, url) => `Hola, he trobat ${name} a Chisan (${url}). Voldria informació sobre els vostres productes i com fer una comanda.`,
  en: (name, url) => `Hello, I found ${name} on Chisan (${url}). I would like information about your products and how to order.`,
  fr: (name, url) => `Bonjour, j’ai trouvé ${name} sur Chisan (${url}). Je souhaiterais des informations sur vos produits et comment commander.`,
  de: (name, url) => `Hallo, ich habe ${name} auf Chisan gefunden (${url}). Ich möchte mehr über Ihre Produkte und die Bestellmöglichkeiten erfahren.`,
  it: (name, url) => `Buongiorno, ho trovato ${name} su Chisan (${url}). Vorrei informazioni sui vostri prodotti e su come ordinare.`,
  pt: (name, url) => `Olá, encontrei ${name} no Chisan (${url}). Gostaria de saber mais sobre os vossos produtos e como encomendar.`,
  nl: (name, url) => `Hallo, ik heb ${name} op Chisan gevonden (${url}). Ik wil graag meer weten over jullie producten en hoe ik kan bestellen.`,
  ja: (name, url) => `こんにちは。Chisanで${name}を見つけました（${url}）。商品や注文方法について教えていただけますか。`,
};

/** Derived links only. No network calls, sending, ordering or booking. */
export function producerHandoff(
  producer: PublicProducerBase,
  expanded: PublicProducer["expanded"],
): PublicProducer["handoff"] {
  const messageLocale = messages[producer.locale] ? producer.locale : "en";
  const message = messages[messageLocale]!(producer.name, producer.url);
  const phone = producer.contact.phone;
  const email = producer.contact.email;
  const phoneUrl = phone && /^\+[1-9]\d{1,14}$/.test(phone) ? `tel:${phone}` : null;
  const emailUrl = email && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)
    ? `mailto:${encodeURIComponent(email)}?body=${encodeURIComponent(message)}` : null;
  const whatsappUrl = resolveProducerWhatsAppLink({
    phone: phone ?? undefined,
    salesChannels: producer.sales_channels,
    text: message,
  });
  const visits = expanded?.guided_visits;
  return {
    execution: "external_requires_user_authorization",
    phone_url: phoneUrl,
    email_url: emailUrl,
    whatsapp_url: whatsappUrl,
    store_url: producer.store_url,
    message,
    message_locale: messageLocale,
    visits: {
      status: visits === "sí" ? "recorded_yes" : visits === "no" ? "recorded_no" : "unknown",
      booking: visits === "sí" ? expanded?.visit_booking ?? null : null,
      inquiry_url: visits === "sí" ? phoneUrl ?? emailUrl ?? producer.contact.website : null,
    },
  };
}
