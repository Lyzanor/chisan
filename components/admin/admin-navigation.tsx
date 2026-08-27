"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAVIGATION = [
  {
    href: "/admin",
    label: "Operations overview",
    description: "Queues and system state",
    exact: true,
  },
  {
    href: "/admin/cambios",
    label: "Producer changes",
    description: "Requests, decisions and CSV delivery",
  },
  {
    href: "/admin/reclamaciones",
    label: "Ownership claims",
    description: "Identity and control review",
  },
  {
    href: "/admin/perfiles",
    label: "User profiles",
    description: "Visibility and shared selections",
  },
  {
    href: "/admin/premium",
    label: "Expanded profiles",
    description: "Access registry and administrative gifts",
    adminOnly: true,
  },
  {
    href: "/admin/pagos",
    label: "Profile payments",
    description: "Adapter incidents and reconciliation",
    adminOnly: true,
  },
] as const;

export function AdminNavigation({ canManagePayments }: { canManagePayments: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="admin-navigation" aria-label="Operations workspace">
      {ADMIN_NAVIGATION.filter(
        (item) => !("adminOnly" in item && item.adminOnly) || canManagePayments,
      ).map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="admin-navigation__item"
            aria-current={active ? "page" : undefined}
          >
            <span>{item.label}</span>
            <small>{item.description}</small>
          </Link>
        );
      })}
    </nav>
  );
}
