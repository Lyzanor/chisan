"use client";

import { SignOutButton } from "@clerk/nextjs";
import { SignOutIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export function AccountSignOutButton({
  className = "account-signout-btn",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button" className={className}>
        <SignOutIcon size={16} aria-hidden="true" />
        <span>{children ?? "Cerrar sesión"}</span>
      </button>
    </SignOutButton>
  );
}
