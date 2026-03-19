"use client";

import React from "react";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (Capacitor.isNativePlatform()) {
      e.preventDefault();
      try {
        await Browser.open({ url: href, presentationStyle: "popover" });
      } catch {
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
