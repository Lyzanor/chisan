import { count, inArray } from "drizzle-orm";
import Link from "next/link";

import { requireStaffAccount } from "@/lib/accounts/auth";
import { getDatabase } from "@/lib/db";
import { producerChangeRequests, producerClaims } from "@/lib/db/schema";

export default async function AdminPage() {
  await requireStaffAccount();

  const database = getDatabase();
  const [[claimCount], [changeCount]] = await Promise.all([
    database
      .select({ value: count() })
      .from(producerClaims)
      .where(inArray(producerClaims.status, ["pending", "needs_info"])),
    database
      .select({ value: count() })
      .from(producerChangeRequests)
      .where(inArray(producerChangeRequests.status, ["submitted", "needs_changes"])),
  ]);

  return (
    <div className="account-content">
      <h2>Review queue</h2>
      <div className="account-stat-grid">
        <Link href="/admin/reclamaciones" className="account-stat-card">
          <strong>{claimCount.value}</strong>
          <span>Ownership claims</span>
          <small>Identity and ownership must be checked out of band.</small>
        </Link>
        <Link href="/admin/cambios" className="account-stat-card">
          <strong>{changeCount.value}</strong>
          <span>Profile changes</span>
          <small>Approved proposals still require CSV materialization and validation.</small>
        </Link>
      </div>
    </div>
  );
}
