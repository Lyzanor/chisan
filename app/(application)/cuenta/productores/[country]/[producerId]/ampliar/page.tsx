import { and, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  recheckProducerProfileUpgradeCheckout,
  startProducerProfileUpgradeCheckout,
} from "@/app/(application)/cuenta/profile-upgrade-actions";
import { ProfileUpgradeStatusRefresh } from "@/components/account/profile-upgrade-status-refresh";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import {
  hasProducerAccess,
  hasProducerOwnerAccess,
  requireCurrentAccount,
} from "@/lib/accounts/auth";
import { profileUpgradeRequestUsesStoredOffer } from "@/lib/accounts/producer-profile-upgrade-domain";
import { hasActiveProducerPremiumEntitlement } from "@/lib/accounts/producer-premium-entitlements";
import { PRODUCER_PROFILE_UPGRADE_TERMS_VERSION } from "@/lib/accounts/producer-profile-upgrade-policy";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerProfileUpgradeRequests } from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { formatMinorCurrencyAmount } from "@/lib/payments/currency";
import { STRIPE_PAYMENT_PROVIDER } from "@/lib/payments/payment-provider";
import { getStripeProfileUpgradeConfiguration } from "@/lib/payments/stripe-profile-upgrade-config";

export const metadata: Metadata = {
  title: "Ampliar perfil del productor",
  robots: { index: false, follow: false },
};

type UpgradePageProps = {
  params: Promise<{ country: string; producerId: string }>;
  searchParams: Promise<{ checkout?: string; upgrade?: string }>;
};

const UPGRADE_MESSAGE_COPY = {
  accept_terms: ["error", "Acepta la versión vigente de la oferta de ampliación del perfil antes de pagar."],
  already_active: ["notice", "Este productor ya tiene un perfil ampliado."],
  another_owner_pending: [
    "error",
    "Otro titular ya ha iniciado una solicitud de pago para este productor.",
  ],
  catalog_missing: ["error", "Ese productor ya no está en el catálogo."],
  checkout_expired: ["notice", "El proceso de pago anterior ha caducado. Inicia uno nuevo."],
  current_status: ["notice", "Revisa el estado actual del pago a continuación."],
  owner_changed: ["error", "Tu acceso como titular cambió antes de iniciar el pago."],
  owner_required: ["error", "Solo el titular verificado puede comprar esta ampliación del perfil."],
  payment_confirming: ["notice", "El proveedor de pagos está confirmando el pago."],
  recheck_failed: [
    "error",
    "No se ha podido consultar el proveedor de pagos de forma segura. No se ha iniciado ningún pago nuevo; inténtalo más tarde.",
  ],
  stripe_no_url: ["error", "Stripe no ha devuelto un enlace de pago."],
  unavailable: ["error", "Las ampliaciones de perfil no están disponibles en este momento."],
} as const;

const STATUS_LABELS = {
  pending: "Pendiente", paid: "Pagado", paid_unfulfilled: "Pagado, pendiente de activación",
  payment_failed: "Pago fallido", expired: "Caducado", partially_refunded: "Devuelto parcialmente",
  refunded: "Devuelto", disputed: "En disputa", dispute_lost: "Cargo devuelto tras disputa",
} as const;

const STATUS_COPY = {
  pending: "Hay un proceso de pago abierto. El pago todavía no se ha confirmado.",
  paid: "El proveedor de pagos ha confirmado esta compra.",
  paid_unfulfilled:
    "El proveedor ha registrado un pago, pero Chisan no ha podido activar el perfil de forma segura. Soporte debe revisar el pago o devolverlo.",
  payment_failed: "El pago diferido ha fallado. Puedes iniciar una nueva solicitud.",
  expired: "El proceso de pago anterior ha caducado sin que se confirmara el pago.",
  partially_refunded:
    "Se ha devuelto parte de este pago. El perfil ampliado está suspendido a la espera de revisión.",
  refunded: "Este pago ha sido devuelto y se ha revocado el acceso al perfil ampliado.",
  disputed: "Este pago está en disputa. El perfil ampliado está suspendido.",
  dispute_lost:
    "La disputa se ha resuelto con la devolución del cargo y se ha revocado el acceso al perfil ampliado. El productor puede realizar una nueva compra.",
} as const;

export default async function UpgradeProducerProfilePage({
  params,
  searchParams,
}: UpgradePageProps) {
  const [{ country: rawCountry, producerId: rawProducerId }, query, account, presentation] =
    await Promise.all([
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

  const [owner, premiumActive, [latestRequest]] = await Promise.all([
    hasProducerOwnerAccess(account.id, country, producerId),
    hasActiveProducerPremiumEntitlement(country, producerId),
    getDatabase()
      .select()
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
  const paymentConfiguration = getStripeProfileUpgradeConfiguration();
  const checkoutReady = paymentConfiguration.checkoutReady;
  const latestUsesStripe =
    latestRequest?.paymentProvider === STRIPE_PAYMENT_PROVIDER;
  const requestUsesStoredOffer =
    latestUsesStripe && latestRequest && profileUpgradeRequestUsesStoredOffer(latestRequest);
  const displayedTermsUrl = requestUsesStoredOffer
    ? latestRequest.termsUrl
    : paymentConfiguration.termsUrl;
  const displayedTermsVersion = requestUsesStoredOffer
    ? latestRequest.termsVersion
    : PRODUCER_PROFILE_UPGRADE_TERMS_VERSION;
  const staleFormerOwnerRequest =
    latestUsesStripe &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId !== account.id &&
    latestRequest.providerCheckoutId === null;
  const unattachedCurrentOwnerRequest =
    latestUsesStripe &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId === account.id &&
    latestRequest.providerCheckoutId === null;
  const canStartCheckout =
    owner &&
    checkoutReady &&
    !premiumActive &&
    (!latestRequest ||
      ["expired", "payment_failed", "refunded", "dispute_lost"].includes(
        latestRequest.status,
      ) ||
      staleFormerOwnerRequest ||
      unattachedCurrentOwnerRequest);
  const canResumeCheckout =
    owner &&
    paymentConfiguration.webhookReady &&
    !premiumActive &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId === account.id &&
    latestUsesStripe &&
    latestRequest.providerCheckoutId !== null;
  const pendingFromAnotherOwner =
    owner &&
    !premiumActive &&
    latestRequest?.status === "pending" &&
    latestRequest.requesterUserId !== account.id &&
    !staleFormerOwnerRequest;
  const upgradeMessage =
    query.upgrade && query.upgrade in UPGRADE_MESSAGE_COPY
      ? UPGRADE_MESSAGE_COPY[query.upgrade as keyof typeof UPGRADE_MESSAGE_COPY]
      : null;

  return (
    <div className="account-content account-content--narrow">
      {upgradeMessage ? (
        <div
          className={`account-callout${upgradeMessage[0] === "error" ? " account-callout--error" : ""}`}
          role={upgradeMessage[0] === "error" ? "alert" : "status"}
        >
          <p>{upgradeMessage[1]}</p>
        </div>
      ) : null}
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Perfil ampliado del productor</p>
          <h2>{producer.name}</h2>
          <p>
            {premiumActive
              ? "Acceso ampliado activo"
              : checkoutReady || latestUsesStripe
                ? "Pago único · 49 €"
                : "Acceso vinculado al productor"}
          </p>
        </div>
        <Link href={publicHref} className="account-button account-button--secondary">
          Perfil público
        </Link>
      </header>

      {latestUsesStripe &&
      query.checkout === "cancelled" &&
      latestRequest?.status === "pending" ? (
        <div className="account-callout" role="status">
          <strong>Se ha cancelado el proceso de pago.</strong>
          <p>El acceso al perfil ampliado no se concede hasta que Stripe confirma el pago.</p>
        </div>
      ) : null}
      {latestUsesStripe &&
      query.checkout === "success" &&
      latestRequest?.status === "pending" ? (
        <div className="account-callout" role="status">
          <strong>Stripe está confirmando el pago.</strong>
          <p>Volver a esta página no confirma el pago. La página se actualizará cuando Stripe lo confirme.</p>
          <ProfileUpgradeStatusRefresh enabled />
        </div>
      ) : null}

      {premiumActive ? (
        <div className="account-callout account-callout--success" role="status">
          <strong>Perfil ampliado activo</strong>
          <p>
            Los campos premium ya están disponibles en el formulario habitual de propuestas para revisión.
          </p>
          <Link
            href={`/cuenta/productores/${country}/${producerId}/editar`}
            className="account-button"
          >
            Editar perfil ampliado
          </Link>
        </div>
      ) : null}

      {latestRequest ? (
        <section
          className="account-card"
          aria-live={premiumActive ? undefined : "polite"}
          aria-atomic="true"
        >
          <p className="catalog-kicker">Última solicitud</p>
          <h3>{STATUS_LABELS[latestRequest.status]}</h3>
          <p>{STATUS_COPY[latestRequest.status]}</p>
          <small>
            Solicitud {latestRequest.id} · Oferta{" "}
            {formatMinorCurrencyAmount(
              latestRequest.amountMinor,
              latestRequest.currency,
              "es-ES",
            )}
            {latestRequest.amountCapturedMinor !== null && latestRequest.capturedCurrency
              ? ` · Cobrado ${formatMinorCurrencyAmount(
                  latestRequest.amountCapturedMinor,
                  latestRequest.capturedCurrency,
                  "es-ES",
                )}`
              : ""}
            {latestRequest.amountRefundedMinor > 0
              ? ` · Devuelto ${formatMinorCurrencyAmount(
                  latestRequest.amountRefundedMinor,
                  latestRequest.capturedCurrency ?? latestRequest.currency,
                  "es-ES",
                )}`
              : ""}
            {` · Proveedor ${latestRequest.paymentProvider}`}
          </small>
        </section>
      ) : null}

      {!premiumActive && (checkoutReady || latestUsesStripe) ? (
        <section className="account-card">
          <h3>Qué incluye el pago de 49 €</h3>
          <ul>
            <li>Disponibilidad de visitas guiadas.</li>
            <li>Un mensaje del productor a la comunidad.</li>
            <li>Dos enlaces externos destacados.</li>
          </ul>
          <p>
            Es una función de pago único vinculada a este productor mientras su ficha siga publicada, salvo devolución o disputa del pago. No garantiza una presencia permanente ni compra verificación, posición o publicación automática. Todos los cambios de datos siguen sujetos a revisión editorial y las correcciones habituales continúan siendo gratuitas.
          </p>
          {displayedTermsUrl ? (
            <p>
              Lee la versión vigente de la{" "}
              <a href={displayedTermsUrl} target="_blank" rel="noreferrer">
                oferta y condiciones de ampliación del perfil
              </a>{" "}
              antes de pagar. Definen el tratamiento fiscal, el soporte y el proceso de devolución de esta compra de 49 €. <small>Oferta {displayedTermsVersion}</small>
            </p>
          ) : null}

          {canStartCheckout || canResumeCheckout ? (
            <form action={startProducerProfileUpgradeCheckout} className="account-form">
              <input type="hidden" name="country" value={country} />
              <input type="hidden" name="producerId" value={producerId} />
              <input
                type="hidden"
                name="termsVersion"
                value={PRODUCER_PROFILE_UPGRADE_TERMS_VERSION}
              />
              {canStartCheckout && paymentConfiguration.termsUrl ? (
                <input
                  type="hidden"
                  name="termsUrl"
                  value={paymentConfiguration.termsUrl}
                />
              ) : null}
              {canStartCheckout && displayedTermsUrl ? (
                <label className="account-check">
                  <input type="checkbox" name="acceptUpgradeTerms" value="yes" required />
                  <span>
                    He leído y acepto la{" "}
                    <a href={displayedTermsUrl} target="_blank" rel="noreferrer">
                      oferta y condiciones de ampliación del perfil (oferta {displayedTermsVersion})
                    </a>
                    . Entiendo que se requiere revisión editorial y que una devolución o disputa suspende el perfil ampliado.
                  </span>
                </label>
              ) : null}
              <button type="submit" className="account-button">
                {canResumeCheckout ? "Continuar con el pago seguro" : "Ampliar perfil por 49 €"}
              </button>
              <small>El pago se realiza de forma segura en Stripe Checkout.</small>
            </form>
          ) : !owner ? (
            <div className="account-callout">
              <strong>Se requiere autorización del titular</strong>
              <p>Los editores pueden mantener un perfil ampliado activo, pero solo su titular verificado puede comprarlo.</p>
            </div>
          ) : pendingFromAnotherOwner && latestUsesStripe ? (
            <div className="account-callout">
              <strong>El proceso de pago de un titular anterior sigue abierto.</strong>
              <p>
                No inicies otro pago. Esta solicitud vinculada al productor debe completarse o caducar antes de que el titular actual pueda iniciar otro proceso de pago.
              </p>
              {paymentConfiguration.webhookReady ? (
                <form action={recheckProducerProfileUpgradeCheckout} className="account-form">
                  <input type="hidden" name="country" value={country} />
                  <input type="hidden" name="producerId" value={producerId} />
                  <input type="hidden" name="requestId" value={latestRequest.id} />
                  <button type="submit" className="account-button account-button--secondary">
                    Consultar el pago anterior
                  </button>
                  <small>
                    Esta acción solo consulta a Stripe el estado del proceso existente. No transfiere ni crea un pago.
                  </small>
                </form>
              ) : null}
            </div>
          ) : !checkoutReady ? (
            <div className="account-callout">
              <strong>Las nuevas compras no están disponibles temporalmente.</strong>
              <p>Los perfiles ampliados existentes y las confirmaciones de pago siguen activos.</p>
            </div>
          ) : latestRequest?.status === "paid_unfulfilled" ||
            latestRequest?.status === "paid" ||
            latestRequest?.status === "partially_refunded" ||
            latestRequest?.status === "disputed" ? (
            <div className="account-callout">
              <strong>Se requiere una revisión manual del pago</strong>
              <p>No inicies otro pago. Contacta con soporte de Chisan e indica el identificador de solicitud anterior.</p>
              {paymentConfiguration.supportEmail ? (
                <a
                  href={`mailto:${paymentConfiguration.supportEmail}?subject=${encodeURIComponent(`Ampliación de perfil ${latestRequest.id}`)}`}
                  className="account-button account-button--secondary"
                >
                  Contactar con soporte de facturación
                </a>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : !premiumActive ? (
        <section className="account-card">
          <h3>Las compras de perfiles ampliados todavía no están habilitadas</h3>
          <p>
            Chisan todavía no ha activado la compra de esta función. Las correcciones del perfil básico siguen disponibles de forma gratuita.
          </p>
        </section>
      ) : null}
    </div>
  );
}
