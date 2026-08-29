"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

import {
  isPublicAnalyticsPath,
  sanitizePublicAnalyticsUrl,
} from "@/lib/public-analytics";

export function ChisanAnalytics() {
  const pathname = usePathname();

  if (!isPublicAnalyticsPath(pathname)) {
    return null;
  }

  return (
    <Analytics
      mode="production"
      beforeSend={(event) => {
        const url = sanitizePublicAnalyticsUrl(event.url);
        return url ? { ...event, url } : null;
      }}
    />
  );
}
