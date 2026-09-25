import Link from "next/link";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";

export default async function ShelfQueuePage() {
  const reviewer = await requireStaffAccount();
  if (!selectionShelfEnabled()) return <div className="admin-content"><h2>Images and event proposals</h2><p>This capability is disabled in this environment.</p></div>;
  const rows = await selectionShelfService().queue(reviewer.id);
  return (
    <div className="admin-content">
      <header className="admin-page-heading">
        <div>
          <h2>Image and event review</h2>
          <p>New photos are analyzed automatically. Resolve unclear labels or failed analysis and prepare proposals for their owners to publish. Oldest 50 pending photos appear first.</p>
        </div>
      </header>
      <p><Link className="chisan-button" href="/cuenta/estanteria">Create my own selection from an image</Link></p>
      {rows.length ? (
        <ul>
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/estanterias/${row.id}`}>{row.name || row.handle || "Account selection"}</Link> · {row.status} · {row.channel} · {row.createdAt.toISOString().slice(0, 10)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No photos awaiting review.</p>
      )}
    </div>
  );
}
