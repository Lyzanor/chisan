import { createHash } from "node:crypto";
import sharp from "sharp";
import type { InboundMessage } from "./domain";
import type { WhatsAppConfig } from "./config";

export async function boundedBytes(
  response: Response,
  limit: number,
): Promise<Buffer> {
  if (Number(response.headers.get("content-length")) > limit || !response.body)
    throw new Error("Payload too large");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error("Payload too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks);
}
export function safeMetaMediaUrl(value: string) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.hostname !== "lookaside.fbsbx.com"
  )
    throw new Error("Invalid Meta media URL");
  return url;
}
export async function downloadImage(
  image: NonNullable<InboundMessage["image"]>,
  config: WhatsAppConfig,
  fetcher: typeof fetch = fetch,
) {
  const headers = { Authorization: `Bearer ${config.accessToken}` };
  const metadata = await fetcher(
    `https://graph.facebook.com/${config.version}/${image.id}?phone_number_id=${config.phoneId}`,
    { headers, redirect: "error", signal: AbortSignal.timeout(10_000) },
  );
  if (!metadata.ok) throw new Error("Media unavailable");
  const info = await metadata.json();
  if (
    Number(info.file_size) > 5 * 1024 * 1024 ||
    !["image/jpeg", "image/png"].includes(info.mime_type)
  )
    throw new Error("Unsupported image");
  const response = await fetcher(safeMetaMediaUrl(info.url), {
    headers,
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Media unavailable");
  const bytes = await boundedBytes(response, 5 * 1024 * 1024);
  const hash = createHash("sha256").update(bytes);
  const hex = hash.digest("hex");
  const base64 = Buffer.from(hex, "hex").toString("base64");
  for (const expected of [image.sha256, info.sha256])
    if (expected && expected !== hex && expected !== base64)
      throw new Error("Media checksum mismatch");
  const decoder = sharp(bytes, {
    limitInputPixels: 25_000_000,
    animated: false,
  });
  const actual = await decoder.metadata();
  if (!["jpeg", "png"].includes(actual.format ?? "") || (actual.pages ?? 1) > 1)
    throw new Error("Unsupported image");
  // Strip metadata and bound image size before sharing it with the model. No public upload.
  return decoder
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}
export async function sendReply(
  to: string,
  text: string,
  config: WhatsAppConfig,
  fetcher: typeof fetch = fetch,
) {
  const response = await fetcher(
    `https://graph.facebook.com/${config.version}/${config.phoneId}/messages`,
    {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body: text.slice(0, 4096) },
      }),
    },
  );
  if (!response.ok) throw new Error("WhatsApp delivery failed");
}
