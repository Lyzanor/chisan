import { and, desc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { updateProducerProfileQrAction } from "@/app/(application)/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import {
  ProducerChangeForm,
  type ProducerChangeFormField,
} from "@/components/account/producer-change-form";
import { ProfileQrLabel } from "@/components/profile-qr-label";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  hasProducerAccess,
  hasProducerOwnerAccess,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import { isProducerChangeSubmissionEnabled } from "@/lib/accounts/config";
import {
  ONLINE_SALES_VALUES,
  PRODUCER_CATEGORIES,
  PRODUCER_PREMIUM_EDITABLE_FIELDS,
  PRODUCER_STANDARD_EDITABLE_FIELDS,
  SALES_CHANNEL_VALUES,
  hashProducerFields,
  type ProducerEditableField,
} from "@/lib/accounts/producer-fields";
import { getActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import {
  producerChangeRequests,
  producerProfileUpgradeRequests,
} from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { getCategoryLabel } from "@/lib/i18n/categories";
import {
  formatProducerFieldLabel,
  formatProducerFieldValue,
  getDescriptionLocaleOptions,
} from "@/lib/i18n/producer-fields";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";
import { isProfileQrEnabled } from "@/lib/profile-qr";

export const metadata: Metadata = {
  title: "Edit producer profile",
  robots: { index: false, follow: false },
};

type EditProducerPageProps = {
  params: Promise<{ country: string; producerId: string }>;
  searchParams: Promise<AccountMessageParams>;
};

function ProducerQrSettings({
  country,
  enabled,
  locale,
  name,
  path,
  producerId,
}: {
  country: string;
  enabled: boolean;
  locale: Parameters<typeof ProfileQrLabel>[0]["locale"];
  name: string;
  path: string;
  producerId: number;
}) {
  return (
    <section className="account-callout account-form-section--premium">
      <strong>Premium QR label</strong>
      <p>
        The producer QR is optional. It appears publicly only after the verified owner enables
        it here, and only while the expanded-profile entitlement remains active.
      </p>
      <form action={updateProducerProfileQrAction} className="account-form">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <label className="account-field">
          <span>QR label</span>
          <span>
            <input
              type="checkbox"
              name="profileQrEnabled"
              value="yes"
              defaultChecked={enabled}
            />{" "}
            Show and enable the downloadable QR label
          </span>
        </label>
        <button type="submit" className="account-button">
          Save QR preference
        </button>
      </form>
      {enabled ? (
        <ProfileQrLabel
          kind="producer"
          locale={locale}
          name={name}
          path={path}
        />
      ) : null}
    </section>
  );
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

  const [[openChange], premiumEntitlement, owner, [latestUpgrade]] = await Promise.all([
    getDatabase()
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
      .limit(1),
    getActiveProducerPremiumEntitlement(country, producerId),
    hasProducerOwnerAccess(account.id, country, producerId),
    getDatabase()
      .select({
        status: producerProfileUpgradeRequests.status,
      })
      .from(producerProfileUpgradeRequests)
      .where(
        and(
          eq(producerProfileUpgradeRequests.country, country),
          eq(producerProfileUpgradeRequests.producerId, producerId),
        ),
      )
      .orderBy(desc(producerProfileUpgradeRequests.createdAt))
      .limit(1),
  ]);

  const publicHref = buildAccountProducerHref(producer, presentation.explicitLocale);
  const premiumActive = Boolean(premiumEntitlement);
  const producerQrEnabled = isProfileQrEnabled(premiumEntitlement?.metadata);
  const producerQrSettings =
    premiumActive && owner ? (
      <ProducerQrSettings
        country={country}
        enabled={producerQrEnabled}
        locale={presentation.locale}
        name={producer.name}
        path={publicHref}
        producerId={producerId}
      />
    ) : null;
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
        {producerQrSettings}
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
        {producerQrSettings}
      </div>
    );
  }

  const descriptionLocaleOptions = getDescriptionLocaleOptions(
    presentation.messages,
    presentation.locale,
  );
  const communityMessageLocaleOptions = descriptionLocaleOptions.map((option) =>
    option.value
      ? option
      : { ...option, label: presentation.messages.common.unavailable },
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
  const guidedVisitsOptions = [
    { label: presentation.messages.common.unavailable, value: "" },
    ...(["sí", "no"] as const).map((value) => ({
      label: formatProducerFieldValue(
        "visitas guiadas",
        value,
        presentation.locale,
        presentation.messages,
      ),
      value,
    })),
  ];
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
    } else if (field.kind === "yes-no") {
      options = guidedVisitsOptions;
    } else if (field.kind === "sales-channels") {
      options = salesChannelOptions;
    } else if (field.kind === "description-locale") {
      options =
        field.key === "mensaje_comunidad_locale"
          ? communityMessageLocaleOptions
          : descriptionLocaleOptions;
    }
    return {
      help: presentation.messages.ownerProducerFieldHelp[field.key],
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
  const standardFields = PRODUCER_STANDARD_EDITABLE_FIELDS.map(toFormField);
  const premiumFields = premiumActive
    ? PRODUCER_PREMIUM_EDITABLE_FIELDS.map(toFormField)
    : [];
  const upgradeNeedsReconciliation =
    !premiumActive &&
    latestUpgrade &&
    ["paid", "paid_unfulfilled", "partially_refunded", "disputed"].includes(
      latestUpgrade.status,
    );
  const upgradePending = !premiumActive && latestUpgrade?.status === "pending";
  const checkoutReady = getStripeProfileUpgradeConfiguration().checkoutReady;
  const canOpenUpgrade =
    premiumActive ||
    (owner && (checkoutReady || upgradePending || Boolean(upgradeNeedsReconciliation)));

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

      <div className="account-callout">
        <strong>
          {premiumActive
            ? "Expanded profile fields are active."
            : upgradePending
              ? "Expanded profile payment is pending."
              : upgradeNeedsReconciliation
                ? "Expanded profile requires billing review."
                : checkoutReady
                  ? "Expanded profile available."
                  : "Expanded profile purchases are temporarily unavailable."}
        </strong>
        <p>
          {premiumActive
            ? "Guided visits, a community message and highlighted links can be proposed below."
            : upgradePending
              ? "Stripe has not yet confirmed the open Checkout request. Premium fields remain unavailable until the signed webhook succeeds."
              : upgradeNeedsReconciliation
                ? "Do not start another payment. The verified owner should review the billing status and contact support if requested."
                : !checkoutReady
                  ? "Standard profile corrections remain available. New expanded-profile purchases will return when billing is ready."
                : owner
                  ? "You can unlock guided visits, a community message and highlighted links with one €49 payment."
                  : "The verified owner can unlock guided visits, a community message and highlighted links with one €49 payment."}
        </p>
        {canOpenUpgrade ? (
          <Link
            href={`/cuenta/productores/${country}/${producerId}/ampliar`}
            className="account-button account-button--secondary"
          >
            {premiumActive || upgradePending || upgradeNeedsReconciliation
              ? "View upgrade status"
              : "Expand profile"}
          </Link>
        ) : null}
      </div>

      {producerQrSettings}

      <ProducerChangeForm
        baseRowHash={hashProducerFields(producer.fields)}
        country={producer.country}
        premiumFields={premiumFields}
        producerId={producer.producerId}
        standardFields={standardFields}
      />
    </div>
  );
}
