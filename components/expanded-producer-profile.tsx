import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { getAccountSystemConfiguration } from "@/lib/accounts/config";
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

function fieldValue(fields: Readonly<Record<string, string>>, key: string): string {
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
  const guidedVisits = fieldValue(fields, "visitas guiadas");
  const video = fieldValue(fields, "video");
  const communityMessage = fieldValue(fields, "mensaje a la comunidad");
  const communityMessageLocale = fieldValue(fields, "mensaje_comunidad_locale");
  const behindProducer = fieldValue(fields, "quien hay detras");
  const behindProducerLocale = fieldValue(fields, "quien_hay_detras_locale");
  const history = fieldValue(fields, "historia");
  const historyLocale = fieldValue(fields, "historia_locale");
  const lastApprovedChange = fieldValue(fields, "fecha ultimo cambio");
  const highlightedLink1 = fieldValue(fields, "enlace destacado 1");
  const highlightedLink2 = fieldValue(fields, "enlace destacado 2");
  if (
    !video &&
    !guidedVisits &&
    !communityMessage &&
    !behindProducer &&
    !history &&
    !lastApprovedChange &&
    !highlightedLink1 &&
    !highlightedLink2
  ) {
    return null;
  }

  // Producer facts stay in CSV. PostgreSQL supplies only the producer-scoped
  // presentation right, and a database incident must not break the base profile.
  if (!getAccountSystemConfiguration().databaseConfigured) return null;

  try {
    if (!(await hasActiveProducerPremiumEntitlement(country, producerId))) return null;
  } catch (error) {
    console.error("Expanded producer profile is temporarily unavailable.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      country,
      producerId,
    });
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
      {video ? (
        <a href={video} target="_blank" rel="noreferrer">
          {formatProducerFieldLabel("video", locale, messages)} · YouTube
        </a>
      ) : null}
      {behindProducer ? (
        <div className="detail-expanded-profile__message">
          <h3>{formatProducerFieldLabel("quien hay detras", locale, messages)}</h3>
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
          <strong>{formatProducerFieldLabel("fecha ultimo cambio", locale, messages)}:</strong>{" "}
          {formatProducerFieldValue(
            "fecha ultimo cambio",
            lastApprovedChange,
            locale,
            messages,
          )}
        </p>
      ) : null}
      {highlightedLink1 || highlightedLink2 ? (
        <div className="detail-expanded-profile__links">
          {highlightedLink1 ? (
            <a href={highlightedLink1} target="_blank" rel="noreferrer">
              {messages.fieldLabels.highlightedLink1} · {linkHostname(highlightedLink1)}
            </a>
          ) : null}
          {highlightedLink2 ? (
            <a href={highlightedLink2} target="_blank" rel="noreferrer">
              {messages.fieldLabels.highlightedLink2} · {linkHostname(highlightedLink2)}
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
