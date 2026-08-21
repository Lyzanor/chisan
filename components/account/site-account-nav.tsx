"use client";

import { Show, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

import { ACCOUNT_ROUTES } from "@/lib/accounts/config";

type SiteAccountNavProps = {
  authConfigured: boolean;
};

function SignedOutAccountLinks() {
  return (
    <>
      <Link href={ACCOUNT_ROUTES.signIn}>Sign in</Link>
      <Link href={ACCOUNT_ROUTES.signUp}>Register</Link>
    </>
  );
}

export function SiteAccountNav({ authConfigured }: SiteAccountNavProps) {
  if (!authConfigured) return null;

  return (
    <nav aria-label="Account">
      <Show when="signed-in" fallback={<SignedOutAccountLinks />}>
        <Link href={ACCOUNT_ROUTES.dashboard}>My account</Link>
        <SignOutButton>
          <button type="button">Sign out</button>
        </SignOutButton>
      </Show>
    </nav>
  );
}

export default SiteAccountNav;
