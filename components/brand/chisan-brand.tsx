import type { CSSProperties } from "react";

import {
  CHISAN_MARK_INK_SRC,
  CHISAN_MARK_SRC,
  CHISAN_WORDMARK_INK_SRC,
  CHISAN_WORDMARK_SRC,
} from "@/lib/brand";

type BrandImageProps = Readonly<{
  alt?: string;
  className?: string;
  ink?: boolean;
  reverse?: boolean;
}>;

type BrandAssetStyle = CSSProperties & {
  "--chisan-brand-asset": string;
};

function classNames(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ");
}

export function ChisanWordmark({
  alt = "chisan",
  className,
  ink = false,
  reverse = false,
}: BrandImageProps) {
  const asset = ink ? CHISAN_WORDMARK_INK_SRC : CHISAN_WORDMARK_SRC;
  const style: BrandAssetStyle = {
    "--chisan-brand-asset": `url("${asset}")`,
  };

  return (
    <span
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={classNames(
        "chisan-wordmark",
        ink && "chisan-wordmark--ink",
        reverse && "chisan-wordmark--reverse",
        className,
      )}
      role={alt ? "img" : undefined}
      style={style}
    />
  );
}

export function ChisanMark({
  alt = "chisan",
  className,
  ink = false,
}: BrandImageProps) {
  const asset = ink ? CHISAN_MARK_INK_SRC : CHISAN_MARK_SRC;
  const style: BrandAssetStyle = {
    "--chisan-brand-asset": `url("${asset}")`,
  };

  return (
    <span
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={classNames(
        "chisan-mark",
        ink && "chisan-mark--ink",
        className,
      )}
      role={alt ? "img" : undefined}
      style={style}
    />
  );
}

export { ChisanMascot, type MascotState } from "./chisan-mascot";

