import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
