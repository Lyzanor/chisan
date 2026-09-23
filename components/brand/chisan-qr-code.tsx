"use client";

import { QRCodeCanvas } from "qrcode.react";
import type { Ref } from "react";
import { CHISAN_MARK_INK_SRC, CHISAN_MARK_SRC, PROFILE_QR_MARK_SIZE } from "@/lib/brand";

/** The same scannable code and supplied C in previews and downloaded labels. */
export function ChisanQrCode({ value, size = 176, ink = false, title, canvasRef }: {
  value: string; size?: number; ink?: boolean; title?: string; canvasRef?: Ref<HTMLCanvasElement>;
}) {
  return <QRCodeCanvas
    ref={canvasRef}
    value={value}
    size={size}
    level="H"
    marginSize={4}
    bgColor="#ffffff"
    fgColor={ink ? "#18221c" : "#00563f"}
    imageSettings={{ src: ink ? CHISAN_MARK_INK_SRC : CHISAN_MARK_SRC, width: size * PROFILE_QR_MARK_SIZE / 880, height: size * PROFILE_QR_MARK_SIZE / 880, excavate: true }}
    title={title}
    style={{ height: "auto", width: "100%" }}
  />;
}
