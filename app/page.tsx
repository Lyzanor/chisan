import type { Metadata } from "next";

import HomeMapView from "@/components/home-map-view";
import { readProducerFiltersFromParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Mapa de productores de Barcelona",
  description:
    "Explora productores Km0 de la provincia de Barcelona con buscador central y filtros de ciudad y categoría.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const queryParams = await searchParams;

  return (
    <HomeMapView initialFilters={readProducerFiltersFromParams(queryParams)} />
  );
}
