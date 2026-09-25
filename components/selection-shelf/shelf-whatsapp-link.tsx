import { aiProviderLabel } from "@/lib/ai/runtime";
import { and, eq, gt, sql } from "drizzle-orm";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { selectionShelfWhatsAppLinks } from "@/lib/db/schema";
import { whatsappEnabled } from "@/lib/whatsapp/config";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { ShelfWhatsAppForm } from "./shelf-whatsapp-form";
import { unlinkWhatsApp } from "@/app/(application)/cuenta/whatsapp/actions";

export async function ShelfWhatsAppLink() {
  if (!selectionShelfEnabled()) return null;
  if (!whatsappEnabled()) return <section className="account-callout"><h3>También por WhatsApp</h3><p>La recepción por WhatsApp está pendiente de conexión. Puedes enviar la foto desde esta página.</p></section>;
  const account = await requireCurrentAccount();
  const [link] = await getDatabase().select({ sender: selectionShelfWhatsAppLinks.sender, expiresAt: selectionShelfWhatsAppLinks.expiresAt })
    .from(selectionShelfWhatsAppLinks).where(and(eq(selectionShelfWhatsAppLinks.userId, account.id), gt(selectionShelfWhatsAppLinks.expiresAt, sql`now()`))).limit(1);
  return <section className="account-callout"><h3>Envía la foto por WhatsApp</h3>
    {link?.sender ? <>
      <p>Tu número terminado en {link.sender.slice(-4)} está vinculado a tus selecciones. Cuéntanos qué quieres mostrar y envía una imagen al chat de Chisan; después podrás revisar y publicar el resultado.</p>
      <form action={unlinkWhatsApp}><button className="chisan-button">Desconectar WhatsApp</button></form>
    </> : <ShelfWhatsAppForm aiProviderName={aiProviderLabel()} />}
  </section>;
}
