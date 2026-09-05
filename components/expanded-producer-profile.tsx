import { hasProducerContent } from "@/lib/catalog/content-schema";
import { loadPublicExpandedContent, publicHighlightedLinks } from "@/lib/catalog/public-expanded";
import { ProducerContent } from "@/components/producer-content";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import {
  formatProducerFieldLabel,
  formatProducerFieldValue,
} from "@/lib/i18n/producer-fields";

type ExpandedProducerProfileProps = {
  country: string;
  fields: Readonly<Record<string, string>>;
  locale: Locale;
  messages: Messages;
  producerId: number;
};

function fieldValue(
  fields: Readonly<Record<string, string>>,
  key: string,
): string {
  return fields[key]?.trim() ?? "";
}

function linkHostname(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export async function ExpandedProducerProfile({
  country,
  fields,
  locale,
  messages,
  producerId,
}: ExpandedProducerProfileProps) {
  const content = await loadPublicExpandedContent(country, producerId, locale);
  if (!content) return null;
  const guidedVisits = fieldValue(fields, "visitas guiadas");
  const video = fieldValue(fields, "video");
  const communityMessage = fieldValue(fields, "mensaje a la comunidad");
  const communityMessageLocale = fieldValue(fields, "mensaje_comunidad_locale");
  const behindProducer = fieldValue(fields, "quien hay detras");
  const behindProducerLocale = fieldValue(fields, "quien_hay_detras_locale");
  const history = fieldValue(fields, "historia");
  const historyLocale = fieldValue(fields, "historia_locale");
  const lastApprovedChange = fieldValue(fields, "fecha ultimo cambio");
  const highlightedLinks = publicHighlightedLinks(fields, content.links).map(({ key, href }) => ({
    href,
    label: key === "enlace destacado 1" ? messages.fieldLabels.highlightedLink1 : messages.fieldLabels.highlightedLink2,
  }));
  if (
    !video &&
    !guidedVisits &&
    !communityMessage &&
    !behindProducer &&
    !history &&
    !lastApprovedChange &&
    !highlightedLinks.length &&
    !hasProducerContent(content)
  ) {
    return null;
  }

  return (
    <section
      id="detail-expanded"
      className="detail-expanded-profile"
      aria-labelledby="detail-expanded-title"
    >
      <p className="detail-expanded-profile__badge" aria-hidden="true">
        {messages.producer.expandedProfile}
      </p>
      <h2 id="detail-expanded-title">{messages.producer.expandedProfile}</h2>
      <ProducerContent content={content} locale={locale} />
      {video ? (
        <a href={video} target="_blank" rel="noreferrer">
          {formatProducerFieldLabel("video", locale, messages)} · YouTube
        </a>
      ) : null}
      {behindProducer ? (
        <div className="detail-expanded-profile__message">
          <h3>
            {formatProducerFieldLabel("quien hay detras", locale, messages)}
          </h3>
          <p lang={behindProducerLocale || undefined}>{behindProducer}</p>
        </div>
      ) : null}
      {history ? (
        <div className="detail-expanded-profile__message">
          <h3>{formatProducerFieldLabel("historia", locale, messages)}</h3>
          <p lang={historyLocale || undefined}>{history}</p>
        </div>
      ) : null}
      {communityMessage ? (
        <div className="detail-expanded-profile__message">
          <h3>{messages.fieldLabels.communityMessage}</h3>
          <p lang={communityMessageLocale || undefined}>{communityMessage}</p>
        </div>
      ) : null}
      {guidedVisits ? (
        <p>
          <strong>{messages.fieldLabels.guidedVisits}:</strong>{" "}
          {formatProducerFieldValue(
            "visitas guiadas",
            guidedVisits,
            locale,
            messages,
          )}
        </p>
      ) : null}
      {lastApprovedChange ? (
        <p>
          <strong>
            {formatProducerFieldLabel("fecha ultimo cambio", locale, messages)}:
          </strong>{" "}
          {formatProducerFieldValue(
            "fecha ultimo cambio",
            lastApprovedChange,
            locale,
            messages,
          )}
        </p>
      ) : null}
      {highlightedLinks.length ? (
        <div className="detail-expanded-profile__links">
          {highlightedLinks.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              {label} · {linkHostname(href)}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
