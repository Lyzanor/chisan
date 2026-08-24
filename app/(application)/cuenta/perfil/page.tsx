import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { updateAccountProfileAction } from "@/app/(application)/cuenta/actions";
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
    </div>
  );
}
