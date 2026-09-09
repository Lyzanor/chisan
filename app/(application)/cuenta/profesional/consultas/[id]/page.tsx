import { BusinessTermsSummary } from "@/components/b2b/terms";
import { randomUUID } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getBusinessService, businessSupplierCatalog } from "@/lib/b2b/runtime";
import { BusinessError } from "@/lib/b2b/service";
import { B2B_ROOT, isB2BEnabled, emptyBusinessTerms } from "@/lib/b2b/policy";
import { ReplyForm, CloseForm } from "@/components/b2b/forms";
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isB2BEnabled()) notFound();
  const { id } = await params;
  const account = await requireCurrentAccount(`${B2B_ROOT}/consultas/${id}`);
  const service = getBusinessService();
  const result = await service.read(account.id, id).catch((e) => {
    if (e instanceof BusinessError) notFound();
    throw e;
  });
  const { enquiry, side, messages, canReply } = result;
  const publicProducer = await businessSupplierCatalog(enquiry);
  const supplier =
    side === "supplier" && canReply
      ? await service
          .supplier(account.id, {
            country: enquiry.country,
            producerId: enquiry.producerId,
          })
          .catch((e) => {
            if (e instanceof BusinessError) return null;
            throw e;
          })
      : null;
  const offers = supplier?.producer.products
    .filter((p) => enquiry.products.some((r) => r.productId === p.id))
    .map((p) => ({
      productId: p.id,
      name: p.name,
      terms:
        supplier.terms.find((t) => t.productId === p.id)?.terms ??
        emptyBusinessTerms(),
    }));
  return (
    <div className="account-content">
      <Link href={B2B_ROOT}>Volver al canal profesional</Link>
      <h2>Consulta de {enquiry.business.businessName}</h2>
      <p>
        Proveedor:{" "}
        {publicProducer ? (
          <Link href={publicProducer.href}>{publicProducer.name}</Link>
        ) : (
          `${enquiry.country}:${enquiry.producerId}`
        )}
      </p>
      <p>
        {enquiry.business.activity} ·{" "}
        {enquiry.status === "open" ? "Abierta" : "Cerrada"} ·{" "}
        {enquiry.createdAt.toLocaleString("es-ES", {
          timeZone: "Europe/Madrid",
        })}
      </p>
      <p>
        Conversación privada entre el negocio solicitante y el equipo del
        proveedor. Las condiciones compartidas son orientativas y no confirman
        una reserva ni un pedido.
      </p>
      <ul>
        {enquiry.products.map((p) => (
          <li key={p.productId}>
            {p.name}: {p.quantity} {p.unit}
          </li>
        ))}
      </ul>
      <p>
        {enquiry.frequency} · Entrega: {enquiry.deliveryLocation}
      </p>
      <p style={{ whiteSpace: "pre-wrap" }}>{enquiry.message}</p>
      <section aria-label="Mensajes">
        {messages.map((m) => (
          <article className="account-callout" key={m.id}>
            <h3>
              {m.side === "supplier" ? "Proveedor" : "Negocio solicitante"}
            </h3>
            <time dateTime={m.createdAt.toISOString()}>
              {m.createdAt.toLocaleString("es-ES", {
                timeZone: "Europe/Madrid",
              })}
            </time>
            <p style={{ whiteSpace: "pre-wrap" }}>{m.body}</p>
            {m.offer ? (
              <section>
                <h4>
                  Condiciones compartidas:{" "}
                  {
                    enquiry.products.find(
                      (p) => p.productId === m.offer!.productId,
                    )?.name
                  }
                </h4>
                <BusinessTermsSummary value={m.offer.terms} />
              </section>
            ) : null}
          </article>
        ))}
      </section>
      {canReply ? (
        <ReplyForm
          submissionId={randomUUID()}
          key={messages.length}
          enquiryId={id}
          offers={offers}
        />
      ) : (
        <p>
          Esta consulta no admite nuevos mensajes. Si sigue abierta, revisa la
          activación profesional o el acceso premium.
        </p>
      )}
      {enquiry.status === "open" ? <CloseForm id={id} /> : null}
    </div>
  );
}
