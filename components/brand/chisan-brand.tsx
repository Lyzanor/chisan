import type { CSSProperties } from "react";

import chisanMark from "@/design/brand/assets/chisan-mark-ink.png";
import chisanWordmark from "@/design/brand/assets/chisan-wordmark-ink.png";

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
    "--chisan-brand-asset": `url("${chisanWordmark.src}")`,
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
    "--chisan-brand-asset": `url("${chisanMark.src}")`,
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
