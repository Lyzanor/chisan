import Link from "next/link";
import { and, eq, isNull, lte } from "drizzle-orm";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { producerMemberships } from "@/lib/db/schema";
import { findProducerById } from "@/lib/csv-catalog";
import { getBusinessService } from "@/lib/b2b/runtime";
import { B2B_ROOT, isB2BEnabled } from "@/lib/b2b/policy";
import { ProfileForm } from "@/components/b2b/forms";
export default async function ProfessionalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const account = await requireCurrentAccount(B2B_ROOT);
  if (!isB2BEnabled())
    return (
      <div className="account-content">
        <h2>Canal profesional</h2>
        <p>El canal profesional está pendiente de activación.</p>
      </div>
    );
  const page = Math.max(
    0,
    Math.min(200, Number((await searchParams).page) || 0),
  );
  const service = getBusinessService();
  const [profile, inbox, memberships] = await Promise.all([
    service.profile(account.id),
    service.inbox(account.id, page * 50),
    getDatabase()
      .select()
      .from(producerMemberships)
      .where(
        and(
          eq(producerMemberships.userId, account.id),
          eq(producerMemberships.status, "active"),
          isNull(producerMemberships.revokedAt),
          lte(producerMemberships.grantedAt, new Date()),
        ),
      ),
  ]);
  const producers = await Promise.all(
    memberships.map(async (m) => ({
      ...m,
      producer: await findProducerById(m.country, m.producerId),
    })),
  );
  const enquiries = await Promise.all(
    inbox.items.map(async (item) => ({
      ...item,
      supplierName:
        (await findProducerById(item.country, item.producerId))?.name ??
        `${item.country}:${item.producerId}`,
    })),
  );
  return (
    <div className="account-content">
      <h2>Canal profesional</h2>
      <p>
        Consultas de suministro para restaurantes, hostelería y tiendas. El
        contacto para compras particulares sigue disponible en la ficha pública.
      </p>
      <section>
        <h3>Tu negocio</h3>
        <ProfileForm initial={profile} />
      </section>
      {producers.length ? (
        <section>
          <h3>Como proveedor</h3>
          <p>
            Las condiciones guardadas aquí son privadas. Tú decides qué
            compartir en cada consulta.
          </p>
          <ul>
            {producers
              .filter((p) => p.producer)
              .map((p) => (
                <li key={p.id}>
                  <Link
                    href={`${B2B_ROOT}/productores/${p.country}/${p.producerId}`}
                  >
                    {p.producer!.name}: condiciones por producto
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
      <section>
        <h3>Consultas enviadas y recibidas</h3>
        {!inbox.items.length ? (
          <p>
            Todavía no hay consultas. Puedes iniciar una desde «Contacto
            profesional» en un productor que ofrezca este canal.
          </p>
        ) : (
          <ul>
            {enquiries.map((item) => (
              <li key={item.id}>
                <Link href={`${B2B_ROOT}/consultas/${item.id}`}>
                  {item.requesterId === account.id
                    ? `Enviada a ${item.supplierName}`
                    : `Recibida de ${item.business.businessName} para ${item.supplierName}`}{" "}
                  · {item.products.map((p) => p.name).join(", ")} ·{" "}
                  {item.status === "open" ? "Abierta" : "Cerrada"}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {page > 0 ? (
          <Link href={`${B2B_ROOT}?page=${page - 1}`}>Anteriores</Link>
        ) : null}
        {inbox.more ? (
          <Link href={`${B2B_ROOT}?page=${page + 1}`}>Siguientes</Link>
        ) : null}
      </section>
    </div>
  );
}
