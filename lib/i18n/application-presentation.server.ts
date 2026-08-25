import "server-only";

import { cookies } from "next/headers";

import {
  EXPLICIT_LOCALE_COOKIE,
  parseExplicitLocale,
} from "@/lib/i18n/catalog-scope";
import { APPLICATION_DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { loadMessages } from "@/lib/i18n/messages";

export async function readApplicationLocalePreference() {
  const cookieStore = await cookies();
  return parseExplicitLocale(cookieStore.get(EXPLICIT_LOCALE_COOKIE)?.value);
}

export async function loadApplicationPresentation() {
  const explicitLocale = await readApplicationLocalePreference();
  const locale = explicitLocale ?? APPLICATION_DEFAULT_LOCALE;
  const messages = await loadMessages(locale);

  return { explicitLocale, locale, messages };
}
