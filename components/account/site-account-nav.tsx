"use client";

import { useAuth } from "@clerk/nextjs";
import { UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLanguageMenu } from "@/components/language-menu-context";
import { useMapHref } from "@/components/navigation/map-destination";
import { ACCOUNT_ROUTES } from "@/lib/accounts/config";
import { rememberExplicitLocale } from "@/lib/i18n/client-locale";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

type SiteAccountNavProps = {
  authConfigured: boolean;
  messages: Messages["siteHeader"];
};

type AccountNavViewProps = {
  isSignedIn: boolean;
  messages: Messages["siteHeader"];
};

function AccountNavView({ isSignedIn, messages }: AccountNavViewProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const languageMenu = useLanguageMenu();
  const [accountDisplayName, setAccountDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

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
  }, [isSignedIn]);

  const isActividadActive = pathname.startsWith("/actividad");
  const mapHref = useMapHref(pathname);
  const isAccountActive =
    pathname.startsWith("/cuenta") ||
    pathname.startsWith("/acceso") ||
    pathname.startsWith("/registro");

  function chooseLanguage(locale: Locale) {
    const destination = languageMenu.options.find(
      (option) => option.locale === locale,
    );
    if (!destination) return;

    rememberExplicitLocale(locale);
    if (destination.href && destination.href !== pathname) {
      router.push(destination.href);
      return;
    }
    router.refresh();
  }

  const accountHref = isSignedIn ? ACCOUNT_ROUTES.dashboard : ACCOUNT_ROUTES.signIn;
  const accountLabel =
    isSignedIn && accountDisplayName ? accountDisplayName : messages.myAccount;

  return (
    <nav className="site-account-nav" aria-label={messages.accountNavigation}>
      {/* Discovery and the map trade places, so the link always leads elsewhere. */}
      {isActividadActive ? (
        <Link href={mapHref} className="site-account-nav__link">
          Mapa
        </Link>
      ) : (
        <Link href="/actividad" className="site-account-nav__link">
          Descubrir
        </Link>
      )}

      <Link
        href={accountHref}
        className={`site-account-nav__link site-account-nav__link--account ${isAccountActive ? "is-active" : ""}`}
        aria-current={isAccountActive ? "page" : undefined}
      >
        <UserCircleIcon size={20} aria-hidden="true" />
        <span>{accountLabel}</span>
      </Link>

      {languageMenu.options.length > 1 ? (
        <label className="site-account-nav__language">
          <span className="visually-hidden">{languageMenu.label}</span>
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
      ) : null}
    </nav>
  );
}

function AuthenticatedSiteAccountNav({ messages }: { messages: Messages["siteHeader"] }) {
  const { isSignedIn } = useAuth();
  return <AccountNavView isSignedIn={isSignedIn === true} messages={messages} />;
}

export function SiteAccountNav({
  authConfigured,
  messages,
}: SiteAccountNavProps) {
  if (authConfigured) {
    return <AuthenticatedSiteAccountNav messages={messages} />;
  }
  return <AccountNavView isSignedIn={false} messages={messages} />;
}

export default SiteAccountNav;
