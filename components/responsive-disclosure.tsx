"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ResponsiveDisclosure({
  summary,
  children,
  className,
  compactWidth = 700,
}: {
  summary: ReactNode;
  children: ReactNode;
  className: string;
  compactWidth?: number;
}) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const compact = window.matchMedia(`(max-width: ${compactWidth}px)`);
    const matchLayout = () => {
      if (details.current) details.current.open = !compact.matches;
    };
    matchLayout();
    compact.addEventListener("change", matchLayout);
    return () => compact.removeEventListener("change", matchLayout);
  }, [compactWidth]);

  return (
    <details ref={details} className={className} open>
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}
