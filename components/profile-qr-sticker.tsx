import { CHISAN_QR_COLORS, ChisanQrCodeMarks } from "@/components/brand/chisan-qr-code";
import { CHISAN_WORDMARK_INK_SRC, CHISAN_WORDMARK_SRC } from "@/lib/brand";
import { buildBrandQr } from "@/lib/brand-qr";
import {
  estimateProfileQrLabelFontSize,
  PROFILE_QR_STICKER as S,
  type ProfileQrKind,
} from "@/lib/profile-qr";

/**
 * The printable sticker: forest green for a producer, neutral ink for a
 * selection. `drawProfileQrSticker` paints the same layout into the PNG.
 */
export function ProfileQrSticker({ kind, label, title, value }: {
  kind: ProfileQrKind;
  /** Band text, already uppercased for the locale. */
  label: string;
  title: string;
  value: string;
}) {
  const ink = kind !== "producer";
  const accent = ink ? CHISAN_QR_COLORS.ink : CHISAN_QR_COLORS.moss;
  const qr = buildBrandQr(value);
  const clipId = `profile-qr-sticker-${kind}`;

  return (
    <svg
      className="profile-qr__sticker"
      viewBox={`0 0 ${S.width} ${S.height}`}
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={S.width} height={S.height} rx={S.radius} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width={S.width} height={S.height} fill="#ffffff" />
        <rect y={S.bandTop} width={S.width} height={S.height - S.bandTop} fill={accent} />
      </g>
      <rect
        x={S.frame / 2}
        y={S.frame / 2}
        width={S.width - S.frame}
        height={S.height - S.frame}
        rx={S.radius - S.frame / 2}
        fill="none"
        stroke={accent}
        strokeWidth={S.frame}
      />
      <image href={ink ? CHISAN_WORDMARK_INK_SRC : CHISAN_WORDMARK_SRC} {...S.wordmark} />
      <line
        x1={S.divider.x1}
        x2={S.divider.x2}
        y1={S.divider.y}
        y2={S.divider.y}
        stroke={accent}
        strokeOpacity={0.35}
        strokeWidth={3}
      />
      <svg
        x={S.code.x}
        y={S.code.y}
        width={S.code.size}
        height={S.code.size}
        viewBox={`0 0 ${qr.size} ${qr.size}`}
      >
        <ChisanQrCodeMarks qr={qr} ink={ink} />
      </svg>
      <text
        x={S.width / 2}
        y={S.label.y}
        fill="#ffffff"
        fontSize={estimateProfileQrLabelFontSize(label)}
        fontWeight={S.label.fontWeight}
        letterSpacing={S.label.tracking}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </svg>
  );
}
