import { buildBrandQr, type BrandQr } from "@/lib/brand-qr";
import { CHISAN_MARK_INK_SRC, CHISAN_MARK_SRC } from "@/lib/brand";

export const CHISAN_QR_COLORS = { moss: "#00563f", ink: "#18221c" } as const;

/** Scannable code with the Chisan C finders and the supplied C at its centre. */
export function ChisanQrCode({ value, ink = false, title }: {
  value: string; ink?: boolean; title?: string;
}) {
  const qr = buildBrandQr(value);

  return (
    <svg
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ display: "block", height: "auto", width: "100%" }}
    >
      <ChisanQrCodeMarks qr={qr} ink={ink} />
    </svg>
  );
}

/** The code's shapes in module units, for nesting inside a larger SVG label. */
export function ChisanQrCodeMarks({ qr, ink = false }: { qr: BrandQr; ink?: boolean }) {
  const color = ink ? CHISAN_QR_COLORS.ink : CHISAN_QR_COLORS.moss;

  return (
    <>
      <path d={qr.modulesPath} fill={color} shapeRendering="crispEdges" />
      <path d={qr.findersPath} fill={color} />
      <image
        href={ink ? CHISAN_MARK_INK_SRC : CHISAN_MARK_SRC}
        x={qr.mark.offset}
        y={qr.mark.offset}
        width={qr.mark.size}
        height={qr.mark.size}
      />
    </>
  );
}
