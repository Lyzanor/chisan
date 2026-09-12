"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Keeps the follow action to one icon beside the producer name. Pointer hover
 * and keyboard focus unfold its label; a touch screen unfolds it on the first
 * tap and acts on the next, so the action is never taken unseen.
 */
export function ProducerFollowControl({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    function collapseFromOutside(event: PointerEvent) {
      if (!controlRef.current?.contains(event.target as Node)) setExpanded(false);
    }

    const timer = window.setTimeout(() => setExpanded(false), 4000);
    document.addEventListener("pointerdown", collapseFromOutside);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", collapseFromOutside);
    };
  }, [expanded]);

  function unfoldBeforeTouchAction(event: MouseEvent<HTMLDivElement>) {
    if (expanded || !window.matchMedia("(hover: none)").matches) return;
    event.preventDefault();
    event.stopPropagation();
    setExpanded(true);
  }

  return (
    <div
      ref={controlRef}
      className="detail-follow-control"
      data-expanded={expanded || undefined}
      onClickCapture={unfoldBeforeTouchAction}
    >
      {children}
    </div>
  );
}
