"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

function NavigationFeedback({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className="navigation-link__content" data-pending={pending || undefined}>
      {children}
      <span className="navigation-link__progress" aria-hidden="true" />
    </span>
  );
}

/** Keep native Link navigation, prefetch, modified clicks and history intact. */
export function NavigationLink({
  children,
  activePath,
  ...props
}: ComponentProps<typeof Link> & { activePath?: string }) {
  const pathname = usePathname();
  const active = activePath !== undefined && pathname === activePath;
  return (
    <Link {...props} aria-current={active ? "page" : props["aria-current"]}>
      <NavigationFeedback>{children}</NavigationFeedback>
    </Link>
  );
}
