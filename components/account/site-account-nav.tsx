"use client";

import { Show, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLanguageMenu } from "@/components/language-menu-context";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { rememberExplicitLocale } from "@/lib/i18n/client-locale";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

type SiteAccountNavProps = {
  authConfigured: boolean;
  messages: Messages["siteHeader"];
};

type AccountMenuProps = {
  messages: Messages["siteHeader"];
  signedIn: boolean;
};

function formatGreeting(template: string, displayName: string) {
  return template.replace("{name}", displayName);
}

export function AccountMenu({
  messages,
  signedIn,
}: AccountMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const languageMenu = useLanguageMenu();
  const [accountDisplayName, setAccountDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn) return;

    const controller = new AbortController();
    void fetch("/api/account/me", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((account: { displayName?: string | null } | null) => {
        if (account?.displayName) setAccountDisplayName(account.displayName);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [signedIn]);

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      if (!detailsRef.current?.contains(event.target as Node)) {
        detailsRef.current?.removeAttribute("open");
      }
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        detailsRef.current?.removeAttribute("open");
        detailsRef.current?.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  const summary =
    signedIn && accountDisplayName
      ? formatGreeting(messages.greeting, accountDisplayName)
      : messages.myAccount;

  function chooseLanguage(locale: Locale) {
    const destination = languageMenu.options.find(
      (option) => option.locale === locale,
    );
    if (!destination) return;

    rememberExplicitLocale(locale);
    detailsRef.current?.removeAttribute("open");

    if (destination.href && destination.href !== pathname) {
      router.push(destination.href);
      return;
    }

    router.refresh();
  }

  return (
    <details className="site-account-menu" ref={detailsRef}>
      <summary>{summary}</summary>
      <div className="site-account-menu__panel">
        <label className="site-account-menu__language">
          <span>{languageMenu.label}</span>
          <select
            value={languageMenu.currentLocale}
            onChange={(event) => chooseLanguage(event.target.value as Locale)}
          >
            {languageMenu.options.map((option) => (
              <option key={option.locale} value={option.locale} lang={option.locale}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="site-account-menu__links">
          {signedIn ? (
            <>
              <Link href={ACCOUNT_ROUTES.dashboard}>{messages.myAccount}</Link>
              <Link href={ACCOUNT_ROUTES.favorites}>{messages.favorites}</Link>
              <SignOutButton>
                <button type="button">{messages.signOut}</button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link href={ACCOUNT_ROUTES.signIn}>{messages.signIn}</Link>
              <Link href={ACCOUNT_ROUTES.signUp}>{messages.register}</Link>
            </>
          )}
        </div>
      </div>
    </details>
  );
}

export function SiteAccountNav({
  authConfigured,
  messages,
}: SiteAccountNavProps) {
  if (!authConfigured) return null;

  return (
    <nav className="site-account-nav" aria-label={messages.accountNavigation}>
      <Show
        when="signed-in"
        fallback={<AccountMenu messages={messages} signedIn={false} />}
      >
        <AccountMenu messages={messages} signedIn />
      </Show>
    </nav>
  );
}

export default SiteAccountNav;
