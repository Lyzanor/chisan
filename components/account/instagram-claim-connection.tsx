import { beginInstagramVerification } from "@/app/(application)/cuenta/actions/instagram";

export function InstagramClaimConnection({ country, producerId, enabled, username, matchesCatalog }: {
  country: string; producerId: number; enabled: boolean; username?: string; matchesCatalog?: boolean;
}) {
  return <section className="account-callout" aria-labelledby="instagram-claim-title">
    <h3 id="instagram-claim-title">Instagram del productor</h3>
    <p>Si gestionas su cuenta profesional de Instagram, puedes conectarla para aportar una comprobación a tu solicitud.</p>
    {username ? <p role="status"><strong>@{username} conectado.</strong> {matchesCatalog
      ? "Coincide con el Instagram publicado en la ficha."
      : "No coincide con el Instagram publicado en la ficha. Explica tu relación con el productor para que podamos revisarla."} La conexión acredita el control del perfil social; el equipo revisará la titularidad del productor.</p> : null}
    {enabled ? <form action={beginInstagramVerification}>
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="producerId" value={producerId} />
      <button className="account-button account-button--secondary" type="submit">{username ? "Conectar otra cuenta de Instagram" : "Conectar Instagram profesional"}</button>
      <p><small>Solo consultamos el identificador y el nombre de usuario. No accedemos a tus mensajes ni publicamos contenido. Conecta Instagram antes de completar el formulario.</small></p>
    </form> : <p>La conexión con Instagram todavía no está disponible. Puedes enviar tu solicitud con los otros métodos.</p>}
  </section>;
}
