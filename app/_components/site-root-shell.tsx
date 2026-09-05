import "server-only";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { GuidesLink } from "@/components/guides/guides-link";
import { CompassIcon } from "@phosphor-icons/react/ssr";
import { NavigationLink } from "@/components/navigation-link";
import { PageMotion } from "@/components/page-motion";

import { SiteCatalogControlsProvider } from "@/components/account/site-catalog-controls-context";
import { SiteAccountNav } from "@/components/account/site-account-nav";
import { ChisanAnalytics } from "@/components/analytics/chisan-analytics";
import { CatalogAgentTools } from "@/components/agents/catalog-agent-tools";
import { catalogToolDefinitions } from "@/lib/agents/catalog-schema";
import { ChisanWordmark } from "@/components/brand/chisan-brand";
import {
  type LanguageMenuConfig,
  SiteLanguageMenuProvider,
} from "@/components/language-menu-context";
import chisanMark from "@/design/brand/assets/chisan-mark-ink.png";
import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import { MANUAL_AREA_SELECTION_HREF } from "@/lib/catalog-navigation";
import type { Messages } from "@/lib/i18n/messages";
import { getAdSenseAccountId } from "@/lib/programmatic-ads";
import {
  isPublicDiscoveryEnabled,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_URL,
  SITE_DESCRIPTION,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TAGLINE,
  SITE_X_URL,
} from "@/lib/site";

import "../globals.css";
import "../../design/foundations/tokens.css";
import "../../design/adapters/web.css";
import "../../design/adapters/experience.css";

const adsenseAccountId = getAdSenseAccountId();

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-chisan-sans",
});

export const SITE_VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#52614c",
};

export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [{ url: chisanMark.src, type: "image/png" }],
    apple: [{ url: chisanMark.src, type: "image/png" }],
  },
  referrer: "strict-origin-when-cross-origin",
  ...(adsenseAccountId
    ? {
        other: {
          "google-adsense-account": adsenseAccountId,
        },
      }
    : {}),
  robots: isPublicDiscoveryEnabled()
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
      },
  openGraph: {
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: chisanMark.src, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    site: "@chisanapp",
    creator: "@chisanapp",
  },
};

type SiteRootShellProps = Readonly<{
  accountMessages?: Messages["siteHeader"];
  children: ReactNode;
  footerMessages: Messages["siteFooter"];
  headerMessages: Messages["siteHeader"];
  htmlLang: string;
  languageMenu: LanguageMenuConfig;
}>;

export function SiteRootShell({
  accountMessages,
  children,
  footerMessages,
  headerMessages,
  htmlLang,
  languageMenu,
}: SiteRootShellProps) {
  const accountAuthConfigured = isAccountAuthConfigured();
  const localizedTagline = headerMessages.tagline;
  const content = (
    <SiteLanguageMenuProvider
      key={languageMenu.currentLocale}
      initialMenu={languageMenu}
    >
      <SiteCatalogControlsProvider>
        <header className="site-header">
          <Link
            href="/"
            className="site-header__brand"
            aria-label={`${SITE_NAME} — ${localizedTagline}`}
          >
            <ChisanWordmark alt="" />
            <span className="site-header__tagline">{localizedTagline}</span>
          </Link>
          <nav className="site-primary-nav" aria-label={SITE_NAME}>
            <NavigationLink href={MANUAL_AREA_SELECTION_HREF} className="site-primary-nav__catalog">
              <CompassIcon size={20} aria-hidden="true" />
              <span>{footerMessages.catalogLink}</span>
            </NavigationLink>
            <GuidesLink className="site-primary-nav__guides" />
            <NavigationLink href="/how-we-work" activePath="/how-we-work" className="site-primary-nav__about">
              {footerMessages.aboutLink}
            </NavigationLink>
          </nav>
          <SiteAccountNav
            authConfigured={accountAuthConfigured}
            messages={accountMessages ?? headerMessages}
          />
        </header>
        <PageMotion>{children}</PageMotion>
        <footer className="site-footer">
          <nav className="site-footer__links" aria-label={footerMessages.navigation}>
            <Link href="/" className="site-footer__brand-link" aria-label={SITE_NAME}>
              <ChisanWordmark alt="" reverse />
            </Link>
            <Link href="/how-we-work">{footerMessages.aboutLink}</Link>
            <GuidesLink />
            <Link href={MANUAL_AREA_SELECTION_HREF}>{footerMessages.catalogLink}</Link>
            <Link href="/privacy">
              {htmlLang.toLowerCase().startsWith("es")
                ? "Privacidad y cookies"
                : "Privacy & cookies"}
            </Link>
            <Link href="/contact">{footerMessages.contactLink}</Link>
            <a href={SITE_INSTAGRAM_URL} rel="me">
              Instagram
            </a>
            <a href={SITE_X_URL} rel="me">
              X
            </a>
            <a href={SITE_CONTACT_URL}>{SITE_CONTACT_EMAIL}</a>
          </nav>
        </footer>
      </SiteCatalogControlsProvider>
    </SiteLanguageMenuProvider>
  );

  return (
    <html lang={htmlLang} className={notoSans.variable}>
      <head>
        <link rel="service-desc" href="/api/catalog/v1/openapi.json" type="application/vnd.oai.openapi+json" />
        <link rel="describedby" href="/llms.txt" type="text/plain" />
      </head>
      <body>
        <CatalogAgentTools tools={catalogToolDefinitions} />
        {accountAuthConfigured ? (
          <ClerkProvider
            signInUrl={ACCOUNT_ROUTES.signIn}
            signUpUrl={ACCOUNT_ROUTES.signUp}
            signInFallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
            signUpFallbackRedirectUrl={ACCOUNT_ROUTES.afterAuthentication}
          >
            {content}
          </ClerkProvider>
        ) : (
          content
        )}
        <ChisanAnalytics />
      </body>
    </html>
  );
}
