import { mkdir, open, readFile, realpath, unlink } from "node:fs/promises";
import path from "node:path";

import {
  hashProducerContent,
  resolveProducerContentChange,
  serializeProducerContent,
} from "../accounts/producer-content-change";
import {
  emptyProducerContent,
  producerContentSchema,
} from "../catalog/content-schema";
import { producerContentPath } from "../catalog/content";
import { atomicWriteUtf8 } from "./atomic-file";
import {
  assertGitPathClean,
  readCommitBlob,
  repoRelativePath,
} from "./git-state";
import { validateContentAssets } from "./content-assets";

export class ProducerContentConflictError extends Error {}

export async function readOptionalContent(
  filePath: string,
): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function prepareContentPublication(
  value: unknown,
  country: string,
  producerId: number,
  resumeSource: string | null = null,
  root = process.cwd(),
) {
  const { change, requested } = resolveProducerContentChange(
    value,
    country,
    producerId,
  );
  await validateContentAssets(requested, root);
  const target = producerContentPath(country, producerId, root);
  const relativePath = repoRelativePath(target, root);
  const original = await readOptionalContent(target);
  const current =
    original === null
      ? emptyProducerContent(country, producerId)
      : producerContentSchema.parse(JSON.parse(original));
  const currentHash = hashProducerContent(current);
  if (currentHash !== change.baseHash && currentHash !== change.requestedHash)
    throw new ProducerContentConflictError(
      "The product package changed after this proposal was submitted.",
    );
  const serialized = serializeProducerContent(requested);
  try {
    assertGitPathClean(target, root, original === null);
  } catch (error) {
    if (!resumeSource || original !== serialized) throw error;
    let source: string | null;
    try {
      source = readCommitBlob(resumeSource, relativePath, root);
    } catch {
      source = null;
    }
    const sourceContent =
      source === null
        ? emptyProducerContent(country, producerId)
        : producerContentSchema.parse(JSON.parse(source));
    if (
      ![change.baseHash, change.requestedHash].includes(
        hashProducerContent(sourceContent),
      )
    )
      throw error;
  }
  let wrote = false;
  return {
    target,
    relativePath,
    original,
    serialized,
    requested,
    hash: change.requestedHash,
    alreadyPresent: currentHash === change.requestedHash,
    async lock() {
      await mkdir(path.dirname(target), { recursive: true });
      if (
        (await realpath(path.dirname(target))) !==
        path.join(await realpath(root), "data/content", country)
      )
        throw new Error(
          "The product directory is not contained in this repository.",
        );
      const lockPath = `${target}.lock`;
      const handle = await open(lockPath, "wx", 0o600);
      return async () => {
        await handle.close();
        await unlink(lockPath);
      };
    },
    async write() {
      if ((await readOptionalContent(target)) !== original)
        throw new ProducerContentConflictError(
          "The product package changed before writing.",
        );
      if (currentHash !== change.requestedHash) {
        await atomicWriteUtf8(target, serialized, original === null);
        wrote = true;
      }
    },
    async assertCurrent() {
      if (
        (await readOptionalContent(target)) !== (wrote ? serialized : original)
      )
        throw new ProducerContentConflictError(
          "The product package changed during publication.",
        );
      await validateContentAssets(requested, root);
    },
    async restore() {
      if (!wrote) return;
      if ((await readOptionalContent(target)) !== serialized)
        throw new Error(
          "Product restoration refused because the package changed concurrently.",
        );
      if (original === null) await unlink(target);
      else await atomicWriteUtf8(target, original);
    },
  };
}
