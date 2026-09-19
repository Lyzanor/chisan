import { aiProviderLabel } from "@/lib/ai/runtime";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { canManageSelectionShelf } from "@/lib/selection-shelf/access";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";
import { listPublishedCountries, findProducersByIds } from "@/lib/csv-catalog";
import { buildProducerSelectionItems } from "@/lib/producer-selections.server";
import { ShelfProposal } from "@/components/selection-shelf/shelf-proposal";
import { ShelfUpload } from "@/components/selection-shelf/shelf-upload";
import { ShelfWhatsAppLink } from "@/components/selection-shelf/shelf-whatsapp-link";

export const metadata = { title: "Foto de mi estantería", robots: { index: false, follow: false } };
export default async function ShelfAccountPage() {
  const account = await requireCurrentAccount("/cuenta/estanteria");
  if (!selectionShelfEnabled()) notFound();
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");
  const service = selectionShelfService();
  const [allowed, records, proposal] = await Promise.all([
    canManageSelectionShelf(getDatabase(), account.id), service.ownerStatus(account.id), service.ownerProposal(account.id),
  ]);
  const items = proposal ? buildProducerSelectionItems(await findProducersByIds(proposal.producers.map((item) => {
    const [country, id] = item.key.split(":"); return { country, producerId: Number(id) };
  })), { locale: "es", explicitLocale: null }) : [];
  const areas = listPublishedCountries().flatMap((country) => country.regions.flatMap((region) => region.areas.map((area) => ({ value: `${country.slug}/${area.slug}`, label: area.label }))));
  return <div className="account-content">
    <Link href="/cuenta/seleccion">Volver a mi selección</Link>
    <header className="account-section-heading"><div><h2>Tu estantería, conectada con su origen</h2><p>Sube una foto y prepararemos una propuesta con sus productores y productos del catálogo de Chisan. No necesitas guardar favoritos antes: comprueba el resultado, desmarca lo que no encaje y publica.</p></div></header>
    {proposal ? <ShelfProposal key={`${proposal.id}:${proposal.version}`} proposal={proposal} items={items} allowed={allowed}
      areas={areas} profile={{ publicHandle: account.publicHandle ?? `tienda-${account.id.slice(0, 8)}`, handleFixed: Boolean(account.publicHandle),
        baseLocation: account.publicProfileBaseCountry && account.publicProfileBaseArea ? `${account.publicProfileBaseCountry}/${account.publicProfileBaseArea}` : "",
        baseMunicipality: account.publicProfileBaseMunicipality ?? "", private: account.publicProfileVisibility === "private" }} /> : null}
    <ShelfUpload aiProviderName={aiProviderLabel()} allowed={allowed} records={records.map((record) => ({ id: record.id, status: record.status, date: record.createdAt.toISOString().slice(0, 10) }))} />
    {allowed ? <ShelfWhatsAppLink /> : null}
    <p>Si envías otra foto, la anterior seguirá publicada hasta que publiques la nueva. Puedes retirarla en cualquier momento.</p>
  </div>;
}
