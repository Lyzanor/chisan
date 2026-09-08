import { isDemoProducer } from "@/lib/catalog/product-commerce";
import { formatProducerFieldLabel } from "@/lib/i18n/producer-fields";
import { premiumValueLabel } from "@/lib/i18n/producer-premium";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

// Parent renders this only after the exact producer's premium entitlement check.
export function ProducerCommercialDetails({ fields, locale, messages, country, producerId }: {
  fields: Readonly<Record<string, string>>; locale: Locale; messages: Messages; country: string; producerId: number;
}) {
  const label = (key: string) => formatProducerFieldLabel(key, locale, messages);
  const professional = ["sí", "bajo consulta"].includes(fields.venta_profesionales);
  const contact = fields.correo ? `mailto:${fields.correo}?subject=${encodeURIComponent(premiumValueLabel("subject", locale))}` : fields.telefono ? `tel:${fields.telefono}` : null;
  const keys = ["visita_cita_previa", "venta_profesionales", "pedido_minimo", "condiciones_envio"];
  if (!fields.certificaciones && !keys.some(key => fields[key])) return null;
  return <div className="detail-expanded-profile__stories">
    {fields.certificaciones ? <section className="detail-expanded-profile__message">
      <h3>{label("certificaciones")}</h3>
      {isDemoProducer(country, producerId) ? <strong>{premiumValueLabel("demo", locale)}</strong> : null}
      <ul>{fields.certificaciones.split("|").map(token => <li key={token}>{premiumValueLabel(token, locale)}</li>)}</ul>
      <p>{fields.certificaciones_detalle}</p>
    </section> : null}
    {keys.filter(key => fields[key]).map(key => <section key={key} className="detail-expanded-profile__message">
      <h3>{label(key)}</h3><p>{premiumValueLabel(fields[key], locale)}</p>
      {key === "venta_profesionales" && professional && contact ? <a className="account-button account-button--secondary" href={contact}>{premiumValueLabel("contact", locale)}</a> : null}
    </section>)}
  </div>;
}
