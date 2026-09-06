import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { listPublishedCountries } from "@/lib/csv-catalog";
import { parseCatalogScope } from "@/lib/i18n/catalog-scope";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = SITE_METADATA;
export const viewport: Viewport = SITE_VIEWPORT;

type CatalogRootLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ catalog: string }>;
}>;

export default async function CatalogRootLayout({
  children,
  params,
}: CatalogRootLayoutProps) {
  const { catalog } = await params;
  const scope = parseCatalogScope(catalog, listPublishedCountries());

  // The root recognizes only publicly visible country scopes. Descendants still
  // enforce locale publication at their own depth; invalid or standby scopes use
  // a deterministic Spanish fallback before the page returns 404.
  const locale = scope?.locale ?? "es";
  const htmlLang = scope?.htmlLang ?? "es";
  const messages = await loadMessages(locale);

  return (
    <SiteRootShell
      htmlLang={htmlLang}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
      languageMenu={{
        currentLocale: locale,
        label: messages.languageSwitcher.label,
        options: [{ locale, label: messages.languageName, href: scope?.pathPrefix ?? "/" }],
      }}
    >
      {children}
    </SiteRootShell>
  );
}
