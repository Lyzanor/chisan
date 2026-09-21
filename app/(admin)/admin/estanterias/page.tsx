import Link from "next/link";
import { importPilotWineShelfAction } from "@/app/(admin)/admin/actions";
import { requireStaffAccount } from "@/lib/accounts/auth";
import { selectionShelfEnabled } from "@/lib/selection-shelf/policy";
import { selectionShelfService } from "@/lib/selection-shelf/server";

export default async function ShelfQueuePage() {
  const reviewer = await requireStaffAccount();
  if (!selectionShelfEnabled()) return <div className="admin-content"><h2>Shelf photos</h2><p>This capability is disabled in this environment.</p></div>;
  const rows = await selectionShelfService().queue(reviewer.id);
  return (
    <div className="admin-content">
      <header className="admin-page-heading">
        <div>
          <h2>Shelf photo review</h2>
          <p>New photos are analyzed automatically. Resolve unclear labels or failed analysis and prepare proposals for their owners to publish. Oldest 50 pending photos appear first.</p>
        </div>
      </header>
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

      <section style={{ marginTop: "3rem", padding: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fafafa" }}>
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 600 }}>Estantería piloto de vinos</h3>
        <p style={{ margin: "0 0 1rem", fontSize: "0.95rem", color: "#4b5563" }}>
          Publica directamente los 15 puntos verificados (6 bodegas) y la foto precalibrada en el perfil público de tu usuario actual ({reviewer.displayName || reviewer.email || "admin"}) sin reanalizar con IA.
        </p>
        <form action={importPilotWineShelfAction}>
          <button
            type="submit"
            style={{
              padding: "0.6rem 1.2rem",
              background: "#15803d",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            Publicar estantería de vinos en mi perfil
          </button>
        </form>
      </section>
    </div>
  );
}

