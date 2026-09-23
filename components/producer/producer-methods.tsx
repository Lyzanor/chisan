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
  const previewEnd = text.length > 420 ? text.lastIndexOf(" ", 420) : -1;
  const readMore = locale === "es" ? "Leer más" : locale === "ca" ? "Llegir més" : "Read more";
  return (
    <section className="detail-methods" aria-labelledby="detail-methods-title">
      <h2 id="detail-methods-title">{formatProducerFieldLabel("como producimos", locale, messages)}</h2>
      {previewEnd > 0 ? (
        <>
          <p lang={textLocale || undefined}>{text.slice(0, previewEnd)}…</p>
          <details className="chisan-disclosure detail-read-more">
            <summary>{readMore}</summary>
            <p lang={textLocale || undefined}>{text.slice(previewEnd).trimStart()}</p>
          </details>
        </>
      ) : <p lang={textLocale || undefined}>{text}</p>}
    </section>
  );
}
