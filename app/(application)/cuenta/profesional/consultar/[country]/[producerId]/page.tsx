import { randomUUID } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { businessSupplierCatalog, getBusinessService } from "@/lib/b2b/runtime";
import { B2B_ROOT, isB2BEnabled } from "@/lib/b2b/policy";
import { RequestForm } from "@/components/b2b/forms";
export default async function RequestPage({
  params,
}: {
  params: Promise<{ country: string; producerId: string }>;
}) {
  if (!isB2BEnabled()) notFound();
  const p = await params;
  const key = { country: p.country, producerId: Number(p.producerId) };
  if (
    !/^[a-z]{2}$/.test(key.country) ||
    !Number.isSafeInteger(key.producerId) ||
    key.producerId < 1
  )
    notFound();
  const account = await requireCurrentAccount(
    `${B2B_ROOT}/consultar/${p.country}/${p.producerId}`,
  );
  const producer = await businessSupplierCatalog(key);
  if (!producer?.acceptsEnquiries) notFound();
  const profile = await getBusinessService().profile(account.id);
  return (
    <div className="account-content">
      <h2>Consulta profesional a {producer.name}</h2>
      <p>
        Para suministro a negocios. Si buscas comprar para ti, utiliza el
        contacto de la <Link href={producer.href}>ficha pública</Link>.
      </p>
      {!profile?.enabled ? (
        <p>
          <Link href={B2B_ROOT}>Completa y activa tus datos profesionales</Link>{" "}
          antes de enviar la consulta.
        </p>
      ) : producer.products.length ? (
        <RequestForm
          submissionId={randomUUID()}
          {...key}
          products={producer.products}
        />
      ) : (
        <p>
          Este proveedor todavía no tiene productos disponibles para consultas
          profesionales.
        </p>
      )}
    </div>
  );
}
