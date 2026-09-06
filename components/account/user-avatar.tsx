"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./user-avatar.module.css";

export function UserAvatar({
  name,
  src,
  size = 40,
}: {
  name: string;
  src: string | null;
  size?: 32 | 40 | 64;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => Array.from(part)[0])
      .join("")
      .toLocaleUpperCase() || "C";
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {src && src !== failedSrc ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          unoptimized
          onError={() => setFailedSrc(src)}
        />
      ) : (
        initials
      )}
    </span>
  );
}
