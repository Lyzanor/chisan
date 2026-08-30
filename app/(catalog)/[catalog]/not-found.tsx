import { NotFoundContent } from "@/app/_components/not-found-content";
import { loadNotFoundPresentation } from "@/lib/not-found-presentation.server";

export default async function CatalogNotFoundPage() {
  const { backHref, messages } = await loadNotFoundPresentation();

  return <NotFoundContent backHref={backHref} messages={messages} />;
}
