import { desc, eq } from "drizzle-orm";
import Link from "next/link";

import { toggleFavoriteAction } from "@/app/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { buildProducerHref } from "@/lib/catalog-navigation";
import { findProducersByIds } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { favorites } from "@/lib/db/schema";

type FavoritesPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const account = await requireCurrentAccount("/cuenta/favoritos");
  const database = getDatabase();
  const [saved, params] = await Promise.all([
    database
      .select()
      .from(favorites)
      .where(eq(favorites.userId, account.id))
      .orderBy(desc(favorites.createdAt)),
    searchParams,
  ]);
  const producers = await findProducersByIds(
    saved.map(({ country, producerId }) => ({ country, producerId })),
  );

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <h2>Favorite producers</h2>
          <p>Favorites use each producer’s immutable catalog identity.</p>
        </div>
        <Link href="/" className="account-button account-button--secondary">
          Explore the catalog
        </Link>
      </header>

      {saved.length === 0 ? (
        <p className="account-empty">You have not saved any producers yet.</p>
      ) : (
        <ul className="account-record-list">
          {saved.map((favorite, index) => {
            const producer = producers[index];
            return (
              <li key={`${favorite.country}:${favorite.producerId}`}>
                <div>
                  <strong>{producer?.name ?? "Producer no longer published"}</strong>
                  <p>
                    {producer
                      ? `${producer.city} · ${producer.categories.join(" · ")}`
                      : `${favorite.country.toUpperCase()} · producer ${favorite.producerId}`}
                  </p>
                </div>
                <div className="account-inline-actions">
                  {producer ? (
                    <Link
                      href={buildProducerHref(producer, {
                        country: producer.country,
                        area: producer.area,
                      })}
                      className="account-button account-button--secondary"
                    >
                      Open profile
                    </Link>
                  ) : null}
                  <form action={toggleFavoriteAction}>
                    <input type="hidden" name="country" value={favorite.country} />
                    <input type="hidden" name="producerId" value={favorite.producerId} />
                    <input type="hidden" name="returnTo" value="/cuenta/favoritos" />
                    <button type="submit" className="account-button account-button--danger">
                      Remove
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
