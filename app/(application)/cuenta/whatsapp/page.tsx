import { aiProviderLabel } from "@/lib/ai/runtime";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { producerMemberships, whatsappLinks } from "@/lib/db/schema";
import { findProducerById } from "@/lib/csv-catalog";
import { whatsappEnabled } from "@/lib/whatsapp/config";
import { WhatsAppLinkForm } from "@/components/account/whatsapp-link-form";
import { unlinkWhatsApp } from "./actions";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";

export default async function WhatsAppPage() {
  const account = await requireCurrentAccount("/cuenta/whatsapp");
  const enabled = whatsappEnabled();
  const database = getDatabase();
  // A disabled deployment also works before the new migration is installed.
  const memberships = enabled
    ? await database
        .select()
        .from(producerMemberships)
        .where(
          and(
            eq(producerMemberships.userId, account.id),
            eq(producerMemberships.country, "es"),
            eq(producerMemberships.status, "active"),
          ),
        )
    : [];
  const [link] = enabled
    ? await database
        .select()
        .from(whatsappLinks)
        .where(eq(whatsappLinks.userId, account.id))
        .limit(1)
    : [];
  const producers = (
    await Promise.all(
      memberships.map(async (membership) => {
        const producer = await findProducerById("es", membership.producerId);
        return producer
          ? {
              id: membership.producerId,
              name: producer.fields.nombre || String(membership.producerId),
            }
          : null;
      }),
    )
  ).filter((item) => item !== null);
  return (
    <div className="account-content">
      {selectionShelfEnabled() ? <section className="account-callout"><h2>De una imagen a un mapa</h2><p>Para conectar una foto con el mapa de tu selección, <Link href="/cuenta/estanteria">vincula WhatsApp a tus selecciones</Link>. Puedes enviar una estantería, plano o programa con una indicación. Chisan prepara la propuesta y tú revisas los productores antes de publicar. Puedes elegir entre este modo y el asistente de productos de abajo.</p></section> : null}
      <section className="account-callout">
        <h2>Tu asistente por WhatsApp</h2>
        <p>
          Cuéntanos una novedad, qué producto habéis creado o envía una foto de su etiqueta.
          El asistente prepara los datos y solo pregunta lo que falta. La
          propuesta llega automáticamente a Chisan para revisarla antes de
          publicarla.
        </p>
        <p>
          Por ejemplo: «Tenemos una nueva cerveza, cuesta 8 euros y sale
          mañana».
        </p>
      </section>
      <section>
        <h3>Qué puedes hacer en este piloto</h3>
        <ul>
          <li>
            Proponer una novedad para vuestra ficha, como «en octubre tendremos
            más cerveza rubia», y corregirla antes de que se apruebe.
          </li>
          <li>
            Preparar un producto nuevo: nombre, descripción, formato, precio en
            euros y enlace de compra.
          </li>
          <li>
            Leer datos visibles en fotos JPEG o PNG de hasta 5 MB. La foto no se
            publica.
          </li>
          <li>
            Indicar un lanzamiento previsto, que queda como nota para revisión
            editorial.
          </li>
          <li>
            Corregir los datos, preguntar cómo va o descartar una propuesta
            pendiente, hablando con normalidad.
          </li>
        </ul>
        <p>
          Necesitas permiso para gestionar el productor y acceso al perfil
          ampliado. Para editar productos existentes, utiliza el editor de
          Chisan.
        </p>
      </section>
      {enabled ? (
        <section>
          <h3>Vincular tu número</h3>
          {link?.sender ? (
            <div>
              <p>
                Número vinculado terminado en {link.sender.slice(-4)}. La
                vinculación dura 30 días. Generar otro enlace sustituye la
                vinculación actual y descarta la conversación pendiente.
              </p>
              <form action={unlinkWhatsApp}>
                <button className="chisan-button">
                  Desconectar WhatsApp
                </button>
              </form>
            </div>
          ) : null}
          <WhatsAppLinkForm aiProviderName={aiProviderLabel()} producers={producers} />
        </section>
      ) : (
        <section className="account-callout">
          <h3>Piloto pendiente de conexión</h3>
          <p>
            Estamos preparando el número de WhatsApp de Chisan. Todavía no se
            pueden enviar mensajes al asistente.
          </p>
          <Link
            href="/cuenta/reclamaciones"
            className="chisan-button"
          >
            Ver productores que gestionas
          </Link>
        </section>
      )}
      <p>
        La conversación es privada. El texto y las fotos se procesan con IA para
        extraer los datos; Chisan revisa las propuestas antes de publicarlas.
        Los mensajes de entrada se eliminan tras procesarlos y los registros de
        entrega se conservan hasta 7 días. Los datos de la conversación caducan
        con la vinculación; las propuestas enviadas conservan el historial de
        revisión.
      </p>
      <Link href="/cuenta/cambios">Ver mis propuestas</Link>
    </div>
  );
}
