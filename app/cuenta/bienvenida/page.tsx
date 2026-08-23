import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { completeOnboardingAction } from "@/app/cuenta/actions";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Set up your account",
  robots: { index: false, follow: false },
};

type OnboardingPageProps = {
  searchParams: Promise<AccountMessageParams>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [account, params] = await Promise.all([
    requireCurrentAccount("/cuenta/bienvenida"),
    searchParams,
  ]);
  if (account.termsAcceptedAt) redirect("/cuenta");

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <section>
        <h2>Set up your {SITE_NAME} account</h2>
        <p>
          Every account starts with a user profile. If you submit a producer ownership claim,
          your profile becomes a producer profile automatically.
        </p>
        <form action={completeOnboardingAction} className="account-form">
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
          <div className="account-callout">
            <strong>Profile type: User</strong>
            <p>Profile type follows your account activity and is not a selectable setting.</p>
          </div>
          <label className="account-check">
            <input type="checkbox" name="acknowledgeReview" value="yes" required />
            <span>
              I understand that producer claims and profile changes are reviewed, and that
              submitted information must be accurate and authorized for publication.
            </span>
          </label>
          <button type="submit" className="account-button">
            Create my profile
          </button>
        </form>
      </section>
    </div>
  );
}
