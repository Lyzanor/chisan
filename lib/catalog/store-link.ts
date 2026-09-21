import { STOREFRONT_SALES_CHANNEL_VALUES } from "./producer-schema";

export type ProducerStoreLink = Readonly<{ channel: string; href: string }>;

/**
 * The sales channel shown as the purchase link and where it leads. A reviewed
 * `url_tienda` opens from the first storefront channel; until one is recorded,
 * the online shop channel keeps linking to the official website.
 */
export function resolveProducerStoreLink({
  onlineSales,
  salesChannels,
  storeUrl,
  website,
}: Readonly<{
  onlineSales: string;
  salesChannels: readonly string[];
  storeUrl: string;
  website: string;
}>): ProducerStoreLink | null {
  if (onlineSales !== "sí") return null;
  if (storeUrl) {
    const channel = STOREFRONT_SALES_CHANNEL_VALUES.find((candidate) =>
      salesChannels.includes(candidate),
    );
    return channel ? { channel, href: storeUrl } : null;
  }
  return website && salesChannels.includes("ecommerce")
    ? { channel: "ecommerce", href: website }
    : null;
}
