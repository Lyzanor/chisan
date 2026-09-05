import type { ReactNode } from "react";
import {
  SITE_METADATA,
  SITE_VIEWPORT,
  SiteRootShell,
} from "@/app/_components/site-root-shell";
import { loadMessages } from "@/lib/i18n/messages";

export const metadata = SITE_METADATA;
export const viewport = SITE_VIEWPORT;

export default async function GuidesRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = await loadMessages("es");
  return (
    <SiteRootShell
      htmlLang="es"
      headerMessages={messages.siteHeader}
      footerMessages={messages.siteFooter}
      languageMenu={{
        currentLocale: "es",
        label: messages.languageSwitcher.label,
        options: [
          { locale: "es", label: messages.languageName, href: "/guias" },
        ],
      }}
    >
      {children}
    </SiteRootShell>
  );
}
