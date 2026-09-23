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
 * Requires an explicitly recorded WhatsApp sales channel and an E.164 phone.
 * A mobile number alone does not establish WhatsApp availability.
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
  if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone) || !salesChannels.includes("whatsapp")) return null;
  const normalizedNumber = phone.slice(1);
  const message =
    text !== undefined
      ? text
      : producerName
        ? `Hola, he visto vuestro perfil en Chisan.`
        : "";

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalizedNumber}${query}`;
}
