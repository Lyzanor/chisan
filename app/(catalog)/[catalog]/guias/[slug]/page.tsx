import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/guide-article";
import {
  listPublishedGuides,
  loadGuide,
  resolveGuidesScope,
} from "@/lib/guides/catalog";
import { buildGuideMetadata } from "@/lib/guides/metadata";

export const dynamicParams = false;

// Articles exist only inside the catalog scope that publishes the library, so
// an unpublished locale or country never resolves a guide slug.
export function generateStaticParams() {
  const scope = resolveGuidesScope();
  if (!scope) return [];
  const catalog = scope.pathPrefix.slice(1);
  return listPublishedGuides().map(({ slug }) => ({ catalog, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = listPublishedGuides().find((entry) => entry.slug === slug);
  if (!guide) notFound();
  return buildGuideMetadata(guide);
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await loadGuide(slug);
  if (!page) notFound();
  const related = listPublishedGuides().filter((guide) =>
    page.guide.related.includes(guide.slug),
  );
  return <GuideArticle {...page} related={related} />;
}
