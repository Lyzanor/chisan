import { and, desc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { submitProducerChangeAction } from "@/app/(application)/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { hasProducerAccess, requireCurrentAccount } from "@/lib/accounts/auth";
import { isProducerChangeSubmissionEnabled } from "@/lib/accounts/config";
import {
  ONLINE_SALES_VALUES,
  PRODUCER_CATEGORIES,
  PRODUCER_EDITABLE_FIELDS,
  SALES_CHANNEL_VALUES,
  hashProducerFields,
} from "@/lib/accounts/producer-fields";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerChangeRequests } from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getCategoryLabel } from "@/lib/i18n/categories";
import {
  formatProducerFieldLabel,
  formatProducerFieldValue,
  getDescriptionLocaleOptions,
} from "@/lib/i18n/producer-fields";

export const metadata: Metadata = {
  title: "Edit producer profile",
  robots: { index: false, follow: false },
};

type EditProducerPageProps = {
  params: Promise<{ country: string; producerId: string }>;
  searchParams: Promise<AccountMessageParams>;
};

function valueSet(value: string): Set<string> {
  return new Set(value.split("|").map((item) => item.trim()).filter(Boolean));
}

export default async function EditProducerPage({
  params,
  searchParams,
}: EditProducerPageProps) {
  const [
    { country: rawCountry, producerId: rawProducerId },
    query,
    account,
    presentation,
  ] = await Promise.all([
    params,
    searchParams,
    requireCurrentAccount(),
    loadApplicationPresentation(),
  ]);
  const country = rawCountry.trim().toLowerCase();
  const producerId = Number(rawProducerId);
  if (!/^[a-z]{2}$/.test(country) || !Number.isSafeInteger(producerId) || producerId <= 0) {
    notFound();
  }

  if (!(await hasProducerAccess(account.id, country, producerId))) {
    redirect(
      "/cuenta/reclamaciones?error=An%20approved%20producer%20membership%20is%20required%20for%20this%20profile.",
    );
  }
  const producer = await findProducerById(country, producerId);
  if (!producer) notFound();

  const [openChange] = await getDatabase()
    .select()
    .from(producerChangeRequests)
    .where(
      and(
        eq(producerChangeRequests.authorUserId, account.id),
        eq(producerChangeRequests.country, country),
        eq(producerChangeRequests.producerId, producerId),
        inArray(producerChangeRequests.status, [
          "draft",
          "submitted",
          "needs_changes",
          "approved",
          "applying",
        ]),
      ),
    )
    .orderBy(desc(producerChangeRequests.createdAt))
    .limit(1);

  const publicHref = buildAccountProducerHref(producer, presentation.explicitLocale);
  if (openChange) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={query} />
        <h2>{producer.name}</h2>
        <div className="account-callout">
          <strong>An open proposal already exists.</strong>
          <p>
            Wait for review or withdraw the current request before creating another proposal for
            this producer.
          </p>
          <div className="account-inline-actions">
            <Link href="/cuenta/cambios" className="account-button">
              View request
            </Link>
            <Link href={publicHref} className="account-button account-button--secondary">
              Public profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isProducerChangeSubmissionEnabled()) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={query} />
        <h2>{producer.name}</h2>
        <div className="account-callout">
          <strong>Profile change submissions are temporarily paused.</strong>
          <p>
            Chisan is completing catalog maintenance. Existing requests remain available to
            reviewers, and this form will reopen after the migration is deployed.
          </p>
          <Link href={publicHref} className="account-button account-button--secondary">
            Public profile
          </Link>
        </div>
      </div>
    );
  }

  const additionalCategories = valueSet(producer.fields["categorias adicionales"] ?? "");
  const salesChannels = valueSet(producer.fields["Canal de venta"] ?? "");
  const descriptionLocaleOptions = getDescriptionLocaleOptions(
    presentation.messages,
    presentation.locale,
  );

  return (
    <div className="account-content">
      <AccountMessage params={query} />
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Propose CSV changes</p>
          <h2>{producer.name}</h2>
          <p>
            {producer.city} · {producer.country.toUpperCase()} / {producer.area}
          </p>
        </div>
        <Link href={publicHref} className="account-button account-button--secondary">
          Public profile
        </Link>
      </header>

      <div className="account-callout">
        <strong>Changes are not published immediately.</strong>
        <p>
          A reviewer checks the identity, source and CSV contract. Immutable IDs, routing slugs,
          verification state and image paths remain editorial-only.
        </p>
      </div>

      <form action={submitProducerChangeAction} className="account-form account-form--wide">
        <input type="hidden" name="country" value={producer.country} />
        <input type="hidden" name="producerId" value={producer.producerId} />
        <input type="hidden" name="baseRowHash" value={hashProducerFields(producer.fields)} />

        <div className="account-form-grid">
          {PRODUCER_EDITABLE_FIELDS.map((field) => {
            const value = producer.fields[field.key] ?? "";
            const label = formatProducerFieldLabel(
              field.key,
              presentation.locale,
              presentation.messages,
            );
            const help = presentation.messages.ownerProducerFieldHelp[field.key];
            if (field.kind === "category") {
              return (
                <label key={field.key} className="account-field">
                  <span>{label}</span>
                  <select name={field.key} required defaultValue={value}>
                    {PRODUCER_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category, presentation.locale)}
                      </option>
                    ))}
                  </select>
                  <small>{help}</small>
                </label>
              );
            }
            if (field.kind === "description-locale") {
              return (
                <label key={field.key} className="account-field">
                  <span>{label}</span>
                  <select name={field.key} defaultValue={value}>
                    {descriptionLocaleOptions.map((option) => (
                      <option key={option.value || "none"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <small>{help}</small>
                </label>
              );
            }
            if (field.kind === "categories") {
              return (
                <fieldset key={field.key} className="account-field account-field--full">
                  <legend>{label}</legend>
                  <div className="account-checkbox-grid">
                    {PRODUCER_CATEGORIES.map((category) => (
                      <label key={category} className="account-check account-check--compact">
                        <input
                          type="checkbox"
                          name={field.key}
                          value={category}
                          defaultChecked={additionalCategories.has(category)}
                        />
                        <span>{getCategoryLabel(category, presentation.locale)}</span>
                      </label>
                    ))}
                  </div>
                  <small>{help}</small>
                </fieldset>
              );
            }
            if (field.kind === "online-sales") {
              return (
                <label key={field.key} className="account-field">
                  <span>{label}</span>
                  <select name={field.key} required defaultValue={value || "no comprobado"}>
                    {ONLINE_SALES_VALUES.map((option) => (
                      <option key={option} value={option}>
                        {formatProducerFieldValue(
                          field.key,
                          option,
                          presentation.locale,
                          presentation.messages,
                        )}
                      </option>
                    ))}
                  </select>
                  <small>{help}</small>
                </label>
              );
            }
            if (field.kind === "sales-channels") {
              return (
                <fieldset key={field.key} className="account-field account-field--full">
                  <legend>{label}</legend>
                  <div className="account-checkbox-grid">
                    {SALES_CHANNEL_VALUES.map((channel) => (
                      <label key={channel} className="account-check account-check--compact">
                        <input
                          type="checkbox"
                          name={field.key}
                          value={channel}
                          defaultChecked={salesChannels.has(channel)}
                        />
                        <span>
                          {formatProducerFieldValue(
                            field.key,
                            channel,
                            presentation.locale,
                            presentation.messages,
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                  <small>{help}</small>
                </fieldset>
              );
            }
            if (field.kind === "textarea") {
              return (
                <label key={field.key} className="account-field account-field--full">
                  <span>{label}</span>
                  <textarea
                    name={field.key}
                    defaultValue={value}
                    required={field.required}
                    maxLength={field.maxLength}
                    rows={field.key === "descripcion" ? 6 : 3}
                  />
                  <small>{help}</small>
                </label>
              );
            }

            const inputType = ["email", "url", "tel"].includes(field.kind)
              ? field.kind
              : "text";
            return (
              <label key={field.key} className="account-field">
                <span>{label}</span>
                <input
                  type={inputType}
                  name={field.key}
                  defaultValue={value}
                  required={field.required}
                  maxLength={field.maxLength}
                  inputMode={field.kind === "coordinate" ? "decimal" : undefined}
                />
                <small>{help}</small>
              </label>
            );
          })}
        </div>

        <label className="account-field">
          <span>Reason and public source</span>
          <textarea
            name="authorNote"
            required
            minLength={20}
            maxLength={4_000}
            rows={6}
            placeholder="Explain what changed and include the official page or other public source that supports it."
          />
          <small>Private ownership evidence does not replace a public source for catalog claims.</small>
        </label>
        <button type="submit" className="account-button">
          Submit changes for review
        </button>
      </form>
    </div>
  );
}
