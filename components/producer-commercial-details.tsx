import { ArrowUpRightIcon, BriefcaseIcon, SealCheckIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { isB2BEnabled, B2B_ROOT } from "@/lib/b2b/policy";
import { isAccountSystemConfigured } from "@/lib/accounts/config";
import { isDemoProducer } from "@/lib/catalog/product-commerce";
import { formatProducerFieldLabel, formatProducerFieldValue } from "@/lib/i18n/producer-fields";
import { premiumValueLabel } from "@/lib/i18n/producer-premium";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

const b2bWords = {
  es: { title: "Venta a profesionales", help: "¿Compras para un negocio? Crea tu perfil profesional para consultar a este productor y aprovechar las solicitudes B2B.", direct: "¿Compras para un negocio? Consulta directamente disponibilidad y condiciones con este productor.", account: "Crear perfil profesional", sources: "Consultar fuentes públicas del perfil" },
  ca: { title: "Venda a professionals", help: "Compres per a un negoci? Crea el teu perfil professional per consultar aquest productor i aprofitar les sol·licituds B2B.", direct: "Compres per a un negoci? Consulta directament la disponibilitat i les condicions amb aquest productor.", account: "Crear perfil professional", sources: "Consultar fonts públiques del perfil" },
  en: { title: "Professional sales", help: "Buying for a business? Create a professional profile to contact this producer and use B2B enquiries.", direct: "Buying for a business? Ask this producer directly about availability and terms.", account: "Create a professional profile", sources: "View public profile sources" },
};

/** Reviewed CSV facts; contact keeps the existing B2B feature gate. */
export function ProducerCommercialDetails({
  fields,
  guidedVisits,
  locale,
  messages,
  country,
  producerId,
  hasSources,
}: {
  fields: Readonly<Record<string, string>>;
  guidedVisits?: string;
  locale: Locale;
  messages: Messages;
  country: string;
  producerId: number;
  hasSources?: boolean;
}) {
  const label = (key: string) => formatProducerFieldLabel(key, locale, messages);
  const words = locale === "es" ? b2bWords.es : locale === "ca" ? b2bWords.ca : b2bWords.en;
  const professional = ["sí", "bajo consulta"].includes(fields.venta_profesionales);
  const b2bAvailable = isB2BEnabled() && isAccountSystemConfigured();
  const contact = b2bAvailable
    ? `${B2B_ROOT}/consultar/${country}/${producerId}`
    : fields.correo
      ? `mailto:${fields.correo}?subject=${encodeURIComponent(premiumValueLabel("subject", locale))}`
      : fields.telefono
        ? `tel:${fields.telefono}`
        : null;
  const quickFacts = [
    ["visitas guiadas", guidedVisits],
    ["visita_cita_previa", fields.visita_cita_previa],
    ["pedido_minimo", fields.pedido_minimo],
    ["condiciones_envio", fields.condiciones_envio],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  if (!quickFacts.length && !fields.certificaciones && !fields.venta_profesionales) return null;

  return (
    <div className="detail-commercial">
      {quickFacts.length ? (
        <section className="detail-quick-facts" aria-label={locale === "es" ? "Información práctica" : locale === "ca" ? "Informació pràctica" : "Practical information"}>
          <dl>
            {quickFacts.map(([key, value]) => (
              <div key={key}>
                <dt>{label(key)}</dt>
                <dd>{formatProducerFieldValue(key, value, locale, messages)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {fields.certificaciones ? (
        <section className="detail-certifications" aria-labelledby="detail-certifications-title">
          <h2 id="detail-certifications-title"><SealCheckIcon size={23} aria-hidden="true" />{label("certificaciones")}</h2>
          {isDemoProducer(country, producerId) ? <strong>{premiumValueLabel("demo", locale)}</strong> : null}
          <ul>
            {fields.certificaciones.split("|").map((token) => (
              <li key={token}>{premiumValueLabel(token, locale)}</li>
            ))}
          </ul>
          {fields.certificaciones_detalle ? <p>{fields.certificaciones_detalle}</p> : null}
          {hasSources && !isDemoProducer(country, producerId) ? <a href="#detail-info">{words.sources}</a> : null}
        </section>
      ) : null}
      {fields.venta_profesionales ? (
        <section className="detail-b2b" aria-labelledby="detail-b2b-title">
          <BriefcaseIcon size={32} aria-hidden="true" />
          <div>
            <h2 id="detail-b2b-title">{words.title}</h2>
            <p className="detail-b2b__availability">{premiumValueLabel(fields.venta_profesionales, locale)}</p>
            {professional ? <p>{b2bAvailable ? words.help : words.direct}</p> : null}
          </div>
          {professional ? (
            <div className="detail-b2b__actions">
              {contact ? <a href={contact} className="detail-b2b__contact">{premiumValueLabel("contact", locale)}<ArrowUpRightIcon size={18} aria-hidden="true" /></a> : null}
              {b2bAvailable ? <Link href={B2B_ROOT} prefetch={false}>{words.account}</Link> : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
