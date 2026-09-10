"use client";

import { useActionState } from "react";
import {
  linkWhatsApp,
  type LinkState,
} from "@/app/(application)/cuenta/whatsapp/actions";

export function WhatsAppLinkForm({
  producers,
}: {
  producers: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(
    linkWhatsApp,
    {} as LinkState,
  );
  return (
    <form action={action} className="account-form">
      <label>
        Productor
        <select name="producerId" required defaultValue="">
          <option value="" disabled>
            Selecciona el productor
          </option>
          {producers.map((producer) => (
            <option key={producer.id} value={producer.id}>
              {producer.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Zona horaria para fechas como «mañana»
        <select name="timeZone" defaultValue="Europe/Madrid">
          <option value="Europe/Madrid">Península y Baleares</option>
          <option value="Atlantic/Canary">Canarias</option>
        </select>
      </label>
      <label>
        <input type="checkbox" name="consent" required /> Acepto que Meta y
        OpenAI procesen los mensajes y las fotos que envíe para preparar
        propuestas para este productor. Evitaré incluir datos personales de
        otras personas.
      </label>
      <button
        className="account-button"
        disabled={pending || !producers.length}
      >
        {pending ? "Preparando enlace…" : "Generar enlace de vinculación"}
      </button>
      {state.error ? <p role="alert">{state.error}</p> : null}
      {state.url ? (
        <div role="status">
          <p>
            Abre WhatsApp y envía el código incluido en el mensaje. El enlace
            caduca en 10 minutos. No lo compartas.
          </p>
          <a
            className="account-button"
            href={state.url}
            rel="noreferrer"
            target="_blank"
          >
            Vincular en WhatsApp
          </a>
        </div>
      ) : null}
    </form>
  );
}
