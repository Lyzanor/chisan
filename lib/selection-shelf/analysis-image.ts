import sharp from "sharp";

/** Temporary visual coordinates for inference; the owner's stored photo stays intact. */
export async function shelfAnalysisImage(image: Buffer) {
  const { width, height } = await sharp(image).metadata();
  if (!width || !height) throw new Error("Shelf image dimensions unavailable");
  const font = Math.max(14, Math.round(Math.min(width, height) * 0.016));
  const inset = font * 0.25;
  const marks: string[] = [];
  for (let step = 0; step <= 10; step++) {
    const value = (step / 10).toFixed(1);
    const x = (width - 1) * step / 10;
    const y = (height - 1) * step / 10;
    marks.push(`<path d="M${x} 0V${height} M0 ${y}H${width}" fill="none" stroke="#00bcd4" stroke-width="2" opacity="0.65"/>`);
    const anchor = step === 0 ? "start" : step === 10 ? "end" : "middle";
    const labelX = Math.max(inset, Math.min(width - inset, x));
    const labelY = Math.max(font, Math.min(height - inset, y));
    marks.push(`<text x="${labelX}" y="${font}" text-anchor="${anchor}">x=${value}</text>`);
    marks.push(`<text x="${inset}" y="${labelY}">y=${value}</text>`);
    if (step > 0) marks.push(`<text x="${width - inset}" y="${labelY}" text-anchor="end">y=${value}</text>`);
  }
  const grid = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g font-family="sans-serif" font-size="${font}" font-weight="700" fill="#003642" stroke="white" stroke-width="3" paint-order="stroke fill">${marks.join("")}</g></svg>`);
  const bytes = await sharp(image).composite([{ input: grid }]).webp({ quality: 90 }).toBuffer();
  return { bytes, width, height };
}
