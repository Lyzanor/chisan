"use client";

import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { buildCatalogHref } from "@/lib/catalog-navigation";

type SearchFormProps = {
  initialMunicipality: string;
  initialCategory: string;
};

export function SearchForm({ initialMunicipality, initialCategory }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mun = formData.get("municipio")?.toString() || "";
    const cat = formData.get("categoria")?.toString() || initialCategory;

    startTransition(() => {
      router.push(buildCatalogHref({ municipality: mun, category: cat }));
    });
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setErrorMsg("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        startTransition(() => {
          router.push(
            buildCatalogHref({
              category: searchParams.get("categoria") ?? "",
              lat: latitude.toString(),
              lon: longitude.toString(),
            }),
          );
        });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setErrorMsg("No se ha podido obtener tu ubicación. Revisa los permisos.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  return (
    <div className="catalog-search-wrap">
      <form onSubmit={handleSubmit} className="catalog-search" role="search">
        <input type="hidden" name="categoria" value={initialCategory} />
        <input
          type="search"
          name="municipio"
          defaultValue={initialMunicipality}
          placeholder="Tu municipio"
          aria-label="Municipio"
        />
        <div className="catalog-search-actions">
          <button
            onClick={handleLocate}
            disabled={isPending || isLocating}
            className="catalog-btn-locate-icon"
            type="button"
            title="Usar ubicación"
            aria-label="Usar ubicación"
          >
            {isLocating ? "Buscando..." : "Cerca de mí"}
          </button>
          <button
            type="submit"
            disabled={isPending || isLocating}
            className="catalog-btn-search-icon"
            title="Buscar"
            aria-label="Buscar"
          >
            {isPending ? "Buscando..." : "Buscar municipio"}
          </button>
        </div>
      </form>
      {errorMsg && <p className="catalog-error-msg">{errorMsg}</p>}
    </div>
  );
}
