"use client";

import { EXPLICIT_LOCALE_COOKIE } from "@/lib/i18n/catalog-scope";
import type { Locale } from "@/lib/i18n/locales";

const LOCALE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export function rememberExplicitLocale(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${EXPLICIT_LOCALE_COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
