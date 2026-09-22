import type { CSSProperties } from "react";

export type MascotState =
  | "404"
  | "search"
  | "following"
  | "catalog"
  | "feedback"
  | "gallery"
  | "idle";

type ChisanMascotProps = Readonly<{
  state?: MascotState;
  className?: string;
  size?: number;
  alt?: string;
}>;

export function ChisanMascot({
  state = "idle",
  className,
  size = 88,
  alt = "Mascota Chisan",
}: ChisanMascotProps) {
  const containerClasses = [
    "chisan-mascot",
    `chisan-mascot--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    "--chisan-mascot-size": `${size}px`,
  } as CSSProperties;

  return (
    <div
      className={containerClasses}
      style={style}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <svg
        className="chisan-mascot__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse
          className={`chisan-mascot__shadow chisan-mascot__shadow--${state}`}
          cx="50"
          cy="84"
          rx="26"
          ry="5"
        />

        {state === "search" ? (
          <>
            <g className="chisan-mascot__body chisan-mascot__body--search">
              <rect
                className="chisan-mascot__cube"
                x="22"
                y="22"
                width="56"
                height="52"
                rx="10"
                ry="10"
              />
              <g className="chisan-mascot__eyes chisan-mascot__eyes--search">
                <circle cx="43" cy="46" r="3.2" />
                <circle cx="58" cy="46" r="3.2" />
              </g>
            </g>
            <path
              className="chisan-mascot__horizon-mask"
              d="M 0,72 Q 50,68 100,72 L 100,100 L 0,100 Z"
            />
            <path
              className="chisan-mascot__horizon-line"
              d="M 6,72 Q 50,68 94,72"
            />
          </>
        ) : (
          <g className={`chisan-mascot__body chisan-mascot__body--${state}`}>
            <rect
              className="chisan-mascot__cube"
              x="22"
              y="24"
              width="56"
              height="52"
              rx="10"
              ry="10"
            />
            <g className={`chisan-mascot__eyes chisan-mascot__eyes--${state}`}>
              <circle cx="43" cy="50" r="3.2" />
              <circle cx="58" cy="50" r="3.2" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
