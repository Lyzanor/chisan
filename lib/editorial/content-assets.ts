import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import type { ProducerContent } from "../catalog/content-schema";
import { detectImage } from "../catalog/image-metadata.mjs";

export async function validateContentAssets(
  content: ProducerContent,
  root = process.cwd(),
  prepared: ReadonlyMap<string, Buffer> = new Map(),
): Promise<void> {
  const publicRoot = await realpath(path.join(root, "public"));
  for (const media of content.gallery) {
    const ready = prepared.get(media.src);
    const asset = ready ? path.join(publicRoot, media.src.slice(1)) : await realpath(path.join(publicRoot, media.src.slice(1)));
    if (!asset.startsWith(`${publicRoot}${path.sep}`))
      throw new Error(`Asset escapes public/: ${media.src}`);
    const info = ready ? { size: ready.length, isFile: () => true } : await stat(asset);
    if (!info.isFile() || info.size > 5 * 1024 * 1024)
      throw new Error(`Invalid or oversized content asset: ${media.src}`);
    const metadata = detectImage(ready ?? await readFile(asset));
    const extension = path.extname(asset).slice(1).replace("jpg", "jpeg");
    if (
      !metadata ||
      metadata.type !== extension ||
      metadata.width !== media.width ||
      metadata.height !== media.height
    ) {
      throw new Error(
        `Image format/dimensions do not match reviewed metadata: ${media.src}`,
      );
    }
  }
}
