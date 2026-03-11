"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";

type CatalogBottomSheetProps = {
  summary: string;
  children: ReactNode;
};

type SheetState = "peek" | "half" | "full";

const SHEET_RATIOS: Record<SheetState, number> = {
  peek: 0.68,
  half: 0.4,
  full: 0.06,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getStateOffset(state: SheetState, height: number): number {
  return height * SHEET_RATIOS[state];
}

function getDragOffset(
  clientY: number,
  dragState: {
    startY: number;
    startOffset: number;
    minOffset: number;
    maxOffset: number;
  },
): number {
  return clamp(
    dragState.startOffset + (clientY - dragState.startY),
    dragState.minOffset,
    dragState.maxOffset,
  );
}

function getNearestState(offset: number, height: number): SheetState {
  let nearest: SheetState = "peek";
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const state of ["peek", "half", "full"] as const) {
    const distance = Math.abs(offset - getStateOffset(state, height));
    if (distance < nearestDistance) {
      nearest = state;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function CatalogBottomSheet({ summary, children }: CatalogBottomSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startY: number;
    startOffset: number;
    minOffset: number;
    maxOffset: number;
    height: number;
  } | null>(null);
  const [sheetState, setSheetState] = useState<SheetState>("half");
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    const sheet = sheetRef.current;
    if (!sheet) {
      return;
    }

    const height = sheet.getBoundingClientRect().height;
    const startOffset = dragOffset ?? getStateOffset(sheetState, height);

    dragStateRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startOffset,
      minOffset: getStateOffset("full", height),
      maxOffset: getStateOffset("peek", height),
      height,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    setDragOffset(getDragOffset(event.clientY, dragState));
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const finalOffset = getDragOffset(event.clientY, dragState);
    setSheetState(getNearestState(finalOffset, dragState.height));
    setDragOffset(null);
    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleToggle() {
    setDragOffset(null);

    if (sheetState === "peek") {
      setSheetState("half");
      return;
    }

    if (sheetState === "half") {
      setSheetState("full");
      return;
    }

    setSheetState("half");
  }

  const dynamicStyle = dragOffset === null
    ? undefined
    : ({ transform: `translateY(${dragOffset}px)` } satisfies CSSProperties);

  const toggleLabel =
    sheetState === "full" ? "Contraer resultados" : "Expandir resultados";

  return (
    <section
      ref={sheetRef}
      className="catalog-sheet"
      data-sheet-state={sheetState}
      style={dynamicStyle}
      aria-label="Resultados"
    >
      <div className="catalog-sheet__header">
        <button
          type="button"
          className="catalog-sheet__handle"
          aria-label="Arrastrar resultados"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <span className="catalog-sheet__grip" aria-hidden="true" />
        </button>
        <div className="catalog-sheet__summary">
          <p>{summary}</p>
          <button type="button" className="catalog-sheet__toggle" onClick={handleToggle}>
            {toggleLabel}
          </button>
        </div>
      </div>
      <div className="catalog-sheet__body">{children}</div>
    </section>
  );
}
