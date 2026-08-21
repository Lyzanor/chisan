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
      label: "Favorite producers",
      value: favoriteCount.value,
      copy: "Keep a durable list even when a producer's public URL changes.",
    },
    {
      href: "/cuenta/reclamaciones",
      label: "Managed producers",
      value: membershipCount.value,
      copy: `${claimCount.value} claim${claimCount.value === 1 ? "" : "s"} awaiting review.`,
    },
    {
      href: "/cuenta/cambios",
      label: "Open profile changes",
      value: changeCount.value,
      copy: "Producer changes are reviewed before they reach the canonical CSV.",
    },
  ];

  return (
    <div className="account-content">
      <AccountMessage params={params} />
      <section aria-labelledby="account-overview-title">
        <h2 id="account-overview-title">Overview</h2>
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
          <h2>Claim your producer profile</h2>
          <p>
            Open the producer’s public page and choose “Claim this producer”. Ownership is
            checked manually before editing access is granted.
          </p>
          <Link href="/" className="account-button">
            Find my producer
          </Link>
        </section>
      ) : null}
    </div>
  );
}
