import {
  buildApplicationProducerHref,
  type ApplicationProducerNavigationContext,
  type ApplicationProducerNavigationTarget,
} from "@/lib/catalog-navigation";

export function buildAccountProducerHrefForPolicy(
  producer: ApplicationProducerNavigationTarget,
  context: ApplicationProducerNavigationContext,
): string {
  return buildApplicationProducerHref(producer, context);
}
