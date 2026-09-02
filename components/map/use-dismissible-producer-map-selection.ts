"use client";

import { useEffect, type RefObject } from "react";

export function useDismissibleProducerMapSelection({
  active,
  selectedSurfaceRef,
  relatedSurfaceRef,
  returnFocusRef,
  suspendEscape = false,
  onDismiss,
}: {
  active: boolean;
  selectedSurfaceRef: RefObject<HTMLElement | null>;
  relatedSurfaceRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  suspendEscape?: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!active) return;

    function dismissFromOutside(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (selectedSurfaceRef.current?.contains(target)) return;
      if (relatedSurfaceRef?.current?.contains(target)) return;
      if (
        target.closest(
          ".producer-map-category-marker, .producer-map-hit-area",
        )
      ) {
        return;
      }
      onDismiss();
    }

    function dismissFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape" && !suspendEscape) {
        onDismiss();
        window.requestAnimationFrame(() => returnFocusRef?.current?.focus());
      }
    }

    document.addEventListener("pointerdown", dismissFromOutside);
    document.addEventListener("keydown", dismissFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", dismissFromOutside);
      document.removeEventListener("keydown", dismissFromKeyboard);
    };
  }, [
    active,
    onDismiss,
    relatedSurfaceRef,
    returnFocusRef,
    selectedSurfaceRef,
    suspendEscape,
  ]);
}
