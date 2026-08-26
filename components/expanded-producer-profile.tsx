import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { getAccountSystemConfiguration } from "@/lib/accounts/config";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { formatProducerFieldValue } from "@/lib/i18n/producer-fields";

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

  const guidedVisits = fieldValue(fields, "visitas guiadas");
  const communityMessage = fieldValue(fields, "mensaje a la comunidad");
  const communityMessageLocale = fieldValue(fields, "mensaje_comunidad_locale");
  const highlightedLink1 = fieldValue(fields, "enlace destacado 1");
  const highlightedLink2 = fieldValue(fields, "enlace destacado 2");
  if (!guidedVisits && !communityMessage && !highlightedLink1 && !highlightedLink2) {
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
