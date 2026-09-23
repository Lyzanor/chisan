import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentAccount, hasProducerOwnerAccess } from "@/lib/accounts/auth";
import { ACCOUNT_ROUTES, isAccountSystemConfigured } from "@/lib/accounts/config";
import { getActiveUserProfilePremiumEntitlement } from "@/lib/accounts/profile-qr-entitlements";
import { hasPublicProducerPremiumAccess } from "@/lib/catalog/public-expanded";
import { producerProPath, USER_PRO_PATH } from "@/lib/accounts/pro-paths";
import { findProducerById, findPublishedCountry } from "@/lib/csv-catalog";
import { B2B_ROOT, isB2BEnabled } from "@/lib/b2b/policy";
import { SITE_CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Chisan Pro", description: "Un acceso Pro para tu selección y otro para tu trabajo como productor. Empieza con una cuenta gratuita." };
export const dynamic = "force-dynamic";

export default async function ProPage({ searchParams }: { searchParams: Promise<{ perfil?: string; country?: string; producerId?: string }> }) {
  const query = await searchParams;
  const producerIntent = query.perfil === "productor";
  const country = query.country ?? "";
  const producerId = Number(query.producerId);
  const producer = producerIntent && findPublishedCountry(country) && Number.isSafeInteger(producerId) && producerId > 0
    ? await findProducerById(country, producerId) : null;
  const returnTo = producer ? producerProPath(country, producerId) : producerIntent ? "/pro?perfil=productor" : USER_PRO_PATH;
  const accountsAvailable = isAccountSystemConfigured();
  const b2bAvailable = accountsAvailable && isB2BEnabled();
  const account = accountsAvailable ? await getCurrentAccount() : null;
  const activeAccount = account?.status === "active" ? account : null;
  const [userPro, owner, producerPro] = await Promise.all([
    activeAccount ? getActiveUserProfilePremiumEntitlement(activeAccount.id) : null,
    activeAccount && producer ? hasProducerOwnerAccess(activeAccount.id, country, producerId) : false,
    producer ? hasPublicProducerPremiumAccess(country, producerId) : false,
  ]);
  const registration = `${ACCOUNT_ROUTES.signUp}?redirect_url=${encodeURIComponent(`/cuenta/bienvenida?siguiente=${encodeURIComponent(returnTo)}`)}`;
  const accountReady = Boolean(activeAccount?.termsAcceptedAt);
  const setup = !activeAccount ? registration : `/cuenta/bienvenida?siguiente=${encodeURIComponent(returnTo)}`;
  const claim = producer ? `/cuenta/reclamaciones/nueva?country=${country}&producerId=${producerId}` : "/cuenta/reclamaciones/nueva";
  const consult = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent(`Consultar ${producerIntent ? "Productor" : "Usuario"} Pro${producer ? ` · ${producer.name}` : ""}`)}`;

  return <main className="page-shell pro-page">
    <header>
      <p className="chisan-eyebrow">Empieza gratis · Amplía cuando lo necesites</p>
      <h1>{producerIntent ? "Productor Pro" : "Usuario Pro"}</h1>
      <p className="pro-page__intro">{producerIntent ? "Da más detalle a lo que produces: fotos de producto, formatos, enlaces de compra y un QR para compartir tu ficha." : "Conecta tu negocio con sus productores: comparte tu selección con un QR y consulta suministro en un espacio privado."}</p>
    </header>
    <nav className="pro-page__actions" aria-label="Tipo de acceso Pro">
      <Link className={`chisan-button${!producerIntent ? " chisan-button--primary" : ""}`} href={USER_PRO_PATH}>Usuario Pro</Link>
      <Link className={`chisan-button${producerIntent ? " chisan-button--primary" : ""}`} href="/pro?perfil=productor">Productor Pro</Link>
    </nav>
    <section className="chisan-panel chisan-panel--tint" aria-labelledby="pro-steps">
      <h2 id="pro-steps">{producer ? `Para ${producer.name}` : "Cómo empezar"}</h2>
      <ol className="pro-page__steps">
        <li><strong>Crea tu cuenta gratuita</strong><p>Sigue productores y prepara tu selección. El contacto público sigue disponible para todo el mundo.</p></li>
        <li><strong>{producerIntent ? "Verifica tu vinculación con la ficha" : "Prepara tu perfil y tu selección"}</strong><p>{producerIntent ? "La verificación y las mejoras de los datos básicos y fotos son gratuitas. Revisamos tu vinculación antes de darte acceso." : "Elige qué productores compartir. Los datos de tu negocio para consultas B2B son privados."}</p></li>
        <li><strong>{producerIntent ? "Activa Productor Pro" : "Activa Usuario Pro"}</strong><p>Consulta las condiciones con Chisan. Te confirmaremos las funciones disponibles, el precio y la duración antes de activar el acceso.</p></li>
      </ol>
      <div className="pro-page__actions">
        {!accountsAvailable ? <a className="chisan-button chisan-button--primary" href={consult}>Consultar {producerIntent ? "Productor" : "Usuario"} Pro</a> : !accountReady ? <Link className="chisan-button chisan-button--primary" href={setup}>{activeAccount ? "Completar mi cuenta" : "Crear cuenta gratis"}</Link>
          : producerIntent ? <Link className="chisan-button chisan-button--primary" href={owner && producer ? `/cuenta/productores/${country}/${producerId}/${producerPro ? "editar#producer-change-products" : "ampliar"}` : claim}>{owner ? producerPro ? "Añadir productos" : "Ampliar mi ficha" : "Verificar mi ficha gratis"}</Link>
          : userPro ? <Link className="chisan-button chisan-button--primary" href={b2bAvailable ? B2B_ROOT : "/cuenta/seleccion"}>{b2bAvailable ? "Abrir canal profesional" : "Abrir mi selección"}</Link>
          : <a className="chisan-button chisan-button--primary" href={consult}>Solicitar Usuario Pro</a>}
        {accountsAvailable ? <a className="chisan-link" href={consult}>Consultar condiciones de Pro</a> : null}
      </div>
      {!accountsAvailable ? <p className="pro-page__note">El acceso a cuentas estará habilitado a partir del 1 de octubre.</p> : null}
      <p className="pro-page__note">{userPro && !producerIntent ? "Usuario Pro activo." : "La cuenta gratuita no activa Pro ni inicia ningún cobro."} Cada acceso se activa por separado.</p>
    </section>
    <section aria-labelledby="pro-b2b">
      <h2 id="pro-b2b">Cómo funcionan las solicitudes B2B</h2>
      <p>Con Usuario Pro y tus datos de negocio puedes consultar cantidades, formatos y entregas a productores con Productor Pro que acepten consultas. El productor responde en el buzón privado; podéis compartir condiciones y continuar la conversación.</p>
      <p>Una consulta no confirma un pedido, no reserva existencias y no cobra la compra. Acordáis el suministro directamente. Si termina Pro, puedes seguir leyendo el historial.</p>
      {!b2bAvailable ? <p className="pro-page__note">El canal B2B está en preparación. Puedes consultar las condiciones de Pro y contactar directamente con los productores desde sus fichas.</p> : null}
    </section>
  </main>;
}
