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
        <h2>How will you use {SITE_NAME}?</h2>
        <p>
          Both profiles can save favorites. Choosing producer starts the ownership-claim flow;
          it never grants access by itself.
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
          <fieldset className="account-choice-grid">
            <legend>Profile type</legend>
            <label className="account-choice-card">
              <input type="radio" name="profileKind" value="user" defaultChecked />
              <strong>User</strong>
              <span>Save favorite producers now and create custom maps in the future.</span>
            </label>
            <label className="account-choice-card">
              <input type="radio" name="profileKind" value="producer" />
              <strong>Producer</strong>
              <span>Claim one or more productive units and propose profile updates.</span>
            </label>
          </fieldset>
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
