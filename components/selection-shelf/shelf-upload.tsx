"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SHELF_LIMITS, shelfStatusLabels, shelfImageUrl } from "@/lib/selection-shelf/policy";
import styles from "./shelf.module.css";

const errors: Record<string, string> = {
  access: "Necesitas acceso activo al perfil ampliado para enviar una foto.",
  selection: "Elige al menos un productor en tu selección (máximo 200).",
  quota: "Has alcanzado el límite de 10 envíos en 24 horas. Inténtalo mañana.",
  size: "La foto es demasiado grande. Usa una foto de hasta 5 MB.",
  format: "Usa una foto JPEG, PNG o WebP sin animación.",
  dimensions: "Necesitamos una foto de al menos 200 píxeles por lado y hasta 24 megapíxeles.",
  consent: "Confirma que podemos procesar y publicar esta foto tras revisarla.",
};

export function ShelfUpload({ allowed, records, aiProviderName }: { aiProviderName: string; allowed: boolean; records: { id: string; status: string; date: string }[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function send(form: HTMLFormElement) {
    const data = new FormData(form);
    const photo = data.get("photo");
    if (!(photo instanceof File) || !photo.size) return;
    if (photo.size > SHELF_LIMITS.inputBytes) { setMessage(errors.size); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/selection-shelf", { method: "POST", headers: {
        "Content-Type": photo.type, "X-Chisan-Shelf": "1", "X-Chisan-Shelf-Consent": data.get("consent") === "on" ? "1" : "0",
      }, body: photo });
      const result = await response.json();
      if (!response.ok) { setMessage(errors[result.error] ?? "No hemos podido recibir la foto. Inténtalo de nuevo."); return; }
      form.reset();
      setMessage("Foto recibida, pendiente de admisión por Chisan. Tras admitirla, identificaremos los productos con IA y revisaremos los puntos antes de publicarla.");
      router.refresh();
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
    {allowed ? <form className="account-form" onSubmit={(event) => { event.preventDefault(); void send(event.currentTarget); }}>
      <label className="account-field"><span>Foto de tu estantería</span><input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required disabled={busy} /></label>
      <p>Fotografía las etiquetas de frente, con buena luz y sin personas. Puedes enviar una nueva foto cuando cambie la estantería.</p>
      <label className={styles.consent}><input type="checkbox" name="consent" required disabled={busy} /><span>Tengo permiso para usar esta foto y autorizo su análisis con {aiProviderName} y su publicación en mi selección después de la revisión de Chisan.</span></label>
      <button className="account-button" disabled={busy}>{busy ? "Enviando…" : "Enviar foto a Chisan"}</button>
    </form> : <p>El envío de fotos requiere acceso activo al perfil ampliado de tu cuenta o de un productor que gestionas.</p>}
    <p role="status">{message}</p>
    <div className={styles.photoHeading}><h3>Tus fotos</h3><button type="button" className="account-button account-button--secondary" onClick={() => router.refresh()} disabled={busy}>Actualizar estado</button></div>
    {records.length ? <ul className={styles.statusList}>{records.map((record) => <li key={record.id}>
      <span><strong>{shelfStatusLabels[record.status] ?? record.status}</strong> · {record.date}</span>
      <a href={shelfImageUrl(record.id)} target="_blank" rel="noreferrer" className="account-button account-button--secondary">Ver foto</a>
      {["received", "queued", "processing", "review", "published"].includes(record.status) ? <button className="account-button account-button--secondary" type="button" disabled={busy} onClick={() => void withdraw(record.id)}>Retirar foto</button> : null}
    </li>)}</ul> : <p>Todavía no has enviado ninguna foto.</p>}
  </>;
}
