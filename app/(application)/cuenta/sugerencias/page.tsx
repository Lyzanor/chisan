import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { withdrawProducerSuggestionAction } from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  getProducerSuggestionSection,
  isProducerSuggestionSection,
} from "@/lib/accounts/producer-suggestion-sections";
import { getProducerSuggestionStatusDefinition } from "@/lib/accounts/producer-suggestion-workflow";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerSuggestions } from "@/lib/db/schema";
import { readApplicationLocalePreference } from "@/lib/i18n/application-presentation.server";
import { formatProducerFieldLabel } from "@/lib/i18n/producer-fields";
import { APPLICATION_DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: "Mis sugerencias",
  robots: { index: false, follow: false },
};

type SuggestionsPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function ProducerSuggestionsPage({
  searchParams,
}: SuggestionsPageProps) {
  const account = await requireCurrentAccount("/cuenta/sugerencias");
  const [suggestions, params, explicitLocale] = await Promise.all([
    getDatabase()
      .select()
      .from(producerSuggestions)
      .where(eq(producerSuggestions.authorUserId, account.id))
      .orderBy(desc(producerSuggestions.createdAt)),
    searchParams,
    readApplicationLocalePreference(),
  ]);
  const locale = explicitLocale ?? APPLICATION_DEFAULT_LOCALE;
  const [producers, messages] = await Promise.all([
    findProducersByIds(
      suggestions.map(({ country, producerId }) => ({ country, producerId })),
    ),
    loadMessages(locale),
  ]);

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Sugerencias de la comunidad</h2>
          <p>
            Correcciones que has propuesto para productores que todavía no ha
            reclamado nadie. Una sugerencia aceptada se publica con el flujo
            editorial habitual y nunca te concede acceso a la ficha.
          </p>
        </div>
        <Link href="/" className="account-button account-button--secondary">
          Buscar un productor
        </Link>
      </header>

      {suggestions.length === 0 ? (
        <p className="account-empty">
          Todavía no has enviado ninguna sugerencia. Abre la ficha de un
          productor sin titular verificado y usa «Sugerir cambios».
        </p>
      ) : (
        <ul className="account-record-list">
          {suggestions.map((suggestion, index) => {
            const producer = producers[index];
            const status = getProducerSuggestionStatusDefinition(
              suggestion.status,
            );
            const changedFields = Object.keys(suggestion.patch).map((key) =>
              formatProducerFieldLabel(key, locale, messages),
            );
            return (
              <li
                key={suggestion.id}
                className="account-record-list__stacked"
              >
                <div className="account-record-heading">
                  <div>
                    <strong>
                      {producer?.name ??
                        suggestion.baseSnapshot.nombre ??
                        "Productor ya no publicado"}
                    </strong>
                    <p>
                      {isProducerSuggestionSection(suggestion.section)
                        ? getProducerSuggestionSection(suggestion.section).label
                        : suggestion.section}
                      {" · "}
                      {changedFields.join(", ")}
                    </p>
                  </div>
                  <span
                    className={`account-status account-status--${suggestion.status}`}
                  >
                    {status.accountLabel}
                  </span>
                </div>
                {suggestion.decisionNote ? (
                  <p>{suggestion.decisionNote}</p>
                ) : null}
                <div className="account-inline-actions">
                  {producer ? (
                    <Link
                      href={buildAccountProducerHref(producer, explicitLocale)}
                      className="account-button account-button--secondary"
                    >
                      Perfil público
                    </Link>
                  ) : null}
                  {suggestion.status === "pending" ? (
                    <form action={withdrawProducerSuggestionAction}>
                      <input
                        type="hidden"
                        name="suggestionId"
                        value={suggestion.id}
                      />
                      <button type="submit" className="account-link-button">
                        Retirar sugerencia
                      </button>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
