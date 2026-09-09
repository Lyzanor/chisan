import "server-only";
import { getDatabase } from "../db";
import { findProducerById, findPublishedCountry } from "../csv-catalog";
import { loadProducerContent } from "../catalog/content";
import { createBusinessService } from "./service";
import { isB2BEnabled } from "./policy";
export async function businessSupplierCatalog(key: {
  country: string;
  producerId: number;
}) {
  if (!findPublishedCountry(key.country)) return null;
  const producer = await findProducerById(key.country, key.producerId);
  if (!producer) return null;
  const content = await loadProducerContent(key.country, key.producerId);
  return {
    name: producer.name,
    href: `/${key.country}/${producer.area}/${producer.slug}`,
    acceptsEnquiries: ["sí", "bajo consulta"].includes(
      producer.fields.venta_profesionales,
    ),
    products: content.products.map(({ id, name, format }) => ({
      id,
      name,
      format,
    })),
  };
}
export const getBusinessService = () =>
  createBusinessService({
    database: getDatabase(),
    catalog: businessSupplierCatalog,
    enabled: isB2BEnabled,
  });
