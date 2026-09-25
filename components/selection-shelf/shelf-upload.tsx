"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SHELF_LIMITS, shelfInputLabels, shelfStatusLabels, shelfImageUrl } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

const errors: Record<string, string> = {
  access: "Necesitas acceso activo al perfil ampliado para enviar una foto.",
  quota: "Has alcanzado el límite de 10 envíos en 24 horas. Inténtalo mañana.",
  size: "La foto es demasiado grande. Usa una foto de hasta 5 MB.",
  format: "Usa una foto JPEG, PNG o WebP sin animación.",
  dimensions: "Necesitamos una foto de al menos 200 píxeles por lado y hasta 24 megapíxeles.",
  consent: "Confirma que podemos analizar la foto y preparar tu propuesta.",
};

export function ShelfUpload({ allowed, records, aiProviderName }: { aiProviderName: string; allowed: boolean; records: { id: string; status: string; date: string; title?: string; selectionId?: string | null }[] }) {
  const router = useRouter();
  const requestId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function send(form: HTMLFormElement) {
    const data = new FormData(form);
    const photo = data.get("photo");
    if (!(photo instanceof File) || !photo.size) return;
    if (photo.size > SHELF_LIMITS.inputBytes) { setMessage(errors.size); return; }
    requestId.current ??= crypto.randomUUID();
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/selection-shelf", { method: "POST", headers: {
        "X-Chisan-Shelf-Request": requestId.current,
        "X-Chisan-Image-Context": encodeURIComponent(JSON.stringify({ kind: data.get("kind"), title: data.get("title") || "Mi selección", instruction: data.get("instruction"), ...(data.get("selectionId") ? { selectionId: data.get("selectionId") } : {}) })),
        "Content-Type": photo.type, "X-Chisan-Shelf": "1", "X-Chisan-Shelf-Consent": data.get("consent") === "on" ? "1" : "0",
      }, body: photo });
      const result = await response.json();
      if (!response.ok) { setMessage(errors[result.error] ?? "No hemos podido recibir la foto. Inténtalo de nuevo."); return; }
      form.reset(); requestId.current = null;
      setMessage("Foto recibida. Estamos preparando tu propuesta de productores. Tú eliges cuáles añadir y cuándo publicar.");
      router.push(`/cuenta/estanteria?id=${result.id}`); router.refresh();
    } catch { setMessage("No hemos podido recibir la foto. Comprueba tu conexión."); }
    finally { setBusy(false); }
  }
  async function withdraw(id: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/selection-shelf", { method: "DELETE", headers: { "Content-Type": "application/json", "X-Chisan-Shelf": "1" }, body: JSON.stringify({ id }) });
      setMessage(response.ok ? "Foto retirada." : "No hemos podido retirar la foto. Actualiza el estado e inténtalo de nuevo.");
      router.refresh();
    } catch { setMessage("Comprueba tu conexión e inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  return <>
    {allowed ? <form className="account-form account-content--narrow" onChange={() => { requestId.current = null; }} onSubmit={(event) => { event.preventDefault(); void send(event.currentTarget); }}>
      <label className="account-field"><span>Imagen, plano o programa</span><input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required disabled={busy} /></label>
      <p>Sube una foto o captura nítida en JPEG, PNG o WebP (hasta 5 MB). Si tienes un programa en PDF, utiliza una imagen de la página que quieres trasladar.</p>
      <label className="account-field">Nombre (opcional)<input name="title" maxLength={160} placeholder="Mi estantería, Feria de otoño…" disabled={busy} /></label>
      <label className="account-field">¿Qué quieres mostrar?<textarea name="instruction" maxLength={600} placeholder="Lleva estos expositores al mapa y sitúalos en el plano" disabled={busy} /></label>
      <details><summary>Opciones de la imagen</summary>
        <label className="account-field">Tipo<select name="kind" defaultValue="auto" disabled={busy}>{Object.entries(shelfInputLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="account-field">Destino<select name="selectionId" defaultValue="" disabled={busy}><option value="">Crear una selección nueva</option>{[...new Map(records.filter((record) => record.selectionId).map((record) => [record.selectionId, record])).values()].map((record) => <option key={record.selectionId} value={record.selectionId!}>Actualizar {record.title ?? "selección"}</option>)}</select></label>
        <p>Al actualizar, la imagen publicada seguirá visible hasta que confirmes la nueva propuesta.</p>
      </details>
      <label className={styles.consent}><input type="checkbox" name="consent" required disabled={busy} /><span>Tengo permiso para usar esta foto y autorizo su análisis con {aiProviderName} y la preparación de una propuesta que revisaré antes de publicar.</span></label>
      <button className="chisan-button chisan-button--primary" disabled={busy}>{busy ? "Enviando…" : "Preparar mi mapa"}</button>
    </form> : <p>El envío de fotos requiere acceso activo al perfil ampliado de tu cuenta o de un productor que gestionas.</p>}
    {message ? <p role="status">{message}</p> : null}
    <div className={styles.photoHeading}><h3>Tus selecciones</h3><button type="button" className="chisan-button" onClick={() => router.refresh()} disabled={busy}>Actualizar estado</button></div>
    {records.length ? <ul className={styles.statusList}>{records.map((record) => <li key={record.id}>
      <a href={`/cuenta/estanteria?id=${record.id}`}>{record.title ?? "Selección"}</a><span><strong>{shelfStatusLabels[record.status] ?? record.status}</strong> · {record.date}</span>
      <a href={shelfImageUrl(record.id)} target="_blank" rel="noreferrer" className="chisan-button">Ver foto</a>
      {["received", "queued", "processing", "review", "ready", "published"].includes(record.status) ? <button className="chisan-button" type="button" disabled={busy} onClick={() => void withdraw(record.id)}>Retirar foto</button> : null}
    </li>)}</ul> : <p>Todavía no has enviado ninguna foto.</p>}
  </>;
}
