import {
  ArrowUpRightIcon,
  ArrowsClockwiseIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  ShoppingCartSimpleIcon,
  StorefrontIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";

import { ProducerProductCards } from "@/components/producer-content";
import { ProducerProductInvitation } from "./producer-product-invitation";
import type { ProducerContent } from "@/lib/catalog/content-schema";
import type { SALES_CHANNEL_VALUES } from "@/lib/catalog/producer-schema";
import type { ProducerStoreLink } from "@/lib/catalog/store-link";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
import { getProducerActionLabels } from "@/lib/i18n/producer-action-labels";
import { formatProducerFieldValue } from "@/lib/i18n/producer-fields";

const SALES_CHANNEL_ICONS = {
  ecommerce: ShoppingCartSimpleIcon,
  marketplace: StorefrontIcon,
  email: EnvelopeSimpleIcon,
  telefono: PhoneIcon,
  whatsapp: WhatsappLogoIcon,
  suscripcion: ArrowsClockwiseIcon,
} satisfies Record<(typeof SALES_CHANNEL_VALUES)[number], typeof PhoneIcon>;

function salesChannelIcon(channel: string) {
  return Object.hasOwn(SALES_CHANNEL_ICONS, channel)
    ? SALES_CHANNEL_ICONS[channel as keyof typeof SALES_CHANNEL_ICONS]
    : null;
}

export function ProducerProducts({ featuredProducts, messages, content, locale, country, producerId, premiumActive }: {
  featuredProducts: string[];
  messages: Messages;
  content: ProducerContent | null;
  locale: Locale;
  country: string;
  producerId: number;
  premiumActive: boolean;
}) {
  return (
    <section id="producer-content-products" className="detail-products" aria-labelledby="detail-products-title">
      <div className="chisan-section-heading">
        <h2 id="detail-products-title">{messages.fieldLabels.featuredProducts}</h2>
        <ProducerProductInvitation country={country} producerId={producerId} locale={locale} premiumActive={premiumActive} />
      </div>
      {featuredProducts.length ? <ul className="detail-product-list">
        {featuredProducts.map((product, index) => <li key={`${index}-${product}`}>{product}</li>)}
      </ul> : null}
      {content?.products.length ? <ProducerProductCards content={content} locale={locale} /> : null}
    </section>
  );
}

export function ProducerSales({ locale, messages, onlineSales, salesChannels, storeLink }: {
  locale: Locale;
  messages: Messages;
  onlineSales?: string;
  salesChannels: string[];
  storeLink: ProducerStoreLink | null;
}) {
  const showChannels = salesChannels.length > 1;
  if (!showChannels && !storeLink) return null;
  const buyLabel = getProducerActionLabels(locale).buyOnline;

  return (
    <section className="detail-sales" aria-label={messages.fieldLabels.salesChannels}>
      {showChannels ? <div className="detail-sales__heading">
        <h2 id="detail-sales-title">{messages.fieldLabels.salesChannels}</h2>
        {onlineSales && onlineSales !== "sí" ? (
          <span className="detail-purchase__status">
            {messages.fieldLabels.onlineSales}: {formatProducerFieldValue("Venta online", onlineSales, locale, messages)}
          </span>
        ) : null}
      </div> : null}
      {storeLink ? (
        <a className="detail-sales__shop" href={storeLink.href} target="_blank" rel="noopener noreferrer external">
          <ShoppingCartSimpleIcon size={24} aria-hidden="true" />
          <span><strong>{buyLabel}</strong><small>{new URL(storeLink.href).hostname.replace(/^www\./, "")}</small></span>
          <ArrowUpRightIcon size={22} aria-hidden="true" />
        </a>
      ) : null}
      {showChannels ? (
        <ul className="detail-purchase__channels">
          {salesChannels.map((channel) => {
            const Icon = salesChannelIcon(channel);
            return <li key={channel}>
              <span>
                {Icon ? <Icon size={18} aria-hidden="true" /> : null}
                {formatProducerFieldValue("Canal de venta", channel, locale, messages)}
              </span>
            </li>;
          })}
        </ul>
      ) : null}
    </section>
  );
}
