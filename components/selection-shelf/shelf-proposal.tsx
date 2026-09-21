"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProducerSelectionExplorer } from "@/components/producer-selection-explorer";
import { selectionPageMessages } from "@/lib/accounts/selection-presentation";
import type { ProducerSelectionItem } from "@/lib/producer-selections";
import type { createSelectionShelfService } from "@/lib/selection-shelf/service";
import { shelfStatusLabels } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

type Proposal = NonNullable<Awaited<ReturnType<ReturnType<typeof createSelectionShelfService>["ownerProposal"]>>>;
export function ShelfProposal({ proposal, items, profile, areas, allowed }: {
  proposal: Proposal; items: ProducerSelectionItem[]; allowed: boolean;
  profile: { publicHandle: string; handleFixed: boolean; baseLocation: string; baseMunicipality: string; private: boolean };
  areas: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(proposal.producers.map((item) => item.key));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const preparing = proposal.status === "queued" || proposal.status === "processing";
  useEffect(() => {
    if (!preparing) return;
    let polls = 0;
    const timer = setInterval(() => { router.refresh(); if (++polls >= 24) clearInterval(timer); }, 5000);
    return () => clearInterval(timer);
  }, [preparing, router]);
  const selectedItems = items.filter((item) => checked.includes(item.key));
  async function publish(form: HTMLFormElement) {
    setBusy(true); setMessage("");
    const data = new FormData(form);
    try {
      const response = await fetch("/api/selection-shelf", { method: "PATCH", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" },
        body: JSON.stringify({ id: proposal.id, version: proposal.version, producerKeys: checked,
          profile: { publicHandle: data.get("publicHandle"), baseLocation: data.get("baseLocation"), baseMunicipality: data.get("baseMunicipality") } }) });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error === "changed" ? "La propuesta ha cambiado. Actualiza antes de publicar."
          : result.error === "profile" ? "Revisa el identificador y el municipio. El identificador debe estar disponible y el municipio pertenecer a la zona elegida."
          : result.error === "selection" ? "Algún productor o producto ya no está disponible. Actualiza la propuesta."
          : "No hemos podido publicar. Tus elecciones se conservan; inténtalo de nuevo.");
        return;
      }
      router.push(`/u/${result.handle}`); router.refresh();
    } catch { setMessage("Comprueba tu conexión. Tus elecciones se conservan."); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="shelf-proposal-title">
    <h2 id="shelf-proposal-title">{shelfStatusLabels[proposal.status] ?? "Tu propuesta"}</h2>
    {preparing ? <p role="status">Foto recibida. La IA está leyendo las etiquetas, buscando sus productores y colocando los puntos automáticamente. Esta página se actualizará; también puedes volver más tarde.</p> : null}
    {proposal.status === "review" || proposal.status === "received" ? <p role="status">{proposal.analysisError === "budget" ? "Foto recibida. El análisis está detenido porque se ha alcanzado el límite de llamadas de IA de Chisan. Chisan debe habilitar otro intento."
      : proposal.analysisError ? "Foto recibida. El análisis automático ha fallado y Chisan debe revisar la conexión antes de continuar."
      : "La propuesta necesita una revisión de Chisan antes de estar lista."} No necesitas añadir puntos. Todavía no hemos añadido favoritos ni publicado la foto.</p> : null}
    {proposal.unmatched > 0 ? <p>{proposal.unmatched === 1 ? "1 etiqueta sin una coincidencia clara queda fuera de la propuesta." : `${proposal.unmatched} etiquetas sin una coincidencia clara quedan fuera de la propuesta.`}</p> : null}
    {proposal.points.length > 0 ? <ProducerSelectionExplorer
      selection={{ canonicalPath: "/cuenta/estanteria", items: selectedItems, initialFocusKeys: selectedItems.map((item) => item.key) }}
      messages={{ producers: selectionPageMessages.producers, map: { ...selectionPageMessages.map, emptyCoordinates: selectedItems.length ? selectionPageMessages.map.emptyCoordinates : "Marca al menos un productor para verlo en el mapa y publicar." },
        countLabels: Object.fromEntries(Array.from({ length: items.length + 1 }, (_, count) => [String(count), selectionPageMessages.producerCount(count)])) }}
      shelf={{ id: proposal.id, imageSrc: proposal.imageSrc, width: proposal.width, height: proposal.height, updatedOn: "", preview: true,
        points: proposal.points.filter((point) => checked.includes(point.producerKey)) }} /> : null}
    {proposal.status === "ready" ? <form className="account-form" onSubmit={(event) => { event.preventDefault(); void publish(event.currentTarget); }}>
      <fieldset disabled={busy || !allowed} className={styles.editorPanel}>
        <legend>Elige los productores de tu perfil</legend>
        <p>Hemos encontrado estas coincidencias en el catálogo de Chisan. Comprueba la foto y desmarca las que no encajen.</p>
        {proposal.producers.map((producer) => <label key={producer.key} className={styles.proposalChoice}>
          <input type="checkbox" checked={checked.includes(producer.key)} onChange={(event) => setChecked((previous) => event.target.checked ? [...previous, producer.key] : previous.filter((key) => key !== producer.key))} />
          <span><strong>{producer.name}</strong> · {producer.city}<br />
            <small>{[...new Set(proposal.points.filter((point) => point.producerKey === producer.key).map((point) => producer.products.find((product) => product.id === point.productId)?.name ?? point.label))].join(" · ")}</small>
          </span>
        </label>)}
        <p>Los productores marcados formarán parte de esta estantería y se mostrarán en su mapa y foto.</p>
        <label>Identificador de tu perfil<input name="publicHandle" required minLength={3} maxLength={40} readOnly={profile.handleFixed} defaultValue={profile.publicHandle} autoComplete="off" /><small>Tu dirección permanente: /u/identificador</small></label>
        <label>Zona de la tienda<select name="baseLocation" required defaultValue={profile.baseLocation}><option value="">Elige una zona</option>{areas.map((area) => <option key={area.value} value={area.value}>{area.label}</option>)}</select></label>
        <label>Municipio de la tienda<input name="baseMunicipality" required maxLength={160} defaultValue={profile.baseMunicipality} autoComplete="address-level2" /></label>
        {profile.private ? <p>Al publicar, esta selección y su foto serán visibles públicamente.</p> : <p>Al publicar, esta selección mostrará esta foto y sus productores.</p>}
        <button className="account-button" disabled={busy || !checked.length}>{busy ? "Publicando…" : "Publicar mi perfil"}</button>
      </fieldset>
    </form> : null}
    <p role="status">{message}</p>
  </section>;
}
