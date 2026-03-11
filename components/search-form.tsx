"use client";

import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchFormProps = {
  initialMunicipality: string;
  initialCategory: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 20.5 21.5 19l-6-5zm-5.5 0A4.5 4.5 0 1 1 10 5a4.5 4.5 0 0 1 0 9z"
      />
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8.94 3A9 9 0 0 0 13 3.06V1h-2v2.06A9 9 0 0 0 3.06 11H1v2h2.06A9 9 0 0 0 11 20.94V23h2v-2.06A9 9 0 0 0 20.94 13H23v-2zM12 19a7 7 0 1 1 7-7 7 7 0 0 1-7 7z"
      />
    </svg>
  );
}

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

    const params = new URLSearchParams(searchParams);
    if (mun) params.set("municipio", mun);
    else params.delete("municipio");

    if (cat) params.set("categoria", cat);
    else params.delete("categoria");

    // Clear GPS if performing text search
    params.delete("lat");
    params.delete("lon");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
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
        const params = new URLSearchParams(searchParams);
        params.set("lat", latitude.toString());
        params.set("lon", longitude.toString());
        
        // Clear text search if using GPS
        params.delete("municipio");

        startTransition(() => {
          router.push(`/?${params.toString()}`);
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
      }
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
          placeholder="Cerca per municipi"
          aria-label="Municipio"
        />
        <div className="catalog-search-actions">
          <button
            onClick={handleLocate}
            disabled={isPending || isLocating}
            className="catalog-btn-locate-icon"
            type="button"
            title="A prop meu"
            aria-label="A prop meu"
          >
            <span aria-hidden="true">{isLocating ? "…" : <LocateIcon />}</span>
          </button>
          <button
            type="submit"
            disabled={isPending || isLocating}
            className="catalog-btn-search-icon"
            title="Buscar"
            aria-label="Buscar"
          >
            <SearchIcon />
          </button>
        </div>
      </form>
      {errorMsg && <p className="catalog-error-msg">{errorMsg}</p>}
    </div>
  );
}
