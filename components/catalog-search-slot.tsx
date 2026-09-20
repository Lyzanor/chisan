"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const readSlot = () => document.getElementById("catalog-header-search");
const serverSlot = () => null;

/** Keep the explorer's search state beside its map, with controls in the header. */
export function CatalogSearchSlot({ children }: { children: ReactNode }) {
  const slot = useSyncExternalStore(subscribe, readSlot, serverSlot);
  return slot ? createPortal(children, slot) : <div className="catalog-search-fallback">{children}</div>;
}
