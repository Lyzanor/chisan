import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Fraunces, Roboto } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { SiteAccountNav } from "@/components/account/site-account-nav";
import {
  ACCOUNT_ROUTES,
  getAppUrl,
  isAccountAuthConfigured,
} from "@/lib/accounts/config";
import { CATALOG_UNIT } from "@/lib/csv-catalog";

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
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "KM0 Producers",
    template: "%s | KM0",
  },
  description: `Map of local, zero-kilometre producers by ${CATALOG_UNIT.one} and category.`,
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
        <Link href="/" className="site-header__brand" aria-label="KM0 home">
          KM0
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
