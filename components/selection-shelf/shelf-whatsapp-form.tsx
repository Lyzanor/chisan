"use client";
import { useActionState } from "react";
import { linkShelfWhatsApp, type LinkState } from "@/app/(application)/cuenta/whatsapp/actions";
import styles from "./shelf.module.css";

export function ShelfWhatsAppForm({ aiProviderName }: { aiProviderName: string }) {
  const [state, action, busy] = useActionState(linkShelfWhatsApp, {} as LinkState);
  return <form action={action} className="account-form">
    <label className={styles.consent}><input type="checkbox" name="consent" required /><span>Tengo permiso para usar las fotos que envíe. Autorizo su tratamiento por Meta y {aiProviderName} y la preparación de una propuesta que revisaré y publicaré desde mi cuenta. Evitaré incluir personas y datos personales.</span></label>
    <p>Esta vinculación dura 30 días y sustituye cualquier vinculación anterior de tu cuenta para enviar novedades o productos. El número quedará dedicado a recibir fotos de tu estantería.</p>
    <button className="account-button" disabled={busy}>{busy ? "Preparando enlace…" : "Vincular WhatsApp a mi estantería"}</button>
    {state.error ? <p role="alert">{state.error}</p> : null}
    {state.url ? <div role="status"><p>Abre WhatsApp y envía el código. El enlace caduca en 10 minutos; no lo compartas.</p><a className="account-button" href={state.url} target="_blank" rel="noreferrer">Abrir WhatsApp</a></div> : null}
  </form>;
}
