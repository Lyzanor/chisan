"use client";

import Link from "next/link";

import {
  type LanguageMenuOption,
  useRegisterLanguageMenu,
} from "@/components/language-menu-context";
import { rememberExplicitLocale } from "@/lib/i18n/client-locale";
import {
  CATALOG_HREFLANG_BY_LOCALE,
  type Locale,
} from "@/lib/i18n/locales";

export type LanguageSwitcherOption = LanguageMenuOption;

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
  options: LanguageSwitcherOption[];
};

function LanguageMenuRegistration({
  currentLocale,
  label,
  options,
}: LanguageSwitcherProps) {
  useRegisterLanguageMenu({ currentLocale, label, options });
  return null;
}

export function LanguageSwitcher({ currentLocale, label, options }: LanguageSwitcherProps) {
  if (options.length <= 1) return null;

  return (
    <>
      <LanguageMenuRegistration
        currentLocale={currentLocale}
        label={label}
        options={options}
      />
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
    </>
  );
}
