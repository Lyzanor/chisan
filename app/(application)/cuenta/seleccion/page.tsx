import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { updatePublicProfileQrAction } from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { ProducerSelectionPage } from "@/components/producer-selection-page";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getActiveUserProfilePremiumEntitlement } from "@/lib/accounts/profile-qr-entitlements";
import { listPublicProfileFavoriteIdentities } from "@/lib/accounts/public-profiles";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import { selectionPreviewRevision } from "@/lib/accounts/selection-preview";
import { findProducersByIds } from "@/lib/csv-catalog";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import {
  buildAccountSelectionPage,
  buildProducerSelectionItems,
} from "@/lib/producer-selections.server";
import { isProfileQrEnabled } from "@/lib/profile-qr";

export const metadata: Metadata = {
  title: "Vista previa de tu selección",
  robots: { index: false, follow: false },
};

export default async function SelectionPreviewPage({
  searchParams,
}: {
  searchParams: Promise<AccountMessageParams>;
}) {
  const account = await requireCurrentAccount("/cuenta/seleccion");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");
  const [identities, entitlement, presentation, params] = await Promise.all([
    listPublicProfileFavoriteIdentities(account.id),
    getActiveUserProfilePremiumEntitlement(account.id),
    loadApplicationPresentation(),
    searchParams,
  ]);
  const items = buildProducerSelectionItems(
    await findProducersByIds(identities, presentation.locale),
    presentation,
  );
  const selection = buildAccountSelectionPage(
    account,
    items,
    "/cuenta/seleccion",
  );
  const visible =
    Boolean(account.publicHandle) &&
    account.publicProfileVisibility !== "private";
  const enabled = isProfileQrEnabled(entitlement?.metadata);
  const canEnable = visible && items.length > 0;

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Vista previa de tu selección</h2>
          <p>
            Aquí solo aparecen los productores que eliges expresamente. Guardar un favorito lo mantiene privado.
          </p>
          <p>
            {visible
              ? "Esta selección ya es visible mediante su enlace público."
              : "Esta vista previa es privada. Tu selección no está publicada."}
          </p>
        </div>
        <div className="account-inline-actions">
          <Link
            href="/cuenta/favoritos"
            className="account-button account-button--secondary"
          >
            Elegir productores
          </Link>
          <Link
            href="/cuenta/perfil"
            className="account-button account-button--secondary"
          >
            Título y visibilidad
          </Link>
        </div>
      </header>
      <ProducerSelectionPage
        embedded
        selection={selection}
        messages={selectionPageMessages}
        profileQr={
          enabled && visible && account.publicHandle
            ? {
                kind: "selection",
                locale: presentation.locale,
                name: selection.title,
                path: `/u/${account.publicHandle}`,
              }
            : undefined
        }
      />
      <section className="account-callout" aria-labelledby="selection-qr-title">
        <h2 id="selection-qr-title">QR de selección</h2>
        <p>
          Utilízalo para tu tienda, evento o selección personal. Puedes cambiar los productores elegidos sin imprimir otro QR.
        </p>
        <p>
          Una selección expresa tu elección; no certifica existencias, relaciones de suministro ni la verificación de los productores.
        </p>
        {!visible ? (
          <p>
            Guarda un identificador público y elige la visibilidad Sin listar o Público en los ajustes del perfil antes de activar el QR.
          </p>
        ) : null}
        {!items.length ? (
          <p>
            Elige al menos un productor publicado antes de activar el QR.
          </p>
        ) : null}
        {entitlement ? (
          <form action={updatePublicProfileQrAction} className="account-form">
            <input
              type="hidden"
              name="profileQrEnabled"
              value={enabled ? "no" : "yes"}
            />
            <input
              type="hidden"
              name="previewRevision"
              value={selectionPreviewRevision(account, items)}
            />
            {!enabled && canEnable ? (
              <label className="account-field">
                <span>
                  <input type="checkbox" name="reviewed" value="yes" required />{" "}
                  He revisado esta selección y quiero activar su QR.
                </span>
              </label>
            ) : null}
            <button
              type="submit"
              className="account-button"
              disabled={!enabled && !canEnable}
            >
              {enabled ? "Desactivar QR de selección" : "Activar QR de selección"}
            </button>
          </form>
        ) : (
          <p>
            El QR de selección requiere acceso premium activo en la cuenta. Puedes seguir viendo y compartiendo tu selección mediante su enlace.
          </p>
        )}
        {visible && account.publicHandle ? (
          <Link
            href={`/u/${account.publicHandle}`}
            className="account-text-link"
          >
            Abrir selección pública
          </Link>
        ) : null}
      </section>
    </div>
  );
}
