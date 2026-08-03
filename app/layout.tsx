import type { Metadata, Viewport } from "next";
import { Fraunces, Roboto } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "KM0 Productores",
    template: "%s | KM0",
  },
  description: `Mapa de productores locales de kilómetro cero por ${CATALOG_UNIT} y categoría.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
