import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Fraunces, Roboto } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { SiteAccountNav } from "@/components/account/site-account-nav";
import { ACCOUNT_ROUTES, isAccountAuthConfigured } from "@/lib/accounts/config";
import { CATALOG_UNIT } from "@/lib/csv-catalog";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

const SITE_DESCRIPTION = `Map of local, zero-kilometre producers by ${CATALOG_UNIT.one} and category.`;

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
    default: `${SITE_NAME} Producers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} Producers`,
    description: SITE_DESCRIPTION,
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} Producers`,
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
        <Link href="/" className="site-header__brand" aria-label={`${SITE_NAME} home`}>
          {SITE_NAME}
        </Link>
        <SiteAccountNav authConfigured={accountAuthConfigured} />
      </header>
      {children}
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
