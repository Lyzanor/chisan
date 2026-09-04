import { validateContentAssets } from "./content-assets";
import { createHash, randomUUID } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  unlink,
} from "node:fs/promises";
import path from "node:path";

import { producerContentPath } from "../catalog/content";
import {
  producerContentSchema,
  PRODUCER_CONTENT_LIMITS,
  type ProducerContent,
} from "../catalog/content-schema";
import { findProducerById } from "../catalog/producers";
import { assertGitPathClean } from "./git-state";

export async function contentRevision(filePath: string): Promise<string> {
  try {
    return createHash("sha256")
      .update(await readFile(filePath))
      .digest("hex");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    )
      return "absent";
    throw error;
  }
}

export async function validateProducerContent(
  content: ProducerContent,
  root = process.cwd(),
): Promise<void> {
  producerContentSchema.parse(content);
  if (!(await findProducerById(content.country, content.producer_id)))
    throw new Error("Related content requires an existing canonical producer.");
  await validateContentAssets(content, root);
}

/** Local reviewed publication; one producer package is the atomic edit unit. */
export async function applyProducerContent(
  content: ProducerContent,
  expectedRevision: string,
  root = process.cwd(),
): Promise<string> {
  if (!/^(?:absent|[a-f0-9]{64})$/.test(expectedRevision))
    throw new Error(
      "Supply the exact revision reported by show, or 'absent' for a new package.",
    );
  const validated = producerContentSchema.parse(content);
  const serialized = `${JSON.stringify(validated, null, 2)}\n`;
  if (Buffer.byteLength(serialized) > PRODUCER_CONTENT_LIMITS.bytes) {
    throw new Error("Formatted producer content exceeds the file-size limit.");
  }
  await validateProducerContent(validated, root);
  const target = producerContentPath(
    content.country,
    content.producer_id,
    root,
  );
  await mkdir(path.dirname(target), { recursive: true });
  const resolvedRoot = await realpath(root);
  const resolvedDirectory = await realpath(path.dirname(target));
  if (
    resolvedDirectory !==
    path.join(resolvedRoot, "data/content", content.country)
  ) {
    throw new Error(
      "Content directory must be inside the repository without symlink redirects.",
    );
  }
  const lockPath = `${target}.lock`;
  const lock = await open(lockPath, "wx", 0o600);
  const temporary = `${target}.${randomUUID()}.tmp`;
  try {
    assertGitPathClean(target, root, expectedRevision === "absent");
    if ((await contentRevision(target)) !== expectedRevision)
      throw new Error(
        "Content changed since review. Read the current package and review again.",
      );
    const handle = await open(temporary, "wx", 0o644);
    try {
      await handle.writeFile(serialized);
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(temporary, target);
    return target;
  } finally {
    await unlink(temporary).catch(() => undefined);
    await lock.close();
    await unlink(lockPath);
  }
}
