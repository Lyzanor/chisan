import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { listCountries } from "@/lib/csv-catalog";
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
  const scope = parseCatalogScope(catalog, listCountries());

  // Publication remains a page-level decision: the root only recognizes the
  // URL scope. Invalid scopes use a deterministic English fallback while a
  // descendant rejects them; no request preference can change a catalog URL.
  const locale = scope?.locale ?? "en";
  const htmlLang = scope?.htmlLang ?? "en";
  const messages = await loadMessages(locale);

  return (
    <SiteRootShell
      htmlLang={htmlLang}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
    >
      {children}
    </SiteRootShell>
  );
}
