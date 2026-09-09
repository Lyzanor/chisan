import { BusinessTermsSummary } from "@/components/b2b/terms";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getBusinessService } from "@/lib/b2b/runtime";
import { BusinessError } from "@/lib/b2b/service";
import { B2B_ROOT, isB2BEnabled, supplierKey } from "@/lib/b2b/policy";
import { TermsForm } from "@/components/b2b/forms";
export default async function SupplierPage({
  params,
}: {
  params: Promise<{ country: string; producerId: string }>;
}) {
  if (!isB2BEnabled()) notFound();
  const p = await params;
  const key = { country: p.country, producerId: Number(p.producerId) };
  if (!supplierKey.safeParse(key).success) notFound();
  const account = await requireCurrentAccount(
    `${B2B_ROOT}/productores/${p.country}/${p.producerId}`,
  );
  const result = await getBusinessService()
    .supplier(account.id, key)
    .catch((e) => {
      if (e instanceof BusinessError) notFound();
      throw e;
    });
  return (
    <div className="account-content">
      <Link href={B2B_ROOT}>Canal profesional</Link>
      <h2>{result.producer.name}: condiciones privadas</h2>
      <p>
        La capacidad es orientativa. Guardar estos datos no los publica ni los
        envía. El pedido mínimo de venta a particulares se edita por separado en
        la ficha.
      </p>
      {!result.canEdit ? (
        <p>Necesitas premium activo para actualizar y compartir condiciones.</p>
      ) : null}
      {!result.producer.products.length ? (
        <p>Añade primero productos al perfil mediante el editor habitual.</p>
      ) : (
        result.producer.products.map((product) => {
          const saved = result.terms.find((t) => t.productId === product.id);
          return (
            <details className="account-callout" key={product.id}>
              <summary>{product.name}</summary>
              {saved ? (
                <p>
                  Última actualización:{" "}
                  {saved.updatedAt.toLocaleString("es-ES", {
                    timeZone: "Europe/Madrid",
                  })}
                </p>
              ) : null}
              {result.canEdit ? (
                <TermsForm
                  key={saved?.version ?? 0}
                  {...key}
                  productId={product.id}
                  version={saved?.version ?? 0}
                  initial={saved?.terms}
                />
              ) : saved ? (
                <BusinessTermsSummary value={saved.terms} />
              ) : (
                <p>Sin condiciones guardadas.</p>
              )}
            </details>
          );
        })
      )}
    </div>
  );
}
