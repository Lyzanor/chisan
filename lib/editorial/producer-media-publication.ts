import { createHash, randomUUID } from "node:crypto";
import {
  link,
  mkdir,
  open,
  readFile,
  realpath,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import type { PreparedMediaReference } from "../accounts/producer-media-policy";
import {
  PRODUCER_MEDIA_LIMITS,
  preparedMediaSrc,
} from "../accounts/producer-media-policy";
import { detectImage } from "../catalog/image-metadata.mjs";
import { assertGitPathClean, repoRelativePath } from "./git-state";

export type PreparedImageReader = (
  reference: PreparedMediaReference,
) => Promise<Buffer>;
export const imageDigest = (bytes: Buffer) =>
  createHash("sha256").update(bytes).digest("hex");

/** No writes until the caller holds the producer's publication lease and content lock. */
export async function prepareMediaPublication(
  country: string,
  producerId: number,
  uploads: PreparedMediaReference[],
  readUpload: PreparedImageReader | undefined,
  root: string,
  resume: boolean,
) {
  const assets: {
    target: string;
    src: string;
    bytes: Buffer;
    sha256: string;
    existed: boolean;
    wrote: boolean;
  }[] = [];
  for (const upload of uploads) {
    const src = preparedMediaSrc(country, producerId, upload.sha256);
    const target = path.join(root, "public", src);
    let existing: Buffer | null = null;
    try {
      existing = await readFile(target);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const bytes = existing ?? (readUpload ? await readUpload(upload) : null);
    if (!bytes || imageDigest(bytes) !== upload.sha256)
      throw new Error(`Missing or changed prepared image: ${src}`);
    const metadata = detectImage(bytes);
    if (
      bytes.length > PRODUCER_MEDIA_LIMITS.preparedBytes ||
      metadata?.type !== "webp" ||
      metadata.width !== upload.width ||
      metadata.height !== upload.height
    )
      throw new Error(
        `Prepared image no longer matches its reviewed dimensions: ${src}`,
      );
    if (existing) {
      try {
        assertGitPathClean(target, root);
      } catch (error) {
        if (!resume) throw error;
      }
    } else assertGitPathClean(target, root, true);
    assets.push({
      target,
      src,
      bytes,
      sha256: upload.sha256,
      existed: Boolean(existing),
      wrote: false,
    });
  }
  return {
    prepared: new Map(assets.map((asset) => [asset.src, asset.bytes])),
    paths: assets.map((asset) => ({
      relativePath: repoRelativePath(asset.target, root),
      sha256: asset.sha256,
    })),
    async write() {
      for (const asset of assets) {
        if (asset.existed) continue;
        const directory = path.dirname(asset.target);
        await mkdir(directory, { recursive: true });
        if (
          (await realpath(directory)) !==
          path.join(
            await realpath(root),
            "public/productores",
            country,
            "content",
            String(producerId),
          )
        )
          throw new Error("The image directory escapes the repository.");
        const temporary = `${asset.target}.${randomUUID()}.tmp`;
        const handle = await open(temporary, "wx", 0o644);
        try {
          await handle.writeFile(asset.bytes);
          await handle.sync();
          await handle.close();
          // link is atomic and never replaces a competing file, including a symlink.
          await link(temporary, asset.target);
          asset.wrote = true;
        } finally {
          await handle.close().catch(() => {});
          await unlink(temporary).catch(() => {});
        }
      }
    },
    async assertCurrent() {
      for (const asset of assets) {
        const resolved = await realpath(asset.target);
        if (resolved !== path.join(await realpath(root), "public", asset.src))
          throw new Error("Image path changed during publication.");
        if (imageDigest(await readFile(asset.target)) !== asset.sha256)
          throw new Error("Image bytes changed during publication.");
      }
    },
    async restore() {
      for (const asset of [...assets].reverse()) {
        if (!asset.wrote) continue;
        if (imageDigest(await readFile(asset.target)) !== asset.sha256)
          throw new Error(
            "Image restoration refused: a concurrent edit changed its bytes.",
          );
        await unlink(asset.target);
        asset.wrote = false;
      }
    },
  };
}
