import { ProducerLinkCard } from "@/components/producer-link-card";

import { ProducerCommercialDetails } from "./producer-commercial-details";
import { EXTRA_PREMIUM_FIELDS } from "@/lib/catalog/producer-schema";
import { hasProducerContent, type ProducerContent as Content } from "@/lib/catalog/content-schema";
import { publicHighlightedLinks } from "@/lib/catalog/public-expanded";
import { ProducerContent } from "@/components/producer-content";
import { ProducerPeople } from "@/components/producer-people";
import { YoutubePlayer } from "@/components/youtube-player";
import { buildProductStructuredData } from "@/lib/catalog/product-structured-data";
import { serializeStructuredData } from "@/lib/producer-structured-data";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { getProducerContentLabels } from "@/lib/i18n/producer-content";
import { producerProfileLabels } from "@/lib/i18n/producer-profile";
import { formatProducerFieldLabel, formatProducerFieldValue } from "@/lib/i18n/producer-fields";

type ExpandedProducerProfileProps = {
  content: Content | null;
  identityImageSrc: string;
  canonicalUrl: string;
  country: string;
  fields: Readonly<Record<string, string>>;
  hasSources: boolean;
  locale: Locale;
  messages: Messages;
  producerId: number;
};

function fieldValue(fields: Readonly<Record<string, string>>, key: string): string {
  return fields[key]?.trim() ?? "";
}

export function ExpandedProducerProfile({
  content,
  identityImageSrc,
  canonicalUrl,
  country,
  fields,
  hasSources,
  locale,
  messages,
  producerId,
}: ExpandedProducerProfileProps) {
  const contentLabels = getProducerContentLabels(locale);
  const structuredData = content ? buildProductStructuredData(content, canonicalUrl) : null;
  const guidedVisits = fieldValue(fields, "visitas guiadas");
  const video = fieldValue(fields, "video");
  const communityMessage = fieldValue(fields, "mensaje a la comunidad");
  const communityMessageLocale = fieldValue(fields, "mensaje_comunidad_locale");
  const behindProducer = fieldValue(fields, "quien hay detras");
  const behindProducerLocale = fieldValue(fields, "quien_hay_detras_locale");
  const newsDate = fieldValue(fields, "fecha novedades");
  const history = fieldValue(fields, "historia");
  const historyLocale = fieldValue(fields, "historia_locale");
  const highlightedLinks = publicHighlightedLinks(fields, content?.links ?? []).map(
    ({ key, href }) => ({
      href,
      label: key === "enlace destacado 1"
        ? messages.fieldLabels.highlightedLink1
        : messages.fieldLabels.highlightedLink2,
    }),
  );
  if (
    !video && !guidedVisits && !communityMessage && !behindProducer && !history &&
    !EXTRA_PREMIUM_FIELDS.some((field) => fields[field.key]) &&
    !highlightedLinks.length && !(content && hasProducerContent(content))
  ) return null;

  return (
    <div id="detail-expanded" className="detail-expanded-profile">
      {structuredData ? (
        <script id="producer-products-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
      ) : null}
      {content?.links.length ? <div className="detail-expanded-profile__content"><ProducerContent content={content} locale={locale} showGallery={false} showProducts={false} identityImageSrc={identityImageSrc} /></div> : null}
      {video ? <YoutubePlayer videoUrl={video} label={formatProducerFieldLabel("video", locale, messages)} locale={locale} /> : null}
      {behindProducer || (content && (content.people?.length ?? 0) > 0) ? (
        <ProducerPeople
          people={content?.people ?? []}
          introduction={behindProducer}
          introductionLocale={behindProducerLocale}
          title={formatProducerFieldLabel("quien hay detras", locale, messages)}
          captionLabel={producerProfileLabels(locale).photoCaption}
        />
      ) : null}
      {history ? (
        <section className="detail-story" aria-labelledby="detail-story-title">
          <h2 id="detail-story-title">{formatProducerFieldLabel("historia", locale, messages)}</h2>
          <p lang={historyLocale || undefined}>{history}</p>
        </section>
      ) : null}
      {communityMessage ? (
        <section className="detail-news" aria-labelledby="detail-news-title">
          <h2 id="detail-news-title">{formatProducerFieldLabel("mensaje a la comunidad", locale, messages)}</h2>
          <ol className="detail-news__feed">
            <li>
              <article>
                {newsDate ? <time dateTime={newsDate}>{formatProducerFieldValue("fecha novedades", newsDate, locale, messages)}</time> : null}
                <p lang={communityMessageLocale || undefined}>{communityMessage}</p>
              </article>
            </li>
          </ol>
        </section>
      ) : null}
      <ProducerCommercialDetails
        fields={fields}
        guidedVisits={guidedVisits}
        locale={locale}
        messages={messages}
        country={country}
        producerId={producerId}
        hasSources={hasSources}
      />
      {highlightedLinks.length ? (
        <section className="detail-highlighted-links" aria-labelledby="detail-highlighted-links-title">
          <h2 id="detail-highlighted-links-title">{contentLabels.links}</h2>
          <ul className="chisan-link-cards">
            {highlightedLinks.map(({ href, label }) => (
              <li key={href}>
                <ProducerLinkCard href={href} label={label} imageSrc={identityImageSrc} identity />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
