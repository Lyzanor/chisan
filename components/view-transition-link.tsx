"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

type ViewTransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  scroll?: boolean;
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function ViewTransitionLink({
  href,
  className,
  children,
  scroll,
}: ViewTransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainLeftClick(event)) {
      return;
    }

    event.preventDefault();

    const nextDocument = document as ViewTransitionDocument;
    const navigate = () => router.push(href, { scroll });

    if (nextDocument.startViewTransition) {
      try {
        nextDocument.startViewTransition(navigate);
      } catch {
        navigate();
      }
      return;
    }

    navigate();
  }

  return (
    <Link href={href} className={className} onClick={handleClick} scroll={scroll}>
      {children}
    </Link>
  );
}
