import Link from "next/link";

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { SITE_NAME } from "@/lib/site";

export function AdminShell({
  operatorName,
  isAdmin,
  children,
}: {
  operatorName: string;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="admin-page" lang="en">
      <section className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/admin" className="admin-sidebar__brand">
            <span>{SITE_NAME}</span>
            <small>Internal operations</small>
          </Link>
          <AdminNavigation isAdmin={isAdmin} />
          <div className="admin-sidebar__operator">
            <span>Signed in as</span>
            <strong>{operatorName}</strong>
            <Link href="/cuenta">Open my account</Link>
          </div>
        </aside>
        <div className="admin-workspace">
          <header className="admin-workspace__header">
            <div>
              <p className="catalog-kicker">Controlled workspace</p>
              <h1>Operations</h1>
            </div>
            <div className="admin-workspace__identity">
              <span>Staff access</span>
              <strong>{operatorName}</strong>
            </div>
          </header>
          <div className="admin-workspace__content">{children}</div>
        </div>
      </section>
    </main>
  );
}
