"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventRequest, StoredEventRequest } from "@/lib/selection-shelf/event-request";

export function ShelfEventRequest({ id, version, title, request, producerKeys }: { id: string; version: number; title: string; request: StoredEventRequest | null; producerKeys: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(form: HTMLFormElement) {
    const details = Object.fromEntries(new FormData(form));
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/selection-shelf/event", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" }, body: JSON.stringify({ id, version, details, producerKeys }) });
      if (!response.ok) { setMessage("Revisa los datos y las fechas. Si la propuesta ha cambiado, actualiza antes de enviarla."); return; }
      setMessage("Evento enviado a revisión. Chisan comprobará los datos y los expositores antes de publicarlo en Eventos."); router.refresh();
    } catch { setMessage("Comprueba tu conexión; el envío no se ha confirmado."); }
    finally { setBusy(false); }
  }
  const fields: { key: keyof EventRequest; label: string; type?: string; max?: number }[] = [
    { key: "title", label: "Nombre del evento", max: 160 }, { key: "description", label: "Descripción", max: 600 },
    { key: "startDate", label: "Fecha de inicio", type: "date" }, { key: "endDate", label: "Fecha de fin", type: "date" },
    { key: "venueName", label: "Recinto o lugar", max: 160 }, { key: "municipality", label: "Municipio del evento", max: 160 },
    { key: "organizerName", label: "Organizador", max: 160 }, { key: "sourceUrl", label: "Web oficial del evento", type: "url" },
  ];
  return <details>
    <summary>{request ? "Evento enviado: consultar o corregir datos" : "¿Es un evento? Proponerlo para Eventos"}</summary>
    <p>Esta solicitud incluye únicamente los productores que has marcado. Enviar el cartel no acredita ser el organizador.</p>
    <form className="account-form account-content--narrow" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }}>
      <fieldset className="account-form-section" disabled={busy}>
        <legend>Datos del evento</legend>
        {fields.map((field) => <label className="account-field" key={field.key}>{field.label}<input name={field.key} type={field.type ?? "text"} required maxLength={field.max} defaultValue={request?.details[field.key] ?? (field.key === "title" ? title : "")} /></label>)}
        <label className="account-field">Categoría<select name="category" defaultValue={request?.details.category ?? "Alimentos"}>{["Alimentos", "Vinos", "Quesos", "Bebidas"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="account-field">Zona horaria<select name="timeZone" defaultValue={request?.details.timeZone ?? "Europe/Madrid"}><option value="Europe/Madrid">Península y Baleares</option><option value="Atlantic/Canary">Canarias</option></select></label>
        <button className="chisan-button chisan-button--primary">{busy ? "Enviando…" : "Enviar evento a revisión"}</button>
      </fieldset>
      {message ? <p role="status">{message}</p> : null}
    </form>
  </details>;
}

export function ShelfEventExport({ id, version, request }: { id: string; version: number; request: StoredEventRequest }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function download(form: HTMLFormElement) {
    setBusy(true); setMessage("");
    const data = new FormData(form);
    try {
      const response = await fetch("/api/admin/selection-shelf/event", { method: "POST", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" }, body: JSON.stringify({ id, version, slug: data.get("slug"), latitude: Number(data.get("latitude")), longitude: Number(data.get("longitude")) }) });
      if (!response.ok) { setMessage("Export failed. Check the venue coordinates, edition slug, permissions and current proposal version."); return; }
      const url = URL.createObjectURL(new Blob([JSON.stringify(await response.json(), null, 2)], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = `event-proposal-${id}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Private draft downloaded. Prepare it with pnpm event:prepare --snapshot <file>, review sources, poster and rights, then use the normal Git publication workflow.");
    } catch { setMessage("Export failed. Check your connection."); }
    finally { setBusy(false); }
  }
  return <section>
    <h3>Event proposal: {request.details.title}</h3>
    <p>{request.details.startDate} – {request.details.endDate} · {request.details.venueName}, {request.details.municipality}</p>
    <p>{request.details.description}</p>
    <details><summary>Submitted roster ({request.points.length} image positions)</summary>
      <ul>{request.points.map((point) => <li key={point.id}>{point.label} · {point.producerKey} · {(point.x * 100).toFixed(1)}%, {(point.y * 100).toFixed(1)}%</li>)}</ul>
      <p>This is the owner-submitted snapshot. Corrections to the working image require the owner to submit an updated event request.</p>
    </details>
    <a href={request.details.sourceUrl} target="_blank" rel="noreferrer">Organizer source: {request.details.organizerName}</a>
    <form className="account-form account-content--narrow" onSubmit={(event) => { event.preventDefault(); void download(event.currentTarget); }}>
      <p>Verify the roster and image points. Locate the venue independently of producer origins. Export creates a private draft, without publication or an organizer ownership claim.</p>
      <label className="account-field">Stable edition slug (ending in year)<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*-[0-9]{4}" placeholder="feria-otono-2026" /></label>
      <label className="account-field">Venue latitude<input name="latitude" type="number" step="any" min="-90" max="90" required /></label>
      <label className="account-field">Venue longitude<input name="longitude" type="number" step="any" min="-180" max="180" required /></label>
      <button className="chisan-button" disabled={busy}>{busy ? "Preparing…" : "Download editorial draft"}</button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  </section>;
}
