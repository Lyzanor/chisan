"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  findModelContext,
  registerCatalogTools,
  type CatalogToolDefinition,
  type ModelContext,
} from "@/lib/agents/webmcp";

export function CatalogAgentTools({
  tools,
}: {
  tools: readonly CatalogToolDefinition[];
}) {
  const pathname = usePathname();
  const publicPage =
    pathname === "/" ||
    pathname === "/how-we-work" ||
    /^\/(?:[a-z]{2}|[a-z]{2,3}-[a-z]{2})(?:\/[^/.]+){0,2}\/?$/.test(pathname);
  useEffect(() => {
    if (!publicPage) return;
    const context = findModelContext(
      document as Document & { modelContext?: ModelContext },
      navigator as Navigator & { modelContext?: ModelContext },
    );
    if (context) return registerCatalogTools(context, tools);
  }, [publicPage, tools]);
  return null;
}
