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
import { AvatarEditor } from "@/components/account/avatar-editor";
import { updateFavoritesAttributionAction } from "@/app/(application)/cuenta/actions/profile";
import { getUserPresentation } from "@/lib/accounts/user-presentation";
import { getDatabase } from "@/lib/db";
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

const ACCOUNT_LOCALE = "es" as const;

export const metadata: Metadata = {
  title: "Perfil de cuenta",
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
  const profilePresentation = await getUserPresentation(getDatabase(), account.id);

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
            <h2 id="account-profile-title">Perfil</h2>
            <p>
              Esta información pertenece a tu cuenta de {SITE_NAME}. El correo de acceso, la contraseña y los factores de autenticación se gestionan de forma segura mediante Clerk.
            </p>
          </div>
        </header>
        <div className="account-callout">
          <strong>
            Tipo de perfil:{" "}
            {account.profileKind === "producer" ? "Productor" : "Usuario"}
          </strong>
          <p>
            Todas las cuentas comienzan como usuario. Al enviar una solicitud de propiedad, el tipo cambia automáticamente a productor; no se elige manualmente.
          </p>
        </div>
        <AvatarEditor name={account.displayName || "Usuario de Chisan"} initialUrl={profilePresentation.avatarUrl} />
        <form action={updateAccountProfileAction} className="account-form">
          <label className="account-field">
            <span>Nombre visible</span>
            <input
              type="text"
              name="displayName"
              maxLength={160}
              defaultValue={account.displayName ?? ""}
              autoComplete="name"
            />
          </label>
          <button type="submit" className="account-button">
            Guardar perfil
          </button>
        </form>
      </section>

      <section aria-labelledby="favorite-attribution-title">
        <header className="account-section-heading"><div>
          <h2 id="favorite-attribution-title">Aparecer en los favoritos de productores</h2>
          <p>Elige si otras personas pueden ver que has guardado un productor.</p>
        </div></header>
        <form action={updateFavoritesAttributionAction} className="account-form">
          <label className="account-check" style={{ minHeight: 44, alignItems: "center" }}>
            <input type="checkbox" name="enabled" value="yes" defaultChecked={profilePresentation.favoritesAttributionEnabled} />
            <span>Mostrar mi nombre y foto en «Guardado en favoritos por».</span>
          </label>
          <p>Se aplica a todos tus favoritos actuales y futuros, aunque no tengas un perfil público. Si tu perfil es público, añadimos un enlace a su mapa. Los perfiles privados y no listados no se enlazan.</p>
          <p>Puedes desactivarlo cuando quieras. Esta opción no añade productores a tu selección pública.</p>
          <button type="submit" className="account-button">Guardar visibilidad</button>
        </form>
      </section>

      <section aria-labelledby="saved-area-title">
        <header className="account-section-heading">
          <div>
            <h2 id="saved-area-title">Zona del catálogo guardada</h2>
            <p>
              {SITE_NAME} puede recordar una zona del catálogo en este navegador para abrirla directamente desde la portada. La preferencia solo se guarda en este navegador, nunca en tu cuenta, y la ubicación de tu dispositivo nunca se envía a {SITE_NAME}.
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
            <h2 id="public-profile-title">Selección pública de productores</h2>
            <p>
              Publica una página para compartir únicamente los favoritos que elijas expresamente. Añade un nombre y explica tu selección para tu tienda, evento o preferencias personales.
            </p>
          </div>
          {publicProfileVisible && account.publicHandle ? (
            <Link
              href={`/u/${account.publicHandle}`}
              className="account-button account-button--secondary"
            >
              Abrir selección pública
            </Link>
          ) : null}
        </header>
        <form action={updatePublicProfileAction} className="account-form">
          <label className="account-field">
            <span>Título de la selección (opcional)</span>
            <input
              name="selectionTitle"
              maxLength={160}
              defaultValue={account.selectionTitle ?? ""}
              placeholder="Productores de nuestro mercado de otoño"
            />
          </label>
          <label className="account-field">
            <span>Descripción de la selección (opcional)</span>
            <textarea
              name="selectionDescription"
              maxLength={600}
              rows={3}
              defaultValue={account.selectionDescription ?? ""}
            />
            <small>
              Explica tu elección. Este texto aparece públicamente junto a la selección.
            </small>
          </label>
          <label className="account-field">
            <span>Identificador público</span>
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
              Tu dirección permanente será /u/identificador. Utiliza letras minúsculas, números y guiones.
            </small>
          </label>
          <label className="account-field">
            <span>Zona de referencia</span>
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
                Elegir una zona
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
              La ubicación de tu perfil no añade, agrupa ni ordena los productores de tu selección.
            </small>
          </label>
          <label className="account-field">
            <span>Municipio de referencia</span>
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
              Utiliza un municipio de la zona elegida. Tu selección siempre muestra exactamente los productores que elijas.
            </small>
          </label>
          <label className="account-field">
            <span>Visibilidad</span>
            <select
              name="visibility"
              defaultValue={account.publicProfileVisibility}
            >
              <option value="private">Privado</option>
              <option value="unlisted">Sin listar: accesible mediante el enlace</option>
              <option value="public">Público: puede aparecer en buscadores</option>
            </select>
            <small>
              Los favoritos permanecen ocultos hasta que los actives individualmente desde la página de favoritos.
            </small>
          </label>
          <button type="submit" className="account-button">
            Guardar perfil público
          </button>
        </form>
        <div className="account-callout">
          <strong>QR de selección</strong>
          <p>
            Elige productores de tus favoritos, revisa el mapa completo y activa el QR desde la vista previa.
          </p>
          <Link href="/cuenta/seleccion" className="account-button">
            Vista previa de la selección y el QR
          </Link>
          {publicProfilePremiumEntitlement && profileQrEnabled ? (
            <form action={updatePublicProfileQrAction} className="account-form">
              <button
                type="submit"
                className="account-button account-button--secondary"
              >
                Desactivar QR de selección
              </button>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  );
}
