import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { submitProducerSuggestionAction } from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import type { ProducerChangeFormField } from "@/components/account/producer-change-form";
import { ProducerSuggestionForm } from "@/components/account/producer-suggestion-form";
import { hasProducerAccess, requireCurrentAccount } from "@/lib/accounts/auth";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { isProducerSuggestionEnabled } from "@/lib/accounts/config";
import {
  ONLINE_SALES_VALUES,
  PRODUCER_CATEGORIES,
  SALES_CHANNEL_VALUES,
  hashProducerFields,
  type ProducerEditableField,
} from "@/lib/accounts/producer-fields";
import { isProducerOwnershipVerified } from "@/lib/accounts/producer-ownership";
import {
  PRODUCER_SUGGESTION_SECTION_KEYS,
  getProducerSuggestionSection,
  isProducerSuggestionSection,
  producerSuggestionSectionFields,
} from "@/lib/accounts/producer-suggestion-sections";
import { SUGGESTION_NOTE_MAX_CHARACTERS } from "@/lib/accounts/producer-suggestion-submission";
import { newProducerSuggestionPath } from "@/lib/accounts/producer-suggestion-workflow";
import { findProducerById } from "@/lib/csv-catalog";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getCategoryLabel } from "@/lib/i18n/categories";
import {
  formatProducerFieldLabel,
  formatProducerFieldValue,
  getDescriptionLocaleOptions,
} from "@/lib/i18n/producer-fields";

export const metadata: Metadata = {
  title: "Sugerir cambios",
  robots: { index: false, follow: false },
};

type NewSuggestionPageProps = {
  searchParams: Promise<
    AccountMessageParams & {
      country?: string | string[];
      producerId?: string | string[];
      seccion?: string | string[];
    }
  >;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function NewProducerSuggestionPage({
  searchParams,
}: NewSuggestionPageProps) {
  const [account, params, presentation] = await Promise.all([
    requireCurrentAccount("/cuenta/sugerencias/nueva"),
    searchParams,
    loadApplicationPresentation(),
  ]);
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const country = first(params.country).trim().toLowerCase();
  const producerId = Number(first(params.producerId));
  const validProducerKey =
    /^[a-z]{2}$/.test(country) &&
    Number.isSafeInteger(producerId) &&
    producerId > 0;
  const producer = validProducerKey
    ? await findProducerById(country, producerId).catch(() => null)
    : null;

  if (!producer) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        <h2>Elige primero un productor</h2>
        <p>
          Las sugerencias se abren desde la ficha pública del productor que
          quieres corregir.
        </p>
        <Link href="/" className="account-button">
          Explorar productores
        </Link>
      </div>
    );
  }

  const publicHref = buildAccountProducerHref(
    producer,
    presentation.explicitLocale,
  );
  const [claimed, member] = await Promise.all([
    isProducerOwnershipVerified(country, producerId),
    hasProducerAccess(account.id, country, producerId),
  ]);

  if (member) {
    redirect(`/cuenta/productores/${country}/${producerId}/editar`);
  }

  const header = (
    <header className="account-section-heading">
      <div>
        <p className="catalog-kicker">Sugerencia de la comunidad</p>
        <h2>{producer.name}</h2>
        <p>
          {producer.city} · {producer.area}
        </p>
      </div>
      <Link
        href={publicHref}
        className="account-button account-button--secondary"
      >
        Perfil público
      </Link>
    </header>
  );

  if (claimed) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        {header}
        <div className="account-callout">
          <strong>Este productor ya tiene un titular verificado.</strong>
          <p>
            Quien gestiona esta ficha mantiene sus datos directamente, así que
            las sugerencias de la comunidad están cerradas. Si detectas un error
            grave, escríbenos desde la página de contacto.
          </p>
          <Link href="/contact" className="account-button">
            Contactar con el equipo
          </Link>
        </div>
      </div>
    );
  }

  if (!isProducerSuggestionEnabled()) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        {header}
        <div className="account-callout">
          <strong>Las sugerencias están pausadas temporalmente.</strong>
          <p>
            Chisan está realizando tareas de mantenimiento del catálogo. Las
            sugerencias enviadas siguen en revisión y este formulario volverá a
            abrirse al terminar.
          </p>
        </div>
      </div>
    );
  }

  const requestedSection = first(params.seccion).trim().toLowerCase();
  if (!isProducerSuggestionSection(requestedSection)) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        {header}
        <div className="account-callout">
          <strong>Corrige lo que has visto en la ficha.</strong>
          <p>
            Nadie ha reclamado este productor todavía, así que sus datos vienen
            de la investigación editorial y de fuentes públicas. Elige el
            apartado que quieres corregir; el equipo revisará la propuesta antes
            de publicarla.
          </p>
        </div>
        <section>
          <h3>¿Qué apartado quieres corregir?</h3>
          <ul className="account-record-list">
            {PRODUCER_SUGGESTION_SECTION_KEYS.map((key) => {
              const definition = getProducerSuggestionSection(key);
              return (
                <li key={key}>
                  <div>
                    <strong>{definition.label}</strong>
                    <p>{definition.help}</p>
                  </div>
                  <div className="account-inline-actions">
                    <Link
                      href={newProducerSuggestionPath(country, producerId, key)}
                      className="account-button"
                    >
                      Sugerir cambios
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }

  const definition = getProducerSuggestionSection(requestedSection);
  const descriptionLocaleOptions = getDescriptionLocaleOptions(
    presentation.messages,
    presentation.locale,
  );
  const categoryOptions = PRODUCER_CATEGORIES.map((value) => ({
    label: getCategoryLabel(value, presentation.locale),
    value,
  }));
  const onlineSalesOptions = ONLINE_SALES_VALUES.map((value) => ({
    label: formatProducerFieldValue(
      "Venta online",
      value,
      presentation.locale,
      presentation.messages,
    ),
    value,
  }));
  const salesChannelOptions = SALES_CHANNEL_VALUES.map((value) => ({
    label: formatProducerFieldValue(
      "Canal de venta",
      value,
      presentation.locale,
      presentation.messages,
    ),
    value,
  }));
  const toFormField = (field: ProducerEditableField): ProducerChangeFormField => {
    let options: ProducerChangeFormField["options"] = [];
    if (field.kind === "category" || field.kind === "categories") {
      options = categoryOptions;
    } else if (field.kind === "online-sales") {
      options = onlineSalesOptions;
    } else if (field.kind === "sales-channels") {
      options = salesChannelOptions;
    } else if (field.kind === "description-locale") {
      options = descriptionLocaleOptions;
    }
    return {
      help: presentation.messages.ownerProducerFieldHelp[field.key] ?? field.help,
      initialValue: producer.fields[field.key] ?? "",
      key: field.key,
      kind: field.kind,
      label: formatProducerFieldLabel(
        field.key,
        presentation.locale,
        presentation.messages,
      ),
      maxLength: field.maxLength,
      options,
      required: field.required,
    };
  };

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      {header}

      <div className="account-callout">
        <strong>{definition.label}</strong>
        <p>
          Corrige solo lo que sepas de primera mano o puedas justificar con una
          fuente pública. Una sugerencia no publica nada por sí sola: el equipo
          editorial la comprueba antes de tocar el catálogo, y tu propuesta no
          te concede acceso a la ficha.
        </p>
        <div className="account-inline-actions">
          <Link
            href={newProducerSuggestionPath(country, producerId)}
            className="account-button account-button--secondary"
          >
            Cambiar de apartado
          </Link>
        </div>
      </div>

      <ProducerSuggestionForm
        action={submitProducerSuggestionAction}
        baseRowHash={hashProducerFields(producer.fields)}
        country={producer.country}
        fields={producerSuggestionSectionFields(requestedSection).map(
          toFormField,
        )}
        noteMaxLength={SUGGESTION_NOTE_MAX_CHARACTERS}
        producerId={producer.producerId}
        section={requestedSection}
      />
    </div>
  );
}
