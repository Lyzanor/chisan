"use client";

import type { ReactNode } from "react";
import { NavigationLink } from "@/components/navigation-link";

type ViewTransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  scroll?: boolean;
};

export function ViewTransitionLink({
  href,
  className,
  children,
  scroll,
}: ViewTransitionLinkProps) {
  return (
    <NavigationLink href={href} className={className} scroll={scroll}>
      {children}
    </NavigationLink>
  );
}
