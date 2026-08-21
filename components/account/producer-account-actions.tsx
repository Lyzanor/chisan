import { and, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { toggleFavoriteAction } from "@/app/cuenta/actions";
import { getCurrentAccount } from "@/lib/accounts/auth";
import { ACCOUNT_ROUTES, isAccountSystemConfigured } from "@/lib/accounts/config";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { getDatabase } from "@/lib/db";
import { favorites, producerClaims, producerMemberships } from "@/lib/db/schema";

type ProducerAccountActionsProps = {
  country: string;
  producerId: number;
  returnTo: string;
};

export async function ProducerAccountActions({
  country,
  producerId,
  returnTo,
}: ProducerAccountActionsProps) {
  if (!isAccountSystemConfigured()) return null;

  try {
    return await renderProducerAccountActions({ country, producerId, returnTo });
  } catch (error) {
    // Account storage is deliberately optional for the public CSV catalog.
    // A provider or database incident must not make a producer page unavailable.
    console.error("Producer account actions are temporarily unavailable.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
}

async function renderProducerAccountActions({
  country,
  producerId,
  returnTo,
}: ProducerAccountActionsProps) {
  const safeReturnTo = safeReturnPath(returnTo, "/");
  const account = await getCurrentAccount();

  if (!account) {
    const redirectQuery = encodeURIComponent(safeReturnTo);
    return (
      <div className="producer-account-actions">
        <span>Save this producer or claim ownership.</span>
        <Link href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${redirectQuery}`}>Sign in</Link>
        <Link href={`${ACCOUNT_ROUTES.signUp}?redirect_url=${redirectQuery}`}>Create account</Link>
      </div>
    );
  }

  const database = getDatabase();
  const [[favorite], [membership], [claim]] = await Promise.all([
    database
      .select({ userId: favorites.userId })
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, account.id),
          eq(favorites.country, country),
          eq(favorites.producerId, producerId),
        ),
      )
      .limit(1),
    database
      .select({ id: producerMemberships.id })
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, account.id),
          eq(producerMemberships.country, country),
          eq(producerMemberships.producerId, producerId),
          eq(producerMemberships.status, "active"),
        ),
      )
      .limit(1),
    database
      .select({ id: producerClaims.id })
      .from(producerClaims)
      .where(
        and(
          eq(producerClaims.claimantUserId, account.id),
          eq(producerClaims.country, country),
          eq(producerClaims.producerId, producerId),
          inArray(producerClaims.status, ["draft", "pending", "needs_info", "approved"]),
        ),
      )
      .limit(1),
  ]);

  return (
    <div className="producer-account-actions">
      <form action={toggleFavoriteAction}>
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <input type="hidden" name="returnTo" value={safeReturnTo} />
        <button type="submit">{favorite ? "Remove favorite" : "Save favorite"}</button>
      </form>
      {membership ? (
        <Link href={`/cuenta/productores/${country}/${producerId}/editar`}>Edit my profile</Link>
      ) : claim ? (
        <Link href="/cuenta/reclamaciones">View ownership claim</Link>
      ) : (
        <Link
          href={`/cuenta/reclamaciones/nueva?country=${encodeURIComponent(country)}&producerId=${producerId}`}
        >
          Claim this producer
        </Link>
      )}
    </div>
  );
}
