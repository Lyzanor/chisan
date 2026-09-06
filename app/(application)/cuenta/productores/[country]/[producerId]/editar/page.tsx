import { listProducerMediaUploads } from "@/lib/accounts/producer-media";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { submitProducerChangeAction, updateProducerProfileQrAction } from "@/app/(application)/cuenta/actions";
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
import { loadProducerContent } from "@/lib/catalog/content";
import { PRODUCER_CONTENT_LIMITS } from "@/lib/catalog/content-schema";
import { hashProducerContent } from "@/lib/accounts/producer-content-change";
import { getProducerStatsLabels } from "@/lib/i18n/producer-stats";
import { getProducerEditorLabels } from "@/lib/i18n/producer-editor";
import { isProfileQrEnabled } from "@/lib/profile-qr";

export const metadata: Metadata = {
  title: "Editar perfil del productor",
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
      <strong>QR del productor</strong>
      <p>
        El QR del productor es opcional. Solo aparece públicamente cuando el titular verificado lo activa aquí y mientras su acceso al perfil ampliado siga activo.
      </p>
      <form action={updateProducerProfileQrAction} className="account-form">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <label className="account-field">
          <span>Etiqueta QR</span>
          <span>
            <input
              type="checkbox"
              name="profileQrEnabled"
              value="yes"
              defaultChecked={enabled}
            />{" "}
            Mostrar y permitir descargar la etiqueta QR
          </span>
        </label>
        <button type="submit" className="account-button">
          Guardar preferencia del QR
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

  const labels = getProducerEditorLabels(presentation.locale);
  const publicHref = buildAccountProducerHref(producer, presentation.explicitLocale);
  const premiumActive = Boolean(premiumEntitlement);
  const producerQrEnabled = isProfileQrEnabled(premiumEntitlement?.metadata);
  const statisticsLink = owner ? (
    <Link href={`/cuenta/productores/${country}/${producerId}/estadisticas`} className="account-button account-button--secondary">
      {getProducerStatsLabels(presentation.locale).link}
    </Link>
  ) : null;
  const producerQrSettings =
    premiumActive && owner ? (
      <ProducerQrSettings
        country={country}
        enabled={producerQrEnabled}
        locale={presentation.locale}
        name={producer.name}
        path={buildAccountProducerHref(producer, null)}
        producerId={producerId}
      />
    ) : null;
  if (openChange && (openChange.status !== "draft" || (openChange.requiredEntitlementKey && !premiumActive))) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={query} />
        <h2>{producer.name}</h2>
        <div className="account-callout">
          <strong>{openChange.status === "draft" ? labels.premiumPaused : labels.sent}</strong>
          <p>
            {openChange.status === "draft" ? labels.premiumPausedHelp : labels.sentHelp}
          </p>
          <div className="account-inline-actions">
            <Link href="/cuenta/cambios" className="account-button">
              {labels.viewRequest}
            </Link>
            <Link href={publicHref} className="account-button account-button--secondary">
              {labels.publicProfile}
            </Link>
          </div>
        </div>
        {statisticsLink}
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
          <strong>El envío de cambios de perfil está temporalmente pausado.</strong>
          <p>
            Chisan está realizando tareas de mantenimiento del catálogo. Las solicitudes existentes siguen disponibles para revisión y este formulario volverá a abrirse al terminar.
          </p>
          <Link href={publicHref} className="account-button account-button--secondary">
            {labels.publicProfile}
          </Link>
        </div>
        {statisticsLink}
        {producerQrSettings}
      </div>
    );
  }

  const draft = openChange?.status === "draft" ? openChange : null;
  const content = premiumActive ? await loadProducerContent(country, producerId) : null;
  const uploads = content ? await listProducerMediaUploads(getDatabase(), { userId: account.id, country, producerId }) : [];
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
      options = field.key === "descripcion_locale"
        ? descriptionLocaleOptions
        : communityMessageLocaleOptions;
    }
    return {
      help: presentation.messages.ownerProducerFieldHelp[field.key] ?? field.help,
      initialValue: draft?.patch[field.key] ?? producer.fields[field.key] ?? "",
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
          <p className="catalog-kicker">{labels.editor}</p>
          <h2>{producer.name}</h2>
          <p>
            {producer.city} · {producer.country.toUpperCase()} / {producer.area}
          </p>
        </div>
        <div className="account-inline-actions">
          {statisticsLink}
          <Link href={publicHref} className="account-button account-button--secondary">
            {labels.publicProfile}
          </Link>
        </div>
      </header>

      <div className="account-callout">
        <strong>{labels.process}</strong>
        <p>
          {draft ? labels.draftHelp : labels.reviewHelp}
        </p>
      </div>

      <div className="account-callout">
        <strong>
          {premiumActive
            ? labels.active
            : upgradePending
              ? "El pago del perfil ampliado está pendiente."
              : upgradeNeedsReconciliation
                ? "El perfil ampliado requiere una revisión de facturación."
                : checkoutReady
                  ? "Perfil ampliado disponible."
                  : "Las compras de perfiles ampliados no están disponibles temporalmente."}
        </strong>
        <p>
          {premiumActive
            ? labels.activeHelp
            : upgradePending
              ? "Stripe todavía no ha confirmado el pago pendiente. Los campos premium estarán disponibles cuando se confirme el pago."
              : upgradeNeedsReconciliation
                ? "No inicies otro pago. El titular verificado debe revisar el estado de facturación y contactar con soporte si se solicita."
                : !checkoutReady
                  ? "Las correcciones del perfil básico siguen disponibles. Las compras de perfiles ampliados volverán cuando se reactive la facturación."
                : owner
                  ? "Puedes añadir un vídeo, visitas guiadas, la historia del productor, una presentación del equipo y enlaces destacados con un pago único de 49 €."
                  : "El titular verificado puede añadir un vídeo, visitas guiadas, la historia del productor, una presentación del equipo y enlaces destacados con un pago único de 49 €."}
        </p>
        {canOpenUpgrade ? (
          <Link
            href={`/cuenta/productores/${country}/${producerId}/ampliar`}
            className="account-button account-button--secondary"
          >
            {premiumActive || upgradePending || upgradeNeedsReconciliation
              ? "Ver estado de la ampliación"
              : "Ampliar perfil"}
          </Link>
        ) : null}
      </div>

      {producerQrSettings}

      <ProducerChangeForm
        action={submitProducerChangeAction}
        baseRowHash={draft?.baseRowHash ?? hashProducerFields(producer.fields)}
        locale={presentation.locale}
        products={content ? {
          gallery: draft?.contentChange?.version === 2 ? draft.contentChange.gallery : content.gallery, links: content.links,
          publishedGallery: content.gallery, uploads,
          products: draft?.contentChange?.products ?? content.products,
          baseHash: draft?.contentChange?.baseHash ?? hashProducerContent(content),
          limit: PRODUCER_CONTENT_LIMITS.products,
        } : undefined}
        languageOptions={descriptionLocaleOptions}
        draft={draft ? { id: draft.id, lockVersion: draft.lockVersion, authorNote: draft.authorNote ?? "" } : undefined}
        country={producer.country}
        premiumFields={premiumFields}
        producerId={producer.producerId}
        standardFields={standardFields}
      />
    </div>
  );
}
