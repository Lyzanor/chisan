/**
 * Utilities for direct producer contact channels (phone, WhatsApp, email).
 */

/**
 * Checks whether an international E.164 phone number corresponds to a mobile line.
 * For Spain (+34), mobile lines start with digits 6 or 7 and have 9 national digits.
 */
export function isMobilePhoneNumber(phone: string): boolean {
  const digits = (phone ?? "").replace(/\D/g, "");
  return /^34[67]\d{8}$/.test(digits) || /^[67]\d{8}$/.test(digits);
}

/**
 * Resolves an official WhatsApp direct link (`https://wa.me/...`) for a producer.
 *
 * A producer qualifies if:
 * 1. The phone number is an identified mobile line, OR
 * 2. `salesChannels` explicitly includes "whatsapp" (e.g. landline or VoIP WhatsApp Business account).
 */
export function resolveProducerWhatsAppLink({
  phone,
  salesChannels = [],
  producerName,
  text,
}: {
  phone?: string;
  salesChannels?: readonly string[];
  producerName?: string;
  text?: string;
}): string | null {
  if (!phone) return null;
  const isMobile = isMobilePhoneNumber(phone);
  const hasWhatsAppChannel = salesChannels.includes("whatsapp");

  if (!isMobile && !hasWhatsAppChannel) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  const normalizedNumber = digits.startsWith("34") ? digits : `34${digits}`;
  const message =
    text !== undefined
      ? text
      : producerName
        ? `Hola, he visto vuestro perfil en Chisan.`
        : "";

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalizedNumber}${query}`;
}
