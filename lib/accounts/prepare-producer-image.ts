import { createHash } from "node:crypto";
import sharp from "sharp";
import { PRODUCER_MEDIA_LIMITS } from "./producer-media-policy";

export class ProducerImageError extends Error {
  constructor(public code: "size" | "format" | "dimensions" | "invalid") {
    super(code);
  }
}

/** Decode actual pixels before accepting anything; never preserve EXIF/GPS or originals. */
export async function prepareProducerImage(input: Buffer) {
  if (!input.length || input.length > PRODUCER_MEDIA_LIMITS.inputBytes)
    throw new ProducerImageError("size");
  // Reject SVG and other active/unsupported formats before invoking a decoder.
  const jpeg = input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
  const png = input
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp =
    input.toString("ascii", 0, 4) === "RIFF" &&
    input.toString("ascii", 8, 12) === "WEBP";
  if (!jpeg && !png && !webp) throw new ProducerImageError("format");
  try {
    const image = sharp(input, {
      limitInputPixels: PRODUCER_MEDIA_LIMITS.pixels,
      failOn: "warning",
    });
    const metadata = await image.metadata();
    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width < 200 ||
      metadata.height < 200 ||
      metadata.width > 10000 ||
      metadata.height > 10000
    )
      throw new ProducerImageError("dimensions");
    if ((metadata.pages ?? 1) > 1) throw new ProducerImageError("format");
    const { data, info } = await image
      .rotate()
      .resize({
        width: PRODUCER_MEDIA_LIMITS.edge,
        height: PRODUCER_MEDIA_LIMITS.edge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .timeout({ seconds: 10 })
      .toBuffer({ resolveWithObject: true });
    if (info.width < 200 || info.height < 200)
      throw new ProducerImageError("dimensions");
    if (data.length > PRODUCER_MEDIA_LIMITS.preparedBytes)
      throw new ProducerImageError("size");
    return {
      bytes: data,
      sha256: createHash("sha256").update(data).digest("hex"),
      width: info.width,
      height: info.height,
    };
  } catch (error) {
    if (error instanceof ProducerImageError) throw error;
    throw new ProducerImageError("invalid");
  }
}
