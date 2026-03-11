import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import { AndroidBackHandler } from "@/components/android-back-handler";

const manrope = Manrope({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
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
  description:
    "Directorio de productores locales de kilómetro cero. Busca por municipio y categoría.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={manrope.variable}>
      <body>
        <AndroidBackHandler />
        {children}
      </body>
    </html>
  );
}
