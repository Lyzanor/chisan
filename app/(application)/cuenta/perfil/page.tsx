import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  updateAccountProfileAction,
  updatePublicProfileQrAction,
  updatePublicProfileAction,
} from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { SavedCatalogArea } from "@/components/account/saved-catalog-area";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getActiveUserProfilePremiumEntitlement } from "@/lib/accounts/profile-qr-entitlements";
import { publicProfileBaseLocationKey } from "@/lib/accounts/public-profile-location";
import {
  getLocalizedCatalogLabel,
  listPublishedCountries,
} from "@/lib/csv-catalog";
import {
  EXPLICIT_LOCALE_COOKIE,
  parseAcceptLanguage,
  parseExplicitLocale,
} from "@/lib/i18n/catalog-scope";
import { listEnabledLocationAreas } from "@/lib/location/enabled-location-areas.server";
import { isProfileQrEnabled } from "@/lib/profile-qr";
import { SITE_NAME } from "@/lib/site";

const ACCOUNT_LOCALE = "en" as const;

export const metadata: Metadata = {
  title: "Account profile",
  robots: { index: false, follow: false },
};

type AccountProfilePageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function AccountProfilePage({
  searchParams,
}: AccountProfilePageProps) {
  const [account, params, cookieStore, requestHeaders] = await Promise.all([
    requireCurrentAccount("/cuenta/perfil"),
    searchParams,
    cookies(),
    headers(),
  ]);
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const publicProfilePremiumEntitlement =
    await getActiveUserProfilePremiumEntitlement(account.id);
  const profileQrEnabled = isProfileQrEnabled(
    publicProfilePremiumEntitlement?.metadata,
  );
  const publicProfileVisible =
    Boolean(account.publicHandle) &&
    account.publicProfileVisibility !== "private";

  const publishedCountries = listPublishedCountries();
  const locationAreas = listEnabledLocationAreas({
    countries: publishedCountries,
    locale: ACCOUNT_LOCALE,
  });
  const publicProfileAreaGroups = publishedCountries.flatMap((country) =>
    country.regions.map((region) => ({
      key: `${country.slug}/${region.slug}`,
      label: `${getLocalizedCatalogLabel(
        country,
        ACCOUNT_LOCALE,
      )} · ${getLocalizedCatalogLabel(region, ACCOUNT_LOCALE)}`,
      areas: region.areas.map((area) => ({
        country: country.slug,
        area: area.slug,
        label: getLocalizedCatalogLabel(area, ACCOUNT_LOCALE),
      })),
    })),
  );

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <section aria-labelledby="account-profile-title">
        <header className="account-section-heading">
          <div>
            <h2 id="account-profile-title">Profile</h2>
            <p>
              This information belongs to your {SITE_NAME} account. Sign-in
              email, password and authentication factors are managed securely
              through Clerk.
            </p>
          </div>
        </header>
        <div className="account-callout">
          <strong>
            Profile type:{" "}
            {account.profileKind === "producer" ? "Producer" : "User"}
          </strong>
          <p>
            Every account starts as User. Submitting a producer ownership claim
            changes this automatically to Producer; profile type is not a
            selectable setting.
          </p>
        </div>
        <form action={updateAccountProfileAction} className="account-form">
          <label className="account-field">
            <span>Display name</span>
            <input
              type="text"
              name="displayName"
              maxLength={160}
              defaultValue={account.displayName ?? ""}
              autoComplete="name"
            />
          </label>
          <button type="submit" className="account-button">
            Save profile
          </button>
        </form>
      </section>

      <section aria-labelledby="saved-area-title">
        <header className="account-section-heading">
          <div>
            <h2 id="saved-area-title">Saved catalog area</h2>
            <p>
              {SITE_NAME} can remember one catalog area in this browser so the
              home page opens it directly. The preference belongs to this
              browser only: it is never stored with your account, and your
              device position is never sent to {SITE_NAME}.
            </p>
          </div>
        </header>
        <SavedCatalogArea
          areas={locationAreas}
          explicitLocale={parseExplicitLocale(
            cookieStore.get(EXPLICIT_LOCALE_COOKIE)?.value,
          )}
          browserLocales={parseAcceptLanguage(
            requestHeaders.get("accept-language"),
          )}
        />
      </section>

      <section aria-labelledby="public-profile-title">
        <header className="account-section-heading">
          <div>
            <h2 id="public-profile-title">Public producer selection</h2>
            <p>
              Publish a shareable page containing only the favorites you
              explicitly choose. Give your selection a name and context for your
              shop, event or personal choices.
            </p>
          </div>
          {publicProfileVisible && account.publicHandle ? (
            <Link
              href={`/u/${account.publicHandle}`}
              className="account-button account-button--secondary"
            >
              Open public selection
            </Link>
          ) : null}
        </header>
        <form action={updatePublicProfileAction} className="account-form">
          <label className="account-field">
            <span>Selection title (optional)</span>
            <input
              name="selectionTitle"
              maxLength={160}
              defaultValue={account.selectionTitle ?? ""}
              placeholder="Producers at our autumn market"
            />
          </label>
          <label className="account-field">
            <span>Selection description (optional)</span>
            <textarea
              name="selectionDescription"
              maxLength={600}
              rows={3}
              defaultValue={account.selectionDescription ?? ""}
            />
            <small>
              Explain your choice. This text appears publicly with the
              selection.
            </small>
          </label>
          <label className="account-field">
            <span>Public handle</span>
            <input
              type="text"
              name="publicHandle"
              minLength={3}
              maxLength={40}
              pattern="[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])"
              defaultValue={account.publicHandle ?? ""}
              readOnly={Boolean(account.publicHandle)}
              autoComplete="off"
              aria-describedby="public-handle-help"
            />
            <small id="public-handle-help">
              Your permanent URL will be /u/handle. Use lowercase letters,
              numbers and hyphens.
            </small>
          </label>
          <label className="account-field">
            <span>Base catalog area</span>
            <select
              name="baseLocation"
              required
              defaultValue={
                account.publicProfileBaseCountry &&
                account.publicProfileBaseArea
                  ? publicProfileBaseLocationKey({
                      country: account.publicProfileBaseCountry,
                      area: account.publicProfileBaseArea,
                    })
                  : ""
              }
              aria-describedby="public-base-area-help"
            >
              <option value="" disabled>
                Choose an area
              </option>
              {publicProfileAreaGroups.map((group) => (
                <optgroup key={group.key} label={group.label}>
                  {group.areas.map((area) => (
                    <option
                      key={`${area.country}/${area.area}`}
                      value={`${area.country}/${area.area}`}
                    >
                      {area.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <small id="public-base-area-help">
              Your profile location does not add, group or order the producers
              in your selection.
            </small>
          </label>
          <label className="account-field">
            <span>Base municipality</span>
            <input
              type="text"
              name="baseMunicipality"
              required
              maxLength={160}
              defaultValue={account.publicProfileBaseMunicipality ?? ""}
              placeholder="Barcelona"
              autoComplete="address-level2"
              aria-describedby="public-base-municipality-help"
            />
            <small id="public-base-municipality-help">
              Use a municipality that appears in the selected catalog area. Your
              selection always shows exactly the producers you choose.
            </small>
          </label>
          <label className="account-field">
            <span>Visibility</span>
            <select
              name="visibility"
              defaultValue={account.publicProfileVisibility}
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted — anyone with the link</option>
              <option value="public">Public — eligible for indexing</option>
            </select>
            <small>
              Favorites remain hidden until you enable them individually from
              your favorites page.
            </small>
          </label>
          <button type="submit" className="account-button">
            Save public profile
          </button>
        </form>
        <div className="account-callout">
          <strong>Selection QR</strong>
          <p>
            Choose producers from your favorites, review the complete map and
            activate your QR from the preview.
          </p>
          <Link href="/cuenta/seleccion" className="account-button">
            Preview selection and QR
          </Link>
          {publicProfilePremiumEntitlement && profileQrEnabled ? (
            <form action={updatePublicProfileQrAction} className="account-form">
              <button
                type="submit"
                className="account-button account-button--secondary"
              >
                Disable Selection QR
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  );
}
