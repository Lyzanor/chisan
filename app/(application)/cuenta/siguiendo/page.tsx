import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import {
  setFavoritePublicVisibilityAction,
  toggleFavoriteAction,
} from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { formatProducerFieldValue } from "@/lib/i18n/producer-fields";

type FollowingPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function FollowingPage({
  searchParams,
}: FollowingPageProps) {
  const account = await requireCurrentAccount("/cuenta/siguiendo");
  const publicProfileVisible =
    Boolean(account.publicHandle) &&
    account.publicProfileVisibility !== "private";
  const database = getDatabase();
  const [saved, params, presentation] = await Promise.all([
    database
      .select()
      .from(favorites)
      .where(eq(favorites.userId, account.id))
      .orderBy(desc(favorites.createdAt)),
    searchParams,
    loadApplicationPresentation(),
  ]);
  const producers = await findProducersByIds(
    saved.map(({ country, producerId }) => ({ country, producerId })),
  );

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Productores que sigues</h2>
          <p>
            Lee sus novedades en tu timeline. Seguir es privado; tú decides
            cuáles forman parte de tu selección pública.
          </p>
        </div>
        <div className="account-inline-actions">
          <Link href="/cuenta/novedades" className="account-button">
            Ver novedades
          </Link>
          <Link
            href="/cuenta/seleccion"
            className="account-button account-button--secondary"
          >
            Vista previa de la selección y el QR
          </Link>
          {publicProfileVisible && account.publicHandle ? (
            <Link
              href={`/u/${account.publicHandle}`}
              className="account-button account-button--secondary"
            >
              Abrir selección pública
            </Link>
          ) : (
            <Link
              href="/cuenta/perfil"
              className="account-button account-button--secondary"
            >
              Configurar selección
            </Link>
          )}
          <Link href="/" className="account-button account-button--secondary">
            Explorar el catálogo
          </Link>
        </div>
      </header>

      <p>
        Al dejar de seguir a un productor, también lo retiras de tu selección
        pública.
      </p>
      {saved.length === 0 ? (
        <p className="account-empty">Todavía no sigues a ningún productor.</p>
      ) : (
        <ul className="account-record-list">
          {saved.map((favorite, index) => {
            const producer = producers[index];
            return (
              <li key={`${favorite.country}:${favorite.producerId}`}>
                <div>
                  <strong>
                    {producer?.name ?? "Productor ya no publicado"}
                  </strong>
                  <p>
                    {producer
                      ? `${producer.city} · ${formatProducerFieldValue(
                          "categorias adicionales",
                          producer.categories.join("|"),
                          presentation.locale,
                          presentation.messages,
                        )}`
                      : `${favorite.country.toUpperCase()} · productor ${favorite.producerId}`}
                  </p>
                </div>
                <div className="account-inline-actions">
                  <span
                    className={`account-status ${
                      favorite.showOnPublicProfile && publicProfileVisible
                        ? "account-status--approved"
                        : "account-status--pending"
                    }`}
                  >
                    {favorite.showOnPublicProfile
                      ? publicProfileVisible
                        ? "Visible públicamente"
                        : "Seleccionado; página privada"
                      : "Privado"}
                  </span>
                  {producer ? (
                    <Link
                      href={buildAccountProducerHref(
                        producer,
                        presentation.explicitLocale,
                      )}
                      className="account-button account-button--secondary"
                    >
                      Abrir perfil
                    </Link>
                  ) : null}
                  <form action={setFavoritePublicVisibilityAction}>
                    <input
                      type="hidden"
                      name="country"
                      value={favorite.country}
                    />
                    <input
                      type="hidden"
                      name="producerId"
                      value={favorite.producerId}
                    />
                    <input
                      type="hidden"
                      name="returnTo"
                      value="/cuenta/siguiendo"
                    />
                    <input
                      type="hidden"
                      name="show"
                      value={favorite.showOnPublicProfile ? "no" : "yes"}
                    />
                    <button
                      type="submit"
                      className="account-button account-button--secondary"
                    >
                      {favorite.showOnPublicProfile
                        ? "Quitar de la selección"
                        : "Añadir a la selección"}
                    </button>
                  </form>
                  <form action={toggleFavoriteAction}>
                    <input type="hidden" name="following" value="no" />
                    <input
                      type="hidden"
                      name="country"
                      value={favorite.country}
                    />
                    <input
                      type="hidden"
                      name="producerId"
                      value={favorite.producerId}
                    />
                    <input
                      type="hidden"
                      name="returnTo"
                      value="/cuenta/siguiendo"
                    />
                    <button
                      type="submit"
                      className="account-button account-button--danger"
                    >
                      Dejar de seguir
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
