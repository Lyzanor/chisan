import type { Metadata } from "next";

import SearchListView from "@/components/search-list-view";
import { readProducerFiltersFromParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Buscador de productores",
  description:
    "Listado de productores Km0 de la provincia de Barcelona filtrable por municipio y categoría.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryParams = await searchParams;

  return (
    <SearchListView initialFilters={readProducerFiltersFromParams(queryParams)} />
  );
}
