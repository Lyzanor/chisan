import { aiProviderLabel } from "@/lib/ai/runtime";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { canManageSelectionShelf } from "@/lib/selection-shelf/access";
import { selectionShelfEnabled, ShelfError } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";
import { ShelfUpload } from "@/components/selection-shelf/shelf-upload";
import { ShelfWhatsAppLink } from "@/components/selection-shelf/shelf-whatsapp-link";

export const metadata = { title: "Foto de mi estantería", robots: { index: false, follow: false } };
export default async function ShelfAccountPage() {
  const account = await requireCurrentAccount("/cuenta/estanteria");
  if (!selectionShelfEnabled()) notFound();
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");
  const service = selectionShelfService();
  const [allowed, records, candidates] = await Promise.all([
    canManageSelectionShelf(getDatabase(), account.id), service.ownerStatus(account.id), service.candidates(account.id).catch((error) => { if (error instanceof ShelfError && error.code === "selection") return []; throw error; }),
  ]);
  return <div className="account-content">
    <Link href="/cuenta/seleccion">Volver a mi selección</Link>
    <header className="account-section-heading"><div><h2>Tu estantería, conectada con su origen</h2><p>Envía una foto. Chisan identificará los productos de tu selección y revisará los puntos para mostrarlos junto al mapa.</p></div></header>
    {!candidates.length ? <p><Link href="/cuenta/siguiendo">Elige qué productores compartir</Link> antes de enviar la foto (entre 1 y 200). Los favoritos privados no se utilizan.</p> : null}
    {!account.publicHandle || account.publicProfileVisibility === "private" ? <p>Tu selección es privada. Puedes enviar la foto, pero para publicarla necesitas <Link href="/cuenta/perfil">activar un identificador y la visibilidad Pública o Sin listar</Link>.</p> : null}
    <ShelfUpload aiProviderName={aiProviderLabel()} allowed={allowed && candidates.length > 0} records={records.map((record) => ({ id: record.id, status: record.status, date: record.createdAt.toISOString().slice(0, 10) }))} />
    {allowed ? <ShelfWhatsAppLink /> : null}
    <p>Si envías otra foto, la anterior seguirá publicada hasta que revisemos la nueva. Puedes retirarla en cualquier momento.</p>
  </div>;
}
