"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export function AndroidBackHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: { remove: () => void } | null = null;

    const setupListener = async () => {
      // Use Capacitor's hardware back button listener
      listener = await CapacitorApp.addListener("backButton", () => {
        if (pathname === "/") {
          // If we are on the home page, quit the app
          CapacitorApp.exitApp();
        } else {
          // If we are inside a producer detail page, use Next.js routing to pop history
          router.back();
        }
      });
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [pathname, router]);

  return null;
}
