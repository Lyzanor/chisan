import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { loadApplicationPresentation } from "@/lib/i18n/application-presentation.server";
import { LOCALE_NATIVE_NAMES, SUPPORTED_LOCALES } from "@/lib/i18n/locales";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = SITE_METADATA;
export const viewport: Viewport = SITE_VIEWPORT;

export default async function ApplicationRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [messages, presentation] = await Promise.all([
    loadMessages("en"),
    loadApplicationPresentation(),
  ]);

  return (
    <SiteRootShell
      htmlLang="en"
      accountMessages={presentation.messages.siteHeader}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
      languageMenu={{
        currentLocale: presentation.locale,
        label: presentation.messages.languageSwitcher.label,
        options: SUPPORTED_LOCALES.map((locale) => ({
          locale,
          label: LOCALE_NATIVE_NAMES[locale],
          href: "",
        })),
      }}
    >
      {children}
    </SiteRootShell>
  );
}
