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
] as const;

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="admin-navigation" aria-label="Operations workspace">
      {ADMIN_NAVIGATION.map((item) => {
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
