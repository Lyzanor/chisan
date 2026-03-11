"use client";

import React from "react";
import { Browser } from "@capacitor/browser";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check just-in-time if running natively
    const isNativeApp =
      typeof window !== "undefined" &&
      !!(window as unknown as { Capacitor?: { isNative?: boolean } }).Capacitor?.isNative;

    if (isNativeApp) {
      e.preventDefault();
      try {
        await Browser.open({ url: href, presentationStyle: "popover" });
      } catch (err) {
        console.error("Failed to open external link cleanly:", err);
        window.open(href, "_blank");
      }
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
