import type { Metadata } from "next";
import { Manrope, Spectral } from "next/font/google";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Km0 Mapa de Productores",
    template: "%s | Km0",
  },
  description:
    "Buscador y mapa de productores Km0 con filtros por ciudad, categoría y subcategoría.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${spectral.variable} antialiased`}>{children}</body>
    </html>
  );
}
