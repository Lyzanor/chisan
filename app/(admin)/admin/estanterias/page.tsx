import Link from "next/link";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";

export default async function ShelfQueuePage() {
  const reviewer = await requireStaffAccount();
  if (!selectionShelfEnabled()) return <div className="admin-content"><h2>Shelf photos</h2><p>This capability is disabled in this environment.</p></div>;
  const rows = await selectionShelfService().queue(reviewer.id);
  return <div className="admin-content">
    <header className="admin-page-heading"><div><h2>Shelf photo review</h2><p>Check label evidence, producer matches and point positions before publication. Oldest 50 pending photos appear first.</p></div></header>
    {rows.length ? <ul>{rows.map((row) => <li key={row.id}><Link href={`/admin/estanterias/${row.id}`}>{row.name || row.handle || "Account selection"}</Link> · {row.status} · {row.channel} · {row.createdAt.toISOString().slice(0, 10)}</li>)}</ul> : <p>No photos awaiting review.</p>}
  </div>;
}
