import "server-only";

import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Fraunces, Roboto } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteAccountNav } from "@/components/account/site-account-nav";
import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import type { Messages } from "@/lib/i18n/messages";
import {
  isPublicDiscoveryEnabled,
  SITE_CONTACT_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TAGLINE,
} from "@/lib/site";

import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const SITE_VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2f7a4f",
};

export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
          <span className="site-header__name">{SITE_NAME}</span>
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
            {SITE_NAME}
          </Link>
          <Link href="/our-purpose">{footerMessages.aboutLink}</Link>
          <Link href="/">{footerMessages.catalogLink}</Link>
          <a href={SITE_CONTACT_URL}>{footerMessages.contactLink}</a>
        </nav>
      </footer>
    </>
  );

  return (
    <html lang={htmlLang} className={`${fraunces.variable} ${roboto.variable}`}>
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
        <Analytics />
      </body>
    </html>
  );
}
