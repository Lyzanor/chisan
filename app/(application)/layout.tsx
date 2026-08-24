import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = SITE_METADATA;
export const viewport: Viewport = SITE_VIEWPORT;

export default async function ApplicationRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const messages = await loadMessages("en");

  return (
    <SiteRootShell
      htmlLang="en"
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
    >
      {children}
    </SiteRootShell>
  );
}
