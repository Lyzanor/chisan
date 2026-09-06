import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";

import styles from "./privacy.module.css";

const title = "Privacidad y publicidad";
const description =
  "Cómo trata Chisan la privacidad, las cookies, los datos de cuenta y la publicidad programática temporal.";
const canonicalUrl = new URL("/privacy", SITE_ORIGIN).toString();

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: canonicalUrl,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article} aria-labelledby="privacy-title">
        <p className="catalog-kicker">{SITE_NAME}</p>
        <h1 id="privacy-title">Privacidad y publicidad</h1>
        <p className={styles.updated}>Última actualización: 6 de septiembre de 2026</p>
        <p>
          Este aviso explica qué información tratan Chisan y sus proveedores cuando
          consultas el catálogo, utilizas una cuenta o visitas una página que puede mostrar publicidad.
        </p>
        <h2>Consulta del catálogo</h2>
        <p>
          Puedes consultar el catálogo público sin crear una cuenta. Chisan no envía
          la ubicación de tu dispositivo a sus servidores. Si solicitas al navegador
          que utilice tu ubicación, esta se procesa únicamente en tu dispositivo para
          sugerir una zona del catálogo.
        </p>
        <p>
          La web pública se presenta actualmente en español. La cookie opcional
          <code>chisan_locale</code> puede conservar una elección de idioma anterior,
          pero no cambia el idioma público actual. La infraestructura esencial también
          puede tratar direcciones IP e información de solicitudes, dispositivos y seguridad
          en los registros habituales del servidor para ofrecer y proteger la web.
        </p>
        <h2>Medición de visitas respetuosa con la privacidad</h2>
        <p>
          Chisan utiliza Vercel Web Analytics en páginas públicas para conocer las visitas
          agregadas y mejorar el catálogo. Esta medición no utiliza cookies de analítica.
          Chisan elimina los parámetros de consulta antes de enviar una visita y no carga
          Analytics en las rutas de acceso, registro, cuenta, administración o API.
          Puedes consultar la <a href="https://vercel.com/docs/analytics/privacy-policy">
            documentación de privacidad de Web Analytics
          </a>.
        </p>
        <p>
          Chisan también registra visitas diarias agregadas a los perfiles públicos de
          productores en su propia base de datos. Cada nueva apertura cuenta como otra
          visita; esta medición no identifica personas únicas ni guarda direcciones IP,
          identificadores del navegador, páginas de procedencia o identificadores de cuenta.
          No añade cookies ni almacenamiento en el navegador. Un identificador aleatorio
          por apertura evita entregas duplicadas; los registros de entrega anteriores a
          ayer se eliminan en la siguiente recogida o consulta de estadísticas. Los totales
          diarios se conservan como historial del productor. Solo el titular verificado
          del productor con acceso premium activo puede consultar estas cifras. Se excluyen
          las visitas del equipo del productor con sesión iniciada, el tráfico automatizado
          reconocido y las precargas. La recogida respeta Do Not Track y Global Privacy Control.
        </p>
        <h2>Cuentas y aportaciones</h2>
        <p>
          Cuando las funciones de cuenta están habilitadas, Clerk gestiona la autenticación.
          Chisan guarda el perfil de cuenta, los favoritos, las solicitudes de propiedad y
          las propuestas de cambios necesarias para prestar estas funciones y conservar
          un historial de auditoría. Si creas un mapa público de productores, el perfil
          también guarda la zona del catálogo y el municipio que eliges. Solo se publican
          los productores que seleccionas expresamente. El catálogo público en CSV se
          mantiene separado de los datos de cuenta.
        </p>
        <h2>Publicidad programática</h2>
        <p>
          Chisan puede utilizar temporalmente Google AdSense en determinadas páginas públicas
          de provincias. No se muestra publicidad programática en la portada, los perfiles
          de productores, las páginas de cuenta o administración, las páginas de error ni
          este aviso. La publicidad nunca determina la inclusión, verificación, orden o
          descripción de un productor en el catálogo.
        </p>
        <p>
          Si la publicidad está activa, Google y sus socios publicitarios autorizados pueden
          utilizar cookies, direcciones IP, identificadores de dispositivo y tecnologías
          similares para ofrecer, medir y proteger los anuncios. Cuando es necesario,
          Chisan solicita tus preferencias mediante la plataforma de consentimiento
          certificada de Google antes de estos usos. Sin consentimiento, Google puede
          mostrar únicamente anuncios limitados o no mostrar anuncios.
        </p>
        <ul>
          <li>
            Consulta cómo utiliza Google la información de las webs que emplean sus servicios
            en su <a href="https://policies.google.com/technologies/partner-sites">
              aviso sobre sitios asociados
            </a>.
          </li>
          <li>
            Revisa o cambia la personalización publicitaria en la <a href="https://adssettings.google.com/">
              configuración de anuncios de Google
            </a>.
          </li>
          <li>
            Puedes volver a abrir las opciones de privacidad del mensaje de consentimiento
            de Google en cualquier página de Chisan donde la publicidad esté habilitada.
          </li>
        </ul>
        <h2>Tus opciones y solicitudes</h2>
        <p>
          Puedes eliminar la cookie de idioma desde el navegador, rechazar los fines
          publicitarios opcionales o consultar sobre el acceso, rectificación o eliminación
          de los datos de cuenta cuando corresponda. Utiliza la <Link href="/contact">
            página de contacto de Chisan
          </Link> para elegir el canal adecuado y no envíes información personal sensible
          a través de las redes sociales.
        </p>
        <h2>Cambios</h2>
        <p>
          Chisan actualizará este aviso cuando cambien sustancialmente sus proveedores o
          los usos de los datos. La fecha anterior identifica la versión publicada.
        </p>
      </article>
    </main>
  );
}
