"use client";

import Link from "next/link";

import { EXPLICIT_LOCALE_COOKIE } from "@/lib/i18n/catalog-scope";
import {
  CATALOG_HREFLANG_BY_LOCALE,
  type Locale,
} from "@/lib/i18n/locales";

export type LanguageSwitcherOption = {
  locale: Locale;
  label: string;
  href: string;
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
  options: LanguageSwitcherOption[];
};

const LOCALE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function rememberExplicitLocale(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${EXPLICIT_LOCALE_COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function LanguageSwitcher({ currentLocale, label, options }: LanguageSwitcherProps) {
  if (options.length <= 1) return null;

  return (
    <nav className="language-switcher" aria-label={label}>
      <span className="language-switcher__label">{label}</span>
      <ul className="language-switcher__options">
        {options.map((option) => (
          <li key={option.locale}>
            <Link
              href={option.href}
              hrefLang={CATALOG_HREFLANG_BY_LOCALE[option.locale]}
              lang={option.locale}
              aria-current={option.locale === currentLocale ? "page" : undefined}
              onClick={() => rememberExplicitLocale(option.locale)}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
