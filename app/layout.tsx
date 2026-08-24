import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Fraunces, Roboto } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { SiteAccountNav } from "@/components/account/site-account-nav";
import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import {
  SITE_CONTACT_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TAGLINE,
} from "@/lib/site";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2f7a4f",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accountAuthConfigured = isAccountAuthConfigured();
  const content = (
    <>
      <header className="site-header">
        <Link
          href="/"
          className="site-header__brand"
          aria-label={`${SITE_NAME} — ${SITE_TAGLINE}`}
        >
          <span className="site-header__name">{SITE_NAME}</span>
          <span className="site-header__tagline">{SITE_TAGLINE}</span>
        </Link>
        <SiteAccountNav authConfigured={accountAuthConfigured} />
      </header>
      {children}
      <footer className="site-footer">
        <nav className="site-footer__links" aria-label="Footer navigation">
          <Link href="/" className="site-footer__brand-link">
            {SITE_NAME}
          </Link>
          <Link href="/our-purpose">Our purpose</Link>
          <Link href="/">Producer catalog</Link>
          <a href={SITE_CONTACT_URL}>Contact us on Github</a>
        </nav>
      </footer>
    </>
  );

  return (
    <html lang="en" className={`${fraunces.variable} ${roboto.variable}`}>
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
      </body>
    </html>
  );
}
