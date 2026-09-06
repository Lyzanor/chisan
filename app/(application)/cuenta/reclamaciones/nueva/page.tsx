import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { submitProducerClaimAction } from "@/app/(application)/cuenta/actions";
import { AccountMessage, type AccountMessageParams } from "@/components/account/account-message";
import { buildAccountProducerHref } from "@/lib/accounts/catalog-links";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { findProducerById } from "@/lib/csv-catalog";
import { getDatabase } from "@/lib/db";
import { producerMemberships } from "@/lib/db/schema";
import { readApplicationLocalePreference } from "@/lib/i18n/application-presentation.server";

export const metadata: Metadata = {
  title: "Reclamar un productor",
  robots: { index: false, follow: false },
};

type NewClaimPageProps = {
  searchParams: Promise<
    AccountMessageParams & {
      country?: string | string[];
      producerId?: string | string[];
    }
  >;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function NewClaimPage({ searchParams }: NewClaimPageProps) {
  const [account, params, explicitLocale] = await Promise.all([
    requireCurrentAccount("/cuenta/reclamaciones/nueva"),
    searchParams,
    readApplicationLocalePreference(),
  ]);
  if (!account.termsAcceptedAt) redirect("/cuenta/bienvenida");

  const country = first(params.country).trim().toLowerCase();
  const producerId = Number(first(params.producerId));
  const validProducerKey =
    /^[a-z]{2}$/.test(country) && Number.isSafeInteger(producerId) && producerId > 0;
  const [producer, ownerRows] = await Promise.all([
    validProducerKey ? findProducerById(country, producerId) : Promise.resolve(null),
    validProducerKey
      ? getDatabase()
          .select({ userId: producerMemberships.userId })
          .from(producerMemberships)
          .where(
            and(
              eq(producerMemberships.country, country),
              eq(producerMemberships.producerId, producerId),
              eq(producerMemberships.role, "owner"),
              eq(producerMemberships.status, "active"),
            ),
          )
          .limit(1)
      : Promise.resolve([]),
  ]);
  const activeOwner = ownerRows[0];

  if (!producer) {
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        <h2>Elige primero un productor</h2>
        <p>Las solicitudes de propiedad se inician desde un perfil público de productor existente.</p>
        <Link href="/" className="account-button">
          Explorar productores
        </Link>
      </div>
    );
  }

  if (activeOwner) {
    const currentAccountOwnsProducer = activeOwner.userId === account.id;
    return (
      <div className="account-content account-content--narrow">
        <AccountMessage params={params} />
        <section>
          <p className="catalog-kicker">Titularidad verificada</p>
          <h2>
            {currentAccountOwnsProducer
              ? `Ya gestionas ${producer.name}`
              : `${producer.name} ya tiene un titular verificado`}
          </h2>
          <p>
            {currentAccountOwnsProducer
              ? "Utiliza tu área de productor para gestionar este perfil."
              : "Un productor con un titular confirmado activo no se puede volver a reclamar."}
          </p>
          <div className="account-inline-actions">
            <Link
              href={buildAccountProducerHref(producer, explicitLocale)}
              className="account-button account-button--secondary"
            >
              Perfil público
            </Link>
            {currentAccountOwnsProducer ? (
              <Link href="/cuenta/reclamaciones" className="account-button">
                Productores que gestionas
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="account-content account-content--narrow">
      <AccountMessage params={params} />
      <header className="account-section-heading">
        <div>
          <p className="catalog-kicker">Solicitud de propiedad</p>
          <h2>{producer.name}</h2>
          <p>
            {producer.city} · {producer.area}
          </p>
        </div>
        <Link
          href={buildAccountProducerHref(producer, explicitLocale)}
          className="account-button account-button--secondary"
        >
          Perfil público
        </Link>
      </header>

      <div className="account-callout">
        <strong>La titularidad nunca se concede automáticamente.</strong>
        <p>
          El equipo revisará la solicitud con la identidad y los datos de contacto públicos. No envíes documentos de identidad en este primer formulario; solo se solicitarán por un canal privado si son necesarios.
        </p>
      </div>

      <form action={submitProducerClaimAction} className="account-form">
        <input type="hidden" name="country" value={producer.country} />
        <input type="hidden" name="producerId" value={producer.producerId} />
        <label className="account-field">
          <span>Método de verificación preferido</span>
          <select name="method" required defaultValue="business_email">
            <option value="business_email">Correo oficial del negocio</option>
            <option value="website">Web del productor</option>
            <option value="phone">Teléfono público del negocio</option>
            <option value="document">Documento privado del negocio (se solicitará después)</option>
            <option value="other">Otro</option>
          </select>
        </label>
        <label className="account-field">
          <span>Correo de contacto del negocio</span>
          <input
            type="email"
            name="contactEmail"
            maxLength={254}
            defaultValue={account.email ?? ""}
            autoComplete="email"
          />
          <small>Utiliza una dirección vinculada al productor siempre que sea posible.</small>
        </label>
        <label className="account-field">
          <span>¿Cómo podemos verificar tu relación con el productor?</span>
          <textarea
            name="proof"
            required
            minLength={20}
            maxLength={4_000}
            rows={7}
            placeholder="Explica tu función e indica datos de contacto públicos o una forma segura de verificarla."
          />
        </label>
        <button type="submit" className="account-button">
          Enviar solicitud para revisión
        </button>
      </form>
    </div>
  );
}
