"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShelfCandidate, ShelfDetection, ShelfPoint } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

export function ShelfCorrections({ id, version, points, observations }: {
  id: string; version: number; points: ShelfPoint[]; observations: ShelfDetection["points"];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [choices, setChoices] = useState<ShelfCandidate[]>([]);
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function search() {
    setBusy(true); setMessage(""); setChoices([]);
    try {
      const response = await fetch("/api/selection-shelf/search", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" }, body: JSON.stringify({ id, query }) });
      const result = await response.json();
      if (!response.ok) { setMessage("No hemos podido buscar. Inténtalo de nuevo."); return; }
      setChoices(result.candidates);
      if (!result.candidates.length) setMessage("No encontramos ese productor en Chisan. Puedes dejarlo pendiente; no se añadirá una identidad inventada al mapa.");
    } catch { setMessage("Comprueba tu conexión."); }
    finally { setBusy(false); }
  }
  async function assign(producer: ShelfCandidate) {
    const observation = target.startsWith("new:") ? observations[Number(target.slice(4))] : points.find((point) => point.id === target);
    if (!observation) return;
    const point = { id: target.startsWith("new:") ? crypto.randomUUID() : target, producerKey: producer.key, label: observation.label || producer.name, x: observation.x, y: observation.y };
    const corrected = target.startsWith("new:") ? [...points, point] : points.map((item) => item.id === target ? point : item);
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/selection-shelf/corrections", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" }, body: JSON.stringify({ id, version, action: "save", points: corrected, note: "" }) });
      if (!response.ok) { setMessage("No se ha guardado. La propuesta puede haber cambiado; actualiza antes de corregirla."); return; }
      router.refresh();
    } catch { setMessage("Comprueba tu conexión."); }
    finally { setBusy(false); }
  }
  return <details className={styles.manualCorrections}>
    <summary>Corregir una coincidencia o identificar un nombre pendiente</summary>
    <p>Elige el nombre que aparece en la imagen y busca su productor. Se conservará su posición en la imagen.</p>
    <div className="account-form account-content--narrow">
      <label className="account-field">Nombre en la imagen<select value={target} disabled={busy} onChange={(event) => { setTarget(event.target.value); setChoices([]); }}>
        <option value="">Elige un nombre</option>
        {points.map((point) => <option key={point.id} value={point.id}>{point.label}</option>)}
        {observations.map((point, index) => <option key={`new:${index}`} value={`new:${index}`}>Pendiente: {point.producerName || point.label || "Nombre ilegible"}</option>)}
      </select></label>
      <label className="account-field">Productor o municipio<input value={query} minLength={2} maxLength={100} onChange={(event) => { setQuery(event.target.value); setChoices([]); }} /></label>
      <button type="button" className="chisan-button" disabled={busy || !target || query.trim().length < 2} onClick={() => void search()}>Buscar en Chisan</button>
      {choices.length ? <ul>{choices.map((choice) => <li key={choice.key}><button type="button" className="chisan-button" disabled={busy} onClick={() => void assign(choice)}>{choice.name} · {choice.city}</button></li>)}</ul> : null}
      {message ? <p role="status">{message}</p> : null}
    </div>
  </details>;
}
