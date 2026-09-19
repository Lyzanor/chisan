import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";
import { ShelfReview } from "@/components/selection-shelf/shelf-review";

export default async function ShelfReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const reviewer = await requireStaffAccount();
  const { id } = await params;
  if (!selectionShelfEnabled() || !z.uuid().safeParse(id).success) notFound();
  const detail = await selectionShelfService().reviewDetail(reviewer.id, id);
  return <div className="admin-content"><Link href="/admin/estanterias">Back to shelf photos</Link><h2>Review shelf photo</h2><ShelfReview key={`${detail.id}:${detail.version}`} detail={detail} /></div>;
}
