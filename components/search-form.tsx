"use client";

import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        <span aria-hidden="true">🔎</span>
        <input
          type="search"
          name="municipio"
          defaultValue={initialMunicipality}
          placeholder="Cerca per municipi"
          aria-label="Municipio"
        />
        <button 
          onClick={handleLocate} 
          disabled={isPending || isLocating}
          className="catalog-btn-locate-icon"
          type="button"
          title="A prop meu"
          aria-label="A prop meu"
        >
          <span aria-hidden="true">{isLocating ? "⏳" : "📍"}</span>
        </button>
        <button type="submit" disabled={isPending || isLocating}>
          Buscar
        </button>
      </form>
      {errorMsg && <p className="catalog-error-msg" style={{ marginTop: '0.5rem' }}>{errorMsg}</p>}
    </div>
  );
}
