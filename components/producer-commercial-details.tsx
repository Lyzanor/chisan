import type React from "react";
import { isB2BEnabled, B2B_ROOT } from "@/lib/b2b/policy";
import { isDemoProducer } from "@/lib/catalog/product-commerce";
import { formatProducerFieldLabel } from "@/lib/i18n/producer-fields";
import { premiumValueLabel } from "@/lib/i18n/producer-premium";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

// Renders reviewed commercial and certification facts from the CSV.
export function ProducerCommercialDetails({
  fields,
  locale,
  messages,
  country,
  producerId,
  children,
}: {
  fields: Readonly<Record<string, string>>;
  locale: Locale;
  messages: Messages;
  country: string;
  producerId: number;
  children?: React.ReactNode;
}) {
  const label = (key: string) => formatProducerFieldLabel(key, locale, messages);
  const professional = ["sí", "bajo consulta"].includes(fields.venta_profesionales);
  const contact = isB2BEnabled()
    ? `${B2B_ROOT}/consultar/${country}/${producerId}`
    : fields.correo
      ? `mailto:${fields.correo}?subject=${encodeURIComponent(premiumValueLabel("subject", locale))}`
      : fields.telefono
        ? `tel:${fields.telefono}`
        : null;
  const keys = ["visita_cita_previa", "venta_profesionales", "pedido_minimo", "condiciones_envio"];
  const hasCommercial = Boolean(fields.certificaciones || keys.some((key) => fields[key]));

  if (!hasCommercial && !children) return null;

  return (
    <div className="detail-expanded-profile__stories">
      {children}
      {fields.certificaciones ? (
        <section className="detail-expanded-profile__message">
          <h3>{label("certificaciones")}</h3>
          {isDemoProducer(country, producerId) ? <strong>{premiumValueLabel("demo", locale)}</strong> : null}
          <ul>
            {fields.certificaciones
              .split("|")
              .map((token) => <li key={token}>{premiumValueLabel(token, locale)}</li>)}
          </ul>
          {fields.certificaciones_detalle ? <p>{fields.certificaciones_detalle}</p> : null}
        </section>
      ) : null}
      {keys
        .filter((key) => fields[key])
        .map((key) => (
          <section key={key} className="detail-expanded-profile__message">
            <h3>{label(key)}</h3>
            <p>{premiumValueLabel(fields[key], locale)}</p>
            {key === "venta_profesionales" && professional && contact ? (
              <a className="account-button account-button--secondary" href={contact}>
                {premiumValueLabel("contact", locale)}
              </a>
            ) : null}
          </section>
        ))}
    </div>
  );
}
