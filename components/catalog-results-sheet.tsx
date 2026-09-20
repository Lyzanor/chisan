"use client";

import { useEffect, useId, useRef, type ReactNode, type Ref } from "react";

export function CatalogResultsSheet({ children, open, onOpenChange, label, closeLabel, title, viewerRef }: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  closeLabel: string;
  title: string;
  viewerRef?: Ref<HTMLElement>;
}) {
  const handleRef = useRef<HTMLButtonElement>(null);
  const startY = useRef<number | null>(null);
  const dragged = useRef(false);
  const bodyId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.target instanceof Element && event.target.closest(".site-header")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onOpenChange(false);
      handleRef.current?.focus();
    };
    document.addEventListener("keydown", close, true);
    return () => document.removeEventListener("keydown", close, true);
  }, [open, onOpenChange]);

  return (
    <aside ref={viewerRef} className={`catalog-viewer catalog-results-sheet${open ? " is-open" : ""}`} aria-label={title}>
      <button
        ref={handleRef}
        type="button"
        className="catalog-results-sheet__handle"
        aria-expanded={open}
        aria-controls={bodyId}
        aria-label={open ? closeLabel : label}
        onPointerDown={(event) => {
          startY.current = event.clientY;
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (startY.current === null || Math.abs(event.clientY - startY.current) < 24) return;
          dragged.current = true;
          onOpenChange(event.clientY < startY.current);
        }}
        onPointerUp={() => { startY.current = null; }}
        onPointerCancel={() => { startY.current = null; dragged.current = false; }}
        onClick={() => {
          if (!dragged.current) onOpenChange(!open);
          dragged.current = false;
        }}
      >
        <span className="catalog-results-sheet__grip" aria-hidden="true" />
        {!open ? <span className="catalog-results-sheet__label">{label}</span> : null}
      </button>
      <div className="catalog-viewer-body" id={bodyId} role="region" aria-label={title}>
        {children}
      </div>
    </aside>
  );
}
