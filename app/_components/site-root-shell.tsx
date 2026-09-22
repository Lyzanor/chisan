import "server-only";

import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import type { ReactNode } from "react";
import { GuidesLink } from "@/components/guides/guides-link";
import { PageMotion } from "@/components/page-motion";
import { FooterLandscape } from "@/components/footer-landscape";
import { ResponsiveDisclosure } from "@/components/responsive-disclosure";

import { SiteCatalogControlsProvider } from "@/components/account/site-catalog-controls-context";
import { SiteAccountNav } from "@/components/account/site-account-nav";
import { SiteBottomNav } from "@/components/navigation/site-bottom-nav";
import { ProducerFollowsProvider } from "@/components/account/producer-follows-provider";
import { ChisanAnalytics } from "@/components/analytics/chisan-analytics";
import { CatalogAgentTools } from "@/components/agents/catalog-agent-tools";
import { catalogToolDefinitions } from "@/lib/agents/catalog-schema";
import { ChisanMark, ChisanWordmark } from "@/components/brand/chisan-brand";
import {
  type LanguageMenuConfig,
  SiteLanguageMenuProvider,
} from "@/components/language-menu-context";
import chisanAppleIcon from "@/design/brand/assets/chisan-icon-apple.png";
import chisanIcon from "@/design/brand/assets/chisan-icon-light.png";
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
import "../../design/adapters/category-themes.css";
import "../../design/adapters/map-explorer.css";

const adsenseAccountId = getAdSenseAccountId();

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-chisan-fallback",
});

const outfit = localFont({
  src: "../_fonts/outfit.ttf",
  display: "swap",
  weight: "100 900",
  variable: "--font-chisan-sans",
});

export const SITE_VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00563f",
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
    // The app icon is the supplied C, reversed on the brand forest square.
    icon: [{ url: chisanIcon.src, type: "image/png", sizes: "512x512" }],
    apple: [{ url: chisanAppleIcon.src, type: "image/png", sizes: "180x180" }],
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
  const spanish = htmlLang.toLowerCase().startsWith("es");
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
            aria-label={SITE_NAME}
          >
            <ChisanWordmark alt="" />
            <ChisanMark alt="" className="site-header__map-mark" />
          </Link>
          <div id="catalog-header-search" />
          <SiteAccountNav
            authConfigured={accountAuthConfigured}
            messages={accountMessages ?? headerMessages}
          />
        </header>
        <ProducerFollowsProvider enabled={accountAuthConfigured}>
          <PageMotion>{children}</PageMotion>
        </ProducerFollowsProvider>
        <footer className="site-footer">
          <div className="site-footer__top">
            <div className="site-footer__identity">
              <Link href="/" className="site-footer__brand-link" aria-label={SITE_NAME}>
                <ChisanWordmark alt="" />
              </Link>
              <p>{spanish ? "Conoce el origen. Elige con sentido." : "Know the origin. Choose with care."}</p>
            </div>
            <nav className="site-footer__links" aria-label={footerMessages.navigation}>
              <ResponsiveDisclosure className="site-footer__group" compactWidth={540} summary={spanish ? "Explora" : "Explore"}>
                  <Link href={MANUAL_AREA_SELECTION_HREF}>{footerMessages.catalogLink}</Link>
                  <Link href="/actividad">{spanish ? "Descubrir" : "Discover"}</Link>
                  <GuidesLink locale={htmlLang === "en" ? "en" : "es"} />
              </ResponsiveDisclosure>
              <ResponsiveDisclosure className="site-footer__group" compactWidth={540} summary="Chisan">
                  <Link href="/about">{spanish ? "Sobre Chisan" : "About Chisan"}</Link>
                  <Link href="/how-we-work">{footerMessages.aboutLink}</Link>
                  <Link href="/contact">{footerMessages.contactLink}</Link>
              </ResponsiveDisclosure>
              <ResponsiveDisclosure className="site-footer__group" compactWidth={540} summary={spanish ? "Conecta" : "Connect"}>
                  <a href={SITE_INSTAGRAM_URL} rel="me">Instagram</a>
                  <a href={SITE_X_URL} rel="me">X</a>
                  <a href={SITE_CONTACT_URL}>{SITE_CONTACT_EMAIL}</a>
              </ResponsiveDisclosure>
            </nav>
          </div>
          <div className="site-footer__bottom">
            <span>© {new Date().getFullYear()} Chisan</span>
            <Link href="/privacy">{spanish ? "Privacidad y cookies" : "Privacy & cookies"}</Link>
          </div>
          <FooterLandscape />
        </footer>
        <SiteBottomNav />
      </SiteCatalogControlsProvider>
    </SiteLanguageMenuProvider>
  );

  return (
    <html lang={htmlLang} className={`${outfit.variable} ${notoSans.variable}`}>
      <head>
        <link rel="service-desc" href="/api/catalog/v1/openapi.json" type="application/vnd.oai.openapi+json" />
        <link rel="describedby" href="/llms.txt" type="text/plain" />
      </head>
      <body>
        <CatalogAgentTools tools={catalogToolDefinitions} />
        {accountAuthConfigured ? (
          <ClerkProvider
            appearance={{ elements: {
              socialButtonsBlockButton__apple: { display: "none" },
              socialButtonsIconButton__apple: { display: "none" },
            } }}
            localization={htmlLang === "es" ? esES : undefined}
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
