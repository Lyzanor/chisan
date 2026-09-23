import { Suspense } from "react";

import { ProducerSuggestionAction } from "@/components/account/producer-account-actions";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { formatProducerFieldLabel, formatProducerFieldValue } from "@/lib/i18n/producer-fields";

export type ProducerPublicSource = {
  checkedAt: string;
  url: string;
};

export type ProducerDetailsProps = {
  countrySlug: string;
  lastApprovedChange?: string;
  locale: Locale;
  messages: Messages;
  ownershipVerified: boolean;
  producerId: number;
  profileWords: {
    checked: string;
    editorial: string;
    pending: string;
    pendingHelp: string;
    sources: string;
    verifiedHelp: string;
  };
  sources: ProducerPublicSource[];
  verification?: string;
};

export function ProducerDetails({
  countrySlug,
  lastApprovedChange,
  locale,
  messages,
  ownershipVerified,
  producerId,
  profileWords,
  sources,
  verification,
}: ProducerDetailsProps) {
  return (
    <section
      id="detail-info"
      className="detail-info"
      aria-labelledby="detail-info-title"
    >
      <div className="detail-info__heading">
        <h2 id="detail-info-title">{messages.producer.details}</h2>
        <Suspense fallback={null}>
          <ProducerSuggestionAction
            country={countrySlug}
            producerId={producerId}
            messages={messages.accountActions}
          />
        </Suspense>
      </div>
      <div className="detail-info__facts">
        <p
          className={
            verification === "pendiente" && !ownershipVerified
              ? "detail-review-notice"
              : "detail-trust-note"
          }
        >
          {ownershipVerified
            ? profileWords.verifiedHelp
            : verification === "pendiente"
              ? profileWords.pendingHelp
              : profileWords.editorial}
        </p>
        {lastApprovedChange ? (
          <p className="detail-info__date">
            <span>{formatProducerFieldLabel("fecha ultimo cambio", locale, messages)}</span>
            <time dateTime={lastApprovedChange}>
              {formatProducerFieldValue("fecha ultimo cambio", lastApprovedChange, locale, messages)}
            </time>
          </p>
        ) : null}
      </div>
      {sources.length ? (
        <details className="detail-sources">
          <summary>{profileWords.sources}</summary>
          <ul>
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.url.replace(/^https?:\/\//, "")}
                </a>
                <small>
                  {profileWords.checked}{" "}
                  <time dateTime={source.checkedAt}>
                    {source.checkedAt}
                  </time>
                </small>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
