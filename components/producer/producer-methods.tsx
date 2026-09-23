import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { formatProducerFieldLabel } from "@/lib/i18n/producer-fields";

export function ProducerMethods({ text, textLocale, locale, messages }: {
  text: string;
  textLocale?: string;
  locale: Locale;
  messages: Messages;
}) {
  if (!text) return null;
  return (
    <section className="detail-methods" aria-labelledby="detail-methods-title">
      <h2 id="detail-methods-title">{formatProducerFieldLabel("como producimos", locale, messages)}</h2>
      <p lang={textLocale || undefined}>{text}</p>
    </section>
  );
}
