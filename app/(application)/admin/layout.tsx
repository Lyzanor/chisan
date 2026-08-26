import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { hasStaffAccess, requireStaffAccount } from "@/lib/accounts/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const reviewer = await requireStaffAccount();
  const canManagePayments = await hasStaffAccess(reviewer.id, ["admin"]);

  return (
    <AdminShell
      operatorName={reviewer.displayName || "Authorized operator"}
      canManagePayments={canManagePayments}
    >
      {children}
    </AdminShell>
  );
}
