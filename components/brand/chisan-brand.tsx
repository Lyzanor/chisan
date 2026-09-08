import type { CSSProperties } from "react";

import { CHISAN_MARK_SRC, CHISAN_WORDMARK_SRC } from "@/lib/brand";

type BrandImageProps = Readonly<{
  alt?: string;
  className?: string;
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
  reverse = false,
}: BrandImageProps) {
  const style: BrandAssetStyle = {
    "--chisan-brand-asset": `url("${CHISAN_WORDMARK_SRC}")`,
  };

  return (
    <span
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={classNames(
        "chisan-wordmark",
        reverse && "chisan-wordmark--reverse",
        className,
      )}
      role={alt ? "img" : undefined}
      style={style}
    />
  );
}

export function ChisanMark({ alt = "chisan", className }: BrandImageProps) {
  const style: BrandAssetStyle = {
    "--chisan-brand-asset": `url("${CHISAN_MARK_SRC}")`,
  };

  return (
    <span
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={classNames("chisan-mark", className)}
      role={alt ? "img" : undefined}
      style={style}
    />
  );
}
