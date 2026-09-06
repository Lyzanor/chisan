import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  ...SITE_METADATA,
  title: { default: "Operations | Chisan", template: "%s | Chisan" },
  description: "Internal catalog and account operations.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = SITE_VIEWPORT;

export default async function AdminRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = "en";
  const messages = await loadMessages(locale);

  return (
    <SiteRootShell
      htmlLang={locale}
      accountMessages={messages.siteHeader}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
      languageMenu={{
        currentLocale: locale,
        label: messages.languageSwitcher.label,
        options: [{ locale, label: messages.languageName, href: "" }],
      }}
    >
      {children}
    </SiteRootShell>
  );
}
