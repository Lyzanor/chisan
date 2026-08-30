"use client";

import {
  type LanguageMenuOption,
  useRegisterLanguageMenu,
} from "@/components/language-menu-context";
import type { Locale } from "@/lib/i18n/locales";

export type LanguageMenuRegistrationOption = LanguageMenuOption;

type LanguageMenuRegistrationProps = {
  currentLocale: Locale;
  label: string;
  options: LanguageMenuRegistrationOption[];
};

export function LanguageMenuRegistration({
  currentLocale,
  label,
  options,
}: LanguageMenuRegistrationProps) {
  useRegisterLanguageMenu({ currentLocale, label, options });
  return null;
}
