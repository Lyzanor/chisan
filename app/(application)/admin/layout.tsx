import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireStaffAccount } from "@/lib/accounts/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const reviewer = await requireStaffAccount();

  return (
    <AdminShell operatorName={reviewer.displayName || "Authorized operator"}>
      {children}
    </AdminShell>
  );
}
