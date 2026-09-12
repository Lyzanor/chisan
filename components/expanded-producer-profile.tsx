import { ProducerCommercialDetails } from "./producer-commercial-details";
import { EXTRA_PREMIUM_FIELDS } from "@/lib/catalog/producer-schema";
import { hasProducerContent } from "@/lib/catalog/content-schema";
import {
  loadPublicExpandedContent,
  publicHighlightedLinks,
} from "@/lib/catalog/public-expanded";
import { ProducerContent } from "@/components/producer-content";
import { YoutubePlayer } from "@/components/youtube-player";
import { buildProductStructuredData } from "@/lib/catalog/product-structured-data";
import { serializeStructuredData } from "@/lib/producer-structured-data";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { getProducerContentLabels } from "@/lib/i18n/producer-content";
import {
  formatProducerFieldLabel,
  formatProducerFieldValue,
} from "@/lib/i18n/producer-fields";

type ExpandedProducerProfileProps = {
  canonicalUrl: string;
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
  canonicalUrl,
  country,
  fields,
  locale,
  messages,
  producerId,
}: ExpandedProducerProfileProps) {
  const content = await loadPublicExpandedContent(country, producerId, locale);
  if (!content) return null;
  const contentLabels = getProducerContentLabels(locale);
  const structuredData = buildProductStructuredData(content, canonicalUrl);
  const guidedVisits = fieldValue(fields, "visitas guiadas");
  const video = fieldValue(fields, "video");
  const videoLabel = formatProducerFieldLabel("video", locale, messages);
  const communityMessage = fieldValue(fields, "mensaje a la comunidad");
  const communityMessageLocale = fieldValue(fields, "mensaje_comunidad_locale");
  const behindProducer = fieldValue(fields, "quien hay detras");
  const behindProducerLocale = fieldValue(fields, "quien_hay_detras_locale");
  const methods = fieldValue(fields, "como producimos");
  const newsDate = fieldValue(fields, "fecha novedades");
  const history = fieldValue(fields, "historia");
  const historyLocale = fieldValue(fields, "historia_locale");
  const lastApprovedChange = fieldValue(fields, "fecha ultimo cambio");
  const highlightedLinks = publicHighlightedLinks(fields, content.links).map(
    ({ key, href }) => ({
      href,
      label:
        key === "enlace destacado 1"
          ? messages.fieldLabels.highlightedLink1
          : messages.fieldLabels.highlightedLink2,
    }),
  );
  if (
    !video &&
    !guidedVisits &&
    !communityMessage &&
    !behindProducer &&
    !history &&
    !methods &&
    !EXTRA_PREMIUM_FIELDS.some(field => fields[field.key]) &&
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
      <h2 id="detail-expanded-title">{messages.producer.expandedProfile}</h2>
      {structuredData ? (
        <script
          id="producer-products-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeStructuredData(structuredData),
          }}
        />
      ) : null}
      {content.products.length && content.links.length ? (
        <nav
          className="detail-expanded-profile__nav"
          aria-label={messages.producer.expandedProfile}
        >
          {content.products.length ? (
            <a href="#producer-content-products">{contentLabels.products}</a>
          ) : null}
          {content.links.length ? (
            <a href="#producer-content-links">{contentLabels.links}</a>
          ) : null}
        </nav>
      ) : null}
      <ProducerContent content={content} locale={locale} showGallery={false} />
      {video ? (
        <YoutubePlayer videoUrl={video} label={videoLabel} locale={locale} />
      ) : null}
      {behindProducer || history || communityMessage || methods ? (
        <div className="detail-expanded-profile__stories">
          {methods ? <div className="detail-expanded-profile__message"><h3>{formatProducerFieldLabel("como producimos", locale, messages)}</h3><p lang={fields.como_producimos_locale || undefined}>{methods}</p></div> : null}
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
              <h3>{formatProducerFieldLabel("mensaje a la comunidad", locale, messages)}</h3>
              {newsDate ? <time dateTime={newsDate}>{formatProducerFieldValue("fecha novedades", newsDate, locale, messages)}</time> : null}
              <p lang={communityMessageLocale || undefined}>
                {communityMessage}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
      <ProducerCommercialDetails fields={fields} locale={locale} messages={messages} country={country} producerId={producerId} />
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
