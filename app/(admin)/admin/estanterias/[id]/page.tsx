import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";
import { ShelfReview } from "@/components/selection-shelf/shelf-review";

export default async function ShelfReviewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> }) {
  const reviewer = await requireStaffAccount();
  const { id } = await params;
  if (!selectionShelfEnabled() || !z.uuid().safeParse(id).success) notFound();
  const query = (await searchParams).q?.slice(0, 100) ?? "";
  const detail = await selectionShelfService().reviewDetail(reviewer.id, id, query);
  return <div className="admin-content"><Link href="/admin/estanterias">Back to shelf photos</Link><h2>Review shelf photo</h2><ShelfReview key={`${detail.id}:${detail.version}`} detail={detail} /><details><summary>Catalog search for optional corrections</summary><form className="account-form"><label>Search approved producers<input name="q" maxLength={100} defaultValue={query} /></label><button className="account-button">Search catalog</button><p>Save any manual corrections before searching. Up to 50 matches appear in the producer selector.</p></form></details></div>;
}
