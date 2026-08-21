import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a KM0 user or producer profile.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  if (!isAccountAuthConfigured()) {
    return (
      <main className="auth-page">
        <section className="auth-shell" aria-labelledby="account-auth-unavailable-title">
          <div className="auth-copy">
          <h1 id="account-auth-unavailable-title">Registration is not configured</h1>
          <p>
            Account registration is not enabled in this environment. The producer catalog
            remains available without an account.
          </p>
          <Link href="/" className="account-button account-button--secondary">Back to the catalog</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="catalog-kicker">Join KM0</p>
          <h1>One account, two clear profiles</h1>
          <p>Choose how you use KM0 after creating your secure sign-in.</p>
          <div className="auth-profile-list">
            <article>
              <strong>User</strong>
              <span>Save favorite producers; personal maps can be added later as an entitlement.</span>
            </article>
            <article>
              <strong>Producer</strong>
              <span>Claim productive units and propose reviewed updates to their catalog profiles.</span>
            </article>
          </div>
        </div>
        <div className="auth-widget">
          <SignUp
            routing="path"
            path={ACCOUNT_ROUTES.signUp}
            signInUrl={ACCOUNT_ROUTES.signIn}
            fallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
          />
        </div>
      </section>
    </main>
  );
}
