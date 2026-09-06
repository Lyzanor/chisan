import { and, count, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import {
  favorites,
  producerChangeRequests,
  producerClaims,
  producerMemberships,
} from "@/lib/db/schema";

type AccountPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const account = await requireCurrentAccount("/cuenta");
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const database = getDatabase();
  const [[favoriteCount], [membershipCount], [claimCount], [changeCount], params] =
    await Promise.all([
      database
        .select({ value: count() })
        .from(favorites)
        .where(eq(favorites.userId, account.id)),
      database
        .select({ value: count() })
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, account.id),
            eq(producerMemberships.status, "active"),
          ),
        ),
      database
        .select({ value: count() })
        .from(producerClaims)
        .where(
          and(
            eq(producerClaims.claimantUserId, account.id),
            inArray(producerClaims.status, ["pending", "needs_info"]),
          ),
        ),
      database
        .select({ value: count() })
        .from(producerChangeRequests)
        .where(
          and(
            eq(producerChangeRequests.authorUserId, account.id),
            inArray(producerChangeRequests.status, [
              "draft",
              "submitted",
              "needs_changes",
              "approved",
              "applying",
            ]),
          ),
        ),
      searchParams,
    ]);

  const cards = [
    {
      href: "/cuenta/favoritos",
      label: "Productores favoritos",
      value: favoriteCount.value,
      copy: "Conserva tus favoritos aunque cambie la dirección del perfil de un productor.",
    },
    {
      href: "/cuenta/reclamaciones",
      label: "Productores que gestionas",
      value: membershipCount.value,
      copy: `${claimCount.value} ${claimCount.value === 1 ? "solicitud pendiente" : "solicitudes pendientes"} de revisión.`,
    },
    {
      href: "/cuenta/cambios",
      label: "Cambios de perfil pendientes",
      value: changeCount.value,
      copy: "Los cambios de los productores se revisan antes de publicarse en el catálogo.",
    },
  ];

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <section aria-labelledby="account-overview-title">
        <h2 id="account-overview-title">Resumen</h2>
        <div className="account-stat-grid">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="account-stat-card">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
              <small>{card.copy}</small>
            </Link>
          ))}
        </div>
      </section>
      {account.profileKind === "producer" && membershipCount.value === 0 ? (
        <section className="account-callout">
          <h2>Reclama el perfil de tu productor</h2>
          <p>
            Abre el perfil público del productor y elige «Reclamar este productor». La titularidad se comprueba manualmente antes de conceder acceso de edición.
          </p>
          <Link href="/" className="account-button">
            Buscar mi productor
          </Link>
        </section>
      ) : null}
    </div>
  );
}
