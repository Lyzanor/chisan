import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${SITE_NAME} account.`,
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  if (!isAccountAuthConfigured()) {
    return (
      <main className="auth-page">
        <section className="auth-shell" aria-labelledby="account-auth-unavailable-title">
          <div className="auth-copy">
          <h1 id="account-auth-unavailable-title">Sign-in is not configured</h1>
          <p>
            Account access is not enabled in this environment. The producer catalog remains
            available without signing in.
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
          <p className="catalog-kicker">{SITE_NAME} account</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage favorites, ownership claims and producer profile changes.</p>
        </div>
        <div className="auth-widget">
          <SignIn
            routing="path"
            path={ACCOUNT_ROUTES.signIn}
            signUpUrl={ACCOUNT_ROUTES.signUp}
            fallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
          />
        </div>
      </section>
    </main>
  );
}
