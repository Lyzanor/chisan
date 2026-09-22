import {
  ArrowUpRightIcon,
  ArrowsClockwiseIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  ShoppingCartSimpleIcon,
  StorefrontIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";

import type { SALES_CHANNEL_VALUES } from "@/lib/catalog/producer-schema";
import type { ProducerStoreLink } from "@/lib/catalog/store-link";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";
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

export type ProducerProductsProps = {
  featuredProducts: string[];
  locale: Locale;
  messages: Messages;
  onlineSales?: string;
  salesChannels: string[];
  storeLink: ProducerStoreLink | null;
};

export function ProducerProducts({
  featuredProducts,
  locale,
  messages,
  onlineSales,
  salesChannels,
  storeLink,
}: ProducerProductsProps) {
  if (
    featuredProducts.length === 0 &&
    onlineSales !== "sí" &&
    salesChannels.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="detail-products"
      aria-labelledby="detail-products-title"
    >
      <h2 id="detail-products-title">
        {featuredProducts.length > 0
          ? messages.fieldLabels.featuredProducts
          : messages.fieldLabels.salesChannels}
      </h2>
      {featuredProducts.length > 0 ? (
        <ul className="detail-product-list">
          {featuredProducts.map((product, index) => (
            <li key={`${index}-${product}`}>{product}</li>
          ))}
        </ul>
      ) : null}
      {salesChannels.length > 0 || onlineSales ? (
        <div className="detail-purchase">
          {featuredProducts.length > 0 && salesChannels.length > 0 ? (
            <span className="detail-purchase__label">
              {messages.fieldLabels.salesChannels}
            </span>
          ) : null}
          {salesChannels.length > 0 || onlineSales === "sí" ? (
            <ul className="detail-purchase__channels">
              {salesChannels.length > 0 ? (
                salesChannels.map((channel) => {
                  const ChannelIcon = salesChannelIcon(channel);
                  const channelLabel = formatProducerFieldValue(
                    "Canal de venta",
                    channel,
                    locale,
                    messages,
                  );
                  // The storefront channel is the purchase link itself.
                  return (
                    <li key={channel}>
                      {storeLink?.channel === channel ? (
                        <a href={storeLink.href} target="_blank" rel="noreferrer">
                          {ChannelIcon ? (
                            <ChannelIcon size={18} aria-hidden="true" />
                          ) : null}
                          {channelLabel}
                          <ArrowUpRightIcon size={14} aria-hidden="true" />
                        </a>
                      ) : (
                        <span>
                          {ChannelIcon ? (
                            <ChannelIcon size={18} aria-hidden="true" />
                          ) : null}
                          {channelLabel}
                        </span>
                      )}
                    </li>
                  );
                })
              ) : (
                <li>
                  <span>{messages.fieldLabels.onlineSales}</span>
                </li>
              )}
            </ul>
          ) : null}
          {onlineSales && onlineSales !== "sí" ? (
            <span className="detail-purchase__status">
              {messages.fieldLabels.onlineSales}:{" "}
              {formatProducerFieldValue(
                "Venta online",
                onlineSales,
                locale,
                messages,
              )}
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
