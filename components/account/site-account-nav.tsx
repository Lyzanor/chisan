"use client";

import { Show, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSiteCatalogControls } from "@/components/account/site-catalog-controls-context";
import { AreaSelector } from "@/components/area-selector";
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
  showAccountLinks: boolean;
  signedIn: boolean;
};

function formatGreeting(template: string, displayName: string) {
  return template.replace("{name}", displayName);
}

export function AccountMenu({
  messages,
  showAccountLinks,
  signedIn,
}: AccountMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const catalogControls = useSiteCatalogControls();
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

  function closeMenu() {
    detailsRef.current?.removeAttribute("open");
  }

  return (
    <details className="site-account-menu" ref={detailsRef}>
      <summary>{summary}</summary>
      <div
        className="site-account-menu__panel"
        onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            closeMenu();
          }
        }}
      >
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

        {catalogControls ? (
          <section className="site-account-menu__catalog">
            <AreaSelector
              country={catalogControls.country}
              currentArea={catalogControls.currentArea}
              messages={catalogControls.messages}
              onNavigate={closeMenu}
            />
          </section>
        ) : null}

        {showAccountLinks ? (
          <div className="site-account-menu__links">
            {signedIn ? (
              <>
                <Link href={ACCOUNT_ROUTES.dashboard}>{messages.myAccount}</Link>
                <Link href={ACCOUNT_ROUTES.favorites}>{messages.favorites}</Link>
                <SignOutButton>
                  <button type="button" onClick={closeMenu}>
                    {messages.signOut}
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href={ACCOUNT_ROUTES.signIn}>{messages.signIn}</Link>
                <Link href={ACCOUNT_ROUTES.signUp}>{messages.register}</Link>
              </>
            )}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function SiteAccountNav({
  authConfigured,
  messages,
}: SiteAccountNavProps) {
  const catalogControls = useSiteCatalogControls();

  if (!authConfigured && !catalogControls) return null;

  return (
    <nav className="site-account-nav" aria-label={messages.accountNavigation}>
      {authConfigured ? (
        <Show
          when="signed-in"
          fallback={
            <AccountMenu messages={messages} showAccountLinks signedIn={false} />
          }
        >
          <AccountMenu messages={messages} showAccountLinks signedIn />
        </Show>
      ) : (
        <AccountMenu
          messages={messages}
          showAccountLinks={false}
          signedIn={false}
        />
      )}
    </nav>
  );
}

export default SiteAccountNav;
