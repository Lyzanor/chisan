import Link from "next/link";
import { requireCurrentAccount } from "@/lib/accounts/auth";
import { communityService } from "@/lib/community/runtime";
import { COMMUNITY_PATH } from "@/lib/community/policy";

export default async function CommunityPage() {
  const account = await requireCurrentAccount(COMMUNITY_PATH);
  const producers = await communityService().workspace(account.id);
  return (
    <div className="account-content">
      <header className="account-section-heading">
        <div>
          <h2>Mensajes a tus seguidores</h2>
          <p>
            Cuenta qué ocurre en tu proyecto desde el editor de tu productor.
          </p>
        </div>
      </header>
      <section className="account-callout">
        <h3>Una novedad empieza en tu perfil</h3>
        <p>
          Con premium puedes escribir un mensaje a la comunidad, presentar
          productos o actualizar tu historia. Guarda el borrador y envíalo a
          revisión. La novedad llegará a tus seguidores cuando el cambio
          revisado esté publicado en el catálogo.
        </p>
        <Link href="/cuenta/cambios">Consultar el estado de mis cambios</Link>
      </section>
      {producers.length ? (
        <ul className="account-record-list">
          {producers.map((producer) => (
            <li key={`${producer.country}:${producer.producerId}`}>
              <div>
                <strong>{producer.name}</strong>
                <p>{producer.city}</p>
              </div>
              <Link
                className="account-button"
                href={`/cuenta/productores/${producer.country}/${producer.producerId}/editar`}
              >
                Editar y enviar una novedad
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="account-empty">
          Cuando tengas acceso a un productor podrás gestionar sus mensajes
          desde aquí.
        </p>
      )}
    </div>
  );
}
