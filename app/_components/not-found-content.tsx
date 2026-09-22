import Link from "next/link";

import { ChisanMascot } from "@/components/brand/chisan-brand";
import type { Messages } from "@/lib/i18n/messages";

export function NotFoundContent({
  backHref,
  messages,
}: {
  backHref: string;
  messages: Messages;
}) {
  return (
    <main className="page-shell">
      <section className="panel not-found-panel">
        <ChisanMascot state="404" size={96} alt="" className="not-found-panel__mascot" />
        <h1>{messages.notFound.title}</h1>
        <p>{messages.notFound.description}</p>
        <p>{messages.home.aboutDescription}</p>
        <p>{messages.home.aboutCatalogDescription}</p>
        <Link href={backHref} className="back-link">
          ← {messages.notFound.backToCatalog}
        </Link>
        <nav aria-label={messages.siteFooter.navigation}>
          <Link href="/how-we-work" className="back-link">
            {messages.siteFooter.aboutLink}
          </Link>{" "}
          <Link href="/contact" className="back-link">
            {messages.siteFooter.contactLink}
          </Link>{" "}
          <a href="/sitemap/0.xml" className="back-link">
            Mapa del sitio
          </a>
        </nav>
      </section>
    </main>
  );
}
