import type { Metadata } from "next";

import HomeMapView from "@/components/home-map-view";

export const metadata: Metadata = {
  title: "Mapa de productores de Barcelona",
  description:
    "Explora productores Km0 de la provincia de Barcelona con buscador central y filtros de ciudad y categoría.",
};

export default function HomePage() {
  return <HomeMapView />;
}
