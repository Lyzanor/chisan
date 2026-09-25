import { buildBrandQr } from "@/lib/brand-qr";
import {
  PROFILE_QR_LABEL_HEIGHT,
  PROFILE_QR_LABEL_SCALE,
  PROFILE_QR_LABEL_WIDTH,
  PROFILE_QR_STICKER as S,
} from "@/lib/profile-qr";

export type ProfileQrStickerDrawing = Readonly<{
  accent: string;
  /** Band text, already uppercased for the locale. */
  label: string;
  value: string;
  fontFamily: string;
  wordmark: CanvasImageSource;
  mark: CanvasImageSource;
}>;

/**
 * Paints the `ProfileQrSticker` layout at print resolution. Outside the rounded
 * corners stays transparent so the PNG keeps the sticker's own shape.
 */
export function drawProfileQrSticker(drawing: ProfileQrStickerDrawing): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = PROFILE_QR_LABEL_WIDTH;
  canvas.height = PROFILE_QR_LABEL_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable.");
  context.scale(PROFILE_QR_LABEL_SCALE, PROFILE_QR_LABEL_SCALE);

  const outline = new Path2D();
  outline.roundRect(0, 0, S.width, S.height, S.radius);
  context.save();
  context.clip(outline);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, S.width, S.height);
  context.fillStyle = drawing.accent;
  context.fillRect(0, S.bandTop, S.width, S.height - S.bandTop);
  context.restore();

  context.strokeStyle = drawing.accent;
  context.lineWidth = S.frame;
  context.beginPath();
  context.roundRect(
    S.frame / 2,
    S.frame / 2,
    S.width - S.frame,
    S.height - S.frame,
    S.radius - S.frame / 2,
  );
  context.stroke();

  context.drawImage(
    drawing.wordmark,
    S.wordmark.x,
    S.wordmark.y,
    S.wordmark.width,
    S.wordmark.height,
  );

  context.save();
  context.globalAlpha = 0.35;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(S.divider.x1, S.divider.y);
  context.lineTo(S.divider.x2, S.divider.y);
  context.stroke();
  context.restore();

  const qr = buildBrandQr(drawing.value);
  context.save();
  context.translate(S.code.x, S.code.y);
  context.scale(S.code.size / qr.size, S.code.size / qr.size);
  context.fillStyle = drawing.accent;
  context.fill(new Path2D(qr.modulesPath));
  context.fill(new Path2D(qr.findersPath));
  context.drawImage(drawing.mark, qr.mark.offset, qr.mark.offset, qr.mark.size, qr.mark.size);
  context.restore();

  let fontSize: number = S.label.fontSize;
  const fitFont = () => {
    context.font = `${S.label.fontWeight} ${fontSize}px ${drawing.fontFamily}`;
    context.letterSpacing = `${S.label.tracking}px`;
  };
  fitFont();
  const width = context.measureText(drawing.label).width;
  if (width > S.label.maxWidth) {
    fontSize = Math.floor((fontSize * S.label.maxWidth) / width);
    fitFont();
  }
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(drawing.label, S.width / 2, S.label.y);

  return canvas;
}
