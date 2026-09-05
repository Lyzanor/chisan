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
  title: "Preview your selection",
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
          <h2>Preview your selection</h2>
          <p>
            Only the producers you explicitly choose appear here. Saving a
            favorite keeps it private.
          </p>
          <p>
            {visible
              ? "This selection is already visible through its public link."
              : "This preview is private. Your selection is not published."}
          </p>
        </div>
        <div className="account-inline-actions">
          <Link
            href="/cuenta/favoritos"
            className="account-button account-button--secondary"
          >
            Choose producers
          </Link>
          <Link
            href="/cuenta/perfil"
            className="account-button account-button--secondary"
          >
            Title and visibility
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
        <h2 id="selection-qr-title">Selection QR</h2>
        <p>
          Use it for your shop, event or personal selection. You can change the
          chosen producers without printing a new QR.
        </p>
        <p>
          A selection expresses your choice; it does not certify stock, supply
          relationships or producer verification.
        </p>
        {!visible ? (
          <p>
            Save a public handle and set visibility to Unlisted or Public in
            profile settings before activation.
          </p>
        ) : null}
        {!items.length ? (
          <p>
            Choose at least one published producer before activating the QR.
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
                  I have reviewed this selection and want to enable its QR.
                </span>
              </label>
            ) : null}
            <button
              type="submit"
              className="account-button"
              disabled={!enabled && !canEnable}
            >
              {enabled ? "Disable Selection QR" : "Activate Selection QR"}
            </button>
          </form>
        ) : (
          <p>
            Selection QR requires active account Premium access. You can still
            preview and share your selection using its link.
          </p>
        )}
        {visible && account.publicHandle ? (
          <Link
            href={`/u/${account.publicHandle}`}
            className="account-text-link"
          >
            Open public selection
          </Link>
        ) : null}
      </section>
    </div>
  );
}
