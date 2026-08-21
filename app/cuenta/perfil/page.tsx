import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { updateAccountProfileAction } from "@/app/cuenta/actions";
import {
  AccountMessage,
  type AccountMessageParams,
} from "@/components/account/account-message";
import { requireCurrentAccount } from "@/lib/accounts/auth";

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
              This information belongs to your KM0 account. Sign-in email, password and
              authentication factors are managed securely through Clerk.
            </p>
          </div>
        </header>
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
          <fieldset className="account-choice-grid">
            <legend>Profile type</legend>
            <label className="account-choice-card">
              <input
                type="radio"
                name="profileKind"
                value="user"
                defaultChecked={account.profileKind === "user"}
              />
              <strong>User</strong>
              <span>Save producers now and create custom maps in the future.</span>
            </label>
            <label className="account-choice-card">
              <input
                type="radio"
                name="profileKind"
                value="producer"
                defaultChecked={account.profileKind === "producer"}
              />
              <strong>Producer</strong>
              <span>Claim productive units and propose reviewed catalog updates.</span>
            </label>
          </fieldset>
          <button type="submit" className="account-button">
            Save profile
          </button>
        </form>
      </section>
    </div>
  );
}
