import { NotFoundContent } from "@/app/_components/not-found-content";
import { loadMessages } from "@/lib/i18n/messages";

export default async function CatalogNotFoundPage() {
  // Next renders this boundary while producing the static fallback tree for
  // catalog pages. Keep it free of request-bound APIs so an on-demand static
  // page never changes rendering modes at runtime.
  // The proxy sends ordinary invalid public URLs to the localized global 404.
  const messages = await loadMessages("es");

  return <NotFoundContent backHref="/" messages={messages} />;
}
