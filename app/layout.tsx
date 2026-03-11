import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

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
    <html lang="es" className={fraunces.variable}>
      <body>{children}</body>
    </html>
  );
}
