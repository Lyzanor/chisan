import sharp from "sharp";

export const AVATAR_INPUT_BYTES = 4 * 1024 * 1024;
export class AvatarImageError extends Error {}

/** Decode pixels, orient, crop and discard original metadata (including GPS). */
export async function prepareAvatarImage(input: Buffer): Promise<Buffer> {
  if (!input.length || input.length > AVATAR_INPUT_BYTES)
    throw new AvatarImageError("size");
  const jpeg = input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
  const png = input
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp =
    input.toString("ascii", 0, 4) === "RIFF" &&
    input.toString("ascii", 8, 12) === "WEBP";
  if (!jpeg && !png && !webp) throw new AvatarImageError("format");
  try {
    const image = sharp(input, {
      limitInputPixels: 25_000_000,
      failOn: "warning",
    });
    const meta = await image.metadata();
    if (!meta.width || !meta.height || (meta.pages ?? 1) > 1)
      throw new AvatarImageError("format");
    const bytes = await image
      .rotate()
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 82 })
      .timeout({ seconds: 5 })
      .toBuffer();
    if (bytes.length > 131072) throw new AvatarImageError("size");
    return bytes;
  } catch (error) {
    if (error instanceof AvatarImageError) throw error;
    throw new AvatarImageError("invalid");
  }
}

export function trustedProviderAvatarUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    // Only provider-owned image endpoints; no arbitrary URL ingestion or redirects.
    if (url.protocol !== "https:" || url.port || url.username || url.password)
      return null;
    if (
      url.hostname !== "img.clerk.com" &&
      !/^lh[3-6]\.googleusercontent\.com$/.test(url.hostname)
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export async function readAvatarBody(
  body: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > AVATAR_INPUT_BYTES) {
        await reader.cancel();
        throw new AvatarImageError("size");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
