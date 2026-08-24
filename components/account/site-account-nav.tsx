"use client";

import { Show, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import type { Messages } from "@/lib/i18n/messages";

type SiteAccountNavProps = {
  authConfigured: boolean;
  messages: Messages["siteHeader"];
};

function SignedOutAccountLinks({
  messages,
}: {
  messages: Messages["siteHeader"];
}) {
  return (
    <>
      <Link href={ACCOUNT_ROUTES.signIn}>{messages.signIn}</Link>
      <Link href={ACCOUNT_ROUTES.signUp}>{messages.register}</Link>
    </>
  );
}

export function SiteAccountNav({ authConfigured, messages }: SiteAccountNavProps) {
  if (!authConfigured) return null;

  return (
    <nav aria-label={messages.accountNavigation}>
      <Show when="signed-in" fallback={<SignedOutAccountLinks messages={messages} />}>
        <Link href={ACCOUNT_ROUTES.dashboard}>{messages.myAccount}</Link>
        <SignOutButton>
          <button type="button">{messages.signOut}</button>
        </SignOutButton>
      </Show>
    </nav>
  );
}

export default SiteAccountNav;
