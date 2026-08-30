import "server-only";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteAccountNav } from "@/components/account/site-account-nav";
import { ChisanAnalytics } from "@/components/analytics/chisan-analytics";
import { ChisanWordmark } from "@/components/brand/chisan-brand";
import chisanMark from "@/design/brand/assets/chisan-mark-ink.png";
import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
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
  children: ReactNode;
  footerMessages: Messages["siteFooter"];
  headerMessages: Messages["siteHeader"];
  htmlLang: string;
}>;

export function SiteRootShell({
  children,
  footerMessages,
  headerMessages,
  htmlLang,
}: SiteRootShellProps) {
  const accountAuthConfigured = isAccountAuthConfigured();
  const localizedTagline = headerMessages.tagline;
  const content = (
    <>
      <header className="site-header">
        <Link
          href="/"
          className="site-header__brand"
          aria-label={`${SITE_NAME} — ${localizedTagline}`}
        >
          <ChisanWordmark alt="" />
          <span className="site-header__tagline">{localizedTagline}</span>
        </Link>
        <SiteAccountNav
          authConfigured={accountAuthConfigured}
          messages={headerMessages}
        />
      </header>
      {children}
      <footer className="site-footer">
        <nav className="site-footer__links" aria-label={footerMessages.navigation}>
          <Link href="/" className="site-footer__brand-link">
            <ChisanWordmark alt="" reverse />
          </Link>
          <Link href="/our-purpose">{footerMessages.aboutLink}</Link>
          <Link href="/">{footerMessages.catalogLink}</Link>
          <Link href="/privacy">
            {htmlLang.toLowerCase().startsWith("es")
              ? "Privacidad y cookies"
              : "Privacy & cookies"}
          </Link>
          <a href={SITE_INSTAGRAM_URL} rel="me">
            Instagram
          </a>
          <a href={SITE_X_URL} rel="me">
            X
          </a>
          <a href={SITE_CONTACT_URL}>{SITE_CONTACT_EMAIL}</a>
        </nav>
      </footer>
    </>
  );

  return (
    <html lang={htmlLang} className={notoSans.variable}>
      <body>
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
