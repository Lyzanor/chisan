import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { UserPlusIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import { toggleFavoriteAction } from "@/app/(application)/cuenta/actions";
import { ProducerFollowControl } from "@/components/account/producer-follow-control";
import { getCurrentAccount } from "@/lib/accounts/auth";
import {
  ACCOUNT_ROUTES,
  isAccountSystemConfigured,
} from "@/lib/accounts/config";
import { safeReturnPath } from "@/lib/accounts/producer-fields";
import { getDatabase } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import type { Messages } from "@/lib/i18n/messages";

type Props = {
  country: string;
  producerId: number;
  returnTo: string;
  messages: Messages;
};
export async function ProducerFollowButton(props: Props) {
  if (!isAccountSystemConfigured()) return null;
  try {
    return await renderFollowButton(props);
  } catch {
    return null;
  }
}
async function renderFollowButton({
  country,
  producerId,
  returnTo,
  messages,
}: Props) {
  const path = safeReturnPath(returnTo, "/");
  const account = await getCurrentAccount();
  if (!account)
    return (
      <ProducerFollowControl>
        <Link
          className="detail-follow"
          href={`${ACCOUNT_ROUTES.signIn}?redirect_url=${encodeURIComponent(path)}`}
        >
          <UserPlusIcon size={18} aria-hidden="true" />
          <span className="detail-follow__label">
            <span>{messages.accountActions.saveFavorite}</span>
          </span>
        </Link>
      </ProducerFollowControl>
    );
  const [following] = await getDatabase()
    .select({ id: favorites.userId })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, account.id),
        eq(favorites.country, country),
        eq(favorites.producerId, producerId),
      ),
    )
    .limit(1);
  return (
    <ProducerFollowControl>
      <form action={toggleFavoriteAction}>
        <input type="hidden" name="following" value={following ? "no" : "yes"} />
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="producerId" value={producerId} />
        <input type="hidden" name="returnTo" value={path} />
        <button
          className="detail-follow"
          type="submit"
          aria-pressed={Boolean(following)}
        >
          {following ? (
            <CheckIcon size={18} aria-hidden="true" />
          ) : (
            <UserPlusIcon size={18} aria-hidden="true" />
          )}
          <span className="detail-follow__label">
            <span>
              {following
                ? messages.siteHeader.favorites
                : messages.accountActions.saveFavorite}
            </span>
          </span>
        </button>
      </form>
    </ProducerFollowControl>
  );
}
