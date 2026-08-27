import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  updateAccountProfileAction,
  updatePublicProfileAction,
} from "@/app/(application)/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { SITE_NAME } from "@/lib/site";

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
  const [account, params] = await Promise.all([
    requireCurrentAccount("/cuenta/perfil"),
    searchParams,
  ]);
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <section aria-labelledby="account-profile-title">
        <header className="account-section-heading">
          <div>
            <h2 id="account-profile-title">Profile</h2>
            <p>
              This information belongs to your {SITE_NAME} account. Sign-in email, password and
              authentication factors are managed securely through Clerk.
            </p>
          </div>
        </header>
        <div className="account-callout">
          <strong>
            Profile type: {account.profileKind === "producer" ? "Producer" : "User"}
          </strong>
          <p>
            Every account starts as User. Submitting a producer ownership claim changes this
            automatically to Producer; profile type is not a selectable setting.
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

      <section aria-labelledby="public-profile-title">
        <header className="account-section-heading">
          <div>
            <h2 id="public-profile-title">Public producer map</h2>
            <p>
              Publish a shareable page containing only the favorites you explicitly choose.
              Producer facts and links continue to come from the current CSV catalog.
            </p>
          </div>
          {account.publicHandle && account.publicProfileVisibility !== "private" ? (
            <Link
              href={`/u/${account.publicHandle}`}
              className="account-button account-button--secondary"
            >
              Open public profile
            </Link>
          ) : null}
        </header>
        <form action={updatePublicProfileAction} className="account-form">
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
              Your permanent URL will be /u/handle. Use lowercase letters, numbers and hyphens.
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
              Favorites remain hidden until you enable them individually from your favorites page.
            </small>
          </label>
          <button type="submit" className="account-button">
            Save public profile
          </button>
        </form>
      </section>
    </div>
  );
}
