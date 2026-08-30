import type { Metadata } from "next";

import { NotFoundContent } from "@/app/_components/not-found-content";
import { SiteRootShell } from "@/app/_components/site-root-shell";
import { loadNotFoundPresentation } from "@/lib/not-found-presentation.server";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await loadNotFoundPresentation();
  return {
    title: messages.notFound.title,
    description: messages.notFound.description,
  };
}

export default async function GlobalNotFoundPage() {
  const { backHref, htmlLang, locale, messages } =
    await loadNotFoundPresentation();

  return (
    <SiteRootShell
      htmlLang={htmlLang}
      footerMessages={messages.siteFooter}
      headerMessages={messages.siteHeader}
      languageMenu={{
        currentLocale: locale,
        label: messages.languageSwitcher.label,
        options: [{ locale, label: messages.languageName, href: backHref }],
      }}
    >
      <NotFoundContent backHref={backHref} messages={messages} />
    </SiteRootShell>
  );
}
